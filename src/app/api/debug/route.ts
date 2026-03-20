import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      SKIP_AUTH: process.env.SKIP_AUTH ?? '(not set)',
      AUTH_SECRET_SET: !!process.env.AUTH_SECRET,
      AUTH_SECRET_LENGTH: process.env.AUTH_SECRET?.length ?? 0,
      DATABASE_URL_SET: !!process.env.DATABASE_URL,
      BLOB_TOKEN_SET: !!process.env.BLOB_READ_WRITE_TOKEN,
      MAILGUN_KEY_SET: !!process.env.MAILGUN_API_KEY,
      MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN ?? '(not set)',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? '(not set)',
      VERCEL_ENV: process.env.VERCEL_ENV ?? '(not set)',
      VERCEL_URL: process.env.VERCEL_URL ?? '(not set)',
    },
    middleware: {
      note: 'If you can see this without auth, middleware is not blocking /api/debug',
      skipAuthValue: process.env.SKIP_AUTH,
      nodeEnvValue: process.env.NODE_ENV,
    },
  });
}
