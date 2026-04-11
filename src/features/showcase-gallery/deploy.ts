import { getDb } from '@/platform/db/client';
import { showcaseUploads } from '@/platform/db/schema';
import { eq } from 'drizzle-orm';
import { deployProject, type DeployFile, type DeployTarget, type DeployProjectSettings } from '@/platform/lib/vercel-deploy';
import { getTemplateFiles } from '@/platform/lib/showcase-template';
import JSZip from 'jszip';

/**
 * Fire-and-forget deployment trigger for ZIP showcase uploads.
 * Fetches the ZIP from blob storage, extracts files, and submits to Vercel.
 * Injects security middleware and vercel.json templates into every deployment.
 * Updates DB status throughout the process.
 */
export async function triggerDeploy(showcaseId: string): Promise<void> {
  console.info('[showcase-deploy] trigger.start:', { showcaseId });

  // Guard: skip if token is not configured
  const token = process.env.VERCEL_SHOWCASE_TOKEN;
  if (!token) {
    console.warn('[showcase-deploy] skipping — VERCEL_SHOWCASE_TOKEN is not set');
    return;
  }

  const db = getDb();

  // Fetch showcase row to get blob URL
  const [row] = await db
    .select({
      blobUrl: showcaseUploads.blobUrl,
      title: showcaseUploads.title,
      fileType: showcaseUploads.fileType,
    })
    .from(showcaseUploads)
    .where(eq(showcaseUploads.id, showcaseId))
    .limit(1);

  if (!row) {
    console.error('[showcase-deploy] deploy.error:', { showcaseId, error: 'Showcase not found' });
    return;
  }

  if (row.fileType !== 'zip') {
    console.info('[showcase-deploy] skipping — not a ZIP upload:', { showcaseId, fileType: row.fileType });
    return;
  }

  // Update status to building
  console.info('[showcase-deploy] status.update: building', { showcaseId });
  await db
    .update(showcaseUploads)
    .set({ deployStatus: 'building' })
    .where(eq(showcaseUploads.id, showcaseId));

  // Fetch the ZIP — local paths read from filesystem, remote URLs use fetch
  console.info('[showcase-deploy] zip.fetch.start:', { blobUrl: row.blobUrl });
  let zipBuffer: ArrayBuffer;
  try {
    if (row.blobUrl.startsWith('/uploads/')) {
      // Local dev: read from public/uploads/ directory
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', row.blobUrl);
      const fileData = await fs.readFile(filePath);
      zipBuffer = fileData.buffer.slice(fileData.byteOffset, fileData.byteOffset + fileData.byteLength);
    } else {
      const response = await fetch(row.blobUrl);
      if (!response.ok) {
        throw new Error(`ZIP fetch failed: ${response.status} ${response.statusText}`);
      }
      zipBuffer = await response.arrayBuffer();
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[showcase-deploy] deploy.error:', { showcaseId, error: message });
    await db
      .update(showcaseUploads)
      .set({ deployStatus: 'failed', deployError: message })
      .where(eq(showcaseUploads.id, showcaseId));
    return;
  }

  // Extract ZIP contents
  let files: DeployFile[];
  try {
    const zip = await JSZip.loadAsync(zipBuffer);
    files = [];

    for (const [path, entry] of Object.entries(zip.files)) {
      if (entry.dir) continue;

      // Security: reject path traversal
      if (path.includes('..')) {
        console.warn('[showcase-deploy] skipping path traversal entry:', { path });
        continue;
      }

      // Security: strip leading slashes
      const safePath = path.replace(/^\/+/, '');
      if (!safePath) continue;

      const content = await entry.async('string');
      files.push({ file: safePath, data: content });
    }

    // Detect if project uses src/ directory structure
    const hasSrcDir = files.some(f => f.file.startsWith('src/'));

    // Inject template files (middleware.ts, vercel.json) — templates override ZIP contents
    const templateFiles = getTemplateFiles(hasSrcDir);
    const templatePaths = new Set(Object.keys(templateFiles));
    // Remove any existing middleware or vercel.json (at root OR src/)
    files = files.filter(f =>
      !templatePaths.has(f.file) &&
      f.file !== 'middleware.ts' &&
      f.file !== 'src/middleware.ts' &&
      f.file !== 'vercel.json'
    );
    for (const [path, data] of Object.entries(templateFiles)) {
      files.push({ file: path, data });
    }
    console.info('[showcase-deploy] middleware injected at:', { path: hasSrcDir ? 'src/middleware.ts' : 'middleware.ts' });

    // Inject `jose` dependency into package.json (required by our middleware template)
    const pkgIdx = files.findIndex(f => f.file === 'package.json');
    if (pkgIdx !== -1) {
      try {
        const pkg = JSON.parse(files[pkgIdx].data);
        pkg.dependencies = pkg.dependencies ?? {};
        if (!pkg.dependencies['jose']) {
          pkg.dependencies['jose'] = '^6.0.0';
        }
        files[pkgIdx] = { file: 'package.json', data: JSON.stringify(pkg, null, 2) };
      } catch {
        console.warn('[showcase-deploy] could not patch package.json to add jose');
      }
    }

    console.info('[showcase-deploy] zip.extract.complete:', { fileCount: files.length, injectedTemplates: templatePaths.size });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[showcase-deploy] deploy.error:', { showcaseId, error: message });
    await db
      .update(showcaseUploads)
      .set({ deployStatus: 'failed', deployError: message })
      .where(eq(showcaseUploads.id, showcaseId));
    return;
  }

  // Detect project type from ZIP contents
  const projectSettings = detectProjectSettings(files);
  console.info('[showcase-deploy] detected framework:', { showcaseId, framework: projectSettings.framework ?? 'static' });

  // All showcases deploy to production (each gets a unique URL, JWT middleware handles security)
  const target: DeployTarget = 'production';

  // Tag with environment for clarity in Vercel dashboard
  const envTag = process.env.VERCEL_ENV === 'production' ? 'prod' : 'dev';
  const slug = row.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  const projectName = `${envTag}-${slug}-${showcaseId.slice(0, 8)}`;

  console.info('[showcase-deploy] deploy.submit:', { showcaseId, target, fileCount: files.length, framework: projectSettings.framework ?? 'static' });

  // Call Vercel deploy
  const result = await deployProject(projectName, files, target, projectSettings);

  if (result.ok) {
    const { deploymentId, url } = result.value;
    const deployUrl = url.startsWith('http') ? url : `https://${url}`;
    console.info('[showcase-deploy] deploy.submitted:', { showcaseId, deploymentId, url: deployUrl });

    // Store deploymentId and URL — status stays 'building' until polling detects READY
    await db
      .update(showcaseUploads)
      .set({ deployStatus: 'building', deployUrl, deploymentId })
      .where(eq(showcaseUploads.id, showcaseId));
  } else {
    console.error('[showcase-deploy] deploy.error:', { showcaseId, error: result.error.message });

    await db
      .update(showcaseUploads)
      .set({ deployStatus: 'failed', deployError: result.error.message })
      .where(eq(showcaseUploads.id, showcaseId));
  }
}

/**
 * Inspects extracted ZIP files to determine the project framework.
 * Checks package.json for Next.js, otherwise treats as static HTML.
 */
function detectProjectSettings(files: DeployFile[]): DeployProjectSettings {
  const packageJsonFile = files.find(f => f.file === 'package.json' || f.file.endsWith('/package.json'));

  if (packageJsonFile) {
    try {
      const pkg = JSON.parse(packageJsonFile.data);
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (allDeps['next']) {
        return { framework: 'nextjs' };
      }

      if (allDeps['nuxt'] || allDeps['nuxt3']) {
        return { framework: 'nuxtjs' };
      }

      if (allDeps['vite']) {
        return { framework: 'vite' };
      }

      if (allDeps['@angular/core']) {
        return { framework: 'angular' };
      }

      // Has package.json but no known framework — let Vercel auto-detect
      return { framework: null };
    } catch {
      // Malformed package.json — fall through to static
    }
  }

  // No package.json — static HTML site
  return {
    framework: null,
    buildCommand: '',
    outputDirectory: '.',
  };
}
