---
name: creative-toolkit-charts-reference
type: reference
companion_to: creative-toolkit
description: ECharts brand theme, chart colour sequences, and usage patterns. Contains the copy-paste chart configuration. For chart design rules, see creative-toolkit. Falls back to Nivo for SVG-specific needs.
---

# Chart Theme Reference

> **Companion to [creative-toolkit](creative-toolkit.md).** Contains the ECharts theme,
> colour sequences, and usage patterns. For rules, see the main skill.
> Nivo patterns are kept at the bottom as a fallback for SVG-specific use cases.

---

## Brand Colour Sequences

```ts
// Primary palette — use for most charts (accent first)
export const CHART_COLORS = ['#FF5A28', '#1462D2', '#3EA6FF', '#FFB800', '#34C759', '#6366F1'];

// Single-series emphasis — accent with muted fill
export const CHART_SINGLE = { fill: '#FF5A28', muted: 'rgba(255,90,40,0.12)' };

// Diverging palette — positive/negative comparisons
export const CHART_DIVERGING = { positive: '#34C759', negative: '#EF4444', neutral: '#6B7280' };
```

**Rules:**
- Max 6 series per chart. More colours becomes noise.
- Accent (`#FF5A28`) always first — the primary data series or highlighted series.
- To emphasise one series: render others in `rgba(18,25,72,0.12)` (light) or `rgba(255,255,255,0.08)` (dark).

---

## ECharts Brand Theme

Register the brand theme once at app startup. All charts inherit it automatically.

```ts
import * as echarts from 'echarts/core';

export const BRAND_THEME_NAME = 'brand';

export function registerBrandTheme(isDark: boolean) {
  echarts.registerTheme(BRAND_THEME_NAME, {
    color: ['#FF5A28', '#1462D2', '#3EA6FF', '#FFB800', '#34C759', '#6366F1'],
    backgroundColor: 'transparent',
    textStyle: {
      fontFamily: "'Jost', sans-serif",
      color: isDark ? '#E8E9F0' : '#1A1B2E',
    },
    title: {
      textStyle: {
        fontFamily: "'Jost', sans-serif",
        fontSize: 16,
        fontWeight: 600,
        color: isDark ? '#E8E9F0' : '#1A1B2E',
      },
      subtextStyle: {
        fontFamily: "'Jost', sans-serif",
        fontSize: 13,
        color: isDark ? 'rgba(255,255,255,0.55)' : '#4B5563',
      },
    },
    tooltip: {
      backgroundColor: isDark ? '#1A1B2E' : '#FFFFFF',
      borderColor: isDark ? '#3F3F3F' : '#DADBE6',
      borderWidth: 1,
      borderRadius: 8,
      padding: [8, 12],
      textStyle: {
        fontFamily: "'Jost', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        color: isDark ? '#E8E9F0' : '#1A1B2E',
      },
      extraCssText: isDark
        ? 'box-shadow: 0 8px 32px rgba(0,0,0,0.4);'
        : 'box-shadow: 0 8px 32px rgba(0,0,0,0.08);',
    },
    legend: {
      textStyle: {
        fontFamily: "'Jost', sans-serif",
        fontSize: 12,
        fontWeight: 500,
        color: isDark ? 'rgba(255,255,255,0.55)' : '#4B5563',
      },
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(18,25,72,0.08)' } },
      axisTick: { show: false },
      axisLabel: {
        fontFamily: "'Jost', sans-serif",
        fontSize: 11,
        fontWeight: 500,
        color: isDark ? 'rgba(255,255,255,0.55)' : '#4B5563',
      },
      splitLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(18,25,72,0.04)' } },
    },
    valueAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontFamily: "'Jost', sans-serif",
        fontSize: 11,
        fontWeight: 500,
        color: isDark ? 'rgba(255,255,255,0.55)' : '#4B5563',
      },
      splitLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(18,25,72,0.04)' } },
    },
    bar: {
      itemStyle: { borderRadius: [4, 4, 0, 0] },
      barMaxWidth: 40,
    },
    line: {
      smooth: false,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2 },
    },
    pie: {
      itemStyle: { borderRadius: 4, borderColor: 'transparent', borderWidth: 2 },
    },
  });
}
```

