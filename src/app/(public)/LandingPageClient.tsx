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
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Shield, CreditCard, Landmark, Building2, TrendingUp, Gift, ArrowRight, ArrowLeft,
  MapPin, Phone, Mail, Clock, Check, Wallet, Send, Download, Eye, EyeOff, User, Lock as LockIcon,
  PiggyBank, BarChart3, FileText, QrCode, Calculator, ArrowRightLeft, Diamond,
  Percent, ArrowDown, ArrowUp, X, Users, Heart, ChevronRight, Star, Globe, Award, Zap
} from 'lucide-react';

type Page = 'home' | 'about' | 'services' | 'tools' | 'faq' | 'contact' | 'login' | 'signup' | 'dashboard';

// ═══ SCROLL PROGRESS ═══
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const h = () => setP(
      document.documentElement.scrollHeight - window.innerHeight > 0
        ? (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        : 0
    );
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return <div className="scroll-progress" style={{ width: `${Math.min(p, 100)}%` }} />;
}

// ═══ ANIMATED COUNTER HOOK ═══
function useCountUp(end: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!startOnView || !ref.current) {
      requestAnimationFrame(() => setCount(end));
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            requestAnimationFrame(() => setCount(Math.floor(eased * end)));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, startOnView]);

  return { count, ref };
}

function CounterStat({ value, suffix = '', prefix = '', label }: { value: number; suffix?: string; prefix?: string; label: string }) {
  const { count, ref } = useCountUp(value, 2000);
  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <span className="text-2xl sm:text-3xl font-bold text-foreground font-variant-numeric: tabular-nums">
        {prefix}{count.toLocaleString()}{suffix}
      </span>
      <span className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
    </div>
  );
}

// ═══ SECTION HEADER ═══
function SectionHeader({ badge, title, highlight, description }: { badge: string; title: string; highlight: string; description: string }) {
  return (
    <div className="text-center mb-14 sm:mb-16">
      <Badge variant="outline" className="mb-4 text-primary border-primary/30 text-xs font-semibold uppercase tracking-wider">{badge}</Badge>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-dm-sans)] tracking-tight">
        {title} <span className="gradient-text-animated">{highlight}</span>
      </h2>
      <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{description}</p>
    </div>
  );
}

