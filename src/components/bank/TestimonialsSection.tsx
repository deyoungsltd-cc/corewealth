'use client';

import { Star, Quote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Robert Mitchell',
    role: 'Verified Customer',
    quote:
      'I am truly impressed with the customer service and speed of transactions. CoreWealth has exceeded all my expectations for modern banking.',
  },
  {
    name: 'Jennifer Lawson',
    role: 'Verified Business Owner',
    quote:
      'Excellent service and competitive rates. The business banking solutions have helped my company grow tremendously. Highly recommended!',
  },
  {
    name: 'David Thompson',
    role: 'Verified Customer',
    quote:
      'The mobile app is fantastic and customer support is top-notch. I have never had a better banking experience in my life.',
  },
];

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-dm-sans)] tracking-tight">
            Hear From Our Customers
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from real members who trust CoreWealth
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 sm:pb-0 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:overflow-visible">
          {TESTIMONIALS.map(({ name, role, quote }) => (
            <div
              key={name}
              className="glass-card p-6 flex flex-col gap-5 min-w-[280px] sm:min-w-0 snap-center shrink-0 sm:shrink"
            >
              <StarRating />
              <div className="relative flex-1">
                <Quote className="absolute -top-1 -left-1 size-6 text-primary/15 rotate-180" />
                <p className="text-sm leading-relaxed text-muted-foreground pl-4">{quote}</p>
              </div>
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/40">
                <div>
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                </div>
                <Badge
                  variant="secondary"
                  className="text-[10px] sm:text-xs font-medium bg-primary/10 text-primary border-primary/15 hover:bg-primary/15 shrink-0"
                >
                  {role}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
