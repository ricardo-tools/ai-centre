/**
 * Base Data — Single Source of Truth
 *
 * This object defines ALL seed data for E2E tests.
 * - Global setup reads it to generate SQL INSERT statements.
 * - Tests import it for zero-query assertions.
 *
 * If you need to change seed data, update ONLY this file.
 * The global setup and all tests automatically follow.
 */

export const BASE = {
  // ── Test environment ───────────────────────────────────────────────

  /** Domain used for all test cookies */
  domain: 'localhost',

  /** Cookie name for dev identity switching */
  identityCookie: 'dev-identity',

  // ── Users ──────────────────────────────────────────────────────────

  users: {
    admin: {
      id: '00000000-0000-0000-0000-000000000000',
      email: 'dev@local',
      name: 'Dev User',
      roleSlug: 'admin',
    },
    member: {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'member@test.local',
      name: 'Test Member',
      roleSlug: 'member',
    },
  },

  // ── Upvotes ────────────────────────────────────────────────────────
  // Admin user upvotes the first 5 skills (alphabetically by slug)

  upvotedSkillSlugs: [
    'accessibility',
    'activity-notifications',
    'ai-capabilities',
    'ai-claude',
    'ai-fal',
  ] as readonly string[],

  // ── Bookmarks ──────────────────────────────────────────────────────
  // Admin user bookmarks the first 3 skills

  bookmarkedSkillSlugs: [
    'accessibility',
    'activity-notifications',
    'ai-capabilities',
  ] as readonly string[],

  // ── Comments ───────────────────────────────────────────────────────
  // Comments on the first skill (accessibility) — 2 top-level + 1 reply

  comments: {
    firstSkill: {
      slug: 'accessibility',
      adminComment: {
        body: 'Base comment from admin user',
        authorId: '00000000-0000-0000-0000-000000000000',
      },
      memberComment: {
        body: 'Base comment from member user',
        authorId: '00000000-0000-0000-0000-000000000002',
      },
      memberReply: {
        body: 'Base reply from member user',
        authorId: '00000000-0000-0000-0000-000000000002',
        parentBody: 'Base comment from admin user', // reply to admin's comment
      },
    },
    secondSkill: {
      slug: 'activity-notifications',
      adminComment: {
        body: 'Comment on second skill',
        authorId: '00000000-0000-0000-0000-000000000000',
      },
    },
  },

  // ── Helper methods ─────────────────────────────────────────────────

  /** How many upvotes a skill has in base data (0 or 1) */
  upvoteCount(slug: string): number {
    return this.upvotedSkillSlugs.includes(slug) ? 1 : 0;
  },

  /** Whether a skill is bookmarked in base data */
  isBookmarked(slug: string): boolean {
    return this.bookmarkedSkillSlugs.includes(slug);
  },

  // ── SQL generation (used by global-setup) ──────────────────────────

  /** Generate all seed SQL statements from this object */
  toSeedStatements(): string[] {
    const stmts: string[] = [];
    const adminId = this.users.admin.id;
    const memberId = this.users.member.id;

    // Users (roles are seeded separately since they use gen_random_uuid)
    for (const user of Object.values(this.users)) {
      stmts.push(
        `INSERT INTO users (id, email, name, role_id, is_active) VALUES ('${user.id}', '${user.email}', '${user.name}', (SELECT id FROM roles WHERE slug = '${user.roleSlug}'), true) ON CONFLICT (id) DO NOTHING;`,
      );
    }

    // Upvotes
    for (const slug of this.upvotedSkillSlugs) {
      stmts.push(
        `INSERT INTO reactions (entity_type, entity_id, user_id, emoji) VALUES ('skill', '${slug}', '${adminId}', 'thumbsup') ON CONFLICT DO NOTHING;`,
      );
    }

    // Bookmarks
    for (const slug of this.bookmarkedSkillSlugs) {
      stmts.push(
        `INSERT INTO bookmarks (user_id, entity_type, entity_id) VALUES ('${adminId}', 'skill', '${slug}') ON CONFLICT DO NOTHING;`,
      );
    }

    // Comments on first skill
    const c = this.comments.firstSkill;
    stmts.push(
      `INSERT INTO comments (entity_type, entity_id, author_id, body) VALUES ('skill', '${c.slug}', '${c.adminComment.authorId}', '${c.adminComment.body}') ON CONFLICT DO NOTHING;`,
    );
    stmts.push(
      `INSERT INTO comments (entity_type, entity_id, author_id, body) VALUES ('skill', '${c.slug}', '${c.memberComment.authorId}', '${c.memberComment.body}') ON CONFLICT DO NOTHING;`,
    );
    // Reply to admin's comment
    stmts.push(
      `INSERT INTO comments (entity_type, entity_id, parent_id, author_id, body) SELECT 'skill', '${c.slug}', id, '${c.memberReply.authorId}', '${c.memberReply.body}' FROM comments WHERE body = '${c.memberReply.parentBody}' AND entity_id = '${c.slug}' LIMIT 1 ON CONFLICT DO NOTHING;`,
    );

    // Comment on second skill
    const c2 = this.comments.secondSkill;
    stmts.push(
      `INSERT INTO comments (entity_type, entity_id, author_id, body) VALUES ('skill', '${c2.slug}', '${c2.adminComment.authorId}', '${c2.adminComment.body}') ON CONFLICT DO NOTHING;`,
    );

    return stmts;
  },

  /** Generate seed payload for the test-setup API (used by global-setup via server) */
  toSeedPayload(): Record<string, Record<string, unknown>[]> {
    const adminId = this.users.admin.id;

    return {
      reactions: this.upvotedSkillSlugs.map((slug) => ({
        entity_type: 'skill',
        entity_id: slug,
        user_id: adminId,
        emoji: 'thumbsup',
      })),
      bookmarks: this.bookmarkedSkillSlugs.map((slug) => ({
        user_id: adminId,
        entity_type: 'skill',
        entity_id: slug,
      })),
      comments: [
        {
          entity_type: 'skill',
          entity_id: this.comments.firstSkill.slug,
          author_id: this.comments.firstSkill.adminComment.authorId,
          body: this.comments.firstSkill.adminComment.body,
        },
        {
          entity_type: 'skill',
          entity_id: this.comments.firstSkill.slug,
          author_id: this.comments.firstSkill.memberComment.authorId,
          body: this.comments.firstSkill.memberComment.body,
        },
        {
          entity_type: 'skill',
          entity_id: this.comments.secondSkill.slug,
          author_id: this.comments.secondSkill.adminComment.authorId,
          body: this.comments.secondSkill.adminComment.body,
        },
      ],
    };
  },
};
