'use client';

import { Users, DollarSign, Clock, Headphones } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (page: string) => void;
}

const STATS = [
  { icon: Users, value: '75K+', label: 'Customers' },
  { icon: DollarSign, value: '$4.2B+', label: 'Assets' },
  { icon: Clock, value: '99.99%', label: 'Uptime' },
  { icon: Headphones, value: '24/7', label: 'Support' },
] as const;

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col bg-gradient-hero overflow-hidden">
      {/* Floating Orbs */}
      <div className="float-orb float-orb-sm" style={{ top: '15%', left: '10%' }} />
      <div className="float-orb float-orb-md" style={{ top: '8%', right: '15%' }} />
      <div className="float-orb float-orb-sm" style={{ bottom: '30%', left: '60%' }} />

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center pt-20 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight font-[family-name:var(--font-dm-sans)] leading-tight">
            Your Premier{' '}
            <span className="gradient-text-animated">Digital Bank</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience banking reimagined. Secure, fast, and built for the modern world.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('signup')}
              className="btn-primary"
            >
              Open Account
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="btn-ghost"
            >
              Login to Banking
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 pb-6">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-4 sm:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <Icon className="size-5 text-primary" />
                  <span className="count-up text-2xl sm:text-3xl font-bold text-foreground">
                    {value}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wider">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="relative z-10 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 text-xs sm:text-sm text-muted-foreground font-medium">
            <span className="px-3 py-1 sm:px-4 sm:py-0">ROUTING # 251480576</span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="px-3 py-1 sm:px-4 sm:py-0">BRANCH HOURS Mon-Fri 9AM-5PM</span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="px-3 py-1 sm:px-4 sm:py-0">FDIC INSURED</span>
          </div>
        </div>
      </div>
    </section>
  );
}
