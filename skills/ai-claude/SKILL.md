---
name: ai-claude
description: >
  Implementation skill for ai-capabilities. Patterns for integrating the Anthropic
  Claude API. Covers architectural placement, prompt management, structured output,
  streaming, tool use, extended thinking, cost optimization, resilience, and testing.
  Apply when code imports `@anthropic-ai/sdk`.
---

# Claude API Integration

Patterns for building reliable, cost-aware features powered by the Claude API. Covers how to architect AI calls into your application — not SDK quickstart (see [Anthropic docs](https://docs.anthropic.com)).

---

## When to Use

Apply when:
- Building features that call the Claude API (generation, analysis, classification)
- Designing prompt templates or managing prompt content
- Implementing streaming responses to the UI
- Using tool use (function calling) for agentic workflows
- Optimising API costs (model selection, caching, batching)
- Handling AI-specific errors (rate limits, context overflow, model overload)
- Testing AI-dependent features

Do NOT use for:
- Generic backend patterns (error handling, repositories, caching) — see **backend-patterns**
- Where AI service code lives in the project — see **clean-architecture** (it's an infrastructure service called by use cases)

---

## Core Rules

### 1. AI calls are infrastructure, not business logic

The Claude API is an external service — like a database or email provider. It lives in an infrastructure service, called by use cases. The use case decides *what* to generate; the service decides *how* to call the API.

```ts
// ✅ Use case orchestrates, service handles the API
async function publishSkillUseCase(skillId: string, userId: string) {
  const skill = await skillRepo.findById(skillId);
  const published = skill.publish(userId);
  await skillRepo.saveVersion(published);

  // AI generation is a side effect — delegated to infrastructure
  const showcase = await aiService.generateShowcase(published.content);
  await skillRepo.updateShowcase(skillId, showcase);
}

// ❌ Use case contains API call details
async function publishSkillUseCase(skillId: string) {
  const client = new Anthropic();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: 'You are a technical writer...',
    messages: [{ role: 'user', content: `Generate a showcase for: ${content}` }],
  });
  // Use case is now coupled to the Anthropic SDK
}
```

### 2. Prompts are structured templates, not inline strings

Prompts are code artifacts — they have structure, change over time, and should be testable independently.

```ts
// ✅ Prompt template — structured, testable, versionable
interface ShowcasePromptInput {
  skillTitle: string;
  skillContent: string;
  targetAudience: string;
}

function buildShowcasePrompt(input: ShowcasePromptInput): string {
  return [
    `Generate a showcase page for the skill "${input.skillTitle}".`,
    `Target audience: ${input.targetAudience}`,
    '',
    'The skill specification:',
    input.skillContent,
    '',
    'Requirements:',
    '- Include practical examples with code snippets',
    '- Show before/after comparisons',
    '- Structure with clear headings',
  ].join('\n');
}

// ❌ Prompt buried in API call
const response = await client.messages.create({
  messages: [{ role: 'user', content: `Generate a showcase for ${title}. Here is the content: ${content}. Make it good.` }],
});
```

### 3. Always use structured output for data extraction

When you need structured data from Claude, use explicit formatting instructions and validate the response. Never trust raw text parsing.

```ts
// ✅ Request structured JSON, validate the response
const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 2048,
  messages: [{
    role: 'user',
    content: `Analyse this skill and return a JSON object with this exact shape:
{ "summary": string, "keyTopics": string[], "difficulty": "beginner" | "intermediate" | "advanced" }

Skill content:
${skillContent}

Respond with ONLY the JSON object, no markdown fences, no explanation.`
  }],
});

const text = response.content[0].type === 'text' ? response.content[0].text : '';
const parsed = JSON.parse(text);
const validated = SkillAnalysisSchema.parse(parsed);  // Zod validation
```

### 4. Choose the model per task, not per project

Different tasks warrant different models. Make model selection a parameter, not a global constant.

| Task type | Recommended model | Why |
|---|---|---|
| Complex generation (showcase pages, CLAUDE.md) | `claude-sonnet-4-6` | Good balance of quality and cost |
| Deep reasoning, architecture analysis | `claude-opus-4-6` | Quality over speed |
| Classification, extraction, tagging | `claude-haiku-4-5-20251001` | Fast, cheap, sufficient for structured tasks |
| Bulk processing (batch analysis) | Haiku via Batches API | 50% cost reduction + cheapest model |

```ts
// AI service accepts model as parameter
interface GenerateOptions {
  model?: 'claude-opus-4-6' | 'claude-sonnet-4-6' | 'claude-haiku-4-5-20251001';
  maxTokens?: number;
}

async function generate(prompt: string, options: GenerateOptions = {}) {
  const { model = 'claude-sonnet-4-6', maxTokens = 4096 } = options;
  return client.messages.create({ model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] });
}
```

### 5. Stream to the UI for long-running generation

Any generation taking more than 1 second should stream. Use Server-Sent Events or ReadableStream to bridge server to client.

### 6. Cache expensive prompts

If the same system prompt or large context block is sent repeatedly, use prompt caching to avoid re-processing. Up to 90% input token savings for cached portions.

### 7. Handle AI-specific failures explicitly

The Claude API has failure modes that generic retry logic doesn't address: rate limits (429), overloaded (529), context too long (400), and content filtering. Each needs a specific strategy.

---

## Streaming to UI

Stream Claude responses through your server to the browser.

```ts
// Server — Next.js Route Handler returning a ReadableStream
export async function POST(request: Request) {
  const { prompt } = await request.json();

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' },
  });
}

// Client — React hook consuming the stream
async function streamGeneration(prompt: string, onChunk: (text: string) => void) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value));
  }
}
```

---

## Tool Use

Tool use lets Claude call functions you define, enabling agentic workflows where the model can search, query databases, or take actions.

```ts
const tools: Anthropic.Tool[] = [
  {
    name: 'search_skills',
    description: 'Search the skill library by keyword. Returns matching skill titles and descriptions.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        limit: { type: 'number', description: 'Max results (default 5)' },
      },
      required: ['query'],
    },
  },
];

// Agentic loop — Claude calls tools, you execute them, feed results back
async function runAgent(userMessage: string) {
  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: userMessage }];

  while (true) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      tools,
      messages,
    });

    if (response.stop_reason === 'end_turn') {
      return response.content.filter(b => b.type === 'text').map(b => b.text).join('');
    }

    messages.push({ role: 'assistant', content: response.content });

    const toolResults = await Promise.all(
      response.content
        .filter((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use')
        .map(async (block) => ({
          type: 'tool_result' as const,
          tool_use_id: block.id,
          content: JSON.stringify(await executeToolCall(block.name, block.input)),
        }))
    );

    messages.push({ role: 'user', content: toolResults });
  }
}
```

**Tool design principles:**
- Descriptions matter more than names — Claude uses the description to decide when to call a tool
- Return structured data (JSON), not prose
- Keep the tool set small per interaction — 5-10 tools ideal, accuracy drops beyond 20
- Validate tool inputs before executing — Claude can hallucinate parameter values

---

## Extended Thinking

For complex reasoning where step-by-step thinking improves output quality.

```ts
const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 16000,
  thinking: { type: 'enabled', budget_tokens: 10000 },
  messages: [{ role: 'user', content: complexPrompt }],
});

for (const block of response.content) {
  if (block.type === 'thinking') {
    console.log('Reasoning:', block.thinking);
  } else if (block.type === 'text') {
    console.log('Answer:', block.text);
  }
}
```

**Use extended thinking for:** multi-step reasoning (architecture analysis, debugging), tasks where showing reasoning matters (audits, reviews), or when initial attempts without thinking produce poor results.

**Do not use for:** simple generation, classification, or extraction (adds latency without benefit), or streaming UX where speed matters (thinking blocks delay text).

---

## Prompt Caching

Cache large repeating context blocks. Up to 90% input token savings on cached portions.

```ts
const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 4096,
  system: [
    {
      type: 'text',
      text: largeSystemPrompt,  // e.g. 5000 tokens of instructions
      cache_control: { type: 'ephemeral' },
    },
  ],
  messages: [{ role: 'user', content: userQuestion }],
});

const { cache_read_input_tokens, cache_creation_input_tokens } = response.usage;
```

**Caching rules:**
- Minimum cacheable size: 1024 tokens (shorter blocks won't be cached)
- Cache lives ~5 minutes of inactivity, refreshed on each hit
- Place cached content first (system prompt, then cached context, then dynamic content)
- Cache creation costs slightly more than normal read — breaks even after 2+ hits

---

## Batches API

Process large volumes asynchronously at 50% cost reduction. Results within 24 hours.

```ts
const batch = await client.messages.batches.create({
  requests: items.map((item, i) => ({
    custom_id: `item-${i}`,
    params: {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: buildPrompt(item) }],
    },
  })),
});

const completed = await pollUntilDone(batch.id);

for await (const result of client.messages.batches.results(batch.id)) {
  if (result.result.type === 'succeeded') {
    const text = result.result.message.content[0].text;
    await processResult(result.custom_id, text);
  }
}
```

**When to batch:** analysing/classifying 50+ items, generating content for a catalogue, any operation where 24-hour turnaround is acceptable.

---

## Context Window Management

Claude has 200K token context windows, but using them carelessly is expensive and degrades quality — long contexts make the model work harder to find relevant information.

**Strategies:**
- **Chunk and summarise.** For very large documents, split into chunks, summarise each, then work with summaries.
- **Relevant context only.** Send specific files or sections, not the entire codebase.
- **System prompt for stable context, user message for dynamic.** System prompt is cacheable; structure accordingly.
- **Token counting before sending.** Check input size before calling the API; truncate or summarise if over budget.

```ts
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);  // rough: 1 token ≈ 4 chars for English
}

const inputTokens = estimateTokens(systemPrompt) + estimateTokens(userMessage);
if (inputTokens > 150000) {
  userMessage = await summarise(userMessage, { targetTokens: 50000 });
}
```

---

## Error Handling

AI-specific failures need specific strategies beyond generic retry.

| Error | Status | Strategy |
|---|---|---|
| Rate limited | 429 | Back off exponentially. Check `retry-after` header. Consider queuing. |
| Overloaded | 529 | Retry after 30-60s. If persistent, fall back to a different model. |
| Context too long | 400 | Truncate, summarise, or chunk the input. |
| Content filtered | 400 | Rephrase prompt or check for policy violations in input. |
| Invalid API key | 401 | Configuration error. Fail hard — don't retry. |
| Timeout | — | Set 60-120s timeout. Retry once, then fail gracefully. |

```ts
async function callClaudeWithFallback(prompt: string, options: GenerateOptions = {}) {
  try {
    return await withRetry(
      () => client.messages.create({ model: options.model ?? 'claude-sonnet-4-6', max_tokens: options.maxTokens ?? 4096, messages: [{ role: 'user', content: prompt }] }),
      { maxRetries: 2, baseDelayMs: 2000 }
    );
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return client.messages.create({ model: 'claude-haiku-4-5-20251001', max_tokens: options.maxTokens ?? 4096, messages: [{ role: 'user', content: prompt }] });
    }
    throw error;
  }
}
```

---

## Testing AI-Dependent Code

AI responses are non-deterministic. Test the integration, not the content.

**Strategy 1: Mock the AI service at the boundary**

```ts
interface AIService {
  generateShowcase(content: string): Promise<string>;
  classifySkill(content: string): Promise<SkillClassification>;
}

const mockAI: AIService = {
  generateShowcase: async () => '<h1>Mock Showcase</h1>',
  classifySkill: async () => ({ difficulty: 'intermediate', topics: ['testing'] }),
};

const result = await publishSkillUseCase(skillId, userId, { aiService: mockAI });
```

**Strategy 2: Snapshot testing for prompt templates**

```ts
test('buildShowcasePrompt includes skill title', () => {
  const prompt = buildShowcasePrompt({ skillTitle: 'Clean Architecture', skillContent: '...', targetAudience: 'developers' });
  expect(prompt).toContain('Clean Architecture');
  expect(prompt).toContain('Target audience: developers');
});
```

**Strategy 3: Evaluation runs for quality (CI or manual)**

For features where generation quality matters, run periodic evaluations: generate outputs for a fixed set of inputs, score against criteria (expected sections, valid JSON, correct structure), track quality over time, and run on model upgrades to catch regressions.

---

## Cost Optimization

| Strategy | Savings | When |
|---|---|---|
| Prompt caching | Up to 90% on cached tokens | Same system prompt/context sent repeatedly |
| Batches API | 50% per request | Bulk processing, non-real-time |
| Haiku for simple tasks | ~75% vs Sonnet | Classification, extraction, tagging, validation |
| Shorter max_tokens | Variable | Expected output length is known |
| Summarise before sending | Variable | Large inputs where full context isn't needed |
| Cache results application-side | 100% (no API call) | Identical requests within a time window |

**Cost-aware architecture:** Log token usage per call. Track costs by feature to identify optimization opportunities. Set per-feature token budgets where appropriate.

---

## Standards

- Wrap the Anthropic SDK in an infrastructure service. Not: importing it directly in use cases or UI code
- Use structured prompt template functions for all prompts. Not: inline string concatenation in API calls
- Validate all structured AI output with a schema (Zod, etc). Not: trusting raw AI text output as structured data
- Select the model per task based on complexity and cost. Not: a single model hardcoded for all tasks
- Stream any response expected to take longer than 1 second. Not: long generation without streaming
- Send only relevant content and summarise large inputs. Not: sending full context when a subset would suffice
- Handle 429/529 errors explicitly with backoff and fallback. Not: missing error handling for rate limits or overload
- Mock the AI service boundary in unit tests. Not: testing AI features by calling the real API
- Store API keys in environment variables only. Not: hardcoding or committing API keys in code
- Log token usage per call and track costs per feature. Not: ignoring token usage and costs

---

## Quality Gate

Before delivering, verify:

- [ ] AI calls go through an infrastructure service, not directly from use cases or UI
- [ ] Prompts are structured template functions, not inline strings
- [ ] Structured output is validated with a schema after parsing
- [ ] Model is selected per task (not one model for everything)
- [ ] Long-running generation streams to the UI
- [ ] Error handling covers rate limits (429), overload (529), context overflow (400), and timeout
- [ ] Non-critical AI failures degrade gracefully (log and continue, don't crash)
- [ ] AI service is mockable for testing — tests don't hit the real API
- [ ] Prompt templates have snapshot tests verifying correct construction
- [ ] Token usage is logged or observable per call
- [ ] API key comes from environment variable, never hardcoded
- [ ] Prompt caching is used for repeated system prompts or context blocks over 1024 tokens
