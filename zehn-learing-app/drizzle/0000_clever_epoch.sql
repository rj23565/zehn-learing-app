CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"agent_id" text DEFAULT 'zehn-tutor' NOT NULL,
	"title" text DEFAULT 'Conversation' NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"date" text NOT NULL,
	"lessons" integer DEFAULT 0 NOT NULL,
	"games" integer DEFAULT 0 NOT NULL,
	"diary" integer DEFAULT 0 NOT NULL,
	"cartoons" integer DEFAULT 0 NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_plays" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"game" text NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"played_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_states" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"game_id" text NOT NULL,
	"state" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"band" text NOT NULL,
	"subject" text NOT NULL,
	"level" text DEFAULT 'easy' NOT NULL,
	"country" text DEFAULT '' NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"title" text NOT NULL,
	"icon" text DEFAULT 'BookOpen' NOT NULL,
	"color" text DEFAULT 'violet' NOT NULL,
	"minutes" integer DEFAULT 4 NOT NULL,
	"intro" text DEFAULT '' NOT NULL,
	"slides" jsonb NOT NULL,
	"quiz" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"lesson_id" integer NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text DEFAULT 'Learner' NOT NULL,
	"grade" integer DEFAULT 1 NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"avatar" text DEFAULT 'owl' NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"last_active_date" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"hash" text NOT NULL,
	"source" text NOT NULL,
	"target" text NOT NULL,
	"input" text NOT NULL,
	"result" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "translations_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
CREATE TABLE "uploads" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"kind" text DEFAULT 'diary' NOT NULL,
	"subject" text DEFAULT 'General' NOT NULL,
	"image_data" text NOT NULL,
	"plan" jsonb NOT NULL,
	"done_steps" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"device_id" text NOT NULL,
	"is_onboarded" boolean DEFAULT true NOT NULL,
	"name" text DEFAULT 'Learner' NOT NULL,
	"email" text,
	"avatar" text DEFAULT 'owl' NOT NULL,
	"grade" integer DEFAULT 1 NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"profile" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"last_seen_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_device_id_unique" UNIQUE("device_id")
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text DEFAULT 'Untitled' NOT NULL,
	"prompt" text DEFAULT '' NOT NULL,
	"engine" text DEFAULT 'veo-3' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"url" text DEFAULT '' NOT NULL,
	"thumbnail_url" text DEFAULT '' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "xp_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"reason" text NOT NULL,
	"ref_id" text NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "chat_messages_session_idx" ON "chat_messages" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "chat_sessions_user_idx" ON "chat_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "chat_sessions_agent_idx" ON "chat_sessions" USING btree ("agent_id");--> statement-breakpoint
CREATE UNIQUE INDEX "daily_student_date" ON "daily_log" USING btree ("student_id","date");--> statement-breakpoint
CREATE INDEX "daily_student_idx" ON "daily_log" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "gameplays_student_idx" ON "game_plays" USING btree ("student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "game_states_user_game" ON "game_states" USING btree ("user_id","game_id");--> statement-breakpoint
CREATE INDEX "game_states_user_idx" ON "game_states" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "lessons_band_idx" ON "lessons" USING btree ("band");--> statement-breakpoint
CREATE UNIQUE INDEX "progress_student_lesson" ON "progress" USING btree ("student_id","lesson_id");--> statement-breakpoint
CREATE INDEX "progress_student_idx" ON "progress" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "translations_hash_idx" ON "translations" USING btree ("hash");--> statement-breakpoint
CREATE INDEX "uploads_student_idx" ON "uploads" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "users_device_idx" ON "users" USING btree ("device_id");--> statement-breakpoint
CREATE INDEX "users_onboarded_idx" ON "users" USING btree ("is_onboarded");--> statement-breakpoint
CREATE INDEX "videos_user_idx" ON "videos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "videos_status_idx" ON "videos" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "xp_student_reason_ref" ON "xp_events" USING btree ("student_id","reason","ref_id");--> statement-breakpoint
CREATE INDEX "xp_student_idx" ON "xp_events" USING btree ("student_id");