---
name: user-management
description: >
  User lifecycle management — states, soft delete, data export, profile data,
  preferences, and audit trails. Apply when adding user accounts, managing user
  lifecycle, implementing soft delete, handling data export, or building user
  profile features.
---

# User Management

Govern the full user lifecycle from invitation to deletion with explicit states, minimal profile data, and auditable transitions.

## When to Use

Apply this skill when:
- Adding user accounts or registration flows
- Implementing soft delete or account deactivation
- Building user profile pages or edit forms
- Adding data export (GDPR Article 20 portability)
- Handling right-to-erasure requests
- Implementing account merging or deduplication
- Defining admin vs self-service user operations

Do NOT use this skill for:
- Authentication mechanisms (see **authentication**)
- Role and permission definitions (see **authorization**)
- Session management or token handling (see **auth-custom-otp** or **auth-clerk**)

## Core Rules

### 1. Define a user state machine with explicit transitions

Every user is in exactly one state. Transitions are validated — reject any transition not in the allowed set. Log every transition with who, when, and why.

```ts
// ✅ Typed transitions — reject invalid, log all changes
type UserState = 'invited' | 'active' | 'suspended' | 'deleted';

const VALID_TRANSITIONS: Record<UserState, readonly UserState[]> = {
  invited: ['active', 'deleted'],   active: ['suspended', 'deleted'],
  suspended: ['active', 'deleted'], deleted: [],
};

function transitionUser(user: User, target: UserState, actor: { id: string; reason: string }) {
  if (!VALID_TRANSITIONS[user.state].includes(target))
    return Err(new ValidationError(`Cannot transition ${user.state} → ${target}`));
  return Ok(user.withState(target, actor));
}

// ❌ No validation, no audit trail
await db.users.update(userId, { state: 'suspended' });
```

### 2. Soft delete by default with a `deletedAt` timestamp

Set `deletedAt` on deletion. Filter soft-deleted users from all queries with a global where clause. Hard delete after the retention window (30-90 days) or immediately on erasure request.

```ts
// ✅ deletedAt column — acts as both flag and timestamp
deletedAt: timestamp('deleted_at'),  // null = active, non-null = soft-deleted

// ✅ Every query excludes soft-deleted users
const activeUsers = db.select().from(users).where(isNull(users.deletedAt));

// ❌ Boolean flag — loses the deletion timestamp
isDeleted: boolean('is_deleted').default(false),  // when was it deleted?
```

Why: `deletedAt` tells you *when* deletion happened, enabling retention-window hard deletes. A boolean loses the time dimension.

### 3. Store minimum viable profile data

Collect only what current features require. Email and display name are sufficient to start. Request additional fields when a feature needs them, not at signup.

**Store:** email, display name, avatar URL, role, preferences (JSON), timestamps (created, updated, last active).

**Avoid:** phone number (unless MFA), physical address (unless shipping), date of birth, government IDs, payment details.

**Derive, don't store:** "last seen" from activity logs, "account age" from `createdAt`, "is new user" from first login timestamp.

### 4. Implement right-to-erasure as anonymisation

When a user requests deletion, anonymise all PII. Replace identifying fields with deterministic placeholders. Retain the row for referential integrity — other tables still reference this user ID.

```ts
// ✅ Anonymise PII, keep row for referential integrity
async function eraseUserData(userId: string) {
  await db.transaction(async (tx) => {
    await tx.update(users).set({
      email: `erased-${userId}@removed.local`,
      displayName: 'Deleted User',
      avatarUrl: null, preferences: null,
      state: 'deleted', deletedAt: new Date(),
    }).where(eq(users.id, userId));

    await tx.insert(auditLog).values({
      entityType: 'user', entityId: userId,
      action: 'erased', metadata: { reason: 'right-to-erasure' },
    });
  });
}
```

Why: hard deleting rows with foreign key references breaks integrity. Anonymisation satisfies GDPR Article 17 while preserving referential links.

### 5. Support data export in machine-readable format

Users can request a JSON export of all their data. Export includes profile, preferences, activity, and any content they created. Return as a downloadable file, not inline.

```ts
// ✅ Structured export — all user-owned data in one JSON file
async function exportUserData(userId: string): Promise<Result<UserExport, NotFoundError>> {
  const [user, activity, content] = await Promise.all([
    userRepo.findById(userId),
    activityRepo.findByUserId(userId),
    contentRepo.findByAuthorId(userId),
  ]);
  if (!user) return Err(new NotFoundError('User', userId));

  return Ok({
    exportedAt: new Date().toISOString(),
    profile: { email: user.email, displayName: user.displayName, createdAt: user.createdAt },
    preferences: user.preferences,
    activity: activity.map(a => ({ action: a.action, timestamp: a.createdAt })),
    content: content.map(c => ({ title: c.title, createdAt: c.createdAt })),
  });
}
```

