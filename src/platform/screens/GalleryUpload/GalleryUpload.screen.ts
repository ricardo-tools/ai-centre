import type { ScreenRendererConfig } from '@/platform/screen-renderer/types';

export const galleryUploadConfig: ScreenRendererConfig = {
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
      name: 'upload-form',
      grid: { col: 1, colSpan: 1, row: 1, rowSpan: 1 },
    },
  ],
};
