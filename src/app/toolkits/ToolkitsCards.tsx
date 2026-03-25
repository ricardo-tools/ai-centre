'use client';

import React, { useState } from 'react';
import { TOOLKIT_PRESETS } from '@/platform/lib/archetypes';
import { DOMAINS, FEATURE_ADDONS } from '@/platform/lib/toolkit-composition';
import { ToolkitCard } from '@/platform/components/ToolkitCard';
import { CommentDrawer } from '@/platform/components/CommentDrawer';
import { useSession } from '@/platform/lib/SessionContext';
import { useSocialSignals } from '@/features/social/useSocialSignals';

function getDomainName(domainSlug: string): string {
  const domain = DOMAINS.find((d) => d.slug === domainSlug);
  return domain?.title ?? domainSlug;
}

function getAddonNames(addonSlugs: readonly string[]): string[] {
  return addonSlugs
    .map((slug) => {
      const addon = FEATURE_ADDONS.find((f) => f.slug === slug);
      return addon?.title ?? slug;
    });
}

function SocialToolkitCard({ preset, onCommentClick }: { preset: typeof TOOLKIT_PRESETS[0]; onCommentClick: () => void }) {
  const session = useSession();
  const social = useSocialSignals({
    entityType: 'toolkit',
    entityId: preset.slug,
    userId: session?.userId,
  });

  return (
    <ToolkitCard
      slug={preset.slug}
      title={preset.title}
      description={preset.description}
      icon={preset.icon}
      domainName={getDomainName(preset.compositionSelection.domainSlug)}
      addonNames={getAddonNames(preset.compositionSelection.addonSlugs)}
      skillCount={preset.skills.length}
      upvoteCount={social.upvoteCount}
      commentCount={0}
      isUpvoted={social.isUpvoted}
      isBookmarked={social.isBookmarked}
      onToggleUpvote={social.toggleUpvote}
      onToggleBookmark={social.toggleBookmark}
      onCommentClick={onCommentClick}
    />
  );
}

export function ToolkitsCards() {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [commentSlug, setCommentSlug] = useState<string | null>(null);
  const session = useSession();

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(360px, 100%), 1fr))', gap: 24 }}>
        {TOOLKIT_PRESETS.map((preset) => (
          <React.Fragment key={preset.slug}>
            <SocialToolkitCard
              preset={preset}
              onCommentClick={() => setCommentSlug(commentSlug === preset.slug ? null : preset.slug)}
            />
            {commentSlug === preset.slug && (
              <CommentDrawer
                entityType="toolkit"
                entityId={preset.slug}
                entityTitle={preset.title}
                currentUserId={session?.userId}
                isAdmin={session?.roleSlug === 'admin'}
                onClose={() => setCommentSlug(null)}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
