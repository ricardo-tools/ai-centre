CREATE TABLE IF NOT EXISTS "skill_embeddings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "skill_id" uuid NOT NULL REFERENCES "skills"("id") ON DELETE CASCADE UNIQUE,
  "embedding" text NOT NULL,
  "model" text NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
