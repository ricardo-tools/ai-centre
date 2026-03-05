import type { ScreenRendererConfig } from '@/screen-renderer/types';

export const homeConfig: ScreenRendererConfig = {
  locale: 'en-AU',
  grid: {
    columns: 1,
    rows: 'auto',
    rowHeight: 'auto',
    gap: 0,
  },
  entries: [
    {
      type: 'slot',
      name: 'hero',
      grid: { col: 1, colSpan: 1, row: 1, rowSpan: 1 },
    },
    {
      type: 'slot',
      name: 'skills',
      grid: { col: 1, colSpan: 1, row: 2, rowSpan: 1 },
    },
  ],
};
