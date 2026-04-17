---
name: storage-vercel-blob-templates
type: reference
companion_to: storage-vercel-blob
description: Copy-paste templates for file storage abstraction (local dev fallback + Vercel Blob in prod) and upload API route. Agent copies these into the user's project.
---

# File Storage Templates

> **Companion to [storage-vercel-blob](../SKILL.md).** Copy these templates into a bootstrapped project to get working file upload with local dev fallback.

---

## `src/lib/storage.ts` — Storage Abstraction

```typescript
import { existsSync, mkdirSync } from 'fs';
import { writeFile, unlink } from 'fs/promises';
import { join, resolve } from 'path';

// ── Types ────────────────────────────────────────────────────────────

export interface UploadOptions {
  /** Subdirectory under the storage root (e.g. 'avatars', 'documents') */
  folder?: string;
  /** Content type override */
  contentType?: string;
  /** Access mode for Vercel Blob (default: 'public') */
  access?: 'public' | 'private';
}

export interface UploadResult {
  url: string;
  pathname: string;
}

// ── Environment detection ────────────────────────────────────────────

function isVercelBlob(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

// ── Local filesystem (dev) ───────────────────────────────────────────

const UPLOADS_DIR = resolve(process.cwd(), 'public', 'uploads');

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

async function uploadLocal(
  name: string,
  data: Buffer | Uint8Array,
  options?: UploadOptions,
): Promise<UploadResult> {
  const folder = options?.folder || '';
  const dir = folder ? join(UPLOADS_DIR, folder) : UPLOADS_DIR;
  ensureDir(dir);

  const filename = `${Date.now()}-${name}`;
  const filepath = join(dir, filename);
  await writeFile(filepath, data);

  const pathname = folder ? `/uploads/${folder}/${filename}` : `/uploads/${filename}`;
  console.info('[storage] uploaded locally', { pathname });
  return { url: pathname, pathname };
}

async function deleteLocal(url: string): Promise<void> {
  if (!url.startsWith('/uploads/')) return;
  const filepath = join(resolve(process.cwd(), 'public'), url);
  try {
    await unlink(filepath);
    console.info('[storage] deleted locally', { url });
  } catch {
    console.warn('[storage] delete failed (file not found)', { url });
  }
}

// ── Vercel Blob (production) ─────────────────────────────────────────

async function uploadBlob(
  name: string,
  data: Buffer | Uint8Array | File,
  options?: UploadOptions,
): Promise<UploadResult> {
  const { put } = await import('@vercel/blob');
  const folder = options?.folder || '';
  const pathname = folder ? `${folder}/${Date.now()}-${name}` : `${Date.now()}-${name}`;

  const blob = await put(pathname, data, {
    access: options?.access || 'public',
    contentType: options?.contentType,
  });

  console.info('[storage] uploaded to Vercel Blob', { url: blob.url, pathname });
  return { url: blob.url, pathname: blob.pathname };
}

async function deleteBlob(url: string): Promise<void> {
  const { del } = await import('@vercel/blob');
  await del(url);
  console.info('[storage] deleted from Vercel Blob', { url });
}

// ── Public API ───────────────────────────────────────────────────────

/**
 * Upload a file. Routes to Vercel Blob (production) or local filesystem (dev)
 * based on BLOB_READ_WRITE_TOKEN env var.
 */
export async function uploadFile(
  name: string,
  data: Buffer | Uint8Array | File,
  options?: UploadOptions,
): Promise<UploadResult> {
  if (isVercelBlob()) {
    return uploadBlob(name, data, options);
  }
  // Convert File to Buffer for local storage
  const buffer = data instanceof File
    ? Buffer.from(await data.arrayBuffer())
    : Buffer.from(data);
  return uploadLocal(name, buffer, options);
}

/**
 * Delete a file. Routes based on URL pattern.
 */
export async function deleteFile(url: string): Promise<void> {
  if (url.startsWith('/uploads/')) {
    return deleteLocal(url);
  }
  return deleteBlob(url);
}
```

**Dependencies:**

```bash
npm install @vercel/blob
```

---

## `src/app/api/upload/route.ts` — Upload API Route

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { uploadFile } from '@/lib/storage';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/png', 'image/jpeg', 'image/webp', 'image/gif',
  'application/pdf',
  'text/plain', 'text/csv',
];

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB.` },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}` },
      { status: 400 },
    );
  }

  try {
    const result = await uploadFile(file.name, file, {
      folder: 'uploads',
      contentType: file.type,
    });

    return NextResponse.json({ url: result.url });
  } catch (err) {
    console.error('[upload] failed', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
```

---

## `.env.local` Additions

```bash
# ── File Storage ─────────────────────────
# Leave empty for local dev (files go to public/uploads/)
# Set for production (Vercel Blob):
# BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

---

## Usage Example

```typescript
import { uploadFile, deleteFile } from '@/lib/storage';

// Upload
const result = await uploadFile('profile.png', imageBuffer, {
  folder: 'avatars',
  contentType: 'image/png',
});
console.log(result.url); // /uploads/avatars/1234-profile.png (dev) or https://...blob.vercel-storage.com/... (prod)

// Delete
await deleteFile(result.url);
```

---

## `.gitignore` Addition

Add to the project's `.gitignore`:

```
public/uploads/
```
