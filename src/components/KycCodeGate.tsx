'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * KycCodeGate
 *
 * Shows a full-screen blocking modal when the user has a KYC verification
 * code pending (admin set a code that the user must enter before proceeding).
 *
 * The modal cannot be dismissed — the user must enter the correct code.
 * It persists across page navigations and refreshes because the code
 * is stored server-side on the user record (fetched via /api/auth/me).
 *
 * Once the correct code is entered, the code is cleared from the DB and
 * the modal disappears.
 */

export default function KycCodeGate() {
  const { user, fetchUser } = useAuthStore();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if user has a pending KYC code
  const hasCode = !!user?.kycVerificationCode;

  // On mount, fetch fresh user data to check for code
  useEffect(() => {
    const check = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) { setChecking(false); return; }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            // Update the auth store with fresh data
            useAuthStore.getState().setUser(data.data);
          }
        }
      } catch {
        // Keep existing data
      }
      setChecking(false);
    };
    check();
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || loading) return;

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/kyc/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        // Refresh user data (code will now be null)
        await fetchUser();
        // Auto-dismiss after 2 seconds
        setTimeout(() => {
          setSuccess(false);
          setCode('');
        }, 2000);
      } else {
        setError(data.error?.message || 'Invalid code. Please try again.');
        setCode('');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  }, [code, loading, fetchUser]);

  // Don't render if no code is required, still checking, or success dismiss
  if (checking || !hasCode) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md">
        {/* Success state */}
        {success ? (
          <div className="bg-[#1a1a1a] border border-green-600/40 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-600/15 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold mb-2">Verification Complete</h2>
            <p className="text-gray-400 text-sm">Your code was accepted. Your KYC documents are now being reviewed.</p>
          </div>
        ) : (
          /* Code entry form */
          <div className="bg-[#1a1a1a] border border-[#2563EB]/30 rounded-2xl p-8 shadow-2xl shadow-[#2563EB]/5">
            {/* CoreWealth logo area */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="#2563EB"/>
                  <path d="M9 12l2 2 4-4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-white text-xl font-bold mb-1">KYC Verification Required</h2>
              <p className="text-gray-500 text-xs leading-relaxed">
                A verification code has been issued to your account. Enter the code below to complete your KYC submission.
              </p>
            </div>

            {/* Lock icon message */}
            <div className="bg-[#111] border border-border rounded-xl p-4 mb-5">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <p className="text-white text-xs font-semibold">Code Required</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    You received this code via email from the admin team. Check your inbox and enter it below. You cannot proceed until the correct code is entered.
                  </p>
                </div>
              </div>
            </div>

            {/* Code input form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Verification Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setError(''); }}
                  placeholder="e.g. KYC-ABC123"
                  autoFocus
                  autoComplete="off"
                  className="w-full bg-[#111] border border-border rounded-xl px-5 py-4 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#2563EB] font-mono tracking-[0.2em] text-center transition-colors"
                />
              </div>

              {error && (
                <div className="bg-red-950/40 border border-red-600/30 rounded-lg px-4 py-3">
                  <p className="text-red-400 text-xs font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!code.trim() || loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors text-sm"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Verify & Continue
                  </>
                )}
              </button>
            </form>

            {/* Help text */}
            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-gray-600 text-[10px] text-center leading-relaxed">
                If you haven&apos;t received a code, please contact support or check your email.
                This verification step is required to proceed with your KYC application.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
