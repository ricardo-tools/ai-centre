# Visual/Design Vibe Plan Chapter Template

> For design-forward projects: presentations, brochures, posters, brand assets, social graphics, pitch decks. Adds design-specific gates to the vibe methodology.

---

## Visual Methodology

One chapter = one visual deliverable. The chapter's "Deliver" line is the spec.

```
FOR EACH CHAPTER:

  1. DRAFT    Rough layout and content structure.
              Establish: visual hierarchy, grid, colour palette, typography.
              Use low-fidelity — boxes, placeholder text, rough composition.
              Ref: design-foundations skill (Gestalt, hierarchy, spacing).
              Ref: brand-design-system skill (colours, fonts, logos).
  ┄┄┄┄┄┄┄┄
  CHECKPOINT  Share layout with user. Ask:
              - Does the structure communicate the right hierarchy?
              - Any sections to add, remove, or reorder?

  2. REVIEW   User gives feedback on layout and direction.
              Listen for: hierarchy issues, brand misalignment, missing content,
              spatial balance, readability concerns.
              Summarise feedback as concrete changes.

  3. REFINE   Apply feedback. Build to full fidelity.
              Polish: typography, spacing, colour consistency, alignment.
              Apply: brand tokens, image selection, icon choices.
              Check: contrast ratios, visual rhythm, whitespace balance.
              Ref: creative-toolkit skill (illustration, photography, charts).
              Ref: interaction-motion skill (if animated/interactive).
  ┄┄┄┄┄┄┄┄
  CHECKPOINT  Share refined version. Ask:
              - Ready to ship, or another round?

  4. DELIVER  Finalise and export.
              Format for target: HTML, PDF, PPTX, PNG, print-ready.
              If presentation: apply slide transitions, speaker notes.
              If print: check bleed, trim, safe zones. Ref: print-design skill.
              If PPTX: validate export fidelity. Ref: pptx-export skill.
              Generate variants if needed (light/dark, sizes, formats).

  LOG         Update LOG.md with: what was delivered, design decisions, feedback applied.
```

---

## Chapter Header

> **Fill per-chapter.** Every chapter starts with this block.

```markdown
# Chapter N: [Title]

**Status:** Not started | In progress | Complete
**Deliver:** [One sentence — what the user gets after this chapter]

## Brief

[What this piece needs to communicate visually]

## Visual Direction

| Format | [e.g. 16:9 slides, A4 portrait, 1080x1080 social] |
| Style | [e.g. minimal with bold type, data-heavy with charts, photo-led] |
| Palette | [Brand primary, or specify custom direction] |
| Typography | [Brand default, or specify hierarchy] |

## Content Outline

1. [Section/slide 1 — what it communicates]
2. [Section/slide 2 — what it communicates]
3. [...]

## Assets Required

- [Logo files, brand assets]
- [Photography / illustrations needed]
- [Data / charts to visualise]
- [Icons needed]

## Constraints

- [Brand guidelines]
- [Accessibility requirements (contrast, font size)]
- [Print specs if applicable]
- [File size / format restrictions]
```

---

## When NOT to Use

- Pure text/copy projects → use `plan-template-vibe.md`
- Code projects → use `plan-template-dev.md`
- If the project has BOTH code and visual design → use dev template with design audit gates
