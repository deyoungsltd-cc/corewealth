'use client';

import Link from 'next/link';

interface HeroSectionProps {
  onNavigate: (page: string) => void;
}

const STATS = [
  { value: '75,000+', label: 'Members Worldwide' },
  { value: '$2.4B', label: 'Assets Managed' },
  { value: '180+', label: 'Countries Served' },
] as const;

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BanknoteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

const STAT_ICONS = [UsersIcon, BanknoteIcon, GlobeIcon];

export default function HeroSection({ onNavigate: _onNavigate }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#060A13' }}>
      {/* Purple gradient mesh backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-30 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/3 -right-48 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #A78BFA 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 left-1/3 w-[400px] h-[400px] rounded-full opacity-15 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #6D28D9 0%, transparent 70%)' }}
        />
      </div>

      {/* Mobile background photo */}
      <div
        className="absolute inset-0 lg:hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 lg:hidden" style={{ background: 'linear-gradient(135deg, rgba(6,10,19,0.92) 0%, rgba(6,10,19,0.75) 100%)' }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium text-purple-200">FDIC Insured · Member FDIC</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
              <span className="text-white">Banking Built</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 50%, #C084FC 100%)' }}
              >
                For Your Future
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              From high-yield savings to global wire transfers, CoreWeave Bank delivers
              secure, modern financial services that grow with you.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]"
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' }}
              >
                Open Account
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 hover:scale-[1.03]"
                style={{ color: '#A78BFA', border: '1.5px solid rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.08)' }}
              >
                Sign In
              </Link>
            </div>

            {/* Trust badges (mobile visible, desktop below) */}
            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <span className="text-xs font-semibold uppercase tracking-widest">Trusted by</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="#7C3AED" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" /></svg>
                ))}
              </div>
              <span className="text-xs font-medium">4.9/5 rating</span>
            </div>
          </div>

          {/* Right: Image (desktop only) */}
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl opacity-50 blur-xl" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)' }} />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/30 border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop"
                  alt="Family managing finances together"
                  className="w-full h-auto max-w-[520px] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,10,19,0.5) 0%, transparent 50%)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Floating stats bar */}
        <div className="mt-16 lg:mt-20">
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-2 rounded-2xl"
            style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}
          >
            {STATS.map(({ value, label }, i) => {
              const Icon = STAT_ICONS[i];
              return (
                <div
                  key={label}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: 'rgba(124,58,237,0.2)' }}>
                    <Icon />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-white">{value}</div>
                    <div className="text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Animated floating elements */}
      <div className="absolute top-20 right-[10%] w-3 h-3 rounded-full animate-bounce" style={{ background: '#A78BFA', opacity: 0.4, animationDuration: '3s' }} />
      <div className="absolute top-[40%] left-[5%] w-2 h-2 rounded-full animate-bounce" style={{ background: '#7C3AED', opacity: 0.3, animationDuration: '4s', animationDelay: '1s' }} />
      <div className="absolute bottom-[20%] right-[25%] w-2.5 h-2.5 rounded-full animate-bounce" style={{ background: '#C084FC', opacity: 0.35, animationDuration: '3.5s', animationDelay: '0.5s' }} />
    </section>
  );
}
