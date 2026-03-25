import { execSync, spawn } from 'child_process';
import { createConnection } from 'net';

const DB_URL = process.env.DATABASE_URL || 'postgresql://aicentre:aicentre@localhost:5433/aicentre';
const SKIP_AUTH = 'true';

function log(msg) { console.log(`\x1b[32m[dev]\x1b[0m ${msg}`); }
function warn(msg) { console.log(`\x1b[33m[dev]\x1b[0m ${msg}`); }

function checkPostgres() {
  return new Promise((resolve) => {
    const socket = createConnection({ host: 'localhost', port: 5433 });
    socket.on('connect', () => { socket.destroy(); resolve(true); });
    socket.on('error', () => { socket.destroy(); resolve(false); });
    socket.setTimeout(2000, () => { socket.destroy(); resolve(false); });
  });
}

async function waitForPostgres(maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    if (await checkPostgres()) return true;
    await new Promise(r => setTimeout(r, 1000));
  }
  return false;
}

async function main() {
  log('Starting AI Centre development environment...');

  // 1. Check Postgres
  if (await checkPostgres()) {
    log('Postgres already running.');
  } else {
    warn('Postgres not running — starting Docker...');
    try {
      execSync('docker compose up -d', { stdio: 'inherit', cwd: process.cwd() });
    } catch {
      console.error('ERROR: Docker compose failed. Is Docker running?');
      process.exit(1);
    }

    warn('Waiting for Postgres...');
    if (await waitForPostgres()) {
      log('Postgres is ready.');
    } else {
      console.error('ERROR: Postgres failed to start after 30s');
      process.exit(1);
    }
  }

  // 2. Clean .next cache
  log('Cleaning .next cache...');
  execSync('rm -rf .next', { stdio: 'inherit' });

  // 3. Push schema (creates/updates tables directly — bypasses drizzle.config.ts
  //    to avoid @neondatabase/serverless driver which can't connect to local Postgres)
  log('Pushing database schema...');
  try {
    execSync(
      `npx drizzle-kit push --dialect postgresql --schema ./src/platform/db/schema.ts --url "${DB_URL}" --force`,
      { stdio: 'inherit', env: { ...process.env } },
    );
  } catch {
    warn('Schema push had warnings (this is normal for first run).');
  }

  // 4. Seed dev data (roles, permissions, dev user)
  log('Seeding dev data...');
  try {
    execSync(`node -e "
      const { Pool } = require('pg');
      const pool = new Pool({ connectionString: '${DB_URL}' });
      (async () => {
        const client = await pool.connect();
        try {
          // Create roles if not exist
          await client.query(\\\`
            INSERT INTO roles (id, slug, name, description, is_system)
            VALUES
              (gen_random_uuid(), 'admin', 'Admin', 'Full access', true),
              (gen_random_uuid(), 'member', 'Member', 'Standard access', true)
            ON CONFLICT (slug) DO NOTHING;
          \\\`);

          // Create dev user if not exist
          const { rows: adminRows } = await client.query(\\\`SELECT id FROM roles WHERE slug = 'admin' LIMIT 1\\\`);
          const adminRoleId = adminRows[0]?.id ?? null;

          await client.query(\\\`
            INSERT INTO users (id, email, name, role_id, is_active)
            VALUES ('00000000-0000-0000-0000-000000000000', 'dev@local', 'Dev User', $1, true)
            ON CONFLICT (id) DO NOTHING;
          \\\`, [adminRoleId]);

          console.log('[seed] Dev data ready (roles + dev user)');
        } finally {
          client.release();
          await pool.end();
        }
      })();
    "`, { stdio: 'inherit', env: { ...process.env } });
  } catch {
    warn('Dev seed had warnings (roles/user may already exist).');
  }

  log('Building application...');
  execSync('npx next build', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: DB_URL, SKIP_AUTH },
  });

  // 6. Start
  log('Starting server on http://localhost:3000');
  const server = spawn('npx', ['next', 'start'], {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: DB_URL, SKIP_AUTH },
  });

  server.on('close', (code) => process.exit(code ?? 0));

  process.on('SIGINT', () => { server.kill('SIGINT'); });
  process.on('SIGTERM', () => { server.kill('SIGTERM'); });
}

main().catch(err => { console.error(err); process.exit(1); });
