export class UserProfile {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly name: string,
    readonly roleId: string,
    readonly roleName: string,
    readonly roleSlug: string,
    readonly isActive: boolean,
    readonly createdAt: Date,
  ) {}

  isAdmin(): boolean {
    return this.roleSlug === 'admin';
  }

  canBeDeactivated(currentUserId: string): boolean {
    return this.id !== currentUserId;
  }
}