---

## Usage Pattern — React

Use `echarts-for-react` for declarative React integration:

```tsx
import ReactECharts from 'echarts-for-react';
import { CHART_COLORS, BRAND_THEME_NAME } from '@/lib/chart-theme';

function RevenueChart({ data, isDark }: { data: { quarter: string; revenue: number }[] }) {
  const option = {
    grid: { top: 24, right: 24, bottom: 48, left: 64 },
    xAxis: {
      type: 'category',
      data: data.map(d => d.quarter),
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: (v: number) => `$${v}k` },
    },
    series: [{
      type: 'bar',
      data: data.map(d => d.revenue),
      itemStyle: { color: CHART_COLORS[0] },
    }],
    animationDuration: 600,
    animationEasing: 'cubicOut',
  };

  return (
    <ReactECharts
      option={option}
      theme={BRAND_THEME_NAME}
      style={{ height: 360 }}
      notMerge
    />
  );
}
```

---

## Tree-Shaking (Recommended)

ECharts supports modular imports to reduce bundle size:

```ts
// chart-setup.ts — import once at app level
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  TitleComponent, TooltipComponent, GridComponent,
  LegendComponent, DatasetComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  BarChart, LineChart, PieChart,
  TitleComponent, TooltipComponent, GridComponent,
  LegendComponent, DatasetComponent,
  CanvasRenderer,
]);

export { echarts };
```

Then pass `echarts` to `ReactECharts`:

```tsx
import ReactECharts from 'echarts-for-react';
import { echarts } from '@/lib/chart-setup';

<ReactECharts echarts={echarts} option={option} theme={BRAND_THEME_NAME} />
```

---

## Common Chart Types

| Type | ECharts series type | Notes |
|---|---|---|
| Bar | `bar` | Vertical by default. Set `yAxis: { type: 'category' }` for horizontal. |
| Line | `line` | Add `areaStyle: {}` for area charts. |
| Pie / Donut | `pie` | Set `radius: ['40%', '70%']` for donut. Max 5 segments. |
| Scatter | `scatter` | Great for correlations. |
| Heatmap | `heatmap` | Needs `visualMap` component. |
| Treemap | `treemap` | Hierarchical data. |
| Radar | `radar` | Needs `radar` coordinate system. |
| Funnel | `funnel` | Conversion flows. |
| Gauge | `gauge` | KPI displays. |
| Sankey | `sankey` | Flow diagrams. |
| Candlestick | `candlestick` | Financial data. |

---

## Default Animation Settings

```ts
const ANIMATION_DEFAULTS = {
  animationDuration: 600,
  animationEasing: 'cubicOut',
  animationDelay: (idx: number) => idx * 50, // stagger per series item
};
```

---

## Nivo Fallback (SVG-Specific)

Use Nivo only when you need SVG output (print export, inline SVG manipulation) or a chart type ECharts doesn't have.

```bash
npm install @nivo/core @nivo/bar  # Install only what you need
```

```tsx
import { ResponsiveBar } from '@nivo/bar';

// Nivo theme — same brand tokens, different API
export function getNivoTheme(isDark: boolean) {
  return {
    background: 'transparent',
    text: { fontSize: 12, fontFamily: "'Jost', sans-serif", fill: isDark ? '#E8E9F0' : '#1A1B2E' },
    axis: {
      ticks: { text: { fontSize: 11, fontWeight: 500, fill: isDark ? 'rgba(255,255,255,0.55)' : '#4B5563' } },
      legend: { text: { fontSize: 12, fontWeight: 600 } },
    },
    grid: { line: { stroke: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(18,25,72,0.04)' } },
    tooltip: { container: { fontSize: 13, borderRadius: '8px', padding: '8px 12px' } },
  };
}
```

When deciding: **ECharts first. Nivo only if you have a specific reason for SVG.**
