"""Einmaliger Backfill der Oura-Historie.

Zerlegt den Gesamtzeitraum in 90-Tage-Fenster (ältestes zuerst) und ruft für
jedes Fenster den regulären Sync auf — dadurch identisches Upsert-Verhalten,
begrenzte Antwortgrößen und saubere Rate-Limit-Behandlung.

Aufruf:
  python backfill.py --days 400
"""

from __future__ import annotations

import argparse
import sys
import time
from datetime import datetime, timedelta

from sync import BERLIN, run_sync

WINDOW_DAYS = 90
PAUSE_BETWEEN_WINDOWS_S = 2


def main() -> None:
    parser = argparse.ArgumentParser(description="Oura → Supabase Backfill")
    parser.add_argument("--days", type=int, default=400, help="Historie in Tagen (Default 400)")
    args = parser.parse_args()

    today = datetime.now(BERLIN).date()
    start = today - timedelta(days=args.days)

    ok = True
    window_start = start
    while window_start <= today:
        window_end = min(window_start + timedelta(days=WINDOW_DAYS - 1), today)
        ok = run_sync(window_start, window_end) and ok
        window_start = window_end + timedelta(days=1)
        if window_start <= today:
            time.sleep(PAUSE_BETWEEN_WINDOWS_S)

    if not ok:
        sys.exit(1)
    print(f"Backfill abgeschlossen: {start} → {today}")


if __name__ == "__main__":
    main()
