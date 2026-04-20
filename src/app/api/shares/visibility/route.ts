import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/platform/lib/oauth';
import { getDb, hasDatabase } from '@/platform/db/client';

/**
 * Visibility API — change the visibility of a resource.
 *
 * PATCH /api/shares/visibility
 * Body: { resourceType: 'showcase' | 'skill', resourceId: string, visibility: 'public' | 'private' | 'link_only' }
 * Auth: Bearer token (owner only)
 */

const VALID_VISIBILITY = ['public', 'private', 'link_only'] as const;
type Visibility = typeof VALID_VISIBILITY[number];

async function getUser(request: NextRequest): Promise<{ userId: string } | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const result = await verifyAccessToken(authHeader.slice('Bearer '.length).trim());
  return result.ok ? result.value : null;
}

export async function PATCH(request: NextRequest) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  if (!hasDatabase()) {
    return NextResponse.json({ error: 'no_database' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const { resourceType, resourceId, visibility } = body;

  if (!resourceType || !resourceId || !visibility) {
    return NextResponse.json({ error: 'missing_fields', message: 'resourceType, resourceId, visibility required' }, { status: 400 });
  }

  if (!['showcase', 'skill'].includes(resourceType as string)) {
    return NextResponse.json({ error: 'invalid_resource_type' }, { status: 400 });
  }

  if (!VALID_VISIBILITY.includes(visibility as Visibility)) {
    return NextResponse.json({ error: 'invalid_visibility', message: 'Must be public, private, or link_only' }, { status: 400 });
  }

  const { eq } = await import('drizzle-orm');
  const db = getDb();

  if (resourceType === 'showcase') {
    const { showcaseUploads } = await import('@/platform/db/schema');
    const [row] = await db
      .select({ userId: showcaseUploads.userId })
      .from(showcaseUploads)
      .where(eq(showcaseUploads.id, resourceId as string))
      .limit(1);

    if (!row) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    if (row.userId !== user.userId) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

    await db
      .update(showcaseUploads)
      .set({ visibility: visibility as string })
      .where(eq(showcaseUploads.id, resourceId as string));
  } else {
    const { communitySkills } = await import('@/platform/db/schema');
    const [row] = await db
      .select({ userId: communitySkills.userId })
      .from(communitySkills)
      .where(eq(communitySkills.id, resourceId as string))
      .limit(1);

    if (!row) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    if (row.userId !== user.userId) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

    await db
      .update(communitySkills)
      .set({ visibility: visibility as string })
      .where(eq(communitySkills.id, resourceId as string));
  }

  console.info('[visibility] updated', { resourceType, resourceId, visibility, by: user.userId });
  return NextResponse.json({ visibility });
}
