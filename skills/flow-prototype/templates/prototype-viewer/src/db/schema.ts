/**
 * SQL schema for the prototype viewer app.
 * All statements use CREATE TABLE IF NOT EXISTS — idempotent.
 */

export const SCHEMA_STATEMENTS = [
  /* --- Comments (migrated from JSON) --- */
  `CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    project_slug TEXT NOT NULL,
    prototype_slug TEXT NOT NULL,
    text TEXT NOT NULL,
    author TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(id)
  )`,

  `CREATE INDEX IF NOT EXISTS idx_comments_prototype
    ON comments(project_slug, prototype_slug)`,

  /* --- Review Pins --- */
  `CREATE TABLE IF NOT EXISTS pins (
    id TEXT PRIMARY KEY,
    project_slug TEXT NOT NULL,
    prototype_slug TEXT NOT NULL,
    x_percent REAL NOT NULL,
    y_percent REAL NOT NULL,
    text TEXT NOT NULL,
    author TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'resolved')),
    resolved_by TEXT,
    resolved_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(id)
  )`,

  `CREATE INDEX IF NOT EXISTS idx_pins_prototype
    ON pins(project_slug, prototype_slug)`,

  `CREATE INDEX IF NOT EXISTS idx_pins_status
    ON pins(project_slug, prototype_slug, status)`,

  /* --- Pin Replies --- */
  `CREATE TABLE IF NOT EXISTS pin_replies (
    id TEXT PRIMARY KEY,
    pin_id TEXT NOT NULL REFERENCES pins(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    author TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(id)
  )`,

  `CREATE INDEX IF NOT EXISTS idx_pin_replies_pin
    ON pin_replies(pin_id)`,
] as const;
