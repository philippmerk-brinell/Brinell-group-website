# Aeternum Data Platform

Persönliche Gesundheitsdaten-Plattform: Oura-Daten landen täglich in Supabase Postgres,
ein Remote-MCP-Server (Cloudflare Worker) gibt Claude in jedem Chat — auch mobil —
Live-Zugriff auf die Kennzahlen. Erweiterbar um Blutwerte, Körperkomposition und
FITIV-/Apple-Health-Workouts.

```
Oura API v2 ──(GitHub Actions cron, täglich 05:30 UTC)──> Supabase Postgres (EU)
                                                                │
Claude (alle Clients) ──> Custom Connector ──> CF Worker MCP ───┘ (read-only)
```

## Repo-Struktur

```
migrations/001_init.sql        Datenbank-Schema (Tabellen + View daily_summary)
sync/sync.py                   Täglicher Sync (letzte 14 Tage, idempotenter Upsert)
sync/backfill.py               Einmaliger Backfill der Historie (--days 400)
.github/workflows/sync.yml     Cron 05:30 UTC, öffnet GitHub Issue bei Fehler
.github/workflows/backfill.yml Backfill via workflow_dispatch
mcp-server/                    TypeScript Cloudflare Worker (MCP, Streamable HTTP)
```

## MCP-Tools

| Tool | Zweck |
|---|---|
| `get_daily_summary(start_date, end_date)` | Tageswerte aus der View `daily_summary` |
| `get_trend(metric, days)` | Zeitreihe + 7d-Schnitt + Delta vs. Baseline (HRV 31 / RHR 58, konfigurierbar) |
| `get_workouts(start_date, end_date)` | Oura- und externe Workouts |
| `training_light(date)` | Trainingsampel GRÜN/GELB/ROT mit Begründung + Empfehlung |
| `query(sql)` | Beliebiges SELECT (nur SELECT, max. 500 Zeilen, read-only-Rolle) |

**Ampel-Logik** (Baselines in `mcp-server/wrangler.toml` unter `[vars]`):

| Farbe | Bedingung | Empfehlung |
|---|---|---|
| 🟢 GRÜN | HRV ≥ 7d-Schnitt UND RHR ≤ Baseline+2 | Volle Belastung, Hyrox-Intensität |
| 🟡 GELB | HRV 10–20 % unter 7d-Schnitt ODER RHR Baseline+3/4 ODER Readiness < 70 | Zone 2, Technik, Mobility |
| 🔴 ROT | HRV ≥ 20 % unter 7d-Schnitt ODER RHR ≥ Baseline+5 | Regeneration |

---

## Deployment in 5 Schritten

### 1. Supabase-Projekt anlegen und Schema einspielen

