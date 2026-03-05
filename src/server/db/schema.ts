import { pgTable, uuid, text, boolean, timestamp, pgEnum, jsonb } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['admin', 'member']);
export const versionStatusEnum = pgEnum('version_status', ['draft', 'published', 'archived']);
export const entityTypeEnum = pgEnum('entity_type', ['skill', 'archetype']);
export const auditActionEnum = pgEnum('audit_action', ['created', 'updated', 'published', 'archived', 'deleted']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  role: userRoleEnum('role').notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

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
  showcaseGeneratedAt: timestamp('showcase_generated_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const skillVersions = pgTable('skill_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  skillId: uuid('skill_id').notNull().references(() => skills.id),
  version: text('version').notNull(),
  content: text('content').notNull(),
  status: versionStatusEnum('status').notNull().default('draft'),
  publishedAt: timestamp('published_at'),
  publishedById: uuid('published_by_id').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

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

export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityType: entityTypeEnum('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  action: auditActionEnum('action').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const generatedProjects = pgTable('generated_projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  archetypeId: uuid('archetype_id').references(() => archetypes.id),
  skillIds: jsonb('skill_ids').$type<string[]>().notNull(),
  prompt: text('prompt').notNull(),
  blobUrl: text('blob_url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
