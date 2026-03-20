import { pgTable, uuid, text, boolean, timestamp, pgEnum, jsonb, integer, unique } from 'drizzle-orm/pg-core';

export const versionStatusEnum = pgEnum('version_status', ['draft', 'published', 'archived']);
export const entityTypeEnum = pgEnum('entity_type', ['skill', 'archetype', 'showcase', 'user', 'role', 'invitation']);
export const auditActionEnum = pgEnum('audit_action', ['created', 'updated', 'published', 'archived', 'deleted']);
export const invitationStatusEnum = pgEnum('invitation_status', ['pending', 'accepted', 'expired']);

// ── Roles & Permissions ──────────────────────────────────────────────

export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  isSystem: boolean('is_system').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const rolePermissions = pgTable('role_permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  roleId: uuid('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  permission: text('permission').notNull(),
}, (table) => [
  unique('role_permission_unique').on(table.roleId, table.permission),
]);

// ── Users ────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  roleId: uuid('role_id').references(() => roles.id),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── Invitations ──────────────────────────────────────────────────────

export const invitations = pgTable('invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  roleId: uuid('role_id').notNull().references(() => roles.id),
  invitedById: uuid('invited_by_id').notNull().references(() => users.id),
  status: invitationStatusEnum('status').notNull().default('pending'),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ── Skills ───────────────────────────────────────────────────────────

export const skills = pgTable('skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  authorId: uuid('author_id').notNull().references(() => users.id),
  isOfficial: boolean('is_official').notNull().default(false),
  currentPublishedVersionId: uuid('current_published_version_id'),
  currentDraftVersionId: uuid('current_draft_version_id'),
  showcaseHtml: text('showcase_html'),
  showcaseBlobUrl: text('showcase_blob_url'),
  showcaseGeneratedAt: timestamp('showcase_generated_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const skillVersions = pgTable('skill_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  skillId: uuid('skill_id').notNull().references(() => skills.id),
  version: text('version').notNull(),
  content: text('content').notNull(),
  contentBlobUrl: text('content_blob_url'),
  contentChecksum: text('content_checksum'),
  status: versionStatusEnum('status').notNull().default('draft'),
  publishedAt: timestamp('published_at'),
  publishedById: uuid('published_by_id').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ── Archetypes ───────────────────────────────────────────────────────

export const archetypes = pgTable('archetypes', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  authorId: uuid('author_id').notNull().references(() => users.id),
  isOfficial: boolean('is_official').notNull().default(false),
  currentPublishedVersionId: uuid('current_published_version_id'),
  currentDraftVersionId: uuid('current_draft_version_id'),
  suggestedSkillIds: jsonb('suggested_skill_ids').$type<string[]>().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const archetypeVersions = pgTable('archetype_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  archetypeId: uuid('archetype_id').notNull().references(() => archetypes.id),
  version: text('version').notNull(),
  content: jsonb('content').notNull(),
  status: versionStatusEnum('status').notNull().default('draft'),
  publishedAt: timestamp('published_at'),
  publishedById: uuid('published_by_id').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ── Audit ────────────────────────────────────────────────────────────

export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityType: entityTypeEnum('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  action: auditActionEnum('action').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ── Auth ─────────────────────────────────────────────────────────────

export const verificationTokens = pgTable('verification_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  attempts: integer('attempts').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ── Showcases ────────────────────────────────────────────────────────

export const showcaseFileTypeEnum = pgEnum('showcase_file_type', ['html', 'zip']);

export const showcaseUploads = pgTable('showcase_uploads', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  skillIds: jsonb('skill_ids').$type<string[]>().default([]),
  fileType: showcaseFileTypeEnum('file_type').notNull(),
  blobUrl: text('blob_url').notNull(),
  fileName: text('file_name').notNull(),
  fileSizeBytes: integer('file_size_bytes').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ── Generated Projects ───────────────────────────────────────────────

export const generatedProjects = pgTable('generated_projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  archetypeId: uuid('archetype_id').references(() => archetypes.id),
  skillIds: jsonb('skill_ids').$type<string[]>().notNull(),
  prompt: text('prompt').notNull(),
  blobUrl: text('blob_url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
