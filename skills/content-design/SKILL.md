---
name: content-design
description: >
  How to write the words in a product — microcopy, error messages, empty states,
  button labels, confirmation dialogs, tooltips, and notifications. The words
  ARE the interface for most interactions. Apply when writing any user-facing
  text: labels, messages, instructions, statuses, or any string a user reads.
---

# Content Design

Every string a user reads is a design decision. The words in your product carry more weight than the layout, the colours, or the animations — because words are what users actually process when they need to understand, decide, or recover.

Good microcopy is invisible. The user reads "Saved" and moves on. Bad microcopy creates friction, confusion, or anxiety. "An error occurred" teaches nothing. "Operation failed: ERR_CONN_REFUSED" teaches fear.

---

## When to Use

Apply this skill when:
- Writing button labels, form labels, or navigation items
- Writing error messages, success messages, or warnings
- Writing empty states (no data, no results, first-time use)
- Writing confirmation dialogs for destructive or significant actions
- Writing loading states and progress indicators
- Writing tooltips, placeholders, or helper text
- Writing notifications (toasts, banners, alerts)
- Reviewing any user-facing text

Do NOT use this skill for:
- Marketing copy, landing pages, or long-form content
- Documentation or technical writing
- Typography and visual text styling — see **brand-design-system**

---

## Core Rules

### 1. Lead with what the user can do, not what went wrong

Users read UI text in a state of action — they're trying to accomplish something. The most useful text tells them what to do next, not what just happened.

```
// ✅ Leads with the action
"Sign in to continue"
"Add your first skill to get started"
"Try a different search term"

// ❌ Leads with the problem
"You are not authenticated"
"No skills exist in the database"
"Your query returned zero results"
```

### 2. Use the user's language, not the system's language

The user doesn't know what a "slug" is. They don't think in "entities" or "instances." They have skills, projects, and ideas.

```
// ✅ User language
"This skill has already been published"
"Your project is ready to download"
"We couldn't find any skills matching 'architecture'"

// ❌ System language
"Entity with status 'published' cannot be republished"
"Blob upload complete for generated_project record"
"Query for skill_versions returned empty resultset"
```

### 3. Be specific about what happened and what to do

Vague messages create anxiety. Specific messages create confidence. Every message that reports a problem should include: what happened, why (if knowable), and what to do next.

```
// ✅ Specific — user knows what happened and what to do
"Your session has expired. Sign in again to continue."
"This email domain isn't allowed. Use your @ezycollect.com.au address."
"The skill couldn't be published because the draft is empty. Add content first."

// ❌ Vague — user knows nothing
"An error occurred."
"Invalid input."
"Something went wrong. Please try again."
```

### 4. Match the tone to the moment

Not every message needs the same energy. The tone should match what the user is feeling at that moment.

| Moment | User feeling | Appropriate tone |
|---|---|---|
| Success | Accomplished, ready to move on | Brief, confirming. "Published — v1.0.0" |
| Progress | Waiting, slightly anxious | Reassuring, informative. "Generating your project..." |
| Error (recoverable) | Frustrated, needs guidance | Calm, helpful, specific. "Couldn't connect. Check your internet and try again." |
| Error (serious) | Alarmed, needs reassurance | Honest, empathetic, action-oriented. "We hit a problem saving your work. Your changes are safe locally — we'll retry automatically." |
| Destructive action | Cautious, wants confirmation | Clear, stakes-aware. "Delete this skill? Published versions will be removed from the library. This can't be undone." |
| Empty state | Lost, uncertain | Encouraging, directive. "No skills yet. Create your first one to get started." |
| First-time use | Curious, potentially overwhelmed | Welcoming, focused. "Welcome. Start by browsing skills or generating a project." |

### 5. Shorter is almost always better

Every word costs the user's attention. Cut ruthlessly.

```
// ✅ Concise
"Saved"
"Copied to clipboard"
"3 skills selected"
"Publish"

// ❌ Verbose
"Your changes have been saved successfully"
"The content has been copied to your clipboard"
"You have currently selected 3 skills"
"Publish this skill to the library"
```

The exception: error messages and destructive confirmations. These benefit from completeness because the user needs to understand before acting.

### 6. One message, one idea

Don't stack multiple instructions or statuses into one message. Each message should communicate one thing.

```
// ✅ One idea per message
"Skill published — v1.0.0"
Toast + "View in library" link

// ❌ Multiple ideas crammed in
"Your skill has been published as version 1.0.0 and is now visible in the skill library where other users can browse and download it. A showcase page will be generated shortly."
```

---

## Patterns

### Button Labels

Buttons should describe what happens when clicked. Use a verb (or verb + noun for clarity). Never use generic labels when specific ones work.

```
// ✅ Specific verb + noun
"Publish skill"
"Download ZIP"
"Generate project"
"Send code"          ← for OTP
"Sign in"

// ❌ Generic
"Submit"
"OK"
"Continue"           ← continue to what?
"Go"
"Click here"
```

