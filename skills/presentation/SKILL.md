---
name: presentation
description: >
  Presentation strategy, narrative design, copy craft, and visual composition.
  Apply when planning or building any presentation — slide decks, keynotes,
  training materials, board briefings. Covers the 7-phase planning process,
  headline writing by presentation type, composition patterns, and art direction.
  For HTML/PPTX technical implementation, see presentation-html-implementation.
---

# Presentation

Every presentation is its own world — not an instance of a template. You analyse the audience, craft a narrative arc, plan every slide as an intentional composition, write purposeful copy, and design visuals that make the idea land.

Always pair with **brand-design-system** and **design-foundations**.

---

## When to Use

Apply this skill when:
- Planning a presentation of any type (keynote, training, pitch, briefing, workshop)
- Writing slide headlines and body copy
- Designing slide composition and visual hierarchy
- Choosing narrative structure for a specific audience
- Reviewing a presentation before delivery

Do NOT use this skill for:
- HTML/CSS/JS implementation of the presentation — see **presentation-html-implementation**
- PPTX export specifics — see **pptx-export**
- Colour tokens or typography specs — see **brand-design-system**

---

## Core Rules

### 1. Plan before you build

80% strategy, 20% production. Seven phases, in order. No code before Phase 5.

### 2. Every presentation is unique

No two presentations should look alike. No shared slide type system, no reusable layout renderer. Every slide's composition is designed from scratch for that specific purpose in that specific narrative. A health research briefing feels fundamentally different from a product launch.

### 3. Headlines carry the presentation

If someone reads only the headlines in sequence, they should understand the full argument (persuasion), be able to follow the procedure (training), or see the insight (reporting). Headlines are complete sentences, not labels.

### 4. One focal point per slide

Every slide has exactly one thing the eye sees first. If the answer to "what's most important?" is ambiguous, the slide has a hierarchy problem.

### 5. Accent colour is meaning, not decoration

The accent colour should feel native to the topic. Warm amber for coffee. Slack purple for Slack. Corporate blue for a board deck. For brand presentations, use brand orange per the design system. Use accent sparingly — for the one thing that needs emphasis.

---

## The 7-Phase Planning Process

### Phase 0: Discovery

**Mandatory.** Confirm with the user before any planning:

1. **Presentation type** — training, pitch, keynote, board briefing, workshop, status update, retrospective, onboarding?
2. **Audience** — who are they, what do they know, what do they need?
3. **Tone** — instructional, inspirational, analytical, conversational, persuasive, technical?
4. **Depth** — overview, step-by-step walkthrough, or deep-dive reference?
5. **Brand context** — ezyCollect/Sidetrade (use brand system) or topic-native (free art direction)?

### Phase 1: Audience & Purpose

Define the desired transformation — what should the audience think, feel, or do differently after this presentation? What is at stake? For persuasion: the presenter is the mentor, the audience is the hero. For knowledge transfer: the presenter is the guide, the audience is the practitioner.

### Phase 2: Core Message & Narrative

**One sentence.** If you can't say it in one sentence, you're not ready.

Choose a narrative structure that matches the type:

**Persuasion structures:** Contrast Pattern (what is vs could be), Situation-Complication-Resolution, Problem-Agitation-Solution, Before-After-Bridge, Monroe's Motivated Sequence.

**Knowledge transfer structures:** Concept-Demo-Config-Gotchas-Practice, Overview-Prerequisites-Steps-Troubleshoot-Support, Context-Demo-Hands On-Debrief, What-So What-Now What, What Happened-Why-Lessons-Actions.

**Build the ghost deck** — write every slide's headline as a complete sentence. Read them in sequence. Does the argument build? Could someone follow the procedure?

### Phase 3: Art Direction

Establish the visual language unique to this presentation's topic and audience. Mood, colour strategy, typography tone, background texture, visual metaphor system. Light theme is always default.

### Phase 4: Slide-by-Slide Blueprint

For every slide define: purpose, governing thought (headline), focal point, composition, visual weight, exact copy, and transition role.

### Phase 5: Execution

Now you write code. See **presentation-html-implementation** for the technical patterns.

### Phase 6: Design Review

Review every slide against **design-foundations**: hierarchy, consistency, alignment, inline element handling, negative space, pacing. Fix issues before delivering.

---

## Copy Craft

### Headlines By Type

| Type | Headline job | Example |
|---|---|---|
| **Persuasion** | Assertion (not label) | "Customer satisfaction dropped 15% after the redesign" not "Customer Satisfaction" |
| **Training** | Instructional signpost | "Configure the trigger threshold in Settings > AutoNegotiate" not "Configuration" |
| **Implementation** | Action step | "Connect via the REST endpoint" not "API Integration" |
| **Reporting** | Insight | "Q2 exceeded target by 12%, driven by enterprise upsells" not "Q2 Revenue" |

