import { createClient, type Client } from '@libsql/client';

/**
 * Single database client instance.
 * - Local: embedded SQLite file at data/prototype-viewer.db
 * - Production: Turso cloud via TURSO_DATABASE_URL + TURSO_AUTH_TOKEN
 */

let _client: Client | null = null;

export function getDb(): Client {
  if (!_client) {
    _client = createClient({
      url: process.env.TURSO_DATABASE_URL ?? 'file:data/prototype-viewer.db',
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return _client;
}
