export class Skill {
  constructor(
    readonly slug: string,
    readonly title: string,
    readonly description: string,
    readonly isOfficial: boolean,
    readonly version: string,
    readonly content: string,
  ) {}

  get hasContent(): boolean {
    return this.content.length > 0;
  }

  get downloadFilename(): string {
    return `${this.slug}-SKILL.md`;
  }

  formatVersion(locale: string): string {
    return `v${this.version}`;
  }
}
