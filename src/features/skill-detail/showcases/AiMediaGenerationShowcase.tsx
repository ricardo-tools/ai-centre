'use client';

/* ---- helpers ---- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

const Code = ({ children }: { children: React.ReactNode }) => (
  <pre
    style={{
      fontSize: 12,
      fontFamily: 'monospace',
      lineHeight: 1.8,
      padding: 16,
      borderRadius: 6,
      background: 'var(--color-bg-alt)',
      border: '1px solid var(--color-border)',
      overflow: 'auto',
    }}
  >
    {children}
  </pre>
);

const cellStyle: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: 13,
  color: 'var(--color-text-body)',
  borderBottom: '1px solid var(--color-border)',
};

const headerCellStyle: React.CSSProperties = {
  ...cellStyle,
  fontWeight: 700,
  color: 'var(--color-text-heading)',
  background: 'var(--color-bg-alt)',
  fontSize: 12,
  textTransform: 'uppercase' as const,
  letterSpacing: 0.5,
};

export function AiMediaGenerationShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Pair with <strong>creative-toolkit</strong> (asset libraries and animation),{' '}
          <strong>brand-design-system</strong> (ensure generated media aligns with brand colors and style), and{' '}
          <strong>observability</strong> (track generation costs and quality in production).
        </p>
      </div>

      {/* ---- Model Selection Decision Tree ---- */}
      <Section title="Model Selection Decision Tree">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 20 }}>
          Models change frequently. Never hardcode model names — use MCP <code style={{ fontSize: 12, padding: '2px 6px', borderRadius: 4, background: 'var(--color-bg-alt)' }}>search</code> and{' '}
          <code style={{ fontSize: 12, padding: '2px 6px', borderRadius: 4, background: 'var(--color-bg-alt)' }}>find</code> to discover current models for each task.
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            overflow: 'hidden',
            marginBottom: 20,
          }}
        >
          {[
            { question: 'What type of media?', options: 'Image / Video / Audio / Edit', bg: 'var(--color-primary-muted)' },
            { question: 'What phase are you in?', options: 'Iteration (fast, cheap) vs Final output (high quality)', bg: 'var(--color-bg-alt)' },
            { question: 'Do you need control?', options: 'Text-only vs Image-to-video / Style transfer', bg: 'var(--color-bg-alt)' },
            { question: 'What is the budget?', options: 'Use estimate_cost() before expensive generations', bg: 'var(--color-warning-muted)' },
          ].map((item, i) => (
            <div
              key={item.question}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 20px',
                background: item.bg,
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: 'var(--color-text-on-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>{item.question}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.options}</div>
              </div>
            </div>
          ))}
        </div>
        <Code>{`// Discover models — never hardcode
search(query: "fast text to image")           // iteration
search(query: "high quality text to image")   // final output
search(query: "text to video")                // video
search(query: "image to video")               // animate a still

// Always check params before generating
find(model_name: "<model from search>")

// Check cost before expensive operations
estimate_cost(model_name: "...", input: { ... })`}</Code>
      </Section>

      {/* ---- Iterative Improvement Loop ---- */}
      <Section title="Iterate Cheap, Deliver Expensive">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 20 }}>
          Start with the fastest, cheapest model to get the prompt right. Switch to high-fidelity only for the final output.
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            overflow: 'hidden',
            marginBottom: 20,
          }}
        >
          {[
            { step: '1', label: 'Write initial prompt', detail: 'Subject + Style + Composition + Lighting/Mood', bg: 'var(--color-bg-alt)', phase: 'CRAFT' },
            { step: '2', label: 'Generate with fastest model', detail: 'Cheap iteration — test composition and content', bg: 'var(--color-success-muted)', phase: 'ITERATE' },
            { step: '3', label: 'Evaluate output', detail: 'Check hands, faces, text, coherence, composition', bg: 'var(--color-bg-alt)', phase: 'EVALUATE' },
            { step: '4', label: 'Refine prompt', detail: 'Adjust one variable at a time. Keep seed stable.', bg: 'var(--color-warning-muted)', phase: 'REFINE' },
            { step: '5', label: 'Repeat 2-4', detail: 'Until composition and content are right', bg: 'var(--color-bg-alt)', phase: 'LOOP' },
            { step: '6', label: 'Final generation', detail: 'Highest quality model for production output', bg: 'var(--color-primary-muted)', phase: 'DELIVER' },
          ].map((item) => (
            <div
              key={item.step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 20px',
                background: item.bg,
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: 'var(--color-text-on-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {item.step}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{item.detail}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10, background: 'var(--color-primary-muted)', color: 'var(--color-primary)' }}>
                {item.phase}
              </span>
            </div>
          ))}
        </div>
        <div style={{ padding: 12, borderRadius: 8, background: 'var(--color-warning-muted)', border: '1px solid var(--color-warning)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.6 }}>
            <strong>Key rule:</strong> Use seeds for reproducibility. Change the seed only when you want a different
            composition. Keep the seed stable when refining the prompt — this isolates the effect of prompt changes
            from random variation.
          </p>
        </div>
      </Section>

      {/* ---- Prompt Engineering Patterns ---- */}
      <Section title="Prompt Engineering for Images">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          A good image prompt has four parts. The prompt is the most important input — the same model with good vs bad
          prompt produces dramatically different results.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {[
            { part: 'Subject', desc: 'Be specific. "A golden retriever puppy" not "a dog".', example: 'A ceramic coffee mug on a wooden desk', color: 'var(--color-primary)' },
            { part: 'Style / Medium', desc: 'Name the visual style explicitly.', example: 'product photography style', color: 'var(--color-success)' },
            { part: 'Composition', desc: 'Framing, camera angle, spatial arrangement.', example: 'close-up with shallow depth of field', color: 'var(--color-warning)' },
            { part: 'Lighting / Mood', desc: 'Light source, quality, emotional tone.', example: 'warm morning light from the left', color: 'var(--color-error)' },
          ].map((item) => (
            <div
              key={item.part}
              style={{
                padding: 16,
                borderRadius: 8,
                borderLeft: `4px solid ${item.color}`,
                border: '1px solid var(--color-border)',
                borderLeftWidth: 4,
                borderLeftColor: item.color,
                background: 'var(--color-surface)',
              }}
            >
              <h4 style={{ fontSize: 13, fontWeight: 700, color: item.color, marginBottom: 6 }}>{item.part}</h4>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.5, margin: 0, marginBottom: 8 }}>{item.desc}</p>
              <div style={{ fontSize: 11, fontStyle: 'italic', color: 'var(--color-text-muted)', padding: '6px 10px', borderRadius: 4, background: 'var(--color-bg-alt)' }}>
                {item.example}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '2px solid var(--color-success)', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Effective Prompt
            </div>
            <Code>{`"A ceramic coffee mug on a wooden desk,
 product photography style,
 close-up shot with shallow depth
 of field,
 warm morning light from the left"`}</Code>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '2px solid var(--color-error)', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-error)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Common Mistakes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Vague: "a nice landscape"',
                'Contradictory: "photorealistic watercolour"',
                'Too many subjects: "dog, cat, bird, fish, horse"',
                'Ignoring aspect ratio for the use case',
              ].map((m) => (
                <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-error)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Video Prompt Patterns ---- */}
      <Section title="Video and Audio Prompt Patterns">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          Video needs everything images need, plus temporal information — motion, camera movement, and change over time.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 10 }}>Video Structure</h4>
            <Code>{`[Scene] + [Motion] + [Camera] + [Duration]

"A coffee mug on a desk with steam
 rising,
 camera slowly orbits around the mug,
 warm morning light shifts as camera
 moves,
 gentle and smooth movement"`}</Code>
            <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Describe motion explicitly', 'Specify camera movement', 'One action per generation', 'Image-to-video for control'].map((t) => (
                <span key={t} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 10, background: 'var(--color-primary-muted)', color: 'var(--color-primary)', fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 10 }}>Audio Patterns</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { type: 'Speech', tip: 'Specify tone and pacing: "calm conversational" or "formal newsreader"' },
                { type: 'Sound FX', tip: 'Describe the sound, not the source: "deep rumbling bass with metallic clanging"' },
                { type: 'Music', tip: 'Genre + tempo + mood + instruments: "upbeat electronic, 120 BPM, synth leads"' },
              ].map((a) => (
                <div key={a.type}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 2 }}>{a.type}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{a.tip}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- MCP Workflow ---- */}
      <Section title="MCP Tool Workflow">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          The fal.ai MCP provides a consistent workflow: discover, inspect, estimate, generate, retrieve.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--color-border)', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
          {[
            { tool: 'search', purpose: 'Find models by capability', example: 'search(query: "fast text to image")' },
            { tool: 'find', purpose: 'Get parameter schema', example: 'find(model_name: "<chosen>")' },
            { tool: 'estimate_cost', purpose: 'Check cost before generating', example: 'estimate_cost(model_name: "...", input: {...})' },
            { tool: 'generate', purpose: 'Run the model', example: 'generate(model_name: "...", input: {...})' },
            { tool: 'result', purpose: 'Get async output', example: 'result(request_id: "...")' },
            { tool: 'upload', purpose: 'Upload input file', example: 'upload(file_path: "/path/to/image.png")' },
          ].map((item, i) => (
            <div
              key={item.tool}
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 1fr',
                gap: 12,
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-bg-alt)' : 'var(--color-surface)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <code style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)' }}>{item.tool}</code>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item.purpose}</span>
              <code style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{item.example}</code>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Cost Comparison ---- */}
      <Section title="AI Generation vs Alternatives">
        <div style={{ overflow: 'auto', borderRadius: 8, border: '1px solid var(--color-border)', marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Situation', 'Recommendation', 'Why'].map((h) => (
                  <th key={h} style={headerCellStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { situation: 'Unique image matching specific description', rec: 'AI generation', why: 'No stock alternative exists' },
                { situation: 'Generic stock photo', rec: 'Stock photography', why: 'Faster, more predictable' },
                { situation: 'Pixel-perfect brand assets (logo, icon)', rec: 'Manual design tools', why: 'AI hallucinates details' },
                { situation: 'Quick prototype placeholder', rec: 'AI (fast model)', why: 'Speed over quality' },
                { situation: 'Video of real product', rec: 'Real video', why: 'AI cannot reproduce specifics' },
                { situation: 'Ambient music / sound effects', rec: 'AI generation', why: 'Effective for background audio' },
              ].map((row) => (
                <tr key={row.situation}>
                  <td style={{ ...cellStyle, fontWeight: 600 }}>{row.situation}</td>
                  <td style={cellStyle}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 10,
                      background: row.rec.includes('AI') ? 'var(--color-primary-muted)' : 'var(--color-bg-alt)',
                      color: row.rec.includes('AI') ? 'var(--color-primary)' : 'var(--color-text-body)',
                    }}>
                      {row.rec}
                    </span>
                  </td>
                  <td style={cellStyle}>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---- Image-to-Video Workflow ---- */}
      <Section title="Image-to-Video Workflow">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          For maximum control, generate in two steps: create a still image with the exact composition, then animate it.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { step: '1. Generate still', desc: 'Use text-to-image to get the exact composition you want.', tag: 'IMAGE' },
            { step: '2. Upload', desc: 'Upload the generated image as input for the video model.', tag: 'TRANSFER' },
            { step: '3. Animate', desc: 'Use image-to-video model with motion prompts.', tag: 'VIDEO' },
          ].map((item) => (
            <div key={item.step} style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10, background: 'var(--color-primary-muted)', color: 'var(--color-primary)', marginBottom: 8, display: 'inline-block' }}>
                {item.tag}
              </span>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{item.step}</h4>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <Code>{`// Step 1: Generate still
generate(model_name: "<text-to-image>", input: {
  prompt: "A coffee mug on a desk, product photo, warm light",
  seed: 42
})

// Step 2: Upload
upload(file_path: "/path/to/generated-image.png")

// Step 3: Animate
generate(model_name: "<image-to-video>", input: {
  prompt: "camera slowly zooms out, gentle wind",
  image_url: "<uploaded URL>",
  duration: "5s"
})`}</Code>
      </Section>

      {/* ---- Quality Review Checklist ---- */}
      <Section title="Output Review Checklist">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { type: 'Images', checks: ['Hands and fingers', 'Text rendering', 'Faces and symmetry', 'Background coherence', 'Aspect ratio for use case'] },
            { type: 'Video', checks: ['Temporal consistency', 'Motion smoothness', 'Lip sync (if applicable)', 'Object permanence', 'No morphing between frames'] },
            { type: 'Audio', checks: ['Pronunciation accuracy', 'Pacing and rhythm', 'Background noise', 'Abrupt cuts', 'Volume consistency'] },
          ].map((group) => (
            <div key={group.type} style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 10 }}>{group.type}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {group.checks.map((c) => (
                  <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, border: '2px solid var(--color-primary)', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Quality Gate Checklist">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            'Model discovered via search/find, not hardcoded',
            'Prompt follows 4-part structure',
            'Iteration done on cheap model first',
            'Cost estimated before expensive generations',
            'Seed used for reproducibility during iteration',
            'Output reviewed for artifacts',
            'Aspect ratio matches intended use',
            'Output format and resolution appropriate',
          ].map((item) => (
            <div
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 6,
                background: 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid var(--color-primary)', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
