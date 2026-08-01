'use client';

import { Shield, CreditCard, Landmark, Building2, TrendingUp, Gift, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const SERVICES: ServiceItem[] = [
  {
    icon: Shield,
    title: 'Deposit Accounts',
    description:
      'Secure your money with our high-yield savings and checking accounts designed for growth.',
  },
  {
    icon: CreditCard,
    title: 'Credit Cards',
    description:
      'Find the perfect credit card for your lifestyle with competitive rates and rewards.',
  },
  {
    icon: Landmark,
    title: 'Loans',
    description:
      'Get competitive rates on personal, auto, and home loans tailored to your goals.',
  },
  {
    icon: Building2,
    title: 'Business Banking',
    description:
      'Comprehensive solutions designed to help your business thrive and scale.',
  },
  {
    icon: TrendingUp,
    title: 'Wealth & Retirement',
    description:
      'Plan for your future with expert investment and retirement planning services.',
  },
  {
    icon: Gift,
    title: 'Grants & Aid',
    description:
      'Access financial grants and aid programs to support your personal and business growth.',
  },
];

interface ServicesSectionProps {
  onNavigate: (page: string) => void;
}

export default function ServicesSection({ onNavigate }: ServicesSectionProps) {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-dm-sans)] tracking-tight">
            Our Services
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive banking solutions tailored to your needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {SERVICES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="glass-card card-shine p-6 flex flex-col gap-4">
              {/* Icon */}
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Icon className="size-6" />
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Learn More */}
              <button
                onClick={() => onNavigate('services')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors group w-fit"
              >
                Learn More
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
