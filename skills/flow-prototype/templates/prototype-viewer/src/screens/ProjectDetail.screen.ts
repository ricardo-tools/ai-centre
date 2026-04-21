import { ScreenRendererConfig } from '../screen-renderer/ScreenRendererConfig';
import type { GridConfig, WidgetEntry } from '../domain/types';
import { Prototype } from '../domain/Prototype';

export class ProjectDetailScreen extends ScreenRendererConfig {
  readonly screenId = 'project-detail';

  readonly grid: GridConfig = {
    columns: { default: 1, sm: 2, lg: 3 },
    rows: 'auto',
    rowHeight: 'auto',
    gap: { default: 16 },
  };

  readonly widgets: WidgetEntry[];

  constructor(prototypes: Prototype[]) {
    super();
    this.widgets = prototypes.map((prototype) => ({
      key: `prototype-card-${prototype.slug}`,
      widgetId: 'prototype-card',
      size: { default: 'sm', md: 'md', lg: 'lg' },
      grid: {
        col: 1,
        colSpan: 1,
        row: 1,
        rowSpan: 1,
      },
      props: {
        prototype: {
          slug: prototype.slug,
          projectSlug: prototype.projectSlug,
          name: prototype.name,
          agent: prototype.agent,
          tags: prototype.tags,
          commentCount: prototype.commentCount,
          formattedUpdatedAt: prototype.formattedUpdatedAt,
        },
      },
    }));
  }
}
