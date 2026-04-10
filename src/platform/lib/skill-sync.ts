/**
 * Auto-sync system for official skills.
 *
 * On app startup, compares local skill directories against the DB.
 * Skills use directory format: skills/<slug>/SKILL.md with optional
 * skills/<slug>/references/*.md companion files.
 *
 * - New skills → creates skill + published version, uploads content to Vercel Blob.
 * - Changed skills (checksum mismatch) → bumps patch version, uploads new content.
 * - Unchanged skills → skipped.
 * - References are uploaded alongside the main content to Blob.
 *
 * Skill content is stored in Vercel Blob (contentBlobUrl) and also kept inline
 * in the `content` column for backward compatibility.
 */

import { createHash } from 'crypto';
import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { eq } from 'drizzle-orm';
import { getDb, hasDatabase } from '@/platform/db/client';
import {
  skills,
  skillVersions,
  users,
  roles,
  rolePermissions,
  auditLog,
} from '@/platform/db/schema';
import { PERMISSION_REGISTRY, SYSTEM_ROLE_SEEDS } from '@/platform/lib/permissions';

/** Metadata lookup — reuse SKILL_DEFINITIONS from skills.ts without reading files */
import type { SkillTags } from '@/platform/lib/skills';

interface SkillMeta {
  slug: string;
  title: string;
  description: string;
  tags: SkillTags;
  companionTo?: string;
}

/** Lazily imported to avoid top-level fs reads during module load */
function getSkillDefinitions(): SkillMeta[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getAllSkills } = require('@/platform/lib/skills') as typeof import('@/platform/lib/skills');
  return getAllSkills().map(({ slug, title, description, tags, companionTo }) => ({
    slug,
    title,
    description,
    tags,
    companionTo,
  }));
}

interface SyncResult {
  created: string[];
  updated: string[];
  unchanged: string[];
  errors: string[];
}

type DrizzleClient = ReturnType<typeof getDb>;

// ── Blob upload ──────────────────────────────────────────────────────

async function uploadToBlob(path: string, content: string): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    // Dev mode — return a placeholder URL, content served from disk
    return `file://skills/${path}`;
  }
  const { put } = await import('@vercel/blob');
  const blob = await put(path, content, {
    access: 'private',
    contentType: 'text/markdown',
  });
  return blob.url;
}

// ── System roles & user ──────────────────────────────────────────────

async function ensureSystemRoles(db: DrizzleClient): Promise<void> {
  const existingRoles = await db.select().from(roles).limit(1);
  if (existingRoles.length > 0) return; // Already seeded

  // Create admin and member roles
  const [adminRole] = await db
    .insert(roles)
    .values([
      {
        slug: 'admin',
        name: 'Administrator',
        description: 'Full access to all features and settings',
        isSystem: true,
      },
      {
        slug: 'member',
        name: 'Member',
        description: 'Standard user — create, edit own content, generate projects',
        isSystem: true,
      },
    ])
    .returning();

  // Assign all permissions to admin
  if (adminRole) {
    await db.insert(rolePermissions).values(
      PERMISSION_REGISTRY.map((p) => ({ roleId: adminRole.id, permission: p.key })),
    );
  }

  // Assign member permissions
  const memberRows = await db
    .select()
    .from(roles)
    .where(eq(roles.slug, 'member'))
    .limit(1);
  const memberRole = memberRows[0];
  if (memberRole) {
    await db.insert(rolePermissions).values(
      SYSTEM_ROLE_SEEDS.member.map((p) => ({ roleId: memberRole.id, permission: p })),
    );
  }
}

async function getOrCreateSystemUser(db: DrizzleClient): Promise<string> {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, 'system@ai-centre.local'))
    .limit(1);
  if (existing.length > 0) return existing[0].id;

  // Get admin role
  const adminRows = await db
    .select()
    .from(roles)
    .where(eq(roles.slug, 'admin'))
    .limit(1);

  const [user] = await db
    .insert(users)
    .values({
      email: 'system@ai-centre.local',
      name: 'System',
      roleId: adminRows[0]?.id ?? null,
      isActive: true,
    })
    .returning();

  return user.id;
}

// ── Version helpers ──────────────────────────────────────────────────

