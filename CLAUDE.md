# AI Centre

Internal business tool for AI-assisted project generation. Users select an archetype (e.g. "presentation", "landing page", "dashboard"), get suggested skills, customize their selection, describe their idea, and download a generated project with skills + a tailored CLAUDE.md — ready to open in VS Code with Claude Code.

Also serves as a **skill library and marketplace** where users browse, search, and download individual skills.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) — strict TypeScript |
| Database | Neon (serverless Postgres) via Drizzle ORM |
| File Storage | Vercel Blob (generated project ZIPs, skill assets) |
| Auth | NextAuth.js — Google OAuth (organization work emails). Will migrate to Microsoft Entra ID later; abstracted behind NextAuth so the provider swap is isolated |
| Deployment | Vercel |
| Icons | Phosphor Icons (`@phosphor-icons/react`) |
| Font | Jost (Google Fonts via `next/font/google`) |
| Animation | Motion (`motion`) primary, GSAP (`gsap`) for complex sequences |
| Animation Assets | Rive (`@rive-app/react-canvas`) |
| Charts | Nivo (`@nivo/*`) — SVG-based, theme-aware data visualization |
| AI | Claude API (`@anthropic-ai/sdk`) for showcase page generation |

---

## Mandatory Skills

**Always read and follow these 4 skill files before any UI or frontend work.** They are the source of truth for architecture, styling, layout, and design quality.

1. **`frontend-architecture/SKILL.md`** — 7-layer architecture (Components → Widgets → Domain Objects → ACL → Screen Renderer → Slots), inline styles with CSS custom properties, grid system, TypeScript conventions
2. **`brand-design-system/SKILL.md`** — semantic color tokens (`var(--color-*)`), themes, Phosphor Icons, Jost typography, asset libraries (unDraw, Unsplash, Pexels, Rive)
3. **`app-layout/SKILL.md`** — shell layout patterns, responsive grid configs, navigation widgets. **This app uses Pattern B (TopBar Only with Mega Menus)** — no sidebar, all navigation lives in the top bar with mega menu dropdowns where navigation depth or content density warrants it
4. **`design-excellence/SKILL.md`** — 8px spacing system, visual hierarchy, alignment, negative space, squint test

---

## Key Conventions

### Styling
- **Inline styles with `var(--color-*)` semantic CSS variables.** No hardcoded hex colors in components.
- **No Tailwind utility classes** in component or widget JSX. CSS custom properties only.
- `data-theme` attribute on `<html>` controls theming.

### Theming
- **Implement Light + Night by default.** Dark and Legacy themes only when explicitly requested.
- All components use semantic variables — they automatically adapt when the theme changes.

### Architecture Layers
| Layer | Purpose | File naming |
|---|---|---|
| Component | Stateless, props-only, no data fetching | `PascalCase.tsx` |
| Widget | Self-contained UI + data hook, implements `RenderableWidget`, 4 size variants (XS/SM/MD/LG) | `PascalCaseWidget.tsx`, `PascalCase{Size}.tsx` |
| Data Hook | Widget's data fetching logic, returns domain objects | `useWidgetName.ts` |
| Domain Object | TypeScript class, zero framework deps, pure business logic | `PascalCase.ts` |
| ACL Mapper | One per entity, `toEntityName(raw) → DomainClass`, protects domain from API shape | `entity.mapper.ts` |
| Screen Config | Typed class, grid-based layout declaration | `PascalCase.screen.ts` |

### TypeScript
- Strict mode, no `any`
- `class` for domain objects and screen configs
- `interface` for structural contracts

### Responsive Design
- Mobile-first: `Responsive<T>` uses `default` as mobile, cascades through `sm` → `md` → `lg`
- Breakpoints: xs (0px), sm (640px), md (768px), lg (1024px)

### Spacing
- 8px base system: 4 (tight) / 8 (small) / 16 (medium) / 24 (large) / 32 (xlarge) / 48 (xxlarge)

### Icons
- Phosphor Icons: `regular` weight default, `fill` for active states, 20px default size
- Don't mix weights in the same context (e.g. toolbar)

---

## Project Structure

