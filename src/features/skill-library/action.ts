'use server';

import { getAllSkills, getSkillBySlug, getReferencesFor } from '@/platform/lib/skills';
import { parseSkillContent } from '@/platform/lib/parse-skill';
import type { RawSkillData } from '@/platform/acl/skill.mapper';
import { type Result, Ok, Err, NotFoundError } from '@/platform/lib/result';
import type { ParsedSkill } from '@/platform/lib/parse-skill';

export interface SkillReference {
  filename: string;
  content: string;
}

export async function fetchAllSkills(): Promise<Result<RawSkillData[], Error>> {
  const skills = getAllSkills();
  console.log(`[skill-library] fetchAllSkills: ${skills.length} skills, ${skills.filter(s => s.content.length > 0).length} with content`);
  return Ok(skills);
}

export async function fetchSkillBySlug(slug: string): Promise<Result<RawSkillData, NotFoundError>> {
  const skill = getSkillBySlug(slug);
  if (!skill) return Err(new NotFoundError('Skill', slug));
  return Ok(skill);
}

export async function fetchSkillWithParsed(slug: string): Promise<Result<{
  skill: RawSkillData;
  parsed: ParsedSkill;
  references: SkillReference[];
}, NotFoundError>> {
  console.log(`[skill-library] fetchSkillWithParsed: slug=${slug}`);
  const skill = getSkillBySlug(slug);
  if (!skill) {
    console.warn(`[skill-library] fetchSkillWithParsed: skill not found for slug=${slug}`);
    return Err(new NotFoundError('Skill', slug));
  }

  const parsed = parseSkillContent(skill.content);
  const references = getReferencesFor(slug);
  console.log(`[skill-library] fetchSkillWithParsed: slug=${slug} content=${skill.content.length}b sections=${parsed.sections.length} refs=${references.length}`);
  return Ok({ skill, parsed, references });
}
