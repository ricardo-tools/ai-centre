'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Circle,
  Plus,
  X,
  Rocket,
  RadioButton,
  MagnifyingGlass,
  Star,
} from '@phosphor-icons/react';
import type { FeatureAddonDefinition } from '@/platform/lib/toolkit-composition';
import { FOUNDATION_SKILLS, FEATURE_ADDONS, DOMAINS } from '@/platform/lib/toolkit-composition';
import type { UseCompositionWizardResult } from './useCompositionWizard';

/* ─── Local Helpers ──────────────────────────────────────────────────────── */

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  color: 'var(--color-text-heading)',
  marginBottom: 8,
  marginTop: 0,
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--color-text-muted)',
  marginBottom: 24,
  marginTop: 0,
};

const cardBase: React.CSSProperties = {
  padding: 24,
  borderRadius: 8,
  cursor: 'pointer',
  textAlign: 'left' as const,
  fontFamily: 'inherit',
  display: 'flex',
  alignItems: 'flex-start',
  gap: 16,
  width: '100%',
  boxSizing: 'border-box' as const,
};

function selectedCardBorder(isSelected: boolean): React.CSSProperties {
  return {
    border: isSelected ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
    background: isSelected ? 'var(--color-primary-muted)' : 'var(--color-surface)',
  };
}

const subsectionHeadingStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  color: 'var(--color-text-muted)',
  marginBottom: 12,
  marginTop: 0,
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  borderRadius: 16,
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--color-text-body)',
  fontFamily: 'inherit',
};

/* ─── Component ──────────────────────────────────────────────────────────── */

interface CompositionWizardLGProps {
  wizard: UseCompositionWizardResult;
}

