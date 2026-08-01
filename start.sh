#!/bin/sh

echo "========================================"
echo "[startup] Tesla Platform - Initializing"
echo "========================================"

# ============================================
# DATABASE_URL VALIDATION
# ============================================
if [ -z "$DATABASE_URL" ]; then
  echo "[startup] FATAL: DATABASE_URL environment variable is NOT SET."
  echo "[startup] Without DATABASE_URL, the app cannot connect to any database."
  echo "[startup] ALL login, registration, and data operations WILL FAIL."
  echo "[startup] Please set DATABASE_URL in your Railway environment variables."
  echo "[startup] It should be a PostgreSQL URL like: postgresql://user:pass@host:5432/dbname"
  echo "========================================"
  mkdir -p /tmp/uploads
  exec node server.js
fi

# Check if DATABASE_URL is SQLite format (wrong for this project)
case "$DATABASE_URL" in
  file:*)
    echo "[startup] FATAL: DATABASE_URL starts with 'file:' -- this is SQLite."
    echo "[startup] This project uses PostgreSQL. The DATABASE_URL must start with postgresql://"
    echo "[startup] Please fix DATABASE_URL in Railway environment variables."
    echo "========================================"
    mkdir -p /tmp/uploads
    exec node server.js
    ;;
  postgresql://*|postgres://*)
    echo "[startup] DATABASE_URL appears to be PostgreSQL format"
    ;;
  *)
    echo "[startup] WARNING: DATABASE_URL format unrecognized: ${DATABASE_URL:0:20}..."
    echo "[startup] Proceeding anyway -- if this fails, check your DATABASE_URL."
    ;;
esac

# ============================================
# SAFETY-NET MIGRATION (idempotent raw SQL)
# ============================================
# Runs BEFORE prisma db push because db push has been silently failing
# on Railway (likely due to engine download / non-interactive prompt
# issues). This ensures recently-added columns/tables exist so the
# build-time Prisma client doesn't throw "column does not exist" at
# runtime (which broke login + register on 2026-07-27).
echo "[startup] Running safety-net migration (idempotent raw SQL)..."
node prisma/migrate-safety-net.cjs 2>&1 || {
  echo "[startup] Safety-net migration failed (non-critical, will continue)"
}

# ============================================
# DATABASE SCHEMA SYNC
# ============================================
echo "[startup] Syncing database schema (safe mode, no data loss)..."
SYNC_OK=0
npx prisma db push 2>&1 && SYNC_OK=1 || {
  echo "[startup] Schema sync failed on first attempt. Retrying in 5s..."
  sleep 5
  npx prisma db push 2>&1 && SYNC_OK=1 || {
    echo "[startup] Schema sync failed after retry. Some tables may be missing."
    echo "[startup] This is NON-CRITICAL — safety-net migration above already handled critical columns."
  }
}

if [ "$SYNC_OK" = "1" ]; then
  echo "[startup] Schema sync successful"
fi

echo "[startup] Regenerating Prisma client..."
npx prisma generate 2>&1 || echo "[startup] Prisma generate failed (using build-time client)"

# Re-run safety-net after prisma generate too, in case db push rolled back
# any of our idempotent changes (it shouldn't, but belt-and-suspenders).
echo "[startup] Re-running safety-net migration after db push..."
node prisma/migrate-safety-net.cjs 2>&1 || echo "[startup] Post-push safety-net skipped (non-critical)"

# ============================================
# DATABASE SEED
# ============================================
echo "[startup] Seeding database..."
node prisma/seed.cjs 2>&1 || {
  echo "[startup] Seed failed or already done (non-critical)"
}

# ============================================
# FILE SYSTEM
# ============================================
mkdir -p /tmp/uploads
echo "[startup] Upload directory ready at /tmp/uploads"

# ============================================
# MIGRATE USERS FROM DEMO TO LIVE MODE
# ============================================
echo "[startup] Migrating demo users to live mode..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function migrate() {
  try {
    var r = await prisma.user.updateMany({ where: { activeMode: 'demo' }, data: { activeMode: 'live' } });
    console.log('[startup] Migrated ' + r.count + ' users from demo to live mode');
  } catch(e) {
    console.error('[startup] Migration failed:', e.message);
  } finally {
    await prisma.disconnect();
  }
}
migrate();
" 2>&1 || echo "[startup] Mode migration skipped (non-critical)"

# ============================================
# USER CLEANUP — DISABLED
# Do NOT delete users on deploy. Clients are permanent.
# ============================================
echo "[startup] Skipping user cleanup (clients are preserved)"

# ============================================
# START SERVER
# ============================================
echo "========================================"
echo "[startup] Starting Next.js server..."
echo "[startup] Health check available at /api/health"
echo "========================================"
exec node server.js
