'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ChatWidget from '@/components/ChatWidget';
import {
  ArrowRightLeft,
  Receipt,
  Download,
  Upload,
  CreditCard,
  Shield,
  TrendingUp,
  ChevronRight,
  AlertCircle,
  Plus,
  Lock,
  Eye,
  EyeOff,
  Snowflake,
  Settings,
  DollarSign,
  Clock,
} from 'lucide-react';

/* ─── Types ─── */
interface WalletData {
  id: string;
  type: 'demo' | 'live';
  balance: number;
  availableBalance: number;
  lockedBalance: number;
}

interface UserData {
  id: string;
  email: string;
  kycLevel: string;
  activeMode: 'demo' | 'live';
  isLive: boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
    country?: string;
  };
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description?: string;
  createdAt: string;
}

interface Investment {
  id: string;
  amount: number;
  dailyReturn: number;
  totalReturn: number;
  expectedReturn: number;
  status: string;
  plan: {
    name: string;
    tierName: string;
    dailyReturnRate: number;
    duration: number;
    durationUnit: string;
  };
}

/* ─── Helpers ─── */
const formatMoney = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatCurrency = (n: number) => `$${formatMoney(n)}`;

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'deposit':
      return <Download size={16} className="text-emerald-400" />;
    case 'withdrawal':
      return <Upload size={16} className="text-red-400" />;
    case 'investment':
      return <TrendingUp size={16} className="text-[#A78BFA]" />;
    case 'investment_return':
      return <DollarSign size={16} className="text-emerald-400" />;
    case 'referral_bonus':
    case 'promo_credit':
      return <DollarSign size={16} className="text-amber-400" />;
    case 'fee':
      return <Receipt size={16} className="text-red-400" />;
    default:
      return <Receipt size={16} className="text-muted-foreground" />;
  }
};

const isCredit = (type: string) =>
  ['deposit', 'investment_return', 'referral_bonus', 'promo_credit', 'balance_adjustment'].includes(type);

