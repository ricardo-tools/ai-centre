'use server';

import { getAllSkills, getSkillBySlug } from '@/lib/skills';
import { parseSkillContent } from '@/lib/parse-skill';
import type { RawSkillData } from '@/acl/skill.mapper';

export async function fetchAllSkills(): Promise<RawSkillData[]> {
  return getAllSkills();
}

export async function fetchSkillBySlug(slug: string): Promise<RawSkillData | null> {
  return getSkillBySlug(slug);
}

export async function fetchSkillWithParsed(slug: string): Promise<{
  skill: RawSkillData;
  parsed: ReturnType<typeof parseSkillContent>;
} | null> {
  const skill = getSkillBySlug(slug);
  if (!skill) return null;

  const parsed = parseSkillContent(skill.content);
  return { skill, parsed };
}