**Destructive buttons** include the consequence: "Delete skill" not "Delete". "Remove from project" not "Remove".

**Loading state buttons** show what's happening: "Publishing..." / "Generating..." / "Sending...". Never disable with no explanation.

### Error Messages

Three parts: what happened + why + what to do.

```
// Format
[What happened]. [Why, if knowable]. [What to do next.]

// Examples
"Couldn't publish. The draft has no content. Add content and try again."
"Sign-in failed. This email domain isn't allowed. Use a @ezycollect.com.au or @sidetrade.com address."
"Upload failed — file is too large. Maximum size is 5 MB."
"Connection lost. Your changes are saved locally and will sync when you're back online."
```

**Never expose:** Stack traces, error codes without explanation, database errors, raw HTTP status codes, or internal field names.

**Never blame the user:** "Invalid input" implies they did something wrong. "This field needs a valid email address" guides them to fix it.

### Empty States

Empty states are opportunities, not dead ends. They answer: *why is this empty?* and *what should I do?*

```
// ✅ First-time empty — invite action
"No skills yet"
[Create your first skill] button

// ✅ Search empty — suggest adjustment
"No skills match 'xyzzy'"
"Try a different search term or browse all skills."

// ✅ Filtered empty — explain the filter
"No official skills in this category"
"Clear filters to see all skills."

// ❌ Dead-end empty
"No data"
"0 results"
"Nothing to display"
```

### Confirmation Dialogs

Use only for destructive or significant actions. The message should make the stakes clear.

```
// ✅ Clear stakes, specific consequence
Title: "Delete 'Clean Architecture'?"
Body: "This will remove the skill and all published versions from the library. Users who downloaded it won't be affected. This can't be undone."
Actions: [Cancel] [Delete skill]    ← destructive button names the action

// ❌ Generic confirmation
Title: "Are you sure?"
Body: "This action cannot be undone."
Actions: [No] [Yes]
```

**The hierarchy of confirmation:**
- Low stakes (draft save, preference change) → no confirmation, provide undo
- Medium stakes (publish, send) → brief confirmation with specific consequence
- High stakes (delete, revoke access) → full confirmation with typed input for critical cases

### Loading and Progress

Tell the user what's happening, not just that something is happening.

```
// ✅ Contextual loading
"Generating your project..."
"Publishing skill..."
"Loading showcase..."

// ❌ Generic loading
"Loading..."
"Please wait..."
[Spinner with no text]
```

For long operations (>5 seconds), add progress or phase indication: "Assembling files... (2 of 4)"

### Tooltips and Helper Text

Tooltips explain what something is. Helper text explains how to use it. Neither should be required to complete the primary task — they support, not substitute.

```
// ✅ Helper text under a field
"Slug" field → helper: "URL-friendly name. Lowercase letters, numbers, and hyphens only."

// ✅ Tooltip on an icon
Hover on archive icon → "Archive this version"

// ❌ Critical information hidden in a tooltip
"Enter your API key" [?] ← tooltip: "Find this in your account settings under Developer > API Keys"
(This should be a visible link, not a hidden tooltip)
```

### Notifications (Toasts)

```
// Success — brief, auto-dismiss (3-5s)
"Skill published — v1.0.0"
"Copied to clipboard"
"Project downloaded"

// Warning — persist 8-10s
"Your session expires in 5 minutes"
"This skill has unpublished changes"

// Error — persist until dismissed
"Couldn't save changes. Try again."
[Retry] [Dismiss]
```

---

## Banned Patterns

- ❌ "An error occurred" / "Something went wrong" without specifics → say what happened and what to do
- ❌ System language in user-facing text ("entity", "slug", "record", "instance") → use the user's vocabulary
- ❌ "Invalid input" / "Validation failed" → say which field and what's expected
- ❌ "Are you sure?" as the entire confirmation → state the specific consequence
- ❌ "Submit" / "OK" / "Yes" / "No" as button labels → use specific verbs that describe the action
- ❌ Empty states with just "No data" → explain why and suggest what to do next
- ❌ Error codes or stack traces in user-facing messages → translate to human language
- ❌ Spinners with no text → always say what's loading or happening
- ❌ Blaming the user ("You entered an invalid...") → guide them ("This field needs...")
- ❌ Multiple ideas in one message → one message, one idea

---

## Quality Gate

Before delivering, verify:

- [ ] Every error message includes what happened, why, and what to do next
- [ ] Every empty state invites action or suggests adjustment
- [ ] Every button label is a specific verb (or verb + noun), not "Submit" / "OK"
- [ ] Every confirmation dialog states the specific consequence, not just "Are you sure?"
- [ ] Loading states say what's happening, not just "Loading..."
- [ ] No system language in user-facing text (no "entity", "record", "slug", "null")
- [ ] No stack traces, error codes, or internal IDs visible to users
- [ ] Tone matches the moment (brief for success, specific for errors, encouraging for empty states)
- [ ] Every message can be understood without reading the surrounding UI
- [ ] Text is as short as possible while remaining specific
