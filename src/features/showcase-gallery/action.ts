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
  thumbnailUrl: string | null;
  fileName: string;
  fileSizeBytes: number;
  deployStatus: string;
  deployUrl: string | null;
  deploymentId: string | null;
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
        thumbnailUrl: showcaseUploads.thumbnailUrl,
        fileName: showcaseUploads.fileName,
        fileSizeBytes: showcaseUploads.fileSizeBytes,
        deployStatus: showcaseUploads.deployStatus,
        deployUrl: showcaseUploads.deployUrl,
        deploymentId: showcaseUploads.deploymentId,
        createdAt: showcaseUploads.createdAt,
      })
      .from(showcaseUploads)
      .leftJoin(users, eq(showcaseUploads.userId, users.id))
      .orderBy(desc(showcaseUploads.createdAt));

    return Ok(rows.map((r: Record<string, unknown>) => ({
      ...r,
      userName: (r.userName as string) ?? 'Unknown',
      skillIds: (r.skillIds as string[]) ?? [],
      deployStatus: (r.deployStatus as string) ?? 'none',
      deployUrl: (r.deployUrl as string | null) ?? null,
      deploymentId: (r.deploymentId as string | null) ?? null,
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
        thumbnailUrl: showcaseUploads.thumbnailUrl,
        fileName: showcaseUploads.fileName,
        fileSizeBytes: showcaseUploads.fileSizeBytes,
        deployStatus: showcaseUploads.deployStatus,
        deployUrl: showcaseUploads.deployUrl,
        deploymentId: showcaseUploads.deploymentId,
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
      deployStatus: (row.deployStatus as string) ?? 'none',
      deployUrl: (row.deployUrl as string | null) ?? null,
      deploymentId: (row.deploymentId as string | null) ?? null,
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

  // Upload thumbnail if provided (optional, for ZIP projects)
  const thumbnailFile = formData.get('thumbnail') as File | null;
  let thumbnailUrl: string | null = null;

  if (thumbnailFile && thumbnailFile.size > 0) {
    const validImage = ['image/png', 'image/jpeg', 'image/webp'].includes(thumbnailFile.type);
    if (validImage && thumbnailFile.size <= 2 * 1024 * 1024) { // 2MB max
      try {
        if (process.env.BLOB_READ_WRITE_TOKEN) {
          const { put } = await import('@vercel/blob');
          const blob = await put(`showcases/thumbs/${Date.now()}-${thumbnailFile.name}`, thumbnailFile, { access: 'private' });
          thumbnailUrl = blob.url;
        } else {
          const fs = await import('fs/promises');
          const path = await import('path');
          const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads', 'thumbs');
          await fs.mkdir(uploadsDir, { recursive: true });
          const thumbName = `${Date.now()}-${thumbnailFile.name}`;
          await fs.writeFile(path.join(uploadsDir, thumbName), Buffer.from(await thumbnailFile.arrayBuffer()));
          thumbnailUrl = `/uploads/thumbs/${thumbName}`;
        }
      } catch (err) {
        console.error('[showcase-gallery] thumbnail upload failed (non-critical):', err);
      }
    }
  }

  // Upload file storage
  let blobUrl: string;

  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob');
      const blob = await put(`showcases/${Date.now()}-${file.name}`, file, { access: 'private' });
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
      thumbnailUrl,
      fileName: file.name,
      fileSizeBytes: file.size,
      deployStatus: 'none',
      deployUrl: null,
      deploymentId: null,
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
      thumbnailUrl,
      fileName: file.name,
      fileSizeBytes: file.size,
      deployStatus: fileType === 'zip' ? 'pending' : 'none',
    }).returning();

    const insertedId = (inserted as Record<string, unknown>).id as string;

    // Fire-and-forget deployment for ZIP uploads
    if (fileType === 'zip' && process.env.VERCEL_SHOWCASE_TOKEN) {
      import('./deploy').then(({ triggerDeploy }) => {
        triggerDeploy(insertedId).catch((err) => {
          console.error('[showcase-gallery] triggerDeploy fire-and-forget error:', err);
        });
      }).catch((err) => {
        console.error('[showcase-gallery] failed to import deploy module:', err);
      });
    } else if (fileType === 'zip' && !process.env.VERCEL_SHOWCASE_TOKEN) {
      console.warn('[showcase-gallery] VERCEL_SHOWCASE_TOKEN not set — skipping deployment for showcase:', insertedId);
    }

    return Ok({ id: insertedId });
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
      .select({
        userId: showcaseUploads.userId,
        blobUrl: showcaseUploads.blobUrl,
        thumbnailUrl: showcaseUploads.thumbnailUrl,
        deploymentId: showcaseUploads.deploymentId,
      })
      .from(showcaseUploads)
      .where(eq(showcaseUploads.id, showcaseId))
      .limit(1);

    if (!row) return Err(new NotFoundError('Showcase', showcaseId));

    const ownerCheck = requireOwnerOrAdmin(session, row.userId);
    if (!ownerCheck.ok) return ownerCheck;

    // Fire-and-forget: delete Vercel deployment if one exists
    if (row.deploymentId) {
      import('@/platform/lib/vercel-deploy').then(({ deleteDeployment }) => {
        deleteDeployment(row.deploymentId!).then((result) => {
          if (result.ok) {
            console.info('[showcase-gallery] deployment deleted:', { showcaseId, deploymentId: row.deploymentId });
          } else {
            console.warn('[showcase-gallery] deployment delete failed (non-critical):', { showcaseId, error: result.error.message });
          }
        });
      }).catch((err) => {
        console.warn('[showcase-gallery] deployment delete import failed:', err);
      });
    }

    // Delete from Blob storage if configured
    if (process.env.BLOB_READ_WRITE_TOKEN && row.blobUrl.startsWith('http')) {
      try {
        const { del } = await import('@vercel/blob');
        await del(row.blobUrl);
      } catch (err) {
        console.error('[showcase-gallery] blob delete failed:', err);
      }
    }

    // Delete thumbnail blob if it exists
    if (process.env.BLOB_READ_WRITE_TOKEN && row.thumbnailUrl && row.thumbnailUrl.startsWith('http')) {
      try {
        const { del } = await import('@vercel/blob');
        await del(row.thumbnailUrl);
      } catch (err) {
        console.error('[showcase-gallery] thumbnail blob delete failed:', err);
      }
    }

    await db.delete(showcaseUploads).where(eq(showcaseUploads.id, showcaseId));

    return Ok(undefined);
  } catch (err) {
    console.error('[showcase-gallery] delete failed:', err);
    return Err(new NotFoundError('Showcase', showcaseId));
  }
}

