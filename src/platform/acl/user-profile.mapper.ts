import { UserProfile } from '@/platform/domain/UserProfile';

/** Raw shape from the data layer (DB row or mock). */
export interface RawUserProfile {
  id: string;
  email: string;
  name: string;
  roleId: string;
  roleName: string;
  roleSlug: string;
  isActive: boolean;
  createdAt: string;
}

export function toUserProfile(raw: RawUserProfile): UserProfile {
  return new UserProfile(
    raw.id,
    raw.email,
    raw.name,
    raw.roleId,
    raw.roleName,
    raw.roleSlug,
    raw.isActive,
    new Date(raw.createdAt),
  );
}

export function toUserProfiles(rawList: RawUserProfile[]): UserProfile[] {
  return rawList.map(toUserProfile);
}
