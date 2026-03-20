---
name: mcp-server-patterns
description: >
  Patterns for designing and building MCP (Model Context Protocol) servers that
  integrate cleanly with your application architecture. Covers tool design,
  resource design, prompt templates, transport selection, error handling,
  security, and testing. Apply when building or maintaining MCP servers with
  the TypeScript SDK. The SDK API evolves — verify current signatures against
  official MCP docs or Context7.
---

# MCP Server Patterns

The Model Context Protocol lets AI assistants call tools, read resources, and use prompt templates from your server. A well-designed MCP server exposes your application's capabilities to AI agents through clean, composable interfaces.

MCP tool handlers follow the same principle as Server Actions in our architecture: **thin controllers that validate input, call a use case, and return a structured result.** The business logic stays in your domain — the MCP layer is just another transport.

---

## When to Use

Apply this skill when:
- Building a new MCP server
- Adding tools, resources, or prompt templates
- Choosing between stdio and HTTP transport
- Designing tool interfaces for AI agent consumption
- Integrating MCP tools with existing application logic
- Testing or debugging MCP servers

Do NOT use this skill for:
- General backend patterns (validation, error handling, caching) — see **backend-patterns**
- Where code lives in the project — see **clean-architecture**
- Claude API integration (calling Claude, not being called by Claude) — see **ai-claude**

---

## Core Rules

### 1. Tool descriptions are the most important field

The model decides whether and how to call a tool based almost entirely on its description. A vague description leads to wrong tool selection, incorrect parameters, and wasted tokens. A precise description leads to accurate, first-try tool use.

```ts
// ✅ Precise — model knows exactly when and how to use this
server.tool(
  'search_skills',
  'Search the skill library by keyword. Returns matching skills with title, slug, ' +
  'description, and official status. Use when the user asks about available skills, ' +
  'wants to find a skill by topic, or needs to browse capabilities. ' +
  'Returns empty array if no matches.',
  { query: z.string().describe('Search term — matches against title and description'),
    limit: z.number().min(1).max(50).default(10).describe('Max results to return') },
  async ({ query, limit }) => { ... }
);

// ❌ Vague — model guesses when to use it and what parameters mean
server.tool(
  'search',
  'Search for things',
  { q: z.string(), n: z.number().optional() },
  async ({ q, n }) => { ... }
);
```

### 2. Tool handlers are thin controllers

A tool handler validates input (via Zod schema), calls a use case or repository, and returns a structured result. No business logic in the handler. Your MCP server is a transport layer — it delegates to the same use cases your Server Actions call.

```ts
// ✅ Thin handler — delegates to use case
server.tool(
  'publish_skill',
  'Publish the current draft of a skill, making it available in the library. ' +
  'Requires the skill to have an unpublished draft. Returns the new version number.',
  { skillId: z.string().uuid().describe('The skill ID to publish') },
  async ({ skillId }, context) => {
    const userId = context.meta?.userId;
    if (!userId) return toolError('Authentication required');

    const result = await publishSkillUseCase(skillId, userId);
    if (!result.ok) return toolError(result.error);

    return toolSuccess({ version: result.value.version, slug: result.value.slug });
  }
);

// ❌ Business logic in the handler
server.tool('publish_skill', '...', { skillId: z.string() },
  async ({ skillId }) => {
    const skill = await db.query.skills.findFirst({ where: eq(skills.id, skillId) });
    if (!skill.draftId) throw new Error('No draft');
    await db.update(skillVersions).set({ status: 'published' });
    // 20 more lines of orchestration...
  }
);
```

### 3. Keep tool sets small and focused

5–10 tools per server is ideal. Beyond 20, model tool selection accuracy drops noticeably. If your server needs more than 15 tools, split into multiple focused servers (e.g. `skill-management-server`, `project-generation-server`).

Group related tools under a shared naming prefix: `skill_search`, `skill_publish`, `skill_download`. This helps the model understand which tools belong to the same domain.

### 4. Resources are for reading, tools are for doing

**Resources** = read-only data the model fetches by URI. No side effects. Cacheable. Think of them as GET endpoints.

**Tools** = actions that may change state, call external services, or compute derived results. Think of them as POST endpoints.

If the model needs to *read* a skill's content → resource.
If the model needs to *publish* a skill → tool.

### 5. Transport is a deployment decision, not an architecture decision

Keep all server logic (tools, resources, prompts) independent of transport. Wire the transport in the entrypoint only. This lets you run the same server over stdio (local/Claude Desktop) or HTTP (remote/Cursor/cloud) without changing any tool code.

