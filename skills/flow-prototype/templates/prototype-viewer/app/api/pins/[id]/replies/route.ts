import { NextRequest } from 'next/server';
import { getRepliesForPin, addReply } from '../../../../../src/acl/pin.repository';
import { fromPinReply } from '../../../../../src/acl/pin.mapper';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const replies = await getRepliesForPin(id);
  return Response.json(replies.map(fromPinReply), { status: 200 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { text, author } = body;

  if (!text || !author) {
    return Response.json(
      { error: 'Missing required fields: text, author' },
      { status: 400 },
    );
  }

  const reply = await addReply(id, text, author);
  return Response.json(fromPinReply(reply), { status: 201 });
}
