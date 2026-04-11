ALTER TABLE "showcase_uploads" ADD COLUMN IF NOT EXISTS "archived" boolean NOT NULL DEFAULT false;
