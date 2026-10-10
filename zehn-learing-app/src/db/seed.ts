import { sql } from "drizzle-orm";
import { db } from "@/db";

/**
 * Zehn database bootstrap — idempotent by design.
 *
 * `ensureDatabase()` may be called from:
 *   - the CLI seed runner     (npm run db:seed, runs at/after build on Vercel)
 *   - the production starter  (scripts/db-init.mjs)
 *   - any API request         (ensures a cold/reset database self-heals)
 *
 * It never breaks new-functionality tables that already exist.
 */

const DDL: string[] = [
  // Core application table (device-identified learners)
  `create table if not exists students (
     id text primary key,
     name text not null default 'Learner',
     grade integer not null default 1,
     language text not null default 'en',
     avatar text not null default 'owl',
     xp integer not null default 0,
     level integer not null default 1,
     streak integer not null default 0,
     last_active_date text not null default '',
     created_at timestamp not null default now()
   )`,
  `create table if not exists lessons (
     id serial primary key,
     band text not null,
     subject text not null,
     level text not null default 'easy',
     country text not null default '',
     order_index integer not null default 0,
     title text not null,
     icon text not null default 'BookOpen',
     color text not null default 'violet',
     minutes integer not null default 4,
     intro text not null default '',
     slides jsonb not null,
     quiz jsonb not null
   )`,
  `create index if not exists lessons_band_idx on lessons (band)`,
  `create table if not exists progress (
     id serial primary key,
     student_id text not null,
     lesson_id integer not null,
     score integer not null default 0,
     completed_at timestamp not null default now()
   )`,
  `create unique index if not exists progress_student_lesson on progress (student_id, lesson_id)`,
  `create index if not exists progress_student_idx on progress (student_id)`,
  `create table if not exists game_plays (
     id serial primary key,
     student_id text not null,
     game text not null,
     score integer not null default 0,
     level integer not null default 1,
     played_at timestamp not null default now()
   )`,
  `create index if not exists gameplays_student_idx on game_plays (student_id)`,
  `create table if not exists uploads (
     id serial primary key,
     student_id text not null,
     kind text not null default 'diary',
     subject text not null default 'General',
     image_data text not null,
     plan jsonb not null,
     done_steps jsonb not null default '[]',
     created_at timestamp not null default now()
   )`,
  `create index if not exists uploads_student_idx on uploads (student_id)`,
  `create table if not exists translations (
     id serial primary key,
     hash text not null unique,
     source text not null,
     target text not null,
     input text not null,
     result text not null,
     created_at timestamp not null default now()
   )`,
  `create index if not exists translations_hash_idx on translations (hash)`,
  `create table if not exists xp_events (
     id serial primary key,
     student_id text not null,
     reason text not null,
     ref_id text not null,
     amount integer not null,
     created_at timestamp not null default now()
   )`,
  `create unique index if not exists xp_student_reason_ref on xp_events (student_id, reason, ref_id)`,
  `create index if not exists xp_student_idx on xp_events (student_id)`,
  `create table if not exists daily_log (
     id serial primary key,
     student_id text not null,
     date text not null,
     lessons integer not null default 0,
     games integer not null default 0,
     diary integer not null default 0,
     cartoons integer not null default 0,
     xp integer not null default 0
   )`,
  `create unique index if not exists daily_student_date on daily_log (student_id, date)`,
  `create index if not exists daily_student_idx on daily_log (student_id)`,

  // Conventional deployment tables (users / chat / game-state / video)
  `create table if not exists users (
     id text primary key,
     device_id text not null unique,
     is_onboarded boolean not null default true,
     name text not null default 'Learner',
     email text,
     avatar text not null default 'owl',
     grade integer not null default 1,
     language text not null default 'en',
     profile jsonb not null default '{}',
     last_seen_at timestamp not null default now(),
     updated_at timestamp not null default now(),
     created_at timestamp not null default now()
   )`,
  `create index if not exists users_device_idx on users (device_id)`,
  `create index if not exists users_onboarded_idx on users (is_onboarded)`,
  `create table if not exists chat_sessions (
     id text primary key,
     user_id text not null,
     agent_id text not null default 'zehn-tutor',
     title text not null default 'Conversation',
     language text not null default 'en',
     metadata jsonb not null default '{}',
     created_at timestamp not null default now(),
     updated_at timestamp not null default now()
   )`,
  `create index if not exists chat_sessions_user_idx on chat_sessions (user_id)`,
  `create index if not exists chat_sessions_agent_idx on chat_sessions (agent_id)`,
  `create table if not exists chat_messages (
     id serial primary key,
     session_id text not null,
     role text not null,
     content text not null,
     metadata jsonb not null default '{}',
     created_at timestamp not null default now()
   )`,
  `create index if not exists chat_messages_session_idx on chat_messages (session_id)`,
  `create table if not exists game_states (
     id serial primary key,
     user_id text not null,
     game_id text not null,
     state jsonb not null default '{}',
     score integer not null default 0,
     level integer not null default 1,
     updated_at timestamp not null default now()
   )`,
  `create unique index if not exists game_states_user_game on game_states (user_id, game_id)`,
  `create index if not exists game_states_user_idx on game_states (user_id)`,
  `create table if not exists videos (
     id text primary key,
     user_id text not null,
     title text not null default 'Untitled',
     prompt text not null default '',
     engine text not null default 'veo-3',
     status text not null default 'draft',
     url text not null default '',
     thumbnail_url text not null default '',
     metadata jsonb not null default '{}',
     created_at timestamp not null default now(),
     updated_at timestamp not null default now()
   )`,
  `create index if not exists videos_user_idx on videos (user_id)`,
  `create index if not exists videos_status_idx on videos (status)`,
];

