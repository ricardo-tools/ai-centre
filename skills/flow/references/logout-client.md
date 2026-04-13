---
name: flow-logout-client
description: >
  Logout flow for Flow CLI. Revokes refresh token on server and clears
  local credentials. Companion to flow. Agent copies this code to
  .flow/lib/logout.ts in the user's project.
---

# Flow Logout Client

Implementation template for the `flow-logout` command. The agent reads this reference and copies the code to `.flow/lib/logout.ts`.

---

## .flow/lib/logout.ts

```typescript
import { getCredentials, clearCredentials } from './auth';

/**
 * Run the flow-logout flow:
 * 1. Read credentials
 * 2. Revoke refresh token on server
 * 3. Delete local credentials
 */
export async function logout(): Promise<void> {
  const creds = getCredentials();
  if (!creds) {
    console.log('Not logged in.');
    return;
  }

  // Best-effort server revocation — don't fail if server is unreachable
  try {
    await fetch(`${creds.ai_centre_url}/api/auth/revoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: creds.refresh_token }),
    });
  } catch {
    // Server unreachable — still clear local credentials
  }

  clearCredentials();
  console.log('Logged out successfully.');
}
```
