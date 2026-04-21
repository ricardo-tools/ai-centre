import { NextRequest } from 'next/server';
import { resolvePin, deletePin } from '../../../../src/acl/pin.repository';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  if (body.action === 'resolve') {
    if (!body.resolvedBy) {
      return Response.json(
        { error: 'Missing resolvedBy field' },
        { status: 400 },
      );
    }

    await resolvePin(id, body.resolvedBy);
    return Response.json({ success: true }, { status: 200 });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await deletePin(id);
  return Response.json({ success: true }, { status: 200 });
}