1. Auf [supabase.com](https://supabase.com) neues Projekt anlegen — Region **EU (Frankfurt) / eu-central-1**.
2. Im **SQL Editor** den kompletten Inhalt von [`migrations/001_init.sql`](migrations/001_init.sql) ausführen.
3. Read-only-Rolle für den MCP-Server anlegen. Passwort lokal generieren:

   ```bash
   openssl rand -hex 24
   ```

   Dann im SQL Editor (Passwort einsetzen):

   ```sql
   create role mcp_reader login password '<MCP_READER_PASSWORD>';
   grant usage on schema public to mcp_reader;
   grant select on all tables in schema public to mcp_reader;
   alter default privileges in schema public grant select on tables to mcp_reader;
   alter role mcp_reader set default_transaction_read_only = on;
   alter role mcp_reader set statement_timeout = '10s';
   ```

4. Notieren: `SUPABASE_URL` (`https://<project-ref>.supabase.co`), den **service_role**-Key
   (Project Settings → API) und den Pooler-Host (Project Settings → Database →
   Connection String → Transaction Mode, Port 6543).

### 2. GitHub-Repo einrichten und Backfill starten

1. Dieses Repo nach GitHub pushen.
2. Repository-Secrets setzen (Settings → Secrets and variables → Actions):

   | Secret | Wert |
   |---|---|
   | `OURA_TOKEN` | Oura Personal Access Token ([cloud.ouraring.com/personal-access-tokens](https://cloud.ouraring.com/personal-access-tokens)) |
   | `SUPABASE_URL` | `https://<project-ref>.supabase.co` |
   | `SUPABASE_SERVICE_KEY` | service_role-Key aus Schritt 1 |

3. Backfill einmalig ausführen: **Actions → Oura Backfill → Run workflow** (Default: 400 Tage).
4. Der tägliche Sync (**Oura Sync**, 05:30 UTC) läuft ab jetzt automatisch; bei Fehlern
   wird automatisch ein GitHub Issue geöffnet.

### 3. MCP-Server auf Cloudflare deployen

```bash
cd mcp-server
npm install
npx wrangler login

# Bearer-Token generieren und notieren (wird in Schritt 4 gebraucht):
openssl rand -hex 32

# Secrets setzen:
npx wrangler secret put MCP_BEARER_TOKEN
# → das generierte Token einfügen

npx wrangler secret put MCP_DB_URL
# → postgresql://mcp_reader.<project-ref>:<MCP_READER_PASSWORD>@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
#   (Host/Port aus Supabase → Database → Connection String → Transaction Mode;
#    Username-Format beim Pooler: mcp_reader.<project-ref>)

npm run deploy
# → Worker-URL notieren, z.B. https://aeternum-mcp.<account>.workers.dev
```

Die Baselines für die Trainingsampel stehen in `wrangler.toml` (`HRV_BASELINE=31`,
`RHR_BASELINE=58`) und können dort angepasst werden (danach erneut `npm run deploy`).

### 4. Claude Custom Connector einrichten

1. Claude → **Einstellungen → Connectors → Custom Connector hinzufügen**
2. URL: `https://aeternum-mcp.<account>.workers.dev/mcp`
3. Authentifizierung: **Bearer-Token** aus Schritt 3 eintragen.
4. Connector in den Chat-Einstellungen aktivieren (funktioniert auf Desktop und Mobile).

### 5. Smoke-Test

```bash
WORKER=https://aeternum-mcp.<account>.workers.dev
TOKEN=<MCP_BEARER_TOKEN>

# Health (ohne Auth, liefert keine Daten):
curl -s $WORKER/health

# Ohne Token → muss 401 liefern:
curl -s -o /dev/null -w "%{http_code}\n" -X POST $WORKER/mcp

# Mit Token → MCP-Handshake liefert Server-Info:
curl -s -X POST $WORKER/mcp \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"smoke","version":"1.0"}}}'
```

Danach in Claude fragen: **„Wie ist meine Trainingsampel heute?"** →
`training_light` liefert Farbe, Begründung und Empfehlung.

---

## Lokale Ausführung

```bash
# Sync lokal (Python ≥ 3.11):
pip install -r sync/requirements.txt
export OURA_TOKEN=... SUPABASE_URL=... SUPABASE_SERVICE_KEY=...
python sync/sync.py --days 14        # idempotent: zweiter Lauf → 0 neue Zeilen
python sync/backfill.py --days 400   # Historie

# MCP-Server lokal:
cd mcp-server
npm install
cp .dev.vars.example .dev.vars       # Secrets eintragen
npm run dev                          # http://localhost:8787/mcp
```

## Erweiterungen (vorbereitet)

- **Blutwerte** → Tabelle `bloodwork` (`drawn_at`, `marker`, `value`, `unit`, `ref_low`,
  `ref_high`, `lab`, `raw`). Import z.B. per SQL-Insert oder kleinem Skript; sofort per
  `query`-Tool in Claude auswertbar.
- **FITIV / AirPods-Workouts** → Tabelle `workouts_external` (`source`, `start`,
  `duration_s`, `avg_hr`, `max_hr`, `distance_m`, `raw`). Wird von `get_workouts`
  bereits mit ausgegeben.

## Sicherheit

- Alle Secrets ausschließlich via GitHub Secrets bzw. Wrangler Secrets — nie im Repo.
- Der MCP-Server erreicht die Datenbank nur über die Rolle `mcp_reader`
  (`default_transaction_read_only = on`, `statement_timeout 10s`).
- Das `query`-Tool erlaubt per Regex nur einzelne SELECT-Statements und erzwingt `LIMIT 500`;
  die read-only-Rolle ist die zweite Verteidigungslinie.
- Jeder Request ohne gültiges `Authorization: Bearer <MCP_BEARER_TOKEN>` → **401**.
