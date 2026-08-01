'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'

const dateRanges = ['This Month', 'Last 3 Months', 'This Year'] as const

type DateRange = (typeof dateRanges)[number]

const summaryCards = [
  { label: 'Opening Balance', value: '$44,890.00' },
  { label: 'Total Credits', value: '$2,450.00' },
  { label: 'Closing Balance', value: '$45,230.50' },
]

const transactions = [
  { description: 'Interest Credit', amount: '+$42.50', date: 'Jul 31', type: 'credit' as const },
  { description: 'Deposit', amount: '+$1,000.00', date: 'Jul 28', type: 'credit' as const },
  { description: 'Interest Credit', amount: '+$38.20', date: 'Jun 30', type: 'credit' as const },
  { description: 'Withdrawal', amount: '-$250.00', date: 'Jun 15', type: 'debit' as const },
  { description: 'Interest Credit', amount: '+$620.30', date: 'May 31', type: 'credit' as const },
]

function CreditIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="10" fill="#22C55E" fill-opacity="0.15" />
      <path d="M10 5.5V14.5M6 9.5L10 5.5L14 9.5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DebitIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="10" fill="#EF4444" fill-opacity="0.15" />
      <path d="M10 14.5V5.5M6 10.5L10 14.5L14 10.5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SavingsStatementPage() {
  const [dateRange, setDateRange] = useState<DateRange>('This Month')
  useAuthStore((s) => s.user)

  return (
    <main className="min-h-screen bg-[#0F0F1A] px-4 py-6 md:px-8 lg:px-16">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#16162A] border border-white/[0.04] hover:bg-white/[0.06] transition-colors"
          aria-label="Back to Dashboard"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4L7 9L11 14" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div>
          <h1 className="text-[#F1F5F9] font-bold text-xl md:text-2xl">Savings Statement</h1>
          <p className="text-[#6B7280] text-sm mt-0.5">Savings Account ****4521</p>
        </div>
      </header>

      {/* Date Range Filter */}
      <div className="flex gap-2 mb-6">
        {dateRanges.map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              dateRange === range
                ? 'bg-[#3B82F6] text-white'
                : 'bg-[#16162A] border border-white/[0.04] text-[#6B7280] hover:text-[#9CA3AF]'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-[#16162A] border border-white/[0.04] rounded-xl p-3 md:p-4 text-center">
            <p className="text-[#6B7280] text-xs md:text-sm mb-1">{card.label}</p>
            <p className="text-[#F1F5F9] font-bold text-sm md:text-lg">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Transactions Section */}
      <section className="mb-6">
        <h2 className="text-[#F1F5F9] font-bold text-base md:text-lg mb-4">Transaction History</h2>
        <div className="flex flex-col gap-3">
          {transactions.map((tx, idx) => (
            <div
              key={idx}
              className="bg-[#16162A] border border-white/[0.04] rounded-xl p-3 flex items-center gap-3"
            >
              {tx.type === 'credit' ? <CreditIcon /> : <DebitIcon />}
              <div className="flex-1 min-w-0">
                <p className="text-[#F1F5F9] text-sm font-medium truncate">{tx.description}</p>
                <p className="text-[#6B7280] text-xs mt-0.5">{tx.date}</p>
              </div>
              <span
                className={`text-sm font-semibold whitespace-nowrap ${
                  tx.type === 'credit' ? 'text-[#22C55E]' : 'text-[#EF4444]'
                }`}
              >
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Download PDF Button */}
      <button className="w-full py-3 rounded-xl border border-[#3B82F6] text-[#3B82F6] font-semibold text-sm hover:bg-[#3B82F6]/10 transition-colors">
        Download PDF
      </button>
    </main>
  )
}
