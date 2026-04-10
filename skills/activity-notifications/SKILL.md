---
name: activity-notifications
description: >
  Implementation patterns for activity event logging, notification delivery
  (in-app + email), preference management, and batched email digests. Covers
  database schemas, server actions, SSE/polling, and Vercel Cron integration.
  Apply when building awareness features. Implementation skill for social-features.
---

# Activity & Notifications

Implementation patterns for activity event logging, in-app notification delivery, batched email digests, and user preference management. For principles and feature selection, see **social-features**. For the comment and reaction events that feed into this system, see **comments-reactions**.

---

## When to Use

Apply this skill when:
- Adding activity feeds to entity detail pages
- Building in-app notification systems (bell icon, unread counts, notification drawer)
- Implementing email digest delivery for notifications
- Adding user preference controls for notification channels
- Setting up cron jobs for batched email and notification cleanup

Do NOT use this skill for:
- Deciding whether to add notifications — see **social-features**
- Comment or reaction implementation — see **comments-reactions**
- Email delivery infrastructure — see **email-sending**
- Audit logging for compliance — see **user-management** (audit log is separate from activity events)

---

## Core Rules

### 1. Activity events schema — the single source of truth

Every notable action creates an immutable activity event. Events are the raw log; notifications are derived from events for specific recipients. Never create notifications without an underlying event.

```ts
// ✅ Activity events — immutable log of what happened
export const activityEvents = pgTable('activity_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventType: text('event_type').notNull(),        // 'comment_created' | 'skill_published' | etc.
  actorId: uuid('actor_id').notNull().references(() => users.id),
  entityType: text('entity_type').notNull(),       // 'skill' | 'showcase' | 'project'
  entityId: uuid('entity_id').notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  entityIdx: index('activity_entity_idx').on(table.entityType, table.entityId, table.createdAt),
  actorIdx: index('activity_actor_idx').on(table.actorId),
  typeIdx: index('activity_type_idx').on(table.eventType),
}));
```

### 2. Notifications schema — recipient-specific delivery tracking

Each notification targets one user. Track read and emailed timestamps separately — a notification can be read in-app but not yet emailed, or emailed but not yet read.

```ts
// ✅ Notifications — one row per recipient per event
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipientId: uuid('recipient_id').notNull().references(() => users.id),
  eventId: uuid('event_id').notNull().references(() => activityEvents.id),
  type: text('type').notNull(),                    // mirrors event_type for filtering
  title: text('title').notNull(),                  // "Alex commented on Clean Architecture"
  body: text('body'),                              // preview text (first 100 chars of comment)
  link: text('link').notNull(),                    // "/skills/clean-architecture"
  readAt: timestamp('read_at'),                    // null = unread
  emailedAt: timestamp('emailed_at'),              // null = not yet emailed
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  recipientIdx: index('notifications_recipient_idx')
    .on(table.recipientId, table.readAt, table.createdAt),
  unreadIdx: index('notifications_unread_idx')
    .on(table.recipientId, table.readAt),
}));
```

### 3. Notification preferences schema — per-type, per-channel

Users control which notification types they receive and through which channels. Defaults are opt-in (all enabled). Users dial down from there.

```ts
// ✅ Preferences — per notification type and channel
export const notificationPreferences = pgTable('notification_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  notificationType: text('notification_type').notNull(), // 'mention' | 'comment_on_owned' | etc.
  inApp: boolean('in_app').notNull().default(true),
  email: boolean('email').notNull().default(true),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userTypeIdx: uniqueIndex('prefs_user_type_idx')
    .on(table.userId, table.notificationType),
}));
```

### 4. Creating events and fan-out notifications

When an action occurs: (1) write the activity event, (2) determine recipients, (3) check each recipient's preferences, (4) create notification rows for opted-in recipients. All in one transaction.

```ts
// ✅ Event creation + notification fan-out
async function createEventAndNotify(params: {
  eventType: string;
  actorId: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  recipients: { userId: string; reason: 'mention' | 'owner' | 'subscriber' }[];
}): Promise<void> {
  await db.transaction(async (tx) => {
    // 1. Create event
    const [event] = await tx.insert(activityEvents).values({
      eventType: params.eventType,
      actorId: params.actorId,
      entityType: params.entityType,
      entityId: params.entityId,
      metadata: params.metadata ?? {},
    }).returning();

    // 2. Resolve notification template
    const template = NOTIFICATION_TYPES[params.eventType];
    if (!template) return;

    // 3. Fan out to recipients (skip the actor — don't notify yourself)
    for (const recipient of params.recipients) {
      if (recipient.userId === params.actorId) continue;

      // Check preferences
      const pref = await tx.query.notificationPreferences.findFirst({
        where: and(
          eq(notificationPreferences.userId, recipient.userId),
          eq(notificationPreferences.notificationType, mapReasonToType(recipient.reason, params.eventType)),
        ),
      });

      const inAppEnabled = pref?.inApp ?? true;  // default: enabled
      if (!inAppEnabled) continue;

      await tx.insert(notifications).values({
        recipientId: recipient.userId,
        eventId: event.id,
        type: params.eventType,
        title: template.title(params.metadata ?? {}),
        body: template.body(params.metadata ?? {}),
        link: template.link(params.entityType, params.entityId),
      });
    }
  });
}
```

