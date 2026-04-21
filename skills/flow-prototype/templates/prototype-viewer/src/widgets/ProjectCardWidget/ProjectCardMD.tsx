'use client';

import Link from 'next/link';
import { PushPin, Clock, GitBranch } from '@phosphor-icons/react';
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

export default function ProjectCardMD({ project }: Props) {
  if (!project) return null;

  const { agentBreakdown } = project;
  const breakdownText = enAU.home.prototypesWithBreakdown(
    project.prototypeCount,
    agentBreakdown.strict,
    agentBreakdown.adaptive,
    agentBreakdown.creative,
  );
  const versionText = enAU.home.versionRange(project.versionCount);

  return (
    <Link href={`/${project.slug}`} style={{ width: '100%', display: 'block' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--space-3)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'box-shadow 150ms var(--ease-in-out), border-color 150ms var(--ease-in-out)',
          width: '100%',
          gap: 'var(--space-2)',
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
        {/* Name */}
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', lineHeight: 1.2, margin: 0 }}>
          {project.name}
        </h3>

        {/* Description — 1 line */}
        <p
          style={{
            fontSize: 12,
            color: 'var(--color-text-muted)',
            lineHeight: 1.4,
            margin: 0,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {project.description}
        </p>

        {/* Stats row: prototypes + versions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-text-muted)' }}>
          <span style={{ fontWeight: 500, color: 'var(--color-text-body)' }}>{breakdownText}</span>
          {versionText && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <GitBranch size={11} weight="regular" />
              {versionText}
            </span>
          )}
        </div>

        {/* Latest + pins row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-text-muted)' }}>
          {project.latestPrototype ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <Clock size={11} weight="regular" />
              {project.latestPrototype.name} ({project.latestPrototype.agent})
            </span>
          ) : (
            <span />
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: project.openPinCount > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>
            <PushPin size={11} weight={project.openPinCount > 0 ? 'fill' : 'regular'} />
            {project.openPinCount > 0 ? enAU.home.openPins(project.openPinCount) : enAU.home.noPins}
          </span>
        </div>

        {/* Footer */}
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
          {project.createdBy} \u00b7 {enAU.home.updatedLabel} {project.formattedUpdatedAt}
        </div>
      </div>
    </Link>
  );
}
