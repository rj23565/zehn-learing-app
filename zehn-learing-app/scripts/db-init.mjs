#!/usr/bin/env node
import { spawnSync } from "node:child_process";

/*
 * Production database bootstrap.
 * Safe to run on every start: drizzle-kit push is declarative/idempotent and
 * creates only missing tables/columns from src/db/schema.ts.
 */
const skip = process.env.SKIP_DB_INIT === "1" || process.env.SKIP_DB_INIT === "true";
if (skip) {
  console.log("[db-init] skipped via SKIP_DB_INIT");
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://postgres:postgres@127.0.0.1:5432/app_db";
  console.warn("[db-init] DATABASE_URL was missing; using local development fallback");
}

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(command, ["drizzle-kit", "push", "--force"], {
  stdio: "inherit",
  env: process.env,
});

if (result.status !== 0) {
  // Do not kill the web app if a managed database is briefly unavailable;
  // log loudly so deployment dashboards surface the database problem.
  console.error(`[db-init] drizzle-kit push exited with code ${result.status}`);
} else {
  console.log("[db-init] database schema is ready");
}

// Seed default data (onboarded fallback profile + curriculum) so a session
// profile can always resolve, even on a freshly-reset production database.
const seed = spawnSync(command, ["tsx", "src/db/seed.ts"], {
  stdio: "inherit",
  env: process.env,
});
if (seed.status !== 0) {
  console.warn(`[db-init] seed step exited with code ${seed.status} (non-fatal)`);
}
