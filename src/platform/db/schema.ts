import { pgTable, uuid, text, boolean, timestamp, pgEnum, jsonb, integer, unique, index } from 'drizzle-orm/pg-core';

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
  entityId: text('entity_id').notNull(),
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
  thumbnailUrl: text('thumbnail_url'),
  fileName: text('file_name').notNull(),
  fileSizeBytes: integer('file_size_bytes').notNull(),
  deployStatus: text('deploy_status').notNull().default('none'),
  deployUrl: text('deploy_url'),
  deploymentId: text('deployment_id'),
  deployError: text('deploy_error'),
  archived: boolean('archived').notNull().default(false),
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

// ── Social: Downloads & Views ───────────────────────────────────────

export const skillDownloads = pgTable('skill_downloads', {
  id: uuid('id').primaryKey().defaultRandom(),
  skillSlug: text('skill_slug').notNull(),
  userId: uuid('user_id').references(() => users.id),
  context: text('context').notNull(), // 'detail_download' | 'project_generation'
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const showcaseViews = pgTable('showcase_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  showcaseId: uuid('showcase_id').notNull().references(() => showcaseUploads.id),
  userId: uuid('user_id').references(() => users.id),
  viewedAt: timestamp('viewed_at').notNull().defaultNow(),
});

// ── Social: Reactions & Bookmarks ───────────────────────────────────

export const reactions = pgTable('reactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityType: text('entity_type').notNull(), // 'showcase' | 'skill' | 'comment'
  entityId: text('entity_id').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id),
  emoji: text('emoji').notNull(), // 'thumbsup' | 'heart' | 'rocket' | 'eyes' | 'tada'
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  unique('reaction_unique').on(table.entityType, table.entityId, table.userId, table.emoji),
  index('idx_reactions_created_at').on(table.createdAt),
]);

export const bookmarks = pgTable('bookmarks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  entityType: text('entity_type').notNull(), // 'skill' | 'toolkit' | 'showcase'
  entityId: text('entity_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  unique('bookmark_unique').on(table.userId, table.entityType, table.entityId),
  index('idx_bookmarks_created_at').on(table.createdAt),
]);

// ── Social: Comments ────────────────────────────────────────────────

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityType: text('entity_type').notNull(), // 'skill' | 'showcase'
  entityId: text('entity_id').notNull(),
  parentId: uuid('parent_id'), // null = top-level, non-null = reply (unlimited depth)
  authorId: uuid('author_id').notNull().references(() => users.id),
  body: text('body').notNull(),
  mentions: jsonb('mentions').$type<{ userId: string; offset: number; length: number }[]>().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, (table) => [
  index('idx_comments_created_at').on(table.createdAt),
]);

// ── Social: Activity & Notifications ────────────────────────────────

export const activityEvents = pgTable('activity_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  actorId: uuid('actor_id').notNull().references(() => users.id),
  action: text('action').notNull(), // 'commented' | 'reacted' | 'published' | 'downloaded' | 'uploaded' | 'mentioned'
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  index('idx_activity_events_created_at').on(table.createdAt),
]);

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  type: text('type').notNull(), // 'mention' | 'comment_on_owned' | 'reply_to_comment' | 'skill_published' | 'bookmarked_updated'
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  actorId: uuid('actor_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  body: text('body'),
  readAt: timestamp('read_at'),
  emailedAt: timestamp('emailed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  index('idx_notifications_created_at').on(table.createdAt),
]);

export const notificationPreferences = pgTable('notification_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  type: text('type').notNull(),
  channel: text('channel').notNull(), // 'in_app' | 'email'
  enabled: boolean('enabled').notNull().default(true),
}, (table) => [
  unique('notif_pref_unique').on(table.userId, table.type, table.channel),
]);

// ── Chat ────────────────────────────────────────────────────────────

export const chatConversations = pgTable('chat_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  title: text('title'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('idx_chat_conversations_user').on(table.userId),
  index('idx_chat_conversations_created_at').on(table.createdAt),
]);

export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => chatConversations.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // 'user' | 'assistant' | 'tool'
  content: text('content').notNull(),
  thinking: text('thinking'),
  toolCalls: jsonb('tool_calls').$type<{ id: string; name: string; arguments: string }[]>(),
  toolResults: jsonb('tool_results').$type<{ toolCallId: string; content: string }[]>(),
  tokenUsage: jsonb('token_usage').$type<{ promptTokens: number; completionTokens: number; totalTokens: number }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  index('idx_chat_messages_conversation').on(table.conversationId),
  index('idx_chat_messages_created_at').on(table.createdAt),
]);

// ── Chat Feedback ──────────────────────────────────────────────────

export const chatFeedback = pgTable('chat_feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  messageId: uuid('message_id').notNull().references(() => chatMessages.id, { onDelete: 'cascade' }),
  conversationId: uuid('conversation_id').notNull().references(() => chatConversations.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  rating: text('rating').notNull(), // 'up' | 'down'
  correction: text('correction'), // optional user-provided correction text
  queryContext: text('query_context').notNull(), // the user message that prompted this response
  responseContext: text('response_context').notNull(), // the assistant response that was rated
  embedding: text('embedding'), // serialized float array for vector search (we'll use raw SQL for similarity)
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ── Skill Gaps ─────────────────────────────────────────────────────

// ── OAuth ──────────────────────────────────────────────────────────

export const oauthCodes = pgTable('oauth_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  codeHash: text('code_hash').notNull(),
  codeChallenge: text('code_challenge').notNull(),
  redirectUri: text('redirect_uri').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const oauthTokens = pgTable('oauth_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  accessTokenHash: text('access_token_hash').notNull(),
  refreshTokenHash: text('refresh_token_hash').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  revokedAt: timestamp('revoked_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ── Skill Embeddings ──────────────────────────────────────────────

export const skillEmbeddings = pgTable('skill_embeddings', {
  id: uuid('id').primaryKey().defaultRandom(),
  skillId: uuid('skill_id').notNull().references(() => skills.id, { onDelete: 'cascade' }).unique(),
  embedding: text('embedding').notNull(), // JSON-serialized float[]
  model: text('model').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── User Quotas ───────────────────────────────────────────────────

export const userQuotas = pgTable('user_quotas', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id).unique(),
  skillLimit: integer('skill_limit').notNull().default(5000),
  schemaLimit: integer('schema_limit').notNull().default(20),
  storageLimitBytes: integer('storage_limit_bytes').notNull().default(2147483648), // 2GB
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── Skill Gaps ─────────────────────────────────────────────────────

export const skillGaps = pgTable('skill_gaps', {
  id: uuid('id').primaryKey().defaultRandom(),
  description: text('description').notNull(), // what the user needed
  userQuery: text('user_query').notNull(), // the original question/request
  conversationId: uuid('conversation_id').references(() => chatConversations.id),
  userId: uuid('user_id').references(() => users.id),
  status: text('status').notNull().default('open'), // 'open' | 'planned' | 'resolved'
  resolvedSkillSlug: text('resolved_skill_slug'), // filled when a skill is created to address this gap
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

