import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { after } from 'next/server';
import { getDb } from '@/platform/db/client';
import { showcaseUploads, showcaseVersions } from '@/platform/db/schema';
import { verifyAccessToken } from '@/platform/lib/oauth';
import { eq, and } from 'drizzle-orm';

/**
 * POST /api/showcases/publish
 *
 * Publish a showcase from the CLI. Accepts FormData with file upload.
 * Creates a new showcase or adds a version to an existing one.
 * Triggers deploy for ZIPs via the existing pipeline.
 *
 * FormData fields:
 *   file: File (required, .html or .zip, max 50MB)
 *   title: string (required)
 *   description: string (optional)
 *   commitMessage: string (required)
 *   skillSlugs: string (optional, JSON array of skill slugs)
 *   projectId: string (optional, for matching existing showcases)
 */

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  const started = Date.now();
  console.info('[showcases-publish] start');

  // Auth — Bearer token
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const tokenResult = await verifyAccessToken(authHeader.slice('Bearer '.length).trim());
  if (!tokenResult.ok) {
    return NextResponse.json({ error: 'unauthorized', message: tokenResult.error.message }, { status: 401 });
  }

  const { userId } = tokenResult.value;

  // Parse FormData
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'invalid_body', message: 'Expected multipart form data' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  const title = formData.get('title') as string | null;
  const commitMessage = formData.get('commitMessage') as string | null;
  const description = (formData.get('description') as string) || null;
  const skillSlugsRaw = formData.get('skillSlugs') as string | null;
  const projectId = formData.get('projectId') as string | null;

  // Validate
  if (!file) {
    return NextResponse.json({ error: 'file_required' }, { status: 400 });
  }
  if (!title?.trim()) {
    return NextResponse.json({ error: 'title_required' }, { status: 400 });
  }
  if (!commitMessage?.trim()) {
    return NextResponse.json({ error: 'commit_message_required' }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'file_too_large', message: `Max file size is ${MAX_FILE_SIZE / 1024 / 1024}MB` }, { status: 400 });
  }

  const isHtml = file.name.endsWith('.html');
  const isZip = file.name.endsWith('.zip');
  if (!isHtml && !isZip) {
    return NextResponse.json({ error: 'invalid_file_type', message: 'Only .html and .zip files are supported' }, { status: 400 });
  }

  const fileType = isHtml ? 'html' : 'zip';

  let skillIds: string[] = [];
  try {
    skillIds = skillSlugsRaw ? JSON.parse(skillSlugsRaw) : [];
    if (!Array.isArray(skillIds)) skillIds = [];
  } catch {
    skillIds = [];
  }

  const db = getDb();

  // Upload file to blob
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
    console.error('[showcases-publish] file upload failed', err);
    return NextResponse.json({ error: 'storage_failed' }, { status: 500 });
  }

  // Check if existing showcase for this user (match by title + userId)
  let showcaseId: string | null = null;

  if (projectId) {
    const [existing] = await db.select({ id: showcaseUploads.id })
      .from(showcaseUploads)
      .where(and(eq(showcaseUploads.userId, userId), eq(showcaseUploads.title, title.trim())))
      .limit(1);

    if (existing) {
      showcaseId = existing.id;
      await db.update(showcaseUploads).set({
        blobUrl,
        fileType: fileType as 'html' | 'zip',
        fileName: file.name,
        fileSizeBytes: file.size,
        description,
        skillIds,
        deployStatus: fileType === 'zip' ? 'pending' : 'none',
        deployError: null,
      }).where(eq(showcaseUploads.id, existing.id));
      console.info('[showcases-publish] updating existing showcase', { showcaseId, userId });
    }
  }

  if (!showcaseId) {
    const [inserted] = await db.insert(showcaseUploads).values({
      userId,
      title: title.trim(),
      description,
      skillIds,
      fileType: fileType as 'html' | 'zip',
      blobUrl,
      fileName: file.name,
      fileSizeBytes: file.size,
      deployStatus: fileType === 'zip' ? 'pending' : 'none',
    }).returning();
    showcaseId = (inserted as Record<string, unknown>).id as string;
    console.info('[showcases-publish] created new showcase', { showcaseId, userId });
  }

  // Get existing version count for this showcase
  const versionRows = await db.select({ vn: showcaseVersions.versionNumber })
    .from(showcaseVersions)
    .where(eq(showcaseVersions.showcaseId, showcaseId));
  const versionNumber = versionRows.length > 0 ? Math.max(...versionRows.map(r => r.vn)) + 1 : 1;

  // Create version record
  await db.insert(showcaseVersions).values({
    showcaseId,
    versionNumber,
    blobUrl,
    commitMessage: commitMessage.trim(),
  });

  // Trigger deploy for ZIPs
  if (fileType === 'zip' && process.env.VERCEL_SHOWCASE_TOKEN) {
    after(async () => {
      try {
        const { triggerDeploy } = await import('@/features/showcase-gallery/deploy');
        await triggerDeploy(showcaseId);
      } catch (err) {
        console.error('[showcases-publish] deploy trigger failed', err);
      }
    });
  }

  console.info('[showcases-publish] complete', {
    showcaseId,
    version: versionNumber,
    fileType,
    userId,
    latencyMs: Date.now() - started,
  });

  return NextResponse.json({
    showcaseId,
    version: versionNumber,
    title: title.trim(),
  });
}
