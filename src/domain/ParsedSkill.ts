export interface SkillSection {
  title: string;
  level: number;
  content: string;
  codeBlocks: { language: string; code: string }[];
}

export class ParsedSkillContent {
  constructor(
    readonly name: string,
    readonly intro: string,
    readonly sections: SkillSection[],
    readonly keyFeatures: string[],
    readonly codeExampleCount: number,
    readonly tableCount: number,
  ) {}

  get referenceTableCount(): number {
    return Math.floor(this.tableCount / 3);
  }

  get sectionCount(): number {
    return this.sections.length;
  }
}
