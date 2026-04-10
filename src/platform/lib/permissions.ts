/**
 * Permission system — defines all available permissions as code-level building blocks.
 * Permissions are assigned to roles via the `role_permissions` DB table.
 *
 * This file defines WHAT permissions exist (the registry).
 * The DB defines WHO has them (role → permission assignments).
 * Guards enforce them at runtime.
 */

export type Permission =
  // Skills
  | 'skill:create'
  | 'skill:edit'
  | 'skill:delete'
  | 'skill:publish'
  // Archetypes
  | 'archetype:create'
  | 'archetype:edit'
  | 'archetype:delete'
  | 'archetype:publish'
  // Showcases
  | 'showcase:upload'
  | 'showcase:delete'
  // Projects
  | 'project:generate'
  // Users
  | 'user:list'
  | 'user:edit-role'
  | 'user:deactivate'
  | 'user:invite'
  // Roles
  | 'role:create'
  | 'role:edit'
  | 'role:delete'
  // Audit
  | 'audit:view';

export type PermissionCategory = 'Skills' | 'Archetypes' | 'Showcases' | 'Projects' | 'Users' | 'Roles' | 'Audit';

export interface PermissionMeta {
  key: Permission;
  label: string;
  description: string;
  category: PermissionCategory;
}

/** All available permissions with human-readable metadata. Source of truth for the Permissions tab. */
export const PERMISSION_REGISTRY: PermissionMeta[] = [
  { key: 'skill:create', label: 'Create skills', description: 'Create new skill definitions', category: 'Skills' },
  { key: 'skill:edit', label: 'Edit skills', description: 'Edit skill content (own skills for non-admins)', category: 'Skills' },
  { key: 'skill:delete', label: 'Delete skills', description: 'Delete any skill', category: 'Skills' },
  { key: 'skill:publish', label: 'Publish skills', description: 'Publish skills to the library', category: 'Skills' },
  { key: 'archetype:create', label: 'Create archetypes', description: 'Create new project archetypes', category: 'Archetypes' },
  { key: 'archetype:edit', label: 'Edit archetypes', description: 'Edit archetype content (own for non-admins)', category: 'Archetypes' },
  { key: 'archetype:delete', label: 'Delete archetypes', description: 'Delete any archetype', category: 'Archetypes' },
  { key: 'archetype:publish', label: 'Publish archetypes', description: 'Publish archetypes to the library', category: 'Archetypes' },
  { key: 'showcase:upload', label: 'Upload showcases', description: 'Upload project showcases to the gallery', category: 'Showcases' },
  { key: 'showcase:delete', label: 'Delete showcases', description: 'Delete showcases (own for non-admins)', category: 'Showcases' },
  { key: 'project:generate', label: 'Generate projects', description: 'Generate and download project ZIPs', category: 'Projects' },
  { key: 'user:list', label: 'View users', description: 'View the user list in admin', category: 'Users' },
  { key: 'user:edit-role', label: 'Change user roles', description: 'Assign roles to users', category: 'Users' },
  { key: 'user:deactivate', label: 'Deactivate users', description: 'Activate or deactivate user accounts', category: 'Users' },
  { key: 'user:invite', label: 'Invite users', description: 'Send email invitations to new users', category: 'Users' },
  { key: 'role:create', label: 'Create roles', description: 'Create custom roles', category: 'Roles' },
  { key: 'role:edit', label: 'Edit roles', description: 'Edit custom role permissions', category: 'Roles' },
  { key: 'role:delete', label: 'Delete roles', description: 'Delete custom roles (not system roles)', category: 'Roles' },
  { key: 'audit:view', label: 'View audit log', description: 'View the system audit log', category: 'Audit' },
];

/** All permission keys as a flat array */
export const ALL_PERMISSIONS: Permission[] = PERMISSION_REGISTRY.map((p) => p.key);

/** Permissions grouped by category — for the admin Permissions tab and role editor checklist */
export function getPermissionsByCategory(): Record<string, PermissionMeta[]> {
  const grouped: Record<string, PermissionMeta[]> = {};
  for (const p of PERMISSION_REGISTRY) {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  }
  return grouped;
}

/**
 * Default permission sets for seeding system roles.
 * Used ONLY by the seed script — runtime checks read from the DB.
 */
export const SYSTEM_ROLE_SEEDS = {
  admin: ALL_PERMISSIONS,
  member: [
    'skill:create',
    'skill:edit',
    'archetype:create',
    'archetype:edit',
    'showcase:upload',
    'showcase:delete',
    'project:generate',
  ] as Permission[],
  developer: [
    'skill:create',
    'skill:edit',
    'showcase:upload',
    'project:generate',
  ] as Permission[],
};

/** Check if a session can access a resource (owner or admin role) */
export function canAccessResource(
  session: { userId: string; roleSlug: string },
  resource: { authorId: string },
): boolean {
  if (session.roleSlug === 'admin') return true;
  return session.userId === resource.authorId;
}
