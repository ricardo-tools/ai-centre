import { NextResponse } from 'next/server';

interface Check {
  status: 'ok' | 'missing';
  detail?: string;
}

export async function GET() {
  const checks: Record<string, Check> = {
    database: process.env.DATABASE_URL
      ? { status: 'ok' }
      : { status: 'missing', detail: 'DATABASE_URL not set' },
    blob: process.env.BLOB_READ_WRITE_TOKEN
      ? { status: 'ok' }
      : { status: 'missing', detail: 'BLOB_READ_WRITE_TOKEN not set' },
    auth: process.env.AUTH_SECRET
      ? { status: 'ok' }
      : { status: 'missing', detail: 'AUTH_SECRET not set' },
    email:
      process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN
        ? { status: 'ok' }
        : {
            status: 'missing',
            detail: [
              !process.env.MAILGUN_API_KEY && 'MAILGUN_API_KEY not set',
              !process.env.MAILGUN_DOMAIN && 'MAILGUN_DOMAIN not set',
            ]
              .filter(Boolean)
              .join(', '),
          },
    ai: process.env.ANTHROPIC_API_KEY
      ? { status: 'ok' }
      : { status: 'missing', detail: 'ANTHROPIC_API_KEY not set' },
  };

  const allOk = Object.values(checks).every((c) => c.status === 'ok');

  return NextResponse.json(
    {
      status: allOk ? 'healthy' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: allOk ? 200 : 503 },
  );
}
