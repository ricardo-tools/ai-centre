import { NextResponse, type NextRequest } from 'next/server';

/**
 * GET /api/debug/showcases — List all showcases with deploy status (debug key required)
 * POST /api/debug/showcases — Retry deploy for a stuck showcase (debug key required)
 *   Body: { "showcaseId": "...", "action": "retry" }
 */

export async function GET(request: NextRequest) {
  const debugKey = request.headers.get('x-debug-key');
  if (!debugKey || debugKey !== process.env.DEBUG_API_KEY) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const { getDb } = await import('@/platform/db/client');
    const { showcaseUploads } = await import('@/platform/db/schema');
    const { desc } = await import('drizzle-orm');
    const db = getDb();

    const rows = await db
      .select({
        id: showcaseUploads.id,
        title: showcaseUploads.title,
        fileType: showcaseUploads.fileType,
        deployStatus: showcaseUploads.deployStatus,
        deployUrl: showcaseUploads.deployUrl,
        deploymentId: showcaseUploads.deploymentId,
        deployError: showcaseUploads.deployError,
        archived: showcaseUploads.archived,
        createdAt: showcaseUploads.createdAt,
      })
      .from(showcaseUploads)
      .orderBy(desc(showcaseUploads.createdAt));

    return NextResponse.json({ showcases: rows });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const debugKey = request.headers.get('x-debug-key');
  if (!debugKey || debugKey !== process.env.DEBUG_API_KEY) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { showcaseId, action } = body as { showcaseId: string; action: string };

    if (action === 'retry') {
      const { getDb } = await import('@/platform/db/client');
      const { showcaseUploads } = await import('@/platform/db/schema');
      const { eq } = await import('drizzle-orm');
      const db = getDb();

      // Reset status to pending
      await db
        .update(showcaseUploads)
        .set({ deployStatus: 'pending', deployUrl: null, deploymentId: null, deployError: null })
        .where(eq(showcaseUploads.id, showcaseId));

      // Trigger deploy inline (not fire-and-forget, so we can see the result)
      const { triggerDeploy } = await import('@/features/showcase-gallery/deploy');
      await triggerDeploy(showcaseId);

      // Read back the state
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

      return NextResponse.json({ ok: true, showcase: row });
    }

    return NextResponse.json({ error: 'unknown action' }, { status: 400 });
  } catch (err) {
    console.error('[debug/showcases] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
