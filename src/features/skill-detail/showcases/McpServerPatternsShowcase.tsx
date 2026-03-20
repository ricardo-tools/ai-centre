'use client';

import { CodeBlock } from '@/platform/components/CodeBlock';

/* ---- helpers ---- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

export function McpServerPatternsShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Apply <strong>frontend-architecture</strong> (7-layer architecture) for project structure.
          Use <strong>brand-design-system</strong> for any UI that surfaces MCP data.
          See <strong>backend-patterns</strong> for use-case and repository patterns that tool handlers delegate to.
        </p>
      </div>

      {/* ---- MCP Architecture ---- */}
      <Section title="MCP Architecture — Client ↔ Server ↔ Tools">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          The Model Context Protocol creates a clean boundary between AI clients (Claude Desktop, Cursor, CLI agents) and your application capabilities.
          The server is a thin transport layer — business logic stays in your domain.
        </p>

        {/* Architecture diagram */}
        <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap' }}>
            {/* AI Client */}
            <div style={{ textAlign: 'center', minWidth: 140 }}>
              <div style={{ width: 120, padding: '16px 12px', borderRadius: 12, background: 'var(--color-primary)', margin: '0 auto 8px' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>AI Client</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                {['Claude Desktop', 'Cursor', 'CLI Agent'].map((c) => (
                  <span key={c} style={{ fontSize: 10, color: 'var(--color-text-muted)', background: 'var(--color-bg-alt)', padding: '2px 8px', borderRadius: 4 }}>{c}</span>
                ))}
              </div>
            </div>

            {/* Arrow: Client → Transport */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 12px' }}>
              <span style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>JSON-RPC</span>
              <div style={{ width: 60, height: 2, background: 'var(--color-border)', position: 'relative' }}>
                <div style={{ position: 'absolute', right: -4, top: -4, width: 0, height: 0, borderLeft: '8px solid var(--color-border)', borderTop: '5px solid transparent', borderBottom: '5px solid transparent' }} />
              </div>
            </div>

            {/* Transport */}
            <div style={{ textAlign: 'center', minWidth: 120 }}>
              <div style={{ width: 100, padding: '12px 8px', borderRadius: 8, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', margin: '0 auto 8px' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Transport</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)', background: 'var(--color-bg-alt)', padding: '2px 8px', borderRadius: 4 }}>stdio (local)</span>
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)', background: 'var(--color-bg-alt)', padding: '2px 8px', borderRadius: 4 }}>HTTP (remote)</span>
              </div>
            </div>

            {/* Arrow: Transport → Server */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 12px' }}>
              <span style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>&nbsp;</span>
              <div style={{ width: 60, height: 2, background: 'var(--color-border)', position: 'relative' }}>
                <div style={{ position: 'absolute', right: -4, top: -4, width: 0, height: 0, borderLeft: '8px solid var(--color-border)', borderTop: '5px solid transparent', borderBottom: '5px solid transparent' }} />
              </div>
            </div>

            {/* MCP Server */}
            <div style={{ textAlign: 'center', minWidth: 140 }}>
              <div style={{ width: 120, padding: '16px 12px', borderRadius: 12, background: 'var(--color-secondary)', margin: '0 auto 8px' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>MCP Server</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                {['Tools', 'Resources', 'Prompts'].map((c) => (
                  <span key={c} style={{ fontSize: 10, color: 'var(--color-text-muted)', background: 'var(--color-bg-alt)', padding: '2px 8px', borderRadius: 4 }}>{c}</span>
                ))}
              </div>
            </div>

            {/* Arrow: Server → Domain */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 12px' }}>
              <span style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>delegates</span>
              <div style={{ width: 60, height: 2, background: 'var(--color-border)', position: 'relative' }}>
                <div style={{ position: 'absolute', right: -4, top: -4, width: 0, height: 0, borderLeft: '8px solid var(--color-border)', borderTop: '5px solid transparent', borderBottom: '5px solid transparent' }} />
              </div>
            </div>

            {/* Domain / Use Cases */}
            <div style={{ textAlign: 'center', minWidth: 140 }}>
              <div style={{ width: 120, padding: '16px 12px', borderRadius: 12, border: '2px dashed var(--color-border)', margin: '0 auto 8px' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>Domain</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                {['Use Cases', 'Repositories', 'Services'].map((c) => (
                  <span key={c} style={{ fontSize: 10, color: 'var(--color-text-muted)', background: 'var(--color-bg-alt)', padding: '2px 8px', borderRadius: 4 }}>{c}</span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, textAlign: 'center' }}>
              The MCP server is just another transport layer — like Server Actions or API routes. Tool handlers are thin controllers that validate input, delegate to use cases, and return structured results.
            </p>
          </div>
        </div>
      </Section>

      {/* ---- Tool Description Anatomy ---- */}
      <Section title="Tool Description Anatomy">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          The description is the most important field. The model decides whether and how to call a tool based almost entirely on its description.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {/* Good example */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-success, #34C759)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-success, #34C759)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Precise Description</span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Name</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', fontFamily: 'monospace', marginTop: 4 }}>search_skills</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Description</span>
                <p style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.6, margin: '4px 0 0' }}>
                  Search the skill library by keyword. Returns matching skills with title, slug, description, and official status.
                  Use when the user asks about available skills, wants to find a skill by topic, or needs to browse capabilities.
                  Returns empty array if no matches.
                </p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Parameters</span>
                <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <code style={{ fontSize: 11, background: 'var(--color-bg-alt)', padding: '1px 6px', borderRadius: 3 }}>query</code>
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Search term — matches against title and description</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <code style={{ fontSize: 11, background: 'var(--color-bg-alt)', padding: '1px 6px', borderRadius: 3 }}>limit</code>
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Max results to return (1-50, default 10)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bad example */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-danger, #FF3B30)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-danger, #FF3B30)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Vague Description</span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Name</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', fontFamily: 'monospace', marginTop: 4 }}>search</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Description</span>
                <p style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.6, margin: '4px 0 0' }}>
                  Search for things
                </p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Parameters</span>
                <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <code style={{ fontSize: 11, background: 'var(--color-bg-alt)', padding: '1px 6px', borderRadius: 3 }}>q</code>
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>no .describe()</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <code style={{ fontSize: 11, background: 'var(--color-bg-alt)', padding: '1px 6px', borderRadius: 3 }}>n</code>
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>no .describe()</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}>
            <strong>Rule:</strong> Every tool description must explain <em>what</em> it does, <em>when</em> to use it, and <em>what</em> it returns.
            Every parameter must have a <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>.describe()</code> with clear semantics.
          </p>
        </div>
      </Section>

      {/* ---- Resource Design Patterns ---- */}
      <Section title="Resource Design Patterns">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Resources are read-only data fetched by URI. No side effects. Cacheable. Think of them as GET endpoints.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {/* Resources vs Tools */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>Resources (Read)</span>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { uri: 'skill://list', desc: 'All published skills' },
                { uri: 'skill://{slug}/content', desc: 'Skill markdown' },
                { uri: 'skill://{slug}/showcase', desc: 'Showcase HTML' },
                { uri: 'archetype://list', desc: 'All archetypes' },
                { uri: 'archetype://{slug}/config', desc: 'Archetype config' },
              ].map((r) => (
                <div key={r.uri} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <code style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-secondary)', background: 'var(--color-bg-alt)', padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>{r.uri}</code>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{r.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>Tools (Do)</span>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { name: 'search_skills', desc: 'Search by keyword' },
                { name: 'publish_skill', desc: 'Publish a draft' },
                { name: 'generate_project', desc: 'Generate ZIP' },
                { name: 'archive_skill', desc: 'Archive a skill' },
                { name: 'create_draft', desc: 'Create new draft' },
              ].map((t) => (
                <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <code style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-primary)', background: 'var(--color-bg-alt)', padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>{t.name}</code>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{t.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <CodeBlock language="ts" title="Resource registration">{`// Static resource — known at registration time
server.resource(
  'skill-list',
  'skill://list',
  'List of all published skills with title, slug, and description',
  async (uri) => ({
    contents: [{
      uri: uri.href,
      mimeType: 'application/json',
      text: JSON.stringify(await getAllPublishedSkills()),
    }],
  })
);

// Dynamic resource — URI template with parameter
server.resource(
  'skill-content',
  'skill://{slug}/content',
  'Raw SKILL.md content for a specific skill',
  async (uri) => {
    const slug = uri.pathname.split('/')[1];
    const skill = await findSkillBySlug(slug);
    if (!skill) return { contents: [] };
    return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text: skill.content }] };
  }
);`}</CodeBlock>
      </Section>

      {/* ---- Input Validation Flow ---- */}
      <Section title="Input Validation Flow">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Every tool handler follows a strict validation pipeline. Zod handles type validation, the handler checks business rules.
        </p>

        {/* Flow diagram */}
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, marginBottom: 20, overflowX: 'auto' }}>
          {[
            { step: '1', title: 'Zod Schema', desc: 'Type validation, coercion, defaults', color: 'var(--color-secondary)' },
            { step: '2', title: 'Auth Check', desc: 'context.meta?.userId — reject if missing', color: 'var(--color-primary)' },
            { step: '3', title: 'Permissions', desc: 'canPublish(), isAdmin() — role-based', color: 'var(--color-primary)' },
            { step: '4', title: 'Entity Exists?', desc: 'Verify referenced records exist', color: 'var(--color-secondary)' },
            { step: '5', title: 'Use Case', desc: 'Delegate to domain logic', color: 'var(--color-text-heading)' },
            { step: '6', title: 'Structured Result', desc: 'toolSuccess() or toolError()', color: 'var(--color-success, #34C759)' },
          ].map((s, i) => (
            <div key={s.step} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ minWidth: 130, padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontSize: 12, fontWeight: 700 }}>{s.step}</div>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', display: 'block' }}>{s.title}</span>
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{s.desc}</span>
              </div>
              {i < 5 && (
                <div style={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 12, height: 2, background: 'var(--color-border)' }} />
                </div>
              )}
            </div>
          ))}
        </div>

        <CodeBlock language="ts" title="Tool handler with validation">{`server.tool(
  'publish_skill',
  'Publish the current draft of a skill...',
  { skillId: z.string().uuid().describe('The skill ID to publish') },
  async ({ skillId }, context) => {
    // Step 2: Auth check
    const userId = context.meta?.userId;
    if (!userId) return toolError('Authentication required');

    // Step 3: Permission check
    if (!await canPublish(userId, skillId))
      return toolError('Permission denied');

    // Step 5: Delegate to use case
    const result = await publishSkillUseCase(skillId, userId);
    if (!result.ok) return toolError(result.error);

    // Step 6: Structured result
    return toolSuccess({
      version: result.value.version,
      slug: result.value.slug,
    });
  }
);`}</CodeBlock>
      </Section>

      {/* ---- Output Formatting ---- */}
      <Section title="Output Formatting — Structured Data">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Tools return JSON objects the model can process, not human-readable paragraphs. The model formats data for the user.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {/* Good */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-success, #34C759)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-success, #34C759)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Structured (model can reason)</span>
            </div>
            <div style={{ padding: 12 }}>
              <CodeBlock language="ts" title="Structured output">{`return toolSuccess({
  skills: results.map(s => ({
    slug: s.slug,
    title: s.title,
    official: s.isOfficial,
  })),
  total: results.length,
});`}</CodeBlock>
            </div>
          </div>

          {/* Bad */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-danger, #FF3B30)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-danger, #FF3B30)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Prose (model must parse language)</span>
            </div>
            <div style={{ padding: 12 }}>
              <CodeBlock language="ts" title="Prose output (avoid)">{`return {
  content: [{
    type: 'text',
    text: 'I found 3 skills. The first ' +
          'one is "Clean Architecture" ' +
          'which is official...'
  }]
};`}</CodeBlock>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', display: 'block', marginBottom: 12 }}>Standard response helpers</span>
          <CodeBlock language="ts" title="Response helpers">{`function toolSuccess(data: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data) }],
  };
}

