---
name: social-features-reference
type: reference
companion_to: social-features
description: >
  Schema templates, reaction emoji registry, notification type registry, and
  UI patterns for social features. Reference companion — for rules see
  social-features, comments-reactions, and activity-notifications.
---

# Social Features Reference

> **This is a companion reference to the [social-features](social-features.md) skill.**
> It contains schema templates, registries, CSS patterns, and index recommendations.
> For usage rules, principles, and banned patterns, see the main skill and its
> implementation companions: [comments-reactions](comments-reactions.md) and
> [activity-notifications](activity-notifications.md).

---

## Complete Drizzle Schema

### Comments

```ts
import { pgTable, uuid, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  parentId: uuid('parent_id'),
  authorId: uuid('author_id').notNull().references(() => users.id),
  body: text('body').notNull(),
  mentions: jsonb('mentions').$type<MentionData[]>().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  entityIdx: index('comments_entity_idx').on(table.entityType, table.entityId),
  parentIdx: index('comments_parent_idx').on(table.parentId),
  authorIdx: index('comments_author_idx').on(table.authorId),
  createdIdx: index('comments_created_idx').on(table.createdAt),
}));

type MentionData = { userId: string; offset: number; length: number };
```

### Reactions

```ts
import { pgTable, uuid, text, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users';

export const reactions = pgTable('reactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id),
  emoji: text('emoji').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  uniqueReaction: uniqueIndex('reactions_unique_idx')
    .on(table.entityType, table.entityId, table.userId, table.emoji),
  entityIdx: index('reactions_entity_idx').on(table.entityType, table.entityId),
  userIdx: index('reactions_user_idx').on(table.userId),
}));
```

### Activity Events

```ts
import { pgTable, uuid, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const activityEvents = pgTable('activity_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventType: text('event_type').notNull(),
  actorId: uuid('actor_id').notNull().references(() => users.id),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  entityIdx: index('activity_entity_idx').on(table.entityType, table.entityId, table.createdAt),
  actorIdx: index('activity_actor_idx').on(table.actorId),
  typeIdx: index('activity_type_idx').on(table.eventType),
  createdIdx: index('activity_created_idx').on(table.createdAt),
}));
```

### Notifications

```ts
import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users';
import { activityEvents } from './activity-events';

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipientId: uuid('recipient_id').notNull().references(() => users.id),
  eventId: uuid('event_id').notNull().references(() => activityEvents.id),
  type: text('type').notNull(),
  title: text('title').notNull(),
  body: text('body'),
  link: text('link').notNull(),
  readAt: timestamp('read_at'),
  emailedAt: timestamp('emailed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  recipientUnreadIdx: index('notifications_recipient_unread_idx')
    .on(table.recipientId, table.readAt, table.createdAt),
  recipientIdx: index('notifications_recipient_idx').on(table.recipientId),
  eventIdx: index('notifications_event_idx').on(table.eventId),
  pendingEmailIdx: index('notifications_pending_email_idx')
    .on(table.recipientId, table.emailedAt, table.readAt),
}));
```

### Notification Preferences

```ts
import { pgTable, uuid, text, boolean, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users';

export const notificationPreferences = pgTable('notification_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  notificationType: text('notification_type').notNull(),
  inApp: boolean('in_app').notNull().default(true),
  email: boolean('email').notNull().default(true),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userTypeIdx: uniqueIndex('prefs_user_type_idx')
    .on(table.userId, table.notificationType),
}));
```

---

## Reaction Emoji Registry

| Shortcode | Emoji | Display | Purpose |
|---|---|---|---|
| `thumbs_up` | 👍 | `👍` | Agreement, approval, "works for me" |
| `thumbs_down` | 👎 | `👎` | Disagreement, needs work |
| `heart` | ❤️ | `❤️` | Appreciation, love it |
| `celebrate` | 🎉 | `🎉` | Congratulations, milestone reached |
| `confused` | 😕 | `😕` | Unclear, needs explanation |
| `rocket` | 🚀 | `🚀` | Impressive, ship it |

