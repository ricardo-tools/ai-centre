'use client';

import type { RenderableWidget, SizeVariant } from '@/platform/screen-renderer/types';
import type { SkillReference } from '@/features/skill-library/action';
import { useSkillDetail } from './useSkillDetail';
import { SkillDetailXS } from './SkillDetailXS';
import { SkillDetailSM } from './SkillDetailSM';
import { SkillDetailMD } from './SkillDetailMD';
import { SkillDetailLG } from './SkillDetailLG';
import type { Skill } from '@/platform/domain/Skill';
import type { ParsedSkillContent } from '@/platform/domain/ParsedSkill';

export interface SkillDetailSizeProps {
  skill: Skill;
  parsed: ParsedSkillContent;
  references: SkillReference[];
}

interface SkillDetailWidgetProps extends RenderableWidget {
  slug: string;
  mock?: boolean;
}

const SIZE_COMPONENTS: Record<SizeVariant, React.ComponentType<SkillDetailSizeProps>> = {
  xs: SkillDetailXS,
  sm: SkillDetailSM,
  md: SkillDetailMD,
  lg: SkillDetailLG,
};

const SIZE_FALLBACK: Record<SizeVariant, SizeVariant> = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

export function SkillDetailWidget({ size, slug, mock }: SkillDetailWidgetProps) {
  const { skill, parsed, references, loading } = useSkillDetail({ slug, mock });

  if (loading) {
    return (
      <div
        style={{
          padding: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-muted)',
          fontSize: 14,
        }}
      >
        Loading...
      </div>
    );
  }

  if (!skill || !parsed) {
    return (
      <div
        style={{
          padding: 24,
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: 14,
        }}
      >
        Skill not found.
      </div>
    );
  }

  const Component = SIZE_COMPONENTS[size] ?? SIZE_COMPONENTS[SIZE_FALLBACK[size]];

  return <Component skill={skill} parsed={parsed} references={references} />;
}
