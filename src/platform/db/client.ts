/**
 * Database client factory — returns the correct Drizzle client based on DATABASE_URL.
 *
 * - Local Postgres (localhost/127.0.0.1): uses `pg` driver
 * - Remote Neon: uses `@neondatabase/serverless` driver
 *
 * Each test worker server gets its own DATABASE_URL pointing to its own database.
 * No schema routing needed — standard public schema in each database.
 */

type DrizzleClient = ReturnType<typeof import('drizzle-orm/neon-http').drizzle> | ReturnType<typeof import('drizzle-orm/node-postgres').drizzle>;

let cachedDb: DrizzleClient | null = null;

export function getDb(): DrizzleClient {
  if (cachedDb) return cachedDb;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not configured');

  const isLocal = url.includes('localhost') || url.includes('127.0.0.1');

  if (isLocal) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require('pg') as typeof import('pg');
    const { drizzle } = require('drizzle-orm/node-postgres') as typeof import('drizzle-orm/node-postgres');
    const pool = new Pool({ connectionString: url });
    cachedDb = drizzle(pool);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { neon } = require('@neondatabase/serverless') as typeof import('@neondatabase/serverless');
    const { drizzle } = require('drizzle-orm/neon-http') as typeof import('drizzle-orm/neon-http');
    const sql = neon(url);
    cachedDb = drizzle(sql);
  }

  return cachedDb;
}

export function hasDatabase(): boolean {
  return !!process.env.DATABASE_URL;
}
