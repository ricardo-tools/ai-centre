'use client';

import type { ScreenRendererConfigData } from './ScreenRendererConfig';
import { widgetRegistry } from '../widgets/registry';
import type { WidgetSize, Responsive } from '../domain/types';
import { useBreakpoint, type Breakpoint } from '../hooks/useBreakpoint';

interface ScreenRendererProps {
  config: ScreenRendererConfigData;
  slots?: Record<string, React.ReactNode>;
}

function resolveResponsive<T>(value: Responsive<T>, breakpoint: Breakpoint): T {
  if (typeof value !== 'object' || value === null || !('default' in value)) {
    return value as T;
  }

  const responsive = value as { default: T; sm?: T; md?: T; lg?: T };

  // Mobile-first cascade: apply from smallest matching upward
  let resolved: T = responsive.default;
  if (breakpoint === 'sm' || breakpoint === 'md' || breakpoint === 'lg') {
    if (responsive.sm !== undefined) resolved = responsive.sm;
  }
  if (breakpoint === 'md' || breakpoint === 'lg') {
    if (responsive.md !== undefined) resolved = responsive.md;
  }
  if (breakpoint === 'lg') {
    if (responsive.lg !== undefined) resolved = responsive.lg;
  }

  return resolved;
}

export default function ScreenRenderer({ config, slots }: ScreenRendererProps) {
  const breakpoint = useBreakpoint();

  const columns = resolveResponsive(config.grid.columns, breakpoint);
  const gap = resolveResponsive(config.grid.gap, breakpoint);
  const columnTemplate = config.grid.columnTemplate
    ? resolveResponsive(config.grid.columnTemplate, breakpoint)
    : `repeat(${columns}, 1fr)`;
  const rowHeight = resolveResponsive(config.grid.rowHeight, breakpoint);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: columnTemplate,
        gridAutoRows: rowHeight === 'auto' ? 'auto' : rowHeight,
        gap,
        width: '100%',
      }}
    >
      {config.widgets.map((entry) => {
        const widget = widgetRegistry[entry.widgetId];
        if (!widget) {
          return (
            <div
              key={entry.key}
              style={{ color: 'var(--color-danger)', padding: 'var(--space-2)', fontSize: 12 }}
            >
              Widget &quot;{entry.widgetId}&quot; not found in registry.
            </div>
          );
        }

        const size = resolveResponsive(entry.size, breakpoint) as WidgetSize;
        const Component = widget.component[size];
        const col = resolveResponsive(entry.grid.col, breakpoint);
        const colSpan = resolveResponsive(entry.grid.colSpan, breakpoint);
        const row = resolveResponsive(entry.grid.row, breakpoint);
        const rowSpan = resolveResponsive(entry.grid.rowSpan, breakpoint);

        /* When all widgets use col:1/row:1 (the default), let CSS Grid auto-flow
           handle placement instead of forcing everything into cell (1,1). */
        const useAutoPlacement = col === 1 && row === 1 && colSpan === 1 && rowSpan === 1;

        return (
          <div
            key={entry.key}
            style={{
              ...(useAutoPlacement
                ? {}
                : {
                    gridColumn: `${col} / span ${colSpan}`,
                    gridRow: `${row} / span ${rowSpan}`,
                  }),
              display: 'grid',
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <Component {...(entry.props || {})} />
          </div>
        );
      })}

      {config.slots.map((slot) => {
        const content = slots?.[slot.slotId];
        const col = resolveResponsive(slot.grid.col, breakpoint);
        const colSpan = resolveResponsive(slot.grid.colSpan, breakpoint);
        const row = resolveResponsive(slot.grid.row, breakpoint);
        const rowSpan = resolveResponsive(slot.grid.rowSpan, breakpoint);

        return (
          <div
            key={slot.key}
            style={{
              gridColumn: `${col} / span ${colSpan}`,
              gridRow: `${row} / span ${rowSpan}`,
              overflow: 'auto',
              width: '100%',
            }}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
