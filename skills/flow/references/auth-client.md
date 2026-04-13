---
name: flow-auth-client
description: >
  authenticatedFetch wrapper for Flow CLI commands. Handles token storage,
  auto-refresh, and credential management. Companion to flow (the behavioral
  skill). Agent copies this code to .flow/lib/auth.ts in the user's project.
---

# Flow Auth Client

Implementation template for the `authenticatedFetch` wrapper used by all Flow CLI commands. The agent reads this reference and copies the code to `.flow/lib/auth.ts` — it does NOT generate auth logic from scratch.

---

## .flow/lib/auth.ts

```typescript
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface Credentials {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  ai_centre_url: string;
}

const CREDENTIALS_PATH = join(process.cwd(), '.flow', 'credentials.json');

/** Read stored credentials or null if not logged in */
export function getCredentials(): Credentials | null {
  if (!existsSync(CREDENTIALS_PATH)) return null;
  try {
    return JSON.parse(readFileSync(CREDENTIALS_PATH, 'utf-8'));
  } catch {
    return null;
  }
}

/** Write credentials to .flow/credentials.json */
export function saveCredentials(creds: Credentials): void {
  const dir = join(process.cwd(), '.flow');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(CREDENTIALS_PATH, JSON.stringify(creds, null, 2));
}

/** Delete credentials (logout) */
export function clearCredentials(): void {
  if (existsSync(CREDENTIALS_PATH)) {
    const { unlinkSync } = require('fs');
    unlinkSync(CREDENTIALS_PATH);
  }
}

/** Check if access token is expired or within 60s of expiry */
function isTokenExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() - Date.now() < 60_000;
}

/** Refresh the access token using the refresh token */
async function refreshAccessToken(creds: Credentials): Promise<Credentials | null> {
  try {
    const res = await fetch(`${creds.ai_centre_url}/api/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: creds.refresh_token,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const newCreds: Credentials = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
      ai_centre_url: creds.ai_centre_url,
    };
    saveCredentials(newCreds);
    return newCreds;
  } catch {
    return null;
  }
}

/**
 * Fetch wrapper that handles authentication automatically.
 * - Reads credentials from .flow/credentials.json
 * - Auto-refreshes expired tokens
 * - Prompts re-login if refresh fails
 */
export async function authenticatedFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  let creds = getCredentials();
  if (!creds) {
    throw new Error('Not logged in. Run flow-login to authenticate.');
  }

  // Auto-refresh if expired
  if (isTokenExpired(creds.expires_at)) {
    const refreshed = await refreshAccessToken(creds);
    if (!refreshed) {
      clearCredentials();
      throw new Error('Session expired. Run flow-login to re-authenticate.');
    }
    creds = refreshed;
  }

  const url = path.startsWith('http') ? path : `${creds.ai_centre_url}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${creds.access_token}`,
    },
  });
}
```
