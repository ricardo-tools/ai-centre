import type { ScreenRendererConfig } from '@/platform/screen-renderer/types';

export const skillDetailConfig: ScreenRendererConfig = {
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
      name: 'detail',
      grid: { col: 1, colSpan: 1, row: 1, rowSpan: 1 },
    },
  ],
};
