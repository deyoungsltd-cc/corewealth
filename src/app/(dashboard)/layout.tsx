'use client';

import { type ReactNode, Component, type ErrorInfo, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sun, Moon, LayoutDashboard, Download, Upload, User, CreditCard, FileText, HelpCircle, Bell, Shield, ArrowRightLeft, Receipt, Landmark, QrCode, UserPlus, DollarSign, TrendingUp, Globe, Lock, Bitcoin } from 'lucide-react';
import CoreWealthLogo from '@/components/CoreWealthLogo';
import NotificationWatcher from '@/components/NotificationWatcher';
import KycCodeGate from '@/components/KycCodeGate';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import OnboardingWalkthrough from '@/components/OnboardingWalkthrough';
import { useAuthStore } from '@/store/useAuthStore';

// ── Error Boundary ──
interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }
class DashboardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Dashboard Error Boundary]', error?.message, error?.stack, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/30 flex items-center justify-center">
              <Shield size={28} className="text-[#2563EB]" />
            </div>
            <h2 className="text-foreground text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground text-sm mb-2">An unexpected error occurred on this page.</p>
            {this.state.error?.message && (
              <p className="text-destructive/70 text-[10px] font-mono mb-3 break-all max-w-xs">{this.state.error.message}</p>
            )}
            <p className="text-muted-foreground text-xs mb-6">Please try refreshing the page or sign in again.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">Refresh</button>
              <Link href="/login" className="border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">Sign In</Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/investments': 'Investments',
  '/deposit': 'Deposit',
  '/withdraw': 'Withdraw',
  '/kyc': 'Identity Verification',
  '/profile': 'My Profile',
  '/referral': 'Referrals',
  '/notifications': 'Notifications',
  '/support': 'Help & Support',
  '/security': 'Security',
  '/transactions': 'Transaction History',
  '/market': 'Markets & Rates',
  '/internal-transfer': 'Transfers',
  '/wire-transfer': 'Wire Transfer',
  '/pay-bills': 'Pay Bills',
  '/beneficiaries': 'Beneficiaries',
  '/checking-statement': 'Checking Statement',
  '/savings-statement': 'Savings Statement',
  '/crypto-statement': 'Crypto Statement',
  '/cards': 'Cards',
  '/cards/apply': 'Apply for Card',
  '/cards/manage': 'Manage Card',
  '/cards/tracking': 'Card Tracking',
  '/buy-crypto': 'Buy Crypto',
  '/tax-refund': 'Tax Refund',
  '/receive-funds': 'Receive Funds',
  '/link-bank': 'Link Bank Account',
};

