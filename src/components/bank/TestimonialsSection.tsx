'use client';

const TESTIMONIALS = [
  {
    name: 'Sarah Mitchell',
    role: 'Small Business Owner',
    location: 'New York, NY',
    since: '2021',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    quote: 'Switching my business accounts to CoreWealth was the best decision I made. The fee-free checking and dedicated business support have saved me thousands over the past three years. Their digital platform is by far the best I have used.',
    rating: 5,
  },
  {
    name: 'James Patterson',
    role: 'Retired Teacher',
    location: 'Austin, TX',
    since: '2018',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    quote: 'I needed a bank that respects my savings goals with competitive rates and no hidden fees. CoreWealth delivers exactly that with the personal touch I remember from community banking. Their 4.25% APY is unmatched.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Software Engineer',
    location: 'San Francisco, CA',
    since: '2022',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    quote: 'The mobile banking experience is seamless. I manage all my accounts, transfer funds internationally, and deposit checks from my phone. The biometric login and real-time fraud alerts give me complete peace of mind.',
    rating: 5,
  },
  {
    name: 'Marcus Chen',
    role: 'Freelance Designer',
    location: 'Portland, OR',
    since: '2020',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    quote: 'As a freelancer, I need flexible banking that keeps up with irregular income. CoreWealth\'s budgeting tools, overdraft protection, and instant transfers have been a game-changer for managing my cash flow.',
    rating: 4,
  },
];

function GoldStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="w-5 h-5 transition-all duration-300"
          viewBox="0 0 20 20"
          fill={i < rating ? '#FACC15' : 'rgba(255,255,255,0.15)'}
          style={i < rating ? { filter: 'drop-shadow(0 0 3px rgba(250,204,21,0.4))' } : {}}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  );
}

function QuoteIcon() {
  return (
    <svg
      className="w-8 h-8 opacity-20"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ color: '#A78BFA' }}
    >
      <path d="M11.3 2.5c-.5-.8-1.5-1-2.3-.5-.8.5-1 1.5-.5 2.3L11.6 9c.5.8 1.5 1 2.3.5.8-.5 1-1.5.5-2.3L11.3 2.5zM18.7 2.5c-.5-.8-1.5-1-2.3-.5-.8.5-1 1.5-.5 2.3l3.1 4.7c.5.8 1.5 1 2.3.5.8-.5 1-1.5.5-2.3L18.7 2.5z" />
    </svg>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute bottom-0 left-1/4 w-[600px] h-[400px] rounded-full opacity-10 pointer-events-none blur-[100px]"
        style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#A78BFA' }}>
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Trusted by{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 50%, #C4B5FD 100%)',
                WebkitBackgroundClip: 'text',
              }}
            >
              Thousands
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Real stories from real members who have transformed their financial lives with CoreWealth.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="group relative rounded-2xl p-6 sm:p-7 flex flex-col gap-5 transition-all duration-500"
              style={{
                background: 'rgba(13,19,33,0.6)',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(124,58,237,0.35)';
                el.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4), 0 0 40px rgba(124,58,237,0.1)';
                el.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(255,255,255,0.06)';
                el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                el.style.transform = 'translateY(0)';
              }}
            >
              {/* Quote icon + Stars row */}
              <div className="flex items-start justify-between">
                <QuoteIcon />
                <GoldStars rating={t.rating} />
              </div>

              {/* Quote text */}
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div
                className="flex items-center gap-4 pt-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div
                  className="w-12 h-12 rounded-full overflow-hidden shrink-0 transition-all duration-300 group-hover:ring-2"
                  style={{
                    border: '2px solid rgba(124,58,237,0.2)',
                  }}
                >
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{t.name}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {t.role} &middot; {t.location}
                  </p>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-xs font-medium shrink-0"
                  style={{
                    background: 'rgba(124,58,237,0.12)',
                    color: '#A78BFA',
                  }}
                >
                  Since {t.since}
                </div>
              </div>

              {/* Hover glow overlay */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.06) 0%, transparent 60%)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5" viewBox="0 0 20 20" fill="#FACC15" style={{ filter: 'drop-shadow(0 0 3px rgba(250,204,21,0.3))' }}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-white">4.9 out of 5</span>
          </div>
          <div className="hidden sm:block w-px h-6" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Based on 12,000+ verified member reviews
          </p>
        </div>
      </div>
    </section>
  );
}
