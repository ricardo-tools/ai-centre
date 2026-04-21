export type Theme = 'light' | 'dark' | 'night';

export type AppShell = 'ezycollect-legacy' | 'new-workflows' | 'simplypaid';

export type WidgetSize = 'xs' | 'sm' | 'md' | 'lg';

export type Responsive<T> = T | {
  default: T;
  sm?: T;
  md?: T;
  lg?: T;
};

export interface GridConfig {
  columns: Responsive<number>;
  columnTemplate?: Responsive<string>;
  rows: Responsive<number | 'auto'>;
  rowHeight: Responsive<number | 'auto'>;
  gap: Responsive<number>;
}

export interface WidgetEntry {
  key: string;
  widgetId: string;
  size: Responsive<WidgetSize>;
  grid: {
    col: Responsive<number>;
    colSpan: Responsive<number>;
    row: Responsive<number>;
    rowSpan: Responsive<number>;
  };
  props?: Record<string, unknown>;
}

export interface SlotEntry {
  key: string;
  slotId: string;
  grid: {
    col: Responsive<number>;
    colSpan: Responsive<number>;
    row: Responsive<number>;
    rowSpan: Responsive<number>;
  };
}

export interface RenderableWidget {
  widgetId: string;
  component: Record<WidgetSize, React.ComponentType<unknown>>;
}
