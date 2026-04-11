-- Alter entity_id columns from uuid to text to support non-UUID identifiers (e.g. skill slugs)
-- Tables affected: activity_events, bookmarks, comments, notifications, reactions, audit_log

-- Drop unique constraints that reference entity_id
ALTER TABLE "bookmarks" DROP CONSTRAINT IF EXISTS "bookmark_unique";--> statement-breakpoint
ALTER TABLE "reactions" DROP CONSTRAINT IF EXISTS "reaction_unique";--> statement-breakpoint

-- Alter columns (idempotent — SET DATA TYPE text on a text column is a no-op)
ALTER TABLE "activity_events" ALTER COLUMN "entity_id" SET DATA TYPE text USING "entity_id"::text;--> statement-breakpoint
ALTER TABLE "bookmarks" ALTER COLUMN "entity_id" SET DATA TYPE text USING "entity_id"::text;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "entity_id" SET DATA TYPE text USING "entity_id"::text;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "entity_id" SET DATA TYPE text USING "entity_id"::text;--> statement-breakpoint
ALTER TABLE "reactions" ALTER COLUMN "entity_id" SET DATA TYPE text USING "entity_id"::text;--> statement-breakpoint
ALTER TABLE "audit_log" ALTER COLUMN "entity_id" SET DATA TYPE text USING "entity_id"::text;--> statement-breakpoint

-- Recreate unique constraints
DO $$ BEGIN ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmark_unique" UNIQUE("user_id","entity_type","entity_id"); EXCEPTION WHEN duplicate_object THEN NULL; END $$;--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "reactions" ADD CONSTRAINT "reaction_unique" UNIQUE("entity_type","entity_id","user_id","emoji"); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
