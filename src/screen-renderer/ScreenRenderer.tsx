'use client';

import { useBreakpoint } from './useBreakpoint';
import { resolveResponsive } from './resolveResponsive';
import { LocaleProvider } from './LocaleContext';
import { widgetRegistry } from '@/widgets/registry';
import type { ScreenRendererConfig, WidgetEntry, SlotEntry, SizeVariant } from './types';
import type { SupportedLocale } from '@/i18n';

function isSlotEntry(entry: WidgetEntry | SlotEntry): entry is SlotEntry {
  return 'type' in entry && entry.type === 'slot';
}

interface ScreenRendererProps {
  config: ScreenRendererConfig;
  slots?: Record<string, React.ReactNode>;
  containerStyle?: React.CSSProperties;
}

export function ScreenRenderer({ config, slots, containerStyle }: ScreenRendererProps) {
  const breakpoint = useBreakpoint();

  const columns = resolveResponsive(config.grid.columns, breakpoint);
  const columnTemplate = config.grid.columnTemplate
    ? resolveResponsive(config.grid.columnTemplate, breakpoint)
    : `repeat(${columns}, 1fr)`;
  const rowHeight = resolveResponsive(config.grid.rowHeight, breakpoint);
  const gap = resolveResponsive(config.grid.gap, breakpoint);
  const rows = config.grid.rows;

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: columnTemplate,
    gap,
    ...containerStyle,
  };

  if (rows !== 'auto') {
    gridStyle.gridTemplateRows = `repeat(${rows}, ${rowHeight === 'auto' ? 'auto' : `${rowHeight}px`})`;
  } else if (rowHeight !== 'auto') {
    gridStyle.gridAutoRows = `${rowHeight}px`;
  }

  return (
    <LocaleProvider locale={(config.locale ?? 'en-AU') as SupportedLocale}>
      <div style={gridStyle}>
        {config.entries.map((entry, i) => {
          const gridPos = resolveResponsive(entry.grid, breakpoint);
          if (!gridPos) return null;

          const cellStyle: React.CSSProperties = {
            gridColumn: `${gridPos.col} / span ${gridPos.colSpan}`,
            gridRow: `${gridPos.row} / span ${gridPos.rowSpan}`,
            minHeight: 0,
            display: 'grid',
          };

          if (isSlotEntry(entry)) {
            cellStyle.overflow = 'auto';
            return (
              <div key={entry.name} style={cellStyle}>
                {slots?.[entry.name]}
              </div>
            );
          }

          cellStyle.overflow = 'hidden';
          const widgetEntry = entry;
          const Widget = widgetRegistry[widgetEntry.widgetName];
          if (!Widget) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(`Widget not found in registry: ${widgetEntry.widgetName}`);
            }
            return null;
          }

          const size = resolveResponsive(widgetEntry.size, breakpoint);

          return (
            <div key={`${widgetEntry.widgetName}-${i}`} style={cellStyle}>
              <Widget size={size} {...(widgetEntry.props ?? {})} />
            </div>
          );
        })}
      </div>
    </LocaleProvider>
  );
}
