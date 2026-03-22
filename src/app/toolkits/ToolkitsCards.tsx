'use client';

import React, { useState } from 'react';
import { TOOLKIT_PRESETS } from '@/platform/lib/archetypes';
import { DOMAINS, FEATURE_ADDONS } from '@/platform/lib/toolkit-composition';
import { ToolkitCard } from '@/platform/components/ToolkitCard';
import { CommentThread } from '@/platform/components/CommentThread';
import { useSession } from '@/platform/lib/SessionContext';

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

export function ToolkitsCards() {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const session = useSession();

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(360px, 100%), 1fr))', gap: 24 }}>
        {TOOLKIT_PRESETS.map((preset) => (
          <React.Fragment key={preset.slug}>
            <ToolkitCard
              slug={preset.slug}
              title={preset.title}
              description={preset.description}
              icon={preset.icon}
              domainName={getDomainName(preset.compositionSelection.domainSlug)}
              addonNames={getAddonNames(preset.compositionSelection.addonSlugs)}
              skillCount={preset.skills.length}
              likeCount={0}
              commentCount={0}
              onCommentClick={() => setExpandedSlug(expandedSlug === preset.slug ? null : preset.slug)}
            />
            {expandedSlug === preset.slug && (
              <div style={{ gridColumn: '1 / -1', padding: 24, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)' }}>
                <CommentThread
                  entityType="toolkit"
                  entityId={preset.slug}
                  currentUserId={session?.userId}
                  isAdmin={session?.roleSlug === 'admin'}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