```
ai-centre/
├── CLAUDE.md
├── app-layout/SKILL.md
├── brand-design-system/SKILL.md
├── design-excellence/SKILL.md
├── frontend-architecture/SKILL.md
├── print-design/SKILL.md
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── layout.tsx                    # Root layout (theme init, font, TopBar shell)
│   │   ├── globals.css                   # Theme CSS variables ([data-theme] blocks), resets
│   │   ├── page.tsx                      # Home / dashboard
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── api/auth/[...nextauth]/route.ts
│   │   ├── skills/
│   │   │   ├── page.tsx                  # Skill library (browse/search)
│   │   │   └── [skillId]/
│   │   │       ├── page.tsx              # Skill detail/showcase page
│   │   │       └── edit/page.tsx         # Skill editor (draft/publish)
│   │   ├── archetypes/
│   │   │   ├── page.tsx                  # Archetype library
│   │   │   └── [archetypeId]/
│   │   │       ├── page.tsx              # Archetype detail
│   │   │       └── edit/page.tsx         # Archetype editor
│   │   ├── generate/
│   │   │   └── page.tsx                  # Project generation flow
│   │   └── admin/
│   │       └── page.tsx                  # Admin dashboard (audit, management)
│   ├── server/
│   │   ├── db/
│   │   │   ├── index.ts                  # Drizzle client (Neon connection)
│   │   │   ├── schema.ts                 # All table definitions
│   │   │   └── migrations/               # Drizzle Kit migrations
│   │   ├── actions/                      # Server Actions
│   │   │   ├── skills.ts
│   │   │   ├── archetypes.ts
│   │   │   ├── projects.ts
│   │   │   └── admin.ts
│   │   └── services/                     # Business logic
│   │       ├── skill-versioning.ts
│   │       ├── project-generator.ts
│   │       └── showcase-generator.ts
│   ├── domain/                           # Domain objects (TypeScript classes)
│   │   ├── Skill.ts
│   │   ├── SkillVersion.ts
│   │   ├── Archetype.ts
│   │   ├── ArchetypeVersion.ts
│   │   ├── User.ts
│   │   └── AuditEntry.ts
│   ├── acl/                              # API → Domain mappers
│   │   ├── skill.mapper.ts
│   │   ├── archetype.mapper.ts
│   │   └── user.mapper.ts
│   ├── widgets/                          # Self-contained UI + data
│   │   ├── SkillCardWidget/
│   │   ├── SkillEditorWidget/
│   │   ├── ArchetypePickerWidget/
│   │   ├── ProjectGeneratorWidget/
│   │   ├── TopNavWidget/
│   │   └── ThemeSwitcherWidget/
│   ├── components/                       # Stateless, reusable UI
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── SearchInput.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── screens/                          # Screen configs
│   │   ├── AppShell.screen.ts
│   │   ├── Dashboard.screen.ts
│   │   ├── SkillLibrary.screen.ts
│   │   ├── SkillDetail.screen.ts
│   │   └── ...
│   └── lib/                              # Utilities
│       ├── auth.ts                       # NextAuth config
│       ├── blob.ts                       # Vercel Blob helpers
│       └── utils.ts
├── drizzle.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── .env.local                            # DATABASE_URL, BLOB_READ_WRITE_TOKEN, etc.
```

---

## Database Schema (Drizzle ORM + Neon)

### users
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| email | text | unique |
| name | text | |
| avatarUrl | text | nullable |
| role | enum: admin, member | |
| createdAt | timestamp | |
| updatedAt | timestamp | |

### skills
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| slug | text | unique |
| title | text | |
| description | text | |
| authorId | uuid | FK → users |
| isOfficial | boolean | |
| currentPublishedVersionId | uuid | FK → skill_versions, nullable |
| currentDraftVersionId | uuid | FK → skill_versions, nullable |
| showcaseHtml | text | nullable, AI-generated detail page |
| showcaseGeneratedAt | timestamp | nullable |
| createdAt | timestamp | |
| updatedAt | timestamp | |

### skill_versions
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| skillId | uuid | FK → skills |
| version | text | semver (e.g. "1.2.0") |
| content | text | the SKILL.md markdown |
| status | enum: draft, published, archived | |
| publishedAt | timestamp | nullable |
| publishedById | uuid | FK → users, nullable |
| createdAt | timestamp | |

