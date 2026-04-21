import { ScreenRendererConfig } from '../screen-renderer/ScreenRendererConfig';
import type { GridConfig, WidgetEntry } from '../domain/types';
import { Project } from '../domain/Project';

export class HomeScreen extends ScreenRendererConfig {
  readonly screenId = 'home';

  readonly grid: GridConfig = {
    columns: { default: 1, sm: 1, lg: 2 },
    rows: 'auto',
    rowHeight: 'auto',
    gap: { default: 16 },
  };

  readonly widgets: WidgetEntry[];

  constructor(projects: Project[]) {
    super();
    this.widgets = projects.map((project) => ({
      key: `project-card-${project.slug}`,
      widgetId: 'project-card',
      size: { default: 'sm', md: 'md', lg: 'lg' },
      grid: {
        col: 1,
        colSpan: 1,
        row: 1,
        rowSpan: 1,
      },
      props: {
        project: {
          slug: project.slug,
          name: project.name,
          description: project.description,
          createdBy: project.createdBy,
          prototypeCount: project.prototypeCount,
          formattedCreatedAt: project.formattedCreatedAt,
          formattedUpdatedAt: project.formattedUpdatedAt,
          agentBreakdown: project.agentBreakdown,
          versionCount: project.versionCount,
          openPinCount: project.openPinCount,
          latestPrototype: project.latestPrototype
            ? {
                name: project.latestPrototype.name,
                agent: project.latestPrototype.agent,
                formattedDate: project.formattedLatestPrototypeDate!,
              }
            : null,
          briefExcerpt: project.briefExcerpt ?? null,
        },
      },
    }));
  }
}
