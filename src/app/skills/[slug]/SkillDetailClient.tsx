'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DownloadSimple, FileText, Lightning, ArrowLeft, Code, Table, ListBullets } from '@phosphor-icons/react';
import type { SkillData } from '@/lib/skills';
import type { ParsedSkill } from '@/lib/parse-skill';
import { SkillInPractice } from './SkillInPractice';
import { SkillShowcase } from './SkillShowcase';

interface Props {
  skill: SkillData;
  parsed: ParsedSkill;
}

export function SkillDetailClient({ skill, parsed }: Props) {
  const [view, setView] = useState<'practice' | 'markdown'>('practice');

  return (
    <div style={{ maxWidth: 960 }}>
      {/* Back link */}
      <Link
        href="/skills"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 13,
          color: 'var(--color-text-muted)',
          textDecoration: 'none',
          marginBottom: 24,
        }}
      >
        <ArrowLeft size={14} /> Back to Skills
      </Link>

      {/* Hero */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-text-heading)', margin: 0 }}>
            {skill.title}
          </h1>
          {skill.isOfficial && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: 4,
                background: 'var(--color-primary-muted)',
                color: 'var(--color-primary)',
              }}
            >
              Official
            </span>
          )}
        </div>

        <p style={{ fontSize: 16, color: 'var(--color-text-body)', lineHeight: 1.6, marginBottom: 24, maxWidth: 700 }}>
          {skill.description}
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
          <Stat icon={<ListBullets size={16} />} label="Sections" value={parsed.sections.length} />
          <Stat icon={<Code size={16} />} label="Code examples" value={parsed.codeExampleCount} />
          <Stat icon={<Table size={16} />} label="Reference tables" value={Math.floor(parsed.tableCount / 3)} />
          <Stat icon={<FileText size={16} />} label="Version" value={`v${skill.version}`} />
        </div>

        {/* Actions row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a
            href={`data:text/markdown;charset=utf-8,${encodeURIComponent(skill.content)}`}
            download={`${skill.slug}-SKILL.md`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 6,
              background: 'var(--color-primary)',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <DownloadSimple size={16} weight="bold" /> Download SKILL.md
          </a>

          {/* View toggle */}
          <div
            style={{
              display: 'flex',
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
            }}
          >
            <ToggleButton
              active={view === 'practice'}
              onClick={() => setView('practice')}
              icon={<Lightning size={14} />}
              label="Skill in Practice"
            />
            <ToggleButton
              active={view === 'markdown'}
              onClick={() => setView('markdown')}
              icon={<FileText size={14} />}
              label="View SKILL.md"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {view === 'practice' ? (
        <SkillInPractice slug={skill.slug} parsed={parsed} />
      ) : (
        <div
          style={{
            padding: 32,
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
          }}
        >
          <SkillShowcase content={skill.content} />
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ color: 'var(--color-text-muted)' }}>{icon}</span>
      <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
        {label}: <strong style={{ color: 'var(--color-text-heading)', fontWeight: 600 }}>{value}</strong>
      </span>
    </div>
  );
}

function ToggleButton({ active, onClick, icon, label }: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '6px 12px',
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        fontFamily: 'inherit',
        border: 'none',
        cursor: 'pointer',
        background: active ? 'var(--color-surface-active)' : 'var(--color-surface)',
        color: active ? 'var(--color-text-heading)' : 'var(--color-text-muted)',
        transition: 'background 150ms, color 150ms',
      }}
    >
      {icon} {label}
    </button>
  );
}
