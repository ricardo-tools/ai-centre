-- Add thumbnail_url column to showcase_uploads for ZIP project preview screenshots
ALTER TABLE "showcase_uploads" ADD COLUMN IF NOT EXISTS "thumbnail_url" text;