const bottomNav = [
  { href: '/dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
  { href: '/transactions', label: 'Activity', icon: <FileText size={20} /> },
  { href: '/deposit', label: 'Deposit', icon: <Download size={20} /> },
  { href: '/withdraw', label: 'Withdraw', icon: <Upload size={20} /> },
  { href: '/profile', label: 'Profile', icon: <User size={20} /> },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const title = titles[pathname] || 'Dashboard';
  const { user, token, isLoading, fetchUser } = useAuthStore();

  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleUnreadChange = useCallback((count: number) => setUnreadCount(count), []);
  const handleNewNotification = useCallback((title: string, body: string) => {
    setToast({ title, body });
    setTimeout(() => setToast(null), 5000);
  }, []);

  // Theme toggle
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (saved && saved !== 'dark') {
      document.documentElement.classList.toggle('light', saved === 'light');
    }
  }, []);
  useEffect(() => { setTheme(localStorage.getItem('theme') as 'dark' | 'light' || 'dark'); }, []);
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('light', next === 'light');
  };

  // Refresh user data on navigation
  useEffect(() => {
    if (token && !isLoading) fetchUser();
  }, [pathname]);
  useEffect(() => {
    if (token && !user && !isLoading) fetchUser();
  }, [token, user, isLoading, fetchUser]);

  // Auth redirect
  useEffect(() => {
    if (!token && !isLoading) router.replace('/login');
  }, [token, isLoading, router]);

  // Loading state
  if (isLoading && !user) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col items-center justify-center">
        <CoreWealthLogo variant="compact" className="h-8 mb-4 opacity-50" />
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const firstName = user?.profile?.firstName || '';
  const lastName = user?.profile?.lastName || '';
  const userInitials = [firstName?.charAt(0), lastName?.charAt(0)].filter(Boolean).join('').toUpperCase() || (user?.email?.charAt(0)?.toUpperCase() || 'U');
  const userAvatarUrl = user?.profile?.avatarUrl || null;

  const sidebarLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { href: '/transactions', label: 'Transactions', icon: <FileText size={18} /> },
    { href: '/internal-transfer', label: 'Transfers', icon: <ArrowRightLeft size={18} /> },
    { href: '/wire-transfer', label: 'Wire Transfer', icon: <Globe size={18} /> },
    { href: '/deposit', label: 'Deposit', icon: <Download size={18} /> },
    { href: '/withdraw', label: 'Withdraw', icon: <Upload size={18} /> },
    { href: '/receive-funds', label: 'Receive Funds', icon: <QrCode size={18} /> },
    { href: '/link-bank', label: 'Link Bank', icon: <Landmark size={18} /> },
    { href: '/cards', label: 'Cards', icon: <CreditCard size={18} /> },
    { href: '/buy-crypto', label: 'Buy Crypto', icon: <Bitcoin size={18} /> },
    { href: '/pay-bills', label: 'Pay Bills', icon: <Receipt size={18} /> },
    { href: '/beneficiaries', label: 'Beneficiaries', icon: <UserPlus size={18} /> },
    { href: '/tax-refund', label: 'Tax Refund', icon: <DollarSign size={18} /> },
    { href: '/investments', label: 'Investments', icon: <TrendingUp size={18} /> },
    { href: '/kyc', label: 'Verification', icon: <Shield size={18} /> },
    { href: '/security', label: 'Security', icon: <Lock size={18} /> },
    { href: '/support', label: 'Support', icon: <HelpCircle size={18} /> },
    { href: '/profile', label: 'Profile', icon: <User size={18} /> },
  ];

  return (
    <DashboardErrorBoundary>
      <KycCodeGate />
      <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shrink-0">
          <div className="flex items-center justify-between h-14 px-4 max-w-6xl w-full mx-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              <CoreWealthLogo variant="compact" className="h-8 shrink-0" />
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/notifications" className="relative text-muted-foreground hover:text-foreground transition-colors">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-[#2563EB] rounded-full flex items-center justify-center text-white text-[9px] font-bold px-1 animate-[pulse_2s_infinite]">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
              <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link href="/profile" className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
                {userAvatarUrl ? (
                  <img src={userAvatarUrl} alt={userInitials} className="w-full h-full object-cover" />
                ) : (
                  userInitials
                )}
              </Link>
            </div>
          </div>
        </header>

        <div className="flex-1 flex max-w-6xl w-full mx-auto">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-border py-4 px-3 h-[calc(100dvh-56px)] sticky top-14 overflow-y-auto">
            <nav className="flex flex-col gap-1">
              {sidebarLinks.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto pt-4 border-t border-border">
              <div className="glass-card p-3 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">Need help?</p>
                <Link href="/support" className="text-[#2563EB] text-xs font-semibold hover:underline">Contact Support</Link>
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
              <aside className="absolute left-0 top-0 bottom-0 w-64 bg-background border-r border-border p-4 overflow-y-auto animate-slide-down">
                <div className="flex items-center justify-between mb-6">
                  <CoreWealthLogo variant="compact" className="h-8" />
                  <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <nav className="flex flex-col gap-1">
                  {sidebarLinks.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                        {item.icon}
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </aside>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 px-4 py-5 pb-24 lg:pb-5 overflow-x-hidden animate-fade-in">
            <div className="mb-4">
              <h1 className="text-foreground font-bold text-lg">{title}</h1>
            </div>
            {children}
          </main>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border safe-bottom lg:hidden">
          <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
            {bottomNav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-0.5 py-1 px-2 transition-colors ${active ? 'text-[#2563EB]' : 'text-muted-foreground'}`}>
                  {item.icon}
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <NotificationWatcher onUnreadChange={handleUnreadChange} onNewNotification={handleNewNotification} />
        <PWAInstallPrompt />
        <OnboardingWalkthrough />

        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-16 right-4 z-[200] max-w-sm w-full animate-slide-down pointer-events-auto">
            <div className="bg-card border border-[#2563EB]/30 rounded-xl p-4 shadow-2xl shadow-[#2563EB]/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2563EB]/15 flex items-center justify-center shrink-0">
                  <Bell size={16} className="text-[#2563EB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-semibold">{toast.title}</p>
                  <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{toast.body}</p>
                </div>
                <button onClick={() => setToast(null)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <div className="mt-2 pt-2 border-t border-border">
                <Link href="/notifications" className="text-[#2563EB] text-[10px] font-bold hover:underline">View all notifications</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardErrorBoundary>
  );
}