// Applies ./drizzle migrations to the local SQLite fallback database
// (FRAMECN_DATABASE_PATH, default data/framecn.sqlite). Production uses
// Cloudflare D1: `pnpm db:migrate:remote`.
import { mkdirSync } from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const filename = path.resolve(
  process.env.FRAMECN_DATABASE_PATH || "data/framecn.sqlite"
);
mkdirSync(path.dirname(filename), { recursive: true });
const sqlite = new Database(filename);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

const legacy = sqlite
  .prepare(
    "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'user' AND NOT EXISTS (SELECT 1 FROM sqlite_master WHERE name = '__drizzle_migrations')"
  )
  .get();
if (legacy) {
  console.error(
    `${filename} was created by the old auto-migration and has an incompatible schema. Move or delete it (with its -wal/-shm files) and run this again.`
  );
  process.exit(1);
}

migrate(drizzle(sqlite), { migrationsFolder: "drizzle" });
sqlite.close();
console.log(`Migrated ${filename}`);
