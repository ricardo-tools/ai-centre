import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { getSkillBySlug, getReferencesFor, getAssetsFor } from '@/platform/lib/skills';
import { verifyAccessToken } from '@/platform/lib/oauth';

/**
 * GET /api/skills/:slug/content
 *
 * Returns full skill content + references + checksum.
 * Requires OAuth bearer token (Flow CLI).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  // Validate slug — no path traversal
  if (!slug || /[^a-z0-9-]/.test(slug)) {
    return NextResponse.json({ error: 'invalid_slug' }, { status: 400 });
  }

  // Require auth (skip in local dev)
  let userId = 'dev-user';
  if (process.env.SKIP_AUTH !== 'true') {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'missing_token' }, { status: 401 });
    }

    const tokenResult = await verifyAccessToken(token);
    if (!tokenResult.ok) {
      return NextResponse.json({ error: 'invalid_token', message: tokenResult.error.message }, { status: 401 });
    }
    userId = tokenResult.value.userId;
  }

  const skill = getSkillBySlug(slug);
  if (!skill) {
    return NextResponse.json({ error: 'not_found', message: `Skill "${slug}" not found` }, { status: 404 });
  }

  const references = getReferencesFor(slug);
  const assets = getAssetsFor(slug);
  const checksum = createHash('sha256').update(skill.content).digest('hex');

  console.info('[skills-content] served skill content', { slug, userId });

  return NextResponse.json({
    slug: skill.slug,
    title: skill.title,
    version: skill.version,
    content: skill.content,
    references: references.map((r) => ({ filename: r.filename, content: r.content })),
    assets: assets.map((a) => ({ filename: a.filename, base64: a.buffer.toString('base64') })),
    checksum,
  });
}
