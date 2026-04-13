CREATE TABLE IF NOT EXISTS "user_quotas" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") UNIQUE,
  "skill_limit" integer NOT NULL DEFAULT 5000,
  "schema_limit" integer NOT NULL DEFAULT 20,
  "storage_limit_bytes" integer NOT NULL DEFAULT 2147483648,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);
