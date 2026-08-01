'use client';

import { useState, useEffect } from 'react';
import ChatWidget from '@/components/ChatWidget';

const TABS = ['Card Deposit', 'Crypto Deposit', 'Cheque Deposit', 'Bank Transfer'] as const;
type Tab = typeof TABS[number];
const CRYPTO_NETWORKS = [{ name: 'Bitcoin (BTC)', symbol: 'BTC', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' }, { name: 'Ethereum (ETH)', symbol: 'ETH', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' }, { name: 'USDT (TRC-20)', symbol: 'USDT', address: 'TN2Y4mFH8bYaE9tkxzLpXHNKYcN3MwTGqF' }];

interface DepositHistory { id: string; method: string; amount: number; status: string; createdAt: string; }

export default function DepositPage() {
  const [tab, setTab] = useState<Tab>('Bank Transfer');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<DepositHistory[]>([]);
  const [copied, setCopied] = useState(false);

  // Bank transfer
  const [btAmount, setBtAmount] = useState('');
  const [btRef, setBtRef] = useState('');
  // Card deposit
  const [cdNumber, setCdNumber] = useState('');
  const [cdExpiry, setCdExpiry] = useState('');
  const [cdCvv, setCdCvv] = useState('');
  const [cdName, setCdName] = useState('');
  const [cdAmount, setCdAmount] = useState('');
  // Crypto
  const [crNetwork, setCrNetwork] = useState(0);
  const [crAmount, setCrAmount] = useState('');
  // Cheque
  const [cqNumber, setCqNumber] = useState('');
  const [cqBank, setCqBank] = useState('');
  const [cqAmount, setCqAmount] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetch('/api/deposits/history', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(d => { if (d.success) setHistory(d.data?.deposits || d.data || []); }).catch(() => {});
  }, [success]);

  const submit = async (method: string, body: Record<string, any>) => {
    setError(''); setSuccess('');
    if (!body.amount || parseFloat(body.amount) <= 0) { setError('Enter a valid amount'); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/deposits', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...body, method }) });
      const data = await res.json();
      if (data.success) { setSuccess('Deposit submitted successfully!'); return true; }
      else { setError(data.error?.message || 'Failed'); return false; }
    } catch { setError('Network error'); return false; } finally { setLoading(false); }
  };

  const copyAddress = () => { navigator.clipboard.writeText(CRYPTO_NETWORKS[crNetwork].address); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const inputCls = 'w-full bg-[#1a1a1a] border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#7C3AED] transition-colors';
  const statusBadge = (s: string) => {
    const m: Record<string, string> = { confirmed: 'bg-green-900/30 text-green-400', completed: 'bg-green-900/30 text-green-400', pending: 'bg-yellow-900/30 text-yellow-400', pending_verification: 'bg-yellow-900/30 text-yellow-400', rejected: 'bg-red-900/30 text-red-400' };
    return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m[s] || 'bg-gray-700/50 text-gray-400'}`}>{s}</span>;
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl overflow-x-auto">
        {TABS.map(t => (
          <button key={t} onClick={() => { setTab(t); setError(''); setSuccess(''); }} className={`flex-1 min-w-fit px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${tab === t ? 'bg-[#7C3AED] text-white shadow-[0_2px_12px_rgba(124,58,237,0.4)]' : 'text-gray-400 hover:text-white'}`}>{t}</button>
        ))}
      </div>

      {error && <div className="bg-red-900/30 border border-red-800/50 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>}
      {success && <div className="bg-green-900/30 border border-green-800/50 text-green-400 text-sm rounded-lg px-4 py-3">{success}</div>}

      {/* CARD DEPOSIT */}
      {tab === 'Card Deposit' && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <div><h3 className="text-white font-semibold text-sm">Deposit with Card</h3><p className="text-gray-500 text-xs">Fund your account using debit or credit card</p></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="block text-gray-300 text-sm font-medium mb-1.5">Card Number</label><input type="text" value={cdNumber} onChange={e => setCdNumber(e.target.value)} placeholder="1234 5678 9012 3456" maxLength={19} className={inputCls} /></div>
            <div><label className="block text-gray-300 text-sm font-medium mb-1.5">Expiry Date</label><input type="text" value={cdExpiry} onChange={e => setCdExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} className={inputCls} /></div>
            <div><label className="block text-gray-300 text-sm font-medium mb-1.5">CVV</label><input type="password" value={cdCvv} onChange={e => setCdCvv(e.target.value)} placeholder="***" maxLength={4} className={inputCls} /></div>
            <div className="col-span-2"><label className="block text-gray-300 text-sm font-medium mb-1.5">Cardholder Name</label><input type="text" value={cdName} onChange={e => setCdName(e.target.value)} placeholder="Name on card" className={inputCls} /></div>
            <div className="col-span-2"><label className="block text-gray-300 text-sm font-medium mb-1.5">Amount (USD)</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span><input type="number" value={cdAmount} onChange={e => setCdAmount(e.target.value)} placeholder="0.00" className={inputCls + ' pl-8'} /></div></div>
          </div>
          <div className="bg-[#111] border border-border rounded-lg p-3"><div className="flex justify-between text-sm"><span className="text-gray-500">Processing fee (2.5%)</span><span className="text-white">${cdAmount ? (parseFloat(cdAmount) * 0.025).toFixed(2) : '0.00'}</span></div></div>
          <button onClick={() => submit('card', { amount: parseFloat(cdAmount), cardNumber: cdNumber, expiry: cdExpiry, cvv: cdCvv, cardHolder: cdName })} disabled={loading} className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-sm">{loading ? 'Processing...' : 'Deposit Funds'}</button>
        </div>
      )}

      {/* CRYPTO DEPOSIT */}
      {tab === 'Crypto Deposit' && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
            </div>
            <div><h3 className="text-white font-semibold text-sm">Crypto Deposit</h3><p className="text-gray-500 text-xs">Transfer crypto to your wallet</p></div>
          </div>
          <div className="flex gap-2">
            {CRYPTO_NETWORKS.map((n, i) => (
              <button key={n.symbol} onClick={() => setCrNetwork(i)} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${crNetwork === i ? 'bg-[#7C3AED] text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>{n.symbol}</button>
            ))}
          </div>
          <div className="bg-[#111] border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between"><span className="text-gray-400 text-xs font-medium">Network</span><span className="text-white text-sm font-medium">{CRYPTO_NETWORKS[crNetwork].name}</span></div>
            <div><p className="text-gray-400 text-xs mb-1.5">Wallet Address</p><div className="flex items-center gap-2 bg-[#0a0a0a] rounded-lg p-3"><code className="text-[#A78BFA] text-xs break-all flex-1 font-mono">{CRYPTO_NETWORKS[crNetwork].address}</code><button onClick={copyAddress} className="shrink-0 text-gray-400 hover:text-[#7C3AED] transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>{copied && <p className="text-green-400 text-xs mt-1">Copied!</p>}</div>
            <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-lg p-2.5"><p className="text-yellow-400 text-xs">Only send {CRYPTO_NETWORKS[crNetwork].symbol} to this address. Sending other assets may result in permanent loss.</p></div>
          </div>
          <div><label className="block text-gray-300 text-sm font-medium mb-1.5">Amount (USD)</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span><input type="number" value={crAmount} onChange={e => setCrAmount(e.target.value)} placeholder="0.00" className={inputCls + ' pl-8'} /></div></div>
          <button onClick={() => submit('crypto', { amount: parseFloat(crAmount), network: CRYPTO_NETWORKS[crNetwork].symbol, walletAddress: CRYPTO_NETWORKS[crNetwork].address })} disabled={loading} className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-sm">{loading ? 'Processing...' : 'Submit Crypto Deposit'}</button>
        </div>
      )}

      {/* CHEQUE DEPOSIT */}
      {tab === 'Cheque Deposit' && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <div><h3 className="text-white font-semibold text-sm">Cheque Deposit</h3><p className="text-gray-500 text-xs">Deposit a cheque into your account</p></div>
          </div>
          <div><label className="block text-gray-300 text-sm font-medium mb-1.5">Cheque Number</label><input type="text" value={cqNumber} onChange={e => setCqNumber(e.target.value)} placeholder="Enter cheque number" className={inputCls} /></div>
          <div><label className="block text-gray-300 text-sm font-medium mb-1.5">Bank Name</label><input type="text" value={cqBank} onChange={e => setCqBank(e.target.value)} placeholder="Issuing bank name" className={inputCls} /></div>
          <div><label className="block text-gray-300 text-sm font-medium mb-1.5">Amount (USD)</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span><input type="number" value={cqAmount} onChange={e => setCqAmount(e.target.value)} placeholder="0.00" className={inputCls + ' pl-8'} /></div></div>
          <div><label className="block text-gray-300 text-sm font-medium mb-1.5">Upload Cheque Image</label><div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-[#7C3AED]/50 transition-colors cursor-pointer"><svg className="mx-auto mb-2 text-gray-600" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg><p className="text-gray-500 text-sm">Click or drag to upload</p><p className="text-gray-600 text-xs mt-1">JPG, PNG or PDF up to 10MB</p></div></div>
          <button onClick={() => submit('cheque', { amount: parseFloat(cqAmount), chequeNumber: cqNumber, bankName: cqBank })} disabled={loading} className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-sm">{loading ? 'Processing...' : 'Submit Cheque'}</button>
        </div>
      )}

      {/* BANK TRANSFER */}
      {tab === 'Bank Transfer' && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 7v1a3 3 0 0 0 6 0V7"/><path d="M9 7v1a3 3 0 0 0 6 0V7"/><path d="M15 7v1a3 3 0 0 0 6 0V7"/><path d="M3 7h18l-1.5-4H4.5L3 7z"/></svg>
            </div>
            <div><h3 className="text-white font-semibold text-sm">Bank Transfer</h3><p className="text-gray-500 text-xs">Transfer from your bank account</p></div>
          </div>
          <div className="bg-[#111] border border-border rounded-xl p-4 space-y-2.5">
            <p className="text-gray-300 text-xs font-medium">Transfer to the following bank details:</p>
            <div className="space-y-2"><div className="flex justify-between text-sm"><span className="text-gray-500">Bank Name</span><span className="text-white font-medium">CoreWealth Bank</span></div><div className="flex justify-between text-sm"><span className="text-gray-500">Account Name</span><span className="text-white font-medium">CoreWealth Holdings LLC</span></div><div className="flex justify-between text-sm"><span className="text-gray-500">Account Number</span><span className="text-white font-mono font-medium">****-****-****-7890</span></div><div className="flex justify-between text-sm"><span className="text-gray-500">Routing Number</span><span className="text-white font-mono font-medium">****-****-1234</span></div><div className="flex justify-between text-sm"><span className="text-gray-500">SWIFT/BIC</span><span className="text-white font-mono font-medium">CWEAUS33</span></div></div>
          </div>
          <div><label className="block text-gray-300 text-sm font-medium mb-1.5">Amount (USD)</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span><input type="number" value={btAmount} onChange={e => setBtAmount(e.target.value)} placeholder="0.00" className={inputCls + ' pl-8'} /></div></div>
          <div><label className="block text-gray-300 text-sm font-medium mb-1.5">Reference / Transaction ID</label><input type="text" value={btRef} onChange={e => setBtRef(e.target.value)} placeholder="Enter your bank transfer reference" className={inputCls} /></div>
          <button onClick={() => submit('bank_transfer', { amount: parseFloat(btAmount), reference: btRef })} disabled={loading} className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-sm">{loading ? 'Processing...' : 'Submit Bank Transfer'}</button>
        </div>
      )}

      {/* History */}
      <div>
        <h3 className="text-white font-semibold text-sm mb-3">Deposit History</h3>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {history.length === 0 ? (<div className="text-center text-gray-500 py-10 text-sm">No deposits yet</div>) : (
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border"><th className="text-left text-gray-500 font-medium px-4 py-3">Date</th><th className="text-left text-gray-500 font-medium px-4 py-3">Method</th><th className="text-right text-gray-500 font-medium px-4 py-3">Amount</th><th className="text-right text-gray-500 font-medium px-4 py-3">Status</th></tr></thead><tbody>{history.map((d) => (<tr key={d.id} className="border-b border-border/50 last:border-0"><td className="text-gray-300 px-4 py-3 text-xs whitespace-nowrap">{new Date(d.createdAt).toLocaleDateString()}</td><td className="text-white px-4 py-3 capitalize text-xs">{d.method?.replace('_', ' ')}</td><td className="text-green-400 px-4 py-3 text-right font-medium">${d.amount?.toLocaleString()}</td><td className="px-4 py-3 text-right">{statusBadge(d.status)}</td></tr>))}</tbody></table></div>
          )}
        </div>
      </div>

      <ChatWidget />
    </div>
  );
}