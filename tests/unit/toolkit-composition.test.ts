import { describe, it, expect } from 'vitest';
import {
  resolveComposition,
  FOUNDATION_SKILLS,
  DOMAINS,
  FEATURE_ADDONS,
  type CompositionSelection,
} from '@/platform/lib/toolkit-composition';
import { TOOLKIT_PRESETS } from '@/platform/lib/archetypes';

describe('resolveComposition', () => {
  it('always includes foundation skills regardless of selection', () => {
    const result = resolveComposition({
      domainSlug: '',
      addonSlugs: [],
      implementationChoices: {},
    });

    for (const skill of FOUNDATION_SKILLS) {
      expect(result).toContain(skill);
    }
  });

  it('adds domain skills when a domain is selected', () => {
    const webApp = DOMAINS.find((d) => d.slug === 'web-app')!;
    const result = resolveComposition({
      domainSlug: 'web-app',
      addonSlugs: [],
      implementationChoices: {},
    });

    for (const skill of webApp.skills) {
      expect(result).toContain(skill);
    }
  });

  it('adds feature addon principle skills when addon is selected', () => {
    const authAddon = FEATURE_ADDONS.find((f) => f.slug === 'auth')!;
    const result = resolveComposition({
      domainSlug: 'api-service',
      addonSlugs: ['auth'],
      implementationChoices: {},
    });

    for (const skill of authAddon.principleSkills) {
      expect(result).toContain(skill);
    }
  });

  it('adds implementation skills when an implementation is chosen', () => {
    const result = resolveComposition({
      domainSlug: 'api-service',
      addonSlugs: ['database'],
      implementationChoices: { database: 'neon-drizzle' },
    });

    expect(result).toContain('database-design');
    expect(result).toContain('db-neon-drizzle');
  });

  it('deduplicates skills across foundation and domain', () => {
    const result = resolveComposition({
      domainSlug: 'web-app',
      addonSlugs: ['observability-addon'],
      implementationChoices: {},
    });

    // 'observability' appears in both web-app domain and observability-addon principle skills
    const observabilityCount = result.filter((s) => s === 'observability').length;
    expect(observabilityCount).toBe(1);
  });

  it('produces only foundation + domain skills with empty addon list', () => {
    const domain = DOMAINS.find((d) => d.slug === 'print')!;
    const result = resolveComposition({
      domainSlug: 'print',
      addonSlugs: [],
      implementationChoices: {},
    });

    const expected = new Set([...FOUNDATION_SKILLS, ...domain.skills]);
    expect(result).toHaveLength(expected.size);
    for (const skill of expected) {
      expect(result).toContain(skill);
    }
  });

  it('produces only foundation skills for unknown domain slug', () => {
    const result = resolveComposition({
      domainSlug: 'nonexistent-domain',
      addonSlugs: [],
      implementationChoices: {},
    });

    expect(result).toHaveLength(FOUNDATION_SKILLS.length);
    for (const skill of FOUNDATION_SKILLS) {
      expect(result).toContain(skill);
    }
  });

  it('silently ignores unknown addon slugs', () => {
    const baseline = resolveComposition({
      domainSlug: 'api-service',
      addonSlugs: [],
      implementationChoices: {},
    });

    const withUnknown = resolveComposition({
      domainSlug: 'api-service',
      addonSlugs: ['totally-fake-addon'],
      implementationChoices: {},
    });

    expect(withUnknown).toEqual(baseline);
  });

  it('returns a flat array of strings', () => {
    const result = resolveComposition({
      domainSlug: 'web-app',
      addonSlugs: ['auth', 'database'],
      implementationChoices: { auth: 'clerk', database: 'supabase' },
    });

    expect(Array.isArray(result)).toBe(true);
    for (const item of result) {
      expect(typeof item).toBe('string');
    }
  });

  it('resolves preset compositions to expected skill counts', () => {
    const presentation = TOOLKIT_PRESETS.find((p) => p.slug === 'presentation')!;
    const webDashboard = TOOLKIT_PRESETS.find((p) => p.slug === 'web-dashboard')!;

    // Foundation (reduced after removing stubs/renamed skills) + domain + pptx-export
    expect(presentation.skills.length).toBeGreaterThanOrEqual(12);
    expect(presentation.skills).toContain('presentation');
    expect(presentation.skills).toContain('pptx-export');
    expect(presentation.skills).toContain('coding-standards');

    // Web dashboard: foundation + web-app domain + auth + database + testing + observability
    // Should be significantly larger
    expect(webDashboard.skills.length).toBeGreaterThan(presentation.skills.length);
    expect(webDashboard.skills).toContain('nextjs-app-router-turbopack');
    expect(webDashboard.skills).toContain('authentication');
    expect(webDashboard.skills).toContain('auth-custom-otp');
    expect(webDashboard.skills).toContain('db-neon-drizzle');
    expect(webDashboard.skills).toContain('testing-strategy');
    expect(webDashboard.skills).toContain('observability');
  });
});
