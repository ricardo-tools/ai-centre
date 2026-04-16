# Vibe Plan Chapter Template

> For creative/content projects: social campaigns, blog posts, email sequences, copy, messaging, content strategy. Lighter than dev — no TDD, no strict gates.

---

## Creative Methodology

One chapter = one deliverable. The chapter's "Deliver" line is the spec.

```
FOR EACH CHAPTER:

  1. DRAFT    Produce the first version of the deliverable.
              Explore the brief, audience, tone. Get ideas down fast.
              Don't polish — capture intent, structure, and key messages.
  ┄┄┄┄┄┄┄┄
  CHECKPOINT  Share draft with user. Ask:
              - Does this capture the intent?
              - Anything missing or off-tone?

  2. REVIEW   User gives feedback on the draft.
              Listen for: tone mismatches, missing points, structural issues,
              audience misalignment.
              Summarise feedback as concrete changes.

  3. REFINE   Apply feedback. Polish copy, tighten structure, align tone.
              Check: consistent voice, clear call-to-action (if applicable),
              no filler, appropriate length.
  ┄┄┄┄┄┄┄┄
  CHECKPOINT  Share refined version. Ask:
              - Ready to ship, or another round?

  4. DELIVER  Finalise the deliverable.
              Format for the target medium (email, social, doc, slide).
              If applicable: generate variants (A/B headlines, platform-specific crops).

  LOG         Update LOG.md with: what was delivered, key decisions, feedback applied.
```

---

## Chapter Header

> **Fill per-chapter.** Every chapter starts with this block.

```markdown
# Chapter N: [Title]

**Status:** Not started | In progress | Complete
**Deliver:** [One sentence — what the user gets after this chapter]

## Brief

[What this piece needs to communicate, to whom, in what context]

## Audience & Tone

| Audience | [Who reads/sees this] |
| Tone | [e.g. professional but warm, bold and direct, playful] |
| Medium | [e.g. LinkedIn post, email sequence, landing page hero] |
| Length | [e.g. 150 words, 3 slides, 5-email drip] |

## Key Messages

1. [Primary message]
2. [Secondary message]
3. [Supporting point]

## Constraints

- [Brand guidelines to follow]
- [Words/phrases to avoid]
- [Compliance or legal requirements]
```

---

## When NOT to Use

- Projects that produce code, schema, or infrastructure → use `plan-template-dev.md`
- Projects that change CI, testing, or tooling → use `plan-template-tooling.md`
- Projects that mix code + content → use dev template, note content requirements in chapters
