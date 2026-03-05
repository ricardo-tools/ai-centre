import { getAllSkills } from '@/lib/skills';
import { ScreenRenderer } from '@/screen-renderer/ScreenRenderer';
import { skillDetailConfig } from '@/screens/SkillDetail/SkillDetail.screen';
import { SkillDetailSlot } from './SkillDetailSlot';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSkills().map((skill) => ({ slug: skill.slug }));
}

export default async function SkillDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <ScreenRenderer
      config={skillDetailConfig}
      slots={{
        detail: <SkillDetailSlot slug={slug} />,
      }}
    />
  );
}
