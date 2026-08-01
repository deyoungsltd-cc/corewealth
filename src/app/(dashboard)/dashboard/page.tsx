'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowUpRight, ArrowDownLeft, Send, Download, Upload, Landmark, Shield, CreditCard, ArrowRightLeft, Receipt, TrendingUp, Eye, EyeOff, ChevronRight } from 'lucide-react';

interface AccountData {
  balance: number;
  accountNumber: string;
  accountType: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
  description?: string;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [showBalance, setShowBalance] = useState(true);
  const [checking, setChecking] = useState<AccountData | null>(null);
  const [savings, setSavings] = useState<AccountData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.profile?.firstName || 'Valued Customer';
  const lastName = user?.profile?.lastName || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/user/accounts');
        if (res.ok) {
          const data = await res.json();
          if (data.accounts) {
            data.accounts.forEach((acc: AccountData) => {
              if (acc.accountType === 'checking' || !checking) setChecking(acc);
              else if (acc.accountType === 'savings' || !savings) setSavings(acc);
            });
          }
          if (data.balance !== undefined && !checking) {
            setChecking({ balance: data.balance, accountNumber: data.accountNumber || '****1234', accountType: 'checking' });
          }
        }
      } catch { /* use defaults */ }

      try {
        const res = await fetch('/api/transactions?limit=5');
        if (res.ok) {
          const data = await res.json();
          setTransactions(data.transactions || []);
        }
      } catch { /* empty list */ }

      setLoading(false);
    };
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft size={16} className="text-emerald-400" />;
      case 'withdrawal': return <ArrowUpRight size={16} className="text-orange-400" />;
      case 'transfer': return <ArrowRightLeft size={16} className="text-blue-400" />;
      default: return <Receipt size={16} className="text-muted-foreground" />;
    }
  };

  const quickActions = [
    { href: '/internal-transfer', label: 'Transfer', icon: <Send size={20} />, color: 'from-violet-600 to-purple-600' },
    { href: '/deposit', label: 'Deposit', icon: <Download size={20} />, color: 'from-emerald-600 to-teal-600' },
    { href: '/withdraw', label: 'Withdraw', icon: <Upload size={20} />, color: 'from-amber-600 to-orange-600' },
    { href: '/pay-bills', label: 'Pay Bills', icon: <Receipt size={20} />, color: 'from-rose-600 to-pink-600' },
  ];

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
        <div className="h-32 rounded-2xl bg-muted animate-pulse" />
      </div>
    );
  }

  const primaryBalance = checking?.balance || 0;
  const savingsBalance = savings?.balance || 0;
  const totalBalance = primaryBalance + savingsBalance;

  return (
    <div className="space-y-5">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#5B21B6] p-5 sm:p-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300 rounded-full blur-[100px]" />
        </div>
        <div className="relative">
          <p className="text-white/70 text-sm">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},</p>
          <h2 className="text-white text-xl sm:text-2xl font-bold mt-0.5">{firstName} {lastName}</h2>
          <div className="mt-4 flex items-end gap-2">
            <p className="text-white/60 text-sm">Total Balance</p>
            <button onClick={() => setShowBalance(!showBalance)} className="text-white/40 hover:text-white/70 transition-colors">
              {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <p className="text-white text-3xl sm:text-4xl font-bold mt-1 tracking-tight">
            {showBalance ? formatCurrency(totalBalance) : '****.**'}
          </p>
          <p className="text-white/50 text-xs mt-1">CoreWealth Premium Checking</p>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Checking Account */}
        <div className="premium-card card-shine p-5">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/15 flex items-center justify-center">
                  <CreditCard size={16} className="text-[#7C3AED]" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-semibold">Checking</p>
                  <p className="text-muted-foreground text-[10px]">{checking?.accountNumber || '****1234'}</p>
                </div>
              </div>
              <Link href="/checking-statement" className="text-[10px] text-[#7C3AED] font-medium hover:underline">Statement</Link>
            </div>
            <p className="text-foreground text-2xl font-bold">{showBalance ? formatCurrency(primaryBalance) : '****.**'}</p>
            <p className="text-muted-foreground text-xs mt-1">Available balance</p>
          </div>
        </div>

        {/* Savings Account */}
        <div className="premium-card card-shine p-5">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                  <Landmark size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-semibold">Savings</p>
                  <p className="text-muted-foreground text-[10px]">{savings?.accountNumber || '****5678'}</p>
                </div>
              </div>
              <Link href="/savings-statement" className="text-[10px] text-emerald-400 font-medium hover:underline">Statement</Link>
            </div>
            <p className="text-foreground text-2xl font-bold">{showBalance ? formatCurrency(savingsBalance) : '****.**'}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp size={12} className="text-emerald-400" />
              <p className="text-emerald-400 text-xs font-medium">4.5% APY</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-foreground font-semibold text-sm mb-3">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className="flex flex-col items-center gap-2 group">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
                {action.icon}
              </div>
              <span className="text-muted-foreground text-[10px] font-medium group-hover:text-foreground transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Security Alert / KYC Status */}
      <div className="glass-card p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
          <Shield size={18} className="text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-foreground text-sm font-semibold">Account Security</p>
          <p className="text-muted-foreground text-xs mt-0.5">Complete identity verification to unlock all banking features</p>
        </div>
        <Link href="/kyc" className="flex items-center gap-1 text-[#7C3AED] text-xs font-semibold shrink-0 hover:underline">
          Verify <ChevronRight size={14} />
        </Link>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-foreground font-semibold text-sm">Recent Transactions</h3>
          <Link href="/transactions" className="text-[#7C3AED] text-xs font-medium hover:underline">View All</Link>
        </div>
        {transactions.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Receipt size={32} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">No transactions yet</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="glass-card divide-y divide-border overflow-hidden">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  {getTransactionIcon(tx.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium capitalize">{tx.description || tx.type}</p>
                  <p className="text-muted-foreground text-[10px] mt-0.5">{formatTimeAgo(tx.createdAt)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-semibold ${(tx.type === 'deposit' || tx.type === 'credit') ? 'text-emerald-400' : 'text-foreground'}`}>
                    {tx.type === 'deposit' || tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                  <p className={`text-[10px] font-medium ${tx.status === 'completed' || tx.status === 'approved' ? 'text-emerald-400' : tx.status === 'pending' ? 'text-amber-400' : 'text-red-400'}`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Investment Overview Card */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/15 flex items-center justify-center">
              <TrendingUp size={16} className="text-[#7C3AED]" />
            </div>
            <div>
              <p className="text-foreground text-sm font-semibold">Investments</p>
              <p className="text-muted-foreground text-[10px]">Grow your wealth with curated plans</p>
            </div>
          </div>
          <Link href="/investments" className="flex items-center gap-1 text-[#7C3AED] text-xs font-semibold hover:underline">
            View <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Starter', apy: '6.2%', min: '$500' },
            { label: 'Silver', apy: '8.5%', min: '$5,000' },
            { label: 'Gold', apy: '11.2%', min: '$25,000' },
          ].map((plan) => (
            <div key={plan.label} className="bg-muted/50 rounded-xl p-3 text-center">
              <p className="text-foreground text-xs font-semibold">{plan.label}</p>
              <p className="text-[#7C3AED] text-lg font-bold mt-0.5">{plan.apy}</p>
              <p className="text-muted-foreground text-[9px]">from {plan.min}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}