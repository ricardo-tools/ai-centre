CREATE TABLE IF NOT EXISTS "showcase_versions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "showcase_id" uuid NOT NULL REFERENCES "showcase_uploads"("id") ON DELETE CASCADE,
  "version_number" integer NOT NULL,
  "blob_url" text NOT NULL,
  "commit_message" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
