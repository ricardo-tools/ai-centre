'use client';

import { CheckCircle, Circle, Rocket, Star } from '@phosphor-icons/react';
import type { RenderableWidget } from '@/platform/screen-renderer/types';
import type { UseCompositionWizardResult } from './useCompositionWizard';

interface CompositionWizardSMProps extends RenderableWidget {
  wizard: UseCompositionWizardResult;
}

export function CompositionWizardSM({ wizard }: CompositionWizardSMProps) {
  const {
    domains,
    selectedDomain,
    selectDomain,
    featureAddons,
    selectedAddons,
    toggleAddon,
    skillCount,
    description,
    setDescription,
    isGenerating,
    generate,
  } = wizard;

  const canGenerate = selectedDomain !== null && description.trim().length > 0;
  const domainDef = selectedDomain ? domains.find((d) => d.slug === selectedDomain) : null;

  return (
    <div style={{ padding: 16, maxWidth: '100%', width: '100%' }}>
      <h1
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--color-text-heading)',
          margin: '0 0 8px',
        }}
      >
        Compose Your Toolkit
      </h1>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 32, marginTop: 0 }}>
        Select a domain, add features, and generate a project scaffold.
      </p>

      {/* Domain cards */}
      <div style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--color-text-heading)',
            marginBottom: 12,
            marginTop: 0,
          }}
        >
          Choose a domain
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 10,
          }}
        >
          {domains.map((domain) => {
            const isSelected = selectedDomain === domain.slug;
            return (
              <button
                key={domain.slug}
                onClick={() => selectDomain(domain.slug)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 16,
                  borderRadius: 8,
                  border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: isSelected ? 'var(--color-primary-muted)' : 'var(--color-surface)',
                  cursor: 'pointer',
                  textAlign: 'left' as const,
                  fontFamily: 'inherit',
                  width: '100%',
                  boxSizing: 'border-box' as const,
                }}
              >
                <span style={{ fontSize: 24, flexShrink: 0 }}>{domain.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 2px' }}>
                    {domain.title}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.3 }}>
                    {domain.description}
                  </p>
                </div>
                {isSelected ? (
                  <CheckCircle size={20} weight="fill" color="var(--color-primary)" />
                ) : (
                  <Circle size={20} color="var(--color-text-muted)" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Features */}
      {selectedDomain && (
        <div style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--color-text-heading)',
              marginBottom: 12,
              marginTop: 0,
            }}
          >
            Add features
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 8,
            }}
          >
            {featureAddons.map((addon) => {
              const isSelected = selectedAddons.has(addon.slug);
              const isRecommended = domainDef?.recommendedAddons.includes(addon.slug) ?? false;
              return (
                <button
                  key={addon.slug}
                  onClick={() => toggleAddon(addon.slug)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                    background: isSelected ? 'var(--color-primary-muted)' : 'var(--color-surface)',
                    cursor: 'pointer',
                    textAlign: 'left' as const,
                    fontFamily: 'inherit',
                    width: '100%',
                    boxSizing: 'border-box' as const,
                  }}
                >
                  {isSelected ? (
                    <CheckCircle size={18} weight="fill" color="var(--color-primary)" />
                  ) : (
                    <Circle size={18} color="var(--color-text-muted)" />
                  )}
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', flex: 1 }}>
                    {addon.icon} {addon.title}
                  </span>
                  {isRecommended && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        fontSize: 9,
                        fontWeight: 600,
                        padding: '2px 5px',
                        borderRadius: 3,
                        background: 'var(--color-warning-muted)',
                        color: 'var(--color-warning)',
                      }}
                    >
                      <Star size={9} weight="fill" />
                      Rec
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Description */}
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--color-text-heading)',
            marginBottom: 8,
            marginTop: 0,
          }}
        >
          Describe your project
        </h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project idea..."
          style={{
            width: '100%',
            minHeight: 100,
            padding: 12,
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-body)',
            fontFamily: 'inherit',
            fontSize: 13,
            lineHeight: 1.4,
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box' as const,
          }}
        />
      </div>

      {/* Generate */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={generate}
          disabled={!canGenerate || isGenerating}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 24px',
            borderRadius: 6,
            border: 'none',
            background: !canGenerate ? 'var(--color-border)' : 'var(--color-primary)',
            color: !canGenerate ? 'var(--color-text-muted)' : '#fff',
            fontSize: 13,
            fontWeight: 600,
            cursor: !canGenerate ? 'default' : 'pointer',
            fontFamily: 'inherit',
            opacity: isGenerating ? 0.7 : 1,
          }}
        >
          <Rocket size={16} weight="fill" />
          {isGenerating ? 'Generating...' : 'Generate Project'}
        </button>
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          {skillCount} skill{skillCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}
