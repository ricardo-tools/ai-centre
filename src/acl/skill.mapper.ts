import { Skill } from '@/domain/Skill';

/** Raw shape from the data layer (src/lib/skills.ts). When we move to DB, only this file changes. */
export interface RawSkillData {
  slug: string;
  title: string;
  description: string;
  isOfficial: boolean;
  version: string;
  content: string;
}

export function toSkill(raw: RawSkillData): Skill {
  return new Skill(
    raw.slug,
    raw.title,
    raw.description,
    raw.isOfficial,
    raw.version,
    raw.content,
  );
}

export function toSkills(rawList: RawSkillData[]): Skill[] {
  return rawList.map(toSkill);
}
