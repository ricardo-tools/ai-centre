'use client';

import type { ParsedSkill } from '@/lib/parse-skill';
import { BrandDesignShowcase } from './showcases/BrandDesignShowcase';
import { AppLayoutShowcase } from './showcases/AppLayoutShowcase';
import { DesignExcellenceShowcase } from './showcases/DesignExcellenceShowcase';
import { FrontendArchitectureShowcase } from './showcases/FrontendArchitectureShowcase';
import { PrintDesignShowcase } from './showcases/PrintDesignShowcase';
import { PresentationShowcase } from './showcases/PresentationShowcase';

interface Props {
  slug: string;
  parsed: ParsedSkill;
}

const SHOWCASES: Record<string, React.ComponentType> = {
  'brand-design-system': BrandDesignShowcase,
  'app-layout': AppLayoutShowcase,
  'design-excellence': DesignExcellenceShowcase,
  'frontend-architecture': FrontendArchitectureShowcase,
  'presentation': PresentationShowcase,
  'print-design': PrintDesignShowcase,
};

export function SkillInPractice({ slug }: Props) {
  const Showcase = SHOWCASES[slug];

  if (!Showcase) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-muted)', border: '1px dashed var(--color-border)', borderRadius: 8 }}>
        Visual showcase not yet available for this skill. Use the &quot;View SKILL.md&quot; tab to see the full specification.
      </div>
    );
  }

  return <Showcase />;
}
