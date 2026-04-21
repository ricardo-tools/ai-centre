import { getDb } from '../db/client';
import { Pin } from '../domain/Pin';
import { PinReply } from '../domain/PinReply';
import { toPin, toPinReply, type RawPin, type RawPinReply } from './pin.mapper';
import { v4 as uuid } from 'uuid';

export async function getOpenPinCountForProject(projectSlug: string): Promise<number> {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT COUNT(*) as cnt FROM pins WHERE project_slug = ? AND status = 'open'`,
    args: [projectSlug],
  });
  return Number(result.rows[0].cnt);
}

export async function getPinsForPrototype(
  projectSlug: string,
  prototypeSlug: string,
): Promise<Pin[]> {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT p.id, p.project_slug, p.prototype_slug, p.x_percent, p.y_percent,
                 p.text, p.author, p.status, p.resolved_by, p.resolved_at, p.created_at,
                 COUNT(r.id) AS reply_count
          FROM pins p
          LEFT JOIN pin_replies r ON r.pin_id = p.id
          WHERE p.project_slug = ? AND p.prototype_slug = ?
          GROUP BY p.id
          ORDER BY p.created_at ASC`,
    args: [projectSlug, prototypeSlug],
  });

  return result.rows.map((row) =>
    toPin({
      id: row.id as string,
      project_slug: row.project_slug as string,
      prototype_slug: row.prototype_slug as string,
      x_percent: row.x_percent as number,
      y_percent: row.y_percent as number,
      text: row.text as string,
      author: row.author as string,
      status: row.status as string,
      resolved_by: row.resolved_by as string | null,
      resolved_at: row.resolved_at as string | null,
      created_at: row.created_at as string,
      reply_count: Number(row.reply_count),
    }),
  );
}

export async function createPin(
  projectSlug: string,
  prototypeSlug: string,
  xPercent: number,
  yPercent: number,
  text: string,
  author: string,
): Promise<Pin> {
  const db = getDb();
  const id = uuid();
  const createdAt = new Date().toISOString();

  await db.execute({
    sql: `INSERT INTO pins (id, project_slug, prototype_slug, x_percent, y_percent, text, author, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, projectSlug, prototypeSlug, xPercent, yPercent, text, author, createdAt],
  });

  return new Pin(
    id,
    projectSlug,
    prototypeSlug,
    xPercent,
    yPercent,
    text,
    author,
    'open',
    null,
    null,
    new Date(createdAt),
    0,
  );
}

export async function resolvePin(id: string, resolvedBy: string): Promise<void> {
  const db = getDb();
  const resolvedAt = new Date().toISOString();

  await db.execute({
    sql: `UPDATE pins SET status = 'resolved', resolved_by = ?, resolved_at = ? WHERE id = ?`,
    args: [resolvedBy, resolvedAt, id],
  });
}

export async function deletePin(id: string): Promise<void> {
  const db = getDb();

  await db.execute({
    sql: `DELETE FROM pins WHERE id = ?`,
    args: [id],
  });
}

export async function getRepliesForPin(pinId: string): Promise<PinReply[]> {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT id, pin_id, text, author, created_at
          FROM pin_replies
          WHERE pin_id = ?
          ORDER BY created_at ASC`,
    args: [pinId],
  });

  return result.rows.map((row) =>
    toPinReply({
      id: row.id as string,
      pin_id: row.pin_id as string,
      text: row.text as string,
      author: row.author as string,
      created_at: row.created_at as string,
    }),
  );
}

export async function getOpenPinCountForPrototype(
  projectSlug: string,
  prototypeSlug: string,
): Promise<number> {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT COUNT(*) as cnt FROM pins WHERE project_slug = ? AND prototype_slug = ? AND status = 'open'`,
    args: [projectSlug, prototypeSlug],
  });
  return Number(result.rows[0].cnt);
}

export async function addReply(
  pinId: string,
  text: string,
  author: string,
): Promise<PinReply> {
  const db = getDb();
  const id = uuid();
  const createdAt = new Date().toISOString();

  await db.execute({
    sql: `INSERT INTO pin_replies (id, pin_id, text, author, created_at)
          VALUES (?, ?, ?, ?, ?)`,
    args: [id, pinId, text, author, createdAt],
  });

  return new PinReply(id, pinId, text, author, new Date(createdAt));
}
