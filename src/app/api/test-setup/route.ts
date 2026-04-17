import { NextResponse, type NextRequest } from 'next/server';
import { sql } from 'drizzle-orm';
import { getDb, hasDatabase } from '@/platform/db/client';

/**
 * POST /api/test-setup — E2E test data management (dev only).
 *
 * Actions:
 *   { action: "mark" }                       — Record a high-water mark timestamp
 *   { action: "rollback-to-mark", mark }     — Delete rows created after the mark (targeted cleanup)
 *   { action: "clean-transactional" }        — Delete ALL non-seed tables (13 tables, global-setup only)
 *   { action: "clean", tables: [...] }       — Delete specific tables
 *   { action: "seed", data: {...} }          — Insert fixture rows
 *   { action: "verify-seed" }                — Check global seed data exists
 */

// Tables that are part of the global seed — never truncated by clean-transactional
const SEED_TABLES = new Set([
  'roles',
  'role_permissions',
  'users',
  'skills',
  'skill_versions',
  'archetypes',
  'archetype_versions',
]);

// Social tables — the most frequently cleaned subset (5 tables)
const SOCIAL_TABLES = [
  'chat_messages',
  'chat_conversations',
  'notifications',
  'activity_events',
  'reactions',
  'bookmarks',
  'comments',
];

// All transactional tables in FK-safe truncation order (children before parents)
const TRANSACTIONAL_TABLES = [
  'chat_messages',
  'chat_conversations',
  'notifications',
  'notification_preferences',
  'activity_events',
  'reactions',
  'bookmarks',
  'comments',
  'showcase_views',
  'skill_downloads',
  'showcase_uploads',
  'audit_log',
  'verification_tokens',
  'invitations',
];

export async function POST(request: NextRequest) {
  if (process.env.SKIP_AUTH !== 'true') {
    return NextResponse.json({ error: 'Forbidden — dev/test only' }, { status: 403 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({ ok: true, message: 'No database configured' });
  }

  const db = getDb();
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const action = body.action as string;

  try {
    switch (action) {
      case 'reset-schema': {
        const schema = process.env.TEST_SCHEMA;
        if (!schema) {
          return NextResponse.json({ error: 'TEST_SCHEMA env var not set' }, { status: 400 });
        }
        await db.execute(sql.raw(`DROP SCHEMA IF EXISTS ${schema} CASCADE`));
        await db.execute(sql.raw(`CREATE SCHEMA ${schema}`));
        // Tables are pushed by drizzle-kit in global setup, not here
        return NextResponse.json({ ok: true, action: 'reset-schema', schema });
      }

      case 'clean-transactional': {
        for (const table of TRANSACTIONAL_TABLES) {
          await db.execute(sql.raw(`DELETE FROM "${table}"`));
        }
        return NextResponse.json({ ok: true, action: 'clean-transactional', tables: TRANSACTIONAL_TABLES });
      }

      case 'clean': {
        const tables = body.tables as string[];
        if (!Array.isArray(tables) || tables.length === 0) {
          return NextResponse.json({ error: 'tables must be a non-empty array' }, { status: 400 });
        }
        for (const table of tables) {
          if (SEED_TABLES.has(table)) {
            return NextResponse.json({ error: `Cannot truncate seed table: ${table}` }, { status: 400 });
          }
          await db.execute(sql.raw(`DELETE FROM "${table}"`));
        }
        return NextResponse.json({ ok: true, action: 'clean', tables });
      }

      case 'seed': {
        const data = body.data as Record<string, Record<string, unknown>[]>;
        if (!data || typeof data !== 'object') {
          return NextResponse.json({ error: 'data must be { tableName: [rows] }' }, { status: 400 });
        }
        const inserted: Record<string, number> = {};
        for (const [table, rows] of Object.entries(data)) {
          if (!Array.isArray(rows) || rows.length === 0) continue;
          const columns = Object.keys(rows[0]);
          const colList = columns.map((c) => `"${c}"`).join(', ');
          for (const row of rows) {
            const values = columns.map((c) => {
              const v = row[c];
              if (v === null || v === undefined) return 'NULL';
              if (typeof v === 'number' || typeof v === 'boolean') return String(v);
              return `'${String(v).replace(/'/g, "''")}'`;
            });
            await db.execute(sql.raw(`INSERT INTO "${table}" (${colList}) VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING`));
          }
          inserted[table] = rows.length;
        }
        return NextResponse.json({ ok: true, action: 'seed', inserted });
      }

      case 'verify-seed': {
        const rolesResult = await db.execute(sql`SELECT count(*)::int as count FROM roles`);
        const usersResult = await db.execute(sql`SELECT count(*)::int as count FROM users`);
        const skillsResult = await db.execute(sql`SELECT count(*)::int as count FROM skills`);
        const rows = (r: typeof rolesResult) => (r as unknown as { rows: Record<string, number>[] }).rows ?? r;
        return NextResponse.json({
          ok: true,
          action: 'verify-seed',
          counts: {
            roles: rows(rolesResult)[0]?.count ?? 0,
            users: rows(usersResult)[0]?.count ?? 0,
            skills: rows(skillsResult)[0]?.count ?? 0,
          },
        });
      }

      case 'mark': {
        // Record a high-water mark — tests use this to rollback only their own changes
        const markResult = await db.execute(sql`SELECT clock_timestamp() as mark`);
        const markRows = (markResult as unknown as { rows: Record<string, string>[] }).rows ?? markResult;
        return NextResponse.json({ ok: true, action: 'mark', mark: markRows[0]?.mark });
      }

      case 'rollback-to-mark': {
        const mark = body.mark as string;
        if (!mark) {
          return NextResponse.json({ error: 'mark timestamp is required' }, { status: 400 });
        }
        // Delete from each social table — indexed on created_at for speed
        for (const table of SOCIAL_TABLES) {
          await db.execute(sql.raw(`DELETE FROM "${table}" WHERE created_at > '${mark}'`));
        }
        return NextResponse.json({ ok: true, action: 'rollback-to-mark' });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    console.error('[test-setup]', err);
    return NextResponse.json({ error: 'Action failed', details: String(err) }, { status: 500 });
  }
}
