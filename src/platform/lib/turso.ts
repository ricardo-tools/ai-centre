/**
 * Turso Platform API wrapper.
 *
 * Provisions per-user SQLite databases via the Turso Platform API.
 * Requires TURSO_ORG and TURSO_API_TOKEN env vars.
 *
 * API docs: https://docs.turso.tech/api-reference
 */

import { Ok, Err } from '@/platform/lib/result';
import type { Result } from '@/platform/lib/result';

// ── Types ──────────────────────────────────────────────────────────

interface TursoDatabase {
  dbId: string;
  name: string;
  hostname: string;
}

interface TursoAuthToken {
  jwt: string;
}

export interface CreateDatabaseResult {
  dbId: string;
  dbName: string;
  dbUrl: string;
}

export interface ProvisionResult {
  dbId: string;
  dbName: string;
  dbUrl: string;
  authToken: string;
}

// ── Config ─────────────────────────────────────────────────────────

function getConfig(): Result<{ org: string; apiToken: string }, Error> {
  const org = process.env.TURSO_ORG;
  const apiToken = process.env.TURSO_API_TOKEN;

  if (!org || !apiToken) {
    return Err(new Error(
      'Turso API not configured. Set TURSO_ORG and TURSO_API_TOKEN environment variables.',
    ));
  }

  return Ok({ org, apiToken });
}

function baseUrl(org: string): string {
  return `https://api.turso.tech/v1/organizations/${org}/databases`;
}

// ── API Methods ────────────────────────────────────────────────────

/**
 * Create a new database in the Turso organization.
 */
export async function createDatabase(name: string): Promise<Result<CreateDatabaseResult, Error>> {
  const config = getConfig();
  if (!config.ok) return config;

  const { org, apiToken } = config.value;
  const url = baseUrl(org);

  console.info('[turso] createDatabase start', { name });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, group: 'default' }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('[turso] createDatabase failed', { name, status: response.status, body });
      return Err(new Error(`Turso API error (${response.status}): ${body}`));
    }

    const data = (await response.json()) as { database: TursoDatabase };
    const db = data.database;
    const dbUrl = `libsql://${db.hostname}`;

    console.info('[turso] createDatabase complete', { name, dbId: db.dbId });

    return Ok({
      dbId: db.dbId,
      dbName: db.name,
      dbUrl,
    });
  } catch (err) {
    console.error('[turso] createDatabase error', { name, error: String(err) });
    return Err(new Error(`Failed to create Turso database: ${String(err)}`));
  }
}

/**
 * Create a full-access auth token for a database.
 * The token is returned but NEVER logged.
 */
export async function createAuthToken(dbName: string): Promise<Result<string, Error>> {
  const config = getConfig();
  if (!config.ok) return config;

  const { org, apiToken } = config.value;
  const url = `${baseUrl(org)}/${dbName}/auth/tokens`;

  console.info('[turso] createAuthToken start', { dbName });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expiration: 'none', authorization: 'full-access' }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('[turso] createAuthToken failed', { dbName, status: response.status, body });
      return Err(new Error(`Turso auth token error (${response.status}): ${body}`));
    }

    const data = (await response.json()) as { jwt: string };

    // Never log the token itself
    console.info('[turso] createAuthToken complete', { dbName });

    return Ok(data.jwt);
  } catch (err) {
    console.error('[turso] createAuthToken error', { dbName, error: String(err) });
    return Err(new Error(`Failed to create Turso auth token: ${String(err)}`));
  }
}

/**
 * Delete a database from the Turso organization.
 */
export async function deleteDatabase(dbName: string): Promise<Result<void, Error>> {
  const config = getConfig();
  if (!config.ok) return config;

  const { org, apiToken } = config.value;
  const url = `${baseUrl(org)}/${dbName}`;

  console.info('[turso] deleteDatabase start', { dbName });

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('[turso] deleteDatabase failed', { dbName, status: response.status, body });
      return Err(new Error(`Turso delete error (${response.status}): ${body}`));
    }

    console.info('[turso] deleteDatabase complete', { dbName });
    return Ok(undefined);
  } catch (err) {
    console.error('[turso] deleteDatabase error', { dbName, error: String(err) });
    return Err(new Error(`Failed to delete Turso database: ${String(err)}`));
  }
}

/**
 * Provision a database: create it + generate an auth token.
 * Atomic-ish: if token creation fails after DB creation, the DB is cleaned up.
 */
export async function provisionDatabase(name: string): Promise<Result<ProvisionResult, Error>> {
  console.info('[turso] provisionDatabase start', { name });

  const dbResult = await createDatabase(name);
  if (!dbResult.ok) return dbResult;

  const tokenResult = await createAuthToken(dbResult.value.dbName);
  if (!tokenResult.ok) {
    // Clean up the created DB
    console.warn('[turso] token creation failed, cleaning up database', { name });
    await deleteDatabase(dbResult.value.dbName);
    return tokenResult;
  }

  console.info('[turso] provisionDatabase complete', { name, dbId: dbResult.value.dbId });

  return Ok({
    dbId: dbResult.value.dbId,
    dbName: dbResult.value.dbName,
    dbUrl: dbResult.value.dbUrl,
    authToken: tokenResult.value,
  });
}
