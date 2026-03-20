---
name: documentation-research
description: >
  How to research and apply library and framework documentation effectively.
  Covers when to look up docs vs answer from knowledge, research strategy,
  source hierarchy, refinement when the first lookup fails, and synthesising
  docs into contextual answers. Apply when the user asks about library APIs,
  framework configuration, migration between versions, or any question where
  current documentation matters more than training knowledge.
---

# Documentation Research

Find the right information from current documentation and apply it to the user's specific situation — training knowledge is a snapshot, so verify against live docs when accuracy matters.

---

## When to Use

Apply this skill when:
- The user asks about a specific library API, configuration, or setup
- The answer depends on a library version that may have changed since training
- The user is debugging an issue that might be caused by an API change
- The user names a framework or library and asks how to use it
- You are uncertain whether your training knowledge reflects the current API

Do NOT use this skill for:
- Stable language features (JavaScript/TypeScript syntax, CSS properties, HTML elements)
- Architectural or design questions answered by project skills (clean-architecture, frontend-architecture, etc.)
- General programming concepts (data structures, algorithms, patterns)

---

## Core Rules

### 1. Understand the goal before researching

The user asked a question, but the question may not point directly at what they need. Before looking anything up, understand what they're trying to accomplish.

"How do I configure Next.js middleware?" → they want to intercept requests (probably for auth). The middleware docs are relevant, but so is the matcher config, the edge runtime constraint, and the cookie API.

Research the goal, not just the literal question.

### 2. Decide: look up or answer from knowledge

Not every question needs a docs lookup. Stable, well-established APIs can be answered from training knowledge. Evolving or version-specific APIs need verification.

| Situation | Action |
|---|---|
| Stable API, unchanged for years (`Array.map`, CSS Grid, `JSON.parse`) | Answer from knowledge |
| Core library concept, unlikely to change (`React hooks rules`, `async/await semantics`) | Answer from knowledge, note the version if relevant |
| Specific API surface that may have changed (`Next.js 16 config`, `Drizzle ORM schema API`) | Look up current docs |
| New or recently released feature | Always look up — training data may predate it |
| User reports behaviour that contradicts your knowledge | Look up — the API probably changed |
| Version-specific question ("How does X work in v4?") | Look up the specific version's docs |
| Debugging "it doesn't work" with a recent library | Look up — check changelog for breaking changes |

### 3. Use a source hierarchy

When sources conflict, trust in this order:

1. **Official documentation** (docs site, API reference) — the canonical source
2. **Official changelog / migration guide** — explains what changed and why
3. **GitHub repository** (README, source code, issues) — ground truth for behaviour
4. **Official blog posts / announcements** — context for changes
5. **Training knowledge** — useful for stable concepts, risky for evolving APIs
6. **Community content** (Stack Overflow, blog posts, tutorials) — may be outdated, verify against official sources

### 4. Check changelogs for version-sensitive questions

When the user's question involves a specific version, or when their code "should work" but doesn't, the changelog is often more useful than the reference docs. Migration guides explain what broke and how to fix it.

Look for:
- `CHANGELOG.md` in the repository
- Migration guide in the docs (e.g. "Upgrading from v15 to v16")
- Release notes on GitHub
- "What's new in X" blog posts from the maintainers

### 5. Synthesise for the user's context, don't paste docs

Raw documentation answers a generic question. The user has a specific codebase, a specific stack, and a specific goal. Your job is to bridge the gap.

- Extract only the relevant part of the docs
- Adapt code examples to match the user's project conventions (naming, style, architecture)
- Note gotchas specific to their setup ("Since you're using App Router, the Pages Router pattern in the docs won't apply")
- If the docs show multiple approaches, recommend the one that fits their context and explain why

### 6. Limit lookup effort, then state uncertainty

If the answer isn't clear after 3 lookup attempts, say so. Don't keep searching in circles. State what you found, what's uncertain, and suggest the user check a specific source.