### 5. In-app delivery — polling with unread count

For Vercel deployments, polling is the simplest reliable approach. Poll every 30 seconds for unread count. Load full notification list on drawer open. Mark as read on click.

```ts
// ✅ Unread count endpoint — lightweight, cached for 10s
export async function getUnreadCount(): Promise<Result<number, AuthError>> {
  const session = await requireAuth();
  const count = await db.select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(and(
      eq(notifications.recipientId, session.userId),
      isNull(notifications.readAt),
    ));
  return Ok(count[0].count);
}

// ✅ Fetch notifications — paginated, newest first
export async function getNotifications(
  page = 1,
  pageSize = 20,
): Promise<Result<Notification[], AuthError>> {
  const session = await requireAuth();
  const results = await db.query.notifications.findMany({
    where: eq(notifications.recipientId, session.userId),
    orderBy: [desc(notifications.createdAt)],
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });
  return Ok(results);
}

// ✅ Mark as read — single or bulk
export async function markAsRead(
  notificationIds: string[],
): Promise<Result<void, AuthError>> {
  const session = await requireAuth();
  await db.update(notifications)
    .set({ readAt: new Date() })
    .where(and(
      inArray(notifications.id, notificationIds),
      eq(notifications.recipientId, session.userId),
      isNull(notifications.readAt),
    ));
  return Ok(undefined);
}
```

### 6. Email digest — Vercel Cron every 15 minutes

Collect unread, un-emailed notifications per user. Group by entity. Send one digest email per user. Mark as emailed. This prevents per-event email spam.

```ts
// ✅ Cron handler — /api/cron/email-digest (runs every 15 min)
// vercel.json: { "crons": [{ "path": "/api/cron/email-digest", "schedule": "*/15 * * * *" }] }

export async function GET(request: Request) {
  // Verify cron secret
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`)
    return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Find users with un-emailed notifications
  const pending = await db.select({
    recipientId: notifications.recipientId,
    count: sql<number>`count(*)`,
  })
    .from(notifications)
    .where(and(isNull(notifications.emailedAt), isNull(notifications.readAt)))
    .groupBy(notifications.recipientId);

  for (const { recipientId, count } of pending) {
    // Check user's email preference
    const user = await db.query.users.findFirst({ where: eq(users.id, recipientId) });
    if (!user) continue;

    // Fetch the actual notifications for this user
    const items = await db.query.notifications.findMany({
      where: and(
        eq(notifications.recipientId, recipientId),
        isNull(notifications.emailedAt),
        isNull(notifications.readAt),
      ),
      orderBy: [desc(notifications.createdAt)],
      limit: 50,
    });

    // Send digest email
    await sendDigestEmail(user.email, items);

    // Mark as emailed
    await db.update(notifications)
      .set({ emailedAt: new Date() })
      .where(inArray(notifications.id, items.map((n) => n.id)));
  }

  return Response.json({ ok: true, processed: pending.length });
}
```

### 7. Preference management UI

Users control preferences per notification type and per channel. Show a table with toggles. Changes take effect immediately via server action.

```ts
// ✅ Update preference — upsert pattern
export async function updateNotificationPreference(
  notificationType: string,
  channel: 'inApp' | 'email',
  enabled: boolean,
): Promise<Result<void, AuthError | ValidationError>> {
  const session = await requireAuth();

  if (!NOTIFICATION_TYPES[notificationType])
    return Err(new ValidationError(`Unknown notification type: ${notificationType}`));

  await db.insert(notificationPreferences)
    .values({
      userId: session.userId,
      notificationType,
      inApp: channel === 'inApp' ? enabled : true,
      email: channel === 'email' ? enabled : true,
    })
    .onConflictDoUpdate({
      target: [notificationPreferences.userId, notificationPreferences.notificationType],
      set: { [channel]: enabled, updatedAt: new Date() },
    });

  return Ok(undefined);
}
```

### 8. Notification types registry

Each notification type defines how to render its title, body, and link. The registry is the single source of truth for notification content.

```ts
// ✅ Notification type registry — title, body, and link templates
const NOTIFICATION_TYPES: Record<string, NotificationType> = {
  mention: {
    label: 'Mentioned in a comment',
    title: (m) => `${m.actorName} mentioned you`,
    body: (m) => truncate(m.commentBody as string, 100),
    link: (entityType, entityId) => `/${entityType}s/${entityId}`,
  },
  comment_on_owned: {
    label: 'Comment on your content',
    title: (m) => `${m.actorName} commented on ${m.entityTitle}`,
    body: (m) => truncate(m.commentBody as string, 100),
    link: (entityType, entityId) => `/${entityType}s/${entityId}`,
  },
  reply_to_comment: {
    label: 'Reply to your comment',
    title: (m) => `${m.actorName} replied to your comment`,
    body: (m) => truncate(m.commentBody as string, 100),
    link: (entityType, entityId) => `/${entityType}s/${entityId}`,
  },
  skill_published: {
    label: 'Skill published',
    title: (m) => `${m.skillTitle} was published`,
    body: () => 'A new version is available',
    link: (_et, entityId) => `/skills/${entityId}`,
  },
  reaction_received: {
    label: 'Reaction on your content',
    title: (m) => `${m.actorName} reacted ${m.emoji} to ${m.entityTitle}`,
    body: () => null,
    link: (entityType, entityId) => `/${entityType}s/${entityId}`,
  },
};