```ts
const REACTION_REGISTRY = {
  thumbs_up:   { emoji: '👍', label: 'Thumbs up' },
  thumbs_down: { emoji: '👎', label: 'Thumbs down' },
  heart:       { emoji: '❤️', label: 'Heart' },
  celebrate:   { emoji: '🎉', label: 'Celebrate' },
  confused:    { emoji: '😕', label: 'Confused' },
  rocket:      { emoji: '🚀', label: 'Rocket' },
} as const;

type ReactionEmoji = keyof typeof REACTION_REGISTRY;
const VALID_EMOJI = Object.keys(REACTION_REGISTRY) as ReactionEmoji[];
```

---

## Notification Type Registry

| Type | Label | Title template | Body template | Link pattern |
|---|---|---|---|---|
| `mention` | Mentioned in a comment | `{actorName} mentioned you` | First 100 chars of comment | `/{entityType}s/{entityId}` |
| `comment_on_owned` | Comment on your content | `{actorName} commented on {entityTitle}` | First 100 chars of comment | `/{entityType}s/{entityId}` |
| `reply_to_comment` | Reply to your comment | `{actorName} replied to your comment` | First 100 chars of reply | `/{entityType}s/{entityId}` |
| `skill_published` | Skill published | `{skillTitle} was published` | "A new version is available" | `/skills/{slug}` |
| `reaction_received` | Reaction on your content | `{actorName} reacted {emoji} to {entityTitle}` | — | `/{entityType}s/{entityId}` |

```ts
const NOTIFICATION_TYPE_REGISTRY: Record<string, {
  label: string;
  titleTemplate: string;
  bodyTemplate: string | null;
  linkPattern: string;
  defaultInApp: boolean;
  defaultEmail: boolean;
}> = {
  mention:            { label: 'Mentioned in a comment',  titleTemplate: '{actorName} mentioned you',                    bodyTemplate: '{commentPreview}',        linkPattern: '/{entityType}s/{entityId}', defaultInApp: true,  defaultEmail: true  },
  comment_on_owned:   { label: 'Comment on your content', titleTemplate: '{actorName} commented on {entityTitle}',       bodyTemplate: '{commentPreview}',        linkPattern: '/{entityType}s/{entityId}', defaultInApp: true,  defaultEmail: true  },
  reply_to_comment:   { label: 'Reply to your comment',   titleTemplate: '{actorName} replied to your comment',          bodyTemplate: '{commentPreview}',        linkPattern: '/{entityType}s/{entityId}', defaultInApp: true,  defaultEmail: true  },
  skill_published:    { label: 'Skill published',         titleTemplate: '{skillTitle} was published',                   bodyTemplate: 'A new version is available', linkPattern: '/skills/{slug}',         defaultInApp: true,  defaultEmail: false },
  reaction_received:  { label: 'Reaction on your content',titleTemplate: '{actorName} reacted {emoji} to {entityTitle}', bodyTemplate: null,                      linkPattern: '/{entityType}s/{entityId}', defaultInApp: true,  defaultEmail: false },
};
```

---

## Event Type Registry

| Event type | Actor | Entity | Metadata |
|---|---|---|---|
| `comment_created` | Comment author | Commented entity | `{ commentId, commentBody, parentId? }` |
| `comment_edited` | Comment author | Commented entity | `{ commentId, previousBody }` |
| `comment_deleted` | Deleter (author or admin) | Commented entity | `{ commentId, deletedBy }` |
| `reaction_added` | Reactor | Reacted entity | `{ emoji }` |
| `reaction_removed` | Reactor | Reacted entity | `{ emoji }` |
| `skill_published` | Publisher | Skill | `{ version, skillTitle }` |
| `skill_downloaded` | Downloader | Skill | `{}` |
| `project_generated` | Generator | Project | `{ archetypeId?, skillCount }` |

