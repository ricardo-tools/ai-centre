'use client';

import Link from 'next/link';
import { PushPin, GitBranch, Clock } from '@phosphor-icons/react';
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

export default function ProjectCardLG({ project }: Props) {
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
          padding: 'var(--space-4)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'box-shadow 150ms var(--ease-in-out), border-color 150ms var(--ease-in-out)',
          height: '100%',
          gap: 0,
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
        {/* Row 1: Name + description */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)', lineHeight: 1.2, marginBottom: 'var(--space-1)' }}>
            {project.name}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
            {project.description}
          </p>
        </div>

        {/* Row 2: Prototype count + agent breakdown | version range */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-2)',
            gap: 'var(--space-2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-body)' }}>
              {breakdownText}
            </span>
          </div>
          {versionText && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', flexShrink: 0 }}>
              <GitBranch size={13} weight="regular" style={{ color: 'var(--color-text-muted)' }} />
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                {versionText}
              </span>
            </div>
          )}
        </div>

        {/* Row 3: Latest prototype */}
        {project.latestPrototype && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              marginBottom: 'var(--space-2)',
              fontSize: 12,
              color: 'var(--color-text-muted)',
              overflow: 'hidden',
            }}
          >
            <Clock size={13} weight="regular" style={{ flexShrink: 0 }} />
            <span
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {enAU.home.latestLabel}:{' '}
              <span style={{ color: 'var(--color-text-body)', fontWeight: 500 }}>
                {project.latestPrototype.name}
              </span>
              {' '}
              <span style={{ opacity: 0.7 }}>
                ({project.latestPrototype.agent})
              </span>
              {' \u00b7 '}
              {project.latestPrototype.formattedDate}
            </span>
          </div>
        )}

        {/* Row 4: Pins */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            marginBottom: 'var(--space-2)',
            fontSize: 12,
          }}
        >
          <PushPin size={13} weight={project.openPinCount > 0 ? 'fill' : 'regular'} style={{ color: project.openPinCount > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)', flexShrink: 0 }} />
          <span style={{ color: project.openPinCount > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)', fontWeight: project.openPinCount > 0 ? 500 : 400 }}>
            {project.openPinCount > 0 ? enAU.home.openPins(project.openPinCount) : enAU.home.noPins}
          </span>
        </div>

        {/* Row 5: Author + dates */}
        <div
          style={{
            fontSize: 11,
            color: 'var(--color-text-muted)',
            marginBottom: project.briefExcerpt ? 'var(--space-3)' : 0,
          }}
        >
          {project.createdBy} \u00b7 {enAU.home.createdLabel} {project.formattedCreatedAt} \u00b7 {enAU.home.updatedLabel} {project.formattedUpdatedAt}
        </div>

        {/* Row 6: Brief excerpt */}
        {project.briefExcerpt && (
          <div
            style={{
              borderTop: '1px solid var(--color-border-light)',
              paddingTop: 'var(--space-2)',
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: 'var(--color-text-muted)',
                lineHeight: 1.5,
                margin: 0,
                fontStyle: 'italic',
              }}
            >
              &ldquo;{project.briefExcerpt}&rdquo;
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
