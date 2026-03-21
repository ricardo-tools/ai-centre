# Social Features Plan — AI Centre

## BLUF

Add social features to the AI Centre in 4 phases, prioritised by adoption impact and implementation cost. Phase 1 (social proof + ownership) delivers the highest ROI with minimal effort. Phase 2 (reactions + bookmarks) adds lightweight engagement. Phase 3 (comments + notifications) adds conversation. Phase 4 (user profiles + analytics) builds community identity.

**Key research finding:** Standalone social features that require extra effort (rate, review, comment) have low engagement. Social signals that emerge from existing actions (downloading, using, generating) succeed. Prioritise passive social proof over active social interaction.

---

## Intent

Every skill, toolkit, and showcase has visible signals of quality, ownership, and usage — so users can trust what they're selecting, find what others value, and build on each other's work. The social layer serves productivity, not engagement.

---

## Research Summary

| Platform | What works | What doesn't |
|---|---|---|
| **npm** | Download counts are THE trust signal | No reviews — spawned external tools to fill the gap |
| **VS Code** | Install counts + verified publisher badges | Q&A section has low engagement |
| **Figma Community** | Likes + usage counts + creator profiles | Comments are mostly "thank you" |
| **Backstage (Spotify)** | Ownership + quality scorecards | No social features needed — transparency is the mechanism |
| **GitHub** | Stars + contributor count + dependency graph | Marketplace-specific social features barely used |
| **Bit.dev** | "Used by X components" (dependency graph) | Deliberately skipped likes/comments |

**Pattern:** Download/usage counts → ownership → quality signals → reactions → comments (in that order of impact).

**Cold start:** Never show "0 reviews" or "0 likes". Hide metrics until they have data. Pre-seed with official content. Social features emerge from existing actions (downloads, project generation).

---

## Phase 1: Social Proof + Ownership (HIGH impact, LOW effort)

**What:** Add download/usage counts, author attribution, and quality signals to every entity.

### Schema changes

```
skill_downloads (id, skill_id, user_id, context, created_at)
  — context: 'detail_download' | 'project_generation' | 'api'
  — index on (skill_id) for count aggregation

showcase_views (id, showcase_id, user_id, viewed_at)
  — index on (showcase_id) for count aggregation

project_generations (update existing generated_projects)
  — already tracks skillIds — use this for "used in X projects"
```

### UI changes

| Page | Change | Details |
|---|---|---|
| **SkillCard** | Add author + download count | Footer: "By [Author] · [version]" left, "↓ 47" right |
| **Skill Detail** | Add author profile + stats | Below title: author avatar + name + link. Stats row: add "Downloads" and "Used in X projects" |
| **Skill Detail** | Add "Related skills" | Below content: 3-4 cards from same domain/layer, or companion skills |
| **ToolkitCard** | Add usage count | Below skill count: "Used 23 times" |
| **Gallery cards** | Add view count | Footer: "👁 347 views" |
| **Homepage stats** | Add social stats | Extend: "60 skills · 5 toolkits · 6 domains · X projects generated" |
| **Homepage skill spotlights** | Add author | Below title: "By [Author]" |

### Server action changes

- `downloadSkill(slug)` — increment skill_downloads, return file
- `viewShowcase(id)` — increment showcase_views on page load
- `getSkillStats(slug)` — returns { downloads, projectsUsedIn, relatedSlugs }
- `getShowcaseStats(id)` — returns { views }

### Quality signals (no DB needed)

- **"Official" badge** — already exists (isOfficial flag)
- **Skill completeness indicator** — compute from skill content: has examples? has reference companion? has banned patterns? has quality gate? Show as a small progress ring or "Complete" badge
- **"Recently updated" badge** — if version published in last 30 days
- **"Trending" badge** — if download rate increased 50%+ in last 7 days vs previous 7

**Gate:** Every skill card shows author + download count. Every showcase shows view count. Stats are accurate.

---

## Phase 2: Reactions + Bookmarks (MEDIUM impact, LOW effort)

**What:** Lightweight engagement — react to showcases, bookmark skills for later.

### Schema changes

