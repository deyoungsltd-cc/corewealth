const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Admin@123', 12);

  // Admin 1
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tesla.com' },
    update: {},
    create: {
      email: 'admin@tesla.com',
      passwordHash: hash,
      status: 'active',
      emailVerified: true,
      referralCode: 'ADMIN001',
      activeMode: 'live',
    },
  });
  await prisma.profile.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id, firstName: 'Admin', lastName: 'User' },
  });
  await prisma.admin.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id, role: 'SUPER_ADMIN', isSuperAdmin: true },
  });
  await prisma.wallet.upsert({
    where: { userId_type: { userId: admin.id, type: 'demo' } },
    update: {},
    create: { userId: admin.id, type: 'demo', balance: 0, availableBalance: 0, lockedBalance: 0 },
  });
  await prisma.wallet.upsert({
    where: { userId_type: { userId: admin.id, type: 'live' } },
    update: {},
    create: { userId: admin.id, type: 'live', balance: 0, availableBalance: 0, lockedBalance: 0 },
  });

  // Admin 2 - teslaprimesupportt@gmail.com
  const deyoung = await prisma.user.upsert({
    where: { email: 'teslaprimesupportt@gmail.com' },
    update: {},
    create: {
      email: 'teslaprimesupportt@gmail.com',
      passwordHash: hash,
      status: 'active',
      emailVerified: true,
      referralCode: 'DYADMIN01',
      activeMode: 'live',
    },
  });
  await prisma.profile.upsert({
    where: { userId: deyoung.id },
    update: {},
    create: { userId: deyoung.id, firstName: 'DeYoung', lastName: 'Admin' },
  });
  await prisma.admin.upsert({
    where: { userId: deyoung.id },
    update: {},
    create: { userId: deyoung.id, role: 'SUPER_ADMIN', isSuperAdmin: true },
  });
  await prisma.wallet.upsert({
    where: { userId_type: { userId: deyoung.id, type: 'demo' } },
    update: {},
    create: { userId: deyoung.id, type: 'demo', balance: 0, availableBalance: 0, lockedBalance: 0 },
  });
  await prisma.wallet.upsert({
    where: { userId_type: { userId: deyoung.id, type: 'live' } },
    update: {},
    create: { userId: deyoung.id, type: 'live', balance: 0, availableBalance: 0, lockedBalance: 0 },
  });

  // Create site_settings row if not exists
  await prisma.siteSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: { id: 'main' },
  });

  // ─────────────────────────────────────────────────────────────
  // INVESTMENT PLANS (CRITICAL — without these, /api/investments
  // returns PLAN_NOT_FOUND because the plans table is empty).
  // The .ts version of this file has them, but the .cjs version
  // (which is what actually runs inside the Docker container via
  // start.sh) was missing them. This block mirrors seed.ts exactly.
  // ─────────────────────────────────────────────────────────────
  const plans = [
    { name: 'Basic Plan',    slug: 'basic',    tierName: 'Basic',    minAmount: 200,   maxAmount: 4999,   dailyReturnRate: 0.5, duration: 30, durationUnit: 'days', sortOrder: 0, isActive: true, features: '["Daily profit accrual","Capital return included","24/7 support access"]' },
    { name: 'Silver Plan',   slug: 'silver',   tierName: 'Silver',   minAmount: 5000,  maxAmount: 9999,   dailyReturnRate: 0.8, duration: 21, durationUnit: 'days', sortOrder: 1, isActive: true, features: '["Higher daily returns","Priority withdrawals","Dedicated account manager"]' },
    { name: 'Gold Plan',     slug: 'gold',     tierName: 'Gold',     minAmount: 10000, maxAmount: 49999,  dailyReturnRate: 1.2, duration: 14, durationUnit: 'days', sortOrder: 2, isActive: true, features: '["Premium daily rates","Instant profit withdrawal","Portfolio insurance"]' },
    { name: 'Platinum Plan', slug: 'platinum', tierName: 'Platinum', minAmount: 50000, maxAmount: 100000, dailyReturnRate: 1.8, duration: 7,  durationUnit: 'days', sortOrder: 3, isActive: true, features: '["Maximum daily returns","Zero-fee withdrawals","VIP concierge service"]' },
  ];

  for (const plan of plans) {
    await prisma.investmentPlan.upsert({
      where: { slug: plan.slug },
      update: {
        name: plan.name,
        tierName: plan.tierName,
        minAmount: plan.minAmount,
        maxAmount: plan.maxAmount,
        dailyReturnRate: plan.dailyReturnRate,
        duration: plan.duration,
        durationUnit: plan.durationUnit,
        sortOrder: plan.sortOrder,
        isActive: true, // re-activate any previously disabled plans
        features: plan.features,
      },
      create: plan,
    });
  }
  console.log('Investment plans seeded: 4 active (Basic, Silver, Gold, Platinum)');

  // Seed default payment addresses (only if none exist)
  const existingAddresses = await prisma.paymentAddress.count();
  if (existingAddresses === 0) {
    await prisma.paymentAddress.createMany({
      data: [
        {
          label: 'Main Bitcoin Wallet',
          currency: 'BTC',
          network: 'Bitcoin',
          address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          isActive: true,
          sortOrder: 0,
        },
        {
          label: 'Main Ethereum Wallet',
          currency: 'ETH',
          network: 'ERC-20',
          address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          isActive: true,
          sortOrder: 1,
        },
        {
          label: 'USDT (TRC-20)',
          currency: 'USDT',
          network: 'TRC-20',
          address: 'TN2Y13RDMBCAZQQVY4RZHXTM5E5RSTBBBR',
          isActive: true,
          sortOrder: 2,
        },
        {
          label: 'USDT (ERC-20)',
          currency: 'USDT',
          network: 'ERC-20',
          address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          isActive: true,
          sortOrder: 3,
        },
      ],
      skipDuplicates: true,
    });
    console.log('Default payment addresses seeded.');
  }

  console.log('Database seeded successfully!');
  console.log('Admin: admin@tesla.com / Admin@123');
  console.log('Admin: teslaprimesupportt@gmail.com / Admin@123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
