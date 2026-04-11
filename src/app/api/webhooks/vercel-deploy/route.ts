/**
 * Webhook handler for Vercel deployment status updates.
 *
 * Vercel sends POST requests here when deployment status changes.
 * On success: fetches the deployment screenshot and sets it as the showcase thumbnail.
 * On failure: stores the build error message for display in the viewer.
 *
 * Register this URL in Vercel project settings → Webhooks:
 *   POST https://ai.ezycollect.tools/api/webhooks/vercel-deploy
 *
 * Required env var: VERCEL_WEBHOOK_SECRET (for signature verification)
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createHmac } from 'crypto';

export async function POST(request: NextRequest): Promise<Response> {
  // Verify webhook signature
  const secret = process.env.VERCEL_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[webhook:vercel-deploy] VERCEL_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get('x-vercel-signature');

  if (!signature) {
    console.warn('[webhook:vercel-deploy] Missing x-vercel-signature header');
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  const expectedSig = createHmac('sha1', secret).update(rawBody).digest('hex');
  if (signature !== expectedSig) {
    console.warn('[webhook:vercel-deploy] Invalid signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: VercelWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Only handle deployment events we care about
  const handledEvents = ['deployment.created', 'deployment.succeeded', 'deployment.error', 'deployment.canceled'];
  if (!handledEvents.includes(payload.type)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const deploymentId = payload.payload?.deployment?.id;
  if (!deploymentId) {
    console.warn('[webhook:vercel-deploy] No deployment ID in payload');
    return NextResponse.json({ ok: true, skipped: true });
  }

  console.info('[webhook:vercel-deploy] received:', {
    type: payload.type,
    deploymentId,
    url: payload.payload?.deployment?.url,
  });

  try {
    const { getDb } = await import('@/platform/db/client');
    const { showcaseUploads } = await import('@/platform/db/schema');
    const { eq } = await import('drizzle-orm');
    const db = getDb();

    // Find the showcase by deploymentId
    const [showcase] = await db
      .select({ id: showcaseUploads.id, thumbnailUrl: showcaseUploads.thumbnailUrl })
      .from(showcaseUploads)
      .where(eq(showcaseUploads.deploymentId, deploymentId))
      .limit(1);

    if (!showcase) {
      console.warn('[webhook:vercel-deploy] No showcase found for deployment:', deploymentId);
      return NextResponse.json({ ok: true, skipped: true });
    }

    if (payload.type === 'deployment.created') {
      // Deployment started building — confirm the building status
      await db
        .update(showcaseUploads)
        .set({ deployStatus: 'building', deployError: null })
        .where(eq(showcaseUploads.id, showcase.id));

      console.info('[webhook:vercel-deploy] deploy.created:', { showcaseId: showcase.id });
    } else if (payload.type === 'deployment.canceled') {
      await db
        .update(showcaseUploads)
        .set({
          deployStatus: 'failed',
          deployError: 'Deployment was canceled',
        })
        .where(eq(showcaseUploads.id, showcase.id));

      console.info('[webhook:vercel-deploy] deploy.canceled:', { showcaseId: showcase.id });
    } else if (payload.type === 'deployment.succeeded') {
      const deployUrl = payload.payload.deployment.url;
      const fullUrl = deployUrl?.startsWith('http') ? deployUrl : `https://${deployUrl}`;

      // Fetch the Vercel deployment screenshot as the thumbnail
      let screenshotUrl: string | null = null;
      try {
        screenshotUrl = await fetchDeployScreenshot(deploymentId);
      } catch (err) {
        console.warn('[webhook:vercel-deploy] screenshot fetch failed:', err instanceof Error ? err.message : err);
      }

      await db
        .update(showcaseUploads)
        .set({
          deployStatus: 'ready',
          deployUrl: fullUrl,
          deployError: null,
          ...(screenshotUrl && !showcase.thumbnailUrl ? { thumbnailUrl: screenshotUrl } : {}),
        })
        .where(eq(showcaseUploads.id, showcase.id));

      console.info('[webhook:vercel-deploy] deploy.ready:', {
        showcaseId: showcase.id,
        deployUrl: fullUrl,
        thumbnailSet: !!screenshotUrl && !showcase.thumbnailUrl,
      });
    } else if (payload.type === 'deployment.error') {
      // Extract error details from the webhook payload
      const errorMessage = payload.payload?.deployment?.meta?.buildError
        ?? payload.payload?.deploymentError?.message
        ?? 'Build failed — check Vercel dashboard for details';

      await db
        .update(showcaseUploads)
        .set({
          deployStatus: 'failed',
          deployError: errorMessage,
        })
        .where(eq(showcaseUploads.id, showcase.id));

      console.info('[webhook:vercel-deploy] deploy.failed:', {
        showcaseId: showcase.id,
        error: errorMessage,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[webhook:vercel-deploy] handler error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// ── Vercel Deployment Screenshot ──────────────────────────────────────

async function fetchDeployScreenshot(deploymentId: string): Promise<string | null> {
  const token = process.env.VERCEL_SHOWCASE_TOKEN;
  if (!token) return null;

  // Vercel's deployment API includes screenshot URLs when available
  const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return null;

  const data = await response.json() as {
    readyState?: string;
    url?: string;
    meta?: Record<string, string>;
  };

  // Use Vercel's built-in screenshot service for the deployment URL
  if (data.url) {
    const deployUrl = data.url.startsWith('http') ? data.url : `https://${data.url}`;
    // Vercel provides og:image screenshots via their screenshot service
    return `https://vercel.com/api/www/screenshot/${encodeURIComponent(deployUrl)}?w=1200&h=630`;
  }

  return null;
}

// ── Types ─────────────────────────────────────────────────────────────

interface VercelWebhookPayload {
  type: string;
  payload: {
    deployment: {
      id: string;
      url?: string;
      meta?: Record<string, string>;
    };
    deploymentError?: {
      message: string;
    };
  };
}
