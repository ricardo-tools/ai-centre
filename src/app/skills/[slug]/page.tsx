import { notFound } from 'next/navigation';
import { getSkillBySlug, getAllSkills } from '@/lib/skills';
import { parseSkillContent } from '@/lib/parse-skill';
import { SkillDetailClient } from './SkillDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSkills().map((skill) => ({ slug: skill.slug }));
}

export default async function SkillDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) notFound();

  const parsed = parseSkillContent(skill.content);

  return (
    <SkillDetailClient
      skill={skill}
      parsed={parsed}
    />
  );
}
