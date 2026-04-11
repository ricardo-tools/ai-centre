# Plan 01: Vercel-Deployed Showcase Previews

**Status:** Complete
**Created:** 2026-04-10
**Completed:**
**Depends on:** None

---

## Scope

Replace StackBlitz WebContainer embedding with Vercel API deployments for ZIP showcase projects. Users upload a Next.js ZIP, we deploy it to Vercel once, and serve the live deployment in an iframe — instant load for every viewer.

## Context

ZIP/Next.js showcases currently use `@stackblitz/sdk` to boot a WebContainer in the viewer's browser. Every view triggers a full `npm install` + `next dev` (~20-30s). Research confirmed no caching exists across sessions — StackBlitz SDK, WebContainers API, Sandpack/Nodebox all reinstall from scratch. The only path to instant previews is to build once and serve from a live URL. Vercel's Deployments API lets us deploy user projects under a dedicated project, with access restricted to our app. HTML showcases remain unchanged.

---

## Decisions

### D1: Deploy via Vercel Deployments API to a dedicated project

**Decision:** Use `POST /v13/deployments` to deploy each ZIP showcase under a dedicated Vercel project (`ai-centre-showcases`), separate from the main app.
**Rationale:** Vercel handles the Next.js build natively, unlimited deployments on Pro, zero infrastructure to manage, cost isolated to a project with no env vars exposed to user code.
**Consequence:** New env var `VERCEL_SHOWCASE_TOKEN` on the main app. Build minutes (6K/month Pro) are the constraint.

### D2: Security via Edge Middleware + dynamic CSP

**Decision:** Two-layer access control — Edge Middleware on the showcase project validates a short-lived JWT from query params, and sets `frame-ancestors` CSP header dynamically based on `ALLOWED_ORIGINS` env var.
**Rationale:** Middleware + CSP is defense-in-depth for an internal tool. JWT blocks programmatic access, CSP blocks direct browser visits outside the iframe.
**Consequence:** Main app generates signed URLs for iframes. Showcase project contains middleware that reads env vars.

### D3: Build once on upload, rebuild only on update

**Decision:** Deploy at upload time, store deployment URL in DB. Re-deploy only when the user uploads a new ZIP version.
**Rationale:** Viewers should never wait for a build. Cost is one build per upload, not per view.
**Consequence:** Upload is async — returns immediately, status tracked via polling until Vercel build completes.

### D4: Remove StackBlitz dependency

**Decision:** Remove `@stackblitz/sdk` and `jszip`. Remove IndexedDB cache, WebContainer boot logic, StackBlitzFullscreen component.
**Rationale:** No longer needed — ZIP projects become iframes to Vercel URLs, same as HTML projects to Blob URLs.
**Consequence:** Viewer widget simplifies. Client bundle shrinks.

### D5: Async deploy with status tracking

**Decision:** Upload returns after file storage. Deploy status (`pending | building | ready | failed`) and deploy URL tracked in DB. Viewer polls until ready.
**Rationale:** Vercel builds take 30-120s. Blocking the upload response is bad UX.
**Consequence:** DB migration adds `deploy_status` and `deploy_url` columns.

### D6: Single Vercel project, two environments

**Decision:** One showcase project with Production and Development environments. Prod uploads deploy with `target: "production"`, local dev uploads deploy with `target: "development"`. Per-environment env vars (`ALLOWED_ORIGINS`, `JWT_SECRET`) handle differences.
**Rationale:** Simpler than two projects. Vercel natively supports per-environment env vars. Middleware reads env vars to set CSP dynamically.
**Consequence:** Local dev creates real Development deployments on Vercel — fully testable end-to-end from localhost.

---

## Chapters

Every chapter is a vertical slice delivering one testable increment.

| Ch | Name | Tier | User can | Status |
|---|---|---|---|---|
| 0 | DB Schema + Deploy Module | Foundation | Verify new columns in DB; deploy module calls Vercel API | **Done** |
| 1 | Deploy on Upload | New Capability | Upload a ZIP and see Vercel deploy triggered, URL in DB | **Done** |
| 2 | Showcase Project Template | New Capability | Verify showcase project has middleware + CSP headers | **Done** |
| 3 | JWT Token Generation | New Capability | Verify signed iframe URLs are generated for deployed showcases | **Done** |
| 4 | Iframe Viewer for ZIP | New Capability | Click a ZIP showcase → instant iframe load | **Done** |
| 5 | Build Status Polling | Extension | See "Deploying..." after upload, auto-redirect when ready | **Done** |
| 6 | Deploy Status in Viewer | Extension | See pending/failed/ready states when viewing a showcase | **Done** |
| 7 | Re-deploy on Update | Extension | Update a showcase ZIP → new deploy, old one deleted | **Done** |
| 8 | Delete Cleanup | Extension | Delete showcase → Vercel deployment also removed | **Done** |
| 9 | Remove StackBlitz | Extension | StackBlitz/JSZip gone from bundle | **Done** |
| 10 | Migrate Existing Showcases | Extension | Old ZIP showcases work via lazy deploy on first view | **Done** |
| C | Closing | — | — | **Done** |

