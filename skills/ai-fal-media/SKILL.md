---
name: ai-fal-media
description: >
  Implementation skill for ai-capabilities. Generate images, videos, and audio
  using AI models via fal.ai MCP. Covers prompt craft, model discovery, iteration
  workflow, cost management, and quality evaluation. Apply when the user wants to
  generate, edit, or transform visual or audio media with AI. Requires fal.ai MCP
  server to be configured.
---

# AI Media Generation

Generate images, videos, and audio using fal.ai models. The skill teaches how to write effective prompts, discover the right model for the task, iterate cheaply, and evaluate quality — while using the MCP tools to actually produce the media.

Models change frequently. This skill does not hardcode model names. Use the MCP `search` and `find` tools to discover current models for each task.

---

## When to Use

Apply this skill when:
- The user wants to generate images from text descriptions
- Creating video from text prompts or source images
- Generating speech, sound effects, or music
- Editing or transforming existing images (style transfer, inpainting, upscaling)
- Creating thumbnails, hero images, or visual assets for a project

Do NOT use this skill for:
- Manual image editing (Figma, Photoshop workflows)
- Stock photography selection
- Video editing of existing footage without AI generation

---

## Core Rules

### 1. Discover models, don't hardcode them

Models are released and deprecated constantly. Always use the MCP tools to find the current best model for the task.

```
# Find models for the task
search(query: "fast text to image")          → for quick iteration
search(query: "high quality text to image")  → for production output
search(query: "text to video")               → for video generation
search(query: "text to speech")              → for voice generation
search(query: "image to video")              → for animating a still

# Get model details and parameters
find(model_name: "<model from search results>")
```

Always call `find` before `generate` — the parameter schema varies between models. Don't guess parameter names.

### 2. Iterate cheap, deliver expensive

Start with the fastest, cheapest model to get the prompt right. Switch to a higher-fidelity model only for the final output.

```
Iteration loop:
1. Write initial prompt
2. Generate with the fastest model (search: "fast text to image")
3. Evaluate output — is it close to what's needed?
4. Refine the prompt (see Prompt Craft below)
5. Repeat 2–4 until the composition and content are right
6. Generate final version with the highest quality model
```

Use `estimate_cost` before expensive generations (video, high-fidelity image models):

```
estimate_cost(model_name: "<model>", input: { ... })
```

### 3. The prompt is the most important input

The same model with a good prompt vs a bad prompt produces dramatically different results. Spend time on the prompt, not on finding the "right" model. See Prompt Craft sections below.

### 4. Use seeds for reproducibility

When iterating, set a `seed` value. This makes the output deterministic for the same prompt + seed combination, so you can isolate the effect of prompt changes from random variation.

Change the seed only when you want a different composition. Keep the seed stable when you're refining the prompt.

### 5. Check the output before delivering

