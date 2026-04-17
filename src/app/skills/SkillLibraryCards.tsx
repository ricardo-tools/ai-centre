'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MagnifyingGlass, SortAscending, TrendUp } from '@phosphor-icons/react';
import { Tabs } from '@/platform/components/Tabs';
import { fetchAllSkills } from '@/features/skill-library/action';
import { toSkills } from '@/platform/acl/skill.mapper';
import type { Skill } from '@/platform/domain/Skill';
import { SkillCard } from '@/platform/components/SkillCard';
import { useLocale } from '@/platform/screen-renderer/LocaleContext';
import { useSession } from '@/platform/lib/SessionContext';
import { useSocialSignals } from '@/features/social/useSocialSignals';
import { getBulkSocialSignals, type BulkSocialSignal } from '@/features/social/action';
import { useBookmarkOrder } from '@/features/social/useBookmarkOrder';
import { CommentDrawer } from '@/platform/components/CommentDrawer';

type SortMode = 'recent' | 'popular';

// ─── Primary tabs ─────────────────────────────────────────────────────────────

// ─── Social wrapper per card ─────────────────────────────────────────────────

function SocialSkillCard({ skill, officialLabel, viewLabel, initialData }: { skill: Skill; officialLabel: string; viewLabel: string; initialData?: BulkSocialSignal }) {
  const session = useSession();
  const [showComments, setShowComments] = useState(false);
  const social = useSocialSignals({
    entityType: 'skill',
    entityId: skill.slug,
    userId: session?.userId,
    initialData,
  });

  return (
    <>
      <SkillCard
        slug={skill.slug}
        title={skill.title}
        description={skill.description}
        isOfficial={skill.isOfficial}
        version={skill.version}
        tags={skill.tags}
        officialLabel={officialLabel}
        viewLabel={viewLabel}
        author={skill.isOfficial ? 'Official' : undefined}
        upvoteCount={social.upvoteCount}
        commentCount={initialData?.commentCount ?? 0}
        isUpvoted={social.isUpvoted}
        isBookmarked={social.isBookmarked}
        onToggleUpvote={social.toggleUpvote}
        onToggleBookmark={social.toggleBookmark}
        onCommentClick={() => setShowComments(true)}
      />
      {showComments && (
        <CommentDrawer
          entityType="skill"
          entityId={skill.slug}
          entityTitle={skill.title}
          currentUserId={session?.userId}
          isAdmin={session?.roleSlug === 'admin'}
          onClose={() => setShowComments(false)}
        />
      )}
    </>
  );
}

// ─── Primary tabs ─────────────────────────────────────────────────────────────

const PRIMARY_TABS = [
  { key: 'all', label: 'All' },
  { key: 'design', label: 'Design' },
  { key: 'engineering', label: 'Engineering' },
  { key: 'ai', label: 'AI' },
  { key: 'workflow', label: 'Workflow' },
];

// ─── Category filter sets ─────────────────────────────────────────────────────

const DESIGN_SLUGS = new Set([
  'accessibility', 'app-layout', 'brand-design-system', 'content-design',
  'creative-toolkit', 'design-foundations', 'interaction-motion', 'pptx-export',
  'presentation', 'presentation-html', 'print-design', 'responsiveness',
  'user-experience',
]);

const AI_SLUGS = new Set([
  'ai-capabilities', 'ai-claude', 'ai-fal-media', 'ai-openrouter',
]);

// ─── Main component ───────────────────────────────────────────────────────────