/* ─── Visa SVG ─── */
function VisaLogo() {
  return (
    <svg viewBox="0 0 780 500" className="h-7 w-auto" fill="none">
      <path d="M293.2 348.7L331.3 151.5h53.1L346.3 348.7h-53.1z" fill="#FFFFFF" />
      <path
        d="M524.3 158.8c-10.5-4-27-8.3-47.5-8.3-52.4 0-89.3 27.9-89.6 67.8-.3 29.5 26.4 46 46.6 55.9 20.7 10.1 27.7 16.6 27.6 25.6-.1 13.8-16.6 20.1-31.9 20.1-21.3 0-32.6-3.1-50.1-10.4l-6.9-3.2-7.5 46.2c12.5 5.7 35.6 10.7 59.6 11 55.8 0 92-27.5 92.4-69.4.2-23.4-14-41.2-44.8-55.8-18.7-9.5-30.1-15.9-30-25.6 0-8.6 9.7-17.8 30.6-17.8 17.4-.3 30 3.7 39.8 7.9l4.8 2.3 7.1-44.7z"
        fill="#FFFFFF"
      />
      <path
        d="M661.6 151.5h-41c-12.7 0-22.2 3.6-27.8 17l-78.8 180.2h55.8s9.1-25.3 11.2-30.8c6.1 0 60.5.1 68.3.1 1.6 7.1 6.4 30.7 6.4 30.7h49.4L661.6 151.5zm-66 117.5c4.4-11.8 21.4-57.9 21.4-57.9l.3.6c0 0 11-28 17.7-46.2l.2-.5 1.8 8.4 12.4 58.9-53.8.7z"
        fill="#FFFFFF"
      />
      <path
        d="M232.5 151.5l-51.9 133.5-5.5-27.9c-9.6-32.5-39.6-67.8-73.1-85.4l47.5 177.1 56.1-.1 83.5-197.2h-56.6z"
        fill="#FFFFFF"
      />
      <path
        d="M134.2 151.5H47.1l-.7 4c67.1 17.1 111.5 58.5 129.8 108.2l-18.7-94.8c-3.2-12.9-12.5-16.8-23.3-17.4z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════ */
/* DASHBOARD PAGE                                   */
/* ═══════════════════════════════════════════════ */
export default function DashboardPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(true);

  /* data state */
  const [userData, setUserData] = useState<UserData | null>(null);
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [kycVerified, setKycVerified] = useState(true);

  const firstName = userData?.profile?.firstName || 'Valued Customer';
  const lastName = userData?.profile?.lastName || '';

  const liveWallet = wallets.find((w) => w.type === 'live');
  const checkingBalance = liveWallet?.balance ?? 0;
  const savingsBalance = wallets.find((w) => w.type === 'demo')?.balance ?? 0;

  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const dailyEarnings = investments.reduce((s, i) => s + i.dailyReturn, 0);
  const activePlans = investments.length;

  useEffect(() => {
    const abort = new AbortController();
    let activeMode = 'live';

    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      /* User + Wallet in parallel */
      try {
        const [userRes, walletRes] = await Promise.all([
          fetch('/api/user', { headers, signal: abort.signal }),
          fetch('/api/wallet', { headers, signal: abort.signal }),
        ]);

        if (userRes.ok) {
          const userJson = await userRes.json();
          if (userJson.success && userJson.data) {
            const u = userJson.data as UserData;
            setUserData(u);
            setKycVerified(u.kycLevel !== 'LEVEL_0');
            activeMode = u.activeMode || 'live';
          }
        }

        if (walletRes.ok) {
          const walletJson = await walletRes.json();
          if (walletJson.success && walletJson.data) {
            setWallets(walletJson.data);
          }
        }
      } catch {
        if (abort.signal.aborted) return;
      }

      /* Transactions */
      try {
        const txRes = await fetch(`/api/wallet/transactions?type=${activeMode}&limit=5`, { headers, signal: abort.signal });
        if (txRes.ok) {
          const txJson = await txRes.json();
          if (txJson.success && txJson.data?.transactions) {
            setTransactions(txJson.data.transactions);
          }
        }
      } catch {
        if (abort.signal.aborted) return;
      }

      /* Investments */
      try {
        const invRes = await fetch('/api/investments/active', { headers, signal: abort.signal });
        if (invRes.ok) {
          const invJson = await invRes.json();
          if (invJson.success && invJson.data) {
            setInvestments(invJson.data);
          }
        }
      } catch {
        if (abort.signal.aborted) return;
      }

      setLoading(false);
    };

    load();
    return () => abort.abort();
  }, []);

  /* ─── Skeleton Loader ─── */
  if (loading) {
    return (
      <div className="space-y-5">
        {/* Welcome skeleton */}
        <div className="h-40 rounded-2xl bg-muted animate-pulse" />

        {/* Card skeleton */}
        <div className="flex justify-center">
          <div className="w-full max-w-[380px] aspect-[1.586/1] rounded-2xl bg-muted animate-pulse" />
        </div>

        {/* Quick actions skeleton */}
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-muted animate-pulse" />
              <div className="w-14 h-3 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>

        {/* Account summary skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-36 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>

        {/* Transactions skeleton */}
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-muted animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-muted-foreground/10" />
              <div className="flex-1 space-y-2">
                <div className="w-32 h-3 rounded bg-muted-foreground/10" />
                <div className="w-20 h-2 rounded bg-muted-foreground/5" />
              </div>
              <div className="w-20 h-4 rounded bg-muted-foreground/10" />
            </div>
          ))}
        </div>

        {/* Investment skeleton */}
        <div className="h-40 rounded-2xl bg-muted animate-pulse" />
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-5 page-enter">
      <ChatWidget />

      {/* ═══════════════════════════════════════════ */}
      {/* 1. WELCOME BANNER                           */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#5B21B6] p-5 sm:p-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300 rounded-full blur-[100px]" />
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-white/60 text-xs sm:text-sm">{getGreeting()},</p>
            <h2 className="text-white text-xl sm:text-2xl font-bold mt-0.5">
              {firstName}{lastName ? ` ${lastName}` : ''}
            </h2>
            <p className="text-white/40 text-xs mt-1">{today}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
              <Lock size={12} className="text-white/60" />
              <span className="text-white/70 text-[10px] font-medium">Secured</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
              <Snowflake size={12} className="text-white/60" />
              <span className="text-white/70 text-[10px] font-medium">FDIC Insured</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* 2. VIRTUAL CARD DISPLAY                     */}
      {/* ═══════════════════════════════════════════ */}
      <section className="flex justify-center">
        <Link
          href="/cards"
          className="group block w-full max-w-[380px] rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          style={{ perspective: '1000px' }}
        >
          <div
            className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/30 transition-transform duration-500 ease-out group-hover:[transform:rotateY(-6deg)_rotateX(4deg)_translateZ(12px)]"
          >
            {/* Card background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#4C1D95]" />

            {/* Decorative circles */}
            <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[120%] rounded-full bg-white/[0.04]" />
            <div className="absolute bottom-[-20%] left-[-15%] w-[50%] h-[80%] rounded-full bg-white/[0.03]" />
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/[0.06] blur-sm" />

            {/* Contactless icon */}
            <div className="absolute top-4 left-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 17.5c2.76 0 5-2.24 5-5s-2.24-5-5-5"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M4 17.5c4.42 0 8-3.58 8-8s-3.58-8-8-8"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M1 17.5c6.07 0 11-4.93 11-11S7.07-4.5 1-4.5"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Chip */}
            <div className="absolute top-4 left-12">
              <div className="w-10 h-8 rounded-md bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 shadow-inner">
                <div className="w-full h-full rounded-md opacity-30" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)' }} />
              </div>
            </div>

            {/* Card content */}
            <div className="relative z-10 flex flex-col justify-between h-full p-5">
              {/* Bank name */}
              <p className="text-white/80 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase">
                CoreWealth Bank
              </p>

              {/* Card number */}
              <div>
                <p className="text-white font-mono text-base sm:text-lg tracking-[0.18em]">
                  •••• &nbsp;•••• &nbsp;•••• &nbsp;4829
                </p>
              </div>

              {/* Bottom row */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/40 text-[7px] sm:text-[8px] uppercase tracking-wider">Card Holder</p>
                  <p className="text-white text-[10px] sm:text-xs font-semibold tracking-wide uppercase mt-0.5">
                    {firstName}{lastName ? ` ${lastName}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/40 text-[7px] sm:text-[8px] uppercase tracking-wider">Expires</p>
                  <p className="text-white text-[10px] sm:text-xs font-semibold mt-0.5">12/28</p>
                </div>
                <div className="flex items-center">
                  <VisaLogo />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* 3. QUICK ACTIONS ROW                        */}
      {/* ═══════════════════════════════════════════ */}
      <section>
        <div className="grid grid-cols-4 gap-3">
          <Link href="/internal-transfer" className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center text-white shadow-lg shadow-[#7C3AED]/20 group-hover:scale-105 group-hover:shadow-[#7C3AED]/30 transition-all duration-300">
              <ArrowRightLeft size={20} />
            </div>
            <span className="text-muted-foreground text-[10px] sm:text-xs font-medium group-hover:text-foreground transition-colors">
              Transfer
            </span>
          </Link>

          <Link href="/pay-bills" className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 group-hover:shadow-emerald-500/30 transition-all duration-300">
              <Receipt size={20} />
            </div>
            <span className="text-muted-foreground text-[10px] sm:text-xs font-medium group-hover:text-foreground transition-colors">
              Pay Bills
            </span>
          </Link>

          <Link href="/deposit" className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 group-hover:shadow-sky-500/30 transition-all duration-300">
              <Download size={20} />
            </div>
            <span className="text-muted-foreground text-[10px] sm:text-xs font-medium group-hover:text-foreground transition-colors">
              Deposit
            </span>
          </Link>

          <Link href="/withdraw" className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-105 group-hover:shadow-amber-500/30 transition-all duration-300">
              <Upload size={20} />
            </div>
            <span className="text-muted-foreground text-[10px] sm:text-xs font-medium group-hover:text-foreground transition-colors">
              Withdraw
            </span>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* 4. ACCOUNT SUMMARY                          */}
      {/* ═══════════════════════════════════════════ */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Checking Account */}
          <div className="premium-card card-shine p-5">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center">
                    <CreditCard size={17} className="text-[#7C3AED]" />
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-semibold">Checking Account</p>
                    <p className="text-muted-foreground text-[10px]">•••• 4829</p>
                  </div>
                </div>
                <Link
                  href="/checking-statement"
                  className="flex items-center gap-0.5 text-[10px] text-[#A78BFA] font-medium hover:text-[#7C3AED] transition-colors"
                >
                  View <ChevronRight size={12} />
                </Link>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-foreground text-2xl font-bold">
                  {showBalance ? formatCurrency(checkingBalance) : '••••••'}
                </p>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-muted-foreground/50 hover:text-muted-foreground transition-colors mb-1"
                  aria-label={showBalance ? 'Hide balance' : 'Show balance'}
                >
                  {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <p className="text-muted-foreground text-xs mt-1">Available balance</p>
            </div>
          </div>

          {/* Savings Account */}
          <div className="premium-card card-shine p-5">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                    <DollarSign size={17} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-semibold">Savings Account</p>
                    <p className="text-muted-foreground text-[10px]">•••• 7631</p>
                  </div>
                </div>
                <Link
                  href="/savings-statement"
                  className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-medium hover:text-emerald-300 transition-colors"
                >
                  View <ChevronRight size={12} />
                </Link>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-foreground text-2xl font-bold">
                  {showBalance ? formatCurrency(savingsBalance) : '••••••'}
                </p>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-muted-foreground/50 hover:text-muted-foreground transition-colors mb-1"
                  aria-label={showBalance ? 'Hide balance' : 'Show balance'}
                >
                  {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={12} className="text-emerald-400" />
                <p className="text-emerald-400 text-xs font-medium">4.5% APY</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* 5. RECENT TRANSACTIONS                      */}
      {/* ═══════════════════════════════════════════ */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-foreground font-semibold text-sm">Recent Transactions</h3>
          <Link
            href="/transactions"
            className="flex items-center gap-0.5 text-[#A78BFA] text-xs font-medium hover:text-[#7C3AED] transition-colors"
          >
            View All <ChevronRight size={14} />
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-muted flex items-center justify-center">
              <Receipt size={22} className="text-muted-foreground/40" />
            </div>
            <p className="text-foreground text-sm font-medium">No transactions yet</p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              Your transaction history will appear here
            </p>
          </div>
        ) : (
          <div className="glass-card divide-y divide-border overflow-hidden">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  {getTransactionIcon(tx.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium capitalize">
                    {tx.description || tx.type.replace(/_/g, ' ')}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock size={10} className="text-muted-foreground/50" />
                    <p className="text-muted-foreground text-[10px]">{formatDate(tx.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`text-sm font-semibold ${
                      isCredit(tx.type) ? 'text-emerald-400' : 'text-foreground'
                    }`}
                  >
                    {isCredit(tx.type) ? '+' : '-'}${formatMoney(tx.amount)}
                  </p>
                  <p
                    className={`text-[10px] font-medium ${
                      tx.status === 'completed' || tx.status === 'confirmed'
                        ? 'text-emerald-400'
                        : tx.status === 'pending'
                          ? 'text-amber-400'
                          : 'text-red-400'
                    }`}
                  >
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* 6. INVESTMENT OVERVIEW                      */}
      {/* ═══════════════════════════════════════════ */}
      <section>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center">
                <TrendingUp size={17} className="text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-foreground text-sm font-semibold">Investment Overview</p>
                <p className="text-muted-foreground text-[10px]">
                  {activePlans > 0 ? 'Your active wealth growth plans' : 'Start growing your wealth today'}
                </p>
              </div>
            </div>
            <Link
              href="/investments"
              className="flex items-center gap-0.5 text-[#A78BFA] text-xs font-medium hover:text-[#7C3AED] transition-colors"
            >
              View <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center">
                <DollarSign size={14} className="text-[#A78BFA]" />
              </div>
              <p className="text-foreground text-xs font-semibold">Total Invested</p>
              <p className="text-foreground text-base sm:text-lg font-bold mt-0.5">
                ${formatMoney(totalInvested)}
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Settings size={14} className="text-emerald-400" />
              </div>
              <p className="text-foreground text-xs font-semibold">Active Plans</p>
              <p className="text-foreground text-base sm:text-lg font-bold mt-0.5">{activePlans}</p>
            </div>

            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <TrendingUp size={14} className="text-amber-400" />
              </div>
              <p className="text-foreground text-xs font-semibold">Daily Earnings</p>
              <p className="text-emerald-400 text-base sm:text-lg font-bold mt-0.5">
                +${formatMoney(dailyEarnings)}
              </p>
            </div>
          </div>

          {investments.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider mb-2">
                Active Plans
              </p>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {investments.slice(0, 3).map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-foreground text-xs font-medium">{inv.plan.tierName} Plan</span>
                    </div>
                    <div className="text-right">
                      <span className="text-foreground text-xs font-semibold">
                        ${formatMoney(inv.amount)}
                      </span>
                      <span className="text-muted-foreground text-[10px] ml-1.5">
                        {(inv.plan.dailyReturnRate * 100).toFixed(1)}% daily
                      </span>
                    </div>
                  </div>
                ))}
                {investments.length > 3 && (
                  <Link
                    href="/investments"
                    className="block text-center text-[#A78BFA] text-[10px] font-medium pt-1 hover:text-[#7C3AED] transition-colors"
                  >
                    +{investments.length - 3} more plan{investments.length - 3 !== 1 ? 's' : ''}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* 7. KYC ALERT                                */}
      {/* ═══════════════════════════════════════════ */}
      {!kycVerified && (
        <section>
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                <AlertCircle size={20} className="text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-sm font-semibold">Complete Identity Verification</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Verify your identity to unlock full banking features including higher limits, faster transfers, and premium services.
                </p>
              </div>
              <Link
                href="/kyc"
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shrink-0 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
              >
                <Shield size={14} />
                Verify Now
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
