'use client';

import { useState, useMemo } from 'react';
import { Plus, X } from '@phosphor-icons/react';

interface SkillOption {
  slug: string;
  title: string;
}

interface SkillPickerProps {
  available: SkillOption[];
  selected: string[];
  onChange: (slugs: string[]) => void;
}

export function SkillPicker({ available, selected, onChange }: SkillPickerProps) {
  const [filter, setFilter] = useState('');

  const availableFiltered = useMemo(() => {
    const lowerFilter = filter.toLowerCase();
    return available
      .filter((s) => !selected.includes(s.slug))
      .filter((s) => !lowerFilter || s.title.toLowerCase().includes(lowerFilter));
  }, [available, selected, filter]);

  const selectedSkills = useMemo(() => {
    return selected
      .map((slug) => available.find((s) => s.slug === slug))
      .filter(Boolean) as SkillOption[];
  }, [available, selected]);

  const handleAdd = (slug: string) => {
    onChange([...selected, slug]);
  };

  const handleRemove = (slug: string) => {
    onChange(selected.filter((s) => s !== slug));
  };

  const panelStyle: React.CSSProperties = {
    flex: '1 1 250px',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  };

  const headerStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    padding: '8px 12px',
    borderBottom: '1px solid var(--color-border)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const listStyle: React.CSSProperties = {
    maxHeight: 200,
    overflowY: 'auto',
  };

  const itemBaseStyle: React.CSSProperties = {
    padding: '6px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: 'var(--color-text-body)',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {/* Left panel — Available */}
      <div style={panelStyle}>
        <div style={headerStyle}>Available ({availableFiltered.length})</div>
        <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--color-border)' }}>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter skills..."
            style={{
              width: '100%',
              padding: '4px 8px',
              borderRadius: 4,
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text-body)',
              fontSize: 12,
              fontFamily: 'inherit',
            }}
          />
        </div>
        <div style={listStyle}>
          {availableFiltered.map((s) => (
            <button
              key={s.slug}
              onClick={() => handleAdd(s.slug)}
              style={itemBaseStyle}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary-muted)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
            >
              <Plus size={14} weight="bold" style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</span>
            </button>
          ))}
          {availableFiltered.length === 0 && (
            <div style={{ padding: '12px', fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center' }}>
              {filter ? 'No matches' : 'All skills selected'}
            </div>
          )}
        </div>
      </div>

      {/* Right panel — Selected */}
      <div style={panelStyle}>
        <div style={headerStyle}>Selected ({selected.length})</div>
        <div style={listStyle}>
          {selectedSkills.map((s) => (
            <button
              key={s.slug}
              onClick={() => handleRemove(s.slug)}
              style={itemBaseStyle}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary-muted)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
            >
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</span>
              <X size={14} weight="bold" style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
            </button>
          ))}
          {selected.length === 0 && (
            <div style={{ padding: '12px', fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center' }}>
              No skills selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