AI-generated media can contain artifacts, inconsistencies, or unintended content. Always review before presenting to the user:
- **Images:** Check hands, text rendering, faces, symmetry, background coherence
- **Video:** Check temporal consistency (objects don't morph between frames), motion smoothness, lip sync if applicable
- **Audio:** Check pronunciation, pacing, background noise, abrupt cuts

---

## Prompt Craft: Images

### Structure

A good image prompt has four parts:

```
[Subject] + [Style/Medium] + [Composition/Framing] + [Lighting/Mood]

Example:
"A ceramic coffee mug on a wooden desk,
 product photography style,
 close-up shot with shallow depth of field,
 warm morning light from the left"
```

### What makes prompts effective

| Principle | Example |
|---|---|
| **Be specific about the subject** | "A golden retriever puppy" not "a dog" |
| **Name the visual style** | "oil painting", "3D render", "product photography", "watercolour", "cinematic still" |
| **Describe composition** | "close-up", "aerial view", "symmetrical", "rule of thirds", "negative space on the right" |
| **Describe lighting** | "studio lighting", "golden hour", "dramatic side lighting", "soft overcast" |
| **Describe mood** | "serene", "energetic", "moody", "clinical", "warm and inviting" |
| **Mention what NOT to include** | Some models support negative prompts — "no text", "no watermark", "no people" |

### Common mistakes

- ❌ Vague prompts ("a nice landscape") → too much left to chance
- ❌ Contradictory instructions ("photorealistic watercolour painting") → pick one style
- ❌ Too many subjects ("a dog, cat, bird, fish, and horse in a garden") → models struggle with complex multi-subject scenes
- ❌ Ignoring aspect ratio → choose the ratio that fits the composition (landscape for scenery, portrait for people, square for products)

---

## Prompt Craft: Video

Video prompts need everything image prompts need, plus temporal information — what moves, how the camera behaves, and what changes over time.

### Structure

```
[Scene description] + [Motion/Action] + [Camera movement] + [Duration context]

Example:
"A coffee mug on a desk with steam rising,
 camera slowly orbits around the mug,
 warm morning light shifts as the camera moves,
 gentle and smooth movement"
```

### Video-specific guidance

| Principle | Example |
|---|---|
| **Describe motion explicitly** | "waves crash against rocks" not "ocean scene" |
| **Specify camera movement** | "slow dolly forward", "static wide shot", "handheld tracking shot" |
| **Keep it simple** | One primary action per generation. Complex multi-action scenes degrade quality. |
| **Image-to-video for control** | Generate or provide a starting frame, then animate it. More controlled than pure text-to-video. |

### Image-to-video workflow

For maximum control, generate in two steps:

```
1. Generate a still image with the exact composition you want
2. Upload that image
3. Use an image-to-video model to animate it with motion prompts

upload(file_path: "/path/to/generated-image.png")
→ get uploaded URL

generate(
  model_name: "<image-to-video model from search>",
  input: {
    "prompt": "camera slowly zooms out, gentle wind moves the trees",
    "image_url": "<uploaded URL>",
    "duration": "5s"
  }
)
```

---

## Prompt Craft: Audio

### Speech

- Specify tone and pacing: "calm and conversational", "energetic and upbeat", "formal newsreader style"
- Keep text segments short — long passages may lose consistency
- If the model supports speaker selection, try multiple speakers and pick the best fit

### Sound effects and music

- Describe the sound, not the source: "deep rumbling bass with metallic clanging" not just "factory sounds"
- For music, specify genre, tempo, mood, and instruments: "upbeat electronic, 120 BPM, synth leads with a driving bass line"
- For ambient audio, layer descriptions: "light rain on a window, distant thunder, muffled city traffic"

---

## MCP Tool Reference

The fal.ai MCP provides these tools:

| Tool | Purpose | When to use |
|---|---|---|
| `search` | Find models by capability | First step — discover what's available for the task |
| `find` | Get model details and parameter schema | Before calling `generate` — know what parameters the model accepts |
| `generate` | Run a model with inputs | The actual generation call |
| `result` | Check async generation status | For long-running generations (video) — poll for completion |
| `status` | Check job status | Same as result — check if a generation is still running |
| `cancel` | Cancel a running job | If you started a wrong generation |
| `estimate_cost` | Get cost estimate before generating | Before expensive operations (video, high-fidelity) |
| `upload` | Upload a file for use as input | For image-to-video, style transfer, or any model that takes image/video input |
| `models` | List popular models | Browse what's available without a specific search query |

### Typical workflow

```
1. search(query: "text to image fast")           → find available models
2. find(model_name: "<chosen model>")             → get parameter schema
3. estimate_cost(model_name: "...", input: {...})  → check cost
4. generate(model_name: "...", input: {...})       → generate
5. result(request_id: "...")                       → get output (if async)
```

---

## When to Use AI Generation vs Alternatives

| Situation | Recommendation |
|---|---|
| Need a unique image matching a specific description | AI generation |
| Need a generic stock photo (handshake, office, cityscape) | Stock photography — faster, more predictable |
| Need pixel-perfect brand assets (logo, icon, specific typography) | Manual design tools (Figma, Illustrator) |
| Need a quick visual for a prototype or placeholder | AI generation (fast model) |
| Need video of a real product or person | Real video — AI generation hallucinates details |
| Need ambient music or sound effects | AI generation — effective for background audio |
| Need a specific voice reading specific text | AI speech generation — if voice quality suffices; professional VO if not |

---

## Standards

- Use `search` and `find` to discover current models before generating. Not: hardcoding model names without checking availability
- Iterate with the cheapest model first until the prompt is refined. Not: generating with an expensive model before the prompt is ready
- Call `find` to check the parameter schema before calling `generate`. Not: generating without knowing the model's parameters
- Estimate cost with `estimate_cost` before video or high-fidelity generations. Not: skipping cost estimation for expensive operations
- Review all AI-generated media for artifacts (hands, faces, text, temporal consistency) before delivery. Not: delivering without review
- Use the four-part prompt structure (subject + style + composition + lighting/mood). Not: vague one-line prompts
- Isolate variables by changing either the prompt or the seed, not both at once. Not: changing both simultaneously
- Use design tools for brand assets that need pixel-perfect precision. Not: AI generation for exact-specification assets

---

## Quality Gate

Before delivering generated media, verify:

- [ ] Model was discovered via `search`/`find`, not hardcoded from memory
- [ ] Prompt follows the structured format (subject + style + composition + lighting/mood)
- [ ] Iteration was done on a cheap model before generating the final version
- [ ] Cost was estimated before expensive generations
- [ ] Seed was used for reproducibility during iteration
- [ ] Output reviewed for artifacts (hands, faces, text, temporal consistency, audio quality)
- [ ] Aspect ratio matches the intended use (thumbnail, hero image, social media, etc.)
- [ ] Output format and resolution are appropriate for the delivery context
