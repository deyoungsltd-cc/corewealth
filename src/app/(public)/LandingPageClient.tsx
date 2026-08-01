'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from 'next-themes';
import Navbar from '@/components/bank/Navbar';
import HeroSection from '@/components/bank/HeroSection';
import RatesSection from '@/components/bank/RatesSection';
import ServicesSection from '@/components/bank/ServicesSection';
import TestimonialsSection from '@/components/bank/TestimonialsSection';
import Footer from '@/components/bank/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Shield,
  CreditCard,
  Landmark,
  Building2,
  TrendingUp,
  Gift,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Check,
  Calculator,
  ArrowRightLeft,
  Percent,
  Users,
  Heart,
  Star,
  Globe,
  Award,
  Zap,
  Target,
  Handshake,
  Sprout,
} from 'lucide-react';

type Page = 'home' | 'about' | 'services' | 'tools' | 'faq' | 'contact';

/* ══════════════════════════════════════════════════════════════════
   SCROLL PROGRESS — thin purple bar fixed at the top of the viewport
   ══════════════════════════════════════════════════════════════════ */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div
      className="scroll-progress"
      style={{ width: `${Math.min(progress, 100)}%` }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
   SECTION HEADER — reusable badge + gradient title + description
   ══════════════════════════════════════════════════════════════════ */
function SectionHeader({
  badge,
  title,
  highlight,
  description,
}: {
  badge: string;
  title: string;
  highlight: string;
  description: string;
}) {
  return (
    <div className="text-center mb-14 sm:mb-16">
      <Badge
        variant="outline"
        className="mb-4 text-primary border-primary/30 text-xs font-semibold uppercase tracking-wider"
      >
        {badge}
      </Badge>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-dm-sans)] tracking-tight">
        {title} <span className="gradient-text-animated">{highlight}</span>
      </h2>
      <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   NATIVE RANGE SLIDER — styled to match the purple theme
   ══════════════════════════════════════════════════════════════════ */
function PurpleSlider({
  value,
  onValueChange,
  min,
  max,
  step,
}: {
  value: number;
  onValueChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onValueChange(Number(e.target.value))}
      className="w-full h-2 rounded-full appearance-none cursor-pointer
        bg-muted
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:w-5
        [&::-webkit-slider-thumb]:h-5
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-primary
        [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(124,58,237,0.5)]
        [&::-webkit-slider-thumb]:cursor-pointer
        [&::-webkit-slider-thumb]:transition-all
        [&::-webkit-slider-thumb]:hover:shadow-[0_0_16px_rgba(124,58,237,0.7)]
        [&::-moz-range-thumb]:w-5
        [&::-moz-range-thumb]:h-5
        [&::-moz-range-thumb]:rounded-full
        [&::-moz-range-thumb]:bg-primary
        [&::-moz-range-thumb]:border-0
        [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(124,58,237,0.5)]
        [&::-moz-range-thumb]:cursor-pointer"
      style={{
        background: `linear-gradient(to right, #7C3AED 0%, #7C3AED ${pct}%, var(--muted) ${pct}%, var(--muted) 100%)`,
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
   NATIVE SELECT — styled to match the design system
   ══════════════════════════════════════════════════════════════════ */
function PurpleSelect({
  value,
  onValueChange,
  options,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="mt-1.5 w-full h-10 rounded-lg border border-border bg-background px-3 text-sm
        text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
        transition-colors cursor-pointer appearance-none
        bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237C3AED%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]
        bg-[length:18px] bg-[right_10px_center] bg-no-repeat"
    >
      {options.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ABOUT PAGE — history, mission, leadership, values
   ══════════════════════════════════════════════════════════════════ */
function AboutPage() {
  const [ceoPhoto, setCeoPhoto] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.data?.aboutPhotoUrl) setCeoPhoto(d.data.aboutPhotoUrl);
      })
      .catch(() => {});
  }, []);

  const teamMembers = [
    {
      name: 'Richard Holloway',
      role: 'Chief Executive Officer',
      photo: ceoPhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      bio: '30+ years in banking leadership, former VP at Goldman Sachs and managing director at Morgan Stanley. Richard founded CoreWealth with the vision of making premium banking accessible to everyone.',
    },
    {
      name: 'Sarah Chen',
      role: 'Chief Technology Officer',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
      bio: 'Former engineering lead at Stripe and Square. Sarah architects the digital infrastructure powering every CoreWealth transaction and ensures bulletproof security across all platforms.',
    },
    {
      name: 'Marcus Williams',
      role: 'Chief Financial Officer',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      bio: 'CPA and CFA charterholder with deep expertise in financial regulation and risk management. Marcus oversees $4.2 billion in assets and drives sustainable fiscal strategy.',
    },
    {
      name: 'Elena Rodriguez',
      role: 'Chief Risk Officer',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
      bio: 'Former senior examiner at the Federal Reserve. Elena brings decades of regulatory insight to protect members’ deposits and ensure full compliance with federal banking standards.',
    },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Uncompromising Security',
      desc: 'Your money is protected by FDIC insurance up to $250,000 per depositor, 256-bit AES encryption on every transaction, 24/7 real-time fraud monitoring, and multi-factor authentication. We invest more in security infrastructure than any digital bank our size because your trust is non-negotiable.',
    },
    {
      icon: Target,
      title: 'Member-First Thinking',
      desc: 'Unlike traditional banks that answer to Wall Street shareholders, CoreWealth is built around you. Every product decision, rate adjustment, and feature rollout is driven by what creates the most value for our members. Our net promoter score of 82 puts us in the top 1% of all financial institutions nationwide.',
    },
    {
      icon: Heart,
      title: 'Community Investment',
      desc: 'We reinvest over $12 million annually into the communities we serve through small business micro-grants, financial literacy programs in underserved schools, affordable housing initiatives, and scholarship funds that have helped 3,000+ students pursue higher education since our founding.',
    },
    {
      icon: Zap,
      title: 'Relentless Innovation',
      desc: 'From AI-powered savings automation to instant peer-to-peer transfers and biometric authentication, we push the boundaries of what a bank can be. Our engineering team ships new features weekly, and our mobile app holds a 4.9-star rating across both iOS and Android platforms.',
    },
    {
      icon: Handshake,
      title: 'Radical Transparency',
      desc: 'No hidden fees. No surprise charges. No fine print designed to confuse you. Every fee, rate, and term is presented in plain language on our website and in your account dashboard. We publish our full fee schedule publicly and challenge you to find a bank that does the same.',
    },
    {
      icon: Sprout,
      title: 'Sustainable Growth',
      desc: 'We believe financial health and environmental responsibility go hand in hand. CoreWealth is carbon-neutral certified, offers green lending products that fund renewable energy projects, and has pledged to achieve net-zero operations by 2027 through renewable energy and responsible sourcing.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 page-enter" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="About CoreWealth"
          title="Redefining What a Bank"
          highlight="Should Be"
          description="We are not just another financial institution. CoreWealth was founded on a radical idea: that world-class banking should be accessible, transparent, and genuinely designed around the people it serves."
        />

        {/* ── Hero image + mission statement ── */}
        <div className="glass-card card-shine p-0 overflow-hidden mb-16">
          <div className="grid md:grid-cols-2">
            <div className="relative h-64 md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=400&fit=crop"
                alt="CoreWealth leadership team collaborating in a modern office"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--card)] hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] to-transparent md:hidden" />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <Badge variant="outline" className="mb-4 text-primary border-primary/30 text-xs font-semibold uppercase tracking-wider w-fit">
                Our Story
              </Badge>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 font-[family-name:var(--font-dm-sans)]">
                Banking Built on <span className="gradient-text-animated">Trust</span>
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded in 2018, CoreWealth emerged from a frustration shared by millions: banking had become complicated, expensive, and indifferent to the people it was supposed to serve. Our founders — a team of former regulators, fintech engineers, and community bankers — came together with a single mission: to build a bank that treats every dollar with the same care its owner does.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                In just six years we have grown from a bold idea into a financial home for over 75,000 members, managing $4.2 billion in assets across 12 branch locations and a award-winning digital platform. Our growth has been fueled entirely by word-of-mouth and member referrals — a testament to the experience we deliver every single day.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Founded', value: '2018' },
                  { label: 'Members', value: '75K+' },
                  { label: 'Assets', value: '$4.2B' },
                  { label: 'NPS Score', value: '82' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-muted/50 rounded-xl p-4 text-center border border-border/30"
                  >
                    <p className="text-2xl font-bold text-primary">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Core values grid ── */}
        <div className="mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-10 font-[family-name:var(--font-dm-sans)]">
            What We <span className="gradient-text-animated">Stand For</span>
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="glass-card card-shine p-7 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-3">{v.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Leadership team ── */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-10 font-[family-name:var(--font-dm-sans)]">
            Meet Our <span className="gradient-text-animated">Leadership</span>
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((m) => (
              <div
                key={m.name}
                className="glass-card card-shine p-6 text-center group"
              >
                <div className="w-24 h-24 rounded-full mx-auto mb-5 overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-colors duration-300">
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h4 className="font-semibold text-base mb-1">{m.name}</h4>
                <p className="text-xs text-primary font-medium mb-3">
                  {m.role}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {m.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SERVICES PAGE — full service catalog when navigated to /services
   ══════════════════════════════════════════════════════════════════ */
function ServicesPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const services = [
    {
      icon: Shield,
      title: 'Deposit Accounts',
      desc: 'Secure your money with our industry-leading high-yield savings, free checking, and money market accounts. Every account comes with automatic savings rules, round-up purchases on every debit transaction, instant transfers between accounts, and FDIC insurance up to $250,000 per depositor. Our mobile deposit feature lets you cash checks from your couch.',
      features: [
        'High-Yield Savings — 4.25% APY',
        'Free Checking — No Minimum Balance',
        'Money Market Accounts',
        'Automatic Savings Rules & Round-Ups',
      ],
    },
    {
      icon: CreditCard,
      title: 'Credit Cards',
      desc: 'Choose from a curated lineup of credit cards designed for real life. Whether you want cashback on groceries, travel rewards with no foreign transaction fees, or a low introductory APR to consolidate debt, we have you covered. All cards feature zero liability protection and real-time spending alerts.',
      features: [
        'Platinum Cashback — 3% on Everything',
        'Travel Rewards — 5x on Hotels & Flights',
        '0% Intro APR for 15 Months',
        'No Annual Fee Options Available',
      ],
    },
    {
      icon: Landmark,
      title: 'Loans & Financing',
      desc: 'From your first car to your dream home, CoreWealth offers competitive rates and flexible terms on every loan product. Our streamlined digital application delivers decisions in as little as 24 hours, and our dedicated loan officers work with you to find the perfect fit for your budget and goals.',
      features: [
        'Personal Loans from 12.49% APR',
        'Auto Financing — New & Used',
        'Fixed & Adjustable Mortgages',
        'Home Equity Lines of Credit',
      ],
    },
    {
      icon: Building2,
      title: 'Business Banking',
      desc: 'Purpose-built for entrepreneurs and growing companies. Our business suite includes fee-free checking with unlimited transactions, merchant card processing at competitive rates, integrated payroll with tax filing, and business credit lines up to $500,000. Plus, our dedicated business advisors are just a call away.',
      features: [
        'Business Checking — No Monthly Fees',
        'Merchant Services & POS Integration',
        'Payroll Processing & Tax Filing',
        'Business Credit Lines up to $500K',
      ],
    },
    {
      icon: TrendingUp,
      title: 'Wealth & Retirement',
      desc: 'Plan for the future you deserve with our comprehensive wealth management services. Our certified financial advisors create personalized investment strategies based on your goals, risk tolerance, and timeline. From IRAs and 401(k) rollovers to portfolio management and estate planning, we handle it all.',
      features: [
        'Personalized Investment Advisory',
        'Traditional & Roth IRA Accounts',
        '401(k) Rollover Assistance',
        'Estate & Tax Planning Services',
      ],
    },
    {
      icon: Gift,
      title: 'Grants & Financial Aid',
      desc: 'CoreWealth believes in lifting communities. Our grants and aid programs provide funding for education, small business development, and community revitalization projects. We have distributed over $8 million in grants since 2019, and our quarterly application cycles make it easy to apply for the support you need.',
      features: [
        'Education Scholarships',
        'Small Business Development Grants',
        'Community Revitalization Fund',
        'Quarterly Application Cycles',
      ],
    },
  ];

  return (
    <section className="py-20 sm:py-28 page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Our Services"
          title="Everything You Need to"
          highlight="Build Wealth"
          description="From everyday banking to long-term wealth building, our comprehensive suite of financial products is designed to grow with you at every stage of life."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc, features }) => (
            <div
              key={title}
              className="glass-card card-shine p-6 sm:p-8 flex flex-col gap-4 group"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Icon className="size-6" />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
              <ul className="space-y-1.5 mt-auto pt-2 border-t border-border/30">
                {features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <Check className="size-3 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TOOLS PAGE — savings calculator, loan calculator, currency converter
   ══════════════════════════════════════════════════════════════════ */
function ToolsPage() {
  // ── Loan calculator state ──
  const [loanAmount, setLoanAmount] = useState(25000);
  const [loanRate, setLoanRate] = useState(12.49);
  const [loanTerm, setLoanTerm] = useState(36);
  const monthlyRate = loanRate / 100 / 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (loanAmount *
          monthlyRate *
          Math.pow(1 + monthlyRate, loanTerm)) /
        (Math.pow(1 + monthlyRate, loanTerm) - 1)
      : loanAmount / loanTerm;
  const totalLoanPayment = monthlyPayment * loanTerm;
  const totalInterest = totalLoanPayment - loanAmount;

  // ── Savings calculator state ──
  const [savingsInitial, setSavingsInitial] = useState(5000);
  const [savingsMonthly, setSavingsMonthly] = useState(500);
  const [savingsRate, setSavingsRate] = useState(4.25);
  const [savingsYears, setSavingsYears] = useState(10);
  const totalSavings = (() => {
    const r = savingsRate / 100 / 12;
    const n = savingsYears * 12;
    if (r === 0) return savingsInitial + savingsMonthly * n;
    return (
      savingsInitial * Math.pow(1 + r, n) +
      (savingsMonthly * (Math.pow(1 + r, n) - 1)) / r
    );
  })();
  const totalContributed = savingsInitial + savingsMonthly * savingsYears * 12;
  const interestEarned = totalSavings - totalContributed;

  // ── Currency converter state ──
  const rates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.5,
    CHF: 0.88,
    CAD: 1.37,
    AUD: 1.53,
    CNY: 7.24,
    INR: 83.1,
    NGN: 1580,
  };
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertAmount, setConvertAmount] = useState('1000');
  const convertedValue =
    (parseFloat(convertAmount) || 0) * (rates[toCurrency] / rates[fromCurrency]);
  const currencyOptions = Object.keys(rates);

  return (
    <section className="py-20 sm:py-28 page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Financial Tools"
          title="Smart Calculators to"
          highlight="Plan Ahead"
          description="Take control of your finances with our interactive tools. Run the numbers, explore scenarios, and make confident decisions about your money."
        />
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* ── Savings Calculator ── */}
          <Card className="glass-card card-shine border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Sprout className="w-5 h-5 text-primary" />
                Savings Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Initial Deposit</span>
                  <span className="text-primary font-bold">
                    ${savingsInitial.toLocaleString()}
                  </span>
                </div>
                <PurpleSlider
                  value={savingsInitial}
                  onValueChange={setSavingsInitial}
                  min={0}
                  max={100000}
                  step={500}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>$0</span>
                  <span>$100,000</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Monthly Contribution</span>
                  <span className="text-primary font-bold">
                    ${savingsMonthly.toLocaleString()}
                  </span>
                </div>
                <PurpleSlider
                  value={savingsMonthly}
                  onValueChange={setSavingsMonthly}
                  min={0}
                  max={5000}
                  step={50}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>$0</span>
                  <span>$5,000</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Annual Interest Rate</span>
                  <span className="text-primary font-bold">{savingsRate}%</span>
                </div>
                <PurpleSlider
                  value={savingsRate}
                  onValueChange={setSavingsRate}
                  min={0.5}
                  max={10}
                  step={0.05}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0.5%</span>
                  <span>10%</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Time Period</span>
                  <span className="text-primary font-bold">
                    {savingsYears} years
                  </span>
                </div>
                <PurpleSlider
                  value={savingsYears}
                  onValueChange={setSavingsYears}
                  min={1}
                  max={40}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 yr</span>
                  <span>40 yrs</span>
                </div>
              </div>
              <div className="bg-primary/5 rounded-xl p-5 space-y-3 border border-primary/10">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Future Value
                  </span>
                  <span className="text-xl font-bold text-primary">
                    ${totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Contributed
                  </span>
                  <span className="text-sm font-semibold">
                    ${totalContributed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Interest Earned
                  </span>
                  <span className="text-sm font-semibold text-green-400">
                    ${interestEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Loan Calculator ── */}
          <Card className="glass-card card-shine border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Calculator className="w-5 h-5 text-primary" />
                Loan Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Loan Amount</span>
                  <span className="text-primary font-bold">
                    ${loanAmount.toLocaleString()}
                  </span>
                </div>
                <PurpleSlider
                  value={loanAmount}
                  onValueChange={setLoanAmount}
                  min={1000}
                  max={500000}
                  step={1000}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>$1,000</span>
                  <span>$500,000</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Interest Rate (APR)</span>
                  <span className="text-primary font-bold">{loanRate}%</span>
                </div>
                <PurpleSlider
                  value={loanRate}
                  onValueChange={setLoanRate}
                  min={1}
                  max={30}
                  step={0.1}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1%</span>
                  <span>30%</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Loan Term</span>
                  <span className="text-primary font-bold">
                    {loanTerm} months
                  </span>
                </div>
                <PurpleSlider
                  value={loanTerm}
                  onValueChange={setLoanTerm}
                  min={6}
                  max={84}
                  step={6}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>6 mo</span>
                  <span>84 mo</span>
                </div>
              </div>
              <div className="bg-primary/5 rounded-xl p-5 space-y-3 border border-primary/10">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Monthly Payment
                  </span>
                  <span className="text-xl font-bold text-primary">
                    ${monthlyPayment.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Payment
                  </span>
                  <span className="text-sm font-semibold">
                    ${totalLoanPayment.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Interest
                  </span>
                  <span className="text-sm font-semibold text-destructive">
                    ${totalInterest.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Currency Converter ── */}
          <Card className="glass-card card-shine border-0 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Globe className="w-5 h-5 text-primary" />
                Currency Converter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="max-w-md">
                <Label className="text-sm font-medium">Amount</Label>
                <Input
                  type="number"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  className="mt-1.5"
                  min="0"
                />
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-end max-w-lg">
                <div>
                  <Label className="text-sm font-medium">From</Label>
                  <PurpleSelect
                    value={fromCurrency}
                    onValueChange={setFromCurrency}
                    options={currencyOptions}
                  />
                </div>
                <button
                  onClick={() => {
                    const tmp = fromCurrency;
                    setFromCurrency(toCurrency);
                    setToCurrency(tmp);
                  }}
                  className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors mb-0.5"
                  aria-label="Swap currencies"
                >
                  <ArrowRightLeft className="w-4 h-4 text-primary" />
                </button>
                <div>
                  <Label className="text-sm font-medium">To</Label>
                  <PurpleSelect
                    value={toCurrency}
                    onValueChange={setToCurrency}
                    options={currencyOptions}
                  />
                </div>
              </div>
              <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {(parseFloat(convertAmount) || 0).toLocaleString()}{' '}
                  {fromCurrency} =
                </p>
                <p className="text-3xl sm:text-4xl font-bold text-primary">
                  {convertedValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  {toCurrency}
                </p>
                <p className="text-xs text-muted-foreground mt-3">
                  1 {fromCurrency} ={' '}
                  {(rates[toCurrency] / rates[fromCurrency]).toFixed(4)}{' '}
                  {toCurrency}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FAQ PAGE — 12 comprehensive banking FAQs
   ══════════════════════════════════════════════════════════════════ */
function FAQPage() {
  const faqs = [
    {
      q: 'How do I open an account with CoreWealth?',
      a: 'Opening an account takes less than five minutes and is completely digital. Click "Open Account" on our homepage, provide your basic personal information, verify your identity with a valid government-issued ID, and fund your new account via bank transfer or debit card. There is no minimum balance requirement for our Free Checking account, and you will receive your account number and routing information instantly upon approval. If you prefer in-person service, visit any of our 12 branch locations and a team member will guide you through the process.',
    },
    {
      q: 'Is my money safe and insured at CoreWealth?',
      a: 'Absolutely. Every deposit at CoreWealth is FDIC insured up to $250,000 per depositor, per account ownership category. We use 256-bit AES encryption — the same standard used by the U.S. military — for all online and mobile transactions. Our security operations center monitors every transaction 24/7 for suspicious activity, and we provide real-time push notifications for every transaction so you can spot unauthorized charges instantly. Multi-factor authentication is required for all account access.',
    },
    {
      q: 'What are your current interest rates on savings and deposits?',
      a: 'Our High-Yield Savings account currently offers 4.25% APY with no minimum balance and no monthly fees. Our 18-Month Certificate of Deposit offers 4.10% APY, and our Money Market account provides tiered rates starting at 3.75% APY for balances above $10,000. All rates are variable and subject to change — visit the Rates section of our website or your account dashboard for the most up-to-date information. We consistently rank in the top 5% of digital banks for deposit rates.',
    },
    {
      q: 'How do I contact customer support and what are the hours?',
      a: 'We offer support through multiple channels: call us at 1-800-BANKING (available 24/7 for urgent matters), email support@corewealth.com for non-urgent inquiries with a guaranteed response within 24 hours, or use the live chat feature on our website and mobile app during extended hours (7AM-11PM ET). For in-person assistance, visit any of our 12 branch locations Monday through Friday 9AM-5PM or Saturday 9AM-1PM. Our average wait time for phone support is under 90 seconds.',
    },
    {
      q: 'Does CoreWealth offer business banking services?',
      a: 'Yes, we provide a comprehensive suite of business banking products. Our Business Checking account has no monthly fees and unlimited transactions. We offer merchant card processing with competitive swipe rates, integrated payroll processing with automatic tax filings, business credit lines up to $500,000, commercial real estate loans, and equipment financing. Every new business customer receives a complimentary consultation with one of our dedicated business advisors who will help identify the right products for your company\'s needs.',
    },
    {
      q: 'Can I access and manage my accounts from my mobile phone?',
      a: 'Our mobile app is available for both iOS and Android devices and offers full account management capabilities. You can check real-time balances and transaction history, transfer funds between accounts or to external banks, deposit checks using your phone\'s camera with same-day availability, pay bills and set up recurring payments, manage debit card controls (freeze/unfreeze, set spending limits), enable biometric login with Face ID or fingerprint, and receive instant push notifications for every transaction. The app holds a 4.9-star rating on both app stores.',
    },
    {
      q: 'What is the routing number and how do I find it?',
      a: 'The CoreWealth routing number is 251480576. You will need this for setting up direct deposits, initiating wire transfers, configuring automatic bill payments, and linking external accounts. The routing number is printed on the bottom-left corner of your checks, displayed in your online banking dashboard under "Account Details," and available on our website. If you are unsure which routing number to use, contact our support team and they will confirm the correct number for your account type.',
    },
    {
      q: 'How do CoreWealth grants and financial aid programs work?',
      a: 'CoreWealth is committed to community investment and operates several grant and aid programs. Our Education Scholarship Fund awards up to $10,000 per year to qualifying students pursuing higher education. Our Small Business Development Grant provides up to $25,000 for qualifying entrepreneurs to launch or expand their businesses. Our Community Revitalization Fund supports local projects that improve neighborhoods. Applications are reviewed quarterly — visit the Grants section of your account dashboard for current opportunities, eligibility requirements, and deadlines.',
    },
    {
      q: 'Are there any fees associated with CoreWealth accounts?',
      a: 'Transparency is one of our core values. Our Free Checking account has zero monthly fees, zero minimum balance requirements, and no per-transaction charges. Our High-Yield Savings account is also fee-free. There are no fees for online bill pay, mobile check deposit, transfers between your CoreWealth accounts, or access to our nationwide ATM network of 55,000+ machines. The only fees you might encounter are for wire transfers, overdrafts (which can be opted out of), and expedited card replacement — all of which are clearly disclosed in our published fee schedule.',
    },
    {
      q: 'How do I apply for a loan or credit card?',
      a: 'Applying is fast and straightforward. Log into your account dashboard and navigate to "Products," then select the loan or credit card you are interested in. Fill out the digital application — most fields will be pre-populated from your existing account information. You can also apply by calling our lending team at 1-800-BANKING ext. 3 or visiting any branch. Personal loan and credit card decisions are typically delivered within 24 hours, while mortgage applications may take 3-5 business days due to the appraisal and underwriting process.',
    },
    {
      q: 'What happens if I suspect fraud or unauthorized activity on my account?',
      a: 'If you notice any transaction you did not authorize, contact us immediately at 1-800-BANKING (available 24/7) or use the "Report Fraud" button in your mobile app to freeze your card instantly. Our fraud resolution team will investigate the disputed transaction within 10 business days and issue a provisional credit to your account while the investigation is ongoing. You are protected by our zero-liability guarantee — you will not be held responsible for unauthorized transactions reported promptly. We also recommend enabling all transaction alerts in your account settings for real-time monitoring.',
    },
    {
      q: 'Can I close my account online or do I need to visit a branch?',
      a: 'You can request to close most account types directly through your online banking dashboard under "Account Settings" or by contacting our support team. Before closing, ensure all pending transactions have cleared, your balance is withdrawn or transferred to another account, and any linked automatic payments or direct deposits are redirected to your new account. For joint accounts or accounts with certain restrictions, a brief phone verification may be required. There is no fee to close your account. If you have a certificate of deposit that has not yet matured, early withdrawal penalties may apply as disclosed at account opening.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 page-enter">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="FAQ"
          title="Frequently Asked"
          highlight="Questions"
          description="Can not find what you are looking for? Our support team is available 24/7 to help. Reach us at 1-800-BANKING or support@corewealth.com."
        />
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="glass-card border-0 data-[state=open]:glow-purple-sm"
            >
              <AccordionTrigger className="px-6 hover:no-underline hover:text-primary transition-colors text-left text-sm sm:text-base">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-muted-foreground leading-relaxed text-sm">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CONTACT PAGE — form + contact information cards
   ══════════════════════════════════════════════════════════════════ */
function ContactPage() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const contactCards = [
    {
      icon: Mail,
      title: 'Email Us',
      lines: [
        'support@corewealth.com',
        'business@corewealth.com',
        'Response within 24 hours',
      ],
    },
    {
      icon: Phone,
      title: 'Call Us',
      lines: [
        '1-800-BANKING (24/7)',
        'International: +1-555-0123',
        'Avg. wait time: under 90 seconds',
      ],
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      lines: [
        '123 Banking Street',
        'Financial District',
        'New York, NY 10001',
      ],
    },
    {
      icon: Clock,
      title: 'Banking Hours',
      lines: [
        'Mon–Fri: 9:00 AM – 5:00 PM',
        'Saturday: 9:00 AM – 1:00 PM',
        'Sunday: Closed',
      ],
    },
  ];

  return (
    <section className="py-20 sm:py-28 page-enter" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Contact Us"
          title="We Are Here to"
          highlight="Help"
          description="Whether you have a question about your account, need help choosing the right product, or want to explore business banking — our team is ready for you."
        />
        <div className="grid md:grid-cols-5 gap-8 sm:gap-10">
          {/* ── Contact form ── */}
          <div className="md:col-span-3">
            <div className="glass-card p-6 sm:p-8">
              {sent ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Thank you for reaching out. A member of our team will
                    respond to your inquiry within 24 hours during business
                    days. For urgent matters, please call us at 1-800-BANKING.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="contact-name">Full Name</Label>
                      <Input
                        id="contact-name"
                        placeholder="Jane Mitchell"
                        className="mt-1.5"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">
                        Email Address
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="jane@example.com"
                        className="mt-1.5"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="contact-subject">Subject</Label>
                    <Input
                      id="contact-subject"
                      placeholder="How can we help you today?"
                      className="mt-1.5"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      placeholder="Please describe your inquiry in detail so we can provide the most helpful response..."
                      rows={6}
                      className="mt-1.5"
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    <Mail className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── Contact info cards ── */}
          <div className="md:col-span-2 space-y-5">
            {contactCards.map((c) => (
              <div
                key={c.title}
                className="glass-card p-5 flex gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{c.title}</h4>
                  {c.lines.map((line, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {/* Extra trust badge */}
            <div className="glass-card p-5 border-t-2 border-primary/30">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm">
                  Trusted by 75,000+ Members
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                CoreWealth maintains an A+ rating with the Better Business
                Bureau and has been recognized as a top digital bank by
                Bankrate and NerdWallet for three consecutive years. Our
                commitment to transparency and service excellence has earned
                us a Net Promoter Score of 82 — placing us in the top 1% of
                all financial institutions nationwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CTA SECTION — bold call-to-action with account registration link
   ══════════════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div
        className="float-orb float-orb-md"
        style={{ top: '10%', left: '25%' }}
      />
      <div
        className="float-orb float-orb-sm"
        style={{ bottom: '20%', right: '15%' }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <Badge
          variant="outline"
          className="mb-6 text-primary border-primary/30 text-xs font-semibold uppercase tracking-wider"
        >
          Get Started Today
        </Badge>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-[family-name:var(--font-dm-sans)] leading-tight">
          Ready to Experience{' '}
          <span className="gradient-text-animated">Premier Banking</span>?
        </h2>
        <p className="text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-base sm:text-lg">
          Join over 75,000 members who trust CoreWealth to manage, grow, and
          protect their wealth. Open your account in under five minutes — no
          minimum balance, no hidden fees, and FDIC insurance from day one.
          Your financial future starts right here.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/register" className="btn-primary text-base px-8 py-4">
            Open Account Today
            <ArrowRight className="w-5 h-5" />
          </a>
          <button
            onClick={() =>
              document
                .getElementById('contact')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="btn-ghost text-base px-8 py-4"
          >
            <Phone className="w-5 h-5" />
            Contact Us
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-6">
          FDIC insured up to $250,000 per depositor. 256-bit encryption on
          every transaction. No minimum balance required.
        </p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN ORCHESTRATOR — internal SPA navigation between pages
   ══════════════════════════════════════════════════════════════════ */
export default function LandingPageClient() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { theme } = useTheme();

  // Sync theme class to document root for CSS variable switching
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const pageLabel =
    currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <Navbar currentPage={pageLabel} onNavigate={handleNavigate} />

      <main className="flex-1 pt-16">
        {currentPage === 'home' && (
          <>
            <HeroSection onNavigate={handleNavigate} />
            <div className="section-divider" />
            <RatesSection />
            <div className="section-divider" />
            <ServicesSection onNavigate={handleNavigate} />
            <div className="section-divider" />
            <AboutPage />
            <div className="section-divider" />
            <ToolsPage />
            <div className="section-divider" />
            <FAQPage />
            <div className="section-divider" />\n            <TestimonialsSection />
            <CTASection />
          </>
        )}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'services' && (
          <ServicesPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'tools' && <ToolsPage />}
        {currentPage === 'faq' && <FAQPage />}
        {currentPage === 'contact' && <ContactPage />}
      </main>

      <Footer />
    </div>
  );
}
