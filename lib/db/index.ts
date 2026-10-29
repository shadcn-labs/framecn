import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzleProxy } from "drizzle-orm/sqlite-proxy";
import type { SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";

import * as schema from "@/lib/db/schema";

/**
 * Both drivers expose the async query API used across the app: production
 * talks to Cloudflare D1 over its REST API; local development falls back to a
 * SQLite file through better-sqlite3. Queries are awaited either way, and
 * neither path uses interactive transactions (D1 over HTTP has none).
 */
export type Db = SqliteRemoteDatabase<typeof schema>;

const D1_ENV = [
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_D1_DATABASE_ID",
  "CLOUDFLARE_D1_API_TOKEN",
] as const;

interface D1Response {
  success: boolean;
  errors: { code: number; message: string }[];
  result?: {
    results?: { columns: string[]; rows: unknown[][] };
    meta?: { changes?: number };
  }[];
}

/** Runs one statement with D1's `/raw` endpoint, which returns rows as arrays. */
const d1Callback = (accountId: string, databaseId: string, token: string) => {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/raw`;
  return async (
    sql: string,
    params: unknown[],
    method: "run" | "all" | "values" | "get"
  ) => {
    const response = await fetch(url, {
      body: JSON.stringify({ params, sql }),
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const data = (await response.json()) as D1Response;
    if (!(response.ok && data.success)) {
      const message = data.errors?.map((error) => error.message).join("; ");
      throw new Error(`D1 query failed: ${message || response.status}`);
    }
    const [result] = data.result ?? [];
    const rows = result?.results?.rows ?? [];
    if (method === "get") {
      return { rows: rows[0] as unknown[] };
    }
    // Better Auth reads `changes` to count rows touched by a write.
    return { changes: result?.meta?.changes ?? 0, rows };
  };
};

const createDb = (): Db => {
  const [accountId, databaseId, token] = D1_ENV.map((key) => process.env[key]);
  if (accountId && databaseId && token) {
    return drizzleProxy(d1Callback(accountId, databaseId, token), { schema });
  }
  if (accountId || databaseId || token) {
    throw new Error(
      `Database is not configured: set all of ${D1_ENV.join(", ")} to use Cloudflare D1.`
    );
  }
  if (process.env.VERCEL) {
    throw new Error(
      `Database is not configured: set ${D1_ENV.join(", ")} (Vercel has no persistent disk for SQLite).`
    );
  }
  const filename = path.resolve(
    process.env.FRAMECN_DATABASE_PATH || "data/framecn.sqlite"
  );
  mkdirSync(path.dirname(filename), { recursive: true });
  const sqlite = new Database(filename);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.pragma("busy_timeout = 5000");
  // The sync driver's queries are awaitable too; only the run-result shape
  // differs, which the app never reads.
  return drizzleSqlite(sqlite, { schema }) as unknown as Db;
};

let db: Db | undefined;

/** The app database; tables come from `pnpm db:migrate:local` / `db:migrate:remote`. */
export const getDb = (): Db => {
  db ??= createDb();
  return db;
};
