'use client';

import { Code, ListBullets, Table, BookOpen, Lightning, ArrowRight } from '@phosphor-icons/react';
import type { ParsedSkillContent, SkillSection } from '@/platform/domain/ParsedSkill';

interface SkillShowcaseFallbackProps {
  parsed: ParsedSkillContent;
}

function SectionCard({ section }: { section: SkillSection }) {
  // Strip markdown formatting for preview
  const preview = section.content
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/\|[^\n]+\|/g, '') // remove table rows
    .replace(/^[-*] /gm, '') // remove bullet markers
    .replace(/#{1,4} [^\n]+/g, '') // remove sub-headings
    .replace(/\*\*([^*]+)\*\*/g, '$1') // bold → plain
    .replace(/\*([^*]+)\*/g, '$1') // italic → plain
    .replace(/`([^`]+)`/g, '$1') // inline code → plain
    .trim()
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .slice(0, 3)
    .join(' ');

  const hasCode = section.codeBlocks.length > 0;
  const hasTable = section.content.includes('|---|');

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 8,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--color-text-heading)',
            margin: 0,
            flex: 1,
          }}
        >
          {section.title}
        </h3>
        <div style={{ display: 'flex', gap: 6 }}>
          {hasCode && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 4,
                background: 'var(--color-primary-muted)',
                color: 'var(--color-primary)',
              }}
            >
              <Code size={12} /> {section.codeBlocks.length}
            </span>
          )}
          {hasTable && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 4,
                background: 'var(--color-warning-muted)',
                color: 'var(--color-warning)',
              }}
            >
              <Table size={12} />
            </span>
          )}
        </div>
      </div>

      {preview && (
        <p
          style={{
            fontSize: 14,
            color: 'var(--color-text-muted)',
            lineHeight: 1.5,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {preview}
        </p>
      )}
    </div>
  );
}

function KeyFeatureItem({ feature }: { feature: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        padding: '8px 0',
      }}
    >
      <ArrowRight
        size={14}
        weight="bold"
        style={{
          color: 'var(--color-primary)',
          marginTop: 4,
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.5 }}>
        {feature}
      </span>
    </div>
  );
}

export function SkillShowcaseFallback({ parsed }: SkillShowcaseFallbackProps) {
  const topSections = parsed.sections.slice(0, 8);

  return (
    <div>
      {/* Intro */}
      {parsed.intro && (
        <div
          style={{
            padding: 24,
            borderRadius: 8,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            marginBottom: 32,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <BookOpen size={18} weight="regular" style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>
              Overview
            </h2>
          </div>
          <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
            {parsed.intro}
          </p>
        </div>
      )}

      {/* Key features */}
      {parsed.keyFeatures.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Lightning size={18} weight="regular" style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>
              Key Capabilities
            </h2>
          </div>
          <div
            style={{
              padding: '8px 24px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
            }}
          >
            {parsed.keyFeatures.map((feature, i) => (
              <KeyFeatureItem key={i} feature={feature} />
            ))}
          </div>
        </div>
      )}

      {/* Section cards */}
      {topSections.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <ListBullets size={18} weight="regular" style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>
              What&apos;s Inside
            </h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
              gap: 16,
            }}
          >
            {topSections.map((section) => (
              <SectionCard key={section.title} section={section} />
            ))}
          </div>
        </div>
      )}

      {/* Stats footer */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          padding: '16px 24px',
          borderRadius: 8,
          background: 'var(--color-bg-muted)',
          border: '1px solid var(--color-border)',
          fontSize: 13,
          color: 'var(--color-text-muted)',
        }}
      >
        <span>{parsed.sectionCount} sections</span>
        <span>{parsed.codeExampleCount} code examples</span>
        <span>{parsed.referenceTableCount} reference tables</span>
      </div>
    </div>
  );
}
