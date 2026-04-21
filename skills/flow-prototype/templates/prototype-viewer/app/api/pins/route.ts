import { NextRequest } from 'next/server';
import { getPinsForPrototype, createPin } from '../../../src/acl/pin.repository';
import { fromPin } from '../../../src/acl/pin.mapper';

export async function GET(request: NextRequest) {
  const project = request.nextUrl.searchParams.get('project');
  const prototype = request.nextUrl.searchParams.get('prototype');

  if (!project || !prototype) {
    return Response.json(
      { error: 'Missing project or prototype query parameter' },
      { status: 400 },
    );
  }

  const pins = await getPinsForPrototype(project, prototype);
  return Response.json(pins.map(fromPin), { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { projectSlug, prototypeSlug, xPercent, yPercent, text, author } = body;

  if (!projectSlug || !prototypeSlug || xPercent == null || yPercent == null || !text || !author) {
    return Response.json(
      { error: 'Missing required fields: projectSlug, prototypeSlug, xPercent, yPercent, text, author' },
      { status: 400 },
    );
  }

  const pin = await createPin(projectSlug, prototypeSlug, xPercent, yPercent, text, author);
  return Response.json(fromPin(pin), { status: 201 });
}
