'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';

const coins = [
  {
    id: 'BTC',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 80852,
    change: +2.34,
    color: '#F7931A',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="#F7931A" fill-opacity="0.12" />
        <path d="M26.5 18.4c.2-1.3-.8-2-2.1-2.5l.5-1.8-1.1-.3-.5 1.8c-.3-.1-.6-.1-.9-.2l.5-1.8-1.1-.3-.5 1.8c-.2-.1-.5-.1-.7-.2l-1.4-.4-.3 1.1s.8.2.7.2c.4.1.5.4.5.7l-.5 2.1c0 0 .1 0 .1.1h-.1l-.8 3c-.1.1-.2.3-.5.2 0 0-.7-.2-.7-.2l-.5 1.2 1.4.3c.3.1.5.1.8.2l-.5 1.9 1.1.3.5-1.8c.3.1.6.2.9.2l-.5 1.8 1.1.3.5-1.9c2 .4 3.5.2 4.1-1.6.5-1.4 0-2.2-1-2.7.7-.2 1.3-.6 1.4-1.5zm-2.7 3.7c-.4 1.4-2.8.7-3.6.5l.6-2.5c.8.2 3.3.6 3 2zm.4-3.7c-.3 1.3-2.3.6-3 .5l.6-2.3c.7.2 2.8.5 2.4 1.8z" fill="#F7931A" />
      </svg>
    ),
  },
  {
    id: 'ETH',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3845,
    change: -0.87,
    color: '#627EEA',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="#627EEA" fill-opacity="0.12" />
        <path d="M20 6L20 16.5L28.5 20L20 6Z" fill="#627EEA" fill-opacity="0.6" />
        <path d="M20 6L11.5 20L20 16.5L20 6Z" fill="#627EEA" />
        <path d="M20 27.5L20 34L28.5 21.5L20 27.5Z" fill="#627EEA" fill-opacity="0.6" />
        <path d="M20 34L11.5 21.5L20 27.5L20 34Z" fill="#627EEA" />
        <path d="M20 25.5L28.5 20L20 16.5L20 25.5Z" fill="#627EEA" fill-opacity="0.8" />
        <path d="M11.5 20L20 16.5L20 25.5L11.5 20Z" fill="#627EEA" fill-opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 'USDT',
    name: 'Tether',
    symbol: 'USDT',
    price: 1.0,
    change: +0.01,
    color: '#22C55E',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="#22C55E" fill-opacity="0.12" />
        <circle cx="20" cy="19" r="11" fill="#22C55E" fill-opacity="0.2" stroke="#22C55E" stroke-width="1.5" />
        <text x="20" y="23.5" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#22C55E" fontFamily="Arial, sans-serif">₮</text>
      </svg>
    ),
  },
  {
    id: 'LTC',
    name: 'Litecoin',
    symbol: 'LTC',
    price: 92.4,
    change: +1.52,
    color: '#9CA3AF',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="#9CA3AF" fill-opacity="0.12" />
        <circle cx="20" cy="20" r="11" fill="#9CA3AF" fill-opacity="0.2" stroke="#9CA3AF" stroke-width="1.5" />
        <text x="20" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#9CA3AF" fontFamily="Arial, sans-serif">Ł</text>
      </svg>
    ),
  },
];

const paymentMethods = [
  {
    id: 'debit',
    label: 'Debit Card',
    description: 'Instant processing, 2.5% fee',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
        <line x1="6" y1="15" x2="10" y2="15" />
        <line x1="6" y1="18" x2="8" y2="18" />
      </svg>
    ),
  },
  {
    id: 'credit',
    label: 'Credit Card',
    description: 'Instant processing, 3.5% fee',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
        <line x1="6" y1="15" x2="10" y2="15" />
        <line x1="6" y1="18" x2="8" y2="18" />
      </svg>
    ),
  },
];

