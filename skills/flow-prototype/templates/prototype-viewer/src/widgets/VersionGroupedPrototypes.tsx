'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChatCircle, PushPin, Monitor, CaretDown, CaretRight } from '@phosphor-icons/react';
import TagBadge from '../components/TagBadge';
import { enAU } from '../i18n/en-AU';

export interface EnrichedPrototype {
  slug: string;
  projectSlug: string;
  name: string;
  agent: string;
  shell: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
  formattedUpdatedAt: string;
  commentCount: number;
  pinCount: number;
}

export interface VersionGroup {
  version: string;
  label: string;
  items: EnrichedPrototype[];
}

interface Props {
  groups: VersionGroup[];
  totalCount: number;
}

const shellLabels: Record<string, string> = enAU.shells;

/**
 * Left-column prototypes panel. Shows:
 *  - Header: "Prototypes" + count subtitle
 *  - Version groups as collapsible inline sections (not tabs)
 *    - Each group has a small inline label row, then prototype rows below
 *    - Latest version expanded, others collapsed
 */
export default function VersionGroupedPrototypes({ groups, totalCount }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    groups.forEach((g, i) => {
      initial[g.version] = i >= 3; // first 3 iterations open, rest collapsed
    });
    return initial;
  });

  const toggle = (version: string) => {
    setCollapsed((prev) => ({ ...prev, [version]: !prev[version] }));
  };

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 'var(--space-3)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--color-primary)',
            lineHeight: 1.2,
            margin: 0,
            marginBottom: 'var(--space-1)',
          }}
        >
          {enAU.common.prototypes}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>
          {enAU.project.prototypesCount(totalCount)}
        </p>
      </div>

      {/* Version groups — stacked vertically, each collapsible */}
      {groups.map((group, gi) => {
        const isCollapsed = collapsed[group.version] ?? false;
        const isLast = gi === groups.length - 1;

        return (
          <div key={group.version}>
            {/* Inline version label — clickable to expand/collapse */}
            <div
              onClick={() => toggle(group.version)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                padding: 'var(--space-2) var(--space-3)',
                cursor: 'pointer',
                borderBottom: isCollapsed && !isLast ? '1px solid var(--color-border-light)' : 'none',
                background: 'var(--color-bg-alt)',
                transition: 'background 100ms var(--ease-in-out)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-code-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-bg-alt)';
              }}
            >
              {isCollapsed ? (
                <CaretRight size={12} weight="bold" style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
              ) : (
                <CaretDown size={12} weight="bold" style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
              )}
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {group.version}
              </span>
              {group.label !== group.version && (
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                  · {group.label}
                </span>
              )}
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                {group.items.length}
              </span>
            </div>

            {/* Prototype rows */}
            {!isCollapsed &&
              group.items.map((proto, pi) => {
                const rowIsLast = pi === group.items.length - 1 && isLast;
                return (
                  <PrototypeRow
                    key={proto.slug}
                    prototype={proto}
                    showBorder={!rowIsLast}
                  />
                );
              })}
          </div>
        );
      })}
    </div>
  );
}

function PrototypeRow({
  prototype,
  showBorder,
}: {
  prototype: EnrichedPrototype;
  showBorder: boolean;
}) {
  return (
    <Link href={`/${prototype.projectSlug}/${prototype.slug}`}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-3)',
          paddingLeft: 'var(--space-5)',
          borderBottom: showBorder ? '1px solid var(--color-border-light)' : 'none',
          cursor: 'pointer',
          transition: 'background 100ms var(--ease-in-out)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--color-bg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        {/* Name */}
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-text-heading)',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {prototype.name}
        </span>

        {/* Agent badge */}
        <TagBadge label={prototype.agent} variant="agent" />

        {/* Shell */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            fontSize: 10,
            color: 'var(--color-text-muted)',
            whiteSpace: 'nowrap',
          }}
        >
          <Monitor size={11} weight="regular" />
          {shellLabels[prototype.shell] || prototype.shell}
        </span>

        {/* Spacer */}
        <span style={{ flex: 1 }} />

        {/* Date */}
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
          {prototype.formattedUpdatedAt}
        </span>

        {/* Comments */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            fontSize: 11,
            color: 'var(--color-text-muted)',
          }}
        >
          <ChatCircle size={11} weight="regular" />
          {prototype.commentCount}
        </span>

        {/* Pins */}
        {prototype.pinCount > 0 && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              fontSize: 11,
              color: 'var(--color-warning)',
              fontWeight: 500,
            }}
          >
            <PushPin size={11} weight="fill" />
            {prototype.pinCount}
          </span>
        )}
      </div>
    </Link>
  );
}
