export class ToolkitComposition {
  constructor(
    readonly domainSlug: string,
    readonly domainTitle: string,
    readonly addonSlugs: readonly string[],
    readonly implementationChoices: Readonly<Record<string, string | null>>,
    readonly resolvedSkills: readonly string[],
  ) {}

  get skillCount(): number {
    return this.resolvedSkills.length;
  }

  hasSkill(slug: string): boolean {
    return this.resolvedSkills.includes(slug);
  }

  hasAddon(slug: string): boolean {
    return this.addonSlugs.includes(slug);
  }

  toSkillSlugs(): string[] {
    return [...this.resolvedSkills];
  }
}
