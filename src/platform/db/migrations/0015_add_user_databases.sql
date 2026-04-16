CREATE TABLE IF NOT EXISTS "user_databases" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id"),
  "db_name" text NOT NULL,
  "db_url" text NOT NULL,
  "turso_db_id" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "user_database_name_unique" UNIQUE("user_id", "db_name")
);

CREATE INDEX IF NOT EXISTS "idx_user_databases_user" ON "user_databases" ("user_id");