```
I found the general pattern in the Next.js docs, but the specific
behaviour for edge middleware with streaming responses isn't documented
clearly. Based on what I found, here's my best understanding: [answer].
I'd recommend checking the Next.js GitHub discussions for edge cases.
```

Honest uncertainty is more useful than a confident wrong answer.

---

## Research Strategy

### The lookup workflow

```
1. Understand the user's goal (not just the literal question)
        ↓
2. Decide: can I answer from knowledge, or do I need current docs?
        ↓
3. If lookup needed: identify the library and the specific question
        ↓
4. Resolve the documentation source (Context7, official docs site, GitHub)
        ↓
5. Query with the user's specific question — be precise
        ↓
6. If the answer is found: synthesise for the user's context
   If not found: refine the query or try a different source
        ↓
7. Deliver the answer with relevant code examples adapted to their project
```

### Using Context7 (live docs MCP)

When the Context7 MCP is available, use it as the primary docs lookup tool:

1. **Resolve the library ID** — call `resolve-library-id` with the library name and the user's question
2. **Select the best match** — prefer official sources, highest benchmark score, version-specific IDs when the user mentions a version
3. **Query the docs** — call `query-docs` with the resolved library ID and the specific question
4. **Synthesise** — don't return raw docs; extract and adapt for the user's context

Maximum 3 MCP calls per question. If Context7 doesn't have the answer, fall back to training knowledge with a note about uncertainty.

**Security:** Never include API keys, tokens, passwords, or other secrets in queries sent to external services. Sanitise the user's question if it contains sensitive values.

### When the first lookup doesn't help

| Problem | Refinement strategy |
|---|---|
| Too broad, returned generic overview | Narrow the query to the specific API method or config option |
| Wrong version's docs returned | Specify version in the query, or look for version-specific library ID |
| Feature isn't in the docs (too new or undocumented) | Check GitHub issues, PRs, or source code directly |
| Docs describe the API but not the user's use case | Look for examples, tutorials, or the "Guides" section instead of API reference |
| Conflicting information across sources | Trust the source hierarchy; check the changelog for what changed |
| The feature was deprecated or removed | Check the migration guide for the recommended replacement |

---

## Version Awareness

Libraries change. The version matters.

- When the user mentions a version ("Next.js 16", "Drizzle 0.30"), target that version specifically
- When the user doesn't mention a version, check what version is in their `package.json` and target that
- When docs show a pattern that differs from the user's existing code, check if it's a version difference before suggesting changes
- Flag breaking changes: "This API changed in v16. Your project uses v15, so the older pattern applies."

---

## Banned Patterns

- ❌ Answering version-specific questions from training knowledge without verifying → look up current docs for evolving APIs
- ❌ Pasting raw documentation without adapting to the user's context → synthesise, extract the relevant part, adapt examples
- ❌ Recommending an API pattern without checking if it matches the user's version → verify version compatibility
- ❌ Continuing to search after 3 failed lookups → state uncertainty, share what you found, suggest where to look
- ❌ Sending secrets (API keys, tokens, credentials) in documentation queries → sanitise before querying
- ❌ Trusting community blog posts over official docs when they conflict → follow the source hierarchy
- ❌ Looking up stable, well-known APIs that haven't changed → answer from knowledge, save the lookup for what matters
- ❌ Returning a generic docs answer when the user asked about a specific use case → bridge the gap between docs and their situation

---

## Quality Gate

Before delivering a docs-informed answer, verify:

- [ ] The user's actual goal is understood (not just the surface question)
- [ ] The answer is based on docs matching the user's library version
- [ ] Code examples are adapted to the user's project conventions (naming, style, architecture)
- [ ] If multiple approaches exist, one is recommended with reasoning for why it fits their context
- [ ] Gotchas specific to their setup are noted
- [ ] If the answer is uncertain, uncertainty is stated with a pointer to where they can verify
- [ ] No secrets or sensitive data were sent in lookup queries
- [ ] The source is trustworthy (official docs or changelog, not outdated community content)
