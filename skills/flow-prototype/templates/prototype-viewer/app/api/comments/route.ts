import { NextRequest } from 'next/server';
import { getComments, addComment, deleteComment } from '../../../src/acl/comment.repository';
import { Comment } from '../../../src/domain/Comment';
import { fromComment } from '../../../src/acl/comment.mapper';
import { v4 as uuidv4 } from 'uuid';

function parseKey(key: string): { projectSlug: string; prototypeSlug: string } | null {
  const parts = key.split('/');
  if (parts.length < 2) return null;
  return { projectSlug: parts[0], prototypeSlug: parts.slice(1).join('/') };
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key');
  if (!key) return Response.json([], { status: 200 });

  const parsed = parseKey(key);
  if (!parsed) return Response.json([], { status: 200 });

  const comments = await getComments(parsed.projectSlug, parsed.prototypeSlug);
  return Response.json(comments.map(fromComment));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { key, text, author } = body;

  if (!key || !text || !author) {
    return Response.json({ error: 'Missing key, text, or author' }, { status: 400 });
  }

  const parsed = parseKey(key);
  if (!parsed) {
    return Response.json({ error: 'Invalid key format' }, { status: 400 });
  }

  const comment = new Comment(uuidv4(), text, author, new Date());
  const saved = await addComment(parsed.projectSlug, parsed.prototypeSlug, comment);
  return Response.json(fromComment(saved), { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { key, id } = body;

  if (!key || !id) {
    return Response.json({ error: 'Missing key or id' }, { status: 400 });
  }

  const deleted = await deleteComment(id);
  return Response.json({ deleted }, { status: deleted ? 200 : 404 });
}
