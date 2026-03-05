'use client';

import type { ParsedSkillContent } from '@/domain/ParsedSkill';
import { BrandDesignShowcaseWidget } from '@/widgets/BrandDesignShowcaseWidget';
import { AppLayoutShowcaseWidget } from '@/widgets/AppLayoutShowcaseWidget';
import { FrontendArchitectureShowcaseWidget } from '@/widgets/FrontendArchitectureShowcaseWidget';
import { DesignExcellenceShowcaseWidget } from '@/widgets/DesignExcellenceShowcaseWidget';
import { PresentationShowcaseWidget } from '@/widgets/PresentationShowcaseWidget';
import { PrintDesignShowcaseWidget } from '@/widgets/PrintDesignShowcaseWidget';
import type { SizeVariant } from '@/screen-renderer/types';

const showcaseMap: Record<string, React.ComponentType<{ size: SizeVariant }>> = {
  'brand-design-system': BrandDesignShowcaseWidget,
  'app-layout': AppLayoutShowcaseWidget,
  'frontend-architecture': FrontendArchitectureShowcaseWidget,
  'design-excellence': DesignExcellenceShowcaseWidget,
  'presentation': PresentationShowcaseWidget,
  'print-design': PrintDesignShowcaseWidget,
};

interface SkillInPracticeProps {
  slug: string;
  parsed: ParsedSkillContent;
  size?: SizeVariant;
}

export function SkillInPractice({ slug, size = 'lg' }: SkillInPracticeProps) {
  const ShowcaseWidget = showcaseMap[slug];
  if (!ShowcaseWidget) {
    return (
      <div style={{ padding: 24, color: 'var(--color-text-muted)', fontSize: 14 }}>
        No showcase available for this skill.
      </div>
    );
  }
  return <ShowcaseWidget size={size} />;
}
