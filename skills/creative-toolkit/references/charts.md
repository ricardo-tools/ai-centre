---
name: creative-toolkit-charts-reference
type: reference
companion_to: creative-toolkit
description: >
  Nivo brand theme object, chart colour sequences, and usage patterns. This is
  a reference file containing the copy-paste chart configuration. For chart
  design rules, see the creative-toolkit skill.
---

# Chart Theme Reference

> **Companion to [creative-toolkit](creative-toolkit.md).** Contains the Nivo theme
> object, colour sequences, and usage patterns. For rules, see the main skill.

---

## Brand Theme Object

Map brand semantic tokens to Nivo's theme API. Single source of truth for chart styling.

**Known limitation:** Nivo accepts hex strings, not CSS variables. These hex values duplicate semantic tokens. When brand colours change, update both `globals.css` and this file. Grep for old hex values.

```tsx
import type { Theme } from '@nivo/core';

export function getNivoTheme(isDark: boolean): Theme {
  return {
    background: 'transparent',
    text: {
      fontSize: 12,
      fontFamily: "'Jost', sans-serif",
      fill: isDark ? '#E8E9F0' : '#1A1B2E', // --color-text-heading
    },
    axis: {
      domain: { line: { stroke: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(18,25,72,0.08)' } },
      ticks: {
        line: { stroke: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(18,25,72,0.08)' },
        text: {
          fontSize: 11,
          fontFamily: "'Jost', sans-serif",
          fontWeight: 500,
          fill: isDark ? 'rgba(255,255,255,0.55)' : '#4B5563', // --color-text-muted
        },
      },
      legend: {
        text: {
          fontSize: 12,
          fontFamily: "'Jost', sans-serif",
          fontWeight: 600,
          fill: isDark ? 'rgba(255,255,255,0.7)' : '#1A1B2E', // --color-text-heading
        },
      },
    },
    grid: {
      line: {
        stroke: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(18,25,72,0.04)',
        strokeWidth: 1,
      },
    },
    crosshair: {
      line: { stroke: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(18,25,72,0.3)', strokeDasharray: '4 4' },
    },
    tooltip: {
      container: {
        fontFamily: "'Jost', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        background: isDark ? '#1A1B2E' : '#FFFFFF',
        color: isDark ? '#E8E9F0' : '#1A1B2E',
        borderRadius: '8px',
        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.08)',
        padding: '8px 12px',
      },
    },
    labels: {
      text: {
        fontSize: 12,
        fontFamily: "'Jost', sans-serif",
        fontWeight: 600,
        fill: isDark ? '#FFFFFF' : '#1A1B2E',
      },
    },
    legends: {
      text: {
        fontSize: 12,
        fontFamily: "'Jost', sans-serif",
        fontWeight: 500,
        fill: isDark ? 'rgba(255,255,255,0.55)' : '#4B5563',
      },
    },
  };
}
```

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

## Usage Pattern

Always use the `Responsive*` wrapper for fluid sizing:

```tsx
import { ResponsiveBar } from '@nivo/bar';
import { getNivoTheme, CHART_COLORS } from '@/lib/chart-theme';

function RevenueChart({ data, isDark }: { data: BarDatum[]; isDark: boolean }) {
  return (
    <div style={{ height: 360 }}>
      <ResponsiveBar
        data={data}
        keys={['revenue']}
        indexBy="quarter"
        theme={getNivoTheme(isDark)}
        colors={CHART_COLORS}
        margin={{ top: 24, right: 24, bottom: 48, left: 64 }}
        padding={0.3}
        borderRadius={4}
        enableGridX={false}
        enableLabel={false}
        animate={true}
        motionConfig="gentle"
        axisBottom={{ tickSize: 0, tickPadding: 12 }}
        axisLeft={{ tickSize: 0, tickPadding: 12, format: (v) => `$${v}k` }}
      />
    </div>
  );
}
```

---

## Available Chart Packages

Install only what you need:

`@nivo/bar`, `@nivo/line`, `@nivo/pie`, `@nivo/radar`, `@nivo/heatmap`, `@nivo/treemap`, `@nivo/waffle`, `@nivo/funnel`, `@nivo/bump`, `@nivo/sankey`, `@nivo/choropleth`, `@nivo/calendar`, `@nivo/stream`, `@nivo/swarmplot`
