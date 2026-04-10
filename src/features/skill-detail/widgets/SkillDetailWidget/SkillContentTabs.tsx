'use client';

import { useState, useMemo } from 'react';
import { SkillShowcase } from '@/platform/components/SkillShowcase';
import type { SkillReference } from '@/features/skill-library/action';

type ViewMode = 'rendered' | 'raw';

interface SkillContentTabsProps {
  /** Main SKILL.md content */
  skillContent: string;
  /** Reference files from the skill's references/ directory */
  references: SkillReference[];
}

/** Converts a filename like "patterns.md" to a tab label like "Patterns" */
function filenameToLabel(filename: string): string {
  const name = filename.replace(/\.md$/i, '');
  return name
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div style={{ display: 'flex', gap: 0, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
      {(['rendered', 'raw'] as const).map((m) => {
        const isActive = mode === m;
        return (
          <button
            key={m}
            onClick={() => onChange(m)}
            style={{
              padding: '4px 12px',
              fontSize: 12,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
              background: isActive ? 'var(--color-primary-muted)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textTransform: 'capitalize',
            }}
          >
            {m}
          </button>
        );
      })}
    </div>
  );
}

function RawContent({ content }: { content: string }) {
  return (
    <pre
      style={{
        fontSize: 12,
        fontFamily: 'monospace',
        lineHeight: 1.7,
        padding: 16,
        borderRadius: 6,
        background: 'var(--color-bg-alt)',
        border: '1px solid var(--color-border)',
        overflow: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {content}
    </pre>
  );
}

function ContentView({ content, mode }: { content: string; mode: ViewMode }) {
  if (mode === 'raw') return <RawContent content={content} />;
  return <SkillShowcase content={content} />;
}

/**
 * Tabbed view for skill markdown content.
 * Shows tabs when the skill has reference files.
 * Always shows a rendered/raw toggle for the markdown view.
 */
export function SkillContentTabs({ skillContent, references }: SkillContentTabsProps) {
  const [activeTab, setActiveTab] = useState('skill');
  const [viewMode, setViewMode] = useState<ViewMode>('rendered');

  const tabs = useMemo(() => {
    const items = [{ key: 'skill', label: 'Skill', content: skillContent }];
    for (const ref of references) {
      items.push({
        key: ref.filename,
        label: filenameToLabel(ref.filename),
        content: ref.content,
      });
    }
    return items;
  }, [skillContent, references]);

  const activeContent = tabs.find((t) => t.key === activeTab)?.content ?? skillContent;

  // No references — just toggle + content
  if (references.length === 0) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>
        <ContentView content={skillContent} mode={viewMode} />
      </div>
    );
  }

  return (
    <div>
      {/* Tab bar + view toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: 0,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '10px 16px',
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive
                    ? '2px solid var(--color-primary)'
                    : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'color 0.15s, border-color 0.15s',
                  fontFamily: 'inherit',
                  marginBottom: -1,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <ViewToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {/* Tab content */}
      <div style={{ paddingTop: 16 }}>
        <ContentView content={activeContent} mode={viewMode} />
      </div>
    </div>
  );
}
