'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { DownloadSimple, FileText, Lightning, ArrowLeft, ArrowRight, Code, Table, ListBullets } from '@phosphor-icons/react';
import { useLocale } from '@/platform/screen-renderer/LocaleContext';
import { useSession } from '@/platform/lib/SessionContext';
import { Stat } from '@/platform/components/Stat';
import { ToggleButton } from '@/platform/components/ToggleButton';
import { SkillShowcase } from '@/platform/components/SkillShowcase';
import { BookmarkButton } from '@/platform/components/BookmarkButton';
import { SkillInPractice } from './SkillInPractice';
import { CommentThread } from '@/platform/components/CommentThread';
import { isBookmarked as checkBookmarked, toggleBookmark } from '@/features/social/bookmarks-action';
import { trackSkillDownload, getSkillDownloadCount, getRelatedSkills, downloadSkillWithCompanions } from '@/features/social/action';
import type { Skill } from '@/platform/domain/Skill';
import type { ParsedSkillContent } from '@/platform/domain/ParsedSkill';

// Related skills fetched via server action (skills.ts uses fs, can't import in client)

interface SkillDetailLGProps {
  skill: Skill;
  parsed: ParsedSkillContent;
}

export function SkillDetailLG({ skill, parsed }: SkillDetailLGProps) {
  const { t } = useLocale();
  const session = useSession();
  const [view, setView] = useState<'practice' | 'markdown'>('practice');
  const [bookmarked, setBookmarked] = useState(false);
  const [downloadCount, setDownloadCount] = useState<number>(0);

  // Check bookmark status on mount
  useEffect(() => {
    if (session?.userId) {
      checkBookmarked(session.userId, 'skill', skill.slug).then(setBookmarked);
    }
  }, [session?.userId, skill.slug]);

  // Fetch download count on mount
  useEffect(() => {
    getSkillDownloadCount(skill.slug).then(setDownloadCount);
  }, [skill.slug]);

  const [relatedSkills, setRelatedSkills] = useState<Array<{ slug: string; title: string; description: string; isOfficial: boolean; version: string; tags: { type: string; domain: string[]; layer: string } }>>([]);
  useEffect(() => {
    if (skill.tags) {
      getRelatedSkills(skill.slug, skill.tags.domain, skill.tags.layer, skill.tags.type).then(setRelatedSkills);
    }
  }, [skill.slug, skill.tags]);

  const handleToggleBookmark = useCallback(async (): Promise<{ bookmarked: boolean } | null> => {
    if (!session) return null;
    const result = await toggleBookmark('skill', skill.slug, session.userId);
    if (result.ok) return result.value;
    return null;
  }, [session, skill.slug]);

  const handleDownloadWithCompanions = useCallback(async () => {
    trackSkillDownload(skill.slug, 'detail_download');
    const result = await downloadSkillWithCompanions(skill.slug);
    if (!result.ok) return;

    const { zipBase64, fileName, isSingle } = result.value;
    const bytes = Uint8Array.from(atob(zipBase64), c => c.charCodeAt(0));
    const mimeType = isSingle ? 'text/markdown' : 'application/zip';
    const blob = new Blob([bytes], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [skill.slug]);

  return (
    <div style={{ maxWidth: 1024 }}>
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
        <ArrowLeft size={14} /> {t('skillDetail.backToSkills')}
      </Link>

      {/* Hero */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--color-text-heading)',
              margin: 0,
            }}
          >
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
              {t('skills.official')}
            </span>
          )}
        </div>

        <p
          style={{
            fontSize: 16,
            color: 'var(--color-text-body)',
            lineHeight: 1.6,
            marginBottom: 24,
            maxWidth: 700,
          }}
        >
          {skill.description}
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
          <Stat icon={<ListBullets size={16} />} label={t('skillDetail.sections')} value={parsed.sectionCount} />
          <Stat icon={<Code size={16} />} label={t('skillDetail.codeExamples')} value={parsed.codeExampleCount} />
          <Stat icon={<Table size={16} />} label={t('skillDetail.referenceTables')} value={parsed.referenceTableCount} />
          <Stat icon={<FileText size={16} />} label={t('skillDetail.version')} value={skill.formatVersion('')} />
          {downloadCount > 0 && (
            <Stat icon={<DownloadSimple size={16} />} label="Downloads" value={downloadCount} />
          )}
        </div>

        {/* Actions row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={handleDownloadWithCompanions}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 20px',
              borderRadius: 6,
              background: 'var(--color-primary)',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            <DownloadSimple size={16} weight="bold" /> {t('skillDetail.download')}
          </button>

          {session && (
            <BookmarkButton
              isBookmarked={bookmarked}
              onToggle={handleToggleBookmark}
              size={20}
            />
          )}

          {/* View toggle */}
          <div
            style={{
              display: 'flex',
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              background: 'transparent',
              overflow: 'hidden',
            }}
          >
            <ToggleButton
              active={view === 'practice'}
              onClick={() => setView('practice')}
              icon={<Lightning size={14} />}
              label={t('skillDetail.skillInPractice')}
            />
            <ToggleButton
              active={view === 'markdown'}
              onClick={() => setView('markdown')}
              icon={<FileText size={14} />}
              label={t('skillDetail.viewSkillMd')}
            />
          </div>
        </div>
      </div>

      {/* Content — grid-stack to prevent layout shift on toggle */}
      <div style={{ display: 'grid' }}>
        <div style={{ gridArea: '1 / 1', visibility: view === 'practice' ? 'visible' : 'hidden' }}>
          <SkillInPractice slug={skill.slug} parsed={parsed} />
        </div>
        <div style={{ gridArea: '1 / 1', visibility: view === 'markdown' ? 'visible' : 'hidden' }}>
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
        </div>
      </div>
      {/* Related skills */}
      {relatedSkills.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--color-text-heading)',
              margin: '0 0 16px',
            }}
          >
            Related skills
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))',
              gap: 16,
            }}
          >
            {relatedSkills.map((rs) => (
              <Link
                key={rs.slug}
                href={`/skills/${rs.slug}`}
                className="card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 20,
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  textDecoration: 'none',
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--color-text-heading)',
                    marginBottom: 6,
                  }}
                >
                  {rs.title}
                </span>
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.5,
                    margin: '0 0 12px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                    overflow: 'hidden',
                    flex: 1,
                  }}
                >
                  {rs.description}
                </p>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                    color: 'var(--color-text-body)',
                    fontWeight: 500,
                  }}
                >
                  View <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Discussion */}
      <section style={{ marginTop: 48 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--color-text-heading)',
            marginBottom: 24,
          }}
        >
          Discussion
        </h2>
        <CommentThread
          entityType="skill"
          entityId={skill.slug}
          currentUserId={session?.userId}
          isAdmin={session?.roleSlug === 'admin'}
        />
      </section>
    </div>
  );
}
