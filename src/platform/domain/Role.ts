export class Role {
  constructor(
    readonly id: string,
    readonly slug: string,
    readonly name: string,
    readonly description: string,
    readonly permissions: string[],
    readonly isSystem: boolean,
    readonly userCount: number,
  ) {}

  hasPermission(p: string): boolean {
    return this.permissions.includes(p);
  }

  canBeDeleted(): boolean {
    return !this.isSystem && this.userCount === 0;
  }

  canBeEdited(): boolean {
    return !this.isSystem;
  }
}
