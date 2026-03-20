import type { ScreenRendererConfig } from '@/platform/screen-renderer/types';

export const adminConfig: ScreenRendererConfig = {
  locale: 'en-AU',
  grid: {
    columns: 1,
    rows: 'auto',
    rowHeight: 'auto',
    gap: { default: 16, md: 24, lg: 32 },
  },
  entries: [
    {
      type: 'slot',
      name: 'header',
      grid: { col: 1, colSpan: 1, row: 1, rowSpan: 1 },
    },
    {
      type: 'slot',
      name: 'users',
      grid: { col: 1, colSpan: 1, row: 2, rowSpan: 1 },
    },
    {
      type: 'slot',
      name: 'audit',
      grid: { col: 1, colSpan: 1, row: 3, rowSpan: 1 },
    },
  ],
};
