---
name: flow-login-client
description: >
  PKCE login flow for Flow CLI. Starts local HTTP server, opens browser,
  receives authorization code, exchanges for tokens. Companion to flow.
  Agent copies this code to .flow/lib/login.ts in the user's project.
---

# Flow Login Client

Implementation template for the `flow-login` command. The agent reads this reference and copies the code to `.flow/lib/login.ts`.

---

## .flow/lib/login.ts

```typescript
import { createServer } from 'http';
import { randomBytes, createHash } from 'crypto';
import { saveCredentials } from './auth';

const AI_CENTRE_URL = process.env.AI_CENTRE_URL || 'https://ai.ezycollect.tools';

/** Generate a PKCE code verifier (43-128 chars, RFC 7636) */
function generateCodeVerifier(): string {
  return randomBytes(32).toString('base64url');
}

/** Compute S256 code challenge from verifier */
function computeCodeChallenge(verifier: string): string {
  return createHash('sha256').update(verifier).digest('base64url');
}

/** Find an available port starting from a random port */
async function findPort(start = 9200, maxAttempts = 5): Promise<number> {
  for (let i = 0; i < maxAttempts; i++) {
    const port = start + i;
    const available = await new Promise<boolean>((resolve) => {
      const server = createServer();
      server.once('error', () => resolve(false));
      server.once('listening', () => { server.close(); resolve(true); });
      server.listen(port, '127.0.0.1');
    });
    if (available) return port;
  }
  throw new Error('Could not find an available port for OAuth callback');
}

/**
 * Run the flow-login PKCE flow:
 * 1. Generate PKCE verifier + challenge
 * 2. Start local HTTP server
 * 3. Open browser to authorize URL
 * 4. Receive callback with code
 * 5. Exchange code for tokens
 * 6. Save credentials
 */
export async function login(): Promise<void> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = computeCodeChallenge(codeVerifier);
  const state = randomBytes(16).toString('hex');

  const port = await findPort();
  const redirectUri = `http://localhost:${port}/callback`;

  // Build authorize URL
  const authorizeUrl = new URL(`${AI_CENTRE_URL}/api/auth/authorize`);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('code_challenge', codeChallenge);
  authorizeUrl.searchParams.set('code_challenge_method', 'S256');
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('state', state);

  console.log('Opening browser for authentication...');
  console.log(`If the browser doesn't open, visit: ${authorizeUrl.toString()}`);

  // Open browser
  const open = (await import('open')).default;
  await open(authorizeUrl.toString());

  // Wait for callback
  const { code, receivedState } = await waitForCallback(port);

  if (receivedState !== state) {
    throw new Error('State mismatch — possible CSRF attack. Aborting.');
  }

  // Exchange code for tokens
  const tokenRes = await fetch(`${AI_CENTRE_URL}/api/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.json();
    throw new Error(`Authentication failed: ${err.message || err.error}`);
  }

  const tokens = await tokenRes.json();
  saveCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    ai_centre_url: AI_CENTRE_URL,
  });

  console.log('Successfully authenticated!');
}

function waitForCallback(port: number): Promise<{ code: string; receivedState: string }> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      server.close();
      reject(new Error('Authentication timed out after 120 seconds'));
    }, 120_000);

    const server = createServer((req, res) => {
      const url = new URL(req.url!, `http://localhost:${port}`);
      if (url.pathname !== '/callback') {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      const code = url.searchParams.get('code');
      const receivedState = url.searchParams.get('state');
      const error = url.searchParams.get('error');

      if (error) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Authentication failed</h1><p>You can close this window.</p>');
        clearTimeout(timeout);
        server.close();
        reject(new Error(`Authentication error: ${error}`));
        return;
      }

      if (!code || !receivedState) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('<h1>Invalid callback</h1><p>Missing code or state parameter.</p>');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>Authentication successful!</h1><p>You can close this window and return to your editor.</p>');
      clearTimeout(timeout);
      server.close();
      resolve({ code, receivedState });
    });

    server.listen(port, '127.0.0.1');
  });
}
```
