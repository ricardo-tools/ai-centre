---
name: storage-vercel-blob
description: >
  Vercel Blob storage for file uploads, downloads, and management. Covers
  server action uploads, client uploads, access modes, file listing, deletion,
  size limits, and dev mode fallback. Implementation skill for the file-storage
  conceptual skill — read that first for storage design principles.
---

# Storage — Vercel Blob

Implementation skill for **file-storage**. Read that skill first for principles on file organization, access control, and storage lifecycle management.

---

## When to Use

Apply this skill when:
- Deploying on Vercel and need file storage (generated ZIPs, user uploads, assets)
- Files need to be served via CDN with public URLs
- The project requires simple blob storage without complex access policies
- Building with the AI Centre stack (generated project ZIPs)

Do NOT use this skill for:
- Supabase projects — use Supabase Storage instead (see **db-supabase**)
- Files requiring fine-grained per-user access policies (Vercel Blob is public by default)
- Large media transcoding or image transformation pipelines
- Database storage — see **db-neon-drizzle** or **db-supabase**

---

## Core Rules

### 1. Install and configure Vercel Blob

```bash
npm install @vercel/blob
```

Environment variable:

```
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxx...
```

This token is auto-provisioned when you add the Vercel Blob store in the Vercel dashboard. For local development, copy it from the Vercel dashboard to `.env.local`.

### 2. Upload files from Server Actions

The most common pattern. The server receives data and uploads it to blob storage.

```typescript
// src/server/actions/projects.ts
"use server";

import { put } from "@vercel/blob";

export async function uploadProjectZip(
  filename: string,
  zipBuffer: Buffer
): Promise<string> {
  const blob = await put(filename, zipBuffer, {
    access: "public",
    contentType: "application/zip",
    addRandomSuffix: true, // Prevents filename collisions
  });

  return blob.url;
}
```

The `put` function returns an object with:
- `url` — the public CDN URL
- `pathname` — the stored path
- `contentType` — the MIME type
- `contentDisposition` — the download filename

### 3. Upload files from the client

For user-initiated uploads (drag-and-drop, file picker), use the client upload pattern. This uploads directly from the browser to Vercel Blob, avoiding the server as a bottleneck.

**Step 1: Create a server-side token endpoint**

```typescript
// src/app/api/upload/route.ts
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody;

  const jsonResponse = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async (pathname) => {
      // Authenticate the user here
      // Return allowed content types and size limits
      return {
        allowedContentTypes: ["application/zip", "text/markdown", "image/png", "image/jpeg"],
        maximumSizeInBytes: 50 * 1024 * 1024, // 50 MB
      };
    },
    onUploadCompleted: async ({ blob }) => {
      // Called after upload completes
      // Save blob.url to database, send notification, etc.
      console.log("Upload complete:", blob.url);
    },
  });

  return NextResponse.json(jsonResponse);
}
```

**Step 2: Upload from the client**

```typescript
"use client";

import { upload } from "@vercel/blob/client";
import { useState } from "react";

export function FileUploader() {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      setUrl(blob.url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input type="file" onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
      {url && <p>Uploaded: <a href={url}>{url}</a></p>}
    </div>
  );
}
```

### 4. Access modes — public CDN

Vercel Blob currently supports **public access** only. All uploaded blobs get a public CDN URL that anyone with the URL can access.

```typescript
// Public upload (the only mode currently available)
const blob = await put("skills/export.zip", data, {
  access: "public",
});
// blob.url => "https://xxxxx.public.blob.vercel-storage.com/skills/export-abc123.zip"
```

**Note:** Private/signed URLs are not yet supported by Vercel Blob (as of early 2026). If you need access-controlled downloads:
- Use an API route as a proxy that checks auth before streaming the blob
- Or use a different storage provider (S3, Supabase Storage)

Proxy pattern for access control:

```typescript
// src/app/api/download/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Check auth
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Look up the blob URL from database
  const project = await getProject(params.id);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Fetch and stream the blob
  const response = await fetch(project.blobUrl);
  return new NextResponse(response.body, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${project.id}.zip"`,
    },
  });
}
```

### 5. File naming and URL structure

Vercel Blob URLs follow this pattern:

```
https://{store-id}.public.blob.vercel-storage.com/{pathname}
```

Best practices for pathnames:
- Use directory-like prefixes: `projects/`, `skills/`, `avatars/`
- Use `addRandomSuffix: true` to prevent collisions (appends a random hash)
- Keep filenames URL-safe (no spaces, special characters)

```typescript
// Good: organized paths with random suffix
await put(`projects/${userId}/${projectName}.zip`, data, {
  access: "public",
  addRandomSuffix: true,
});
// Result: projects/abc123/my-project-x7f9k2.zip

// Bad: flat, collision-prone
await put("file.zip", data, { access: "public" });
```

### 6. List and delete blobs

```typescript
import { list, del } from "@vercel/blob";

// List all blobs (paginated)
const { blobs, cursor, hasMore } = await list({
  prefix: "projects/",   // Optional: filter by prefix
  limit: 100,            // Max items per page
});

// List next page
if (hasMore && cursor) {
  const nextPage = await list({ prefix: "projects/", cursor });
}

