'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { Tabs } from '@/platform/components/Tabs';
import { fetchAllSkills } from '@/features/skill-library/action';
import { toSkills } from '@/platform/acl/skill.mapper';
import type { Skill } from '@/platform/domain/Skill';
import { SkillCard } from '@/platform/components/SkillCard';
import { useLocale } from '@/platform/screen-renderer/LocaleContext';
import {
  FOUNDATION_SKILLS,
  DOMAINS,
  FEATURE_ADDONS,
} from '@/platform/lib/toolkit-composition';

// ─── Primary tabs ─────────────────────────────────────────────────────────────

const PRIMARY_TABS = [
  { key: 'all', label: 'All' },
  { key: 'foundation', label: 'Foundation' },
  { key: 'domains', label: 'Domains' },
  { key: 'features', label: 'Features' },
  { key: 'implementation', label: 'Implementation' },
];

// ─── Sub-filter definitions ───────────────────────────────────────────────────

const DOMAIN_PILLS = DOMAINS.map((d) => ({
  key: d.slug,
  label: d.title,
  icon: d.icon,
}));

const FEATURE_PILLS = FEATURE_ADDONS.map((f) => ({
  key: f.slug,
  label: f.title,
  icon: f.icon,
}));

// ─── Slug sets for filtering ──────────────────────────────────────────────────

const foundationSet = new Set(FOUNDATION_SKILLS);

function getDomainSkillSlugs(domainSlug: string): Set<string> {
  const domain = DOMAINS.find((d) => d.slug === domainSlug);
  return domain ? new Set(domain.skills) : new Set();
}

function getFeatureSkillSlugs(featureSlug: string): Set<string> {
  const addon = FEATURE_ADDONS.find((f) => f.slug === featureSlug);
  if (!addon) return new Set();
  const slugs = new Set<string>();
  for (const s of addon.principleSkills) slugs.add(s);
  for (const impl of addon.implementations) {
    for (const s of impl.skills) slugs.add(s);
  }
  return slugs;
}

function getAllDomainSkillSlugs(): Set<string> {
  const slugs = new Set<string>();
  for (const d of DOMAINS) {
    for (const s of d.skills) slugs.add(s);
  }
  return slugs;
}

function getAllFeatureSkillSlugs(): Set<string> {
  const slugs = new Set<string>();
  for (const f of FEATURE_ADDONS) {
    for (const s of f.principleSkills) slugs.add(s);
    for (const impl of f.implementations) {
      for (const s of impl.skills) slugs.add(s);
    }
  }
  return slugs;
}

// ─── Sub-filter pill component ────────────────────────────────────────────────

function FilterPill({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 16px',
        borderRadius: 16,
        border: '1px solid var(--color-border)',
        background: isActive ? 'var(--color-primary)' : 'var(--color-surface)',
        color: isActive ? 'white' : 'var(--color-text-body)',
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        fontFamily: 'inherit',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        transition: 'background 0.15s, color 0.15s',
      }}
    >
      <span>{icon}</span> {label}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SkillLibraryCards() {
  const { t } = useLocale();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [subFilter, setSubFilter] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    fetchAllSkills().then((result) => {
      if (result.ok) setSkills(toSkills(result.value));
      setLoading(false);
    });
  }, []);

  // Reset sub-filter when primary tab changes
  function handleTabChange(key: string) {
    setActiveTab(key);
    setSubFilter(null);
  }

  function handleSearchChange(value: string) {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(value.length >= 3 ? value : '');
    }, 300);
  }

  const filtered = useMemo(() => {
    let result = skills;

    // Apply primary tab filter
    switch (activeTab) {
      case 'foundation':
        result = result.filter((s) => foundationSet.has(s.slug));
        break;
      case 'domains': {
        const slugSet = subFilter
          ? getDomainSkillSlugs(subFilter)
          : getAllDomainSkillSlugs();
        result = result.filter((s) => slugSet.has(s.slug));
        break;
      }
      case 'features': {
        const slugSet = subFilter
          ? getFeatureSkillSlugs(subFilter)
          : getAllFeatureSkillSlugs();
        result = result.filter((s) => slugSet.has(s.slug));
        break;
      }
      case 'implementation':
        result = result.filter((s) => s.tags.type === 'implementation');
        break;
      // 'all' — no filter
    }

    // Apply search within category
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => s.title.toLowerCase().includes(q));
    }

    return result;
  }, [skills, activeTab, subFilter, searchQuery]);

  if (loading) {
    return (
      <div style={{ padding: 24, color: 'var(--color-text-muted)', fontSize: 14 }}>
        Loading...
      </div>
    );
  }

  const showDomainPills = activeTab === 'domains';
  const showFeaturePills = activeTab === 'features';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Tabs items={PRIMARY_TABS} activeKey={activeTab} onChange={handleTabChange} />

      {/* Sub-filter pills */}
      {(showDomainPills || showFeaturePills) && (
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 4,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <FilterPill
            icon={showDomainPills ? '🌐' : '📦'}
            label="All"
            isActive={subFilter === null}
            onClick={() => setSubFilter(null)}
          />
          {(showDomainPills ? DOMAIN_PILLS : FEATURE_PILLS).map((pill) => (
            <FilterPill
              key={pill.key}
              icon={pill.icon}
              label={pill.label}
              isActive={subFilter === pill.key}
              onClick={() => setSubFilter(subFilter === pill.key ? null : pill.key)}
            />
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="search-wrapper" style={{ position: 'relative' }}>
        <MagnifyingGlass
          size={18}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search skills..."
          style={{
            width: '100%',
            padding: '8px 12px 8px 36px',
            fontSize: 14,
            fontFamily: 'inherit',
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
          }}
        />
      </div>

      {/* Result count */}
      <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
        {filtered.length} {filtered.length === 1 ? 'skill' : 'skills'}
      </div>

      {/* Skill cards grid */}
      {filtered.length === 0 ? (
        <div style={{ padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <MagnifyingGlass size={32} style={{ color: 'var(--color-text-muted)', marginBottom: 8 }} />
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>
            No skills match your search
          </h3>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>
            Try a different search term or clear the filter
          </p>
          <button
            onClick={() => { handleSearchChange(''); setActiveTab('all'); }}
            style={{
              marginTop: 8,
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text-body)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Clear search
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
            gap: 16,
          }}
        >
          {filtered.map((skill) => (
            <SkillCard
              key={skill.slug}
              slug={skill.slug}
              title={skill.title}
              description={skill.description}
              isOfficial={skill.isOfficial}
              version={skill.version}
              tags={skill.tags}
              officialLabel={t('skills.official')}
              viewLabel={t('skills.view')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
