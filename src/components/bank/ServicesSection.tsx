'use client';

const SERVICES = [
  {
    title: 'Checking Accounts',
    desc: 'Everyday banking with zero monthly fees and no minimum balance. Access your money anytime with a full-featured account designed for simplicity.',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h.01"/><path d="M10 15h.01"/></svg>,
  },
  {
    title: 'High-Yield Savings',
    desc: 'Earn a competitive 4.5% APY on every dollar saved. Your money works harder while staying fully accessible whenever you need it.',
    img: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=250&fit=crop',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2"/><path d="M2 9.1c1.6-1.2 4-1.8 6-1.9"/><circle cx="16" cy="11" r="1"/></svg>,
  },
  {
    title: 'Debit & Credit Cards',
    desc: 'Choose from virtual and physical cards with real-time controls. Lock, unlock, and set spending limits instantly from your phone.',
    img: 'https://images.unsplash.com/photo-1613243555988-441166d4d6fd?w=400&h=250&fit=crop',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/><path d="M6 15h4"/></svg>,
  },
  {
    title: 'Wire Transfers',
    desc: 'Send money domestically or internationally with speed and security. Competitive exchange rates and transparent fees on every transfer.',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 12h18"/><path d="M16 6l6 6-6 6"/><path d="M21 3v3"/><path d="M21 18v3"/></svg>,
  },
  {
    title: 'Investment Plans',
    desc: 'Build long-term wealth with diversified portfolio options. Get personalized guidance and automated rebalancing to stay on track.',
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  },
  {
    title: 'Bill Payments',
    desc: 'Pay anyone, anywhere with our seamless bill payment system. Schedule recurring payments and never miss a due date again.',
    img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=250&fit=crop',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 7h8"/><path d="M8 11h6"/><path d="M6 15h.01"/><path d="M10 15h.01"/><path d="M14 15h.01"/></svg>,
  },
];

export default function ServicesSection({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-dm-sans)] tracking-tight">
            Our Services
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive banking solutions designed around your financial goals
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {SERVICES.map((s) => (
            <div key={s.title} className="glass-card card-shine flex flex-col">
              <div className="relative h-40 overflow-hidden">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#7C3AED] text-white shrink-0">
                    {s.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 gap-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <button
                  onClick={() => onNavigate?.('services')}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#A78BFA] hover:text-white transition-colors mt-auto w-fit group"
                >
                  Learn More
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
