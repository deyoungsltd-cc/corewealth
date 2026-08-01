'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface HeroSectionProps {
  onNavigate: (page: string) => void;
}

const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1920&h=1080&fit=crop&q=80',
    alt: 'Family managing finances together on a tablet',
  },
  {
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop&q=80',
    alt: 'Modern banking dashboard on laptop',
  },
  {
    img: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1920&h=1080&fit=crop&q=80',
    alt: 'Financial growth and savings concept',
  },
] as const;

const STATS = [
  { value: '75,000+', label: 'Members Worldwide' },
  { value: '$2.4B', label: 'Assets Managed' },
  { value: '180+', label: 'Countries Served' },
] as const;

/* ─── Inline SVG Icons ─── */
function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BanknoteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-4 h-4" fill="#7C3AED" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
    </svg>
  );
}

const STAT_ICONS = [UsersIcon, BanknoteIcon, GlobeIcon];

/* ─── Animated counter hook ─── */
function useAnimatedCounter(target: string, duration: number = 2000) {
  const numericMatch = target.match(/[\d.]+/);
  const hasNumeric = !!numericMatch;
  const [display, setDisplay] = useState(() => (hasNumeric ? '0' : target));
  const started = useRef(false);

  useEffect(() => {
    if (started.current || !hasNumeric) return;
    started.current = true;

    const num = parseFloat(numericMatch![0]);
    const prefix = target.slice(0, target.indexOf(numericMatch![0]));
    const suffix = target.slice(target.indexOf(numericMatch![0]) + numericMatch![0].length);
    const hasDecimals = numericMatch![0].includes('.');
    const decimals = hasDecimals ? numericMatch![0].split('.')[1].length : 0;

    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = num * eased;

      if (decimals > 0) {
        setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);
      } else {
        const formatted = Math.floor(current).toLocaleString();
        setDisplay(`${prefix}${formatted}${suffix}`);
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        const finalFormatted = hasDecimals ? num.toFixed(decimals) : Math.floor(num).toLocaleString();
        setDisplay(`${prefix}${finalFormatted}${suffix}`);
      }
    };

    requestAnimationFrame(tick);
  }, [target, duration]);

  return display;
}

