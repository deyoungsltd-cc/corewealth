import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// ──────────────────────────────────────────────────────────────
// ONE-TIME SCHEMA SAFETY-NET (blocking, awaitable)
// ──────────────────────────────────────────────────────────────
// Ensures recently-added columns/tables exist in the live DB
// so the Prisma client (which is generated at build time) doesn't
// throw "column does not exist" at runtime.
//
// This is a fallback for when `prisma db push` fails silently
// in start.sh (happened on Railway 2026-07-27, breaking login
// + register with 500 errors).
//
// All statements are idempotent (IF NOT EXISTS) and errors are
// swallowed so they never block the app.
//
// Exported as a promise so callers can await it before making
// queries that depend on the new schema elements.
const globalForMigration = globalThis as unknown as {
  _schemaReady: Promise<void> | undefined;
};

const _schemaReady: Promise<void> =
  globalForMigration._schemaReady ??
  (async () => {
    // Timeout after 10 seconds to prevent blocking the app startup
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, 10000));
    const migration = (async () => {
    try {
      await db.$executeRawUnsafe(
        `ALTER TABLE public.users ADD COLUMN IF NOT EXISTS kyc_verification_code TEXT`
      );
      console.log('[db:safe-migrate] Added kyc_verification_code to public.users if missing');
    } catch (e: any) {
      console.warn('[db:safe-migrate] kyc_verification_code:', e.message);
    }

    try {
      await db.$executeRawUnsafe(
        `ALTER TABLE public.users ADD COLUMN IF NOT EXISTS kyc_code_expires_at TIMESTAMP`
      );
      console.log('[db:safe-migrate] Added kyc_code_expires_at to public.users if missing');
    } catch (e: any) {
      console.warn('[db:safe-migrate] kyc_code_expires_at:', e.message);
    }

    try {
      await db.$executeRawUnsafe(
        `ALTER TABLE public.users ADD COLUMN IF NOT EXISTS kyc_code_purchased BOOLEAN DEFAULT false`
      );
      console.log('[db:safe-migrate] Added kyc_code_purchased to public.users if missing');
    } catch (e: any) {
      console.warn('[db:safe-migrate] kyc_code_purchased:', e.message);
    }

    try {
      await db.$executeRawUnsafe(`DROP TABLE IF EXISTS "chart_spike_events" CASCADE`);
      await db.$executeRawUnsafe(`
        CREATE TABLE "chart_spike_events" (
          "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
          "user_id" TEXT NOT NULL,
          "direction" TEXT NOT NULL DEFAULT 'up',
          "magnitude_pct" DECIMAL(8,4) NOT NULL,
          "message" TEXT,
          "consumed" BOOLEAN NOT NULL DEFAULT false,
          "consumed_at" TIMESTAMP(3),
          "created_by" TEXT NOT NULL,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "chart_spike_events_pkey" PRIMARY KEY ("id")
        )
      `);
      await db.$executeRawUnsafe(`
        CREATE INDEX "idx_chart_spike_user_unread"
        ON "chart_spike_events" ("user_id", "consumed", "created_at")
      `);
      await db.$executeRawUnsafe(`
        DO $$ BEGIN
          ALTER TABLE "chart_spike_events"
            ADD CONSTRAINT "chart_spike_events_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES public.users(id)
            ON DELETE CASCADE ON UPDATE CASCADE;
        END $$
      `);
      console.log('[db:safe-migrate] Recreated chart_spike_events table');
    } catch (e: any) {
      console.warn('[db:safe-migrate] chart_spike_events:', e.message);
    }

    console.log('[db:safe-migrate] Schema safety-net complete');
    })();
    await Promise.race([migration, timeout]);
  })();

if (process.env.NODE_ENV === 'production') {
  globalForMigration._schemaReady = _schemaReady;
}

/** Awaits the schema safety-net before making DB queries. Call at the
 *  top of any route handler that may fail due to missing columns. */
export async function ensureSchema(): Promise<void> {
  await _schemaReady;
}// deploy-trigger 1785148100
