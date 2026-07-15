"""Oura API v2 → Supabase Postgres Sync.

Zieht pro Endpoint die letzten N Tage (Default 14), flacht die Datensätze auf
Kernspalten ab und upsertet sie idempotent via Supabase PostgREST
(on_conflict auf den Primary Key). Ein zweiter Lauf erzeugt 0 neue Zeilen.

ENV:
  OURA_TOKEN            Oura Personal Access Token (API v2)
  SUPABASE_URL          https://<project-ref>.supabase.co
  SUPABASE_SERVICE_KEY  Service-Role-Key (nur für den Sync, nie im MCP-Server)

Aufruf:
  python sync.py [--days 14] [--start 2025-01-01 --end 2025-03-31]
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta, timezone
from typing import Any
from zoneinfo import ZoneInfo

import httpx

OURA_BASE = "https://api.ouraring.com/v2"
BERLIN = ZoneInfo("Europe/Berlin")
UPSERT_CHUNK = 500
ID_LOOKUP_CHUNK = 100
MAX_RETRIES = 5


def _get(record: dict, path: str) -> Any:
    """Liest einen (ggf. verschachtelten) Wert per Punkt-Pfad, z.B. 'spo2_percentage.average'."""
    value: Any = record
    for key in path.split("."):
        if not isinstance(value, dict):
            return None
        value = value.get(key)
    return value


@dataclass
class Endpoint:
    name: str                     # Log-Name
    path: str                     # Oura-API-Pfad unterhalb /v2
    table: str                    # Ziel-Tabelle in Postgres
    columns: dict[str, str]       # Zielspalte -> Punkt-Pfad im Oura-Record
    conflict_key: str = "id"      # Primary Key für den Upsert
    day_path: str = "day"         # Quelle für die day-Spalte
    field: dict = field(default_factory=dict)

    def flatten(self, record: dict, synced_at: str) -> dict:
        row: dict[str, Any] = {
            "day": _get(record, self.day_path),
            "raw": record,
            "synced_at": synced_at,
        }
        if self.conflict_key == "id":
            row["id"] = record["id"]
        for column, path in self.columns.items():
            row[column] = _get(record, path)
        return row


ENDPOINTS: list[Endpoint] = [
    Endpoint(
        name="sleep",
        path="/usercollection/sleep",
        table="oura_sleep",
        columns={
            "average_hrv": "average_hrv",
            "average_heart_rate": "average_heart_rate",
            "lowest_heart_rate": "lowest_heart_rate",
            "total_sleep_duration": "total_sleep_duration",
            "deep_sleep_duration": "deep_sleep_duration",
            "rem_sleep_duration": "rem_sleep_duration",
            "efficiency": "efficiency",
            "bedtime_start": "bedtime_start",
            "bedtime_end": "bedtime_end",
        },
    ),
    Endpoint(
        name="daily_readiness",
        path="/usercollection/daily_readiness",
        table="oura_daily_readiness",
        columns={
            "score": "score",
            "temperature_deviation": "temperature_deviation",
        },
    ),
    Endpoint(
        name="daily_activity",
        path="/usercollection/daily_activity",
        table="oura_daily_activity",
        columns={
            "score": "score",
            "steps": "steps",
            "active_calories": "active_calories",
            "total_calories": "total_calories",
        },
    ),
    Endpoint(
        name="daily_resilience",
        path="/usercollection/daily_resilience",
        table="oura_daily_resilience",
        columns={"level": "level"},
    ),
    Endpoint(
        name="daily_spo2",
        path="/usercollection/daily_spo2",
        table="oura_daily_spo2",
        columns={
            "spo2_avg": "spo2_percentage.average",
            "breathing_disturbance_index": "breathing_disturbance_index",
        },
    ),
    Endpoint(
        name="daily_stress",
        path="/usercollection/daily_stress",
        table="oura_daily_stress",
        columns={
            "stress_high": "stress_high",
            "recovery_high": "recovery_high",
            "day_summary": "day_summary",
        },
    ),
    Endpoint(
        name="workouts",
        path="/usercollection/workout",
        table="oura_workouts",
        columns={
            "activity": "activity",
            "intensity": "intensity",
            "calories": "calories",
            "distance": "distance",
            "start_datetime": "start_datetime",
            "end_datetime": "end_datetime",
        },
    ),
    Endpoint(
        name="sessions",
        path="/usercollection/session",
        table="oura_sessions",
        columns={
            "type": "type",
            "start_datetime": "start_datetime",
            "end_datetime": "end_datetime",
            "mood": "mood",
        },
    ),
    Endpoint(
        name="tags",
        path="/usercollection/enhanced_tag",
        table="oura_tags",
        day_path="start_day",
        columns={
            "tag_type_code": "tag_type_code",
            "comment": "comment",
            "start_time": "start_time",
            "end_time": "end_time",
        },
    ),
    Endpoint(
        name="vo2max",
        path="/usercollection/vO2_max",
        table="oura_vo2max",
        columns={"vo2_max": "vo2_max"},
    ),
    Endpoint(
        name="cardio_age",
        path="/usercollection/daily_cardiovascular_age",
        table="oura_cardio_age",
        conflict_key="day",
        columns={"vascular_age": "vascular_age"},
    ),
]


def _request_with_retry(client: httpx.Client, url: str, params: dict) -> httpx.Response:
    """GET mit Retry bei 429/5xx (exponentielles Backoff, Retry-After wird respektiert)."""
    for attempt in range(1, MAX_RETRIES + 1):
        response = client.get(url, params=params)
        if response.status_code < 400:
            return response
        retryable = response.status_code == 429 or response.status_code >= 500
        if not retryable or attempt == MAX_RETRIES:
            response.raise_for_status()
        wait = float(response.headers.get("Retry-After") or min(2 ** attempt, 60))
        print(f"    HTTP {response.status_code} — Retry in {wait:.0f}s (Versuch {attempt}/{MAX_RETRIES})")
        time.sleep(wait)
    raise RuntimeError("unreachable")


def fetch_endpoint(client: httpx.Client, endpoint: Endpoint, start: date, end: date) -> list[dict]:
    """Alle Records eines Endpoints im Zeitraum, Pagination via next_token."""
    records: list[dict] = []
    params: dict[str, str] = {"start_date": start.isoformat(), "end_date": end.isoformat()}
    while True:
        response = _request_with_retry(client, f"{OURA_BASE}{endpoint.path}", params)
        payload = response.json()
        records.extend(payload.get("data", []))
        next_token = payload.get("next_token")
        if not next_token:
            return records
        params = {**params, "next_token": next_token}


class Supabase:
    """Minimaler PostgREST-Client (Upsert + ID-Lookup) auf Basis von httpx."""

    def __init__(self, url: str, service_key: str):
        self.client = httpx.Client(
            base_url=f"{url.rstrip('/')}/rest/v1",
            headers={
                "apikey": service_key,
                "Authorization": f"Bearer {service_key}",
                "Content-Type": "application/json",
            },
            timeout=60,
        )

    def existing_keys(self, table: str, key: str, values: list[str]) -> set[str]:
        found: set[str] = set()
        for i in range(0, len(values), ID_LOOKUP_CHUNK):
            chunk = values[i : i + ID_LOOKUP_CHUNK]
            quoted = ",".join(f'"{v}"' for v in chunk)
            response = _request_with_retry(
                self.client, f"/{table}", {"select": key, key: f"in.({quoted})"}
            )
            found.update(str(row[key]) for row in response.json())
        return found

    def upsert(self, table: str, rows: list[dict], conflict_key: str) -> None:
        for i in range(0, len(rows), UPSERT_CHUNK):
            chunk = rows[i : i + UPSERT_CHUNK]
            for attempt in range(1, MAX_RETRIES + 1):
                response = self.client.post(
                    f"/{table}",
                    params={"on_conflict": conflict_key},
                    headers={"Prefer": "resolution=merge-duplicates,return=minimal"},
                    content=json.dumps(chunk),
                )
                if response.status_code < 400:
                    break
                if response.status_code < 500 or attempt == MAX_RETRIES:
                    raise RuntimeError(
                        f"Upsert in {table} fehlgeschlagen ({response.status_code}): {response.text}"
                    )
                time.sleep(min(2 ** attempt, 60))


def run_sync(start: date, end: date) -> bool:
    """Synct alle Endpoints für [start, end]. Rückgabe: True wenn fehlerfrei."""
    oura_token = os.environ["OURA_TOKEN"]
    supabase = Supabase(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_KEY"])
    synced_at = datetime.now(timezone.utc).isoformat()

    print(f"Sync {start} → {end}")
    ok = True
    with httpx.Client(headers={"Authorization": f"Bearer {oura_token}"}, timeout=60) as oura:
        for endpoint in ENDPOINTS:
            try:
                records = fetch_endpoint(oura, endpoint, start, end)
                rows, seen = [], set()
                for record in records:
                    row = endpoint.flatten(record, synced_at)
                    key = str(row[endpoint.conflict_key])
                    if key in seen:  # PostgREST-Upsert erlaubt keine Duplikate im selben Batch
                        continue
                    seen.add(key)
                    rows.append(row)
                if not rows:
                    print(f"  [{endpoint.name:<16}] fetched=0 neu=0 aktualisiert=0")
                    continue
                keys = [str(row[endpoint.conflict_key]) for row in rows]
                existing = supabase.existing_keys(endpoint.table, endpoint.conflict_key, keys)
                supabase.upsert(endpoint.table, rows, endpoint.conflict_key)
                new = len(keys) - len(existing)
                print(
                    f"  [{endpoint.name:<16}] fetched={len(records)} "
                    f"neu={new} aktualisiert={len(existing)}"
                )
            except Exception as error:  # noqa: BLE001 — ein Endpoint darf die anderen nicht blockieren
                ok = False
                print(f"  [{endpoint.name:<16}] FEHLER: {error}", file=sys.stderr)
    return ok


def main() -> None:
    parser = argparse.ArgumentParser(description="Oura → Supabase Sync")
    parser.add_argument("--days", type=int, default=14, help="Zeitraum in Tagen bis heute (Default 14)")
    parser.add_argument("--start", type=date.fromisoformat, help="Expliziter Startag (YYYY-MM-DD)")
    parser.add_argument("--end", type=date.fromisoformat, help="Expliziter Endtag (YYYY-MM-DD)")
    args = parser.parse_args()

    today = datetime.now(BERLIN).date()
    end = args.end or today
    start = args.start or (end - timedelta(days=args.days))

    if not run_sync(start, end):
        sys.exit(1)


if __name__ == "__main__":
    main()
