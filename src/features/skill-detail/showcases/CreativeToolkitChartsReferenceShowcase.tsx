'use client';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
      {children}
    </section>
  );
}

const cellStyle: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: 13,
  color: 'var(--color-text-body)',
  borderBottom: '1px solid var(--color-border)',
  lineHeight: 1.5,
};

const headerCellStyle: React.CSSProperties = {
  ...cellStyle,
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: 'var(--color-text-muted)',
  background: 'var(--color-bg-alt)',
};

const CHART_COLORS = ['#FF5A28', '#1462D2', '#3EA6FF', '#FFB800', '#34C759', '#6366F1'];
const CHART_COLOR_LABELS = ['Accent (primary)', 'Electric Blue', 'Sky Blue', 'Amber', 'Green', 'Indigo'];

const DIVERGING = { positive: '#34C759', negative: '#EF4444', neutral: '#6B7280' };

const THEME_TEXT = [
  { property: 'fontFamily', value: "'Jost', sans-serif" },
  { property: 'color (light)', value: '#1A1B2E' },
  { property: 'color (dark)', value: '#E8E9F0' },
];

const THEME_TOOLTIP = [
  { property: 'fontFamily', value: "'Jost', sans-serif" },
  { property: 'fontSize', value: '13' },
  { property: 'fontWeight', value: '500' },
  { property: 'background (light)', value: '#FFFFFF' },
  { property: 'background (dark)', value: '#1A1B2E' },
  { property: 'borderRadius', value: '8' },
  { property: 'padding', value: '[8, 12]' },
  { property: 'shadow (light)', value: '0 8px 32px rgba(0,0,0,0.08)' },
  { property: 'shadow (dark)', value: '0 8px 32px rgba(0,0,0,0.4)' },
];

const THEME_AXIS = [
  { property: 'axisTick.show', value: 'false' },
  { property: 'axisLabel.fontSize', value: '11' },
  { property: 'axisLabel.fontWeight', value: '500' },
  { property: 'axisLabel.color (light)', value: '#4B5563' },
  { property: 'axisLabel.color (dark)', value: 'rgba(255,255,255,0.55)' },
  { property: 'splitLine.color (light)', value: 'rgba(18,25,72,0.04)' },
  { property: 'splitLine.color (dark)', value: 'rgba(255,255,255,0.04)' },
];

const THEME_SERIES = [
  { property: 'bar.borderRadius', value: '[4, 4, 0, 0]' },
  { property: 'bar.barMaxWidth', value: '40' },
  { property: 'line.smooth', value: 'false' },
  { property: 'line.symbol', value: "'circle'" },
  { property: 'line.symbolSize', value: '6' },
  { property: 'line.lineStyle.width', value: '2' },
  { property: 'pie.borderRadius', value: '4' },
];

const ANIMATION_DEFAULTS = [
  { prop: 'animationDuration', value: '600' },
  { prop: 'animationEasing', value: "'cubicOut'" },
  { prop: 'animationDelay', value: '(idx) => idx * 50' },
];

const GRID_DEFAULTS = [
  { prop: 'grid.top', value: '24' },
  { prop: 'grid.right', value: '24' },
  { prop: 'grid.bottom', value: '48' },
  { prop: 'grid.left', value: '64' },
];

const CHART_TYPES = [
  { type: 'bar', name: 'Bar', notes: 'Vertical default. Horizontal via yAxis category.' },
  { type: 'line', name: 'Line / Area', notes: 'Add areaStyle: {} for area charts.' },
  { type: 'pie', name: 'Pie / Donut', notes: "radius: ['40%', '70%'] for donut. Max 5 segments." },
  { type: 'scatter', name: 'Scatter', notes: 'Correlations and distributions.' },
  { type: 'heatmap', name: 'Heatmap', notes: 'Needs visualMap component.' },
  { type: 'treemap', name: 'Treemap', notes: 'Hierarchical data.' },
  { type: 'radar', name: 'Radar', notes: 'Needs radar coordinate system.' },
  { type: 'funnel', name: 'Funnel', notes: 'Conversion flows.' },
  { type: 'gauge', name: 'Gauge', notes: 'KPI displays.' },
  { type: 'sankey', name: 'Sankey', notes: 'Flow diagrams.' },
];

