import { defineConfig } from "drizzle-kit";

// `pnpm db:generate` writes SQL migrations to ./drizzle. They are applied to
// Cloudflare D1 by wrangler (`pnpm db:migrate:remote`) and to the local
// SQLite fallback by `pnpm db:migrate:local`.
export default defineConfig({
  dialect: "sqlite",
  out: "./drizzle",
  schema: "./lib/db/schema.ts",
});
