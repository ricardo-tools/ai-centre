'use client';

import Link from 'next/link';
import { PushPin } from '@phosphor-icons/react';
import { enAU } from '../../i18n/en-AU';

interface AgentBreakdown {
  strict: number;
  adaptive: number;
  creative: number;
}

interface LatestPrototype {
  name: string;
  agent: string;
  formattedDate: string;
}

interface ProjectData {
  slug: string;
  name: string;
  description: string;
  createdBy: string;
  prototypeCount: number;
  formattedCreatedAt: string;
  formattedUpdatedAt: string;
  agentBreakdown: AgentBreakdown;
  versionCount: number;
  openPinCount: number;
  latestPrototype: LatestPrototype | null;
  briefExcerpt: string | null;
}

interface Props {
  project?: ProjectData;
}

export default function ProjectCardSM({ project }: Props) {
  if (!project) return null;

  const { agentBreakdown } = project;
  const breakdownText = enAU.home.prototypesWithBreakdown(
    project.prototypeCount,
    agentBreakdown.strict,
    agentBreakdown.adaptive,
    agentBreakdown.creative,
  );

  return (
    <Link href={`/${project.slug}`} style={{ width: '100%', display: 'block' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-2) var(--space-3)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'box-shadow 150ms var(--ease-in-out), border-color 150ms var(--ease-in-out)',
          width: '100%',
          minHeight: 44,
          gap: 'var(--space-2)',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          e.currentTarget.style.borderColor = 'var(--color-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }}
      >
        {/* Left: name + prototype count */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: 1 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--color-text-heading)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {project.name}
          </span>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
            {breakdownText}
          </span>
        </div>

        {/* Right: pins + date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
          {project.openPinCount > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, color: 'var(--color-warning)', fontWeight: 500 }}>
              <PushPin size={11} weight="fill" />
              {project.openPinCount}
            </span>
          )}
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
            {project.formattedUpdatedAt}
          </span>
        </div>
      </div>
    </Link>
  );
}
