'use client';

const TESTIMONIALS = [
  {
    name: 'Sarah Mitchell',
    role: 'Small Business Owner',
    since: '2021',
    seed: 'SarahMitchell',
    quote: 'Switching my business accounts to CoreWealth was the best decision I made. The fee-free checking and dedicated business support have saved me thousands over the past three years.',
  },
  {
    name: 'James Patterson',
    role: 'Retired Teacher',
    since: '2018',
    seed: 'JamesPatterson',
    quote: 'I needed a bank that respects my savings goals with competitive rates and no hidden fees. CoreWealth delivers exactly that with the personal touch I remember from community banking.',
  },
  {
    name: 'Priya Sharma',
    role: 'Software Engineer',
    since: '2022',
    seed: 'PriyaSharma',
    quote: 'The mobile banking experience is seamless. I manage all my accounts, transfer funds, and deposit checks from my phone. It fits perfectly into my busy lifestyle.',
  },
  {
    name: 'Marcus Chen',
    role: 'Freelance Designer',
    since: '2020',
    seed: 'MarcusChen',
    quote: 'As a freelancer, I need flexible banking that keeps up with irregular income. CoreWealth\'s budgeting tools and overdraft protection give me real peace of mind.',
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill="#FACC15">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#A78BFA' }}>Testimonials</p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Trusted by <span style={{ color: '#7C3AED' }}>Thousands</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="glass-card p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-[0_0_24px_2px_rgba(124,58,237,0.25)] hover:border-[#7C3AED]/50"
            >
              <Stars />
              <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-3 border-t border-border/40">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.seed}`}
                  alt={t.name}
                  className="w-10 h-10 rounded-full bg-muted"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role} · Member since {t.since}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
