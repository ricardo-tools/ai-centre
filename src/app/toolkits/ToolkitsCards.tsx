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
    <div style={{ maxWidth: 960 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
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
