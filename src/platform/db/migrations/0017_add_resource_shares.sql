CREATE TABLE IF NOT EXISTS "resource_shares" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "resource_type" text NOT NULL,
  "resource_id" text NOT NULL,
  "grantee_type" text NOT NULL,
  "grantee_id" text NOT NULL,
  "can_view" boolean NOT NULL DEFAULT true,
  "can_download" boolean NOT NULL DEFAULT false,
  "can_share" boolean NOT NULL DEFAULT false,
  "expires_at" timestamp,
  "created_by" uuid NOT NULL REFERENCES "users"("id"),
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "resource_share_unique" UNIQUE("resource_type", "resource_id", "grantee_type", "grantee_id")
);

CREATE INDEX IF NOT EXISTS "idx_resource_shares_resource" ON "resource_shares" ("resource_type", "resource_id");
CREATE INDEX IF NOT EXISTS "idx_resource_shares_grantee" ON "resource_shares" ("grantee_type", "grantee_id");
