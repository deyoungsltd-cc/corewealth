'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'

const billCategories = [
  {
    name: 'Electricity',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.12)',
  },
  {
    name: 'Water',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
  },
  {
    name: 'Internet',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <circle cx="12" cy="20" r="1" />
      </svg>
    ),
    color: '#06B6D4',
    bg: 'rgba(6, 182, 212, 0.12)',
  },
  {
    name: 'Gas',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
    color: '#F97316',
    bg: 'rgba(249, 115, 22, 0.12)',
  },
  {
    name: 'Phone/Airtime',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    color: '#22C55E',
    bg: 'rgba(34, 197, 94, 0.12)',
  },
  {
    name: 'TV/Cable',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
        <polyline points="17 2 12 7 7 2" />
      </svg>
    ),
    color: '#3B82F6',
    bg: 'rgba(139, 92, 246, 0.12)',
  },
]

const recentPayments = [
  {
    name: 'Electric Company',
    amount: '$142.50',
    status: 'Paid',
    statusColor: '#22C55E',
    statusBg: 'rgba(34, 197, 94, 0.12)',
    date: 'Jul 28',
  },
  {
    name: 'Internet Provider',
    amount: '$79.99',
    status: 'Paid',
    statusColor: '#22C55E',
    statusBg: 'rgba(34, 197, 94, 0.12)',
    date: 'Jul 25',
  },
  {
    name: 'Water Utility',
    amount: '$45.00',
    status: 'Pending',
    statusColor: '#F59E0B',
    statusBg: 'rgba(245, 158, 11, 0.12)',
    date: 'Aug 1',
  },
]

export default function PayBillsPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="min-h-screen bg-[#0F0F1A] px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#16162A] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F1F5F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-[#F1F5F9] text-xl font-bold">Pay Bills</h1>
      </div>

      {/* Subtitle */}
      <p className="text-[#9CA3AF] text-sm mb-6">
        Manage your utility and subscription payments
      </p>

      {/* Bill Categories Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {billCategories.map((category) => (
          <div
            key={category.name}
            className="bg-[#16162A] rounded-xl p-4 border border-white/[0.04] hover:border-white/[0.08] transition-colors cursor-pointer"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: category.bg, color: category.color }}
            >
              {category.icon}
            </div>
            <p className="text-[#F1F5F9] text-sm font-semibold mb-1">
              {category.name}
            </p>
            <span
              className="text-xs font-medium"
              style={{ color: category.color }}
            >
              Pay Now
            </span>
          </div>
        ))}
      </div>

      {/* Recent Payments */}
      <div className="mb-8">
        <h2 className="text-[#F1F5F9] text-base font-bold mb-4">
          Recent Payments
        </h2>
        <div className="flex flex-col gap-2">
          {recentPayments.map((payment) => (
            <div
              key={payment.name}
              className="bg-[#16162A] rounded-xl p-3 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#F1F5F9] text-sm font-semibold truncate">
                  {payment.name}
                </p>
                <p className="text-[#6B7280] text-xs">{payment.date}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[#F1F5F9] text-sm font-semibold">
                  {payment.amount}
                </p>
                <span
                  className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5"
                  style={{
                    color: payment.statusColor,
                    backgroundColor: payment.statusBg,
                  }}
                >
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Payment Button */}
      <button className="w-full bg-[#3B82F6] text-white font-bold py-3 rounded-xl hover:bg-[#2563EB] transition-colors">
        Schedule Payment
      </button>
    </div>
  )
}
