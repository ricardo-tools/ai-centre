export class Archetype {
  constructor(
    readonly slug: string,
    readonly title: string,
    readonly description: string,
    readonly skills: string[],
    readonly icon: string,
  ) {}

  get skillCount(): number {
    return this.skills.length;
  }

  hasSkill(slug: string): boolean {
    return this.skills.includes(slug);
  }
}
