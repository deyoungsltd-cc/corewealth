'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ChatWidget from '@/components/ChatWidget';
import { CreditCard, Plus, Snowflake, ChevronRight, ArrowRightLeft, ShoppingBag, Shield } from 'lucide-react';

interface CardData {
  id: string; type: string; status: string; lastFour?: string;
  expiryMonth?: string; expiryYear?: string; cardBrand?: string;
  color?: string; spendingLimit?: number; monthlySpend?: number;
  frozen: boolean;
}

export default function CardsPage() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch('/api/cards', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) setCards(d.data || []); }).catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const toggleFreeze = async (card: CardData) => {
    try {
      const res = await fetch('/api/cards', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cardId: card.id, action: card.frozen ? 'unfreeze' : 'freeze' }),
      });
      const d = await res.json();
      if (d.success) setCards(prev => prev.map(c => c.id === card.id ? { ...c, frozen: !c.frozen, status: !c.frozen ? 'frozen' : 'active' } : c));
    } catch {}
  };

  const statusColor = (s: string) => {
    const m: Record<string, string> = { active: 'text-green-400 bg-green-400/10', frozen: 'text-blue-400 bg-blue-400/10', pending: 'text-yellow-400 bg-yellow-400/10', cancelled: 'text-red-400 bg-red-400/10' };
    return m[s] || 'text-gray-400 bg-gray-400/10';
  };

  const CardVisual = ({ card, size = 'md' }: { card: CardData; size?: 'sm' | 'md' }) => {
    const w = size === 'sm' ? 'max-w-[280px]' : 'max-w-[340px]';
    const p = size === 'sm' ? 'p-4' : 'p-6';
    const frozen = card.frozen;
    return (
      <div className={`${w} ${p} rounded-2xl relative overflow-hidden ${frozen ? 'opacity-60 grayscale' : ''}`} style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 40%, #4C1D95 100%)' }}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/70 text-[10px] uppercase tracking-wider">CoreWealth Bank</p>
              <p className="text-white/50 text-[10px] mt-0.5">{card.type === 'virtual' ? 'Virtual' : 'Physical'} {card.cardBrand || 'Visa'}</p>
            </div>
            <svg width="32" height="20" viewBox="0 0 32 20" fill="none" className={size === 'sm' ? 'w-6 h-4' : ''}>
              <text x="0" y="14" fill="white" fontSize="14" fontWeight="bold" fontFamily="serif" fontStyle="italic">VISA</text>
            </svg>
          </div>
          <div>
            <p className="text-white text-lg font-mono tracking-[0.2em]">
              {card.lastFour ? `•••• •••• •••• ${card.lastFour}` : '•••• •••• •••• ••••'}
            </p>
            <div className="flex justify-between items-end mt-3">
              <div>
                <p className="text-white/50 text-[9px] uppercase">Card Holder</p>
                <p className="text-white text-xs font-medium">COREWEALTH MEMBER</p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-[9px] uppercase">Expires</p>
                <p className="text-white text-xs font-medium">{card.expiryMonth || '12'}/{card.expiryYear || '28'}</p>
              </div>
            </div>
          </div>
        </div>
        {frozen && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
            <Snowflake className="w-10 h-10 text-blue-300" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white font-bold text-lg">Your Cards</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage your virtual and physical cards</p>
        </div>
        <div className="flex gap-3">
          <Link href="/cards/apply?type=virtual" className="flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors">
            <Plus className="w-4 h-4" /> Virtual Card
          </Link>
          <Link href="/cards/apply?type=physical" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors">
            <ShoppingBag className="w-4 h-4" /> Physical Card
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2].map(i => <div key={i} className="h-[220px] bg-card border border-border rounded-2xl animate-pulse" />)}
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
            <CreditCard className="w-7 h-7 text-[#7C3AED]" />
          </div>
          <h3 className="text-white font-semibold text-base mb-2">No Cards Yet</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">Apply for an instant virtual card or order a physical card delivered to your door.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/cards/apply?type=virtual" className="flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors">
              <Plus className="w-4 h-4" /> Get Virtual Card
            </Link>
            <Link href="/cards/apply?type=physical" className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors">
              <ShoppingBag className="w-4 h-4" /> Order Physical Card
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((card) => (
            <div key={card.id} className="bg-card border border-border rounded-2xl p-5 space-y-4 hover:border-[#7C3AED]/20 transition-colors">
              <CardVisual card={card} size="sm" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${statusColor(card.status)}`}>{card.status}</span>
                  <span className="text-[10px] font-medium text-gray-500 uppercase">{card.type}</span>
                </div>
                <button
                  onClick={() => toggleFreeze(card)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${card.frozen ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  <Snowflake className="w-3.5 h-3.5" /> {card.frozen ? 'Unfreeze' : 'Freeze'}
                </button>
              </div>
              <div className="flex gap-2">
                <Link href={`/cards/manage?id=${card.id}`} className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium py-2.5 rounded-lg transition-colors">
                  <Shield className="w-3.5 h-3.5" /> Manage
                </Link>
                {card.type === 'physical' && (
                  <Link href="/cards/tracking" className="flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium py-2.5 px-4 rounded-lg transition-colors">
                    <ChevronRight className="w-3.5 h-3.5" /> Track
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Card Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <Shield className="w-5 h-5" />, title: 'Instant Freeze', desc: 'Lock your card instantly if misplaced. Unlock anytime.' },
          { icon: <ArrowRightLeft className="w-5 h-5" />, title: 'Spending Limits', desc: 'Set daily, weekly, or monthly spending caps.' },
          { icon: <CreditCard className="w-5 h-5" />, title: 'Virtual Cards', desc: 'Get a virtual card instantly for online purchases.' },
        ].map(f => (
          <div key={f.title} className="bg-card border border-border rounded-xl p-4 flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center text-[#A78BFA] shrink-0">{f.icon}</div>
            <div>
              <p className="text-white font-semibold text-sm">{f.title}</p>
              <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <ChatWidget />
    </div>
  );
}
