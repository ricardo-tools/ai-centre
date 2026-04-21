import type { GridConfig, WidgetEntry, SlotEntry, Theme } from '../domain/types';

export interface ScreenRendererConfigData {
  screenId: string;
  grid: GridConfig;
  widgets: WidgetEntry[];
  slots: SlotEntry[];
  theme?: Theme;
  locale: string;
}

export abstract class ScreenRendererConfig {
  abstract readonly screenId: string;
  abstract readonly grid: GridConfig;
  abstract readonly widgets: WidgetEntry[];
  readonly slots: SlotEntry[] = [];
  readonly theme?: Theme;
  readonly locale: string = 'en-AU';

  serialize(): ScreenRendererConfigData {
    return {
      screenId: this.screenId,
      grid: this.grid,
      widgets: this.widgets.map((w) => ({
        ...w,
        props: w.props ? JSON.parse(JSON.stringify(w.props)) : undefined,
      })),
      slots: this.slots,
      theme: this.theme,
      locale: this.locale,
    };
  }
}
