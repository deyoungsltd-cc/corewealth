'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import CoreWealthLogo from '@/components/CoreWealthLogo';
import TurnstileWidget from '@/components/TurnstileWidget';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('remembered_email');
      if (saved) { setEmail(saved); setRememberMe(true); }
    } catch {}
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captchaToken: captchaToken || undefined }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        if (data.data.requires2FA && data.data.token) {
          // Auto-verify 2FA if token returned, skip OTP UI
          if (rememberMe) localStorage.setItem('remembered_email', email);
          else localStorage.removeItem('remembered_email');
          setAuth(data.data.user, data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          router.push(data.data.user?.adminRecord ? '/admin' : '/dashboard');
          return;
        }
        if (data.data.token) {
          if (rememberMe) localStorage.setItem('remembered_email', email);
          else localStorage.removeItem('remembered_email');
          setAuth(data.data.user, data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          router.push(data.data.user?.adminRecord ? '/admin' : '/dashboard');
        }
      } else {
        setError(data.error?.message || 'Invalid credentials. Please try again.');
        if (data.error?.code === 'EMAIL_NOT_VERIFIED' && data.error?.email) {
          router.push(`/verify-email?email=${encodeURIComponent(data.error.email)}`);
        }
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field: string) =>
    `w-full bg-white/5 border ${fieldErrors[field] ? 'border-red-500/80' : 'border-white/10'} rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#7C3AED]/60 focus:ring-1 focus:ring-[#7C3AED]/20 transition-all duration-200`;

  return (
    <div className="min-h-screen bg-[#060A13] flex">
      {/* Left panel — branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/20 via-[#060A13] to-[#6D28D9]/10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#7C3AED]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#A78BFA]/5 rounded-full blur-[100px]" />
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div>
            <CoreWealthLogo variant="wordmark" className="h-9" />
          </div>
          <div className="max-w-lg">
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              Your finances,{' '}
              <span className="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] bg-clip-text text-transparent">
              elevated.
              </span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Access your accounts, manage cards, track spending, and grow your wealth — all from one secure platform trusted by thousands.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="text-3xl font-bold text-white">75K+</p>
                <p className="text-gray-500 text-sm mt-1">Active Members</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">$2.4B</p>
                <p className="text-gray-500 text-sm mt-1">Assets Managed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">99.9%</p>
                <p className="text-gray-500 text-sm mt-1">Uptime</p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} CoreWealth Bank. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#7C3AED]/5 rounded-full blur-[150px] pointer-events-none lg:hidden" />
        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <CoreWealthLogo className="h-12 mx-auto mb-3" />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-gray-400 text-sm mt-1.5">Sign in to access your CoreWealth account</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => { const n={...p}; delete n.email; return n; }); }}
                placeholder="you@example.com"
                autoComplete="email"
                className={inputCls('email')}
              />
              {fieldErrors.email && <p className="text-red-400 text-xs mt-1.5 pl-1">{fieldErrors.email}</p>}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-gray-300 text-sm font-medium">Password</label>
                <Link href="/forgot-password" className="text-[#A78BFA] hover:text-[#7C3AED] text-xs font-medium transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldErrors(p => { const n={...p}; delete n.password; return n; }); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={inputCls('password') + ' pr-11'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && <p className="text-red-400 text-xs mt-1.5 pl-1">{fieldErrors.password}</p>}
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer pt-1">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="accent-[#7C3AED] w-4 h-4 rounded" />
              <span className="text-gray-400 text-sm">Keep me signed in</span>
            </label>

            <TurnstileWidget onToken={(t) => setCaptchaToken(t)} onError={() => setCaptchaToken(null)} onExpire={() => setCaptchaToken(null)} />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_30px_rgba(124,58,237,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Signing In...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-600 text-xs uppercase tracking-wider">New to CoreWealth?</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <Link
            href="/register"
            className="block w-full text-center bg-white/5 hover:bg-white/8 border border-white/10 hover:border-[#7C3AED]/30 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm"
          >
            Create Free Account
          </Link>

          {/* Security badges */}
          <div className="mt-8 flex items-center justify-center gap-5">
            {[
              { icon: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', label: '256-bit SSL' },
              { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', label: 'FDIC Insured' },
              { icon: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>', label: '24/7 Support' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-1.5 text-gray-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: badge.icon }} />
                <span className="text-[10px] font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
