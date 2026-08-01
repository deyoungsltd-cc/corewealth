'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  Eye,
  EyeOff,
  Snowflake,
  Settings,
  DollarSign,
  Clock,
  Landmark,
  Wallet,
  Bitcoin,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  Lock,
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
      return <ArrowDownLeft size={16} className="text-emerald-400" />;
    case 'withdrawal':
      return <ArrowUpRight size={16} className="text-red-400" />;
    case 'investment':
      return <TrendingUp size={16} className="text-[#A78BFA]" />;
    case 'investment_return':
      return <DollarSign size={16} className="text-emerald-400" />;
    case 'referral_bonus':
    case 'promo_credit':
      return <Zap size={16} className="text-amber-400" />;
    case 'fee':
      return <Receipt size={16} className="text-red-400" />;
    case 'transfer':
      return <ArrowRightLeft size={16} className="text-sky-400" />;
    default:
      return <Receipt size={16} className="text-muted-foreground" />;
  }
};

const isCredit = (type: string) =>
  ['deposit', 'investment_return', 'referral_bonus', 'promo_credit', 'balance_adjustment'].includes(type);

/* ─── Quick Action Inline SVG Icons ─── */
function TransferIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function PayBillsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
      <line x1="6" y1="15" x2="10" y2="15" />
      <line x1="14" y1="15" x2="18" y2="15" />
    </svg>
  );
}

function DepositIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" /><path d="M19 12l-7 7-7-7" />
    </svg>
  );
}

function WithdrawIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5" /><path d="M5 12l7-7 7 7" />
    </svg>
  );
}

function CryptoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 12.7a3 3 0 0 1 3.8-2.9 3 3 0 0 1 2.1 2.9" />
      <path d="M14.9 11.3a3 3 0 0 1-3.8 2.9 3 3 0 0 1-2.1-2.9" />
      <line x1="12" y1="4" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="20" />
      <line x1="4" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="20" y2="12" />
    </svg>
  );
}

function CardsActionIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

