import { Hono } from "hono";
import { StreamableHTTPTransport } from "@hono/mcp";
import { buildServer } from "./server";
import type { Env } from "./db";

/** Timing-sicherer Bearer-Vergleich über SHA-256-Digests. */
async function bearerOk(header: string | undefined, expectedToken: string | undefined): Promise<boolean> {
  if (!header || !expectedToken) return false;
  const provided = header.replace(/^Bearer\s+/i, "");
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(provided)),
    crypto.subtle.digest("SHA-256", encoder.encode(expectedToken)),
  ]);
  const bytesA = new Uint8Array(a);
  const bytesB = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < bytesA.length; i++) diff |= bytesA[i] ^ bytesB[i];
  return diff === 0;
}

const app = new Hono<{ Bindings: Env }>();

// Unauthentifizierter Health-Check (liefert keine Daten) — für Smoke-Tests.
app.get("/health", (c) => c.json({ ok: true, service: "aeternum-mcp" }));

// Alles andere nur mit gültigem Bearer-Token.
app.use("*", async (c, next) => {
  const authorized = await bearerOk(c.req.header("authorization"), c.env.MCP_BEARER_TOKEN);
  if (!authorized) {
    return c.json({ error: "unauthorized" }, 401, { "WWW-Authenticate": "Bearer" });
  }
  await next();
});

// MCP-Endpoint (Streamable HTTP). Claude Custom Connector zeigt auf .../mcp
app.all("/mcp", async (c) => {
  const server = buildServer(c.env);
  const transport = new StreamableHTTPTransport();
  await server.connect(transport);
  return transport.handleRequest(c);
});

app.notFound((c) => c.json({ error: "not found", hint: "MCP-Endpoint ist /mcp" }, 404));

export default app;