### Chapter 0: DB Schema + Deploy Module
> [ch0-db-schema-deploy-module.md](ch0-db-schema-deploy-module.md)

**Tier:** Foundation
**User can:** Verify new columns exist via Drizzle Studio. Run deploy module in isolation against Vercel API.

Migration adds `deploy_status` (text, default `'pending'`) and `deploy_url` (text, nullable) to `showcase_uploads`. New `src/platform/lib/vercel-deploy.ts` wraps the Vercel API: `deployProject(files, target)` and `deleteDeployment(id)`. New env var `VERCEL_SHOWCASE_TOKEN`.

### Chapter 1: Deploy on Upload
> [ch1-deploy-on-upload.md](ch1-deploy-on-upload.md)

**Tier:** New Capability
**User can:** Upload a ZIP showcase and check DB to see deploy_status change from `pending` → `building` → `ready` with a deploy_url.

Wire `uploadShowcase` action: after file storage, extract ZIP, call `deployProject()`, update DB with deployment ID and status. Deploy is fire-and-forget — upload response returns immediately.

### Chapter 2: Showcase Project Template
> [ch2-showcase-project-template.md](ch2-showcase-project-template.md)

**Tier:** New Capability
**User can:** Visit a deployment URL directly and get blocked. Visit via iframe from allowed origin and see it load.

Create template files injected into every deployment: `middleware.ts` (validates JWT from `?token=` param, sets `frame-ancestors` from `ALLOWED_ORIGINS` env var). Document one-time Vercel project setup steps.

### Chapter 3: JWT Token Generation
> [ch3-jwt-token-generation.md](ch3-jwt-token-generation.md)

**Tier:** New Capability
**User can:** Call a utility and get back a deploy URL with a signed `?token=` param that the middleware accepts.

New `src/platform/lib/showcase-token.ts` — `signShowcaseUrl(deployUrl)` generates a 5-minute JWT using a shared secret, appends as query param.

### Chapter 4: Iframe Viewer for ZIP
> [ch4-iframe-viewer-zip.md](ch4-iframe-viewer-zip.md)

**Tier:** New Capability
**User can:** Click a ZIP showcase in the gallery and see the deployed project load instantly in an iframe. Fullscreen works.

Update `ShowcaseViewerWidget`: if `fileType === 'zip'` and `deployStatus === 'ready'`, render iframe with `src={signShowcaseUrl(deployUrl)}`. Fullscreen uses same pattern (second iframe in portal).

### Chapter 5: Build Status Polling
> [ch5-build-status-polling.md](ch5-build-status-polling.md)

**Tier:** Extension
**User can:** See "Deploying your project..." with progress after uploading a ZIP, then get redirected when ready.

After upload, redirect to `/gallery/{id}`. Page polls `fetchShowcaseById` every 3s while `deployStatus === 'building'`. Server action checks Vercel deployment status API and updates DB. When ready, iframe appears.

### Chapter 6: Deploy Status in Viewer
> [ch6-deploy-status-viewer.md](ch6-deploy-status-viewer.md)

**Tier:** Extension
**User can:** See clear UI for each state — spinner for pending, error + retry button for failed, iframe for ready.

ShowcaseViewerWidget renders different states based on `deployStatus`. Failed state shows error + "Retry Deploy" button that re-triggers deployment.

### Chapter 7: Re-deploy on Update
> [ch7-redeploy-on-update.md](ch7-redeploy-on-update.md)

**Tier:** Extension
**User can:** Upload a new ZIP version → old deployment deleted, new one created, status resets to building.

`updateShowcase` action: if new ZIP provided, call `deleteDeployment(oldId)`, then `deployProject(newFiles)`. Set `deploy_status = 'building'`, clear `deploy_url`.

### Chapter 8: Delete Cleanup
> [ch8-delete-cleanup.md](ch8-delete-cleanup.md)

**Tier:** Extension
**User can:** Delete a showcase and confirm no orphaned Vercel deployment remains.

