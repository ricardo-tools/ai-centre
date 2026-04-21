'use client';

import { useState } from 'react';
import { Code, Article } from '@phosphor-icons/react';
import { enAU } from '../i18n/en-AU';
import SimpleMarkdown from '../components/SimpleMarkdown';

interface Props {
  brief: string | null;
  decisions: string | null;
}

type Tab = 'brief' | 'decisions';

export default function BriefDecisionsTabs({ brief, decisions }: Props) {
  const hasBrief = brief !== null && brief.trim().length > 0;
  const hasDecisions = decisions !== null && decisions.trim().length > 0;

  if (!hasBrief && !hasDecisions) return null;

  const defaultTab: Tab = hasBrief ? 'brief' : 'decisions';
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);
  const [showRaw, setShowRaw] = useState(false);

  const tabs: { key: Tab; label: string; available: boolean }[] = [
    { key: 'brief', label: enAU.project.briefTab, available: hasBrief },
    { key: 'decisions', label: enAU.project.decisionsTab, available: hasDecisions },
  ];

  const content = activeTab === 'brief' ? brief : decisions;

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--color-code-bg)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {tabs
          .filter((t) => t.available)
          .map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  background: isActive ? 'var(--color-surface)' : 'transparent',
                  borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  marginBottom: -1,
                  border: 'none',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  transition: 'color 150ms var(--ease-in-out)',
                }}
              >
                {tab.label}
              </button>
            );
          })}

        {/* Spacer */}
        <span style={{ flex: 1 }} />

        {/* Raw/Rendered toggle */}
        <button
          onClick={() => setShowRaw((r) => !r)}
          title={showRaw ? 'Show rendered' : 'Show raw markdown'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: 'var(--space-1) var(--space-2)',
            marginRight: 'var(--space-2)',
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--color-text-muted)',
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            transition: 'background 100ms var(--ease-in-out)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-surface)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          {showRaw ? (
            <>
              <Article size={13} weight="regular" />
              Rendered
            </>
          ) : (
            <>
              <Code size={13} weight="regular" />
              Raw
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          padding: 'var(--space-3)',
          maxHeight: 600,
          overflowY: 'auto',
          fontSize: 14,
          color: 'var(--color-text-body)',
          lineHeight: 1.7,
          fontFamily: 'var(--font-body)',
        }}
      >
        {content && (
          showRaw ? (
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                lineHeight: 1.6,
                margin: 0,
                color: 'var(--color-text-body)',
              }}
            >
              {content}
            </pre>
          ) : (
            <SimpleMarkdown content={content} />
          )
        )}
      </div>
    </div>
  );
}
