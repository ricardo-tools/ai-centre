CREATE TABLE IF NOT EXISTS "community_skills" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id"),
  "name" text NOT NULL,
  "description" text NOT NULL,
  "category" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "community_skill_slug_user" UNIQUE("slug", "user_id")
);

CREATE INDEX IF NOT EXISTS "idx_community_skills_user" ON "community_skills" ("user_id");

CREATE TABLE IF NOT EXISTS "community_skill_versions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "skill_id" uuid NOT NULL REFERENCES "community_skills"("id") ON DELETE CASCADE,
  "version_number" integer NOT NULL,
  "content" text NOT NULL,
  "commit_message" text NOT NULL,
  "checksum" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