**Headline tests:** Persuasion → "so what?" test. Training → "could I follow this?" test. Reporting → "what changed?" test. All → specificity test (contains a name, number, or concrete detail).

### The Billboard Test

If someone saw the slide for 3 seconds at 65mph, would they get the point? One idea per slide. Large text (18px+ body, 32px+ headlines). Max 3–4 bullets under 12 words each.

### Specificity Creates Credibility

- "Significant growth" → "12% to 31% market share in 18 months"
- "Configure the settings" → "Set max_instalments to 6 in the Guardrails tab"

### Persuasion: Emotion Before Logic

Story or emotional moment → data that validates → proposed action.

### Knowledge Transfer: Clarity Before Completeness

Context → demo → steps in order → pitfalls → safety net. The audience leaves competent, not just inspired.

---

## Visual Composition

No rigid slide types. Each slide is composed for its specific content and role.

### Composition Patterns

**Universal:** Hero number, split, before/after, timeline, horizontal bars, numbered cards, icon rows, three-step flow, left-bar quote, centred quote, asymmetric title, full-accent divider.

**Training & implementation:** Annotated UI mockup, step-by-step procedure, code/endpoint reference, config table, gotcha/warning callout, tip card, decision tree, FAQ pairs, hands-on prompt, terminal output, comparison matrix.

Every composition gets its own CSS (`.s0-wrap`, `.s3-bars`). Never reuse layout classes across slides.

### Negative Space

Title slides: 60–70% empty. Content: 30–40%. Quote: 50–60%. Breathing slides: 80%+. A slide that feels "too empty" to the creator usually looks "just right" to the audience.

### Pacing

Vary visual density, emotional tone, colour intensity, and content type between slides. After every 3–4 dense slides, include a breathing moment.

### Data on Slides

Every chart needs a headline that states the insight. Highlight what matters (grey out the rest). Big numbers deserve big treatment (48px+). Max 3–4 data points per slide.

---

## Logo Placement

**Branded presentations:** Rectangle logo prominent on first and last slides (~160px). Square logo as subtle watermark (~32px, 60–70% opacity) on every other slide. Theme-aware (colour on light, white on dark).

**Non-branded:** Same pattern if user provides a logo. Footer title as brand anchor if no logo.

---

## Standards

- Complete Phase 0 (discovery) before any code; confirm type, audience, tone, depth, and brand. Not: skipping Phase 0
- Write headlines as complete sentences that carry the argument. Not: headlines as labels ("Configuration", "Q2 Revenue")
- Give each slide its own CSS composition. Not: shared layout classes across slides
- Vary composition between consecutive slides. Not: two consecutive slides with the same layout
- Keep to one idea per slide with max 4 bullets under 12 words each. Not: more than 4 bullets per slide or bullets over 12 words
- Use accent colour for emphasis only, native to the topic. Not: accent colour as decoration
- Build a narrative arc (setup, tension, resolution) where every slide advances the story. Not: missing narrative arc
- Include breathing slides after every 3-4 dense slides. Not: consecutive dense slides without a breathing moment
- Place logos prominently on first/last slides with watermark on every other. Not: inconsistent logo placement
- Complete Phase 6 design review to verify hierarchy, consistency, and alignment across all slides. Not: delivering without design review

---

## Quality Gate

Before delivering, verify:

**Strategy:**
- [ ] Phase 0 discovery completed — type, audience, tone, depth, brand confirmed
- [ ] Core message is one sentence
- [ ] Narrative structure matches the presentation type
- [ ] Ghost deck (headlines only) tells the complete story
- [ ] Opening hooks — no generic title slide
- [ ] Closing is actionable — clear next step

**Copy:**
- [ ] Headlines match type (assertions / signposts / insights)
- [ ] Headlines pass the appropriate test (so what? / could I follow? / what changed?)
- [ ] Max 3–4 bullets per slide, under 12 words each
- [ ] Specific — numbers, paths, field names, concrete details
- [ ] One idea per slide

**Visual:**
- [ ] One focal point per slide
- [ ] Squint test passes
- [ ] Billboard test passes (readable in 3 seconds)
- [ ] Negative space is intentional
- [ ] No two consecutive slides share the same composition
- [ ] Art direction matches topic and audience
- [ ] Logo: prominent on first/last, watermark on all others
- [ ] Phase 6 design review completed