```
reactions (id, entity_type, entity_id, user_id, emoji, created_at)
  — entity_type: 'showcase' | 'skill' | 'comment' (future)
  — UNIQUE(entity_type, entity_id, user_id, emoji)
  — emoji constrained to: 'thumbsup', 'heart', 'rocket', 'eyes', 'tada'

bookmarks (id, user_id, entity_type, entity_id, created_at)
  — entity_type: 'skill' | 'toolkit' | 'showcase'
  — UNIQUE(user_id, entity_type, entity_id)
```

### UI changes

| Page | Change | Details |
|---|---|---|
| **Showcase viewer** | Reaction bar | Below detail bar: 5 emoji buttons with counts. Toggle on/off. "👍 12 · ❤️ 8 · 🚀 5" |
| **Showcase cards** | Reaction summary | Footer: total reaction count "12 reactions" |
| **Skill Detail** | Bookmark button | Header: heart/bookmark icon toggle. "Saved" state |
| **SkillCard** | Bookmark icon | Top-right corner, small heart/bookmark on hover |
| **Skills Library** | "My Bookmarks" tab | New tab alongside All/Foundation/Domains/Features/Implementation |
| **Gallery** | Sort by reactions | "Most loved" sort option alongside search |

### Server actions

- `toggleReaction(entityType, entityId, emoji)` — add or remove, return updated counts
- `toggleBookmark(entityType, entityId)` — add or remove
- `getMyBookmarks()` — return all bookmarked entities for current user
- `getReactionCounts(entityType, entityId)` — return { emoji: count } map + whether current user reacted

**Gate:** Reactions work on showcases. Bookmarks work on skills. "My Bookmarks" tab shows saved skills.

---

## Phase 3: Comments + Notifications (HIGH impact, HIGH effort)

**What:** Threaded comments on skills and showcases. @Mentions. In-app + email notifications.

### Schema changes

Per the `comments-reactions` and `activity-notifications` skills:

```
comments (id, entity_type, entity_id, parent_id, author_id, body, mentions, created_at, updated_at, deleted_at)
  — entity_type: 'skill' | 'showcase'
  — parent_id: NULL = top-level, non-null = reply (unlimited depth, Reddit-style)
  — mentions: jsonb [{userId, offset, length}]

activity_events (id, entity_type, entity_id, actor_id, action, metadata, created_at)
  — action: 'commented', 'reacted', 'published', 'downloaded', 'uploaded', 'mentioned'

notifications (id, user_id, type, entity_type, entity_id, actor_id, title, body, read_at, emailed_at, created_at)

notification_preferences (id, user_id, type, channel, enabled)
  — channel: 'in_app' | 'email'
```

### UI changes

| Page | Change | Details |
|---|---|---|
| **Skill Detail** | Comments section | Below content: Reddit-style threaded comments (unlimited depth, visual collapse after level 4), @mention autocomplete, edit (15 min window), soft delete |
| **Showcase viewer** | Comments section | Below preview: same comment component |
| **TopNav** | Notification bell | Right side: bell icon with unread count badge. Dropdown: notification list with mark-as-read |
| **Notification preferences** | Settings page | `/settings/notifications` — per-type per-channel toggles |
| **Admin** | Comment moderation | New tab or section: all comments, filter by entity, delete with reason |

### Server actions

- `addComment(entityType, entityId, body, parentId?)` — auth + mention extraction + notification creation
- `editComment(commentId, body)` — owner only, within 15 min
- `deleteComment(commentId)` — owner + admin, soft delete
- `getComments(entityType, entityId)` — threaded (top-level + replies)
- `getNotifications(limit, offset)` — current user's notifications
- `markNotificationRead(id)` — mark single as read
- `markAllNotificationsRead()` — mark all as read
- `updateNotificationPreferences(prefs)` — upsert preferences

### Email digest (Vercel Cron)

- Every 15 minutes: collect unread un-emailed notifications → group by user → send digest via Mailgun → mark as emailed
- Digest email: branded template with notification list, link to each entity

### Notification triggers

| Event | Notifies | Type |
|---|---|---|
| Comment on your skill | Skill author | `comment_on_owned` |
| Comment on your showcase | Showcase author | `comment_on_owned` |
| Reply to your comment | Comment author | `reply_to_comment` |
| @Mention in a comment | Mentioned user | `mention` |
| Skill you bookmarked updated | Bookmark owner | `bookmarked_updated` |