// ═══ ABOUT PAGE ═══
function AboutPage() {
  return (
    <section className="py-20 sm:py-28 page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader badge="About Us" title="Building Strength" highlight="Together" description="CoreWealth is a full-service digital bank built on the foundation of providing our members with exceptional service at every step of their financial journey." />
        
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {[
            { icon: Percent, title: 'Competitive Rates', desc: 'Better rates on savings, loans, and credit cards designed to maximize your financial growth. We consistently beat the national average across all product categories, ensuring your money works harder for you every single day.' },
            { icon: Users, title: 'Member-Focused', desc: 'We are owned by our members, not shareholders. Your success is our priority, and every decision we make puts you first. Experience the difference of true member banking with personalized service and transparent policies.' },
            { icon: Heart, title: 'Community Committed', desc: 'Supporting local communities and causes that matter to our members. We reinvest in the neighborhoods we serve through grants, scholarships, educational programs, and strategic community partnerships.' }
          ].map(item => (
            <div key={item.title} className="glass-card card-shine p-8 text-center group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">Founded in 2018, CoreWealth was born from a simple belief: banking should work for everyone, not just the wealthy few. We combine cutting-edge technology with personalized service to deliver a banking experience that is truly exceptional.</p>
              <p className="text-muted-foreground mb-6 leading-relaxed">With over 75,000 members and $4.2 billion in assets under management, we have grown into one of the most trusted digital banks in the country. Our FDIC-insured accounts and 256-bit SSL encryption ensure your money is always safe.</p>
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary text-sm">Explore Services <ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ l: 'Founded', v: '2018' }, { l: 'Members', v: '75K+' }, { l: 'Assets', v: '$4.2B' }, { l: 'Branches', v: '12' }].map(s => (
                <div key={s.l} className="bg-muted/50 rounded-xl p-5 text-center border border-border/30">
                  <p className="text-2xl font-bold text-primary">{s.v}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══ SERVICES PAGE ═══
function ServicesPage() {
  const services = [
    { icon: Shield, title: 'Deposit Accounts', desc: 'Secure your money with our high-yield savings and checking accounts designed for growth. Features include automatic savings rules, round-up purchases, and instant transfers between accounts.', features: ['High-Yield Savings', 'Free Checking', 'Money Market Accounts', 'Automatic Savings Rules'] },
    { icon: CreditCard, title: 'Credit Cards', desc: 'Find the perfect credit card for your lifestyle with competitive rates starting at 3.99% APR. Enjoy cashback rewards, travel points, and no hidden fees with our transparent pricing structure.', features: ['Cashback Rewards', 'Travel Points', '0% Intro APR', 'No Annual Fee Options'] },
    { icon: Landmark, title: 'Loans & Financing', desc: 'Get competitive rates on personal, auto, and home loans tailored to your goals. Our streamlined application process delivers decisions in as little as 24 hours with flexible repayment terms.', features: ['Personal Loans', 'Auto Financing', 'Mortgage Loans', 'Home Equity Lines'] },
    { icon: Building2, title: 'Business Banking', desc: 'Comprehensive solutions designed to help your business thrive and scale. From merchant services to payroll processing, we provide the tools your business needs to succeed.', features: ['Business Checking', 'Merchant Services', 'Payroll Solutions', 'Business Credit Lines'] },
    { icon: TrendingUp, title: 'Wealth & Retirement', desc: 'Plan for your future with expert investment and retirement planning services. Our certified advisors create personalized strategies aligned with your financial goals and risk tolerance.', features: ['Investment Advisory', 'IRA Accounts', '401(k) Rollovers', 'Portfolio Management'] },
    { icon: Gift, title: 'Grants & Aid', desc: 'Access financial grants and aid programs to support your personal and business growth. We offer educational scholarships, small business development grants, and community support programs.', features: ['Education Grants', 'Business Development', 'Community Programs', 'Scholarship Funds'] },
  ];
  return (
    <section className="py-20 sm:py-28 page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader badge="Our Services" title="Comprehensive" highlight="Solutions" description="Everything you need to manage, grow, and protect your finances — all in one place." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc, features }) => (
            <div key={title} className="glass-card card-shine p-6 sm:p-8 flex flex-col gap-4 group">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Icon className="size-6" />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
              <ul className="space-y-1.5 mt-auto pt-2 border-t border-border/30">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="size-3 text-primary shrink-0" />{f}
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

// ═══ TOOLS PAGE ═══
function ToolsPage() {
  const [amt, setAmt] = useState([25000]);
  const [rate, setRate] = useState([12.49]);
  const [term, setTerm] = useState([36]);
  const mr = rate[0] / 100 / 12;
  const mo = mr > 0 ? (amt[0] * mr * Math.pow(1 + mr, term[0])) / (Math.pow(1 + mr, term[0]) - 1) : amt[0] / term[0];

  const rates: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, NGN: 1580, CAD: 1.37, AUD: 1.53, JPY: 149.5, CHF: 0.88, CNY: 7.24, INR: 83.1 };
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('NGN');
  const [v, setV] = useState('1000');
  const cr = (parseFloat(v) || 0) * (rates[to] / rates[from]);

  return (
    <section className="py-20 sm:py-28 page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader badge="Financial Tools" title="Smart" highlight="Tools" description="Plan your finances with our interactive calculators and converters." />
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Loan Calculator */}
          <Card className="glass-card card-shine border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Calculator className="w-5 h-5 text-primary" /> Loan Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Loan Amount</span>
                  <span className="text-primary font-bold">${amt[0].toLocaleString()}</span>
                </div>
                <Slider value={amt} onValueChange={setAmt} min={1000} max={500000} step={1000} />
                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>$1,000</span><span>$500,000</span></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Interest Rate</span>
                  <span className="text-primary font-bold">{rate[0]}%</span>
                </div>
                <Slider value={rate} onValueChange={setRate} min={1} max={30} step={0.1} />
                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1%</span><span>30%</span></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Loan Term</span>
                  <span className="text-primary font-bold">{term[0]} months</span>
                </div>
                <Slider value={term} onValueChange={setTerm} min={6} max={84} step={6} />
                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>6mo</span><span>84mo</span></div>
              </div>
              <div className="bg-primary/5 rounded-xl p-5 space-y-3 border border-primary/10">
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Monthly Payment</span><span className="text-xl font-bold text-primary">${mo.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Payment</span><span className="text-sm font-semibold">${(mo * term[0]).toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Interest</span><span className="text-sm font-semibold text-destructive">${(mo * term[0] - amt[0]).toFixed(2)}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Currency Converter */}
          <Card className="glass-card card-shine border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <ArrowRightLeft className="w-5 h-5 text-primary" /> Currency Converter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="text-sm font-medium">Amount</Label>
                <Input type="number" value={v} onChange={e => setV(e.target.value)} className="mt-1.5" />
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
                <div>
                  <Label className="text-sm font-medium">From</Label>
                  <Select value={from} onValueChange={setFrom}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.keys(rates).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <button
                  onClick={() => { const t = from; setFrom(to); setTo(t); }}
                  className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors mb-0.5"
                  aria-label="Swap currencies"
                >
                  <ArrowRightLeft className="w-4 h-4 text-primary" />
                </button>
                <div>
                  <Label className="text-sm font-medium">To</Label>
                  <Select value={to} onValueChange={setTo}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.keys(rates).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/10 text-center">
                <p className="text-sm text-muted-foreground mb-1">{parseFloat(v || '0').toLocaleString()} {from} =</p>
                <p className="text-2xl font-bold text-primary">{cr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}</p>
                <p className="text-xs text-muted-foreground mt-2">1 {from} = {(rates[to] / rates[from]).toFixed(4)} {to}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ═══ FAQ PAGE ═══
function FAQPage() {
  const faqs = [
    { q: 'How do I open an account?', a: 'Opening an account is easy and takes less than 5 minutes. Click "Open Account" on our homepage, fill in your details, verify your identity, and you are all set. No minimum balance required for checking accounts. The entire process is digital — no branch visit needed.' },
    { q: 'Is my money safe with CoreWealth?', a: 'Absolutely. All deposits are FDIC insured up to $250,000 per depositor. We use 256-bit SSL encryption for all transactions, and our systems are monitored 24/7 for security threats. We also offer multi-factor authentication and real-time fraud alerts for every account.' },
    { q: 'What are the current interest rates?', a: 'Our High-Yield Savings offers 4.25% APY, 18-Month Certificates at 4.10% APY, Credit Cards starting at 3.99% APR, and Personal Loans from 12.49% APR. Rates are subject to change — visit our Rates section for the most current information.' },
    { q: 'How do I contact customer support?', a: 'We offer 24/7 support through phone (1-800-BANKING), email (support@corewealth.com), and live chat on our website. You can also visit any of our 12 branch locations during business hours (Mon-Fri 9AM-5PM, Sat 9AM-1PM).' },
    { q: 'Does CoreWealth offer business banking?', a: 'Yes! We offer a full suite of business banking services including business checking and savings accounts, merchant services, payroll solutions, business credit lines, and commercial loans. Contact our business banking team for a personalized consultation.' },
    { q: 'Can I access my account from my phone?', a: 'Yes, CoreWealth offers a full-featured mobile app for both iOS and Android. You can check balances, transfer funds, deposit checks via mobile capture, pay bills, and manage your entire account from anywhere in the world.' },
    { q: 'What is the routing number for CoreWealth?', a: 'Our routing number is 251480576. You will need this for direct deposits, wire transfers, and automatic bill payments. It is also available on your checks and in your online banking dashboard under Account Details.' },
    { q: 'How do grants and aid programs work?', a: 'CoreWealth offers various financial grants and aid programs for education, small business development, and community projects. Eligibility varies by program. Applications are reviewed quarterly — contact us or visit the Grants section for current opportunities and deadlines.' },
  ];
  return (
    <section className="py-20 sm:py-28 page-enter">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader badge="FAQ" title="Frequently Asked" highlight="Questions" description="Find quick answers to the most common questions about CoreWealth banking services." />
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`f${i}`} className="glass-card border-0 data-[state=open]:glow-emerald-sm">
              <AccordionTrigger className="px-6 hover:no-underline hover:text-primary transition-colors text-left text-sm sm:text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-muted-foreground leading-relaxed text-sm">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// ═══ CONTACT PAGE ═══
function ContactPage() {
  const [sent, setSent] = useState(false);
  const contactCards = [
    { icon: MapPin, title: 'Visit Us', lines: ['123 Banking Street', 'Financial District', 'New York, NY 10001'] },
    { icon: Phone, title: 'Call Us', lines: ['1-800-BANKING', 'International: +1-555-0123'] },
    { icon: Mail, title: 'Email Us', lines: ['support@corewealth.com', 'Response within 24hrs'] },
    { icon: Clock, title: 'Banking Hours', lines: ['Mon-Fri: 9AM-5PM', 'Sat: 9AM-1PM', 'Sun: Closed'] },
  ];
  return (
    <section className="py-20 sm:py-28 page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader badge="Contact Us" title="Get In" highlight="Touch" description="Our team is ready to help you with any questions about your account or our services." />
        <div className="grid md:grid-cols-5 gap-8 sm:gap-10">
          <div className="md:col-span-3">
            <div className="glass-card p-6 sm:p-8">
              {sent ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">We will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div><Label>Full Name</Label><Input placeholder="John Doe" className="mt-1.5" required /></div>
                    <div><Label>Email</Label><Input type="email" placeholder="john@example.com" className="mt-1.5" required /></div>
                  </div>
                  <div><Label>Subject</Label><Input placeholder="How can we help?" className="mt-1.5" required /></div>
                  <div><Label>Message</Label><Textarea placeholder="Tell us more about your inquiry..." rows={5} className="mt-1.5" required /></div>
                  <button type="submit" className="btn-primary w-full">Send Message <Send className="w-4 h-4" /></button>
                </form>
              )}
            </div>
          </div>
          <div className="md:col-span-2 space-y-5">
            {contactCards.map(c => (
              <div key={c.title} className="glass-card p-5 flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{c.title}</h4>
                  {c.lines.map((l, i) => <p key={i} className="text-sm text-muted-foreground">{l}</p>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══ LOGIN PAGE ═══
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [show, setShow] = useState(false);
  return (
    <section className="py-20 sm:py-28 page-enter">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <LockIcon className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your CoreWealth account</p>
          </div>
          <form onSubmit={e => { e.preventDefault(); onLogin(); }} className="space-y-5">
            <div>
              <Label>Email Address</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="you@example.com" className="pl-10" required />
              </div>
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative mt-1.5">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type={show ? 'text' : 'password'} placeholder="Enter password" className="pl-10 pr-10" required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:underline">Forgot password?</a>
            </div>
            <button type="submit" className="btn-primary w-full">Sign In <ArrowRight className="w-4 h-4" /></button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{' '}
            <button onClick={() => {}} className="text-primary hover:underline font-medium">Open Account</button>
          </p>
        </div>
      </div>
    </section>
  );
}

// ═══ SIGNUP PAGE ═══
function SignupPage({ onSignup }: { onSignup: () => void }) {
  const [step, setStep] = useState(1);
  const [show, setShow] = useState(false);
  return (
    <section className="py-20 sm:py-28 page-enter">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="glass-card p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Open Your Account</h2>
            <p className="text-sm text-muted-foreground mt-1">Join 75,000+ members at CoreWealth</p>
          </div>
          <form onSubmit={e => { e.preventDefault(); if (step < 3) setStep(step + 1); else onSignup(); }} className="space-y-5">
            <div className="flex gap-2 mb-4">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
              ))}
            </div>
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>First Name</Label><Input placeholder="John" className="mt-1.5" required /></div>
                  <div><Label>Last Name</Label><Input placeholder="Doe" className="mt-1.5" required /></div>
                </div>
                <div><Label>Email</Label><Input type="email" placeholder="john@example.com" className="mt-1.5" required /></div>
                <div><Label>Phone</Label><Input type="tel" placeholder="(555) 123-4567" className="mt-1.5" required /></div>
              </>
            )}
            {step === 2 && (
              <>
                <div><Label>Date of Birth</Label><Input type="date" className="mt-1.5" required /></div>
                <div><Label>Address</Label><Input placeholder="123 Main Street" className="mt-1.5" required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>City</Label><Input placeholder="New York" className="mt-1.5" required /></div>
                  <div><Label>ZIP Code</Label><Input placeholder="10001" className="mt-1.5" required /></div>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div>
                  <Label>Account Type</Label>
                  <Select>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select account type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking Account</SelectItem>
                      <SelectItem value="savings">High-Yield Savings</SelectItem>
                      <SelectItem value="business">Business Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Password</Label>
                  <div className="relative mt-1.5">
                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type={show ? 'text' : 'password'} placeholder="Min 8 characters" className="pl-10 pr-10" required />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <label className="flex items-start gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" className="mt-1 rounded" required />
                  <span>I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a></span>
                </label>
              </>
            )}
            <div className="flex gap-3">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="btn-ghost flex-1">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              <button type="submit" className="btn-primary flex-1">
                {step < 3 ? 'Continue' : 'Create Account'} {step < 3 && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <button className="text-primary hover:underline font-medium">Sign In</button>
          </p>
        </div>
      </div>
    </section>
  );
}

// ═══ DASHBOARD PAGE ═══
function DashboardPage() {
  const txns = [
    { name: 'Direct Deposit - Salary', date: 'Jul 28, 2026', amount: 4500.00, type: 'credit' as const },
    { name: 'Amazon Purchase', date: 'Jul 27, 2026', amount: -89.99, type: 'debit' as const },
    { name: 'Netflix Subscription', date: 'Jul 26, 2026', amount: -15.99, type: 'debit' as const },
    { name: 'Transfer from Savings', date: 'Jul 25, 2026', amount: 1000.00, type: 'credit' as const },
    { name: 'Electric Bill Payment', date: 'Jul 24, 2026', amount: -142.50, type: 'debit' as const },
    { name: 'Freelance Payment', date: 'Jul 23, 2026', amount: 750.00, type: 'credit' as const },
    { name: 'Grocery Store', date: 'Jul 22, 2026', amount: -67.32, type: 'debit' as const },
  ];
  const accounts = [
    { label: 'Checking', value: '$12,450.80', change: '+$4,500', icon: Wallet, color: 'text-primary' },
    { label: 'Savings', value: '$28,340.25', change: '+$180.50', icon: PiggyBank, color: 'text-emerald-400' },
    { label: 'Credit Card', value: '$1,230.45', change: '-$89.99', icon: CreditCard, color: 'text-amber-400' },
    { label: 'Investments', value: '$45,120.00', change: '+$2,100', icon: BarChart3, color: 'text-sky-400' },
  ];
  const actions = [
    { icon: Send, label: 'Transfer' },
    { icon: Download, label: 'Deposit' },
    { icon: FileText, label: 'Pay Bills' },
    { icon: QrCode, label: 'Scan QR' },
  ];
  return (
    <section className="py-20 sm:py-28 page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Welcome back, <span className="gradient-text-animated">John</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Here is your account overview</p>
        </div>

        {/* Account Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {accounts.map(a => (
            <div key={a.label} className="glass-card card-shine p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{a.label}</span>
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <a.icon className={`w-4 h-4 ${a.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold">{a.value}</p>
              <p className={`text-xs mt-1 ${a.change.startsWith('+') ? 'text-emerald-400' : 'text-destructive'}`}>{a.change}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {actions.map(a => (
            <button key={a.label} className="glass-card p-4 flex flex-col items-center gap-2 hover:glow-emerald-sm transition-all text-sm font-medium">
              <a.icon className="w-5 h-5 text-primary" />{a.label}
            </button>
          ))}
        </div>

        {/* Transactions */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <button className="text-primary text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-1">
            {txns.map((t, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'credit' ? 'bg-emerald-500/10' : 'bg-destructive/10'}`}>
                    {t.type === 'credit' ? <ArrowDown className="w-4 h-4 text-emerald-400" /> : <ArrowUp className="w-4 h-4 text-destructive" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${t.type === 'credit' ? 'text-emerald-400' : ''}`}>
                  {t.type === 'credit' ? '+' : ''}{t.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══ CTA SECTION ═══
function CTASection({ onSignup }: { onSignup: () => void }) {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="float-orb float-orb-md" style={{ top: '10%', left: '25%' }} />
      <div className="float-orb float-orb-sm" style={{ bottom: '20%', right: '15%' }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-[family-name:var(--font-dm-sans)]">
          Ready to Experience <span className="gradient-text-animated">Premier Banking</span>?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
          Join 75,000+ members who trust CoreWealth for their financial future. Open your account today and discover the difference.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onSignup} className="btn-primary">Open Account Today <ArrowRight className="w-4 h-4" /></button>
          <button className="btn-ghost"><Phone className="w-4 h-4" /> Contact Us</button>
        </div>
      </div>
    </section>
  );
}

// ═══ MAIN ORCHESTRATOR ═══
export default function LandingPageClient() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { theme, setTheme } = useTheme();

  // Sync theme class
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

  const pageLabel = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

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
            <div className="section-divider" />
            <TestimonialsSection />
            <CTASection onSignup={() => handleNavigate('signup')} />
          </>
        )}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'services' && <ServicesPage />}
        {currentPage === 'tools' && <ToolsPage />}
        {currentPage === 'faq' && <FAQPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'login' && <LoginPage onLogin={() => handleNavigate('dashboard')} />}
        {currentPage === 'signup' && <SignupPage onSignup={() => handleNavigate('dashboard')} />}
        {currentPage === 'dashboard' && <DashboardPage />}
      </main>

      <Footer />
    </div>
  );
}
