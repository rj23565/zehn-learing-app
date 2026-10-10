import {
  pgTable,
  text,
  boolean,
  integer,
  serial,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Students are identified purely by their device id — no email/login  */
/* ------------------------------------------------------------------ */
export const students = pgTable("students", {
  id: text("id").primaryKey(), // device id (uuid generated on device)
  name: text("name").notNull().default("Learner"),
  grade: integer("grade").notNull().default(1), // 0 = playgroup/KG, 1..12
  language: text("language").notNull().default("en"),
  avatar: text("avatar").notNull().default("owl"),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  streak: integer("streak").notNull().default(0),
  lastActiveDate: text("last_active_date").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ------------------------------------------------------------------ */
/* Curriculum — narrated animated micro-lessons per grade band         */
/* ------------------------------------------------------------------ */
export const lessons = pgTable(
  "lessons",
  {
    id: serial("id").primaryKey(),
    band: text("band").notNull(), // early | primary | middle | high | senior
    subject: text("subject").notNull(),
    level: text("level").notNull().default("easy"), // easy | normal | hard
    country: text("country").notNull().default(""), // for World History chapters
    orderIndex: integer("order_index").notNull().default(0),
    title: text("title").notNull(),
    icon: text("icon").notNull().default("BookOpen"),
    color: text("color").notNull().default("violet"),
    minutes: integer("minutes").notNull().default(4),
    intro: text("intro").notNull().default(""),
    slides: jsonb("slides").notNull(), // Slide[]
    quiz: jsonb("quiz").notNull(), // QuizQuestion[]
  },
  (t) => [index("lessons_band_idx").on(t.band)]
);

/* Lesson completion per student */
export const progress = pgTable(
  "progress",
  {
    id: serial("id").primaryKey(),
    studentId: text("student_id").notNull(),
    lessonId: integer("lesson_id").notNull(),
    score: integer("score").notNull().default(0),
    completedAt: timestamp("completed_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("progress_student_lesson").on(t.studentId, t.lessonId),
    index("progress_student_idx").on(t.studentId),
  ]
);

/* Brain-gym game plays */
export const gamePlays = pgTable(
  "game_plays",
  {
    id: serial("id").primaryKey(),
    studentId: text("student_id").notNull(),
    game: text("game").notNull(),
    score: integer("score").notNull().default(0),
    level: integer("level").notNull().default(1),
    playedAt: timestamp("played_at").defaultNow().notNull(),
  },
  (t) => [index("gameplays_student_idx").on(t.studentId)]
);

/* Diary / book / page photo uploads + generated study plans */
export const uploads = pgTable(
  "uploads",
  {
    id: serial("id").primaryKey(),
    studentId: text("student_id").notNull(),
    kind: text("kind").notNull().default("diary"), // diary | book | page
    subject: text("subject").notNull().default("General"),
    imageData: text("image_data").notNull(), // compressed data-url
    plan: jsonb("plan").notNull(), // PlanStep[]
    doneSteps: jsonb("done_steps").notNull().default([]), // number[]
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("uploads_student_idx").on(t.studentId)]
);

/* Server-side translation cache (any language pair) */
export const translations = pgTable(
  "translations",
  {
    id: serial("id").primaryKey(),
    hash: text("hash").notNull().unique(),
    source: text("source").notNull(),
    target: text("target").notNull(),
    input: text("input").notNull(),
    result: text("result").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("translations_hash_idx").on(t.hash)]
);

/* XP ledger — idempotent awards so nothing can be farmed twice */
export const xpEvents = pgTable(
  "xp_events",
  {
    id: serial("id").primaryKey(),
    studentId: text("student_id").notNull(),
    reason: text("reason").notNull(),
    refId: text("ref_id").notNull(),
    amount: integer("amount").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("xp_student_reason_ref").on(t.studentId, t.reason, t.refId),
    index("xp_student_idx").on(t.studentId),
  ]
);

/* Rolling daily activity log — powers quests & streak widgets */
export const dailyLog = pgTable(
  "daily_log",
  {
    id: serial("id").primaryKey(),
    studentId: text("student_id").notNull(),
    date: text("date").notNull(), // YYYY-MM-DD (UTC)
    lessons: integer("lessons").notNull().default(0),
    games: integer("games").notNull().default(0),
    diary: integer("diary").notNull().default(0),
    cartoons: integer("cartoons").notNull().default(0),
    xp: integer("xp").notNull().default(0),
  },
  (t) => [
    uniqueIndex("daily_student_date").on(t.studentId, t.date),
    index("daily_student_idx").on(t.studentId),
  ]
);

/* ------------------------------------------------------------------ */
/* Platform/application infrastructure — additive only                  */
/* These tables support a conventional users + chats + game-state +     */
/* videos deployment shape while the existing application tables keep    */
/* their current names and behaviour.                                   */
/* ------------------------------------------------------------------ */

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(), // session/device id
    deviceId: text("device_id").notNull().unique(),
    isOnboarded: boolean("is_onboarded").notNull().default(true),
    name: text("name").notNull().default("Learner"),
    email: text("email"),
    avatar: text("avatar").notNull().default("owl"),
    grade: integer("grade").notNull().default(1),
    language: text("language").notNull().default("en"),
    profile: jsonb("profile").notNull().default({}),
    lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("users_device_idx").on(t.deviceId), index("users_onboarded_idx").on(t.isOnboarded)]
);

export const chatSessions = pgTable(
  "chat_sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    agentId: text("agent_id").notNull().default("zehn-tutor"),
    title: text("title").notNull().default("Conversation"),
    language: text("language").notNull().default("en"),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("chat_sessions_user_idx").on(t.userId), index("chat_sessions_agent_idx").on(t.agentId)]
);

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: serial("id").primaryKey(),
    sessionId: text("session_id").notNull(),
    role: text("role").notNull(), // user | assistant | system | tool
    content: text("content").notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("chat_messages_session_idx").on(t.sessionId)]
);

export const gameStates = pgTable(
  "game_states",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    gameId: text("game_id").notNull(),
    state: jsonb("state").notNull().default({}),
    score: integer("score").notNull().default(0),
    level: integer("level").notNull().default(1),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("game_states_user_game").on(t.userId, t.gameId), index("game_states_user_idx").on(t.userId)]
);

export const videos = pgTable(
  "videos",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull().default("Untitled"),
    prompt: text("prompt").notNull().default(""),
    engine: text("engine").notNull().default("veo-3"),
    status: text("status").notNull().default("draft"), // draft | queued | processing | ready | failed
    url: text("url").notNull().default(""),
    thumbnailUrl: text("thumbnail_url").notNull().default(""),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("videos_user_idx").on(t.userId), index("videos_status_idx").on(t.status)]
);
