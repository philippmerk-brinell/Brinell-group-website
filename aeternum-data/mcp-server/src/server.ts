import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { withDb, type Env } from "./db";

const DATE_SCHEMA = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Datum im Format YYYY-MM-DD erwartet");

const TREND_METRICS = {
  hrv: "hrv",
  rhr: "rhr",
  readiness: "readiness",
  steps: "steps",
  active_calories: "active_calories",
  vascular_age: "vascular_age",
} as const;

type Metric = keyof typeof TREND_METRICS;

const SELECT_ONLY = /^(select|with)\b/i;
const FORBIDDEN_KEYWORDS =
  /\b(insert|update|delete|drop|alter|create|grant|revoke|truncate|copy|vacuum|analyze|call|do|merge|refresh|reindex|comment|lock|set|reset|listen|notify|unlisten|execute|prepare|deallocate|begin|commit|rollback|savepoint|discard|explain)\b/i;

/** Heutiges Datum in Europe/Berlin als YYYY-MM-DD. */
function todayBerlin(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(new Date());
}

function baselines(env: Env) {
  return {
    hrv: Number(env.HRV_BASELINE ?? "31"),
    rhr: Number(env.RHR_BASELINE ?? "58"),
  };
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function round(value: number | null, digits = 1): number | null {
  if (value === null) return null;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

function err(message: string) {
  return { content: [{ type: "text" as const, text: message }], isError: true };
}

export type DaySample = {
  day: string;
  hrv: number | null;
  rhr: number | null;
  readiness: number | null;
};

export type TrainingLight = {
  date: string;
  color: "GRÜN" | "GELB" | "ROT" | null;
  begruendung: string;
  empfehlung: string;
  werte?: {
    hrv: number | null;
    hrv_avg_7d: number | null;
    hrv_delta_pct: number | null;
    rhr: number | null;
    rhr_baseline: number;
    rhr_delta: number | null;
    readiness: number | null;
  };
};

/**
 * Ampel-Logik (pure Funktion, testbar ohne DB):
 * ROT  — HRV ≥ 20 % unter 7d-Schnitt ODER RHR ≥ Baseline+5
 * GELB — HRV 10–20 % unter 7d-Schnitt ODER RHR Baseline+3/4 ODER Readiness < 70
 * GRÜN — sonst (HRV ≥ 7d-Schnitt UND RHR ≤ Baseline+2 = voll erfüllt,
 *         Grenzbereich wird als Hinweis markiert)
 */
export function evaluateTrainingLight(
  rows: DaySample[],
  target: string,
  rhrBaseline: number,
): TrainingLight {
  const today = rows.find((r) => r.day === target);
  if (!today || (today.hrv === null && today.rhr === null)) {
    return {
      date: target,
      color: null,
      begruendung: "Keine Schlafdaten für diesen Tag vorhanden (Ring noch nicht gesynct?).",
      empfehlung: "Sync abwarten oder nach Gefühl moderat trainieren.",
    };
  }

  const priorHrv = rows
    .filter((r) => r.day !== target && r.day < target && r.hrv !== null)
    .map((r) => r.hrv as number);
  const hrvAvg7 = average(priorHrv);
  const hrvDeltaPct =
    today.hrv !== null && hrvAvg7 !== null && hrvAvg7 > 0
      ? ((today.hrv - hrvAvg7) / hrvAvg7) * 100
      : null;
  const rhrDelta = today.rhr !== null ? today.rhr - rhrBaseline : null;

  const reasons: string[] = [];
  if (today.hrv !== null && hrvAvg7 !== null) {
    reasons.push(
      `HRV ${round(today.hrv)} ms vs. 7-Tage-Schnitt ${round(hrvAvg7)} ms ` +
        `(${round(hrvDeltaPct)! >= 0 ? "+" : ""}${round(hrvDeltaPct)} %)`,
    );
  } else if (today.hrv !== null) {
    reasons.push(`HRV ${round(today.hrv)} ms (kein 7-Tage-Schnitt verfügbar)`);
  }
  if (rhrDelta !== null) {
    reasons.push(
      `RHR ${round(today.rhr)} bpm vs. Baseline ${rhrBaseline} bpm ` +
        `(${rhrDelta >= 0 ? "+" : ""}${round(rhrDelta)})`,
    );
  }
  if (today.readiness !== null) {
    reasons.push(`Readiness ${round(today.readiness, 0)}`);
  }

  let color: "GRÜN" | "GELB" | "ROT";
  let empfehlung: string;
  if ((hrvDeltaPct !== null && hrvDeltaPct <= -20) || (rhrDelta !== null && rhrDelta >= 5)) {
    color = "ROT";
    empfehlung =
      "Regenerationstag: Spaziergang, Mobility, früh schlafen. Kein intensives Hyrox-Training.";
  } else if (
    (hrvDeltaPct !== null && hrvDeltaPct <= -10) ||
    (rhrDelta !== null && rhrDelta >= 3) ||
    (today.readiness !== null && today.readiness < 70)
  ) {
    color = "GELB";
    empfehlung =
      "Moderates Training: Zone 2, Technik, lockeres Krafttraining. Keine Intervalle/Max-Belastung.";
  } else {
    color = "GRÜN";
    empfehlung = "Volle Belastung möglich: Hyrox-Intensität, Intervalle, schweres Krafttraining.";
    if ((hrvDeltaPct !== null && hrvDeltaPct < 0) || (rhrDelta !== null && rhrDelta > 2)) {
      empfehlung += " Hinweis: Werte im Grenzbereich — auf Körpergefühl achten.";
    }
  }

  return {
    date: target,
    color,
    begruendung: reasons.join("; "),
    empfehlung,
    werte: {
      hrv: round(today.hrv),
      hrv_avg_7d: round(hrvAvg7),
      hrv_delta_pct: round(hrvDeltaPct),
      rhr: round(today.rhr),
      rhr_baseline: rhrBaseline,
      rhr_delta: round(rhrDelta),
      readiness: round(today.readiness, 0),
    },
  };
}

/**
 * Erste Sicherheitsschicht für das query-Tool (zweite Schicht: die Rolle
 * `mcp_reader` ist read-only via default_transaction_read_only).
 */
export function sanitizeSelect(query: string): string {
  const stripped = query.trim().replace(/;\s*$/, "");
  if (stripped.length === 0) throw new Error("Leere Query.");
  if (stripped.includes(";")) throw new Error("Nur ein einzelnes Statement erlaubt.");
  if (!SELECT_ONLY.test(stripped)) throw new Error("Nur SELECT-Statements erlaubt.");
  const forbidden = stripped.match(FORBIDDEN_KEYWORDS);
  if (forbidden) throw new Error(`Nur SELECT-Statements erlaubt (gefunden: ${forbidden[0].toUpperCase()}).`);
  return stripped;
}

export function buildServer(env: Env): McpServer {
  const server = new McpServer({ name: "aeternum-data", version: "1.0.0" });

  server.registerTool(
    "get_daily_summary",
    {
      title: "Daily Summary",
      description:
        "Tageswerte aus der View daily_summary: HRV, Ruhepuls (RHR), Readiness-Score, " +
        "Schritte, aktive Kalorien, Resilienz-Level und Gefäßalter. Datumsangaben in Europe/Berlin.",
      inputSchema: {
        start_date: DATE_SCHEMA.describe("Erster Tag (YYYY-MM-DD)"),
        end_date: DATE_SCHEMA.describe("Letzter Tag (YYYY-MM-DD)"),
      },
    },
    async ({ start_date, end_date }) => {
      try {
        const rows = await withDb(env, (sql) =>
          sql`
            select day::text as day, hrv, rhr, readiness, steps,
                   active_calories, resilience, vascular_age
            from daily_summary
            where day between ${start_date} and ${end_date}
            order by day
          `,
        );
        return ok(rows);
      } catch (error) {
        return err(`get_daily_summary fehlgeschlagen: ${(error as Error).message}`);
      }
    },
  );

  server.registerTool(
    "get_trend",
    {
      title: "Metrik-Trend",
      description:
        "Zeitreihe einer Metrik inkl. rollierendem 7-Tage-Durchschnitt und Delta zur persönlichen " +
        "Baseline (HRV/RHR). Metriken: hrv, rhr, readiness, steps, active_calories, vascular_age.",
      inputSchema: {
        metric: z.enum(Object.keys(TREND_METRICS) as [Metric, ...Metric[]]),
        days: z.number().int().min(7).max(400).default(30).describe("Zeitraum in Tagen (Default 30)"),
      },
    },
    async ({ metric, days }) => {
      try {
        const column = TREND_METRICS[metric];
        const rows = await withDb(env, (sql) =>
          sql<{ day: string; value: number | null }[]>`
            select day::text as day, ${sql(column)} as value
            from daily_summary
            where day >= (current_date - ${days}::int)
            order by day
          `,
        );

        const series = rows.map((row, index) => {
          const window = rows
            .slice(Math.max(0, index - 6), index + 1)
            .map((r) => r.value)
            .filter((v): v is number => v !== null);
          return { day: row.day, value: row.value, avg_7d: round(average(window)) };
        });

        const values = rows.map((r) => r.value).filter((v): v is number => v !== null);
        const latest = [...series].reverse().find((r) => r.value !== null) ?? null;
        const avg7 = average(values.slice(-7));
        const baseline =
          metric === "hrv" ? baselines(env).hrv : metric === "rhr" ? baselines(env).rhr : null;

        return ok({
          metric,
          days,
          baseline,
          latest: latest ? { day: latest.day, value: latest.value } : null,
          avg_7d: round(avg7),
          delta_vs_baseline:
            baseline !== null && avg7 !== null ? round(avg7 - baseline) : null,
          delta_vs_baseline_pct:
            baseline !== null && avg7 !== null ? round(((avg7 - baseline) / baseline) * 100) : null,
          series,
        });
      } catch (error) {
        return err(`get_trend fehlgeschlagen: ${(error as Error).message}`);
      }
    },
  );

  server.registerTool(
    "get_workouts",
    {
      title: "Workouts",
      description:
        "Alle Workouts im Zeitraum: Oura-Workouts (oura_workouts) plus externe Workouts " +
        "(workouts_external, z.B. FITIV/Apple Health).",
      inputSchema: {
        start_date: DATE_SCHEMA.describe("Erster Tag (YYYY-MM-DD)"),
        end_date: DATE_SCHEMA.describe("Letzter Tag (YYYY-MM-DD)"),
      },
    },
    async ({ start_date, end_date }) => {
      try {
        const result = await withDb(env, async (sql) => {
          const oura = await sql`
            select id, day::text as day, activity, intensity, calories, distance,
                   start_datetime, end_datetime
            from oura_workouts
            where day between ${start_date} and ${end_date}
            order by start_datetime nulls last, id
          `;
          const external = await sql`
            select id, source, start, duration_s, avg_hr, max_hr, distance_m
            from workouts_external
            where start >= ${start_date}::date
              and start < (${end_date}::date + 1)
            order by start
          `;
          return { oura, external };
        });
        return ok(result);
      } catch (error) {
        return err(`get_workouts fehlgeschlagen: ${(error as Error).message}`);
      }
    },
  );

  server.registerTool(
    "training_light",
    {
      title: "Trainingsampel",
      description:
        "HRV-/RHR-gesteuerte Trainingsampel für einen Tag (Default: heute, Europe/Berlin). " +
        "GRÜN = volle Belastung, GELB = moderat, ROT = Regeneration. " +
        "Logik: ROT bei HRV ≥20 % unter 7-Tage-Schnitt oder RHR ≥ Baseline+5; " +
        "GELB bei HRV 10–20 % unter Schnitt, RHR Baseline+3/4 oder Readiness < 70; sonst GRÜN.",
      inputSchema: {
        date: DATE_SCHEMA.optional().describe("Tag (YYYY-MM-DD), Default heute in Europe/Berlin"),
      },
    },
    async ({ date }) => {
      try {
        const target = date ?? todayBerlin();
        const rows = await withDb(env, (sql) =>
          sql<DaySample[]>`
            select day::text as day, hrv, rhr, readiness
            from daily_summary
            where day between (${target}::date - 7) and ${target}::date
            order by day
          `,
        );
        return ok(evaluateTrainingLight([...rows], target, baselines(env).rhr));
      } catch (error) {
        return err(`training_light fehlgeschlagen: ${(error as Error).message}`);
      }
    },
  );

  server.registerTool(
    "query",
    {
      title: "SQL-Query (read-only)",
      description:
        "Beliebiges SELECT gegen die Aeternum-Datenbank (Tabellen: oura_sleep, oura_daily_readiness, " +
        "oura_daily_activity, oura_daily_resilience, oura_daily_spo2, oura_daily_stress, oura_workouts, " +
        "oura_sessions, oura_tags, oura_vo2max, oura_cardio_age, bloodwork, workouts_external; " +
        "View: daily_summary). Nur SELECT, max. 500 Zeilen.",
      inputSchema: {
        sql: z.string().min(1).describe("Ein einzelnes SELECT-Statement"),
      },
    },
    async ({ sql: query }) => {
      try {
        const safe = sanitizeSelect(query);
        const rows = await withDb(env, (sql) =>
          sql.unsafe(`select * from (${safe}) as _q limit 500`),
        );
        return ok({ row_count: rows.length, rows });
      } catch (error) {
        return err(`query fehlgeschlagen: ${(error as Error).message}`);
      }
    },
  );

  return server;
}
