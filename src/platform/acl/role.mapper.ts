import { Role } from '@/platform/domain/Role';

/** Raw shape from the data layer (DB row or mock). */
export interface RawRole {
  id: string;
  slug: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: string[];
  userCount: number;
  createdAt: string;
}

export function toRole(raw: RawRole): Role {
  return new Role(
    raw.id,
    raw.slug,
    raw.name,
    raw.description,
    raw.permissions,
    raw.isSystem,
    raw.userCount,
  );
}

export function toRoles(rawList: RawRole[]): Role[] {
  return rawList.map(toRole);
}
