export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg';

/** Mobile-first responsive value. Plain T = same at all breakpoints. */
export type Responsive<T> = T | { default: T; sm?: T; md?: T; lg?: T };

export interface GridPosition {
  col: number;
  colSpan: number;
  row: number;
  rowSpan: number;
}

export interface GridConfig {
  columns: Responsive<number>;
  columnTemplate?: Responsive<string>;
  rows: number | 'auto';
  rowHeight: Responsive<number | 'auto'>;
  gap: Responsive<number>;
}

export interface WidgetEntry {
  widgetName: string;
  size: Responsive<SizeVariant>;
  grid: Responsive<GridPosition | null>;
  props?: Record<string, unknown>;
}

export interface SlotEntry {
  type: 'slot';
  name: string;
  grid: Responsive<GridPosition | null>;
}

export type ScreenEntry = WidgetEntry | SlotEntry;

export interface RenderableWidget {
  size: SizeVariant;
}

export interface ScreenRendererConfig {
  readonly grid: GridConfig;
  readonly entries: ScreenEntry[];
  readonly locale?: string;
}
