import { type NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/platform/lib/auth';

/**
 * GET /api/blob?url=<blobUrl>
 *
 * Authenticated proxy for private Vercel Blob storage.
 * Fetches the blob server-side using the BLOB_READ_WRITE_TOKEN
 * and streams it to the authenticated client.
 */
export async function GET(request: NextRequest) {
  // Auth check
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = request.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  // Only allow proxying from our Vercel Blob store
  if (!url.includes('.blob.vercel-storage.com/') && !url.startsWith('file://')) {
    return NextResponse.json({ error: 'Invalid blob URL' }, { status: 400 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Blob storage not configured' }, { status: 503 });
  }

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Blob fetch failed: ${response.status}` }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') ?? 'application/octet-stream';
    const body = response.body;

    return new NextResponse(body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('[blob-proxy] Fetch failed:', err);
    return NextResponse.json({ error: 'Failed to fetch blob' }, { status: 500 });
  }
}
