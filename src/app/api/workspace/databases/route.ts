import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/platform/lib/oauth';

/**
 * POST /api/workspace/databases
 *
 * Provision a new Turso database for the authenticated user.
 * Auth via Bearer token. Body: { name: string }.
 * Returns: { dbUrl, authToken, dbName }.
 */
export async function POST(request: Request) {
  // ── Auth ────────────────────────────────────────────────────────
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

  // ── Check Turso config ──────────────────────────────────────────
  if (!process.env.TURSO_API_TOKEN) {
    console.warn('[workspace-databases] TURSO_API_TOKEN not configured');
    return NextResponse.json(
      { error: 'service_unavailable', message: 'Database provisioning is not configured. Set TURSO_API_TOKEN and TURSO_ORG.' },
      { status: 503 },
    );
  }

  // ── Parse body ──────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json', message: 'Request body must be valid JSON' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name || !/^[a-z0-9][a-z0-9-]{0,62}$/.test(name)) {
    return NextResponse.json(
      { error: 'invalid_name', message: 'Database name must be 1-63 chars, lowercase alphanumeric and hyphens, starting with a letter or digit.' },
      { status: 400 },
    );
  }

  try {
    const { eq, and, count } = await import('drizzle-orm');
    const { userQuotas, userDatabases } = await import('@/platform/db/schema');
    const { getDb } = await import('@/platform/db/client');
    const db = getDb();

    // ── Ensure quota row exists ─────────────────────────────────
    const existingQuota = await db
      .select()
      .from(userQuotas)
      .where(eq(userQuotas.userId, userId))
      .limit(1);

    if (existingQuota.length === 0) {
      await db.insert(userQuotas).values({ userId });
    }

    const [quota] = await db
      .select()
      .from(userQuotas)
      .where(eq(userQuotas.userId, userId))
      .limit(1);

    // ── Check for existing DB with same name ────────────────────
    const existing = await db
      .select()
      .from(userDatabases)
      .where(and(eq(userDatabases.userId, userId), eq(userDatabases.dbName, name)))
      .limit(1);

    if (existing.length > 0) {
      console.info('[workspace-databases] returning existing database', { userId, name });
      // Return existing DB info (without auth token — user must create a new token if needed)
      return NextResponse.json({
        dbUrl: existing[0].dbUrl,
        dbName: existing[0].dbName,
        message: 'Database already exists for this name.',
      });
    }

    // ── Check quota ─────────────────────────────────────────────
    const [dbCount] = await db
      .select({ count: count() })
      .from(userDatabases)
      .where(eq(userDatabases.userId, userId));

    const schemasUsed = dbCount?.count ?? 0;
    if (schemasUsed >= quota.schemaLimit) {
      console.warn('[workspace-databases] quota exceeded', { userId, schemasUsed, schemaLimit: quota.schemaLimit });
      return NextResponse.json(
        {
          error: 'quota_exceeded',
          message: `Database limit reached (${schemasUsed}/${quota.schemaLimit}). Contact admin to increase your quota.`,
          usage: { schemasUsed, schemaLimit: quota.schemaLimit },
        },
        { status: 429 },
      );
    }

    // ── Provision via Turso API ─────────────────────────────────
    // Prefix with a short userId segment to ensure uniqueness across users
    const tursoDbName = `${userId.slice(0, 8)}-${name}`;

    const { provisionDatabase } = await import('@/platform/lib/turso');
    const provisionResult = await provisionDatabase(tursoDbName);

    if (!provisionResult.ok) {
      console.error('[workspace-databases] provision failed', { userId, name, error: provisionResult.error.message });
      return NextResponse.json(
        { error: 'provision_failed', message: provisionResult.error.message },
        { status: 502 },
      );
    }

    const { dbId, dbName: actualDbName, dbUrl, authToken } = provisionResult.value;

    // ── Store in DB ─────────────────────────────────────────────
    await db.insert(userDatabases).values({
      userId,
      dbName: name,
      dbUrl,
      tursoDbId: dbId,
    });

    console.info('[workspace-databases] database provisioned', { userId, name, tursoDbName: actualDbName });

    return NextResponse.json({
      dbUrl,
      authToken,
      dbName: name,
    });
  } catch (err) {
    console.error('[workspace-databases] POST failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

/**
 * GET /api/workspace/databases
 *
 * List all databases for the authenticated user.
 * Auth via Bearer token.
 */
export async function GET(request: Request) {
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

  try {
    const { eq } = await import('drizzle-orm');
    const { userDatabases } = await import('@/platform/db/schema');
    const { getDb } = await import('@/platform/db/client');
    const db = getDb();

    const databases = await db
      .select({
        id: userDatabases.id,
        dbName: userDatabases.dbName,
        dbUrl: userDatabases.dbUrl,
        createdAt: userDatabases.createdAt,
      })
      .from(userDatabases)
      .where(eq(userDatabases.userId, userId));

    console.info('[workspace-databases] listed databases', { userId, count: databases.length });
    return NextResponse.json({ databases });
  } catch (err) {
    console.error('[workspace-databases] GET failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
