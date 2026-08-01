'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error?.message || 'Login failed');
        return;
      }

      // Handle 2FA - admin users with 2FA must verify via the main site first
      if (data.data.requires2FA) {
        setError('Two-factor authentication is enabled on this account. Please sign in via the main site to complete 2FA verification.');
        return;
      }

      if (!data.data.user?.adminRecord) {
        setError('This account does not have admin access.');
        return;
      }

      localStorage.setItem('adminToken', data.data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.data.user));
      document.cookie = `adminToken=${data.data.token}; path=/; max-age=${7*24*60*60}; SameSite=Lax`;
      router.push('/admin');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#7C3AED]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#7C3AED]/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 mb-5">
            <svg viewBox="0 0 24 24" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 7v1a3 3 0 0 0 6 0V7"/><path d="M9 7v1a3 3 0 0 0 6 0V7"/><path d="M15 7v1a3 3 0 0 0 6 0V7"/><path d="M3 7h18l-1.5-4H4.5L3 7z"/></svg>
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Admin Panel</h1>
          <p className="text-gray-500 text-sm">CoreWealth Bank Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@corewealth.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#7C3AED]/50 focus:shadow-[0_0_20px_rgba(204,0,0,0.08)] transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#7C3AED]/50 focus:shadow-[0_0_20px_rgba(204,0,0,0.08)] transition-all duration-300"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C3AED] hover:bg-[#ff1a1a] disabled:bg-[#7C3AED]/50 text-white font-bold text-sm py-3.5 rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(204,0,0,0.3)] hover:shadow-[0_4px_25px_rgba(204,0,0,0.4)]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25"/>
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75"/>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In to Admin'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <a href="/" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
            ← Back to main site
          </a>
        </div>
      </div>
    </div>
  );
}
