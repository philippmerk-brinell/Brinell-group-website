import postgres from "postgres";

export type Env = {
  /** Selbst generiertes Bearer-Token (openssl rand -hex 32) — Wrangler Secret. */
  MCP_BEARER_TOKEN: string;
  /**
   * Postgres-Connection-String der READ-ONLY-Rolle `mcp_reader` — Wrangler Secret.
   * Supabase Transaction Pooler (Port 6543), z.B.:
   * postgresql://mcp_reader.<project-ref>:<passwort>@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   */
  MCP_DB_URL: string;
  /** Persönliche HRV-Baseline (ms), Default 31 — wrangler.toml [vars]. */
  HRV_BASELINE?: string;
  /** Persönliche Ruhepuls-Baseline (bpm), Default 58 — wrangler.toml [vars]. */
  RHR_BASELINE?: string;
};

export type Sql = ReturnType<typeof createDb>;

export function createDb(env: Env) {
  return postgres(env.MCP_DB_URL, {
    ssl: "require",
    // Supabase Transaction Pooler unterstützt keine Prepared Statements.
    prepare: false,
    max: 1,
    fetch_types: false,
    connect_timeout: 10,
    types: {
      // numeric/bigint als JS-Zahlen statt Strings zurückgeben (Werte hier weit
      // unterhalb von Number.MAX_SAFE_INTEGER, Präzisionsverlust irrelevant).
      numeric: {
        to: 1700,
        from: [1700],
        serialize: (value: unknown) => String(value),
        parse: (value: string) => Number(value),
      },
      bigint: {
        to: 20,
        from: [20],
        serialize: (value: unknown) => String(value),
        parse: (value: string) => Number(value),
      },
    },
  });
}

/**
 * Öffnet pro Tool-Aufruf eine frische Verbindung und schließt sie danach.
 * Workers erlauben keine Wiederverwendung von Sockets über Requests hinweg.
 */
export async function withDb<T>(env: Env, fn: (sql: Sql) => Promise<T>): Promise<T> {
  const sql = createDb(env);
  try {
    return await fn(sql);
  } finally {
    await sql.end({ timeout: 5 });
  }
}
