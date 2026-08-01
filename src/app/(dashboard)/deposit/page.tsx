'use client';

import { useState, useEffect } from 'react';
import ChatWidget from '@/components/ChatWidget';

export default function DepositPage() {
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/deposits/history', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => { if (d.success) setHistory(d.data?.deposits || d.data || []); })
        .catch(() => {});
    }
  }, [success]);

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!amount || parseFloat(amount) <= 0) { setError('Enter a valid deposit amount'); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/deposits', {
        method: 'POST', headers,
        body: JSON.stringify({ amount: parseFloat(amount), method: 'bank_transfer', reference: reference || undefined }),
      });
      const data = await res.json();
      if (data.success) { setSuccess('Bank transfer deposit submitted! Awaiting confirmation.'); setAmount(''); setReference(''); }
      else setError(data.error?.message || 'Failed to submit deposit');
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  const statusBadge = (s: string) => {
    const m: Record<string, string> = { confirmed: 'bg-green-900/30 text-green-400', completed: 'bg-green-900/30 text-green-400', pending: 'bg-yellow-900/30 text-yellow-400', pending_verification: 'bg-yellow-900/30 text-yellow-400', rejected: 'bg-red-900/30 text-red-400' };
    return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m[s] || 'bg-gray-700/50 text-gray-400'}`}>{s}</span>;
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-white font-bold text-lg">Deposit Funds</h2>
        <p className="text-gray-500 text-sm mt-0.5">Add funds via bank transfer</p>
      </div>

      {error && <div className="bg-red-900/30 border border-red-800/50 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>}
      {success && <div className="bg-green-900/30 border border-green-800/50 text-green-400 text-sm rounded-lg px-4 py-3">{success}</div>}

      {/* Bank Transfer Form */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 7v1a3 3 0 0 0 6 0V7"/><path d="M9 7v1a3 3 0 0 0 6 0V7"/><path d="M15 7v1a3 3 0 0 0 6 0V7"/><path d="M3 7h18l-1.5-4H4.5L3 7z"/></svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Bank Transfer</h3>
            <p className="text-gray-500 text-xs">Transfer funds directly from your bank account</p>
          </div>
        </div>

        {/* Bank Details Info */}
        <div className="bg-[#111] border border-border rounded-xl p-4 space-y-2.5">
          <p className="text-gray-300 text-xs font-medium">Transfer to the following bank details:</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Bank Name</span>
              <span className="text-white font-medium">CoreWealth Bank</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Account Name</span>
              <span className="text-white font-medium">CoreWealth Holdings LLC</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Account Number</span>
              <span className="text-white font-mono font-medium">****-****-****-7890</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Routing Number</span>
              <span className="text-white font-mono font-medium">****-****-1234</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">SWIFT/BIC</span>
              <span className="text-white font-mono font-medium">CWEAUS33</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-1.5">Amount (USD)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="w-full bg-[#1a1a1a] border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#7C3AED] transition-colors" />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-1.5">Reference / Transaction ID</label>
          <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Enter your bank transfer reference number" className="w-full bg-[#1a1a1a] border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#7C3AED] transition-colors" />
        </div>
        <button onClick={handleSubmit} disabled={loading || !amount} className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-sm">
          {loading ? 'Submitting...' : 'Submit Bank Transfer Deposit'}
        </button>
      </div>

      {/* History */}
      <div>
        <h3 className="text-white font-semibold text-sm mb-3">Deposit History</h3>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {history.length === 0 ? (
            <div className="text-center text-gray-500 py-10 text-sm">No deposits yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border">
                  <th className="text-left text-gray-500 font-medium px-4 py-3">Date</th>
                  <th className="text-left text-gray-500 font-medium px-4 py-3">Method</th>
                  <th className="text-right text-gray-500 font-medium px-4 py-3">Amount</th>
                  <th className="text-right text-gray-500 font-medium px-4 py-3">Status</th>
                </tr></thead>
                <tbody>
                  {history.map((d: any) => (
                    <tr key={d.id} className="border-b border-border/50 last:border-0">
                      <td className="text-gray-300 px-4 py-3 text-xs whitespace-nowrap">{new Date(d.createdAt).toLocaleDateString()}</td>
                      <td className="text-white px-4 py-3 capitalize text-xs">{d.method === 'bank_transfer' ? 'Bank Transfer' : d.method}</td>
                      <td className="text-green-400 px-4 py-3 text-right font-medium">${d.amount?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">{statusBadge(d.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ChatWidget />
    </div>
  );
}
