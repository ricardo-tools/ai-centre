import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDb } from '@/platform/db/client';
import { showcaseUploads } from '@/platform/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * POST /api/debug/redeploy
 *
 * Triggers redeploy for all ZIP showcases. Debug-key authenticated.
 * One-time utility — can be removed after use.
 */
export async function POST(request: NextRequest) {
  const debugKey = request.headers.get('x-debug-key');
  if (!debugKey || debugKey !== process.env.DEBUG_API_KEY) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const zips = await db.select({ id: showcaseUploads.id, title: showcaseUploads.title })
    .from(showcaseUploads)
    .where(and(eq(showcaseUploads.fileType, 'zip'), eq(showcaseUploads.archived, false)));

  const results: { id: string; title: string; status: string }[] = [];

  for (const zip of zips) {
    try {
      // Reset status to pending
      await db.update(showcaseUploads)
        .set({ deployStatus: 'pending', deployError: null })
        .where(eq(showcaseUploads.id, zip.id));

      // Trigger deploy
      const { triggerDeploy } = await import('@/features/showcase-gallery/deploy');
      await triggerDeploy(zip.id);

      results.push({ id: zip.id, title: zip.title, status: 'triggered' });
      console.info('[debug/redeploy] triggered', { id: zip.id, title: zip.title });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ id: zip.id, title: zip.title, status: `error: ${msg}` });
      console.error('[debug/redeploy] failed', { id: zip.id, error: msg });
    }
  }

  return NextResponse.json({ redeployed: results.length, results });
}
