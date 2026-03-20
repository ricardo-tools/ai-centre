'use server';

import { getAllSkills, getSkillBySlug } from '@/platform/lib/skills';
import { parseSkillContent } from '@/platform/lib/parse-skill';
import type { RawSkillData } from '@/platform/acl/skill.mapper';
import { type Result, Ok, Err, NotFoundError } from '@/platform/lib/result';
import type { ParsedSkill } from '@/platform/lib/parse-skill';

export async function fetchAllSkills(): Promise<Result<RawSkillData[], Error>> {
  return Ok(getAllSkills());
}

export async function fetchSkillBySlug(slug: string): Promise<Result<RawSkillData, NotFoundError>> {
  const skill = getSkillBySlug(slug);
  if (!skill) return Err(new NotFoundError('Skill', slug));
  return Ok(skill);
}

export async function fetchSkillWithParsed(slug: string): Promise<Result<{
  skill: RawSkillData;
  parsed: ParsedSkill;
}, NotFoundError>> {
  const skill = getSkillBySlug(slug);
  if (!skill) return Err(new NotFoundError('Skill', slug));

  const parsed = parseSkillContent(skill.content);
  return Ok({ skill, parsed });
}
