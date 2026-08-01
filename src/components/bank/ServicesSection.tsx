'use client';

const SERVICES = [
  {
    title: 'Checking Accounts',
    desc: 'Everyday banking with zero monthly fees and no minimum balance. Access your money anytime with a full-featured account designed for simplicity and speed.',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&q=80',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
        <path d="M6 15h.01" />
        <path d="M10 15h.01" />
      </svg>
    ),
    tag: 'Popular',
  },
  {
    title: 'High-Yield Savings',
    desc: 'Earn a competitive 4.25% APY on every dollar saved. Your money works harder while staying fully accessible whenever you need it.',
    img: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=400&fit=crop&q=80',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2" />
        <path d="M2 9.1c1.6-1.2 4-1.8 6-1.9" />
        <circle cx="16" cy="11" r="1" />
      </svg>
    ),
    tag: '4.25% APY',
  },
  {
    title: 'Debit & Credit Cards',
    desc: 'Choose from virtual and physical cards with real-time controls. Lock, unlock, and set spending limits instantly from your phone.',
    img: 'https://images.unsplash.com/photo-1613243555988-441166d4d6fd?w=600&h=400&fit=crop&q=80',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
        <path d="M6 15h4" />
      </svg>
    ),
    tag: null,
  },
  {
    title: 'Wire Transfers',
    desc: 'Send money domestically or internationally with speed and security. Competitive exchange rates and transparent fees on every transfer.',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&q=80',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 12h18" />
        <path d="M16 6l6 6-6 6" />
        <path d="M21 3v3" />
        <path d="M21 18v3" />
      </svg>
    ),
    tag: null,
  },
  {
    title: 'Investment Plans',
    desc: 'Build long-term wealth with diversified portfolio options. Get personalized guidance and automated rebalancing to stay on track.',
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop&q=80',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    tag: 'Wealth',
  },
  {
    title: 'Bill Payments',
    desc: 'Pay anyone, anywhere with our seamless bill payment system. Schedule recurring payments and never miss a due date again.',
    img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop&q=80',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="M8 7h8" />
        <path d="M8 11h6" />
        <path d="M6 15h.01" />
        <path d="M10 15h.01" />
        <path d="M14 15h.01" />
      </svg>
    ),
    tag: null,
  },
];

export default function ServicesSection({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <section className="relative py-20 sm:py-28">
      {/* Subtle background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-15 pointer-events-none blur-[100px]"
        style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#A78BFA' }}>
            Our Services
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Everything You Need,{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 50%, #C4B5FD 100%)',
                WebkitBackgroundClip: 'text',
              }}
            >
              All In One Place
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Comprehensive banking solutions designed around your financial goals — from everyday spending to long-term wealth building.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group relative rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer"
              style={{
                background: 'rgba(13,19,33,0.6)',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
              onClick={() => onNavigate?.('services')}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(124,58,237,0.4)';
                el.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4), 0 0 40px rgba(124,58,237,0.12), 0 0 80px rgba(124,58,237,0.04)';
                el.style.transform = 'translateY(-6px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(255,255,255,0.06)';
                el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                el.style.transform = 'translateY(0)';
              }}
            >
              {/* Image area */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(13,19,33,0.95) 0%, rgba(13,19,33,0.4) 50%, rgba(13,19,33,0.1) 100%)',
                  }}
                />
                {/* Tag badge */}
                {s.tag && (
                  <div
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: 'rgba(124,58,237,0.25)',
                      border: '1px solid rgba(124,58,237,0.4)',
                      color: '#C4B5FD',
                    }}
                  >
                    {s.tag}
                  </div>
                )}
                {/* Icon + Title overlay */}
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
                  >
                    <span className="text-white">{s.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-4" style={{ borderTop: '1px solid rgba(124,58,237,0.08)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {s.desc}
                </p>
                <button
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors w-fit group/btn"
                  style={{ color: '#A78BFA' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#A78BFA';
                  }}
                >
                  Learn More
                  <svg
                    className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Shine effect overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 30%, rgba(124,58,237,0.04) 45%, rgba(124,58,237,0.06) 50%, rgba(124,58,237,0.04) 55%, transparent 70%)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
