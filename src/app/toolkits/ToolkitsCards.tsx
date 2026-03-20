'use client';

import { TOOLKIT_PRESETS } from '@/platform/lib/archetypes';
import { DOMAINS, FEATURE_ADDONS } from '@/platform/lib/toolkit-composition';
import { ToolkitCard } from '@/platform/components/ToolkitCard';

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
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(360px, 100%), 1fr))', gap: 24 }}>
        {TOOLKIT_PRESETS.map((preset) => (
          <ToolkitCard
            key={preset.slug}
            slug={preset.slug}
            title={preset.title}
            description={preset.description}
            icon={preset.icon}
            domainName={getDomainName(preset.compositionSelection.domainSlug)}
            addonNames={getAddonNames(preset.compositionSelection.addonSlugs)}
            skillCount={preset.skills.length}
          />
        ))}
      </div>
    </div>
  );
}
