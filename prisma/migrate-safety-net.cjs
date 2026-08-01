/**
 * SAFETY-NET MIGRATION
 * ───────────────────
 * Runs on every container startup (called from start.sh) BEFORE the
 * Next.js server boots. Ensures that recently-added Prisma schema
 * elements (columns / tables) exist in the live database so that the
 * Prisma client (which was regenerated at build time to include them)
 * doesn't throw "column does not exist" / "relation does not exist"
 * errors at runtime.
 *
 * This is a belt-and-suspenders fallback in case `npx prisma db push`
 * fails silently on Railway (which has been happening — likely due to
 * non-interactive prompts or engine download issues).
 *
 * All statements are idempotent (IF NOT EXISTS) so they're safe to
 * run repeatedly with no side effects.
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const STATEMENTS = [
  // ── kycVerificationCode on User (added in commit 4d3e2dd) ──
  // Required for /api/admin/users/[id]/kyc-code + /api/kyc/submit Level 1 code gate.
  // If this column is missing, EVERY db.user.findUnique / findFirst / findMany
  // throws "column kyc_verification_code does not exist" — which breaks
  // login, register, /api/auth/me, /api/user, /api/admin/users, etc.
  // IMPORTANT: The actual table in the DB is `public.users` (lowercase, plural),
  // NOT `"User"` (capital, singular) as Prisma @@map("User") suggests.
  `ALTER TABLE public.users ADD COLUMN IF NOT EXISTS kyc_verification_code TEXT`,

  // ── chart_spike_events table (added in commit 81e3ff6) ──
  // Required for /api/admin/chart-spike + /api/chart-events.
  // If this table is missing, db.chartSpikeEvent.findMany throws
  // "relation chart_spike_events does not exist".
  `CREATE TABLE IF NOT EXISTS "chart_spike_events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "direction" TEXT NOT NULL DEFAULT 'up',
    "magnitude_pct" DECIMAL(8,4) NOT NULL,
    "message" TEXT,
    "consumed" BOOLEAN NOT NULL DEFAULT false,
    "consumed_at" TIMESTAMP(3),
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chart_spike_events_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE INDEX IF NOT EXISTS "idx_chart_spike_user_unread"
     ON "chart_spike_events" ("user_id", "consumed", "created_at")`,
  `ALTER TABLE "chart_spike_events"
     ADD CONSTRAINT IF NOT EXISTS "chart_spike_events_user_id_fkey"
     FOREIGN KEY ("user_id") REFERENCES public.users(id)
     ON DELETE CASCADE ON UPDATE CASCADE`,
];

async function run() {
  console.log('[migrate-safety-net] Running idempotent schema checks...');
  let applied = 0;
  let skipped = 0;
  for (const sql of STATEMENTS) {
    try {
      await prisma.$executeRawUnsafe(sql);
      // Log a short label for each statement so Railway logs are readable.
      const label = sql.length > 70 ? sql.slice(0, 67) + '...' : sql;
      console.log(`[migrate-safety-net] OK: ${label}`);
      applied += 1;
    } catch (err) {
      // Idempotent statements shouldn't fail, but if they do (e.g. column
      // already exists with a different type), log and continue — never
      // block server startup.
      console.error(`[migrate-safety-net] SKIP: ${err.message}`);
      skipped += 1;
    }
  }
  console.log(`[migrate-safety-net] Done. Applied ${applied}, skipped ${skipped}.`);
}

run()
  .catch((e) => {
    // Never throw — startup must continue even if migration fails.
    console.error('[migrate-safety-net] FATAL (non-blocking):', e.message);
  })
  .finally(() => prisma.$disconnect());