---

## Mention Format Specification

### Storage format

Mentions are stored in two places:
1. **Inline in body text:** `@[Display Name](user-uuid)` — human-readable, renderable
2. **Structured in `mentions` JSONB column:** array of `{ userId, offset, length }`

### Parsing regex

```ts
const MENTION_REGEX = /@\[([^\]]+)\]\(([a-f0-9-]{36})\)/g;
```

### Rendering

Replace each mention match with a styled span:

```tsx
<span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>@{displayName}</span>
```

### Validation rules

- User ID must be a valid UUID (36 chars, hex + hyphens)
- User must exist in the database and not be soft-deleted
- Invalid mentions are silently stripped from the structured `mentions` array (but left in body text as plain text)

---

## Composite Index Recommendations

| Table | Index name | Columns | Purpose |
|---|---|---|---|
| `comments` | `comments_entity_idx` | `(entity_type, entity_id)` | Fetch comments for an entity |
| `comments` | `comments_parent_idx` | `(parent_id)` | Fetch replies to a comment |
| `comments` | `comments_author_idx` | `(author_id)` | Fetch user's comments (data export) |
| `reactions` | `reactions_unique_idx` | `(entity_type, entity_id, user_id, emoji)` UNIQUE | Prevent duplicate reactions |
| `reactions` | `reactions_entity_idx` | `(entity_type, entity_id)` | Aggregate reactions for an entity |
| `activity_events` | `activity_entity_idx` | `(entity_type, entity_id, created_at)` | Per-entity activity feed |
| `activity_events` | `activity_actor_idx` | `(actor_id)` | User's activity history |
| `notifications` | `notifications_recipient_unread_idx` | `(recipient_id, read_at, created_at)` | Unread notifications query |
| `notifications` | `notifications_pending_email_idx` | `(recipient_id, emailed_at, read_at)` | Email digest batch query |
| `notification_preferences` | `prefs_user_type_idx` | `(user_id, notification_type)` UNIQUE | Preference lookup + upsert |

---

## CSS Patterns for Comment UI

### Comment thread container

```css
.comment-thread {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

### Top-level comment

```css
.comment {
  padding: 16px;
  border-radius: 8px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  font-size: 13px;
  color: var(--color-text-heading);
}

.comment-time {
  font-size: 12px;
  color: var(--color-text-muted);
}

.comment-body {
  font-size: 14px;
  color: var(--color-text-body);
  line-height: 1.6;
}
```

### Reply (indented)

```css
.comment-replies {
  margin-left: 32px;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment-reply {
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
}
```

### Soft-deleted placeholder

```css
.comment-deleted {
  padding: 12px 16px;
  color: var(--color-text-muted);
  font-style: italic;
  font-size: 13px;
}
```

### Reaction bar

```css
.reaction-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.reaction-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-muted);
  transition: background 150ms ease, border-color 150ms ease;
}

.reaction-button:hover {
  background: var(--color-surface-alt);
}

.reaction-button[data-active="true"] {
  background: var(--color-primary-muted);
  border-color: var(--color-primary);
  color: var(--color-primary);
}
```

### Mention highlight

```css
.mention {
  color: var(--color-primary);
  font-weight: 600;
}
```

### Notification bell badge

```css
.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background: var(--color-danger);
  color: var(--color-text-on-danger);
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
```

---

## Vercel Cron Configuration

```json
{
  "crons": [
    {
      "path": "/api/cron/email-digest",
      "schedule": "*/15 * * * *"
    },
    {
      "path": "/api/cron/purge-notifications",
      "schedule": "0 3 * * *"
    }
  ]
}
```

| Cron | Schedule | Purpose |
|---|---|---|
| Email digest | Every 15 minutes | Batch unread notifications into email digests |
| Purge notifications | Daily at 3:00 AM | Delete read notifications older than 90 days |
