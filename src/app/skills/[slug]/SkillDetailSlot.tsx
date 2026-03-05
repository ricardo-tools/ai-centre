'use client';

import { SkillDetailWidget } from '@/widgets/SkillDetailWidget/SkillDetailWidget';

interface Props {
  slug: string;
}

export function SkillDetailSlot({ slug }: Props) {
  return <SkillDetailWidget size="lg" slug={slug} />;
}