// Delete a single blob by URL
await del(blobUrl);

// Delete multiple blobs
await del([blobUrl1, blobUrl2, blobUrl3]);
```

### 7. Size limits

| Limit | Value |
|---|---|
| Max file size (server upload) | 500 MB |
| Max file size (client upload) | 500 MB |
| Max blob store size (free tier) | 1 GB total |
| Max blob store size (Pro) | Varies by plan |

For files larger than 500 MB, use multipart upload or a different storage provider.

Enforce size limits on the server side:

```typescript
// In server action
export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;

  const MAX_SIZE = 50 * 1024 * 1024; // 50 MB
  if (file.size > MAX_SIZE) {
    throw new Error("File too large. Maximum size is 50 MB.");
  }

  // ... proceed with upload
}
```

### 8. Dev mode — local fallback when token is not set

In development without a `BLOB_READ_WRITE_TOKEN`, you can either:
- Use the actual Vercel Blob (recommended — the free tier works for dev)
- Fall back to local filesystem storage

```typescript
// src/lib/blob.ts
import { put as vercelPut, del as vercelDel, list as vercelList } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

const USE_LOCAL = !process.env.BLOB_READ_WRITE_TOKEN;
const LOCAL_BLOB_DIR = path.join(process.cwd(), ".blob-storage");

export async function putBlob(
  pathname: string,
  data: Buffer | ReadableStream | string,
  options: { contentType?: string }
): Promise<{ url: string }> {
  if (USE_LOCAL) {
    const filePath = path.join(LOCAL_BLOB_DIR, pathname);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, data as Buffer);
    return { url: `http://localhost:3000/api/local-blob/${pathname}` };
  }

  const blob = await vercelPut(pathname, data, {
    access: "public",
    contentType: options.contentType,
  });

  return { url: blob.url };
}

export async function deleteBlob(url: string): Promise<void> {
  if (USE_LOCAL) {
    // Extract pathname from local URL and delete file
    const pathname = url.replace("http://localhost:3000/api/local-blob/", "");
    const filePath = path.join(LOCAL_BLOB_DIR, pathname);
    await fs.unlink(filePath).catch(() => {}); // Ignore if not found
    return;
  }

  await vercelDel(url);
}
```

Add `.blob-storage/` to `.gitignore`.

### 9. Storing blob references in the database

Always store the blob URL in your database alongside metadata. Never rely on listing blobs as the source of truth.

```typescript
// Schema
export const generatedProjects = pgTable("generated_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  blobUrl: text("blob_url").notNull(),
  filename: text("filename").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Upload and save reference
export async function generateAndStoreProject(userId: string, zipBuffer: Buffer) {
  const filename = `projects/${userId}/${Date.now()}.zip`;

  const blob = await put(filename, zipBuffer, {
    access: "public",
    contentType: "application/zip",
    addRandomSuffix: true,
  });

  const [project] = await db
    .insert(generatedProjects)
    .values({
      userId,
      blobUrl: blob.url,
      filename: blob.pathname,
      sizeBytes: zipBuffer.length,
    })
    .returning();

  return project;
}
```

### 10. Cleanup — delete orphaned blobs

When database records are deleted, also delete the corresponding blobs. Implement this in your delete logic or as a periodic cleanup job.

```typescript
export async function deleteProject(projectId: string) {
  const project = await db.query.generatedProjects.findFirst({
    where: eq(generatedProjects.id, projectId),
  });

  if (!project) return;

  // Delete blob first, then database record
  await del(project.blobUrl);
  await db.delete(generatedProjects).where(eq(generatedProjects.id, projectId));
}
```

---

## Standards

- Always persist blob URLs in the database alongside metadata. Not: storing blob URLs only in memory or local state
- Check file size before uploading. Not: uploading without size validation
- Use `addRandomSuffix: true` unless you guarantee unique filenames. Not: `addRandomSuffix: false` without uniqueness guarantees (collisions overwrite silently)
- Treat all Vercel Blob URLs as public; use an access-control proxy for sensitive documents. Not: assuming private access
- Delete the blob when deleting its database record. Not: deleting database records without deleting the blob (orphaned blobs waste storage)
- Add `.blob-storage/` to `.gitignore`. Not: committing `.blob-storage/` to source control
- Always use the URL returned by `put()` for blob references. Not: hardcoding the blob store URL in application code

---

## Quality Gate

Before considering Vercel Blob integration complete:

- [ ] `@vercel/blob` installed and `BLOB_READ_WRITE_TOKEN` set in environment
- [ ] Server-side upload working with proper content type and random suffix
- [ ] Client upload working with `handleUpload` endpoint and auth check
- [ ] Blob URLs stored in database alongside metadata (size, type, owner)
- [ ] Size limits enforced before upload (both client and server)
- [ ] Delete logic removes both blob and database record
- [ ] Dev mode works (either with real Vercel Blob or local fallback)
- [ ] `.blob-storage/` added to `.gitignore` (if using local fallback)
- [ ] Access-control proxy in place for any blobs that should not be fully public
- [ ] No orphaned blobs — every blob has a corresponding database record

## References

- [Templates](references/templates.md) — storage.ts abstraction (local + Vercel Blob), upload API route, .env.local config
