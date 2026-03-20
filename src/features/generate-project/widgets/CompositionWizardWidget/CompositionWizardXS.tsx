'use client';

import { CheckCircle, Circle, Rocket, Star } from '@phosphor-icons/react';
import type { RenderableWidget } from '@/platform/screen-renderer/types';
import type { UseCompositionWizardResult } from './useCompositionWizard';

interface CompositionWizardXSProps extends RenderableWidget {
  wizard: UseCompositionWizardResult;
}

export function CompositionWizardXS({ wizard }: CompositionWizardXSProps) {
  const {
    domains,
    selectedDomain,
    selectDomain,
    featureAddons,
    selectedAddons,
    toggleAddon,
    resolvedSkills,
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
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--color-text-heading)',
          margin: '0 0 8px',
        }}
      >
        Compose Your Toolkit
      </h1>
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 24, marginTop: 0 }}>
        Select a domain, add features, and generate.
      </p>

      {/* Domain select */}
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--color-text-heading)',
            marginBottom: 8,
            marginTop: 0,
          }}
        >
          Domain
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {domains.map((domain) => {
            const isSelected = selectedDomain === domain.slug;
            return (
              <button
                key={domain.slug}
                onClick={() => selectDomain(domain.slug)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
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
                <span style={{ fontSize: 20, flexShrink: 0 }}>{domain.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', flex: 1 }}>
                  {domain.title}
                </span>
                {isSelected ? (
                  <CheckCircle size={18} weight="fill" color="var(--color-primary)" />
                ) : (
                  <Circle size={18} color="var(--color-text-muted)" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Features */}
      {selectedDomain && (
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--color-text-heading)',
              marginBottom: 8,
              marginTop: 0,
            }}
          >
            Features
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
                    gap: 8,
                    padding: '8px 10px',
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
                    <CheckCircle size={16} weight="fill" color="var(--color-primary)" />
                  ) : (
                    <Circle size={16} color="var(--color-text-muted)" />
                  )}
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', flex: 1 }}>
                    {addon.icon} {addon.title}
                  </span>
                  {isRecommended && (
                    <Star size={12} weight="fill" color="var(--color-warning)" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Description */}
      <div style={{ marginBottom: 16 }}>
        <h2
          style={{
            fontSize: 14,
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
            minHeight: 80,
            padding: 10,
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-body)',
            fontFamily: 'inherit',
            fontSize: 12,
            lineHeight: 1.4,
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box' as const,
          }}
        />
      </div>

      {/* Generate */}
      <button
        onClick={generate}
        disabled={!canGenerate || isGenerating}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 16px',
          borderRadius: 6,
          border: 'none',
          background: !canGenerate ? 'var(--color-border)' : 'var(--color-primary)',
          color: !canGenerate ? 'var(--color-text-muted)' : '#fff',
          fontSize: 12,
          fontWeight: 600,
          cursor: !canGenerate ? 'default' : 'pointer',
          fontFamily: 'inherit',
          opacity: isGenerating ? 0.7 : 1,
        }}
      >
        <Rocket size={14} weight="fill" />
        {isGenerating ? 'Generating...' : 'Generate Project'}
      </button>
      {skillCount > 0 && (
        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8 }}>
          {skillCount} skill{skillCount !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
}
