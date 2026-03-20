'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  DOMAINS,
  FEATURE_ADDONS,
  FOUNDATION_SKILLS,
  resolveComposition,
  type DomainDefinition,
  type FeatureAddonDefinition,
} from '@/platform/lib/toolkit-composition';
import { TOOLKIT_PRESETS } from '@/platform/lib/archetypes';
import { generateProject } from '@/features/generate-project/action';

export interface UseCompositionWizardResult {
  // Domain
  domains: readonly DomainDefinition[];
  selectedDomain: string | null;
  selectDomain: (slug: string) => void;

  // Features
  featureAddons: readonly FeatureAddonDefinition[];
  selectedAddons: Set<string>;
  toggleAddon: (slug: string) => void;

  // Implementations
  implementationChoices: Record<string, string | null>;
  selectImplementation: (addonSlug: string, implSlug: string | null) => void;

  // Resolved
  foundationSkills: readonly string[];
  resolvedSkills: string[];
  skillCount: number;

  // Description
  description: string;
  setDescription: (d: string) => void;

  // State
  isGenerating: boolean;
  generate: () => void;
}

export function useCompositionWizard(): UseCompositionWizardResult {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [implementationChoices, setImplementationChoices] = useState<Record<string, string | null>>({});
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Load preset from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const presetSlug = params.get('preset');
    if (!presetSlug) return;

    const preset = TOOLKIT_PRESETS.find((p) => p.slug === presetSlug);
    if (!preset) return;

    const sel = preset.compositionSelection;
    setSelectedDomain(sel.domainSlug);
    setSelectedAddons(new Set(sel.addonSlugs));

    // Set implementation choices, defaulting to first option for addons without explicit choice
    const choices: Record<string, string | null> = { ...sel.implementationChoices };
    for (const addonSlug of sel.addonSlugs) {
      if (!(addonSlug in choices)) {
        const addon = FEATURE_ADDONS.find((f) => f.slug === addonSlug);
        if (addon && addon.implementations.length > 0) {
          choices[addonSlug] = addon.implementations[0].slug;
        }
      }
    }
    setImplementationChoices(choices);
  }, []);

  const selectDomain = useCallback((slug: string) => {
    setSelectedDomain((prev) => {
      if (prev === slug) {
        // Deselect
        setSelectedAddons(new Set());
        setImplementationChoices({});
        return null;
      }

      // Select new domain — apply recommended addons
      const domain = DOMAINS.find((d) => d.slug === slug);
      if (!domain) return prev;

      const recommended = new Set(domain.recommendedAddons as string[]);
      setSelectedAddons(recommended);

      // Default implementation choices for recommended addons
      const choices: Record<string, string | null> = {};
      for (const addonSlug of recommended) {
        const addon = FEATURE_ADDONS.find((f) => f.slug === addonSlug);
        if (addon && addon.implementations.length > 0) {
          choices[addonSlug] = addon.implementations[0].slug;
        }
      }
      setImplementationChoices(choices);

      return slug;
    });
  }, []);

  const toggleAddon = useCallback((slug: string) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
        // Clean up implementation choice
        setImplementationChoices((prevChoices) => {
          const updated = { ...prevChoices };
          delete updated[slug];
          return updated;
        });
      } else {
        next.add(slug);
        // Auto-select first implementation if available
        const addon = FEATURE_ADDONS.find((f) => f.slug === slug);
        if (addon && addon.implementations.length > 0) {
          setImplementationChoices((prevChoices) => ({
            ...prevChoices,
            [slug]: addon.implementations[0].slug,
          }));
        }
      }
      return next;
    });
  }, []);

  const selectImplementation = useCallback((addonSlug: string, implSlug: string | null) => {
    setImplementationChoices((prev) => ({
      ...prev,
      [addonSlug]: implSlug,
    }));
  }, []);

  const resolvedSkills = useMemo(() => {
    if (!selectedDomain) return [...FOUNDATION_SKILLS];
    return resolveComposition({
      domainSlug: selectedDomain,
      addonSlugs: Array.from(selectedAddons),
      implementationChoices,
    });
  }, [selectedDomain, selectedAddons, implementationChoices]);

  const generate = useCallback(async () => {
    if (!selectedDomain || !description.trim()) return;
    setIsGenerating(true);

    try {
      const result = await generateProject({
        domainSlug: selectedDomain,
        resolvedSkills,
        description,
      });

      if (!result.ok) {
        console.error('[CompositionWizard] Generation failed:', result.error.message);
        return;
      }

      // Convert base64 back to Blob and trigger download
      const bytes = Uint8Array.from(atob(result.value.zipBase64), c => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.value.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[CompositionWizard] Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedDomain, resolvedSkills, description]);

  return {
    domains: DOMAINS,
    selectedDomain,
    selectDomain,
    featureAddons: FEATURE_ADDONS,
    selectedAddons,
    toggleAddon,
    implementationChoices,
    selectImplementation,
    foundationSkills: FOUNDATION_SKILLS,
    resolvedSkills,
    skillCount: resolvedSkills.length,
    description,
    setDescription,
    isGenerating,
    generate,
  };
}
