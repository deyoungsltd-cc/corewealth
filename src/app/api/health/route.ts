import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks: Record<string, { ok: boolean; detail: string }> = {};

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    checks.database = { ok: false, detail: 'DATABASE_URL env var is NOT set.' };
    return NextResponse.json({ status: 'unhealthy', checks, timestamp: new Date().toISOString() }, { status: 503 });
  }
  if (dbUrl.startsWith('file:')) {
    checks.database = { ok: false, detail: 'DATABASE_URL is SQLite but PostgreSQL is required.' };
    return NextResponse.json({ status: 'unhealthy', checks, timestamp: new Date().toISOString() }, { status: 503 });
  }
  checks.database = { ok: true, detail: 'DATABASE_URL configured' };

  const jwtSecret = process.env.JWT_SECRET;
  checks.jwt = {
    ok: !!jwtSecret,
    detail: jwtSecret ? 'JWT_SECRET is set' : 'JWT_SECRET not set',
  };

  try {
    await db.$queryRaw`SELECT 1 as ok`;
    checks.dbConnect = { ok: true, detail: 'Database connection successful' };
  } catch {
    checks.dbConnect = { ok: false, detail: 'Database connection failed' };
  }

  try {
    const userCount = await db.user.count();
    checks.usersTable = { ok: true, detail: `Users table exists (${userCount} rows)` };
  } catch {
    checks.usersTable = { ok: false, detail: 'Users table check failed' };
  }

  try {
    const admin = await db.user.findFirst({
      where: { email: 'admin@corewealth.com' },
      include: { adminRecord: true },
    });
    checks.adminUser = {
      ok: !!admin,
      detail: admin ? 'Admin user exists' : 'Admin user not found. Run seed.',
    };
  } catch {
    checks.adminUser = { ok: false, detail: 'Admin user check failed' };
  }

  // Email service check
  const smtpPassword = process.env.SMTP_PASSWORD;
  const smtpEmail = process.env.SMTP_EMAIL || 'not set';
  checks.emailService = {
    ok: !!smtpPassword,
    detail: smtpPassword
      ? `SMTP configured (${smtpEmail})`
      : 'SMTP_PASSWORD not set — emails will be logged but NOT sent',
  };
  checks.emailFrom = {
    ok: true,
    detail: process.env.EMAIL_FROM || smtpEmail,
  };

  const allOk = Object.values(checks).every((c) => c.ok);
  return NextResponse.json(
    { status: allOk ? 'healthy' : 'unhealthy', checks, timestamp: new Date().toISOString() },
    { status: allOk ? 200 : 503 }
  );
}
