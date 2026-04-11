/**
 * Seed 0001: System roles, permissions, and admin user.
 * These are universal baseline data required for the app to function.
 */

import type { Seed, SeedDb } from './runner';
import { roles, rolePermissions, users } from '../schema';
import { eq } from 'drizzle-orm';
import { SYSTEM_ROLE_SEEDS } from '@/platform/lib/permissions';

async function run(db: SeedDb): Promise<void> {
  // Create system roles
  const roleDefs = [
    { slug: 'admin', name: 'Administrator', description: 'Full access to all features and settings' },
    { slug: 'member', name: 'Member', description: 'Standard user — create, edit own content, generate projects' },
    { slug: 'developer', name: 'Developer', description: 'API documentation and testing access' },
  ] as const;

  for (const def of roleDefs) {
    const existing = await (db as any).select({ id: roles.id }).from(roles).where(eq(roles.slug, def.slug)).limit(1);
    if (existing.length > 0) continue;

    await (db as any).insert(roles).values({
      slug: def.slug,
      name: def.name,
      description: def.description,
      isSystem: true,
    });
  }

  // Seed permissions for each role
  for (const [roleSlug, permissions] of Object.entries(SYSTEM_ROLE_SEEDS)) {
    const [role] = await (db as any).select({ id: roles.id }).from(roles).where(eq(roles.slug, roleSlug)).limit(1);
    if (!role) continue;

    for (const permission of permissions) {
      try {
        await (db as any).insert(rolePermissions).values({ roleId: role.id, permission });
      } catch {
        // unique constraint — already exists
      }
    }
  }

  // Create system admin user
  const [adminRole] = await (db as any).select({ id: roles.id }).from(roles).where(eq(roles.slug, 'admin')).limit(1);
  if (adminRole) {
    const existing = await (db as any).select({ id: users.id }).from(users).where(eq(users.email, 'system@ai-centre.local')).limit(1);
    if (existing.length === 0) {
      await (db as any).insert(users).values({
        email: 'system@ai-centre.local',
        name: 'System',
        roleId: adminRole.id,
      });
    }
  }

  // Create dev user with well-known UUID used by SKIP_AUTH dev sessions
  if (adminRole) {
    const DEV_USER_ID = '00000000-0000-0000-0000-000000000000';
    const existing = await (db as any).select({ id: users.id }).from(users).where(eq(users.id, DEV_USER_ID)).limit(1);
    if (existing.length === 0) {
      await (db as any).insert(users).values({
        id: DEV_USER_ID,
        email: 'dev@local',
        name: 'Dev User',
        roleId: adminRole.id,
      });
    }
  }

  console.log('[seed:0001] Roles, permissions, and admin user seeded');
}

export const seed: Seed = { tag: '0001_roles_and_admin', run };