export default function BuyCryptoPage() {
  const user = useAuthStore((state) => state.user);
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [selectedPayment, setSelectedPayment] = useState('debit');
  const [amount, setAmount] = useState('');

  const activeCoin = coins.find((c) => c.id === selectedCoin)!;
  const activeFee = selectedPayment === 'debit' ? 0.025 : 0.035;

  const estimatedCrypto = useMemo(() => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return null;
    const afterFee = num * (1 - activeFee);
    const received = afterFee / activeCoin.price;
    return received;
  }, [amount, activeCoin.price, activeFee]);

  return (
    <main className="min-h-screen bg-[#0F0F1A] px-4 py-6 pb-24">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#16162A] border border-white/[0.04]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.5 15L7.5 10L12.5 5" />
            </svg>
          </Link>
          <h1 className="text-[#F1F5F9] text-xl font-bold">Buy Crypto</h1>
        </div>

        {/* Subtitle */}
        <p className="text-[#9CA3AF] text-sm mb-6">
          Purchase cryptocurrency using your debit or credit card
        </p>

        {/* Supported Coins */}
        <section className="mb-6">
          <h2 className="text-[#F1F5F9] text-sm font-bold mb-3">Select Cryptocurrency</h2>
          <div className="grid grid-cols-2 gap-3">
            {coins.map((coin) => {
              const isSelected = selectedCoin === coin.id;
              return (
                <button
                  key={coin.id}
                  onClick={() => setSelectedCoin(coin.id)}
                  className={`bg-[#16162A] rounded-2xl p-4 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-2 border-[#8B5CF6]'
                      : 'border border-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    {coin.icon}
                    <div>
                      <p className="text-[#F1F5F9] text-sm font-bold leading-tight">{coin.name}</p>
                      <p className="text-[#6B7280] text-xs">{coin.symbol}</p>
                    </div>
                  </div>
                  <p className="text-[#F1F5F9] text-sm font-bold">
                    ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p
                    className={`text-xs font-semibold mt-1 ${
                      coin.change >= 0 ? 'text-[#22C55E]' : 'text-red-400'
                    }`}
                  >
                    {coin.change >= 0 ? '+' : ''}
                    {coin.change.toFixed(2)}%
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Payment Method */}
        <section className="mb-6">
          <h2 className="text-[#F1F5F9] text-sm font-bold mb-3">Payment Method</h2>
          <div className="flex flex-col gap-3">
            {paymentMethods.map((method) => {
              const isSelected = selectedPayment === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`flex items-center gap-3 bg-[#16162A] rounded-2xl p-4 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-2 border-[#8B5CF6]'
                      : 'border border-white/[0.04]'
                  }`}
                >
                  {method.icon}
                  <div className="flex-1">
                    <p className="text-[#F1F5F9] text-sm font-bold">{method.label}</p>
                    <p className="text-[#6B7280] text-xs mt-0.5">{method.description}</p>
                  </div>
                  {/* Radio indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'border-[#8B5CF6]'
                        : 'border-[#4B5563]'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Amount Input */}
        <section className="mb-6">
          <h2 className="text-[#F1F5F9] text-sm font-bold mb-3">Amount (USD)</h2>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] text-lg font-bold">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#0F0F1A] border border-white/[0.06] rounded-xl pl-9 pr-4 py-3.5 text-[#F1F5F9] text-lg font-semibold placeholder:text-[#4B5563] focus:outline-none focus:border-[#8B5CF6] transition-colors duration-200"
            />
          </div>
          {estimatedCrypto !== null && (
            <p className="text-[#9CA3AF] text-xs mt-2">
              ≈{' '}
              <span className="text-[#F1F5F9] font-semibold">
                {estimatedCrypto < 0.0001
                  ? estimatedCrypto.toExponential(4)
                  : estimatedCrypto < 1
                  ? estimatedCrypto.toFixed(6)
                  : estimatedCrypto.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
              </span>{' '}
              {activeCoin.symbol}
              <span className="text-[#4B5563] ml-1">
                (incl. {activeFee * 100}% fee)
              </span>
            </p>
          )}
        </section>

        {/* Buy Button */}
        <button
          className="w-full bg-[#F59E0B] hover:bg-[#D97706] active:bg-[#B45309] text-white font-bold py-3.5 rounded-xl text-sm transition-colors duration-200"
        >
          Buy Now
        </button>

        {/* Security Note */}
        <div className="mt-5 flex items-start gap-2.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 flex-shrink-0">
            <path d="M8 1L2 4v4c0 3.5 2.6 6.8 6 7.5 3.4-.7 6-4 6-7.5V4L8 1z" fill="#22C55E" fill-opacity="0.15" stroke="#22C55E" strokeWidth="1" strokeLinejoin="round" />
            <path d="M6 8l1.5 1.5L10.5 6" stroke="#22C55E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-[#4B5563] text-xs leading-relaxed">
            Your payment is secured with 256-bit SSL encryption. Crypto will be
            credited to your portfolio within minutes.
          </p>
        </div>
      </div>
    </main>
  );
}
