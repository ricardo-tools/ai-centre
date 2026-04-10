---
name: social-features
description: >
  Defines when and how to add social features (comments, reactions, mentions,
  notifications, activity feeds) to enterprise applications. Apply when adding
  any user-to-user interaction, feedback mechanism, or awareness feature.
  Enterprise-focused — productivity over engagement loops.
---

# Social Features

Enterprise social features help people find knowledge, share feedback, and build on each other's work. They are not consumer engagement mechanics. Every feature must answer: "Does this make someone's job easier?"

---

## When to Use

Apply this skill when:
- Adding comments, reactions, or @mentions to any entity
- Building notification or activity feed systems
- Adding social proof (download counts, usage stats, favourites)
- Designing user-to-user interaction patterns in internal tools
- Evaluating which social features to implement and in what order

Do NOT use this skill for:
- Implementation details of comments and reactions — see **comments-reactions**
- Implementation details of activity feeds and notifications — see **activity-notifications**
- User profile management and lifecycle — see **user-management**
- Authentication or authorization — see **authentication** and **authorization**
- Consumer social patterns (infinite scroll, engagement loops, follower graphs)

---

## Core Rules

### 1. Enterprise social serves productivity, not engagement

Consumer social features are designed for addiction (infinite scroll, notification anxiety, social comparison). Enterprise features help people find knowledge, share feedback, and build on each other's work. If a feature doesn't make someone's job easier, don't build it.

```
// ✅ Enterprise-appropriate — answers "should I trust this?"
"Downloaded 47 times" · "Used by 12 teams" · "Last updated 3 days ago"

// ❌ Consumer engagement pattern — creates anxiety and comparison
"47 people are looking at this right now" · "You're falling behind — 3 new skills today"
```

### 2. Polymorphic by default

Comments, reactions, and activity events attach to ANY entity type via `entity_type + entity_id`. Don't build separate comment tables for skills, showcases, and projects. One comments table serves all entities. This is the most important architectural decision — it determines whether adding social features to a new entity type takes 5 minutes or 5 days.

```ts
// ✅ Polymorphic — works for any entity type
{ entityType: 'skill', entityId: '550e...', body: 'Great skill!' }
{ entityType: 'showcase', entityId: '7a3f...', body: 'Nice demo' }

// ❌ Per-entity tables — N tables for N entity types
skill_comments, showcase_comments, project_comments  // don't do this
```

### 3. Social proof is the highest-ROI feature

"Downloaded 47 times" and "Used by 12 teams" are the strongest adoption signals in internal tools. They answer "should I trust this?" before any other social feature can engage. Implement counters before comments. Counters are cheap (single column or materialised count), require no moderation, and provide immediate value.

### 4. Unlimited threading with visual depth management

Reddit-style: any comment can be replied to at any depth. Use adjacency list (`parent_id`) — each comment references its parent. Render with increasing indentation per level, but **collapse deep threads visually** after 4-5 levels to prevent unreadable narrow columns.

```ts
// ✅ Unlimited depth — any comment can have replies
{ id: 'c1', parentId: null, body: 'Top-level comment' }
{ id: 'c2', parentId: 'c1', body: 'Reply to c1' }
{ id: 'c3', parentId: 'c2', body: 'Reply to the reply' }
{ id: 'c4', parentId: 'c3', body: 'Deeper still' }
```

**Visual rules:**
- Indent replies 24px per level for the first 4 levels
- After level 4: stop indenting, show a "Continue thread →" link that opens the sub-thread in a focused view
- On mobile (< 640px): reduce indent to 16px, collapse after level 2 with "Continue thread →"
- Use a left border (2px, `var(--color-border)`) per nesting level to show thread structure

**Query pattern:** Recursive CTE to fetch full thread, or fetch flat and build tree client-side. For < 1000 comments per entity, client-side tree building from flat results is simpler and fast enough.

### 5. Constrain the reaction set

5-6 emoji maximum. A constrained set prevents fragmentation, simplifies aggregation, and avoids "which emoji do I pick" paralysis. One reaction per type per user per entity (toggle on/off).

| Emoji | Shortcode | Purpose |
|---|---|---|
| 👍 | `thumbs_up` | Agreement, approval |
| 👎 | `thumbs_down` | Disagreement, needs work |
| ❤️ | `heart` | Appreciation, love it |
| 🎉 | `celebrate` | Congratulations, milestone |
| 😕 | `confused` | Unclear, needs explanation |
| 🚀 | `rocket` | Impressive, ship it |

### 6. Mentions resolve server-side

The UI captures `@[Display Name](user-id)` format. The server validates the user ID exists and is active, stores structured mention data alongside the body text, and triggers notifications. Never trust client-provided user IDs without validation — a malicious client could mention non-existent users or trigger notifications to arbitrary accounts.

### 7. Notifications are opt-out, not opt-in

For mentions and comments on your content, notify by default. Let users dial down, not opt in. But: batch email notifications (15-minute digest, not per-event) and respect preferences stored in notification_preferences. Over-notification kills adoption faster than under-notification.

### 8. Activity feeds are per-entity, not global

"What happened on this skill recently?" is useful. "What happened everywhere?" is noise. Scope feeds to the entity the user is viewing. Global feeds only for admin dashboards where "what happened across the platform" is the actual job.