function ThemePropertyTable({ title, rows }: { title: string; rows: { property: string; value: string }[] }) {
  return (
    <div>
      <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>{title}</h4>
      <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={headerCellStyle}>Property</th>
              <th style={headerCellStyle}>Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.property}>
                <td style={{ ...cellStyle, fontWeight: 500 }}>{r.property}</td>
                <td style={cellStyle}><code style={{ fontSize: 12, color: 'var(--color-secondary)' }}>{r.value}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CreativeToolkitChartsReferenceShowcase() {
  return (
    <div style={{ maxWidth: 960 }}>
      {/* Reference companion callout */}
      <div
        style={{
          padding: '16px 20px',
          background: 'var(--color-primary-muted)',
          border: '1px solid var(--color-primary)',
          borderRadius: 8,
          marginBottom: 40,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: 7 }} />
        <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.6 }}>
          This is a reference companion to <strong style={{ color: 'var(--color-text-heading)' }}>creative-toolkit</strong>. It contains the ECharts brand theme, colour sequences, and configuration templates. <strong>ECharts is the primary charting library.</strong> Nivo is available as a fallback for SVG-specific needs.
        </p>
      </div>

      {/* Section 1: Brand Colour Sequence */}
      <Section title="Brand Colour Sequence">
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16, marginTop: 0 }}>
          Primary palette — use for most charts. Accent (#FF5A28) always first. Max 6 series per chart.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          {CHART_COLORS.map((hex, i) => (
            <div key={hex} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: hex, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{CHART_COLOR_LABELS[i]}</div>
                <code style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{hex}</code>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ padding: 16, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)', flex: '1 1 200px' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>Single-Series Emphasis</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 24, height: 24, borderRadius: 4, background: '#FF5A28' }} />
              <code style={{ fontSize: 12, color: 'var(--color-text-body)' }}>fill: #FF5A28</code>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: 4, background: 'rgba(255,90,40,0.12)', border: '1px solid var(--color-border)' }} />
              <code style={{ fontSize: 12, color: 'var(--color-text-body)' }}>muted: rgba(255,90,40,0.12)</code>
            </div>
          </div>
          <div style={{ padding: 16, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)', flex: '1 1 200px' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>Diverging Palette</h4>
            {Object.entries(DIVERGING).map(([key, hex]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div style={{ width: 24, height: 24, borderRadius: 4, background: hex }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-body)' }}>{key}</span>
                <code style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{hex}</code>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 2: ECharts Theme — Text & Tooltip */}
      <Section title="ECharts Theme — Text & Tooltip">
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16, marginTop: 0 }}>
          Register the brand theme once via <code style={{ color: 'var(--color-secondary)' }}>echarts.registerTheme()</code>. All charts inherit it when you pass <code style={{ color: 'var(--color-secondary)' }}>theme=&quot;brand&quot;</code>.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 16 }}>
          <ThemePropertyTable title="textStyle" rows={THEME_TEXT} />
          <ThemePropertyTable title="tooltip" rows={THEME_TOOLTIP} />
        </div>
      </Section>

      {/* Section 3: ECharts Theme — Axis */}
      <Section title="ECharts Theme — Axis Configuration">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 16 }}>
          <ThemePropertyTable title="categoryAxis / valueAxis" rows={THEME_AXIS} />
          <ThemePropertyTable title="Series Defaults" rows={THEME_SERIES} />
        </div>
      </Section>

      {/* Section 4: Animation & Grid */}
      <Section title="Animation & Grid Defaults">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 16 }}>
          <ThemePropertyTable title="Animation" rows={ANIMATION_DEFAULTS.map(d => ({ property: d.prop, value: d.value }))} />
          <ThemePropertyTable title="Grid (margins)" rows={GRID_DEFAULTS.map(d => ({ property: d.prop, value: d.value }))} />
        </div>
      </Section>

      {/* Section 5: Usage Pattern */}
      <Section title="Usage Pattern Template">
        <pre
          style={{
            fontFamily: 'monospace',
            fontSize: 12,
            lineHeight: 1.6,
            color: 'var(--color-text-body)',
            background: 'var(--color-bg-alt)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            padding: 20,
            overflowX: 'auto',
            margin: 0,
          }}
        >
{`import ReactECharts from 'echarts-for-react';
import { CHART_COLORS, BRAND_THEME_NAME }
  from '@/lib/chart-theme';

function RevenueChart({ data, isDark }) {
  const option = {
    grid: { top: 24, right: 24,
            bottom: 48, left: 64 },
    xAxis: {
      type: 'category',
      data: data.map(d => d.quarter),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: v => \`$\${v}k\`,
      },
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
}`}
        </pre>
      </Section>

      {/* Section 6: Available Chart Types */}
      <Section title="Available ECharts Chart Types">
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16, marginTop: 0 }}>
          ECharts supports 20+ chart types. Use tree-shaking to import only what you need.
        </p>
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Series Type</th>
                <th style={headerCellStyle}>Name</th>
                <th style={headerCellStyle}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {CHART_TYPES.map((ct) => (
                <tr key={ct.type}>
                  <td style={{ ...cellStyle, fontWeight: 600 }}><code style={{ color: 'var(--color-secondary)' }}>{ct.type}</code></td>
                  <td style={cellStyle}>{ct.name}</td>
                  <td style={{ ...cellStyle, color: 'var(--color-text-muted)' }}>{ct.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section 7: Colour Sequence Visual Band */}
      <Section title="Colour Sequence Visual Preview">
        <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', height: 48 }}>
            {CHART_COLORS.map((hex) => (
              <div key={hex} style={{ flex: 1, background: hex }} />
            ))}
          </div>
          <div style={{ display: 'flex' }}>
            {CHART_COLORS.map((hex, i) => (
              <div key={hex} style={{ flex: 1, padding: '8px 4px', textAlign: 'center', background: 'var(--color-surface)' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-muted)' }}>{i + 1}</div>
                <code style={{ fontSize: 10, color: 'var(--color-text-body)' }}>{hex}</code>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ padding: 12, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)', flex: '1 1 160px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Max Series</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-heading)' }}>6</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>More becomes noise</div>
          </div>
          <div style={{ padding: 12, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)', flex: '1 1 160px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Primary Library</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary)' }}>ECharts</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Nivo as SVG fallback</div>
          </div>
          <div style={{ padding: 12, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)', flex: '1 1 160px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Renderer</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-heading)' }}>Canvas</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>SVG renderer optional</div>
          </div>
        </div>
      </Section>

      {/* Section 8: Nivo Fallback Note */}
      <Section title="Nivo Fallback">
        <div
          style={{
            padding: '16px 20px',
            background: 'var(--color-bg-alt)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
          }}
        >
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.6 }}>
            Use Nivo only when you specifically need <strong style={{ color: 'var(--color-text-heading)' }}>SVG output</strong> (print export, inline SVG manipulation) or a chart type ECharts doesn&apos;t cover. Install only the packages you need: <code style={{ color: 'var(--color-secondary)' }}>@nivo/bar</code>, <code style={{ color: 'var(--color-secondary)' }}>@nivo/line</code>, etc. The same brand colours and design rules apply.
          </p>
        </div>
      </Section>
    </div>
  );
}
