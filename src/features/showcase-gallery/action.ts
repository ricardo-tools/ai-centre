'use server';

import { type Result, Ok, Err, ValidationError, NotFoundError, ForbiddenError } from '@/platform/lib/result';
import { requireAuth, requirePermission, requireOwnerOrAdmin } from '@/platform/lib/guards';
import { getDb, hasDatabase } from '@/platform/db/client';

const hasDb = hasDatabase();

// ── Dev-mode local manifest (replaces DB when DATABASE_URL is not set) ──

async function getManifestPath(): Promise<string> {
  const path = await import('path');
  return path.resolve(process.cwd(), 'public', 'uploads', 'manifest.json');
}

async function readManifest(): Promise<RawShowcaseUpload[]> {
  try {
    const fs = await import('fs/promises');
    const data = await fs.readFile(await getManifestPath(), 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeManifest(entries: RawShowcaseUpload[]): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const dir = path.resolve(process.cwd(), 'public', 'uploads');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(await getManifestPath(), JSON.stringify(entries, null, 2));
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_HTML_TYPES = ['text/html'];
const ALLOWED_ZIP_TYPES = ['application/zip', 'application/x-zip-compressed', 'application/octet-stream'];

export interface RawShowcaseUpload {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string | null;
  skillIds: string[];
  fileType: 'html' | 'zip';
  blobUrl: string;
  fileName: string;
  fileSizeBytes: number;
  createdAt: string;
}

export async function fetchAllShowcases(): Promise<Result<RawShowcaseUpload[], Error>> {
  if (!hasDb) {
    return Ok(await readManifest());
  }

  try {
    const { showcaseUploads, users } = await import('@/platform/db/schema');
    const { eq, desc } = await import('drizzle-orm');
    const db = getDb();
    const rows = await db
      .select({
        id: showcaseUploads.id,
        userId: showcaseUploads.userId,
        userName: users.name,
        title: showcaseUploads.title,
        description: showcaseUploads.description,
        skillIds: showcaseUploads.skillIds,
        fileType: showcaseUploads.fileType,
        blobUrl: showcaseUploads.blobUrl,
        fileName: showcaseUploads.fileName,
        fileSizeBytes: showcaseUploads.fileSizeBytes,
        createdAt: showcaseUploads.createdAt,
      })
      .from(showcaseUploads)
      .leftJoin(users, eq(showcaseUploads.userId, users.id))
      .orderBy(desc(showcaseUploads.createdAt));

    return Ok(rows.map((r: Record<string, unknown>) => ({
      ...r,
      userName: (r.userName as string) ?? 'Unknown',
      skillIds: (r.skillIds as string[]) ?? [],
      createdAt: (r.createdAt as Date).toISOString(),
    })) as RawShowcaseUpload[]);
  } catch (err) {
    console.error('[showcase-gallery] fetchAllShowcases failed:', err);
    return Ok([]);
  }
}

export async function fetchShowcaseById(id: string): Promise<Result<RawShowcaseUpload, NotFoundError>> {
  if (!hasDb) {
    const entries = await readManifest();
    const found = entries.find((e) => e.id === id);
    if (!found) return Err(new NotFoundError('Showcase', id));
    return Ok(found);
  }

  try {
    const { showcaseUploads, users } = await import('@/platform/db/schema');
    const { eq } = await import('drizzle-orm');
    const db = getDb();
    const [row] = await db
      .select({
        id: showcaseUploads.id,
        userId: showcaseUploads.userId,
        userName: users.name,
        title: showcaseUploads.title,
        description: showcaseUploads.description,
        skillIds: showcaseUploads.skillIds,
        fileType: showcaseUploads.fileType,
        blobUrl: showcaseUploads.blobUrl,
        fileName: showcaseUploads.fileName,
        fileSizeBytes: showcaseUploads.fileSizeBytes,
        createdAt: showcaseUploads.createdAt,
      })
      .from(showcaseUploads)
      .leftJoin(users, eq(showcaseUploads.userId, users.id))
      .where(eq(showcaseUploads.id, id))
      .limit(1);

    if (!row) return Err(new NotFoundError('Showcase', id));

    return Ok({
      ...row,
      userName: (row.userName as string) ?? 'Unknown',
      skillIds: (row.skillIds as string[]) ?? [],
      createdAt: (row.createdAt as Date).toISOString(),
    } as RawShowcaseUpload);
  } catch (err) {
    console.error('[showcase-gallery] fetchShowcaseById failed:', err);
    return Err(new NotFoundError('Showcase', id));
  }
}

export async function uploadShowcase(formData: FormData): Promise<Result<{ id: string }, ValidationError | ForbiddenError>> {
  // Auth guard — userId comes from session, never from client
  const authResult = await requirePermission('showcase:upload');
  if (!authResult.ok) return authResult;
  const userId = authResult.value.userId;

  const title = formData.get('title') as string;
  const description = (formData.get('description') as string) || null;
  const skillIdsRaw = formData.get('skillIds') as string;
  const file = formData.get('file') as File;

  if (!title?.trim()) {
    return Err(new ValidationError('titleRequired', 'Title is required'));
  }

  if (!file) {
    return Err(new ValidationError('fileRequired', 'File is required'));
  }

  if (file.size > MAX_FILE_SIZE) {
    return Err(new ValidationError('fileTooLarge', 'File must be under 10MB'));
  }

  const isHtml = file.name.endsWith('.html') || ALLOWED_HTML_TYPES.includes(file.type);
  const isZip = file.name.endsWith('.zip') || ALLOWED_ZIP_TYPES.includes(file.type);

  if (!isHtml && !isZip) {
    return Err(new ValidationError('invalidFileType', 'Only .html and .zip files are supported'));
  }

  const fileType = isHtml ? 'html' : 'zip';

  // Content validation for HTML uploads
  if (fileType === 'html') {
    const content = await file.text();
    if (content.includes('<script') && content.includes('document.cookie')) {
      console.warn('[showcase] Potentially malicious HTML uploaded:', file.name);
    }
  }

  let skillIds: string[] = [];
  try {
    skillIds = skillIdsRaw ? JSON.parse(skillIdsRaw) : [];
    if (!Array.isArray(skillIds)) skillIds = [];
  } catch {
    skillIds = [];
  }

  // Upload file storage
  let blobUrl: string;

  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob');
      const blob = await put(`showcases/${Date.now()}-${file.name}`, file, { access: 'public' });
      blobUrl = blob.url;
    } else {
      // Dev fallback: write to public/uploads/ for local preview
      const fs = await import('fs/promises');
      const path = await import('path');
      const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadsDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      blobUrl = `/uploads/${fileName}`;
    }
  } catch (err) {
    console.error('[showcase-gallery] file upload failed:', err);
    return Err(new ValidationError('storageFailed', 'File storage failed. Please try again.'));
  }

  // Save to DB (or local manifest in dev)
  if (!hasDb) {
    const mockId = crypto.randomUUID();
    const entry: RawShowcaseUpload = {
      id: mockId,
      userId,
      userName: 'Dev User',
      title: title.trim(),
      description,
      skillIds,
      fileType,
      blobUrl,
      fileName: file.name,
      fileSizeBytes: file.size,
      createdAt: new Date().toISOString(),
    };
    const manifest = await readManifest();
    manifest.unshift(entry);
    await writeManifest(manifest);
    console.log(`[showcase-gallery] dev mode — saved to manifest: ${mockId}`);
    return Ok({ id: mockId });
  }

  try {
    const { showcaseUploads } = await import('@/platform/db/schema');
    const db = getDb();
    const [inserted] = await db.insert(showcaseUploads).values({
      userId,
      title: title.trim(),
      description,
      skillIds,
      fileType,
      blobUrl,
      fileName: file.name,
      fileSizeBytes: file.size,
    }).returning();

    return Ok({ id: (inserted as Record<string, unknown>).id as string });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Database insert failed';
    console.error('[showcase-gallery] DB insert failed:', err);
    return Err(new ValidationError('uploadFailed', message));
  }
}

export async function deleteShowcase(showcaseId: string): Promise<Result<void, ForbiddenError | NotFoundError>> {
  const authResult = await requireAuth();
  if (!authResult.ok) return authResult;
  const session = authResult.value;

  if (!hasDb) {
    const manifest = await readManifest();
    const idx = manifest.findIndex((e) => e.id === showcaseId);
    if (idx === -1) return Err(new NotFoundError('Showcase', showcaseId));
    manifest.splice(idx, 1);
    await writeManifest(manifest);
    return Ok(undefined);
  }

  try {
    const { showcaseUploads } = await import('@/platform/db/schema');
    const { eq } = await import('drizzle-orm');
    const db = getDb();

    const [row] = await db
      .select({ userId: showcaseUploads.userId, blobUrl: showcaseUploads.blobUrl })
      .from(showcaseUploads)
      .where(eq(showcaseUploads.id, showcaseId))
      .limit(1);

    if (!row) return Err(new NotFoundError('Showcase', showcaseId));

    const ownerCheck = requireOwnerOrAdmin(session, row.userId);
    if (!ownerCheck.ok) return ownerCheck;

    // Delete from Blob storage if configured
    if (process.env.BLOB_READ_WRITE_TOKEN && row.blobUrl.startsWith('http')) {
      try {
        const { del } = await import('@vercel/blob');
        await del(row.blobUrl);
      } catch (err) {
        console.error('[showcase-gallery] blob delete failed:', err);
      }
    }

    await db.delete(showcaseUploads).where(eq(showcaseUploads.id, showcaseId));

    return Ok(undefined);
  } catch (err) {
    console.error('[showcase-gallery] delete failed:', err);
    return Err(new NotFoundError('Showcase', showcaseId));
  }
}

export async function updateShowcase(showcaseId: string, formData: FormData): Promise<Result<void, ValidationError | ForbiddenError | NotFoundError>> {
  const authResult = await requireAuth();
  if (!authResult.ok) return authResult;
  const session = authResult.value;

  const title = formData.get('title') as string;
  const description = (formData.get('description') as string) || null;
  const skillIdsRaw = formData.get('skillIds') as string;
  const file = formData.get('file') as File | null;

  if (!title?.trim()) return Err(new ValidationError('titleRequired', 'Title is required'));

  let skillIds: string[] = [];
  try {
    skillIds = skillIdsRaw ? JSON.parse(skillIdsRaw) : [];
    if (!Array.isArray(skillIds)) skillIds = [];
  } catch {
    skillIds = [];
  }

  // If a new file was provided, upload it
  let fileUpdates: { blobUrl: string; fileName: string; fileSizeBytes: number; fileType: 'html' | 'zip' } | null = null;

  if (file && file.size > 0) {
    if (file.size > MAX_FILE_SIZE) return Err(new ValidationError('fileTooLarge', 'File must be under 10MB'));
    const isHtml = file.name.endsWith('.html');
    const isZip = file.name.endsWith('.zip');
    if (!isHtml && !isZip) return Err(new ValidationError('invalidFileType', 'Only .html and .zip files are supported'));

    let blobUrl: string;
    try {
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const { put } = await import('@vercel/blob');
        const blob = await put(`showcases/${Date.now()}-${file.name}`, file, { access: 'public' });
        blobUrl = blob.url;
      } else {
        const fs = await import('fs/promises');
        const path = await import('path');
        const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadsDir, { recursive: true });
        const fileName = `${Date.now()}-${file.name}`;
        await fs.writeFile(path.join(uploadsDir, fileName), Buffer.from(await file.arrayBuffer()));
        blobUrl = `/uploads/${fileName}`;
      }
    } catch (err) {
      console.error('[showcase-gallery] file upload failed:', err);
      return Err(new ValidationError('storageFailed', 'File storage failed. Please try again.'));
    }

    fileUpdates = { blobUrl, fileName: file.name, fileSizeBytes: file.size, fileType: isHtml ? 'html' : 'zip' };
  }

  if (!hasDb) {
    const manifest = await readManifest();
    const idx = manifest.findIndex((e) => e.id === showcaseId);
    if (idx === -1) return Err(new NotFoundError('Showcase', showcaseId));
    if (manifest[idx].userId !== session.userId && session.roleSlug !== 'admin') {
      return Err(new ForbiddenError('resource:access'));
    }
    manifest[idx] = {
      ...manifest[idx],
      title: title.trim(),
      description,
      skillIds,
      ...(fileUpdates ?? {}),
    };
    await writeManifest(manifest);
    return Ok(undefined);
  }

  try {
    const { showcaseUploads } = await import('@/platform/db/schema');
    const { eq } = await import('drizzle-orm');
    const db = getDb();

    const [row] = await db.select({ userId: showcaseUploads.userId }).from(showcaseUploads).where(eq(showcaseUploads.id, showcaseId)).limit(1);
    if (!row) return Err(new NotFoundError('Showcase', showcaseId));

    const ownerCheck = requireOwnerOrAdmin(session, row.userId);
    if (!ownerCheck.ok) return ownerCheck;

    await db.update(showcaseUploads).set({
      title: title.trim(),
      description,
      skillIds,
      ...(fileUpdates ?? {}),
    }).where(eq(showcaseUploads.id, showcaseId));
    return Ok(undefined);
  } catch (err) {
    console.error('[showcase-gallery] update failed:', err);
    return Err(new ValidationError('updateFailed', 'Update failed. Please try again.'));
  }
}