function toolError(message: string) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify({ error: message }) }],
    isError: true,
  };
}`}</CodeBlock>
        </div>
      </Section>

      {/* ---- Transport Architecture ---- */}
      <Section title="Transport Architecture">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Keep all server logic independent of transport. Wire the transport in the entrypoint only.
          Switching transport = changing one import in one file.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {/* File structure */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, display: 'block' }}>Project Structure</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { path: 'entrypoints/stdio.ts', desc: 'Local / Claude Desktop', indent: 0 },
                { path: 'entrypoints/http.ts', desc: 'Remote / Cursor / cloud', indent: 0 },
                { path: 'server/index.ts', desc: 'McpServer + registration', indent: 0 },
                { path: 'server/tools/', desc: 'Tool definitions by domain', indent: 1 },
                { path: 'server/resources/', desc: 'Resource definitions', indent: 1 },
                { path: 'server/prompts/', desc: 'Prompt templates', indent: 1 },
              ].map((f) => (
                <div key={f.path} style={{ display: 'flex', alignItems: 'baseline', gap: 8, paddingLeft: f.indent * 16 }}>
                  <code style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>{f.path}</code>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{f.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transport comparison */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, display: 'block' }}>Transport Options</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)', borderLeft: '3px solid var(--color-secondary)' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>stdio</span>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>Local dev, Claude Desktop, CLI agents. Process-level communication.</p>
              </div>
              <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)', borderLeft: '3px solid var(--color-primary)' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Streamable HTTP</span>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>Remote clients, cloud, multi-client. Recommended for production deployment.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Tool Set Design ---- */}
      <Section title="Tool Set Design — Keep It Small">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          5-10 tools per server is ideal. Beyond 20, model tool selection accuracy drops noticeably.
          Group related tools under a shared naming prefix.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { range: '5-10', label: 'Ideal', color: 'var(--color-success, #34C759)', desc: 'High accuracy, focused server' },
            { range: '11-15', label: 'Acceptable', color: 'var(--color-warning, #FFB800)', desc: 'Consider splitting soon' },
            { range: '15+', label: 'Too Many', color: 'var(--color-danger, #FF3B30)', desc: 'Split into focused servers' },
          ].map((bucket) => (
            <div key={bucket.range} style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: bucket.color, marginBottom: 4 }}>{bucket.range}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{bucket.label}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{bucket.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, display: 'block' }}>Naming Prefix Groups</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { prefix: 'skill_', tools: ['skill_search', 'skill_publish', 'skill_download', 'skill_archive'] },
              { prefix: 'project_', tools: ['project_generate', 'project_list', 'project_download'] },
              { prefix: 'archetype_', tools: ['archetype_list', 'archetype_detail', 'archetype_suggest'] },
            ].map((group) => (
              <div key={group.prefix} style={{ padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)' }}>
                <code style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', display: 'block', marginBottom: 6 }}>{group.prefix}*</code>
                {group.tools.map((t) => (
                  <div key={t} style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-text-muted)', marginBottom: 2 }}>{t}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---- Prompt Templates ---- */}
      <Section title="Prompt Templates">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Reusable, parameterized prompts that clients surface to users — e.g. slash commands in Claude Desktop.
        </p>

        <CodeBlock language="ts" title="Prompt template">{`server.prompt(
  'review-skill',
  'Review a skill file for quality, completeness, and adherence to guidelines',
  { slug: z.string().describe('Slug of the skill to review') },
  async ({ slug }) => {
    const skill = await findSkillBySlug(slug);
    if (!skill) return {
      messages: [{ role: 'user', content: { type: 'text', text: \`Skill "\${slug}" not found.\` } }]
    };
    return {
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: [
            'Review this skill for quality and completeness.',
            'Check: required sections, verifiable instructions, examples, length < 500 lines.',
            '', 'Skill content:', skill.content,
          ].join('\\n'),
        },
      }],
    };
  }
);`}</CodeBlock>

        <div style={{ marginTop: 16, padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}>
            <strong>When to use prompt templates:</strong> When a workflow has a predictable structure, when users frequently do the same task with different inputs,
            or when you want to encode domain-specific instructions the model should follow.
          </p>
        </div>
      </Section>

      {/* ---- Testing Patterns ---- */}
      <Section title="Testing — Extract, Unit Test, Integration Test">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Extract tool logic into standalone functions for unit testing. Use InMemoryTransport for integration tests.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>Unit Test (extracted function)</span>
            </div>
            <div style={{ padding: 12 }}>
              <CodeBlock language="ts" title="Unit test pattern">{`// skill-tools.ts
export async function handleSearchSkills(
  query: string, limit: number
): Promise<ToolResult> {
  const results = await skillRepo.search(query, limit);
  return toolSuccess({
    skills: results.map(toSkillSummary),
    total: results.length,
  });
}

// skill-tools.test.ts
test('returns matching skills', async () => {
  const result = await handleSearchSkills('arch', 5);
  const data = JSON.parse(result.content[0].text);
  expect(data.skills).toHaveLength(2);
});`}</CodeBlock>
            </div>
          </div>

          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>Integration Test (InMemoryTransport)</span>
            </div>
            <div style={{ padding: 12 }}>
              <CodeBlock language="ts" title="Integration test">{`import { InMemoryTransport }
  from '@modelcontextprotocol/sdk/inMemory.js';
import { Client }
  from '@modelcontextprotocol/sdk/client/index.js';

const [clientT, serverT] =
  InMemoryTransport.createLinkedPair();

await server.connect(serverT);
const client = new Client({
  name: 'test', version: '1.0.0'
});
await client.connect(clientT);

const result = await client.callTool({
  name: 'search_skills',
  arguments: { query: 'architecture', limit: 5 },
});
expect(result.isError).toBe(false);`}</CodeBlock>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Banned Patterns ---- */}
      <Section title="Banned Patterns">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { banned: 'Business logic in tool handlers', fix: 'Delegate to use cases, keep handlers thin' },
            { banned: 'Vague or missing tool descriptions', fix: 'Multi-sentence: what, when, returns' },
            { banned: 'Parameters without .describe()', fix: 'Every Zod parameter needs a description' },
            { banned: 'More than 15 tools per server', fix: 'Split into focused servers by domain' },
            { banned: 'Tools returning prose', fix: 'Return JSON, let the model format' },
            { banned: 'Transport code in tool definitions', fix: 'Wire transport in entrypoint only' },
            { banned: 'Destructive tools without auth', fix: 'Verify permissions before executing' },
            { banned: 'Untestable tool logic', fix: 'Extract handler logic into standalone functions' },
            { banned: 'Resources that mutate state', fix: 'Resources are read-only; use tools for mutations' },
            { banned: 'Raw stack traces to model', fix: 'Return structured errors via toolError()' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '10px 12px', borderRadius: 6, background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, color: 'var(--color-danger, #FF3B30)', fontWeight: 700 }}>x</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>{row.banned}</span>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)' }}>{row.fix}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