/* ─── Stat Item Component ─── */
function StatItem({ value, label, Icon, delay }: { value: string; label: string; Icon: () => React.ReactNode; delay: number }) {
  const animatedValue = useAnimatedCounter(value, 2200);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-700 hover:scale-[1.02] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ background: 'rgba(255,255,255,0.04)' }}
    >
      <div
        className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl"
        style={{ background: 'rgba(124,58,237,0.2)' }}
      >
        <span style={{ color: '#A78BFA' }}>
          <Icon />
        </span>
      </div>
      <div>
        <div className="text-xl sm:text-2xl font-bold text-white count-up" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {animatedValue}
        </div>
        <div className="text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</div>
      </div>
    </div>
  );
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      setIsTransitioning(false);
    }, 600);
  }, [isTransitioning]);

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#060A13' }}>
      {/* ─── Full-screen slideshow ─── */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
          style={{
            opacity: currentSlide === i && !isTransitioning ? 0.55 : (currentSlide === i && isTransitioning ? 0.55 : 0.15),
            backgroundImage: `url(${slide.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      {/* ─── Overlay gradient ─── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, rgba(6,10,19,0.95) 0%, rgba(6,10,19,0.7) 35%, rgba(6,10,19,0.5) 55%, rgba(6,10,19,0.75) 100%),
            linear-gradient(to top, rgba(6,10,19,0.9) 0%, transparent 40%)
          `,
        }}
      />

      {/* ─── Purple gradient mesh orbs ─── */}
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

      {/* ─── Slide indicators ─── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentSlide(i);
                setIsTransitioning(false);
              }, 600);
            }}
            className="group relative rounded-full transition-all duration-300"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div
              className="rounded-full transition-all duration-500"
              style={{
                width: currentSlide === i ? 28 : 8,
                height: 8,
                background: currentSlide === i
                  ? 'linear-gradient(90deg, #7C3AED, #A78BFA)'
                  : 'rgba(255,255,255,0.25)',
                boxShadow: currentSlide === i ? '0 0 12px rgba(124,58,237,0.5)' : 'none',
              }}
            />
          </button>
        ))}
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Trust badge */}
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8 animate-fade-in"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#34D399' }} />
              <span className="text-sm font-medium" style={{ color: '#C4B5FD' }}>FDIC Insured &middot; Member FDIC</span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              <span className="text-white">Banking Built</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 40%, #C084FC 70%, #A78BFA 100%)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text' }}
              >
                For Your Future
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="mt-6 text-base sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up"
              style={{ color: 'rgba(255,255,255,0.65)', animationDelay: '0.2s' }}
            >
              From high-yield savings to global wire transfers, CoreWealth delivers
              secure, modern financial services that grow with you.
            </p>

            {/* CTAs */}
            <div
              className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <a
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-300 hover:scale-[1.03] group"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                  boxShadow: '0 4px 20px rgba(124,58,237,0.35), 0 0 40px rgba(124,58,237,0.1)',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.boxShadow = '0 6px 30px rgba(124,58,237,0.5), 0 0 60px rgba(124,58,237,0.15)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.boxShadow = '0 4px 20px rgba(124,58,237,0.35), 0 0 40px rgba(124,58,237,0.1)';
                }}
              >
                Open Account
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  <ArrowRightIcon />
                </span>
              </a>
              <a
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-[1.03]"
                style={{
                  color: '#A78BFA',
                  border: '1.5px solid rgba(124,58,237,0.4)',
                  background: 'rgba(124,58,237,0.08)',
                }}
              >
                Sign In
              </a>
            </div>

            {/* Trust bar */}
            <div
              className="mt-10 flex items-center gap-6 justify-center lg:justify-start animate-fade-in-up"
              style={{ color: 'rgba(255,255,255,0.4)', animationDelay: '0.4s' }}
            >
              <span className="text-xs font-semibold uppercase tracking-widest">Trusted by</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <span className="text-xs font-medium">4.9/5 rating</span>
            </div>
          </div>

          {/* Right: Featured image card (desktop only) */}
          <div className="hidden lg:flex flex-1 items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="relative group">
              {/* Glow behind card */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-50 blur-xl transition-all duration-500 group-hover:opacity-70"
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)' }}
              />
              {/* Card */}
              <div
                className="relative rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.02]"
                style={{
                  boxShadow: '0 25px 60px rgba(0,0,0,0.4), 0 0 40px rgba(124,58,237,0.1)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <img
                  src={SLIDES[currentSlide].img}
                  alt={SLIDES[currentSlide].alt}
                  className="w-full h-auto max-w-[520px] object-cover transition-opacity duration-[1200ms] ease-in-out"
                  loading="eager"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(6,10,19,0.5) 0%, transparent 50%)' }}
                />
                {/* Bottom overlay info */}
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div>
                    <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">Featured</p>
                    <p className="text-white text-sm font-semibold">Experience premium banking</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(124,58,237,0.3)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white/90 text-xs font-medium">Live rates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Animated floating stats bar ─── */}
        <div className="mt-16 lg:mt-20">
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-2 rounded-2xl transition-all duration-500"
            style={{
              background: 'rgba(124,58,237,0.08)',
              border: '1px solid rgba(124,58,237,0.15)',
            }}
          >
            {STATS.map(({ value, label }, i) => (
              <StatItem
                key={label}
                value={value}
                label={label}
                Icon={STAT_ICONS[i]}
                delay={800 + i * 200}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── Animated floating elements ─── */}
      <div className="absolute top-20 right-[10%] w-3 h-3 rounded-full animate-bounce" style={{ background: '#A78BFA', opacity: 0.4, animationDuration: '3s' }} />
      <div className="absolute top-[40%] left-[5%] w-2 h-2 rounded-full animate-bounce" style={{ background: '#7C3AED', opacity: 0.3, animationDuration: '4s', animationDelay: '1s' }} />
      <div className="absolute bottom-[20%] right-[25%] w-2.5 h-2.5 rounded-full animate-bounce" style={{ background: '#C084FC', opacity: 0.35, animationDuration: '3.5s', animationDelay: '0.5s' }} />
      <div className="absolute top-[15%] left-[20%] w-2 h-2 rounded-full animate-bounce" style={{ background: '#A78BFA', opacity: 0.25, animationDuration: '5s', animationDelay: '2s' }} />
    </section>
  );
}