type NotificationType = {
  label: string;
  title: (metadata: Record<string, unknown>) => string;
  body: (metadata: Record<string, unknown>) => string | null;
  link: (entityType: string, entityId: string) => string;
};
```

### 9. Auto-purge old notifications

Cron job deletes read notifications older than 90 days. Keeps the notifications table from growing unbounded.

```ts
// ✅ Cron handler — /api/cron/purge-notifications (runs daily)
// vercel.json: { "crons": [{ "path": "/api/cron/purge-notifications", "schedule": "0 3 * * *" }] }

export async function GET(request: Request) {
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`)
    return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const result = await db.delete(notifications)
    .where(and(
      isNotNull(notifications.readAt),
      lt(notifications.createdAt, cutoff),
    ));

  return Response.json({ ok: true, purged: result.rowCount });
}
```

### 10. Batch deduplication in email digests

If 5 people comment on the same entity within the digest window, group them into one line: "5 new comments on Clean Architecture". Don't send 5 separate notification lines.

```ts
// ✅ Group notifications by entity for digest rendering
function groupForDigest(items: Notification[]): DigestGroup[] {
  const groups = new Map<string, Notification[]>();

  for (const item of items) {
    const key = `${item.type}:${item.link}`;
    const existing = groups.get(key) ?? [];
    existing.push(item);
    groups.set(key, existing);
  }

  return Array.from(groups.entries()).map(([_key, notifications]) => {
    if (notifications.length === 1) {
      return { title: notifications[0].title, body: notifications[0].body, link: notifications[0].link };
    }
    // Deduplicated group
    return {
      title: `${notifications.length} ${notifications[0].type.replace(/_/g, ' ')} notifications`,
      body: `on ${notifications[0].link}`,
      link: notifications[0].link,
    };
  });
}
```

---

## Activity Feed Pattern

Activity feeds are scoped to the entity being viewed. Fetch recent events for a given `entity_type + entity_id`, join with actor data, and render as a timeline.

```ts
// ✅ Per-entity activity feed
async function getEntityActivity(
  entityType: string,
  entityId: string,
  limit = 20,
): Promise<ActivityEvent[]> {
  return db.query.activityEvents.findMany({
    where: and(
      eq(activityEvents.entityType, entityType),
      eq(activityEvents.entityId, entityId),
    ),
    orderBy: [desc(activityEvents.createdAt)],
    limit,
    with: { actor: { columns: { id: true, displayName: true, avatarUrl: true } } },
  });
}
```

Render as a vertical timeline with actor avatar, action description, and relative timestamp.

---

## Banned Patterns

- ❌ Creating notifications without an underlying activity event → event first, notifications derived
- ❌ Per-event email notifications → batch into 15-minute digests via cron
- ❌ Global activity feeds as primary view → scope to entity being viewed
- ❌ Opt-in notification defaults (all disabled until user enables) → default to on, user dials down
- ❌ Pre-computed feed tables for < 1000 users → query at read time with indexes
- ❌ SSE or WebSocket on Vercel serverless → use polling (30-second interval) for reliability
- ❌ Notifications that live forever → auto-purge read notifications older than 90 days
- ❌ Sending duplicate emails for grouped events → batch-deduplicate by entity in digest
- ❌ Notifying the actor about their own action → skip `actorId === recipientId`
- ❌ Notification preferences without per-type granularity → each type has independent in-app + email toggles

---

## Quality Gate

Before delivering, verify:

- [ ] Activity events table stores immutable event records with actor, entity, and metadata
- [ ] Notifications table tracks `readAt` and `emailedAt` separately per recipient
- [ ] Notification preferences support per-type, per-channel toggles with opt-out defaults
- [ ] Event creation and notification fan-out happen in the same transaction
- [ ] Actor is excluded from their own notification recipients
- [ ] In-app delivery uses polling (30s) with unread count endpoint
- [ ] Email digest cron runs every 15 minutes and groups notifications by entity
- [ ] Digest deduplication collapses multiple same-type notifications on the same entity
- [ ] Auto-purge cron deletes read notifications older than 90 days
- [ ] Notification types registry defines title, body, and link templates for all event types
- [ ] Preference update uses upsert pattern with immediate effect
- [ ] All notification endpoints require authentication