/* ─── Chip Component ─── */
function CardChip() {
  return (
    <div className="w-10 h-8 rounded-md bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 shadow-inner relative overflow-hidden">
      <div
        className="w-full h-full rounded-md opacity-30"
        style={{
          background:
            'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-5 h-5 border border-amber-600/30 rounded-sm" />
      </div>
    </div>
  );
}

/* ─── Contactless Icon ─── */
function ContactlessIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M7 17.5c2.76 0 5-2.24 5-5s-2.24-5-5-5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 17.5c4.42 0 8-3.58 8-8s-3.58-8-8-8" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M1 17.5c6.07 0 11-4.93 11-11S7.07-4.5 1-4.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Trend Up Indicator ─── */
function TrendIndicator({ value, positive, label }: { value: string; positive: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-2.5 py-1">
      <TrendingUp size={11} className={positive ? 'text-emerald-300' : 'text-red-300'} />
      <span className={positive ? 'text-emerald-300' : 'text-red-300'}>{value}</span>
      <span className="text-white/40 text-[9px]">{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/* DASHBOARD PAGE                                     */
/* ═══════════════════════════════════════════════════ */
export default function DashboardPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(0);

  /* data state */
  const [userData, setUserData] = useState<UserData | null>(null);
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);

  const firstName = userData?.profile?.firstName || 'Valued Customer';
  const lastName = userData?.profile?.lastName || '';

  const liveWallet = wallets.find((w) => w.type === 'live');
  const demoWallet = wallets.find((w) => w.type === 'demo');
  const checkingBalance = liveWallet?.balance ?? 0;
  const savingsBalance = demoWallet?.balance ?? 0;
  const cryptoBalance = (liveWallet?.balance ?? 0) * 0.000038;

  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const dailyEarnings = investments.reduce((s, i) => s + i.dailyReturn, 0);
  const activePlans = investments.length;
  const kycVerified = userData?.kycLevel !== '0' && userData?.kycLevel !== 'LEVEL_0';

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const cardWidth = clientWidth * 0.85;
    const gap = 16;
    const offset = cardWidth + gap;
    const index = Math.round(scrollLeft / offset);
    setActiveCard(Math.min(index, 2));
  }, []);

  const scrollToCard = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const cardWidth = clientWidth * 0.85;
    const gap = 16;
    const offset = cardWidth + gap;
    scrollRef.current.scrollTo({ left: index * offset, behavior: 'smooth' });
    setActiveCard(index);
  }, []);

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

      try {
        const txRes = await fetch(`/api/wallet/transactions?type=${activeMode}&limit=5`, {
          headers,
          signal: abort.signal,
        });
        if (txRes.ok) {
          const txJson = await txRes.json();
          if (txJson.success && txJson.data?.transactions) {
            setTransactions(txJson.data.transactions);
          }
        }
      } catch {
        if (abort.signal.aborted) return;
      }

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

  /* ─── Balance Card Data ─── */
  const balanceCards = [
    {
      title: 'Checking Account',
      maskedNumber: '•••• 4829',
      balance: checkingBalance,
      gradient: 'from-[#7C3AED] via-[#6D28D9] to-[#4C1D95]',
      accentColor: '#A78BFA',
      trend: { value: '+2.4%', positive: true, label: 'vs last month' },
      icon: <Landmark size={18} className="text-white/70" />,
    },
    {
      title: 'Savings Account',
      maskedNumber: '•••• 7631',
      balance: savingsBalance,
      gradient: 'from-emerald-600 via-emerald-700 to-teal-800',
      accentColor: '#34D399',
      trend: { value: '4.5% APY', positive: true, label: 'high yield' },
      icon: <Wallet size={18} className="text-white/70" />,
    },
    {
      title: 'Crypto Wallet',
      maskedNumber: '•••• 0x7F3a',
      balance: cryptoBalance,
      gradient: 'from-blue-600 via-indigo-700 to-violet-800',
      accentColor: '#60A5FA',
      trend: { value: '+5.7%', positive: true, label: '24h change' },
      icon: <Bitcoin size={18} className="text-white/70" />,
    },
  ];

  /* ─── Quick Actions Data ─── */
  const quickActions = [
    { label: 'Transfer', href: '/internal-transfer', icon: <TransferIcon /> },
    { label: 'Pay Bills', href: '/pay-bills', icon: <PayBillsIcon /> },
    { label: 'Deposit', href: '/deposit', icon: <DepositIcon /> },
    { label: 'Withdraw', href: '/withdraw', icon: <WithdrawIcon /> },
    { label: 'Buy Crypto', href: '/buy-crypto', icon: <CryptoIcon /> },
    { label: 'Cards', href: '/cards', icon: <CardsActionIcon /> },
  ];

  /* ─── Skeleton Loader ─── */
  if (loading) {
    return (
      <div className="space-y-6 page-enter">
        <div className="h-20 rounded-2xl bg-muted animate-pulse" />
        <div className="flex justify-center">
          <div className="w-[85%] max-w-[360px] aspect-[1.6/1] rounded-2xl bg-muted animate-pulse" />
        </div>
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-muted animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2.5">
              <div className="w-14 h-14 rounded-2xl bg-muted animate-pulse" />
              <div className="w-16 h-3 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-5 w-40 rounded bg-muted animate-pulse" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-muted animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-muted-foreground/10" />
              <div className="flex-1 space-y-2">
                <div className="w-32 h-3.5 rounded bg-muted-foreground/10" />
                <div className="w-20 h-2.5 rounded bg-muted-foreground/5" />
              </div>
              <div className="w-24 h-4 rounded bg-muted-foreground/10" />
            </div>
          ))}
        </div>
        <div className="h-48 rounded-2xl bg-muted animate-pulse" />
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
    <div className="space-y-6 page-enter">
      <ChatWidget />

      {/* ═══════════════════════════════════════════ */}
      {/* 1. WELCOME BANNER                             */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#5B21B6] p-5 sm:p-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300 rounded-full blur-[100px]" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
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
      {/* 2. SWIPEABLE BALANCE CARDS                   */}
      {/* ═══════════════════════════════════════════ */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-foreground font-semibold text-sm">My Accounts</h3>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium hover:text-foreground transition-colors"
            aria-label={showBalance ? 'Hide balance' : 'Show balance'}
          >
            {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
            {showBalance ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Scroll-snap horizontal container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-2 px-1"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {balanceCards.map((card, idx) => (
            <div
              key={idx}
              className="relative flex-shrink-0 w-[85%] max-w-[360px] aspect-[1.6/1] rounded-2xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing transition-shadow duration-300 hover:shadow-purple-500/20"
              style={{ scrollSnapAlign: 'center' }}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />

              {/* Decorative elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[30%] -right-[10%] w-[60%] h-[120%] rounded-full bg-white/[0.04]" />
                <div className="absolute bottom-[-20%] left-[-15%] w-[50%] h-[80%] rounded-full bg-white/[0.03]" />
                <div
                  className="absolute top-3 right-3 w-20 h-20 rounded-full blur-xl opacity-20"
                  style={{ backgroundColor: card.accentColor }}
                />
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
              </div>

              {/* Card content */}
              <div className="relative z-10 flex flex-col justify-between h-full p-5">
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      {card.icon}
                    </div>
                    <div>
                      <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider">
                        {card.title}
                      </p>
                      <p className="text-white/40 text-[10px] font-mono mt-0.5">
                        {card.maskedNumber}
                      </p>
                    </div>
                  </div>
                  <ContactlessIcon />
                </div>

                {/* Middle - Balance */}
                <div>
                  <p className="text-white text-xl sm:text-2xl font-bold tracking-tight">
                    {showBalance ? formatCurrency(card.balance) : '••••••••'}
                  </p>
                  <p className="text-white/40 text-[10px] mt-0.5">Available balance</p>
                </div>

                {/* Bottom row */}
                <div className="flex items-end justify-between">
                  <TrendIndicator
                    value={card.trend.value}
                    positive={card.trend.positive}
                    label={card.trend.label}
                  />
                  <div className="flex items-center gap-2">
                    <CardChip />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-3">
          {balanceCards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToCard(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeCard
                  ? 'w-6 bg-[#7C3AED]'
                  : 'w-2 bg-white/20 hover:bg-white/30'
              }`}
              aria-label={`Go to ${balanceCards[idx].title}`}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* 3. KYC ALERT (shown first if needed)        */}
      {/* ═══════════════════════════════════════════ */}
      {!kycVerified && (
        <section>
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
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
                className="flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shrink-0 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
              >
                <Shield size={14} />
                Verify Now
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* 4. QUICK ACTIONS GRID (2x3)                 */}
      {/* ═══════════════════════════════════════════ */}
      <section>
        <h3 className="text-foreground font-semibold text-sm mb-3 px-1">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2.5 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center text-[#A78BFA] shadow-lg shadow-black/10 group-hover:bg-[#7C3AED]/20 group-hover:border-[#7C3AED]/30 group-hover:text-white group-hover:scale-105 group-hover:shadow-[#7C3AED]/20 transition-all duration-300">
                {action.icon}
              </div>
              <span className="text-muted-foreground text-xs font-medium group-hover:text-foreground transition-colors">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* 5. RECENT TRANSACTIONS                       */}
      {/* ═══════════════════════════════════════════ */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-foreground font-semibold text-sm">Recent Transactions</h3>
          <Link
            href="/transactions"
            className="flex items-center gap-0.5 text-[#A78BFA] text-xs font-medium hover:text-[#7C3AED] transition-colors"
          >
            View All <ChevronRight size={14} />
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-muted flex items-center justify-center">
              <Receipt size={22} className="text-muted-foreground/40" />
            </div>
            <p className="text-foreground text-sm font-medium">No transactions yet</p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              Your transaction history will appear here
            </p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl divide-y divide-white/5 overflow-hidden">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
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
                      isCredit(tx.type) ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {isCredit(tx.type) ? '+' : '-'}${formatMoney(tx.amount)}
                  </p>
                  <p
                    className={`text-[10px] font-medium capitalize ${
                      tx.status === 'completed' || tx.status === 'confirmed'
                        ? 'text-emerald-400/70'
                        : tx.status === 'pending'
                          ? 'text-amber-400/70'
                          : 'text-red-400/70'
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
      {/* 6. INVESTMENT OVERVIEW                       */}
      {/* ═══════════════════════════════════════════ */}
      <section>
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center">
                <TrendingUp size={17} className="text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-foreground text-sm font-semibold">Investment Overview</p>
                <p className="text-muted-foreground text-[10px]">
                  {activePlans > 0
                    ? 'Your active wealth growth plans'
                    : 'Start growing your wealth today'}
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
            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
              <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center">
                <DollarSign size={14} className="text-[#A78BFA]" />
              </div>
              <p className="text-foreground text-[10px] sm:text-xs font-semibold">Total Invested</p>
              <p className="text-foreground text-sm sm:text-base font-bold mt-0.5">
                ${formatMoney(totalInvested)}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
              <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Settings size={14} className="text-emerald-400" />
              </div>
              <p className="text-foreground text-[10px] sm:text-xs font-semibold">Active Plans</p>
              <p className="text-foreground text-sm sm:text-base font-bold mt-0.5">
                {activePlans}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
              <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <TrendingUp size={14} className="text-amber-400" />
              </div>
              <p className="text-foreground text-[10px] sm:text-xs font-semibold">Daily Earnings</p>
              <p className="text-emerald-400 text-sm sm:text-base font-bold mt-0.5">
                +${formatMoney(dailyEarnings)}
              </p>
            </div>
          </div>

          {investments.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider mb-2">
                Active Plans
              </p>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {investments.slice(0, 3).map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-foreground text-xs font-medium">
                        {inv.plan.tierName} Plan
                      </span>
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
                    +{investments.length - 3} more
                    plan{investments.length - 3 !== 1 ? 's' : ''}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
