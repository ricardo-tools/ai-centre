import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { getAllSkills } from '@/platform/lib/skills';

/**
 * POST /api/skills/updates
 *
 * Check which installed skills have upstream updates.
 * Compares client-side versions and checksums against the current official catalog.
 * Only checks official skills — community skills don't have "upstream".
 *
 * Auth required (Bearer token verified by middleware).
 *
 * Body: { skills: [{ slug, version, checksum }] }
 * Returns: { updates: [{ slug, name, currentVersion, latestVersion, hasUpdate, hasLocalChanges }] }
 */
export async function POST(request: NextRequest) {
  const started = Date.now();
  console.info('[skills-updates] start');

  let body: { skills?: Array<{ slug: string; version?: string; checksum?: string }> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  if (!Array.isArray(body.skills)) {
    return NextResponse.json({ error: 'invalid_body', message: 'skills must be an array' }, { status: 400 });
  }

  const allSkills = getAllSkills();
  const skillMap = new Map(allSkills.map(s => [s.slug, s]));

  const updates = body.skills.map(installed => {
    const official = skillMap.get(installed.slug);

    if (!official) {
      // Skill no longer exists in official catalog
      return {
        slug: installed.slug,
        name: installed.slug,
        currentVersion: installed.version ?? null,
        latestVersion: null,
        hasUpdate: false,
        hasLocalChanges: false,
        removed: true,
      };
    }

    const latestChecksum = createHash('sha256').update(official.content).digest('hex');
    const hasUpdate = installed.version !== official.version;
    const hasLocalChanges = installed.checksum ? installed.checksum !== latestChecksum : false;

    return {
      slug: official.slug,
      name: official.title,
      currentVersion: installed.version ?? null,
      latestVersion: official.version,
      hasUpdate,
      hasLocalChanges,
      removed: false,
    };
  });

  const updatesAvailable = updates.filter(u => u.hasUpdate);
  console.info('[skills-updates] complete', {
    checked: body.skills.length,
    updatesAvailable: updatesAvailable.length,
    latencyMs: Date.now() - started,
  });

  return NextResponse.json({ updates });
}
