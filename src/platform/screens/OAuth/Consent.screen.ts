import type { ScreenRendererConfig } from '@/platform/screen-renderer/types';

/**
 * OAuth consent page layout: single centered consent widget.
 * No TopNav — standalone page outside the app shell (like login).
 */
export const consentScreenConfig: ScreenRendererConfig = {
  locale: 'en-AU',
  grid: {
    columns: 1,
    rows: 1,
    rowHeight: 'auto',
    gap: 0,
  },
  entries: [
    {
      widgetName: 'oauth-consent',
      size: { default: 'xs', sm: 'sm', md: 'md', lg: 'lg' },
      grid: { col: 1, colSpan: 1, row: 1, rowSpan: 1 },
    },
  ],
};
