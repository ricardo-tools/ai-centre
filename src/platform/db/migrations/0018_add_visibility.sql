-- Add visibility columns to showcase_uploads, community_skills, and user_quotas
ALTER TABLE showcase_uploads ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'public';
ALTER TABLE community_skills ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'public';
ALTER TABLE user_quotas ADD COLUMN IF NOT EXISTS default_visibility text NOT NULL DEFAULT 'public';
