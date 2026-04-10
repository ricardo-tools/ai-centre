---
name: file-storage
description: >
  Principles for file upload and storage — validation, storage tiers, access control,
  naming, image optimization, cleanup, cost management, and local development fallbacks.
---

# File Storage

## When to Use

Apply this skill when:

- The application accepts file uploads from users
- Storing, serving, or managing files (images, documents, exports)
- Implementing signed URL access control for private files
- Adding image optimization or responsive variants
- Building a storage abstraction for dev/prod transparency

## Do NOT use this skill for:

- Vercel Blob or S3 API specifics — use **storage-vercel-blob** or your provider-specific skill
- Database BLOB columns — this skill explicitly forbids them; use object storage

---

## Core Rules

### 1. Validate before storing.

Check file type (by content/magic bytes, not just extension), enforce size
limits, and scan for malware when handling untrusted uploads. Reject invalid
files at the edge — never store first and validate later.

```ts
const MAGIC_BYTES: Record<string, number[]> = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png':  [0x89, 0x50, 0x4e, 0x47],
  'application/pdf': [0x25, 0x50, 0x44, 0x46],
};

function detectMimeType(buffer: Uint8Array): string | null {
  for (const [mime, bytes] of Object.entries(MAGIC_BYTES)) {
    if (bytes.every((b, i) => buffer[i] === b)) return mime;
  }
  return null;
}
```

### 2. Separate storage from metadata.

File content goes in object storage (S3, Vercel Blob, GCS). File metadata
(name, type, size, owner, timestamps, access level) goes in the database. The
database record references the storage location, not the other way around.

### 3. Use the right storage tier.

Object storage for durable files. CDN for frequently-accessed public content.
Local filesystem only in development. Never use SQL database tables for binary
file content.

### 4. Default to private, grant access explicitly.

Files are private by default. Public files get a permanent CDN URL. Private
files use signed URLs with short TTLs (15–60 minutes). Auth-gated downloads
verify permissions before generating the signed URL.

### 5. File names must be collision-proof.

Use UUIDs, content hashes, or timestamped prefixes. Preserve the original
filename in metadata for display, but never use it as the storage key. Sanitize
all user-provided filenames.

### 6. Optimize images at upload time.

Generate responsive variants (thumbnail, medium, full) on upload or via
on-demand processing. Convert to efficient formats (WebP, AVIF with fallback).
Store the original as the archival copy. Serve the smallest variant that
satisfies the request.

### 7. Clean up orphaned files.

When the database record is deleted, the corresponding file must be deleted. Run
periodic garbage collection to catch orphans. Use TTL policies for temporary
files (upload staging, export downloads).

### 8. Cost = storage + bandwidth.

Storage is cheap; bandwidth is not. Use CDN caching to reduce origin bandwidth.
Set appropriate `Cache-Control` headers. Use lifecycle policies to move
infrequently-accessed files to cheaper storage tiers.

### 9. Dev mode uses local filesystem.

When cloud storage isn't configured (no credentials), fall back to a local
directory. The abstraction layer should make this transparent — same API,
different backend. Never require cloud credentials for local development.

```ts
interface StorageProvider {
  put(key: string, data: Buffer, mime: string): Promise<{ url: string }>;
  get(key: string): Promise<Buffer | null>;
  delete(key: string): Promise<void>;
}

// Choose provider based on available credentials
const storage: StorageProvider = process.env.BLOB_TOKEN
  ? new BlobStorage(process.env.BLOB_TOKEN)
  : new LocalStorage('./tmp/uploads');
```

### 10. Upload UX matters.

Show progress for large files. Support resumable uploads for files over 10MB.
Provide immediate feedback on validation failures. Display a preview before
confirming upload when possible.

---

## Storage Tier Comparison

| Tier | Use case | Access pattern | Cost profile |
|---|---|---|---|
| Object storage | User uploads, generated files, backups | Write once, read occasionally | Low storage, pay per request |
| CDN | Public assets, images, downloads | Read-heavy, globally distributed | Low latency, bandwidth costs |
| Local filesystem | Development only | Immediate, no network | Free, not durable |
| Database (metadata only) | File records, references, permissions | Queried with application data | Part of DB cost |

---

## Access Control Patterns

**Public files:** permanent URL, CDN-cached, no auth required.
Example: marketing assets, public profile images.

**Signed URLs:** time-limited URL generated server-side after permission check.
Example: user-uploaded documents, generated reports.

**Auth-gated proxy:** server fetches file from storage and streams to client after auth.
Example: sensitive documents where URL must not be shareable.

---

## Image Optimization

- **On upload:** generate thumbnail (200px), medium (800px), full (1600px).
- **Format:** WebP primary, AVIF where supported, JPEG/PNG as fallback.
- **Metadata:** strip EXIF data (privacy — GPS coordinates, device info).
- **Responsive serving:** use `srcset` or query parameters to serve appropriate size.
- **Lazy load:** images below the fold load on scroll, not on page load.

---

## Banned Patterns

- ❌ Storing files in SQL BLOB/BYTEA columns → use object storage
- ❌ User-provided filenames as storage keys → use UUIDs, store original name in metadata
- ❌ Signed URLs without permission checks → verify access before generating URL
- ❌ Serving unoptimized originals to all clients → generate responsive variants
- ❌ Requiring cloud credentials for local dev → fall back to local filesystem
- ❌ Trusting file extension alone for type → check magic bytes
- ❌ Unlimited file size uploads → enforce server-side size limits
- ❌ Deleting DB records without cleaning up files → delete storage objects too

---

## Quality Gate

- [ ] File type is validated by content (magic bytes), not just extension.
- [ ] Size limits are enforced server-side before storage.
- [ ] Files are stored in object storage, metadata in the database.
- [ ] Private files use signed URLs with TTL; public files use CDN URLs.
- [ ] Storage keys are collision-proof (UUID or content hash).
- [ ] Images are optimized and served in responsive variants.
- [ ] Orphaned file cleanup runs on a schedule or on delete.
- [ ] Local development works without cloud storage credentials.
