/**
 * Playwright global setup — creates per-worker databases.
 *
 * Each worker gets its own database: aicentre_test_0 through aicentre_test_3.
 * drizzle-kit push creates tables in the standard public schema of each DB.
 * No schema routing needed — each server connects to its own database.
 *
 * For each worker (0..N-1):
 *   1. Create database (if not exists)
 *   2. Push tables via drizzle-kit (skip if tables exist)
 *   3. Seed roles + users via psql
 *   4. Wait for server to be ready
 *   5. Clean transactional data from previous run
 *   6. Seed base social data via psql
 *   7. Wait 2s, record baseTimestamp
 */

import { execSync, exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { createTestApi } from './test-api';
import { BASE } from './base-data';

const execAsync = promisify(exec);

const DEV_DB_URL = 'postgresql://aicentre:aicentre@localhost:5433/aicentre';
const DB_BASE = 'postgresql://aicentre:aicentre@localhost:5433';
const WORKER_COUNT = 4;
const BASE_PORT = 3100;
const MAX_WAIT_MS = 60_000;
const POLL_INTERVAL_MS = 1_000;

function workerDbUrl(i: number): string {
  return `${DB_BASE}/aicentre_test_${i}`;
}

function workerDbName(i: number): string {
  return `aicentre_test_${i}`;
}

function psql(dbUrl: string, query: string) {
  execSync(`psql "${dbUrl}" -c "${query.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, { stdio: 'pipe' });
}

function createDatabase(i: number) {
  try {
    execSync(`psql "${DEV_DB_URL}" -c "CREATE DATABASE ${workerDbName(i)};" 2>/dev/null || true`, { stdio: 'pipe' });
  } catch { /* exists */ }
}

function tablesExist(i: number): boolean {
  try {
    const result = execSync(
      `psql "${workerDbUrl(i)}" -tAc "SELECT count(*) FROM information_schema.tables WHERE table_schema='public' AND table_name='roles'"`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] },
    );
    return result.trim() !== '0';
  } catch {
    return false;
  }
}

function seedRoles(i: number) {
  psql(workerDbUrl(i), `
    INSERT INTO roles (id, slug, name, description, is_system)
    VALUES
      (gen_random_uuid(), 'admin', 'Admin', 'Full access', true),
      (gen_random_uuid(), 'member', 'Member', 'Standard access', true)
    ON CONFLICT (slug) DO NOTHING;
  `);
}

function seedUsers(i: number) {
  for (const user of Object.values(BASE.users)) {
    try {
      psql(workerDbUrl(i),
        `INSERT INTO users (id, email, name, role_id, is_active) VALUES ('${user.id}', '${user.email}', '${user.name}', (SELECT id FROM roles WHERE slug = '${user.roleSlug}'), true) ON CONFLICT (id) DO NOTHING;`,
      );
    } catch { /* exists */ }
  }
}

function seedBaseData(i: number) {
  const statements = BASE.toSeedStatements();
  for (const stmt of statements) {
    try { psql(workerDbUrl(i), stmt); } catch { /* ON CONFLICT */ }
  }
}

async function pushSchema(i: number) {
  await execAsync(
    `npx drizzle-kit push --dialect postgresql --schema ./src/platform/db/schema.ts --url "${workerDbUrl(i)}" --force`,
  );
}

async function waitForServer(port: number): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < MAX_WAIT_MS) {
    try {
      const res = await fetch(`http://localhost:${port}/api/health`);
      if (res.status === 200 || res.status === 503) return;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
  throw new Error(`Server on port ${port} did not become ready within ${MAX_WAIT_MS}ms`);
}

async function setupWorker(i: number) {
  createDatabase(i);

  if (!tablesExist(i)) {
    console.log(`[global-setup] Pushing schema to ${workerDbName(i)}...`);
    await pushSchema(i);
  } else {
    console.log(`[global-setup] ${workerDbName(i)} tables exist, skipping push.`);
  }

  seedRoles(i);
  seedUsers(i);
  console.log(`[global-setup] ${workerDbName(i)} roles + users ready.`);
}

export default async function globalSetup() {
  // Create databases + push tables + seed roles/users — all workers in parallel
  console.log(`[global-setup] Setting up ${WORKER_COUNT} worker databases in parallel...`);
  await Promise.all(
    Array.from({ length: WORKER_COUNT }, (_, i) => setupWorker(i)),
  );

  // Wait for all servers
  console.log(`[global-setup] Waiting for ${WORKER_COUNT} servers...`);
  await Promise.all(
    Array.from({ length: WORKER_COUNT }, (_, i) => waitForServer(BASE_PORT + i)),
  );
  console.log('[global-setup] All servers ready.');

  // Per worker: clean transactional data, seed base social data, record baseTimestamp
  for (let i = 0; i < WORKER_COUNT; i++) {
    const dbName = workerDbName(i);
    const api = createTestApi(BASE_PORT + i);

    // Clean leftover transactional data
    await api.cleanTransactional();

    // Verify core data
    const result = await api.verifySeed();
    console.log(`[global-setup] ${dbName}: ${result.counts.roles} roles, ${result.counts.users} users, ${result.counts.skills} skills`);

    // Seed base social data via direct psql (synchronous — committed before return)
    seedBaseData(i);
    console.log(`[global-setup] ${dbName} base social data seeded.`);

    // Wait 2s to guarantee all created_at < baseTimestamp
    await new Promise((r) => setTimeout(r, 2000));

    // Record baseTimestamp
    const { mark } = await api.mark();
    const markFile = path.join(__dirname, `.global-mark-${i}`);
    fs.writeFileSync(markFile, mark, 'utf-8');
    console.log(`[global-setup] ${dbName} baseTimestamp: ${mark}`);
  }

  console.log('[global-setup] Done — all workers ready with isolated databases.');
}