/** Seed rows that must exist so a profile can always be resolved. */
const SEEDS: string[] = [
  // A verified, onboarded fallback profile for conventional deployments.
  `insert into users (id, device_id, is_onboarded, name)
     values ('1', 'system', true, 'Admin')
     on conflict (id) do nothing`,
  // A resolvable default student profile so first load has a valid record.
  `insert into students (id, name, grade, language, streak)
     values ('system-admin', 'Admin', 1, 'en', 1)
     on conflict (id) do nothing`,
];

let ensured = false;

export type EnsureResult = { executed: number; skipped: number; seeded: number };

/**
 * Creates every table the application needs (idempotent), seeds the default
 * profile rows, and caches the result for the life of this process.
 * Returns honest execution stats so CLI logs never lie about failures.
 */
export async function ensureDatabase(): Promise<EnsureResult> {
  const result: EnsureResult = { executed: 0, skipped: 0, seeded: 0 };
  if (ensured) return result;
  for (const statement of [...DDL, ...SEEDS]) {
    try {
      await db.execute(sql.raw(statement));
      result.executed += 1;
      if (SEEDS.includes(statement)) result.seeded += 1;
    } catch (error) {
      result.skipped += 1;
      console.warn("[db/seed] skipped:", (error as Error).message.split("\n")[0]);
    }
  }
  ensured = result.executed > 0;
  return result;
}

/** CLI entry: `tsx src/db/seed.ts` — runs at build/deploy time on Vercel. */
const isCli = Boolean(
  process.argv[1] && /seed\.(ts|js|mts|mjs)$/.test(process.argv[1])
);

if (isCli) {
  ensureDatabase()
    .then((result) => {
      if (result.skipped > 0) {
        console.warn(
          `[db/seed] completed with ${result.skipped} skipped statement(s) — database may be unreachable, continuing anyway`
        );
      }
      if (result.seeded > 0) {
        console.log("[db/seed] database ready — default onboarded profile seeded");
      }
      process.exit(0); // never fail the platform build
    })
    .catch((error) => {
      console.warn("[db/seed] could not reach database (non-fatal):", (error as Error).message);
      process.exit(0);
    });
}
