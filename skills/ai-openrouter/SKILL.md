---
name: ai-openrouter
description: >
  Implementation skill for ai-capabilities. Patterns for integrating OpenRouter
  as a unified AI gateway. Covers SDK options, model routing, fallback chains,
  provider preferences, structured output, streaming, tool use, and cost
  management. Apply when using OpenRouter to access multiple AI providers through
  a single API.
---

# OpenRouter Integration

OpenRouter is a unified gateway to 500+ AI models from 60+ providers through a single API key. It's OpenAI SDK-compatible — change the `baseURL` and you're connected to Anthropic, Google, Meta, Mistral, and dozens more.

---

## When to Use

Apply this skill when:
- You need access to multiple AI providers without managing separate API keys
- Building features that should fall back across providers (Anthropic → OpenAI → Google)
- Optimising for cost, speed, or throughput across providers
- Using the OpenAI SDK but want access to non-OpenAI models
- Need zero data retention (ZDR) for privacy-sensitive workloads
- Want automatic prompt caching across providers

Do NOT use this skill for:
- Direct Anthropic SDK integration — see **ai-claude**
- Media generation via fal.ai — see **ai-fal**
- Deciding which AI capability to use — see **ai-capabilities**

---

## Core Rules

OpenRouter is a proxy to 500+ models via a single API key (OpenAI SDK-compatible). Models use `provider/model-name` format (e.g. `anthropic/claude-sonnet-4`). Append routing suffixes: `:nitro` (speed), `:floor` (cost), `:free` (zero cost), `:exacto` (tool accuracy), `:online` (web search). Use `openrouter/auto` for prototyping only — specify models explicitly for production.

### 1. Use fallback chains for production features

Never rely on a single model in production. Define a fallback chain so your feature stays up during provider outages.

```ts
const response = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages: [{ role: 'user', content: prompt }],
  // @ts-expect-error — OpenRouter extension, not in OpenAI types
  models: [
    'anthropic/claude-sonnet-4',
    'openai/gpt-4o',
    'google/gemini-2.5-pro',
  ],
});
```

Order models by preference. OpenRouter tries them in order, falling back on provider errors (502, 503).

### 2. Set provider preferences for cost and latency control

```ts
const response = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages: [{ role: 'user', content: prompt }],
  // @ts-expect-error — OpenRouter extension
  provider: {
    sort: [
      { field: 'price', order: 'asc' },
      { field: 'latency', order: 'asc' },
    ],
    order: ['Anthropic', 'AWS Bedrock', 'Google'],
    data_collection: 'deny', // ZDR — provider deletes data after processing
  },
});
```

**Use `data_collection: 'deny'` (ZDR) when** processing PII or sensitive business data, or when compliance requires no third-party data retention. Note: ZDR may limit available providers.

### 3. Use routing variants strategically

```ts
// Speed-critical: user-facing, real-time UI
const fast = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4:nitro',
  messages,
});

// Cost-critical: batch processing, background tasks
const cheap = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4:floor',
  messages,
});

// Prototyping: zero cost for development
const free = await openai.chat.completions.create({
  model: 'meta-llama/llama-4-maverick:free',
  messages,
});
```

### 4. Structured output with JSON mode

OpenRouter supports both `json_object` and `json_schema` response formats:

```ts
// Simple JSON mode — model returns valid JSON
const response = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages: [
    {
      role: 'user',
      content: 'List 3 programming languages as JSON: { "languages": [{ "name": string, "year": number }] }',
    },
  ],
  response_format: { type: 'json_object' },
});

const data = JSON.parse(response.choices[0].message.content!);

// Strict JSON schema — guarantees exact structure
const response2 = await openai.chat.completions.create({
  model: 'openai/gpt-4o',
  messages: [{ role: 'user', content: 'List 3 programming languages.' }],
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'languages',
      strict: true,
      schema: {
        type: 'object',
        properties: {
          languages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                year: { type: 'number' },
              },
              required: ['name', 'year'],
              additionalProperties: false,
            },
          },
        },
        required: ['languages'],
        additionalProperties: false,
      },
    },
  },
});
```

**Note:** `json_schema` with `strict: true` is not supported by all models. Anthropic models support `json_object` mode. Check provider support before using strict schemas.

### 5. Streaming

```ts
const stream = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages: [{ role: 'user', content: prompt }],
  stream: true,
});

for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta?.content;
  if (text) process.stdout.write(text);
}
```

### 6. Tool use / function calling

Standardised across providers through OpenRouter:

```ts
const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'search_skills',
      description: 'Search the skill library by keyword.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          limit: { type: 'number', description: 'Max results' },
        },
        required: ['query'],
      },
    },
  },
];

const response = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages: [{ role: 'user', content: 'Find skills about design systems' }],
  tools,
  tool_choice: 'auto',
});

const toolCall = response.choices[0].message.tool_calls?.[0];
if (toolCall) {
  const args = JSON.parse(toolCall.function.arguments);
  const result = await searchSkills(args.query, args.limit);

  // Feed result back to the model
  const followUp = await openai.chat.completions.create({
    model: 'anthropic/claude-sonnet-4',
    messages: [
      { role: 'user', content: 'Find skills about design systems' },
      response.choices[0].message,
      {
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      },
    ],
    tools,
  });
}
```

Use `:exacto` routing variant for best tool calling accuracy when reliability matters.

### 7. Embeddings

```ts
const embedding = await openai.embeddings.create({
  model: 'openai/text-embedding-3-small',
  input: 'Clean architecture separates concerns into layers.',
});

const vector = embedding.data[0].embedding;
// Store in your vector database for semantic search
```

