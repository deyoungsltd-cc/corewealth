'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'

export default function WireTransferPage() {
  const user = useAuthStore((state) => state.user)

  const [recipientName, setRecipientName] = useState('')
  const [bankName, setBankName] = useState('')
  const [routingNumber, setRoutingNumber] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [swiftCode, setSwiftCode] = useState('')
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('Personal Transfer')

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
        <h1 className="text-[#F1F5F9] text-xl font-bold">Wire Transfer</h1>
      </div>

      {/* Subtitle */}
      <p className="text-[#9CA3AF] text-sm mb-6 ml-[52px]">
        Send money internationally
      </p>

      {/* Info Banner */}
      <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-xl p-3.5 flex items-start gap-3 mb-5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p className="text-[#F59E0B]/80 text-xs leading-relaxed">
          Wire transfers typically take 1–3 business days. Ensure all recipient details are accurate before submitting.
        </p>
      </div>

      {/* Wire Transfer Form Card */}
      <div className="bg-[#16162A] border border-white/[0.04] rounded-xl p-6 space-y-5">
        {/* Recipient Name */}
        <div>
          <label className="text-[#6B7280] text-xs font-medium mb-1.5 block">Recipient Name</label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Full legal name"
            className="bg-[#0F0F1A] border border-white/[0.06] rounded-xl px-4 py-3 text-[#F1F5F9] text-sm w-full outline-none focus:border-[#F59E0B] transition-colors placeholder-[#4B5563]"
          />
        </div>

        {/* Bank Name */}
        <div>
          <label className="text-[#6B7280] text-xs font-medium mb-1.5 block">Bank Name</label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="Recipient's bank name"
            className="bg-[#0F0F1A] border border-white/[0.06] rounded-xl px-4 py-3 text-[#F1F5F9] text-sm w-full outline-none focus:border-[#F59E0B] transition-colors placeholder-[#4B5563]"
          />
        </div>

        {/* Routing Number */}
        <div>
          <label className="text-[#6B7280] text-xs font-medium mb-1.5 block">Routing Number</label>
          <input
            type="text"
            value={routingNumber}
            onChange={(e) => setRoutingNumber(e.target.value)}
            placeholder="9-digit routing number"
            className="bg-[#0F0F1A] border border-white/[0.06] rounded-xl px-4 py-3 text-[#F1F5F9] text-sm w-full outline-none focus:border-[#F59E0B] transition-colors placeholder-[#4B5563]"
          />
        </div>

        {/* Account Number */}
        <div>
          <label className="text-[#6B7280] text-xs font-medium mb-1.5 block">Account Number</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Recipient's account number"
            className="bg-[#0F0F1A] border border-white/[0.06] rounded-xl px-4 py-3 text-[#F1F5F9] text-sm w-full outline-none focus:border-[#F59E0B] transition-colors placeholder-[#4B5563]"
          />
        </div>

        {/* SWIFT / BIC Code */}
        <div>
          <label className="text-[#6B7280] text-xs font-medium mb-1.5 block">SWIFT / BIC Code</label>
          <input
            type="text"
            value={swiftCode}
            onChange={(e) => setSwiftCode(e.target.value)}
            placeholder="e.g. CHASUS33"
            className="bg-[#0F0F1A] border border-white/[0.06] rounded-xl px-4 py-3 text-[#F1F5F9] text-sm w-full outline-none focus:border-[#F59E0B] transition-colors placeholder-[#4B5563] uppercase"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="text-[#6B7280] text-xs font-medium mb-1.5 block">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm font-medium">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-[#0F0F1A] border border-white/[0.06] rounded-xl pl-8 pr-4 py-3 text-[#F1F5F9] text-sm w-full outline-none focus:border-[#F59E0B] transition-colors placeholder-[#4B5563]"
            />
          </div>
        </div>

        {/* Purpose (dropdown-style display) */}
        <div>
          <label className="text-[#6B7280] text-xs font-medium mb-1.5 block">Purpose</label>
          <div className="bg-[#0F0F1A] border border-white/[0.06] rounded-xl px-4 py-3 text-[#F1F5F9] text-sm w-full flex items-center justify-between cursor-pointer hover:border-white/[0.1] transition-colors">
            <span>{purpose}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* Send Wire Button */}
        <button className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold text-sm rounded-xl py-3.5 transition-colors">
          Send Wire
        </button>

        {/* Fee note */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-[#6B7280] text-xs">Fee: $25.00</span>
          </div>
          <span className="text-[#4B5563]">|</span>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-[#F59E0B] text-xs font-medium">Processing: 1-3 business days</span>
          </div>
        </div>
      </div>
    </div>
  )
}
