import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * GET /api/auth/deny
 *
 * Called when the user denies CLI access on the OAuth consent page.
 * Reads the oauth-params cookie to get the CLI's redirect_uri,
 * then redirects the browser to the CLI's localhost callback with
 * error=access_denied so the CLI can notify the user immediately.
 */
export async function GET(request: NextRequest) {
  const oauthParamsCookie = request.cookies.get('oauth-params')?.value;

  if (!oauthParamsCookie) {
    // No OAuth session — just go home
    return NextResponse.redirect(new URL('/', request.url));
  }

  let oauthParams: { redirectUri: string; state: string };
  try {
    oauthParams = JSON.parse(oauthParamsCookie);
  } catch {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const { redirectUri, state } = oauthParams;

  // Redirect to CLI's localhost callback with error
  const callbackUrl = new URL(redirectUri);
  callbackUrl.searchParams.set('error', 'access_denied');
  callbackUrl.searchParams.set('state', state);

  const response = NextResponse.redirect(callbackUrl);
  response.cookies.delete('oauth-params');

  console.info('[oauth] deny: user denied CLI access', { state });
  return response;
}