export async function getSignedShowcaseUrl(showcaseId: string): Promise<string | null> {
  const result = await fetchShowcaseById(showcaseId);
  if (!result.ok) return null;
  const showcase = result.value;
  if (showcase.fileType !== 'zip' || showcase.deployStatus !== 'ready' || !showcase.deployUrl) return null;

  const { signShowcaseUrl } = await import('@/platform/lib/showcase-token');
  return signShowcaseUrl(showcase.deployUrl);
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
        const blob = await put(`showcases/${Date.now()}-${file.name}`, file, { access: 'private' });
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

    const [row] = await db.select({
      userId: showcaseUploads.userId,
      fileType: showcaseUploads.fileType,
      deploymentId: showcaseUploads.deploymentId,
      deployStatus: showcaseUploads.deployStatus,
    }).from(showcaseUploads).where(eq(showcaseUploads.id, showcaseId)).limit(1);
    if (!row) return Err(new NotFoundError('Showcase', showcaseId));

    const ownerCheck = requireOwnerOrAdmin(session, row.userId);
    if (!ownerCheck.ok) return ownerCheck;

    // Determine deploy field updates based on file change
    let deployFieldUpdates: Record<string, unknown> = {};
    const oldDeploymentId = row.deploymentId as string | null;
    const oldFileType = row.fileType as string;

    if (fileUpdates && fileUpdates.fileType === 'zip') {
      // New ZIP uploaded — delete old deployment if exists, reset to pending
      if (oldDeploymentId) {
        console.info('[showcase-gallery] updateShowcase: deleting old deployment before re-deploy:', { showcaseId, oldDeploymentId });
        import('@/platform/lib/vercel-deploy').then(({ deleteDeployment }) => {
          deleteDeployment(oldDeploymentId).catch((err) => {
            console.warn('[showcase-gallery] updateShowcase: failed to delete old deployment (continuing):', err);
          });
        }).catch((err) => {
          console.warn('[showcase-gallery] updateShowcase: failed to import vercel-deploy:', err);
        });
      }
      deployFieldUpdates = { deployStatus: 'pending', deployUrl: null, deploymentId: null };
    } else if (fileUpdates && fileUpdates.fileType === 'html' && oldFileType === 'zip' && oldDeploymentId) {
      // Switching from ZIP to HTML — delete old deployment, mark as 'none'
      console.info('[showcase-gallery] updateShowcase: switching from ZIP to HTML, deleting old deployment:', { showcaseId, oldDeploymentId });
      import('@/platform/lib/vercel-deploy').then(({ deleteDeployment }) => {
        deleteDeployment(oldDeploymentId).catch((err) => {
          console.warn('[showcase-gallery] updateShowcase: failed to delete old deployment (continuing):', err);
        });
      }).catch((err) => {
        console.warn('[showcase-gallery] updateShowcase: failed to import vercel-deploy:', err);
      });
      deployFieldUpdates = { deployStatus: 'none', deployUrl: null, deploymentId: null };
    }

    await db.update(showcaseUploads).set({
      title: title.trim(),
      description,
      skillIds,
      ...(fileUpdates ?? {}),
      ...deployFieldUpdates,
    }).where(eq(showcaseUploads.id, showcaseId));

    // Fire-and-forget triggerDeploy for new ZIP uploads
    if (fileUpdates && fileUpdates.fileType === 'zip' && process.env.VERCEL_SHOWCASE_TOKEN) {
      console.info('[showcase-gallery] updateShowcase: triggering re-deploy:', { showcaseId });
      import('./deploy').then(({ triggerDeploy }) => {
        triggerDeploy(showcaseId).catch((err) => {
          console.error('[showcase-gallery] updateShowcase: triggerDeploy fire-and-forget error:', err);
        });
      }).catch((err) => {
        console.error('[showcase-gallery] updateShowcase: failed to import deploy module:', err);
      });
    } else if (fileUpdates && fileUpdates.fileType === 'zip' && !process.env.VERCEL_SHOWCASE_TOKEN) {
      console.warn('[showcase-gallery] updateShowcase: VERCEL_SHOWCASE_TOKEN not set — skipping re-deployment for showcase:', showcaseId);
    }

    return Ok(undefined);
  } catch (err) {
    console.error('[showcase-gallery] update failed:', err);
    return Err(new ValidationError('updateFailed', 'Update failed. Please try again.'));
  }
}