export function SkillLibraryCards() {
  const { t } = useLocale();
  const session = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [socialData, setSocialData] = useState<Record<string, BulkSocialSignal>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const bookmarkedSlugs = useBookmarkOrder('skill');
  const sortMode: SortMode = searchParams.get('sort') === 'popular' ? 'popular' : 'recent';

  const handleSortChange = useCallback((mode: SortMode) => {
    const params = new URLSearchParams(searchParams.toString());
    if (mode === 'popular') {
      params.set('sort', 'popular');
    } else {
      params.delete('sort');
    }
    const qs = params.toString();
    router.replace(`/skills${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [searchParams, router]);

  useEffect(() => {
    fetchAllSkills().then(async (result) => {
      if (result.ok) {
        const loaded = toSkills(result.value);
        // Bulk fetch social signals BEFORE setting skills, so cards mount with initialData
        const slugs = loaded.map((s) => s.slug);
        const data = await getBulkSocialSignals('skill', slugs, session?.userId ?? undefined).catch(() => ({}));
        setSocialData(data);
        setSkills(loaded);
      }
      setLoading(false);
    });
  }, [session?.userId]);

  function handleTabChange(key: string) {
    setActiveTab(key);
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
      case 'design':
        result = result.filter((s) => DESIGN_SLUGS.has(s.slug));
        break;
      case 'engineering':
        result = result.filter((s) =>
          s.tags.layer !== 'workflow' && !DESIGN_SLUGS.has(s.slug) && !AI_SLUGS.has(s.slug)
        );
        break;
      case 'ai':
        result = result.filter((s) => AI_SLUGS.has(s.slug));
        break;
      case 'workflow':
        result = result.filter((s) => s.tags.layer === 'workflow');
        break;
      default:
        // 'all' — exclude workflow skills (they have their own tab)
        result = result.filter((s) => s.tags.layer !== 'workflow');
        break;
    }

    // Apply search within category
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => s.title.toLowerCase().includes(q));
    }

    return result;
  }, [skills, activeTab, searchQuery]);

  // Sort: bookmarked first, then by sort mode
  const sortedSkills = useMemo(() => {
    const bookmarked = filtered.filter((s) => bookmarkedSlugs.has(s.slug));
    const rest = filtered.filter((s) => !bookmarkedSlugs.has(s.slug));

    if (sortMode === 'popular') {
      rest.sort((a, b) => {
        const diff = (socialData[b.slug]?.upvoteCount ?? 0) - (socialData[a.slug]?.upvoteCount ?? 0);
        if (diff !== 0) return diff;
        return a.title.localeCompare(b.title);
      });
    }
    // 'recent' keeps the default order from the skills list (insertion order)

    return [...bookmarked, ...rest];
  }, [filtered, bookmarkedSlugs, socialData, sortMode]);

  if (loading) {
    return (
      <div style={{ padding: 24, color: 'var(--color-text-muted)', fontSize: 14 }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Tabs items={PRIMARY_TABS} activeKey={activeTab} onChange={handleTabChange} />

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

      {/* Result count + sort toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
          {filtered.length} {filtered.length === 1 ? 'skill' : 'skills'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            data-testid="sort-recent"
            onClick={() => handleSortChange('recent')}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '4px 10px', borderRadius: 6,
              border: '1px solid var(--color-border)',
              background: sortMode === 'recent' ? 'var(--color-primary-muted)' : 'var(--color-surface)',
              color: sortMode === 'recent' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontSize: 12, fontWeight: sortMode === 'recent' ? 600 : 400,
              fontFamily: 'inherit', cursor: 'pointer',
              transition: 'all 150ms',
            }}
          >
            <SortAscending size={14} /> Recent
          </button>
          <button
            data-testid="sort-popular"
            onClick={() => handleSortChange('popular')}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '4px 10px', borderRadius: 6,
              border: '1px solid var(--color-border)',
              background: sortMode === 'popular' ? 'var(--color-primary-muted)' : 'var(--color-surface)',
              color: sortMode === 'popular' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontSize: 12, fontWeight: sortMode === 'popular' ? 600 : 400,
              fontFamily: 'inherit', cursor: 'pointer',
              transition: 'all 150ms',
            }}
          >
            <TrendUp size={14} /> Popular
          </button>
        </div>
      </div>

      {/* Workflow WIP alert */}
      {activeTab === 'workflow' && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            background: 'var(--color-warning-muted, rgba(245, 158, 11, 0.1))',
            border: '1px solid var(--color-warning, #f59e0b)',
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
            fontSize: 13,
            lineHeight: 1.5,
            color: 'var(--color-text-body)',
          }}
        >
          <span style={{ fontSize: 16, flexShrink: 0 }}>&#9888;</span>
          <div>
            <strong style={{ color: 'var(--color-text-heading)' }}>Workflow skills are a package.</strong>{' '}
            These skills work together as the Flow methodology and are not available for individual download.
            They are included automatically when Flow is part of a toolkit.
          </div>
        </div>
      )}

      {/* Skill cards grid */}
      {sortedSkills.length === 0 ? (
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
          {sortedSkills.map((skill) => (
            <SocialSkillCard
              key={skill.slug}
              skill={skill}
              officialLabel={t('skills.official')}
              viewLabel={t('skills.view')}
              initialData={socialData[skill.slug] ?? { upvoteCount: 0, commentCount: 0, isUpvoted: false, isBookmarked: false }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
