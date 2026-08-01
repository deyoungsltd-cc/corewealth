'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CoreWealthLogo from '@/components/CoreWealthLogo';
import TurnstileWidget from '@/components/TurnstileWidget';
import { useAuthStore } from '@/store/useAuthStore';

function getPasswordStrength(pw: string): { level: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { level: 0, label: 'Too Short', color: 'bg-gray-600' },
    { level: 1, label: 'Weak', color: 'bg-red-500' },
    { level: 2, label: 'Fair', color: 'bg-orange-500' },
    { level: 3, label: 'Good', color: 'bg-yellow-500' },
    { level: 4, label: 'Strong', color: 'bg-green-500' },
  ];
  return levels[Math.min(score, 4)] || levels[0];
}

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', referralCode: '', terms: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const strength = getPasswordStrength(form.password);

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    else if (form.firstName.trim().length < 2) e.firstName = 'At least 2 characters';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    else if (form.lastName.trim().length < 2) e.lastName = 'At least 2 characters';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    else if (!/[A-Z]/.test(form.password)) e.password = 'Need at least one uppercase letter';
    else if (!/[a-z]/.test(form.password)) e.password = 'Need at least one lowercase letter';
    else if (!/[0-9]/.test(form.password)) e.password = 'Need at least one number';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (form.referralCode && form.referralCode.trim().length < 3) e.referralCode = 'Invalid referral code';
    if (!form.terms) e.terms = 'You must accept the terms';
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(), lastName: form.lastName.trim(),
          email: form.email.trim(), password: form.password,
          referralCode: form.referralCode.trim() || undefined,
          captchaToken: captchaToken || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.data?.token) {
        localStorage.setItem('token', data.data.token);
        setAuth(data.data.user, data.data.token);
        router.push('/dashboard');
      } else {
        if (data.error?.code === 'EMAIL_EXISTS') setError('This email is already registered. Please sign in.');
        else if (data.error?.code === 'INVALID_REFERRAL_CODE') setError('Invalid referral code.');
        else setError(data.error?.message || 'Registration failed. Please try again.');
      }
    } catch { setError('Network error. Please check your connection.'); }
    finally { setLoading(false); }
  };

  const inputCls = (field?: string) =>
    `w-full bg-white/5 border ${field && fieldErrors[field] ? 'border-red-500/80' : 'border-white/10'} rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#7C3AED]/60 focus:ring-1 focus:ring-[#7C3AED]/20 transition-all duration-200`;

  return (
    <div className="min-h-screen bg-[#060A13] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/20 via-[#060A13] to-[#6D28D9]/10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#7C3AED]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#A78BFA]/5 rounded-full blur-[100px]" />
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <CoreWealthLogo variant="wordmark" className="h-9" />
          <div className="max-w-lg">
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              Banking that{' '}
              <span className="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] bg-clip-text text-transparent">works for you.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              Open your account in under 2 minutes. No paperwork, no branch visits. Just smart, secure banking from anywhere.
            </p>
            <div className="space-y-4">
              {[
                { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', title: 'Bank-grade security', desc: '256-bit encryption protects every transaction' },
                { icon: '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>', title: 'Virtual & physical cards', desc: 'Instant virtual card, physical card delivered to your door' },
                { icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', title: '24/7 access', desc: 'Manage your money anytime, anywhere' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: item.icon }} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{item.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} CoreWealth Bank. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#7C3AED]/5 rounded-full blur-[150px] pointer-events-none lg:hidden" />
        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden text-center mb-8">
            <CoreWealthLogo className="h-12 mx-auto mb-3" />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-gray-400 text-sm mt-1.5">Join thousands banking smarter with CoreWealth</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">First Name</label>
                <input type="text" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="John" autoComplete="given-name" className={inputCls('firstName')} />
                {fieldErrors.firstName && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.firstName}</p>}
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Last Name</label>
                <input type="text" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Doe" autoComplete="family-name" className={inputCls('lastName')} />
                {fieldErrors.lastName && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.lastName}</p>}
              </div>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" autoComplete="email" className={inputCls('email')} />
              {fieldErrors.email && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.email}</p>}
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min 8 chars, Aa1@" autoComplete="new-password" className={inputCls('password') + ' pr-11'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors" tabIndex={-1}>
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.password}</p>}
              {form.password && (
                <div className="mt-2.5">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : 'bg-white/5'}`} />
                    ))}
                  </div>
                  <p className="text-xs mt-1 text-gray-500">{strength.label}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Confirm Password</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder="Repeat your password" autoComplete="new-password" className={inputCls('confirmPassword') + ' pr-11'} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors" tabIndex={-1}>
                  {showConfirm ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.confirmPassword}</p>}
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Referral Code <span className="text-gray-600 font-normal">(optional)</span></label>
              <input type="text" value={form.referralCode} onChange={(e) => update('referralCode', e.target.value)} placeholder="Enter code" className={inputCls('referralCode')} />
              {fieldErrors.referralCode && <p className="text-red-400 text-xs mt-1 pl-1">{fieldErrors.referralCode}</p>}
            </div>
            <div className="flex items-start gap-2.5 pt-1">
              <input type="checkbox" checked={form.terms} onChange={(e) => update('terms', e.target.checked)} className="mt-0.5 accent-[#7C3AED] w-4 h-4 rounded" />
              <span className="text-gray-400 text-xs leading-relaxed">
                I agree to the <Link href="/terms" className="text-[#A78BFA] hover:text-[#7C3AED] transition-colors">Terms of Service</Link> and <Link href="/privacy" className="text-[#A78BFA] hover:text-[#7C3AED] transition-colors">Privacy Policy</Link>
              </span>
            </div>
            {fieldErrors.terms && <p className="text-red-400 text-xs pl-1">{fieldErrors.terms}</p>}

            <TurnstileWidget onToken={(t) => setCaptchaToken(t)} onError={() => setCaptchaToken(null)} onExpire={() => setCaptchaToken(null)} />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_30px_rgba(124,58,237,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-600 text-xs uppercase tracking-wider">Already a member?</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <Link
            href="/login"
            className="block w-full text-center bg-white/5 hover:bg-white/8 border border-white/10 hover:border-[#7C3AED]/30 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
