'use client';

import { SkillDetailWidget } from '@/features/skill-detail/widgets/SkillDetailWidget/SkillDetailWidget';

interface Props {
  slug: string;
}

export function SkillDetailSlot({ slug }: Props) {
  return <SkillDetailWidget size="lg" slug={slug} />;
}
