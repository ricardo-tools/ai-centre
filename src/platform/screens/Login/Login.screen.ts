import type { ScreenRendererConfig } from '@/platform/screen-renderer/types';

/**
 * Login page layout: single centered login widget.
 * No TopNav — standalone page outside the app shell.
 */
export const loginScreenConfig: ScreenRendererConfig = {
  locale: 'en-AU',
  grid: {
    columns: 1,
    rows: 1,
    rowHeight: 'auto',
    gap: 0,
  },
  entries: [
    {
      widgetName: 'login',
      size: { default: 'xs', sm: 'sm', md: 'md', lg: 'lg' },
      grid: { col: 1, colSpan: 1, row: 1, rowSpan: 1 },
    },
  ],
};
