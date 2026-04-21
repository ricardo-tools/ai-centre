import { notFound } from 'next/navigation';
import { getProject, getProjectBrief, getProjectDecisions, getPrototypesForProject, getAllProjects } from '../../src/acl/project.repository';
import { getOpenPinCountForPrototype } from '../../src/acl/pin.repository';
import { groupPrototypesByVersion } from '../../src/acl/sidebar.mapper';
import { enAU } from '../../src/i18n/en-AU';
import Shell from '../../components/Shell';
import BriefDecisionsTabs from '../../src/widgets/BriefDecisionsTabs';
import VersionGroupedPrototypes from '../../src/widgets/VersionGroupedPrototypes';
import type { EnrichedPrototype, VersionGroup } from '../../src/widgets/VersionGroupedPrototypes';
import { User, CalendarBlank, Clock, Cube, PushPin, Stack, Robot } from '@phosphor-icons/react/dist/ssr';

export const dynamic = 'force-dynamic';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project: projectSlug } = await params;
  const project = await getProject(projectSlug);
  if (!project) notFound();

  const prototypes = await getPrototypesForProject(projectSlug);
  const brief = getProjectBrief(projectSlug);
  const decisions = getProjectDecisions(projectSlug);

  // Enrich each prototype with open pin count
  const enrichedPrototypes: EnrichedPrototype[] = await Promise.all(
    prototypes.map(async (p) => {
      const pinCount = await getOpenPinCountForPrototype(projectSlug, p.slug);
      return {
        slug: p.slug,
        projectSlug: p.projectSlug,
        name: p.name,
        agent: p.agent,
        shell: p.shell,
        tags: p.tags,
        createdBy: p.createdBy,
        createdAt: p.createdAt.toISOString(),
        formattedUpdatedAt: p.formattedUpdatedAt,
        commentCount: p.commentCount,
        pinCount,
      };
    }),
  );

  // Group by version using the sidebar mapper
  const sidebarProtos = enrichedPrototypes.map((p) => ({
    slug: p.slug,
    projectSlug: p.projectSlug,
    name: p.name,
    agent: p.agent,
    tags: p.tags,
    updatedAt: p.formattedUpdatedAt,
    createdAt: p.createdAt,
  }));
  const sidebarGroups = groupPrototypesByVersion(sidebarProtos, enAU.sidebar.versionLabels);

  // Map sidebar groups to VersionGroup shape with enriched prototype data
  const versionGroups: VersionGroup[] = sidebarGroups.map((group) => ({
    version: group.version,
    label: group.label,
    items: group.items
      .map((item) => enrichedPrototypes.find((ep) => ep.slug === item.slug)!)
      .filter(Boolean),
  }));

  // Quick stats
  const totalPrototypes = prototypes.length;
  const agentBreakdown = project.agentBreakdown;
  const totalOpenPins = enrichedPrototypes.reduce((sum, p) => sum + p.pinCount, 0);
  const versionCount = project.versionCount;

  const allProjects = await getAllProjects();

  return (
    <Shell
      projects={allProjects.map((p) => ({ slug: p.slug, name: p.name }))}
      prototypes={prototypes.map((p) => ({
        slug: p.slug,
        projectSlug: p.projectSlug,
        name: p.name,
        agent: p.agent,
        tags: p.tags,
        updatedAt: p.updatedAt.toISOString(),
        createdAt: p.createdAt.toISOString(),
      }))}
      currentProject={{ slug: project.slug, name: project.name }}
    >
      <div style={{ width: '100%' }}>
        {/* Page Header — full width */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--color-text-heading)',
              lineHeight: 1.2,
              marginBottom: 'var(--space-1)',
            }}
          >
            {project.name}
          </h1>
          <p
            style={{
              fontSize: 14,
              color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-3)',
            }}
          >
            {project.description}
          </p>

          {/* Meta row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
              fontSize: 12,
              color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-3)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <User size={14} weight="regular" />
              {enAU.project.createdBy} {project.createdBy}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <CalendarBlank size={14} weight="regular" />
              {project.formattedCreatedAt}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <Clock size={14} weight="regular" />
              {enAU.project.lastUpdated} {project.formattedUpdatedAt}
            </span>
          </div>

          {/* Quick stats row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-2)',
            }}
          >
            <StatBadge
              icon={<Cube size={14} weight="regular" />}
              label={enAU.project.totalPrototypes}
              value={String(totalPrototypes)}
            />
            <StatBadge
              icon={<Robot size={14} weight="regular" />}
              label={enAU.project.agents}
              value={`${agentBreakdown.strict}S / ${agentBreakdown.adaptive}A / ${agentBreakdown.creative}C`}
            />
            <StatBadge
              icon={<PushPin size={14} weight="regular" />}
              label={enAU.project.openPins}
              value={String(totalOpenPins)}
              highlight={totalOpenPins > 0}
            />
            <StatBadge
              icon={<Stack size={14} weight="regular" />}
              label={enAU.project.iterations}
              value={String(versionCount)}
            />
          </div>
        </div>

        {/* 12-column grid: prototypes (4 cols) | brief + decisions (8 cols) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '4fr 8fr',
            gap: 'var(--space-4)',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          {/* Left column: prototypes list */}
          <div>
            {versionGroups.length > 0 ? (
              <VersionGroupedPrototypes groups={versionGroups} totalCount={totalPrototypes} />
            ) : (
              <div
                style={{
                  padding: 'var(--space-6) var(--space-4)',
                  textAlign: 'center',
                  color: 'var(--color-text-muted)',
                  fontSize: 14,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                {enAU.project.noPrototypes}
              </div>
            )}
          </div>

          {/* Right column: brief + decisions */}
          <div>
            {(brief || decisions) ? (
              <BriefDecisionsTabs brief={brief} decisions={decisions} />
            ) : (
              <div
                style={{
                  padding: 'var(--space-6) var(--space-4)',
                  textAlign: 'center',
                  color: 'var(--color-text-muted)',
                  fontSize: 13,
                  fontStyle: 'italic',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                No brief or decisions yet. Add a brief.md to the project folder.
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function StatBadge({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        padding: 'var(--space-1) var(--space-2)',
        background: highlight ? 'var(--color-primary-muted)' : 'var(--color-code-bg)',
        borderRadius: 'var(--radius-sm)',
        fontSize: 12,
        color: highlight ? 'var(--color-primary)' : 'var(--color-text-body)',
        fontWeight: 500,
      }}
    >
      {icon}
      <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}
