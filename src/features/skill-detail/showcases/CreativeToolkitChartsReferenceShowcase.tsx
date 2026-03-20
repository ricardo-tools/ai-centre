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
  { property: 'fontSize', value: '12' },
  { property: 'fontFamily', value: "'Jost', sans-serif" },
  { property: 'fill (light)', value: '#1A1B2E' },
  { property: 'fill (dark)', value: '#E8E9F0' },
];

const THEME_AXIS_TICKS = [
  { property: 'fontSize', value: '11' },
  { property: 'fontFamily', value: "'Jost', sans-serif" },
  { property: 'fontWeight', value: '500' },
  { property: 'fill (light)', value: '#4B5563' },
  { property: 'fill (dark)', value: 'rgba(255,255,255,0.55)' },
];

const THEME_AXIS_LEGEND = [
  { property: 'fontSize', value: '12' },
  { property: 'fontWeight', value: '600' },
  { property: 'fill (light)', value: '#1A1B2E' },
  { property: 'fill (dark)', value: 'rgba(255,255,255,0.7)' },
];

const THEME_GRID = [
  { property: 'stroke (light)', value: 'rgba(18,25,72,0.04)' },
  { property: 'stroke (dark)', value: 'rgba(255,255,255,0.04)' },
  { property: 'strokeWidth', value: '1' },
];

const THEME_TOOLTIP = [
  { property: 'fontFamily', value: "'Jost', sans-serif" },
  { property: 'fontSize', value: '13' },
  { property: 'fontWeight', value: '500' },
  { property: 'background (light)', value: '#FFFFFF' },
  { property: 'background (dark)', value: '#1A1B2E' },
  { property: 'borderRadius', value: '8px' },
  { property: 'padding', value: '8px 12px' },
  { property: 'shadow (light)', value: '0 8px 32px rgba(0,0,0,0.08)' },
  { property: 'shadow (dark)', value: '0 8px 32px rgba(0,0,0,0.4)' },
];

const THEME_CROSSHAIR = [
  { property: 'stroke (light)', value: 'rgba(18,25,72,0.3)' },
  { property: 'stroke (dark)', value: 'rgba(255,255,255,0.3)' },
  { property: 'strokeDasharray', value: '4 4' },
];

const THEME_LABELS = [
  { property: 'fontSize', value: '12' },
  { property: 'fontWeight', value: '600' },
  { property: 'fill (light)', value: '#1A1B2E' },
  { property: 'fill (dark)', value: '#FFFFFF' },
];

const NIVO_PACKAGES = [
  '@nivo/bar', '@nivo/line', '@nivo/pie', '@nivo/radar',
  '@nivo/heatmap', '@nivo/treemap', '@nivo/waffle', '@nivo/funnel',
  '@nivo/bump', '@nivo/sankey', '@nivo/choropleth', '@nivo/calendar',
  '@nivo/stream', '@nivo/swarmplot',
];