export function CompositionWizardLG({ wizard }: CompositionWizardLGProps) {
  const {
    domains,
    selectedDomain,
    selectDomain,
    featureAddons,
    selectedAddons,
    toggleAddon,
    implementationChoices,
    selectImplementation,
    foundationSkills,
    resolvedSkills,
    skillCount,
    description,
    setDescription,
    isGenerating,
    generate,
  } = wizard;

  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillSearch, setShowSkillSearch] = useState(false);

  // Derive skill grouping for review
  const domainDef = selectedDomain ? domains.find((d) => d.slug === selectedDomain) : null;
  const domainSkillSlugs = domainDef ? domainDef.skills : [];

  // Feature skills = everything in resolvedSkills that is not foundation or domain
  const foundationSet = new Set(foundationSkills);
  const domainSet = new Set(domainSkillSlugs);
  const featureSkills = resolvedSkills.filter(
    (s) => !foundationSet.has(s) && !domainSet.has(s),
  );
  const foundationInResolved = resolvedSkills.filter((s) => foundationSet.has(s));
  const domainInResolved = resolvedSkills.filter((s) => domainSet.has(s));

  // Addons with implementations
  const addonsWithImpls = featureAddons.filter(
    (a) => selectedAddons.has(a.slug) && a.implementations.length > 0,
  );

  // For "Add skill" search — all known skill slugs not already in resolvedSkills
  const allKnownSlugs = new Set<string>();
  for (const s of FOUNDATION_SKILLS) allKnownSlugs.add(s);
  for (const d of DOMAINS) for (const s of d.skills) allKnownSlugs.add(s);
  for (const a of FEATURE_ADDONS) {
    for (const s of a.principleSkills) allKnownSlugs.add(s);
    for (const impl of a.implementations) {
      for (const s of impl.skills) allKnownSlugs.add(s);
    }
  }
  const resolvedSet = new Set(resolvedSkills);
  const availableToAdd = Array.from(allKnownSlugs).filter(
    (s) => !resolvedSet.has(s) && s.toLowerCase().includes(skillSearch.toLowerCase()),
  );

  const canGenerate = selectedDomain !== null && description.trim().length > 0;

  return (
    <div style={{ maxWidth: 1200, width: '100%' }}>
      {/* Page title */}
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--color-text-heading)',
          marginBottom: 8,
          marginTop: 0,
        }}
      >
        Compose Your Toolkit
      </h1>
      <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 48, marginTop: 0 }}>
        Select a domain, add features, choose implementations, and generate a project scaffold
        with the right skills baked in.
      </p>

      {/* ─── Section 1: Domain ─────────────────────────────────────────── */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={sectionHeadingStyle}>Choose a domain</h2>
        <p style={subtitleStyle}>
          The domain determines your core skill set. Pick one to get started.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
            gap: 16,
          }}
        >
          {domains.map((domain) => {
            const isSelected = selectedDomain === domain.slug;
            return (
              <button
                key={domain.slug}
                onClick={() => selectDomain(domain.slug)}
                style={{
                  ...cardBase,
                  ...selectedCardBorder(isSelected),
                }}
              >
                <span style={{ fontSize: 32, lineHeight: 1, flexShrink: 0 }}>{domain.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'var(--color-text-heading)',
                      margin: '0 0 4px',
                    }}
                  >
                    {domain.title}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: 'var(--color-text-muted)',
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {domain.description}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: 'var(--color-text-muted)',
                      margin: '8px 0 0',
                    }}
                  >
                    {domain.skills.length} skills
                    {domain.recommendedAddons.length > 0 &&
                      ` · ${domain.recommendedAddons.length} recommended add-on${domain.recommendedAddons.length > 1 ? 's' : ''}`}
                  </p>
                </div>
                <div style={{ flexShrink: 0, marginTop: 2 }}>
                  {isSelected ? (
                    <CheckCircle size={24} weight="fill" color="var(--color-primary)" />
                  ) : (
                    <Circle size={24} color="var(--color-text-muted)" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── Section 2: Features ───────────────────────────────────────── */}
      {selectedDomain && (
        <section style={{ marginBottom: 48 }}>
          <h2 style={sectionHeadingStyle}>Add features</h2>
          <p style={subtitleStyle}>
            Recommended features are pre-selected. Toggle any on or off.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
              gap: 12,
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
                    ...cardBase,
                    padding: 16,
                    ...selectedCardBorder(isSelected),
                  }}
                >
                  <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>{addon.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: 'var(--color-text-heading)',
                        }}
                      >
                        {addon.title}
                      </span>
                      {isRecommended && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                            fontSize: 10,
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: 'var(--color-warning-muted)',
                            color: 'var(--color-warning)',
                          }}
                        >
                          <Star size={10} weight="fill" />
                          Recommended
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: 'var(--color-text-muted)',
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {addon.description}
                    </p>
                  </div>
                  <div style={{ flexShrink: 0, marginTop: 2 }}>
                    {isSelected ? (
                      <CheckCircle size={20} weight="fill" color="var(--color-primary)" />
                    ) : (
                      <Circle size={20} color="var(--color-text-muted)" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── Section 3: Implementations ────────────────────────────────── */}
      {addonsWithImpls.length > 0 && (
        <section style={{ marginBottom: 48 }}>
          <h2 style={sectionHeadingStyle}>Choose implementations</h2>
          <p style={subtitleStyle}>
            Select a specific implementation for each feature add-on.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {addonsWithImpls.map((addon) => (
              <ImplementationGroup
                key={addon.slug}
                addon={addon}
                selectedImpl={implementationChoices[addon.slug] ?? null}
                onSelect={(implSlug) => selectImplementation(addon.slug, implSlug)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── Section 4: Review ─────────────────────────────────────────── */}
      {selectedDomain && (
        <section style={{ marginBottom: 48 }}>
          <h2 style={sectionHeadingStyle}>
            Review skills ({skillCount})
          </h2>
          <p style={subtitleStyle}>
            These skills will be included in your generated project.
          </p>

          {/* Foundation */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={subsectionHeadingStyle}>Foundation ({foundationInResolved.length})</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {foundationInResolved.map((slug) => (
                <span key={slug} style={badgeStyle}>
                  {formatSlug(slug)}
                </span>
              ))}
            </div>
          </div>

          {/* Domain */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={subsectionHeadingStyle}>
              Domain: {domainDef?.title ?? ''} ({domainInResolved.length})
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {domainInResolved.map((slug) => (
                <span key={slug} style={badgeStyle}>
                  {formatSlug(slug)}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          {featureSkills.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={subsectionHeadingStyle}>Features ({featureSkills.length})</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {featureSkills.map((slug) => (
                  <span key={slug} style={badgeStyle}>
                    {formatSlug(slug)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add skill */}
          <div style={{ marginTop: 16 }}>
            {!showSkillSearch ? (
              <button
                onClick={() => setShowSkillSearch(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px dashed var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-muted)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <Plus size={16} />
                Add skill
              </button>
            ) : (
              <div
                style={{
                  padding: 16,
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  background: 'var(--color-surface)',
                  maxWidth: 400,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <MagnifyingGlass size={16} color="var(--color-text-muted)" />
                  <input
                    type="text"
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    placeholder="Search skills..."
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--color-text-body)',
                      fontSize: 13,
                      fontFamily: 'inherit',
                    }}
                  />
                  <button
                    onClick={() => {
                      setShowSkillSearch(false);
                      setSkillSearch('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 4,
                      display: 'flex',
                    }}
                  >
                    <X size={16} color="var(--color-text-muted)" />
                  </button>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    maxHeight: 200,
                    overflowY: 'auto',
                  }}
                >
                  {availableToAdd.length === 0 && (
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
                      No additional skills found.
                    </p>
                  )}
                  {availableToAdd.slice(0, 20).map((slug) => (
                    <button
                      key={slug}
                      onClick={() => {
                        // Find which addon this skill belongs to and toggle it
                        const addon = FEATURE_ADDONS.find(
                          (a) =>
                            a.principleSkills.includes(slug) ||
                            a.implementations.some((i) => i.skills.includes(slug)),
                        );
                        if (addon && !selectedAddons.has(addon.slug)) {
                          toggleAddon(addon.slug);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 10px',
                        borderRadius: 4,
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: 12,
                        color: 'var(--color-text-body)',
                        textAlign: 'left' as const,
                      }}
                    >
                      <Plus size={14} color="var(--color-primary)" />
                      {formatSlug(slug)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Section 5: Generate ───────────────────────────────────────── */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={sectionHeadingStyle}>Generate project</h2>
        <p style={subtitleStyle}>
          Describe your project idea. The generated scaffold will include a tailored CLAUDE.md
          with all selected skills.
        </p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project idea..."
          style={{
            width: '100%',
            minHeight: 120,
            padding: 16,
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-body)',
            fontFamily: 'inherit',
            fontSize: 14,
            lineHeight: 1.5,
            resize: 'vertical',
            boxSizing: 'border-box' as const,
            marginBottom: 16,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={generate}
            disabled={!canGenerate || isGenerating}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 32px',
              borderRadius: 6,
              border: 'none',
              background: !canGenerate ? 'var(--color-bg-alt)' : 'var(--color-primary)',
              color: !canGenerate ? 'var(--color-text-muted)' : '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: !canGenerate ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              opacity: !canGenerate ? 0.5 : isGenerating ? 0.7 : 1,
            }}
          >
            <Rocket size={18} weight="fill" />
            {isGenerating ? 'Generating...' : 'Generate Project'}
          </button>
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
            {skillCount} skill{skillCount !== 1 ? 's' : ''} selected
          </span>
        </div>
      </section>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function ImplementationGroup({
  addon,
  selectedImpl,
  onSelect,
}: {
  addon: FeatureAddonDefinition;
  selectedImpl: string | null;
  onSelect: (slug: string) => void;
}) {
  return (
    <div>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--color-text-heading)',
          marginBottom: 12,
          marginTop: 0,
        }}
      >
        {addon.icon} {addon.title}
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))',
          gap: 12,
        }}
      >
        {addon.implementations.map((impl) => {
          const isSelected = selectedImpl === impl.slug;
          return (
            <button
              key={impl.slug}
              onClick={() => onSelect(impl.slug)}
              style={{
                padding: 16,
                borderRadius: 8,
                border: isSelected
                  ? '2px solid var(--color-primary)'
                  : '2px solid var(--color-border)',
                background: isSelected ? 'var(--color-primary-muted)' : 'var(--color-surface)',
                cursor: 'pointer',
                textAlign: 'left' as const,
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                width: '100%',
                boxSizing: 'border-box' as const,
              }}
            >
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                <RadioButton
                  size={20}
                  weight={isSelected ? 'fill' : 'regular'}
                  color={isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)'}
                />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--color-text-heading)',
                    margin: '0 0 4px',
                  }}
                >
                  {impl.title}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--color-text-muted)',
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {impl.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Utility ────────────────────────────────────────────────────────────── */

function formatSlug(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
