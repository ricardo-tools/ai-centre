import { NextResponse } from 'next/server';

export async function GET() {
  const checks: Record<string, 'ok' | 'missing'> = {
    database: process.env.DATABASE_URL ? 'ok' : 'missing',
    storage: process.env.BLOB_READ_WRITE_TOKEN ? 'ok' : 'missing',
    auth: process.env.AUTH_SECRET ? 'ok' : 'missing',
    email: (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) ? 'ok' : 'missing',
    ai: process.env.ANTHROPIC_API_KEY ? 'ok' : 'missing',
  };

  // In production, only show status — don't reveal which specific services are missing
  const isProduction = process.env.NODE_ENV === 'production';
  const healthy = Object.values(checks).every(v => v === 'ok');

  return NextResponse.json(
    {
      status: healthy ? 'healthy' : 'degraded',
      ...(isProduction ? {} : { checks }),
      timestamp: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 },
  );
}