const USAGE_DEFAULTS = [
  { prop: 'margin', value: '{ top: 24, right: 24, bottom: 48, left: 64 }' },
  { prop: 'padding (bar)', value: '0.3' },
  { prop: 'borderRadius', value: '4' },
  { prop: 'enableGridX', value: 'false' },
  { prop: 'enableLabel', value: 'false' },
  { prop: 'animate', value: 'true' },
  { prop: 'motionConfig', value: "'gentle'" },
  { prop: 'axisBottom.tickSize', value: '0' },
  { prop: 'axisBottom.tickPadding', value: '12' },
  { prop: 'axisLeft.tickSize', value: '0' },
  { prop: 'axisLeft.tickPadding', value: '12' },
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
          This is a reference companion to <strong style={{ color: 'var(--color-text-heading)' }}>creative-toolkit</strong>. It contains lookup data — the Nivo theme object, colour sequences, and configuration templates. For chart design rules and guidelines, see the main skill.
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
          <div style={{ padding: 16, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)', flex: '1 1 200px' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>Emphasis Strategy</h4>
            <p style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.5, margin: 0, marginBottom: 6 }}>
              To highlight one series, render others in the de-emphasis color:
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 24, height: 24, borderRadius: 4, background: 'rgba(18,25,72,0.12)', border: '1px solid var(--color-border)' }} />
              <code style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Light: rgba(18,25,72,0.12)</code>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: 4, background: 'rgba(255,255,255,0.08)', border: '1px solid var(--color-border)' }} />
              <code style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Dark: rgba(255,255,255,0.08)</code>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 2: Nivo Theme — Text & Axis */}
      <Section title="Nivo Theme — Text & Axis Configuration">
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16, marginTop: 0 }}>
          Known limitation: Nivo accepts hex strings, not CSS variables. These values duplicate semantic tokens. When brand colours change, update both globals.css and the theme file.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 16 }}>
          <ThemePropertyTable title="text" rows={THEME_TEXT} />
          <ThemePropertyTable title="axis.ticks.text" rows={THEME_AXIS_TICKS} />
          <ThemePropertyTable title="axis.legend.text" rows={THEME_AXIS_LEGEND} />
        </div>
      </Section>

      {/* Section 3: Nivo Theme — Grid, Crosshair, Labels */}
      <Section title="Nivo Theme — Grid, Crosshair & Labels">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 16 }}>
          <ThemePropertyTable title="grid.line" rows={THEME_GRID} />
          <ThemePropertyTable title="crosshair.line" rows={THEME_CROSSHAIR} />
          <ThemePropertyTable title="labels.text" rows={THEME_LABELS} />
        </div>
      </Section>

      {/* Section 4: Nivo Theme — Tooltip */}
      <Section title="Nivo Theme — Tooltip Container">
        <ThemePropertyTable title="tooltip.container" rows={THEME_TOOLTIP} />
      </Section>

      {/* Section 5: Nivo Theme — Legends */}
      <Section title="Nivo Theme — Legends">
        <ThemePropertyTable title="legends.text" rows={[
          { property: 'fontSize', value: '12' },
          { property: 'fontFamily', value: "'Jost', sans-serif" },
          { property: 'fontWeight', value: '500' },
          { property: 'fill (light)', value: '#4B5563' },
          { property: 'fill (dark)', value: 'rgba(255,255,255,0.55)' },
        ]} />
      </Section>

      {/* Section 6: Full Theme Object Preview */}
      <Section title="getNivoTheme() — Full Object Structure">
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
{`getNivoTheme(isDark: boolean): Theme {
  return {
    background: 'transparent',
    text: { fontSize: 12, fontFamily: "'Jost'",
            fill: isDark ? '#E8E9F0' : '#1A1B2E' },
    axis: {
      domain: { line: { stroke: isDark
        ? 'rgba(255,255,255,0.08)'
        : 'rgba(18,25,72,0.08)' } },
      ticks: { line: { stroke: '...' },
               text: { fontSize: 11, fontWeight: 500,
                       fill: isDark ? 'rgba(…,0.55)' : '#4B5563' } },
      legend: { text: { fontSize: 12, fontWeight: 600 } },
    },
    grid: { line: { stroke: isDark
      ? 'rgba(255,255,255,0.04)'
      : 'rgba(18,25,72,0.04)', strokeWidth: 1 } },
    crosshair: { line: { strokeDasharray: '4 4' } },
    tooltip: { container: {
      fontSize: 13, fontWeight: 500,
      borderRadius: '8px', padding: '8px 12px',
      background: isDark ? '#1A1B2E' : '#FFFFFF',
    } },
    labels: { text: { fontSize: 12, fontWeight: 600 } },
    legends: { text: { fontSize: 12, fontWeight: 500 } },
  };
}`}
        </pre>
      </Section>

      {/* Section 7: Default Chart Props */}
      <Section title="Recommended Default Chart Props">
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Prop</th>
                <th style={headerCellStyle}>Default Value</th>
              </tr>
            </thead>
            <tbody>
              {USAGE_DEFAULTS.map((d) => (
                <tr key={d.prop}>
                  <td style={{ ...cellStyle, fontWeight: 600 }}>{d.prop}</td>
                  <td style={cellStyle}><code style={{ fontSize: 12, color: 'var(--color-secondary)' }}>{d.value}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 12 }}>
          Always wrap charts in a container with explicit height (e.g. 360px) and use the Responsive* wrapper variant.
        </p>
      </Section>

      {/* Section 8: Usage Pattern */}
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
{`import { ResponsiveBar } from '@nivo/bar';
import { getNivoTheme, CHART_COLORS }
  from '@/lib/chart-theme';

function RevenueChart({ data, isDark }) {
  return (
    <div style={{ height: 360 }}>
      <ResponsiveBar
        data={data}
        keys={['revenue']}
        indexBy="quarter"
        theme={getNivoTheme(isDark)}
        colors={CHART_COLORS}
        margin={{ top: 24, right: 24,
                  bottom: 48, left: 64 }}
        padding={0.3}
        borderRadius={4}
        enableGridX={false}
        enableLabel={false}
        animate={true}
        motionConfig="gentle"
        axisBottom={{ tickSize: 0,
                      tickPadding: 12 }}
        axisLeft={{ tickSize: 0,
                    tickPadding: 12,
                    format: v => \`$\${v}k\` }}
      />
    </div>
  );
}`}
        </pre>
      </Section>

      {/* Section 9: Available Nivo Packages */}
      <Section title="Available Nivo Chart Packages">
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16, marginTop: 0 }}>
          Install only what you need. All use the same getNivoTheme() and CHART_COLORS.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {NIVO_PACKAGES.map((pkg) => (
            <code
              key={pkg}
              style={{
                fontSize: 12,
                fontWeight: 500,
                padding: '6px 12px',
                borderRadius: 6,
                background: 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-body)',
              }}
            >
              {pkg}
            </code>
          ))}
        </div>
      </Section>

      {/* Section 10: Colour Sequence Visual Band */}
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
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Accent Position</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary)' }}>#1</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Always first in sequence</div>
          </div>
          <div style={{ padding: 12, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)', flex: '1 1 160px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Background</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-heading)' }}>transparent</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Theme background setting</div>
          </div>
        </div>
      </Section>
    </div>
  );
}