### 6. Validate profile updates with a schema

Profile edits pass through validation before reaching the database. Reject empty display names, invalid avatar URLs, and fields the user cannot self-edit (role, state, email without re-verification).

```ts
// ✅ Schema separates self-editable from admin-only fields
const ProfileUpdateSchema = z.object({
  displayName: z.string().min(1).max(100),
  avatarUrl: z.string().url().nullable().optional(),
});

// ❌ User can edit their own role
const ProfileUpdateSchema = z.object({
  displayName: z.string(),
  role: z.enum(['admin', 'member']),  // role escalation vulnerability
});
```

### 7. Preferences are user-owned, not admin-editable

Notification settings, theme, language, and display preferences belong to the user. Defaults are sensible. Changes take effect immediately. Admins cannot override user preferences — they can only reset to defaults with user consent.

### 8. Never expose internal user IDs in URLs

Use opaque tokens or slugs in user-facing URLs. Internal UUIDs leak information about user count and database structure. Example: `/users/k8x2m9p4` (opaque) not `/users/550e8400-e29b-41d4-...` (UUID).

### 9. Separate admin and self-service operations

Users manage their own profile, preferences, and data export. Admins manage state transitions (suspend, reactivate), role assignment, and bulk operations. The audit trail distinguishes actor type.

| Operation | Self-service | Admin |
|---|---|---|
| Edit own profile | Yes | Yes (on behalf of) |
| Change auth method | Yes | Reset only |
| Suspend account | No | Yes |
| Reactivate account | No | Yes |
| Delete account | Yes (own) | Yes (any) |
| Export data | Yes (own) | Yes (any) |
| Assign roles | No | Yes |
| View audit trail | No | Yes |

### 10. Audit every state change in the same transaction

Every state transition creates an immutable audit record atomically with the change. The record captures: who (actor ID), what (entity + previous state + new state), when (timestamp), and why (reason code or free text).

Why: audit records written outside the transaction can be lost if the transaction rolls back — leaving phantom state changes with no trail.

## Account Merging

When duplicate accounts are detected (same email, SSO linking), present the merge to the user for confirmation. Never auto-merge.

**Merge process:**
1. Identify candidate accounts (email match, SSO link)
2. Present both accounts to the user with data summaries
3. User selects the target (surviving) account
4. Transfer all owned resources from source to target within a transaction
5. Deactivate the source account (set state to `deleted`)
6. Log the merge in the audit trail with both account IDs

## Banned Patterns

- ❌ Auto-merging duplicate accounts silently → present merge to user for confirmation
- ❌ Hard deleting user rows while foreign keys reference them → anonymise PII, keep the row
- ❌ Storing passwords in plain text or reversible encryption → use bcrypt/scrypt/argon2 one-way hashing
- ❌ Self-service role escalation (user promotes themselves to admin) → role changes are admin-only operations
- ❌ Retaining PII after an erasure request beyond the compliance window → anonymise within 30 days
- ❌ Sequential integer IDs exposed in user-facing URLs → use opaque tokens or UUIDs internally only
- ❌ Boolean `isDeleted` flag without a timestamp → use `deletedAt` timestamp column
- ❌ State transitions without audit records → log every transition atomically with the change
- ❌ Collecting profile fields "just in case" at signup → request data when a feature needs it
- ❌ Admin endpoints that can override user preferences without consent → preferences are user-owned

## Quality Gate

Before delivering, verify:

- [ ] User state machine defines all valid transitions — invalid transitions are rejected with a typed error
- [ ] Soft-deleted users (`deletedAt IS NOT NULL`) are excluded from all application queries
- [ ] Right-to-erasure anonymises all PII fields and logs the action in the audit trail
- [ ] Data export produces a complete JSON file covering profile, preferences, activity, and content
- [ ] Profile update schema rejects self-service edits to role, state, or unverified email changes
- [ ] Admin operations are access-controlled and logged separately from self-service actions
- [ ] Account merge requires explicit user confirmation and transfers all resources in a transaction
- [ ] No internal user IDs appear in user-facing URLs
- [ ] Every state transition creates an immutable audit record within the same transaction
- [ ] Profile stores only fields required by current features — no speculative data collection