**Gate:** Comments work on skills and showcases. Notifications arrive in-app. Email digest sends every 15 min. Preferences are editable.

---

## Phase 4: User Profiles + Community Analytics (MEDIUM impact, MEDIUM effort)

**What:** Creator identity, contribution history, community health metrics.

### Schema changes

```
user_profiles (user_id PK, bio, specialties jsonb, links jsonb, updated_at)
  — specialties: domain/layer tags the user focuses on
  — links: [{label, url}] for external profiles
```

### UI changes

| Page | Change | Details |
|---|---|---|
| **New: `/profile/[userId]`** | User profile page | Avatar, name, bio, specialties badges. "Skills authored" grid. "Showcases uploaded" grid. "Projects generated" count. Activity timeline. |
| **All author names** | Clickable | Every author name across the app links to `/profile/[userId]` |
| **Admin** | Community analytics tab | Top downloaded skills chart. Most active contributors. Showcase upload trends. User engagement stats (active users/week). |
| **Homepage** | Top contributors | Optional: "Active contributors" section showing 3-5 avatars |

### Server actions

- `getProfile(userId)` — public profile data + authored skills + uploaded showcases + stats
- `updateMyProfile(bio, specialties, links)` — self-service
- `getCommunityAnalytics()` — admin only, aggregated stats

**Gate:** Profile pages work. Author names are clickable. Admin analytics tab shows community health.

---

## Implementation Order

```
Phase 1 (Social Proof)     ██████████ 2-3 days
  [parallel: schema + API | UI changes]
  Gate: counts visible on all cards

Phase 2 (Reactions)        ████████ 2 days
  [parallel: reactions | bookmarks]
  Gate: reactions + bookmarks functional

Phase 3 (Comments)         ████████████████ 4-5 days
  [sequential: schema → server actions → UI → notifications → email digest]
  Gate: comments + notifications + digest working

Phase 4 (Profiles)         ██████████ 2-3 days
  [parallel: profile page | analytics tab]
  Gate: profiles + analytics working
```

**Total: ~12 days of work across 4 phases.**

---

## What We're NOT Building (and why)

| Feature | Why skip |
|---|---|
| **Star/like system** | npm's stars are broken and unused. Bit.dev deliberately omitted them. Reactions on showcases are enough. |
| **Ratings/reviews** | High cold-start risk. VS Code's Q&A has low engagement. Figma's comments are "thank you." Download counts are a better quality signal. |
| **Forums/discussion threads** | Slack already fills this. Duplicating it fragments conversation. |
| **Leaderboards/gamification** | Research shows negative effects in internal tools (perverse incentives, gaming). |
| **Real-time collaboration** | Skills are authored individually. Presence indicators add complexity without matching the use case. |
| **Following users** | <100 users. Bookmarking entities is more useful than following people. |
| **Global activity feed** | Low engagement on every platform studied. Per-entity feeds only. |

---

## Risks

1. **Cold start** — Phase 1 counts will be zero for all skills initially. Mitigation: hide counts below a threshold (show "New" badge instead of "0 downloads"). Pre-seed by tracking historical project generations retroactively.
2. **Comment quality** — Internal tool comments tend toward "thank you" not substance. Mitigation: prompt for specific feedback ("What would make this skill more useful?"). Don't over-invest in comments until Phase 1-2 prove engagement.
3. **Notification fatigue** — Over-notification kills adoption. Mitigation: batch email digests (never per-event), respect preferences, start with opt-out defaults only for high-signal events (mentions, replies).
4. **Schema migration** — 4 new tables in Phase 1, 4 more in Phase 3. Mitigation: auto-migration runs on deploy, all tables are additive (no existing table changes).

---

## Skills to activate for implementation

- **social-features** — principle skill for all phases
- **comments-reactions** — Phase 2-3 implementation
- **activity-notifications** — Phase 3 implementation
- **social-features-reference** — schema templates for all phases
- **backend-patterns** — server action patterns, Result type
- **frontend-architecture** — widget pattern for new components
- **brand-design-system** — visual tokens for reaction bars, badges
- **design-foundations** — spacing, hierarchy for new UI elements
- **database-design** — schema patterns, indexing
- **db-neon-drizzle** — Drizzle-specific implementation
