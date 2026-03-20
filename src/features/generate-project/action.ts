'use server';

import { getAllSkills } from '@/platform/lib/skills';
import { generateProjectZip } from '@/platform/lib/generate-project-zip';
import { Skill } from '@/platform/domain/Skill';
import { DOMAINS } from '@/platform/lib/toolkit-composition';
import { type Result, Ok, Err, AuthError } from '@/platform/lib/result';
import { requireAuth } from '@/platform/lib/guards';

interface GenerateProjectInput {
  domainSlug: string;
  resolvedSkills: string[];
  description: string;
}

export async function generateProject(input: GenerateProjectInput): Promise<Result<{ zipBase64: string; fileName: string }, Error>> {
  const authResult = await requireAuth();
  if (!authResult.ok) return Err(new AuthError('unauthenticated', 'You must be logged in to generate projects'));

  try {
    const allSkills = getAllSkills();

    const selectedSkillObjects: Skill[] = input.resolvedSkills
      .map(slug => {
        const data = allSkills.find(s => s.slug === slug);
        if (!data) return null;
        return new Skill(data.slug, data.title, data.description, data.isOfficial, data.version, data.content, data.tags);
      })
      .filter((s): s is Skill => s !== null);

    const domain = DOMAINS.find(d => d.slug === input.domainSlug);
    const domainTitle = domain?.title ?? input.domainSlug;

    const zip = await generateProjectZip({
      archetypeName: `${domainTitle} Project`,
      archetypeDescription: domain?.description ?? '',
      selectedSkills: selectedSkillObjects,
      userDescription: input.description,
      includeTemplate: input.domainSlug === 'presentation',
    });

    // Convert Blob to base64 for transport over server action boundary
    const arrayBuffer = await zip.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return Ok({
      zipBase64: base64,
      fileName: `${input.domainSlug}-project.zip`,
    });
  } catch (err) {
    console.error('[generate-project] generateProject failed:', err);
    return Err(new Error('Project generation failed. Please try again.'));
  }
}