`deleteShowcase` action: after DB delete, call `deleteDeployment(deploymentId)`. Fire-and-forget with error logging.

### Chapter 9: Remove StackBlitz
> [ch9-remove-stackblitz.md](ch9-remove-stackblitz.md)

**Tier:** Extension
**User can:** Confirm StackBlitz/JSZip no longer in client bundle (check build output size).

Remove `@stackblitz/sdk`, `jszip` from `package.json`. Remove IndexedDB cache functions, WebContainer boot effect, `StackBlitzFullscreen`, loading phase overlay, phase types from `ShowcaseViewerWidget`.

### Chapter 10: Migrate Existing Showcases
> [ch10-migrate-existing.md](ch10-migrate-existing.md)

**Tier:** Extension
**User can:** Open an existing pre-migration ZIP showcase and see it deploy on demand, then load via iframe on subsequent visits.

Lazy migration: viewer detects `deployStatus === null` (pre-migration), triggers deploy, shows "Building..." UI. Once ready, all future views are instant.

### Closing
> [chC-closing.md](chC-closing.md)

Update PROJECT_REFERENCE.md, update LOG.md, validate both against the codebase. Pure documentation — no code changes.

---

## Dependency Graph

```
Ch 0 (DB + Module) [F] ──→ Ch 1 (Deploy on Upload) [NC] ──→ Ch 5 (Build Polling) [E]
                       │                                 ──→ Ch 7 (Re-deploy) [E]
                       │                                 ──→ Ch 8 (Delete Cleanup) [E]
                       │
                       ├──→ Ch 2 (Project Template) [NC] ─┐
                       ├──→ Ch 3 (JWT Generation) [NC] ───┤
                       │                                   │
                       │                Ch 1 + Ch 2 + Ch 3 ┘
                       │                        │
                       │                        v
                       │               Ch 4 (Iframe Viewer) [NC] ──→ Ch 6 (Status UI) [E]
                       │                                         ──→ Ch 9 (Remove StackBlitz) [E]
                       │
                       │                              Ch 9 ──→ Ch 10 (Migrate Existing) [E]
```

**Track A (upload pipeline):** Ch 0 → Ch 1 → Ch 5, Ch 7, Ch 8
**Track B (viewer pipeline):** Ch 0 → Ch 2 + Ch 3 → Ch 4 → Ch 6, Ch 9 → Ch 10
**Merge point:** Ch 4 requires Ch 1 + Ch 2 + Ch 3

---

## E2E Journey

```gherkin
Rule: ZIP showcases deploy to Vercel and load instantly in the gallery

  Background:
    Given a logged-in user with showcase:upload permission
    And a valid Next.js project ZIP file

  Scenario: Upload, deploy, and view a ZIP showcase

    # -- Ch 0 adds: --
    Then the showcase_uploads table has deploy_status and deploy_url columns
    And the vercel-deploy module can create and delete deployments

    # -- Ch 1 adds: --
    When the user uploads the ZIP via the gallery upload form
    Then the showcase is stored with deploy_status "building"
    And the Vercel Deployments API is called with the extracted files

    # -- Ch 2 adds: --
    Then the deployment includes middleware that validates JWT tokens
    And the deployment sets frame-ancestors dynamically from ALLOWED_ORIGINS

    # -- Ch 3 adds: --
    Then the main app generates signed URLs with short-lived JWT tokens

    # -- Ch 4 adds: --
    When the user navigates to the showcase viewer
    Then the deployed project loads instantly in a secured iframe
    And fullscreen renders the same deploy URL

    # -- Ch 5 adds: --
    When the user waits on the gallery page after upload
    Then it shows "Deploying..." and polls until deploy_status is "ready"

    # -- Ch 6 adds: --
    When viewing a showcase with deploy_status "failed"
    Then the viewer shows an error message with a retry button

    # -- Ch 7 adds: --
    When the user updates the showcase with a new ZIP
    Then a new deployment is created and the old one is deleted

    # -- Ch 8 adds: --
    When the user deletes the showcase
    Then the Vercel deployment is also removed

    # -- Ch 9 adds: --
    Then @stackblitz/sdk and jszip are no longer in the client bundle

    # -- Ch 10 adds: --
    Given an existing pre-migration ZIP showcase with no deploy_status
    When a viewer opens it for the first time
    Then it is deployed on demand and shows "Building..." until ready
```

---

## Not in Scope

- HTML showcase changes (already work via Blob iframe)
- Self-hosting the Vercel build infrastructure
- Custom domains per individual showcase
- Live code editing in the gallery viewer
- Multi-page navigation within deployed showcases (Vercel handles this natively)
