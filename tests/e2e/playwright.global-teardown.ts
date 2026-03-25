/**
 * Playwright global teardown — clean up mark files.
 * Databases are preserved for faster subsequent runs.
 */

import * as fs from 'fs';
import * as path from 'path';

const WORKER_COUNT = 4;

export default async function globalTeardown() {
  for (let i = 0; i < WORKER_COUNT; i++) {
    const markFile = path.join(__dirname, `.global-mark-${i}`);
    try { fs.unlinkSync(markFile); } catch { /* fine */ }
  }
  console.log('[global-teardown] Cleaned up mark files. Databases preserved for next run.');
}