### 9. Fan-out on read for < 1000 users

Don't pre-compute feeds. Query at read time with proper indexes. Fan-out on write is for Twitter-scale (millions of followers). For enterprise tools with < 1000 users, a well-indexed query (`entity_type + entity_id + created_at DESC`) is simpler, cheaper, and easier to maintain.

### 10. Soft delete for comments, hard delete for reactions

Deleted comments show "[This comment was removed]" to preserve thread context — a reply to a deleted comment still makes sense. Reactions have no thread context — delete them outright. Both mutations require audit log entries.

### 11. No gamification

Leaderboards, badges, and points create perverse incentives in internal tools. People game metrics instead of contributing quality. Research consistently shows negative effects for knowledge-sharing in small teams. Social proof (counts) is not gamification — it's information.

```
// ✅ Social proof — factual information
"47 downloads" · "12 teams use this" · "Updated 3 days ago"

// ❌ Gamification — creates perverse incentives
"🏆 Top Contributor!" · "Level 5 Skill Author" · "3 more comments to earn a badge"
```

### 12. All social data is personal data

Comments, reactions, mentions, and notification preferences are tied to `user_id`. They must be included in GDPR data exports and anonymised on user deletion. The **user-management** skill's erasure pattern applies: anonymise the author to "Deleted User", keep the content row for referential integrity, log the action.

---

## Feature Selection Framework

Prioritise features by adoption impact relative to implementation cost. For teams under 100 users:

| Feature | Adoption impact | Impl. cost | Recommendation |
|---|---|---|---|
| Download/usage counters | High | Low | Implement first — highest ROI |
| Emoji reactions | High | Low | Implement second — low friction feedback |
| Comments (threaded) | Medium | Medium | Implement third — enables discussion |
| @Mentions | Medium | Low (on top of comments) | Add with comments |
| Activity feed (per-entity) | Medium | Medium | Implement fourth — awareness |
| In-app notifications | Medium | Medium | Add with activity feed |
| Email digests | Low | Medium | Add after in-app is validated |
| Favourites/bookmarks | Low | Low | Nice-to-have, not critical |
| Global activity feed | Low | Low | Admin dashboard only |

Build in this order. Validate each feature with real usage before adding the next.

---

## Privacy and Moderation

### Visibility

All social content (comments, reactions) is visible to all authenticated users by default. No private messages — enterprise tools should use existing channels (Slack, email) for private communication.

### Moderation

Admins can:
- Delete any comment (soft delete — shows "[This comment was removed by a moderator]")
- View deleted comments in an admin audit view
- Disable comments on specific entities (add `commentsDisabled` flag to entity)

Users can:
- Edit their own comments (within 15 minutes of posting)
- Delete their own comments (soft delete)
- Report inappropriate content (creates an audit log entry for admin review)

### GDPR compliance

- **Data export:** include all comments, reactions, and notification preferences in the user's data export
- **Right to erasure:** anonymise author on all comments/reactions, replace display name with "Deleted User", keep content for thread integrity
- **Data retention:** auto-purge read notifications older than 90 days, keep comments indefinitely (they're content, not transient data)

---

## Banned Patterns

- ❌ Separate comment tables per entity type → use polymorphic `entity_type + entity_id`
- ❌ Unlimited threading without visual collapse → indent first 4 levels, then "Continue thread →" link
- ❌ Unconstrained emoji reactions (custom emoji, any Unicode) → use a fixed set of 5-6 emoji
- ❌ Opt-in notifications (user must find settings to enable) → default to on, let users dial down
- ❌ Per-event email notifications → batch into 15-minute digests
- ❌ Global activity feeds as the primary feed → scope to the entity being viewed
- ❌ Pre-computed feed tables for < 1000 users → query at read time with indexes
- ❌ Gamification (leaderboards, badges, points) → use factual social proof (counts)
- ❌ Hard deleting comments → soft delete to preserve thread context
- ❌ Trusting client-provided user IDs in mentions → validate server-side
- ❌ Consumer engagement patterns (infinite scroll, "people are viewing this now") → enterprise features serve productivity
- ❌ Ignoring social data in GDPR exports and erasure → include all user-tied social data

---

## Quality Gate

Before delivering, verify:

- [ ] Social features serve a clear productivity purpose — no engagement-loop patterns
- [ ] Comments, reactions, and activity events use polymorphic `entity_type + entity_id` schema
- [ ] Comment threading supports unlimited depth — visual indent for first 4 levels, "Continue thread" after that
- [ ] Reaction set is constrained to 5-6 predefined emoji with one-per-type-per-user uniqueness
- [ ] Mentions are validated server-side before storing or triggering notifications
- [ ] Notifications default to on with user-controlled opt-out preferences
- [ ] Email notifications are batched (not per-event)
- [ ] Activity feeds are scoped to the entity being viewed (not global)
- [ ] Deleted comments are soft-deleted and display a placeholder message
- [ ] Social data is included in GDPR data exports and anonymised on user erasure
- [ ] No gamification elements (leaderboards, badges, points) are present
- [ ] Feature implementation follows the priority order: counters → reactions → comments → mentions → feeds → notifications