### 6. Return structured data, not prose

Tools should return JSON objects the model can process, not human-readable paragraphs. The model will format the data for the user. Your job is to return accurate, structured information.

```ts
// ✅ Structured — model can reason about the data
return { content: [{ type: 'text', text: JSON.stringify({
  skills: results.map(s => ({ slug: s.slug, title: s.title, official: s.isOfficial })),
  total: results.length,
}) }] };

// ❌ Prose — model has to parse natural language
return { content: [{ type: 'text',
  text: `I found 3 skills. The first one is "Clean Architecture" which is official...`
}] };
```

---

## Server Setup

```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'ai-centre',
  version: '1.0.0',
});
```

> **SDK version caveat:** The `@modelcontextprotocol/sdk` API has changed across versions. The examples here use the `server.tool(name, description, schema, handler)` pattern. If your SDK version uses `registerTool()` or a different signature, check the [official MCP docs](https://modelcontextprotocol.io) or query Context7. The design principles apply regardless of API surface.

---

## Tool Design

### Parameter Design

Use Zod schemas with `.describe()` on every parameter. The description tells the model what to pass — without it, the model guesses from the parameter name alone.

```ts
server.tool(
  'generate_project',
  'Generate a downloadable project ZIP from an archetype and selected skills. ' +
  'Returns a download URL. The user must provide a description of their idea.',
  {
    archetypeSlug: z.string().describe('Slug of the archetype to use (e.g. "presentation", "dashboard")'),
    skillSlugs: z.array(z.string()).min(1).describe('Array of skill slugs to include in the project'),
    description: z.string().min(10).describe('User description of what they want to build'),
  },
  async ({ archetypeSlug, skillSlugs, description }, context) => { ... }
);
```

### Tool Response Helpers

Standardise success and error responses for consistency across all tools.

```ts
function toolSuccess(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
}

function toolError(message: string) {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ error: message }) }], isError: true };
}
```

### Idempotent Tools

Where possible, design tools to be safely retried. The model may call a tool multiple times if it's uncertain about the result. Idempotent tools (same input → same effect regardless of repetition) prevent accidental duplication.

For non-idempotent operations (publishing, sending email), return a clear result on the first call and detect duplicates on subsequent calls.

---

## Resource Design

Resources are read-only data fetched by URI. Design URIs to be predictable and self-describing.

```ts
// Static resource — content known at registration
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

// Dynamic resource with URI template
server.resource(
  'skill-content',
  'skill://{slug}/content',
  'Raw SKILL.md content for a specific skill',
  async (uri) => {
    const slug = uri.pathname.split('/')[1];
    const skill = await findSkillBySlug(slug);
    if (!skill) return { contents: [] };

    return {
      contents: [{
        uri: uri.href,
        mimeType: 'text/markdown',
        text: skill.content,
      }],
    };
  }
);
```

### URI Scheme Conventions

Use a consistent scheme that reflects your domain:

```
skill://list                    — all skills
skill://{slug}/content          — skill markdown content
skill://{slug}/showcase         — skill showcase HTML
archetype://list                — all archetypes
archetype://{slug}/config       — archetype configuration
```

---

## Prompt Templates

Prompt templates are reusable, parameterised prompts that clients can surface to users (e.g. in Claude Desktop's slash commands).

```ts
server.prompt(
  'review-skill',
  'Review a skill file for quality, completeness, and adherence to the skill-creation guidelines',
  {
    slug: z.string().describe('Slug of the skill to review'),
  },
  async ({ slug }) => {
    const skill = await findSkillBySlug(slug);
    if (!skill) return { messages: [{ role: 'user', content: { type: 'text', text: `Skill "${slug}" not found.` } }] };

    return {
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: [
            `Review this skill for quality and completeness.`,
            `Check against the skill-creation guidelines: required sections (When to Use, Core Rules, Banned Patterns, Quality Gate),`,
            `verifiable instructions, concrete examples, and total length under 500 lines.`,
            '',
            `Skill content:`,
            skill.content,
          ].join('\n'),
        },
      }],
    };
  }
);
```

Use prompt templates when:
- A workflow has a predictable structure that benefits from a starting prompt
- Users frequently perform the same type of task with different inputs
- You want to encode domain-specific instructions that the model should follow

---

## Transport

### Stdio (Local — Claude Desktop, CLI tools)

```ts
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const transport = new StdioServerTransport();
await server.connect(transport);
```

Use for: local development, Claude Desktop integration, CLI-based agents.

### Streamable HTTP (Remote — Cursor, cloud, multi-client)

Use for: remote clients, cloud deployment, serving multiple clients. Streamable HTTP is the current recommended transport for remote servers. Support legacy HTTP/SSE only when backward compatibility with older clients is required.

### Architecture

```
entrypoints/
  stdio.ts          ← wires transport, starts server
  http.ts           ← wires transport, starts server
server/
  index.ts          ← creates McpServer, registers all tools/resources/prompts
  tools/            ← tool definitions (grouped by domain)
  resources/        ← resource definitions
  prompts/          ← prompt templates
```

The `server/` directory knows nothing about transport. The entrypoint files import the server and connect it to a transport. Switching transport = changing one import in one file.

---

## Security

### Auth Context

Pass auth information via the context object, not as tool parameters. The client provides auth context at the transport level.

```ts
server.tool('publish_skill', '...', { skillId: z.string().uuid() },
  async ({ skillId }, context) => {
    const userId = context.meta?.userId;
    if (!userId) return toolError('Authentication required');
    if (!await canPublish(userId, skillId)) return toolError('Permission denied');
    // ...
  }
);
```

### Input Validation

Zod schemas handle type validation. Add business-rule validation in the tool handler:

- Validate that referenced entities exist before operating on them
- Check permissions before executing state-changing operations
- Sanitise string inputs that will be used in queries or displayed in UI

### Tool Scope

Document what each tool can and cannot do. Destructive tools (delete, archive) should include confirmation mechanisms or be restricted to admin auth contexts.

---

## Testing

### Unit Test Tool Handlers

Extract tool logic into functions that can be tested independently of the MCP server.

```ts
// skill-tools.ts — logic separated from registration
export async function handleSearchSkills(
  query: string, limit: number
): Promise<ToolResult> {
  const results = await skillRepo.search(query, limit);
  return toolSuccess({ skills: results.map(toSkillSummary), total: results.length });
}

// skill-tools.test.ts
test('returns matching skills', async () => {
  const result = await handleSearchSkills('architecture', 5);
  expect(JSON.parse(result.content[0].text).skills).toHaveLength(2);
});

// registration (in server setup)
server.tool('search_skills', '...', schema, ({ query, limit }) =>
  handleSearchSkills(query, limit)
);
```

### Integration Test with Mock Transport

```ts
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

await server.connect(serverTransport);
const client = new Client({ name: 'test', version: '1.0.0' });
await client.connect(clientTransport);

const result = await client.callTool({ name: 'search_skills', arguments: { query: 'architecture', limit: 5 } });
expect(result.isError).toBe(false);
```

---

## Banned Patterns

- ❌ Business logic in tool handlers → delegate to use cases, keep handlers as thin controllers
- ❌ Tool descriptions that are vague or missing → write precise descriptions that tell the model when and how to use the tool
- ❌ Parameters without `.describe()` → every Zod parameter needs a description
- ❌ More than 15 tools on a single server → split into focused servers by domain
- ❌ Tools that return prose instead of structured data → return JSON, let the model format for the user
- ❌ Transport-specific code in tool definitions → keep tools transport-agnostic, wire transport in entrypoint
- ❌ Destructive tools without auth checks → verify permissions in the handler before executing
- ❌ Tool logic that can't be unit tested → extract handler logic into standalone functions
- ❌ Resources that mutate state → resources are read-only; use tools for state changes
- ❌ Raw error stack traces returned to the model → return structured error messages via `toolError()`

---

## Quality Gate

Before delivering, verify:

- [ ] Every tool has a precise, multi-sentence description explaining when and how to use it
- [ ] Every parameter has a `.describe()` with clear semantics
- [ ] Tool handlers contain no business logic — they validate, delegate to a use case, and return
- [ ] Tool count per server is under 15 (ideally 5–10)
- [ ] Tools return structured JSON, not prose
- [ ] Resources are read-only with no side effects
- [ ] Resource URIs follow a consistent, predictable scheme
- [ ] Server logic is transport-agnostic — stdio and HTTP wired in separate entrypoints
- [ ] Auth context checked in tool handlers before state-changing operations
- [ ] Tool handler logic extracted into testable functions
- [ ] Error responses use structured format (`toolError()`) not raw throws
- [ ] SDK version pinned in `package.json` with a note about API stability