function bumpPatch(version: string): string {
  const parts = version.split('.').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return '1.0.1';
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

function checksumOf(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

// ── Per-skill sync ──────────────────────────────────────────────────

interface ReferenceFile {
  filename: string;
  content: string;
}

async function uploadReferences(
  slug: string,
  version: string,
  references: ReferenceFile[],
): Promise<void> {
  for (const ref of references) {
    await uploadToBlob(`skills/${slug}/v${version}/references/${ref.filename}`, ref.content);
  }
}

async function syncSkill(
  db: DrizzleClient,
  slug: string,
  content: string,
  checksum: string,
  systemUserId: string,
  metaLookup: Map<string, SkillMeta>,
  references: ReferenceFile[],
  result: SyncResult,
): Promise<void> {
  const meta = metaLookup.get(slug);
  const title = meta?.title ?? slugToTitle(slug);
  const description = meta?.description ?? '';

  // Look up existing skill by slug
  const existingRows = await db
    .select()
    .from(skills)
    .where(eq(skills.slug, slug))
    .limit(1);

  if (existingRows.length === 0) {
    // ── CREATE ──────────────────────────────────────────────────────
    const blobUrl = await uploadToBlob(`skills/${slug}/v1.0.0.md`, content);
    await uploadReferences(slug, '1.0.0', references);

    const [newSkill] = await db
      .insert(skills)
      .values({
        slug,
        title,
        description,
        authorId: systemUserId,
        isOfficial: true,
      })
      .returning();

    const [version] = await db
      .insert(skillVersions)
      .values({
        skillId: newSkill.id,
        version: '1.0.0',
        content,
        contentBlobUrl: blobUrl,
        contentChecksum: checksum,
        status: 'published',
        publishedAt: new Date(),
        publishedById: systemUserId,
      })
      .returning();

    await db
      .update(skills)
      .set({ currentPublishedVersionId: version.id })
      .where(eq(skills.id, newSkill.id));

    await db.insert(auditLog).values({
      entityType: 'skill',
      entityId: newSkill.id,
      action: 'published',
      userId: systemUserId,
      metadata: { version: '1.0.0', source: 'skill-sync', referenceCount: references.length },
    });

    result.created.push(slug);
    return;
  }

  // ── COMPARE ────────────────────────────────────────────────────────
  const skill = existingRows[0];

  if (!skill.currentPublishedVersionId) {
    // Skill exists but has no published version — treat as needing creation
    result.errors.push(`${slug}: exists but has no published version`);
    return;
  }

  const versionRows = await db
    .select()
    .from(skillVersions)
    .where(eq(skillVersions.id, skill.currentPublishedVersionId))
    .limit(1);

  if (versionRows.length === 0) {
    result.errors.push(`${slug}: published version record not found`);
    return;
  }

  const currentVersion = versionRows[0];
  const existingChecksum = currentVersion.contentChecksum ?? checksumOf(currentVersion.content);

  if (existingChecksum === checksum) {
    result.unchanged.push(slug);
    return;
  }

  // ── UPDATE ─────────────────────────────────────────────────────────
  const newVersionStr = bumpPatch(currentVersion.version);
  const blobUrl = await uploadToBlob(`skills/${slug}/v${newVersionStr}.md`, content);
  await uploadReferences(slug, newVersionStr, references);

  const [newVersion] = await db
    .insert(skillVersions)
    .values({
      skillId: skill.id,
      version: newVersionStr,
      content,
      contentBlobUrl: blobUrl,
      contentChecksum: checksum,
      status: 'published',
      publishedAt: new Date(),
      publishedById: systemUserId,
    })
    .returning();

  await db
    .update(skills)
    .set({
      currentPublishedVersionId: newVersion.id,
      title,
      description,
      updatedAt: new Date(),
    })
    .where(eq(skills.id, skill.id));

  await db.insert(auditLog).values({
    entityType: 'skill',
    entityId: skill.id,
    action: 'published',
    userId: systemUserId,
    metadata: {
      version: newVersionStr,
      previousVersion: currentVersion.version,
      source: 'skill-sync',
      referenceCount: references.length,
    },
  });

  result.updated.push(slug);
}

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ── Main entry ──────────────────────────────────────────────────────

export async function syncOfficialSkills(): Promise<SyncResult> {
  const result: SyncResult = { created: [], updated: [], unchanged: [], errors: [] };

  // Only run if DATABASE_URL is set (skip in dev without DB)
  if (!hasDatabase()) {
    console.log('[skill-sync] No DATABASE_URL — skipping sync');
    return result;
  }

  try {
    const db = getDb();

    // Ensure roles exist before looking up / creating users
    await ensureSystemRoles(db);
    const systemUserId = await getOrCreateSystemUser(db);

    // Build metadata lookup from SKILL_DEFINITIONS
    const definitions = getSkillDefinitions();
    const metaLookup = new Map<string, SkillMeta>(definitions.map((d) => [d.slug, d]));

    // Scan skills directory for directory-based skills (skills/<slug>/SKILL.md)
    const skillsDir = join(process.cwd(), 'skills');
    const entries = readdirSync(skillsDir).filter((entry) => {
      const entryPath = join(skillsDir, entry);
      return statSync(entryPath).isDirectory();
    });

    for (const dir of entries) {
      const skillFile = join(skillsDir, dir, 'SKILL.md');
      if (!existsSync(skillFile)) continue;

      const slug = dir;
      const content = readFileSync(skillFile, 'utf-8');
      const checksum = checksumOf(content);

      // Read references/ subdirectory if present
      const references: ReferenceFile[] = [];
      const refsDir = join(skillsDir, dir, 'references');
      if (existsSync(refsDir) && statSync(refsDir).isDirectory()) {
        const refFiles = readdirSync(refsDir).filter((f) => f.endsWith('.md'));
        for (const refFile of refFiles) {
          references.push({
            filename: refFile,
            content: readFileSync(join(refsDir, refFile), 'utf-8'),
          });
        }
      }

      try {
        await syncSkill(db, slug, content, checksum, systemUserId, metaLookup, references, result);
      } catch (err) {
        result.errors.push(`${slug}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  } catch (err) {
    result.errors.push(`Sync failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  console.log(
    `[skill-sync] Created: ${result.created.length}, Updated: ${result.updated.length}, Unchanged: ${result.unchanged.length}, Errors: ${result.errors.length}`,
  );
  if (result.errors.length > 0) {
    console.error('[skill-sync] Errors:', result.errors);
  }

  return result;
}
