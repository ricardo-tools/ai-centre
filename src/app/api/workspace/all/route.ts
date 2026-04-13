import { NextResponse } from 'next/server';
import { fetchAllWorkspaces } from '@/features/workspace/action';

/**
 * GET /api/workspace/all
 *
 * Returns all users' workspace quotas. Admin only (session-based).
 */
export async function GET() {
  const result = await fetchAllWorkspaces();
  if (!result.ok) {
    const status = result.error.message.includes('permission') ? 403 : 500;
    return NextResponse.json({ error: result.error.message }, { status });
  }

  return NextResponse.json(result.value);
}
