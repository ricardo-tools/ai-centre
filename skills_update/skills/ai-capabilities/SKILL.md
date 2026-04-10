---
name: ai-capabilities
description: >
  AI capabilities landscape — what exists, when to use each capability, and how
  to make good integration decisions. Technology-agnostic principles for text,
  image, video, audio, embeddings, agents, and more. Implementation details live
  in companion skills (ai-claude, ai-openrouter, ai-fal).
---

# AI Capabilities

A decision framework for integrating AI into applications. Covers the full capability landscape, maturity levels, cost profiles, and composition patterns — without tying you to a specific provider or SDK. Use this skill to decide *what* AI can do for your feature; use companion skills for *how* to implement it.

---

## When to Use

Apply this skill when:
- Evaluating whether a feature should use AI at all
- Choosing which AI capability fits a problem (generation, extraction, classification, etc.)
- Designing a multi-step AI pipeline (document processing, meeting intelligence, content creation)
- Making model-size and cost trade-offs
- Deciding between prompting, RAG, and fine-tuning
- Setting up quality gates, fallbacks, and human review for AI outputs

Do NOT use this skill for:
- SDK-specific implementation — see **ai-claude** (Anthropic SDK), **ai-openrouter** (OpenRouter gateway), **ai-fal** (fal.ai media generation)
- Where AI service code lives in the project — see **clean-architecture** (it's an infrastructure service called by use cases)

---

## Capability Map

Quick-reference for the 14 major AI capability categories.

| # | Capability | Maturity | Typical Cost | Latency | When to Use | When NOT to Use |
|---|---|---|---|---|---|---|
| 1 | **Text generation** | Production | $0.25–$15 / 1M tokens | 1–60s | Content creation, summarisation, rewriting, Q&A | Deterministic logic, exact calculations |
| 2 | **Image generation** | Production | $0.01–$0.10 / image | 2–30s | Illustrations, concepts, thumbnails, placeholders | Pixel-perfect brand assets, logos |
| 3 | **Speech-to-text** | Production | $0.006 / min | Near real-time | Transcription, meeting notes, accessibility | Already-accurate text sources |
| 4 | **Text-to-speech** | Production | $0.015 / 1K chars | 1–5s | Voiceover, accessibility, notifications | When human voice quality is critical |
| 5 | **Vision / image understanding** | Production | $0.25–$5 / 1M tokens | 1–10s | OCR, document parsing, image analysis, visual QA | Sub-pixel measurement, medical diagnosis |
| 6 | **Video generation** | Partial | $0.05–$1.00 / clip | 30s–5min | Short clips, product demos, social content | Long-form video, precise lip sync |
| 7 | **Audio / music generation** | Partial | $0.01–$0.50 / clip | 5–60s | Background music, sound effects, ambient audio | Mastered production music |
| 8 | **Embeddings / search** | Production | $0.02–$0.13 / 1M tokens | <100ms | Semantic search, similarity, clustering, RAG retrieval | Exact keyword match, boolean filters |
| 9 | **Structured data extraction** | Production | $0.25–$5 / 1M tokens | 1–10s | Parsing invoices, forms, emails into structured data | Already-structured data (CSV, database) |
| 10 | **Code generation** | Production | $0.25–$15 / 1M tokens | 2–60s | Scaffolding, boilerplate, refactoring, test generation | Safety-critical systems without human review |
| 11 | **Agents / workflows** | Partial | Variable | 10s–10min | Multi-step tasks, research, tool-using workflows | Simple single-step tasks (use direct calls) |
| 12 | **Moderation / safety** | Production | $0.01–$0.50 / 1M tokens | <1s | Content filtering, PII detection, policy enforcement | Legal compliance (needs human review too) |
| 13 | **Fine-tuning** | Partial | $3–$25 / 1M training tokens | Hours | Domain-specific style, format, or vocabulary | Before trying prompting + RAG first |
| 14 | **Multimodal** | Partial | Variable | Variable | Pipelines combining text + image + audio | When a single capability suffices |

**Maturity levels:**
- **Production** — reliable, well-documented, predictable costs, multiple providers
- **Partial** — works well for common cases, edge cases exist, fewer providers, costs less predictable
- **Experimental** — impressive demos, not yet reliable for production use

---

## Core Rules

### 1. Know the capability map

Before proposing an AI feature, check the capability map above. Match your problem to the right capability category. Many "AI features" are actually combinations of 2–3 capabilities (e.g., meeting intelligence = speech-to-text + text generation + structured extraction).

### 2. Start with prompting, then RAG, then fine-tuning

Each step is an order of magnitude more effort:

| Approach | Effort | When |
|---|---|---|
| **Prompting** | Hours | Task can be described in instructions + examples |
| **RAG** (retrieval-augmented generation) | Days | Model needs access to your specific knowledge/data |
| **Fine-tuning** | Weeks | Model needs to learn a specific style, format, or domain vocabulary that prompting can't capture |

Most tasks don't need fine-tuning. Most knowledge injection doesn't need fine-tuning — use RAG. Start at the top and only move down when you've proven the simpler approach is insufficient.

### 3. Use the smallest model that works

Measure quality first, then optimise cost. Always try the cheapest model before assuming you need the most expensive one.

```
Haiku / GPT-4o-mini / Gemini Flash  →  classification, extraction, tagging
Sonnet / GPT-4o / Gemini Pro        →  generation, summarisation, analysis
Opus / o1 / Gemini Ultra            →  complex reasoning, architecture, research
```

If the cheaper model achieves 90%+ of the quality you need, use it. The cost difference between tiers is typically 5–20x.

### 4. AI calls are infrastructure, not business logic

The AI service is an external dependency — like a database or email provider. It lives behind an interface, called by use cases. The domain layer works with validated domain objects, not raw LLM output.

```
Use Case → AI Service Interface → AI Provider Implementation
                                        ↓
                              Anthropic / OpenRouter / fal.ai
```

The use case decides *what* to generate; the service decides *how* to call the API. This lets you swap providers, add fallbacks, and test without hitting real APIs.

### 5. Design for failure

Every AI call can fail, hallucinate, or return unexpected output. Plan for it:

- **Validate outputs with schemas.** Parse JSON responses with Zod or equivalent. Never trust raw text as structured data.
- **Set timeouts.** AI calls can hang. 30–120 seconds depending on the task.
- **Have fallbacks.** Cheaper model, cached response, graceful degradation, or human review queue.
- **Retry with backoff.** Rate limits (429) and overload (529/503) are normal. Exponential backoff with jitter.

### 6. Cache aggressively

Identical prompts, embeddings, and generated assets should be cached:

- **Prompt caching** (provider-level) — saves up to 90% on repeated prefixes. Most providers support this.
- **Response caching** (application-level) — if the same input produces the same output, cache the result.
- **Embedding caching** — embeddings for the same text don't change. Cache them in your database.
- **Asset caching** — generated images, audio, and video should be stored (Blob storage), not regenerated.

### 7. Measure everything

Track these metrics per capability and per feature:

| Metric | Why |
|---|---|
| **Latency** (p50, p95) | User experience, timeout tuning |
| **Cost** (per call, per feature, per user) | Budget management, optimisation targeting |
| **Quality** (human eval or LLM-as-judge) | Detect regressions, compare models |
| **Failure rate** (errors, timeouts, validation failures) | Reliability, fallback triggering |
| **Token usage** (input, output, cached) | Cost breakdown, prompt optimisation |

Without metrics you can't optimise. Without cost tracking you get surprise bills.

### 8. Human-in-the-loop by default

Start with human review of AI outputs. Remove the human only when you've proven quality is sufficient via evaluations:

```
Phase 1: AI generates → human reviews → human approves/edits → output delivered
Phase 2: AI generates → automated eval scores → human reviews failures → output delivered
Phase 3: AI generates → automated eval scores → output delivered (human spot-checks)
```

Each phase requires evidence that the previous phase's quality is sufficient.

### 9. Don't send what you don't need

Minimise tokens sent to external APIs. This reduces cost AND improves quality — long contexts make models work harder to find relevant information.

- **Strip irrelevant context.** Send the specific document section, not the whole document.
- **Truncate.** If you only need the first 1000 words analysed, don't send 10,000.
- **Summarise.** For very large inputs, summarise first, then work with the summary.
- **System prompt for stable context, user message for dynamic.** System prompts are cacheable; structure accordingly.

### 10. Capabilities compose

Multimodal workflows chain capabilities together. Each step's error rate compounds — a 95% reliable step chained 4 times gives 81% end-to-end reliability.

Design pipelines with validation between steps:

```
Audio file
  → Speech-to-text (transcription)
  → Validate: is the transcript non-empty and coherent?
  → Text generation (summarisation)
  → Validate: does the summary cover key topics?
  → Structured extraction (action items, decisions)
  → Validate: schema check on extracted data
  → Output: structured meeting notes
```

Each validation step catches failures early before they propagate.

---

## Common Workflow Patterns

### Document Processing
```
Upload → Vision/OCR (extract text) → Structured extraction (parse fields)
       → Embeddings (index for search) → Text generation (summarise)
```
**Key decision:** Use vision models for scanned/image documents. Use text extraction for digital PDFs. Don't OCR what's already text.

### Meeting Intelligence
```
Audio → Speech-to-text → Text generation (summarise, extract action items)
      → Structured extraction (participants, decisions, deadlines)
      → Embeddings (searchable meeting archive)
```
**Key decision:** Real-time transcription needs streaming STT. Post-meeting processing can use batch.

### Content Creation
```
Brief → Text generation (draft) → Human review → Image generation (visuals)
      → Text-to-speech (audio version) → Video generation (promotional clip)
```
**Key decision:** Human review belongs after the first draft, not after every step. Generate visuals from the approved text.

### Customer Support
```
Message → Classification (intent, urgency) → Knowledge retrieval (RAG)
        → Text generation (draft response) → Moderation (safety check)
        → Human review (if low confidence) → Delivery
```
**Key decision:** Classification and moderation should use fast, cheap models. Response generation can use a more capable model.

---

## Anti-Patterns by Capability

### Text Generation
- Using AI to format data that has a deterministic format (dates, currencies, addresses)
- Generating text without a clear audience and purpose in the prompt
- Not setting max_tokens — letting the model ramble

### Image Generation
- Expecting pixel-perfect text rendering in generated images
- Using generation for brand assets that need exact specifications
- Not specifying aspect ratio for the intended use

### Embeddings / Search
- Re-embedding unchanged documents on every query
- Using embeddings for exact match (use database queries)
- Choosing embedding dimensions without measuring recall

### Agents / Workflows
- Giving agents unrestricted tool access (principle of least privilege)
- Not setting iteration limits on agent loops
- Agents for simple tasks that a single API call would handle

### Structured Extraction
- Trusting extracted data without schema validation
- Extracting from AI-generated text (compound errors)
- Not providing examples in the extraction prompt

---

## Banned Patterns

- ❌ Using AI for deterministic logic (adding numbers, sorting, formatting dates) → use code for deterministic operations
- ❌ Skipping validation on AI outputs → always validate structured output with a schema and check generated content before delivery
- ❌ Single model for all tasks → match the model to the task complexity (Haiku for classification, Sonnet for generation, Opus for reasoning)
- ❌ Sending full context when a subset suffices → strip, truncate, or summarise; less input = lower cost + better quality
- ❌ Fine-tuning before trying prompting + RAG → prove prompting is insufficient first; most tasks don't need fine-tuning
- ❌ No cost tracking → track token usage and costs per feature to avoid surprise bills
- ❌ Trusting AI for authoritative answers without grounding → ground responses in retrieved documents (RAG) or validate against known data
- ❌ Chaining unreliable steps without validation between them → add output validation between each pipeline step

---

## Quality Gate

Before delivering an AI-powered feature, verify:

- [ ] The right capability category was chosen for the problem (not forcing text generation where extraction is needed, etc.)
- [ ] The simplest approach was tried first (prompting before RAG before fine-tuning)
- [ ] The smallest sufficient model was selected (not defaulting to the most expensive)
- [ ] AI calls go through an infrastructure service behind an interface, not directly from domain/UI code
- [ ] All AI outputs are validated (schema for structured data, human review for content)
- [ ] Failure modes are handled: timeouts, rate limits, hallucination, unexpected format
- [ ] Fallbacks exist: cheaper model, cached response, or graceful degradation
- [ ] Caching is implemented for repeated prompts, embeddings, and generated assets
- [ ] Metrics are tracked: latency, cost, quality, failure rate per capability
- [ ] Human review is in place (or there's evidence from evaluations that it's not needed)
- [ ] Token usage is minimised: only relevant context is sent
- [ ] Multi-step pipelines have validation between each step
- [ ] Cost is estimated and budgeted per feature before launch
