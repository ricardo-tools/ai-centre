import type { ScreenRendererConfig } from '@/platform/screen-renderer/types';

/**
 * App shell layout: TopNav widget (fixed height) + main content slot (scrollable).
 * Uses a 1-column, 2-row grid. Row 1 is the nav (auto height), Row 2 is the content slot.
 */
export const appShellConfig: ScreenRendererConfig = {
  locale: 'en-AU',
  grid: {
    columns: 1,
    rows: 2,
    rowHeight: 'auto',
    gap: 0,
  },
  entries: [
    {
      widgetName: 'top-nav',
      size: { default: 'xs', sm: 'sm', md: 'md', lg: 'lg' },
      grid: { col: 1, colSpan: 1, row: 1, rowSpan: 1 },
    },
    {
      type: 'slot',
      name: 'main-content',
      grid: { col: 1, colSpan: 1, row: 2, rowSpan: 1 },
    },
  ],
};
