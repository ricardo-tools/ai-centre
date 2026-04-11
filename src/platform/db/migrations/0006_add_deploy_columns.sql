ALTER TABLE "showcase_uploads" ADD COLUMN IF NOT EXISTS "deploy_status" text DEFAULT 'none' NOT NULL;
ALTER TABLE "showcase_uploads" ADD COLUMN IF NOT EXISTS "deploy_url" text;
