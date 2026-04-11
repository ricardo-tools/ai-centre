ALTER TABLE "showcase_uploads" ADD COLUMN "deploy_status" text DEFAULT 'none' NOT NULL;
ALTER TABLE "showcase_uploads" ADD COLUMN "deploy_url" text;