export async function checkDeployStatus(showcaseId: string): Promise<Result<{ deployStatus: string; deployUrl: string | null; deployError: string | null; deployStep: string | null }, Error>> {
  if (!hasDb) {
    const entries = await readManifest();
    const found = entries.find((e) => e.id === showcaseId);
    if (!found) return Err(new NotFoundError('Showcase', showcaseId));
    return Ok({ deployStatus: found.deployStatus, deployUrl: found.deployUrl, deployError: null, deployStep: null });
  }

  try {
    const { showcaseUploads } = await import('@/platform/db/schema');
    const { eq } = await import('drizzle-orm');
    const db = getDb();

    const [row] = await db
      .select({
        deployStatus: showcaseUploads.deployStatus,
        deployUrl: showcaseUploads.deployUrl,
        deploymentId: showcaseUploads.deploymentId,
        deployError: showcaseUploads.deployError,
      })
      .from(showcaseUploads)
      .where(eq(showcaseUploads.id, showcaseId))
      .limit(1);

    if (!row) return Err(new NotFoundError('Showcase', showcaseId));

    const currentStatus = row.deployStatus ?? 'none';
    const currentUrl = row.deployUrl ?? null;
    const currentError = row.deployError ?? null;
    const deploymentId = row.deploymentId ?? null;

    // If not actively building, or no deploymentId to check, return DB status as-is
    if ((currentStatus !== 'building' && currentStatus !== 'pending') || !deploymentId) {
      return Ok({ deployStatus: currentStatus, deployUrl: currentUrl, deployError: currentError, deployStep: null });
    }

    // Check Vercel API for the latest deployment status
    const { getDeploymentStatus } = await import('@/platform/lib/vercel-deploy');
    const statusResult = await getDeploymentStatus(deploymentId);

    if (!statusResult.ok) {
      // Vercel API failed — return DB status as fallback
      console.warn('[showcase-gallery] checkDeployStatus: Vercel API failed, returning DB status:', statusResult.error.message);
      return Ok({ deployStatus: currentStatus, deployUrl: currentUrl, deployError: currentError, deployStep: null });
    }

    const vercelStatus = statusResult.value.status;
    const vercelUrl = statusResult.value.url;
    const deployStep = statusResult.value.vercelState;

    // If Vercel status changed, update DB
    if (vercelStatus !== currentStatus) {
      const deployUrl = vercelUrl
        ? (vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`)
        : currentUrl;

      const deployError = vercelStatus === 'failed' ? (statusResult.value.error ?? 'Build failed') : null;

      await db
        .update(showcaseUploads)
        .set({ deployStatus: vercelStatus, deployUrl, deployError })
        .where(eq(showcaseUploads.id, showcaseId));

      console.info('[showcase-gallery] checkDeployStatus: updated status:', { showcaseId, from: currentStatus, to: vercelStatus });
      return Ok({ deployStatus: vercelStatus, deployUrl, deployError, deployStep });
    }

    return Ok({ deployStatus: currentStatus, deployUrl: currentUrl, deployError: currentError, deployStep });
  } catch (err) {
    console.error('[showcase-gallery] checkDeployStatus failed:', err);
    return Err(err instanceof Error ? err : new Error(String(err)));
  }
}

export async function triggerMigrationDeploy(showcaseId: string): Promise<Result<void, NotFoundError>> {
  // No auth needed — viewing is public
  if (!hasDb) {
    // Dev mode: no migration needed
    return Ok(undefined);
  }

  try {
    const { showcaseUploads } = await import('@/platform/db/schema');
    const { eq } = await import('drizzle-orm');
    const db = getDb();

    const [row] = await db
      .select({
        fileType: showcaseUploads.fileType,
        deployStatus: showcaseUploads.deployStatus,
      })
      .from(showcaseUploads)
      .where(eq(showcaseUploads.id, showcaseId))
      .limit(1);

    if (!row) return Err(new NotFoundError('Showcase', showcaseId));

    // Only migrate ZIP showcases with deployStatus 'none' (pre-migration rows)
    if (row.fileType !== 'zip' || row.deployStatus !== 'none') {
      return Ok(undefined);
    }

    // Set to pending so the client-side polling hook picks it up
    await db
      .update(showcaseUploads)
      .set({ deployStatus: 'pending' })
      .where(eq(showcaseUploads.id, showcaseId));

    console.info('[showcase-migration] triggering lazy deploy for pre-migration showcase:', { showcaseId });

    // Fire-and-forget triggerDeploy
    import('./deploy').then(({ triggerDeploy }) => {
      triggerDeploy(showcaseId).catch((err) => {
        console.error('[showcase-migration] triggerDeploy fire-and-forget error:', err);
      });
    }).catch((err) => {
      console.error('[showcase-migration] failed to import deploy module:', err);
    });

    return Ok(undefined);
  } catch (err) {
    console.error('[showcase-migration] triggerMigrationDeploy failed:', err);
    return Err(new NotFoundError('Showcase', showcaseId));
  }
}

export async function retryDeploy(showcaseId: string): Promise<Result<void, ForbiddenError | NotFoundError>> {
  console.info('[showcase-gallery] retryDeploy.start:', { showcaseId });

  const authResult = await requirePermission('showcase:upload');
  if (!authResult.ok) return authResult;

  if (!hasDb) {
    console.warn('[showcase-gallery] retryDeploy: no database — not supported in dev mode');
    return Err(new NotFoundError('Showcase', showcaseId));
  }

  try {
    const { showcaseUploads } = await import('@/platform/db/schema');
    const { eq } = await import('drizzle-orm');
    const db = getDb();

    const [row] = await db
      .select({
        fileType: showcaseUploads.fileType,
        deployStatus: showcaseUploads.deployStatus,
        deploymentId: showcaseUploads.deploymentId,
        blobUrl: showcaseUploads.blobUrl,
      })
      .from(showcaseUploads)
      .where(eq(showcaseUploads.id, showcaseId))
      .limit(1);

    if (!row) {
      console.warn('[showcase-gallery] retryDeploy: showcase not found:', { showcaseId });
      return Err(new NotFoundError('Showcase', showcaseId));
    }

    if (row.fileType !== 'zip') {
      console.warn('[showcase-gallery] retryDeploy: not a ZIP showcase:', { showcaseId, fileType: row.fileType });
      return Err(new NotFoundError('Showcase', showcaseId));
    }

    if (row.deployStatus !== 'failed') {
      console.warn('[showcase-gallery] retryDeploy: showcase not in failed state:', { showcaseId, deployStatus: row.deployStatus });
      return Err(new NotFoundError('Showcase', showcaseId));
    }

    // Delete old deployment if one exists
    if (row.deploymentId) {
      console.info('[showcase-gallery] retryDeploy: deleting old deployment:', { showcaseId, deploymentId: row.deploymentId });
      try {
        const { deleteDeployment } = await import('@/platform/lib/vercel-deploy');
        await deleteDeployment(row.deploymentId);
      } catch (err) {
        console.warn('[showcase-gallery] retryDeploy: failed to delete old deployment (continuing):', err);
      }
    }

    // Reset status to pending, clear deploy URL
    await db
      .update(showcaseUploads)
      .set({ deployStatus: 'pending', deployUrl: null, deploymentId: null })
      .where(eq(showcaseUploads.id, showcaseId));

    console.info('[showcase-gallery] retryDeploy: status reset to pending:', { showcaseId });

    // Fire-and-forget triggerDeploy
    if (process.env.VERCEL_SHOWCASE_TOKEN) {
      import('./deploy').then(({ triggerDeploy }) => {
        triggerDeploy(showcaseId).catch((err) => {
          console.error('[showcase-gallery] retryDeploy: triggerDeploy fire-and-forget error:', err);
        });
      }).catch((err) => {
        console.error('[showcase-gallery] retryDeploy: failed to import deploy module:', err);
      });
    } else {
      console.warn('[showcase-gallery] retryDeploy: VERCEL_SHOWCASE_TOKEN not set — skipping deployment');
    }

    console.info('[showcase-gallery] retryDeploy.complete:', { showcaseId });
    return Ok(undefined);
  } catch (err) {
    console.error('[showcase-gallery] retryDeploy.error:', err);
    return Err(new NotFoundError('Showcase', showcaseId));
  }
}
