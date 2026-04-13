import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateQuotas } from '@/features/workspace/action';

/**
 * POST /api/workspace/:userId/quotas
 *
 * Update a user's workspace quotas. Admin only (session-based).
 * Body: { skillLimit?, schemaLimit?, storageLimitBytes? }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const result = await updateQuotas({
    userId,
    skillLimit: typeof body.skillLimit === 'number' ? body.skillLimit : undefined,
    schemaLimit: typeof body.schemaLimit === 'number' ? body.schemaLimit : undefined,
    storageLimitBytes: typeof body.storageLimitBytes === 'number' ? body.storageLimitBytes : undefined,
  });

  if (!result.ok) {
    const status = result.error.message.includes('permission') ? 403 : 500;
    return NextResponse.json({ error: result.error.message }, { status });
  }

  return NextResponse.json(result.value);
}