### archetypes
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| slug | text | unique |
| title | text | |
| description | text | |
| authorId | uuid | FK → users |
| isOfficial | boolean | |
| currentPublishedVersionId | uuid | FK → archetype_versions, nullable |
| currentDraftVersionId | uuid | FK → archetype_versions, nullable |
| suggestedSkillIds | jsonb | array of skill UUIDs |
| createdAt | timestamp | |
| updatedAt | timestamp | |

### archetype_versions
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| archetypeId | uuid | FK → archetypes |
| version | text | semver |
| content | jsonb | archetype config: name, description, suggested skills, prompts |
| status | enum: draft, published, archived | |
| publishedAt | timestamp | nullable |
| publishedById | uuid | FK → users, nullable |
| createdAt | timestamp | |

### audit_log
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| entityType | enum: skill, archetype | |
| entityId | uuid | |
| action | enum: created, updated, published, archived, deleted | |
| userId | uuid | FK → users |
| metadata | jsonb | diff, version numbers, context |
| createdAt | timestamp | |

### generated_projects
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| userId | uuid | FK → users |
| archetypeId | uuid | FK → archetypes, nullable |
| skillIds | jsonb | array of skill UUIDs |
| prompt | text | user's idea description |
| blobUrl | text | Vercel Blob URL for the ZIP |
| createdAt | timestamp | |

---

## Key Features

### Skill Library & Marketplace
- Browse and search skills with filters (official/community, category, tags)
- Each skill has a rich showcase page (auto-generated on publish/update)
- Download individual skills as SKILL.md files

### Skill Detail / "Skill in Practice" Page
Every skill has a dedicated detail page with two views:
1. **"Skill in Practice" (default)** — a rich, generated guide that demonstrates the skill's capabilities with visual examples, usage patterns, code snippets, and practical how-to sections. This is not just the raw markdown — it's a structured showcase designed to help users understand what the skill does and how to use it effectively. Generated via Claude API when a skill is published or updated. Stored in `skills.showcaseHtml`.
2. **"View SKILL.md" (toggle)** — a button at the top of the page lets users switch to the raw rendered markdown for the full specification.
- Both views include download button and version info

### Versioning (Skills & Archetypes)
- Create → starts as draft (v0.1.0)
- Edit draft freely (no new version record per edit)
- Publish → creates immutable published version, increments version number
- Further edits after publish create a new draft on top of published
- Publish again → new version number
- Audit log captures every state transition with user, timestamp, and metadata

### Archetypes
- Official and user-created, same versioning model as skills
- Each archetype suggests a set of skills (stored as `suggestedSkillIds`)
- Users can add/remove skills from the suggestion before generating a project

### Project Generation Flow
1. User selects an archetype (or starts blank)
2. Archetype suggests skills → user adds/removes from selection
3. User describes their idea in free text
4. System generates: project scaffold + selected SKILL.md files + a tailored CLAUDE.md
5. Packaged as ZIP → stored in Vercel Blob → download link provided
6. User opens the project in VS Code and uses Claude Code to build

### Authentication
- NextAuth.js with Google OAuth provider
- Restricted to organization email domain
- Role-based: **admin** (manage official content, audit trail) and **member** (create, browse, download)
- JWT session strategy (serverless-friendly, no session table)

---

## Development

### Commands
```bash
npm run dev          # Next.js dev server
npm run build        # Production build
npm run db:generate  # Generate Drizzle migrations from schema changes
npm run db:migrate   # Run migrations against Neon
npm run db:studio    # Open Drizzle Studio for database browsing
```

### Environment Variables (.env.local)
```
DATABASE_URL=              # Neon connection string (postgres://...)
BLOB_READ_WRITE_TOKEN=     # Vercel Blob token
NEXTAUTH_SECRET=           # NextAuth encryption secret
NEXTAUTH_URL=              # App URL (http://localhost:3000 in dev)
GOOGLE_CLIENT_ID=          # Google OAuth client ID
GOOGLE_CLIENT_SECRET=      # Google OAuth client secret
ANTHROPIC_API_KEY=         # Claude API key for showcase page generation
```

### Server Actions vs API Routes
- **Server Actions** for all internal mutations (create/update/publish skills, generate projects, etc.)
- **API routes** only where external programmatic access is needed
