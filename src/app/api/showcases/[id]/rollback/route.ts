import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { after } from 'next/server';
import { getDb } from '@/platform/db/client';
import { showcaseUploads, showcaseVersions } from '@/platform/db/schema';
import { verifyAccessToken } from '@/platform/lib/oauth';
import { eq, and } from 'drizzle-orm';

/**
 * POST /api/showcases/:id/rollback
 *
 * Roll back a showcase to a previous version. Owner only.
 * Creates a new version with the target version's blob URL.
 *
 * Body: { targetVersion: number }
 * Returns: { showcaseId, version, rolledBackTo }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: showcaseId } = await params;
  const started = Date.now();
  console.info('[showcases-rollback] start', { showcaseId });

  // Auth
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const tokenResult = await verifyAccessToken(authHeader.slice('Bearer '.length).trim());
  if (!tokenResult.ok) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { userId } = tokenResult.value;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const targetVersion = Number(body.targetVersion);
  if (!Number.isInteger(targetVersion) || targetVersion < 1) {
    return NextResponse.json({ error: 'invalid_version' }, { status: 400 });
  }

  const db = getDb();

  // Verify ownership
  const [showcase] = await db.select({ id: showcaseUploads.id, userId: showcaseUploads.userId, fileType: showcaseUploads.fileType })
    .from(showcaseUploads)
    .where(eq(showcaseUploads.id, showcaseId))
    .limit(1);

  if (!showcase) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  if (showcase.userId !== userId) {
    return NextResponse.json({ error: 'forbidden', message: 'Only the owner can rollback' }, { status: 403 });
  }

  // Find target version
  const [target] = await db.select({ blobUrl: showcaseVersions.blobUrl })
    .from(showcaseVersions)
    .where(and(eq(showcaseVersions.showcaseId, showcaseId), eq(showcaseVersions.versionNumber, targetVersion)))
    .limit(1);

  if (!target) {
    return NextResponse.json({ error: 'version_not_found' }, { status: 404 });
  }

  // Get max version
  const versions = await db.select({ vn: showcaseVersions.versionNumber })
    .from(showcaseVersions)
    .where(eq(showcaseVersions.showcaseId, showcaseId));
  const newVersionNumber = Math.max(...versions.map(v => v.vn)) + 1;

  // Create new version
  await db.insert(showcaseVersions).values({
    showcaseId,
    versionNumber: newVersionNumber,
    blobUrl: target.blobUrl,
    commitMessage: `Restored from v${targetVersion}`,
  });

  // Update showcase
  await db.update(showcaseUploads).set({
    blobUrl: target.blobUrl,
    deployStatus: showcase.fileType === 'zip' ? 'pending' : 'none',
    deployError: null,
  }).where(eq(showcaseUploads.id, showcaseId));

  // Trigger re-deploy for ZIPs
  if (showcase.fileType === 'zip' && process.env.VERCEL_SHOWCASE_TOKEN) {
    after(async () => {
      try {
        const { triggerDeploy } = await import('@/features/showcase-gallery/deploy');
        await triggerDeploy(showcaseId);
      } catch (err) {
        console.error('[showcases-rollback] deploy trigger failed', err);
      }
    });
  }

  console.info('[showcases-rollback] complete', {
    showcaseId,
    to: targetVersion,
    newVersion: newVersionNumber,
    latencyMs: Date.now() - started,
  });

  return NextResponse.json({ showcaseId, version: newVersionNumber, rolledBackTo: targetVersion });
}