### 8. Prompt caching

OpenRouter automatically enables prompt caching via sticky routing — requests with similar prompt prefixes route to the same provider endpoint, enabling provider-level caching. No code changes needed. For maximum cache hit rate:
- Keep system prompts stable (don't add timestamps or random IDs)
- Place cached content first (system prompt → cached context → dynamic content)
- Use the same model ID consistently (variant suffixes may affect routing)

---

## SDK Options

**Option 1: OpenAI SDK (recommended, most portable)** — change `baseURL` to `https://openrouter.ai/api/v1` and set `apiKey` to `OPENROUTER_API_KEY`. Switch away later with just a `baseURL` change.

**Option 2: @openrouter/sdk** — access OpenRouter-specific features (provider preferences, generation metadata).

**Option 3: @openrouter/ai-sdk-provider** — for projects already using the Vercel AI SDK (`ai` package). Use `createOpenRouter()` to create a provider.

```ts
// Option 1 — OpenAI SDK
import OpenAI from 'openai';
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});
const response = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages: [{ role: 'user', content: prompt }],
});
```

---

## Cost Management

### Pricing Model

OpenRouter uses pass-through pricing (you pay the provider's price) with a 5.5% markup on credit purchases. **BYOK (Bring Your Own Key):** Connect your own provider API keys for direct pricing. First 1M requests/month are free on BYOK.

### Tracking Costs

```ts
const response = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages,
});

const usage = response.usage;
console.log({
  promptTokens: usage?.prompt_tokens,
  completionTokens: usage?.completion_tokens,
  totalTokens: usage?.total_tokens,
});

// For detailed cost, check the generation ID via the API
// GET https://openrouter.ai/api/v1/generation?id={response.id}
```

### Cost Optimization Strategies

| Strategy | How |
|---|---|
| Use `:floor` for background tasks | Routes to cheapest available provider |
| Use `:free` for development | Zero cost, lower rate limits |
| Fallback to cheaper models | `models: ['claude-sonnet-4', 'gpt-4o-mini']` |
| BYOK for high-volume | Direct provider pricing, no markup |
| Monitor usage dashboard | OpenRouter dashboard shows per-model costs |

---

## Error Handling

| Status | Meaning | Strategy |
|---|---|---|
| 400 | Bad request (invalid params) | Fix the request. Don't retry. |
| 401 | Invalid API key | Configuration error. Fail hard. |
| 402 | Insufficient credits | Alert, top up credits, or switch to BYOK. Don't retry. |
| 408 | Request timeout | Retry once with a simpler prompt or smaller max_tokens. |
| 429 | Rate limited | Back off exponentially. Check `retry-after` header. |
| 502 | Provider error | OpenRouter auto-retries with fallback models if configured. |
| 503 | Provider unavailable | Same as 502 — fallback chain handles this transparently. |

```ts
import OpenAI from 'openai';

async function callWithRetry(
  openai: OpenAI,
  params: OpenAI.ChatCompletionCreateParamsNonStreaming,
  maxRetries = 2,
) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await openai.chat.completions.create(params);
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        if ([400, 401, 402].includes(error.status ?? 0)) throw error;
        if (error.status === 429 || (error.status ?? 0) >= 500) {
          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
            await new Promise((r) => setTimeout(r, delay));
            continue;
          }
        }
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## Multimodal

### Vision (Image Understanding)

```ts
const response = await openai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe this image.' },
        { type: 'image_url', image_url: { url: 'https://example.com/photo.jpg' } },
      ],
    },
  ],
});
```

### Image Generation

```ts
const image = await openai.images.generate({
  model: 'openai/dall-e-3',
  prompt: 'A ceramic coffee mug on a wooden desk, product photography',
  size: '1024x1024',
});
```

---

## Banned Patterns

- ❌ Hardcoding model names without fallbacks → define a fallback chain with 2–3 models from different providers
- ❌ Not using routing variants when speed or cost matters → use `:nitro` for user-facing, `:floor` for background, `:free` for development
- ❌ Sending PII without ZDR enabled → use `data_collection: 'deny'` when processing personal or sensitive data
- ❌ Not handling 402 (insufficient credits) → detect payment failures and alert, don't silently fail or retry forever
- ❌ Using auto router for tasks needing specific model capabilities → specify the model explicitly when you need extended thinking, specific tool calling, or a particular model's strengths
- ❌ Ignoring the `usage` field in responses → track token usage per feature for cost management
- ❌ Using `json_schema` strict mode without checking provider support → fall back to `json_object` mode for unsupported models

---

## Quality Gate

Before delivering an OpenRouter integration, verify:

- [ ] Fallback chain is configured with 2–3 models from different providers
- [ ] Routing variant is chosen appropriately (`:nitro` for speed, `:floor` for cost, default for balanced)
- [ ] Provider preferences are set if cost or latency ordering matters
- [ ] ZDR (`data_collection: 'deny'`) is enabled for PII or sensitive data
- [ ] Error handling covers 402 (credits), 429 (rate limit), and 5xx (provider errors)
- [ ] Structured output uses `json_object` or `json_schema` with schema validation on the response
- [ ] Token usage is logged per call for cost tracking
- [ ] Streaming is used for user-facing responses expected to take >1 second
- [ ] API key comes from environment variable (`OPENROUTER_API_KEY`), never hardcoded
- [ ] BYOK is evaluated for high-volume production workloads (cost savings)
- [ ] Tool use includes input validation before executing tool calls
- [ ] Model selection matches the task (don't use Opus-tier for classification)
