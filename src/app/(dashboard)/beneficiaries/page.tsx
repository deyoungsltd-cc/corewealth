'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';

const beneficiaries = [
  {
    name: 'Beneficiary Name',
    contact: 'j***@gmail.com',
    transferType: 'Bank Transfer',
    status: 'Active' as const,
    initials: 'JD',
  },
  {
    name: 'Sarah Smith',
    contact: '+1 (***) ***-4521',
    transferType: 'Wire Transfer',
    status: 'Active' as const,
    initials: 'SS',
  },
  {
    name: 'Second Beneficiary',
    contact: 'm***@bank.com',
    transferType: 'Local Transfer',
    status: 'Pending' as const,
    initials: 'MJ',
  },
  {
    name: 'ABC Corp',
    contact: 'a***@corp.com',
    transferType: 'Business',
    status: 'Active' as const,
    initials: 'AC',
  },
];

export default function BeneficiariesPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <main className="min-h-screen bg-[#0F0F1A] px-4 py-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <Link
          href="/dashboard"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#16162A] border border-white/[0.04]"
          aria-label="Back to dashboard"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-[#F1F5F9] font-bold text-xl">Beneficiaries</h1>
      </div>

      {/* Subtitle */}
      <p className="text-[#9CA3AF] text-sm ml-12 mb-6">
        Manage your transfer recipients
      </p>

      {/* Add Beneficiary Button */}
      <button
        className="w-full border border-dashed border-white/[0.1] rounded-xl p-4 text-center text-[#3B82F6] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/[0.03] transition-colors mb-6"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Beneficiary
      </button>

      {/* Beneficiary List */}
      <div className="flex flex-col gap-3">
        {beneficiaries.map((b) => (
          <div
            key={b.name}
            className="bg-[#16162A] rounded-xl p-3.5 flex items-center gap-3 border border-white/[0.03]"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{b.initials}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[#F1F5F9] font-semibold text-sm truncate">{b.name}</p>
              <p className="text-[#6B7280] text-xs truncate mt-0.5">{b.contact}</p>
              <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-white/[0.06] text-[#9CA3AF] mt-1.5">
                {b.transferType}
              </span>
            </div>

            {/* Status + Chevron */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    b.status === 'Active' ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'
                  }`}
                />
                <span
                  className={`text-xs ${
                    b.status === 'Active' ? 'text-[#22C55E]' : 'text-[#F59E0B]'
                  }`}
                >
                  {b.status}
                </span>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Note */}
      <p className="text-[#6B7280] text-xs text-center mt-8 px-4 leading-relaxed">
        You can add up to 50 beneficiaries. Transfers to verified beneficiaries are processed instantly.
      </p>
    </main>
  );
}
