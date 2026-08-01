'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'

interface AccountCard {
  id: string
  label: string
  number: string
  balance: number
  gradientFrom: string
  gradientTo: string
}

const accounts: AccountCard[] = [
  {
    id: 'checking',
    label: 'From',
    number: 'Checking ****7890',
    balance: 280645.0,
    gradientFrom: '#3B82F6',
    gradientTo: '#60A5FA',
  },
  {
    id: 'savings',
    label: 'To',
    number: 'Savings ****4521',
    balance: 45230.5,
    gradientFrom: '#3B82F6',
    gradientTo: '#60A5FA',
  },
]

export default function InternalTransferPage() {
  const user = useAuthStore((state) => state.user)
  const [selectedFrom, setSelectedFrom] = useState('checking')
  const [selectedTo, setSelectedTo] = useState('savings')
  const [amount, setAmount] = useState('')

  const toggleFromTo = () => {
    const tempFrom = selectedFrom
    const tempTo = selectedTo
    setSelectedFrom(tempTo)
    setSelectedTo(tempFrom)
  }

  return (
    <div className="min-h-screen bg-[#0F0F1A] px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#16162A] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F1F5F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-[#F1F5F9] text-xl font-bold">Internal Transfer</h1>
      </div>

      {/* Subtitle */}
      <p className="text-[#9CA3AF] text-sm mb-6 ml-[52px]">
        Transfer between your accounts
      </p>

      {/* Account Selector Cards */}
      <div className="space-y-3 mb-6">
        {accounts.map((account) => {
          const isSelected =
            account.id === selectedFrom || account.id === selectedTo
          const role = account.id === selectedFrom ? 'From' : 'To'

          return (
            <div
              key={account.id}
              onClick={() => {
                // Toggle selection logic
                if (account.id === selectedFrom) return
                setSelectedFrom(account.id)
                setSelectedTo(selectedFrom)
              }}
              className={`bg-[#16162A] rounded-xl p-4 cursor-pointer border-2 transition-all duration-200 ${
                isSelected
                  ? account.id === 'checking'
                    ? 'border-[#3B82F6]/60'
                    : 'border-[#3B82F6]/60'
                  : 'border-transparent hover:border-white/[0.1]'
              }`}
              style={{
                borderLeft: `4px solid`,
                borderLeftColor: account.gradientFrom,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${account.gradientFrom}20, ${account.gradientTo}20)`,
                    }}
                  >
                    {account.id === 'checking' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={account.gradientFrom} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={account.gradientFrom} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                        <line x1="12" y1="11" x2="12" y2="17" />
                        <line x1="9" y1="14" x2="15" y2="14" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-[#6B7280] text-xs font-medium">{role}</p>
                    <p className="text-[#F1F5F9] text-sm font-bold">{account.number}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#F1F5F9] text-sm font-bold">
                    ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  {isSelected && (
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: account.gradientFrom }} />
                      <span className="text-[10px] font-medium" style={{ color: account.gradientFrom }}>Selected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Swap Button */}
      <div className="flex justify-center -my-2 mb-4 relative z-10">
        <button
          onClick={toggleFromTo}
          className="w-10 h-10 rounded-full bg-[#16162A] border border-white/[0.08] flex items-center justify-center hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/10 transition-all duration-200 group"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#3B82F6] transition-colors">
            <polyline points="7 16 3 12 7 8" />
            <polyline points="17 8 21 12 17 16" />
            <line x1="3" y1="12" x2="21" y2="12" />
          </svg>
        </button>
      </div>

      {/* Amount Card */}
      <div className="bg-[#16162A] border border-white/[0.04] rounded-xl p-6 space-y-5">
        <div>
          <label className="text-[#6B7280] text-xs font-medium mb-1.5 block">Amount to Transfer</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm font-medium">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-[#0F0F1A] border border-white/[0.06] rounded-xl pl-8 pr-4 py-3 text-[#F1F5F9] text-sm w-full outline-none focus:border-[#3B82F6] transition-colors placeholder-[#4B5563]"
            />
          </div>
        </div>

        {/* Transfer Button */}
        <button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-sm rounded-xl py-3.5 transition-colors">
          Transfer Now
        </button>

        {/* Fee note */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-[#22C55E] text-xs font-medium">Free instant transfers between your CoreWealth accounts</span>
          </div>
        </div>
      </div>
    </div>
  )
}
