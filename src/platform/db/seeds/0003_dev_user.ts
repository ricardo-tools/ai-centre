/**
 * Seed 0003: Dev user with well-known UUID.
 * The SKIP_AUTH dev session uses a hardcoded UUID that must exist in the users table.
 */

import type { Seed, SeedDb } from './runner';
import { roles, users } from '../schema';
import { eq } from 'drizzle-orm';

const DEV_USER_ID = '00000000-0000-0000-0000-000000000000';

async function run(db: SeedDb): Promise<void> {
  const existing = await (db as any).select({ id: users.id }).from(users).where(eq(users.id, DEV_USER_ID)).limit(1);
  if (existing.length > 0) return;

  const [adminRole] = await (db as any).select({ id: roles.id }).from(roles).where(eq(roles.slug, 'admin')).limit(1);
  if (!adminRole) {
    console.warn('[seed:0003] No admin role — skipping dev user');
    return;
  }

  await (db as any).insert(users).values({
    id: DEV_USER_ID,
    email: 'dev@local',
    name: 'Dev User',
    roleId: adminRole.id,
  });

  console.log('[seed:0003] Dev user created');
}

export const seed: Seed = { tag: '0003_dev_user', run };
