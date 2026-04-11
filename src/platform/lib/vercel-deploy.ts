import { type Result, Ok, Err } from '@/platform/lib/result';

// ── Types ───────────────────────────────────────────────────────────

export interface DeployFile {
  file: string;   // path within the project (e.g. 'index.html')
  data: string;   // file content as a string
}

export type DeployTarget = 'production';

export type DeployStatus = 'none' | 'building' | 'ready' | 'failed';

interface DeployResult {
  deploymentId: string;
  url: string;
}

interface StatusResult {
  status: DeployStatus;
  url: string | null;
  error: string | null;
  /** Raw Vercel state for granular UI display (e.g. QUEUED, BUILDING, INITIALIZING) */
  vercelState: string | null;
}

// ── Config ──────────────────────────────────────────────────────────

const VERCEL_API_BASE = 'https://api.vercel.com/v13';
const TIMEOUT_MS = 30_000;

/** Lazy getter — only throws when the module is actually used, not at import time. */
function getToken(): string {
  const token = process.env.VERCEL_SHOWCASE_TOKEN;
  if (!token) {
    throw new Error('[vercel-deploy] VERCEL_SHOWCASE_TOKEN is not set');
  }
  return token;
}

// ── Internal helpers ────────────────────────────────────────────────

async function vercelFetch(
  url: string,
  options: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...options.headers as Record<string, string>,
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

function mapVercelState(state: string): DeployStatus {
  switch (state) {
    case 'QUEUED':
    case 'BUILDING':
    case 'INITIALIZING':
      return 'building';
    case 'READY':
      return 'ready';
    case 'ERROR':
    case 'CANCELED':
      return 'failed';
    default:
      return 'building'; // unknown states treated as in-progress
  }
}

// ── Public API ──────────────────────────────────────────────────────

export interface DeployProjectSettings {
  framework: string | null;  // 'nextjs', null (static), etc.
  buildCommand?: string;
  outputDirectory?: string;
  installCommand?: string;
}

export async function deployProject(
  projectName: string,
  files: DeployFile[],
  target: DeployTarget,
  projectSettings?: DeployProjectSettings,
): Promise<Result<DeployResult, Error>> {
  console.info('[vercel-deploy] deploy.start:', { projectName, target, fileCount: files.length, framework: projectSettings?.framework ?? 'auto' });

  try {
    const response = await vercelFetch(`${VERCEL_API_BASE}/deployments?skipAutoDetectionConfirmation=1`, {
      method: 'POST',
      body: JSON.stringify({
        name: 'ai-centre-showcases',
        project: 'ai-centre-showcases',
        files,
        target,
        projectSettings: projectSettings ?? { framework: null },
        meta: { showcaseName: projectName },
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const apiMessage = (body as Record<string, Record<string, string>>)?.error?.message ?? response.statusText;
      const errMsg = `Vercel API error ${response.status}: ${apiMessage}`;
      console.error('[vercel-deploy] deploy.error:', { projectName, status: response.status, message: apiMessage });
      return Err(new Error(errMsg));
    }

    const data = await response.json() as { id: string; url: string };
    console.info('[vercel-deploy] deploy.complete:', { projectName, deploymentId: data.id, url: data.url });

    return Ok({
      deploymentId: data.id,
      url: data.url,
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[vercel-deploy] deploy.error:', { projectName, message: error.message });
    return Err(error);
  }
}

export async function deleteDeployment(
  deploymentId: string,
): Promise<Result<void, Error>> {
  console.info('[vercel-deploy] delete.start:', { deploymentId });

  try {
    const response = await vercelFetch(`${VERCEL_API_BASE}/deployments/${deploymentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const apiMessage = (body as Record<string, Record<string, string>>)?.error?.message ?? response.statusText;
      const errMsg = `Vercel API error ${response.status}: ${apiMessage}`;
      console.error('[vercel-deploy] delete.error:', { deploymentId, status: response.status, message: apiMessage });
      return Err(new Error(errMsg));
    }

    console.info('[vercel-deploy] delete.complete:', { deploymentId });
    return Ok(undefined);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[vercel-deploy] delete.error:', { deploymentId, message: error.message });
    return Err(error);
  }
}

export async function getDeploymentStatus(
  deploymentId: string,
): Promise<Result<StatusResult, Error>> {
  console.info('[vercel-deploy] status.start:', { deploymentId });

  try {
    const response = await vercelFetch(`${VERCEL_API_BASE}/deployments/${deploymentId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const apiMessage = (body as Record<string, Record<string, string>>)?.error?.message ?? response.statusText;
      const errMsg = `Vercel API error ${response.status}: ${apiMessage}`;
      console.error('[vercel-deploy] status.error:', { deploymentId, status: response.status, message: apiMessage });
      return Err(new Error(errMsg));
    }

    const data = await response.json() as { readyState: string; status: string; url: string | null; errorMessage?: string };
    const vercelState = data.readyState ?? data.status;
    const status = mapVercelState(vercelState);
    console.info('[vercel-deploy] status.complete:', { deploymentId, vercelState, mappedStatus: status });

    return Ok({
      status,
      url: data.url ?? null,
      error: status === 'failed' ? (data.errorMessage ?? 'Build failed') : null,
      vercelState,
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('[vercel-deploy] status.error:', { deploymentId, message: error.message });
    return Err(error);
  }
}
