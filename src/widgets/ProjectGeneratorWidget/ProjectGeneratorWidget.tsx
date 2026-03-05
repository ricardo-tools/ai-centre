'use client';

import type { RenderableWidget, SizeVariant } from '@/screen-renderer/types';
import { useProjectGenerator } from './useProjectGenerator';
import { ProjectGeneratorXS } from './ProjectGeneratorXS';
import { ProjectGeneratorSM } from './ProjectGeneratorSM';
import { ProjectGeneratorMD } from './ProjectGeneratorMD';
import { ProjectGeneratorLG } from './ProjectGeneratorLG';

interface ProjectGeneratorWidgetProps extends RenderableWidget {
  mock?: boolean;
}

const SIZE_COMPONENTS: Record<SizeVariant, typeof ProjectGeneratorXS> = {
  xs: ProjectGeneratorXS,
  sm: ProjectGeneratorSM,
  md: ProjectGeneratorMD,
  lg: ProjectGeneratorLG,
};

const SIZE_FALLBACK: Record<SizeVariant, SizeVariant> = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

export function ProjectGeneratorWidget({ size, mock }: ProjectGeneratorWidgetProps) {
  const { skills, archetypes, loading } = useProjectGenerator({ mock });

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

  const Component = SIZE_COMPONENTS[size] ?? SIZE_COMPONENTS[SIZE_FALLBACK[size]];

  return <Component skills={skills} archetypes={archetypes} />;
}
