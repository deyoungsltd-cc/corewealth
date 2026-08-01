'use client';

import {
  TrendingUp,
  ArrowLeftRight,
  Globe,
  Building2,
  Landmark,
  Car,
  User,
  Home,
  PiggyBank,
  Wallet,
  Lock,
  Newspaper,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
} from 'lucide-react';

/* ─── Interest Rate Data ─── */
const depositRates = [
  {
    account: 'Interest Checking',
    apy: 0.50,
    minBalance: '$0',
    icon: Wallet,
    description: 'No minimum balance required',
  },
  {
    account: 'High-Yield Savings',
    apy: 4.75,
    minBalance: '$1,000',
    icon: PiggyBank,
    description: 'Tiered rates, compounded daily',
  },
  {
    account: 'Money Market',
    apy: 5.10,
    minBalance: '$10,000',
    icon: Landmark,
    description: 'Limited withdrawals, check writing',
  },
  {
    account: '6-Month CD',
    apy: 4.90,
    minBalance: '$500',
    icon: Lock,
    description: 'Fixed rate, early withdrawal penalty',
  },
  {
    account: '12-Month CD',
    apy: 5.25,
    minBalance: '$500',
    icon: Lock,
    description: 'Fixed rate, compounded monthly',
  },
  {
    account: '24-Month CD',
    apy: 5.40,
    minBalance: '$500',
    icon: Lock,
    description: 'Best for long-term savings goals',
  },
];

/* ─── Currency Exchange Rates ─── */
const exchangeRates = [
  { pair: 'USD / EUR', flag: '🇪🇺', buy: 0.9218, sell: 0.9256, change: -0.12 },
  { pair: 'USD / GBP', flag: '🇬🇧', buy: 0.7891, sell: 0.7934, change: +0.08 },
  { pair: 'USD / JPY', flag: '🇯🇵', buy: 149.82, sell: 150.18, change: +0.34 },
  { pair: 'USD / CHF', flag: '🇨🇭', buy: 0.8812, sell: 0.8847, change: -0.05 },
  { pair: 'USD / CAD', flag: '🇨🇦', buy: 1.3645, sell: 1.3689, change: +0.15 },
  { pair: 'USD / AUD', flag: '🇦🇺', buy: 1.5321, sell: 1.5370, change: -0.22 },
  { pair: 'EUR / GBP', flag: '🇪🇺', buy: 0.8559, sell: 0.8602, change: +0.03 },
  { pair: 'USD / CNY', flag: '🇨🇳', buy: 7.2456, sell: 7.2601, change: -0.09 },
];

/* ─── Lending Rates ─── */
const lendingRates = [
  {
    type: '30-Year Fixed Mortgage',
    rate: 6.875,
    apr: 7.024,
    icon: Home,
    points: 0.75,
    description: 'Primary residence, conventional',
  },
  {
    type: '15-Year Fixed Mortgage',
    rate: 6.250,
    apr: 6.412,
    icon: Home,
    points: 0.50,
    description: 'Primary residence, conventional',
  },
  {
    type: '5/1 ARM Mortgage',
    rate: 6.125,
    apr: 7.350,
    icon: Building2,
    points: 0.25,
    description: 'Adjustable after 5 years',
  },
  {
    type: 'New Auto Loan (60 mo)',
    rate: 5.49,
    apr: 5.72,
    icon: Car,
    points: 0,
    description: 'New vehicles, excellent credit',
  },
  {
    type: 'Used Auto Loan (60 mo)',
    rate: 6.25,
    apr: 6.48,
    icon: Car,
    points: 0,
    description: 'Model years 2019 or newer',
  },
  {
    type: 'Personal Loan',
    rate: 8.99,
    apr: 9.24,
    icon: User,
    points: 0,
    description: 'Unsecured, 12–60 month terms',
  },
];

/* ─── Banking & Finance News ─── */
const newsArticles = [
  {
    title: 'Federal Reserve Signals Potential Rate Cut in Upcoming September Meeting',
    source: 'Reuters',
    time: '1 hour ago',
    sentiment: 'bullish',
    summary:
      'Fed Chair indicated that cooling inflation data could pave the way for a 25-basis-point rate reduction, marking the first cut since the tightening cycle began in 2022.',
  },
  {
    title: 'JPMorgan Reports Record Q2 Profit Driven by Investment Banking Surge',
    source: 'Bloomberg',
    time: '3 hours ago',
    sentiment: 'bullish',
    summary:
      'JPMorgan Chase posted a net income of $18.1 billion for Q2, a 25% increase year-over-year, fueled by a resurgence in M&A advisory and equity underwriting fees.',
  },
  {
    title: 'FDIC Proposes Stricter Capital Requirements for Mid-Size Regional Banks',
    source: 'Financial Times',
    time: '5 hours ago',
    sentiment: 'neutral',
    summary:
      'The FDIC unveiled a new proposal requiring banks with assets between $100B and $250B to maintain higher capital buffers, drawing mixed reactions from industry groups.',
  },
  {
    title: 'U.S. 10-Year Treasury Yield Drops Below 4.2% on Soft Landing Optimism',
    source: 'Wall Street Journal',
    time: '7 hours ago',
    sentiment: 'bullish',
    summary:
      'Treasury yields fell sharply after better-than-expected jobless claims data reinforced expectations that the economy is cooling without entering a recession.',
  },
  {
    title: 'Commercial Real Estate Lending Tightens as Banks Increase Loss Provisions',
    source: 'CNBC',
    time: '10 hours ago',
    sentiment: 'bearish',
    summary:
      'Major U.S. banks have collectively set aside an additional $4.2 billion in loan-loss reserves tied to office and retail property exposure, signaling growing caution in the sector.',
  },
  {
    title: 'European Central Bank Holds Rates Steady, Cautions on Inflation Outlook',
    source: 'MarketWatch',
    time: '14 hours ago',
    sentiment: 'neutral',
    summary:
      'The ECB kept its benchmark deposit rate at 3.75% but warned that services inflation remains "stubbornly above target," leaving the door open for future hikes if conditions worsen.',
  },
];

/* ─── Helper: format decimal rate ─── */
function fmtRate(val: number, decimals = 2): string {
  return val.toFixed(decimals);
}

export default function MarketPage() {
  return (
    <div className="space-y-6 -mx-4 px-4 pb-4">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-foreground font-bold text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#7C3AED]" />
          Markets and Rates
        </h1>
        <p className="text-muted-foreground text-xs mt-0.5">
          Interest rates, currency exchange, and market news — updated daily
        </p>
      </div>

      {/* ════════════════════════════════════════════
          SECTION A – Deposit Interest Rates
         ════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Percent className="w-4 h-4 text-[#7C3AED]" />
          <h2 className="text-foreground font-semibold text-sm">Deposit Interest Rates</h2>
        </div>

        <div className="glass-card border border-border rounded-2xl overflow-hidden">
          {/* Desktop table header (hidden on mobile) */}
          <div className="hidden sm:grid sm:grid-cols-4 gap-4 px-4 py-2.5 bg-muted/60 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground border-b border-border">
            <span>Account Type</span>
            <span className="text-right">APY</span>
            <span className="text-right">Min. Balance</span>
            <span className="text-right">Details</span>
          </div>

          {depositRates.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.account}
                className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center px-4 py-3.5 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                {/* Account name + icon */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#7C3AED]" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.account}</span>
                </div>

                {/* APY */}
                <div className="sm:text-right pl-10 sm:pl-0">
                  <span className="text-sm font-bold text-[#7C3AED]">{fmtRate(item.apy)}%</span>
                  <span className="text-[10px] text-muted-foreground ml-1">APY</span>
                </div>

                {/* Min balance */}
                <div className="sm:text-right">
                  <span className="text-sm text-foreground/80">{item.minBalance}</span>
                </div>

                {/* Description */}
                <div className="hidden sm:block text-right">
                  <span className="text-[11px] text-muted-foreground">{item.description}</span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-muted-foreground mt-2 ml-1">
          Rates effective as of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. APY = Annual Percentage Yield. Fees may reduce earnings.
        </p>
      </section>

      {/* ════════════════════════════════════════════
          SECTION B – Currency Exchange Rates
         ════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-[#7C3AED]" />
          <h2 className="text-foreground font-semibold text-sm">Currency Exchange Rates</h2>
        </div>

        <div className="glass-card border border-border rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="hidden sm:grid sm:grid-cols-4 gap-4 px-4 py-2.5 bg-muted/60 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground border-b border-border">
            <span>Currency Pair</span>
            <span className="text-right">We Buy</span>
            <span className="text-right">We Sell</span>
            <span className="text-right">Change</span>
          </div>

          {exchangeRates.map((item) => {
            const isUp = item.change >= 0;
            return (
              <div
                key={item.pair}
                className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                {/* Pair */}
                <div className="flex items-center gap-2.5">
                  <span className="text-lg leading-none">{item.flag}</span>
                  <div>
                    <span className="text-sm font-medium text-foreground">{item.pair}</span>
                  </div>
                </div>

                {/* Buy */}
                <div className="sm:text-right pl-8 sm:pl-0">
                  <span className="text-sm text-foreground/90 font-mono">{fmtRate(item.buy, item.buy > 10 ? 2 : 4)}</span>
                </div>

                {/* Sell */}
                <div className="sm:text-right">
                  <span className="text-sm text-foreground/90 font-mono">{fmtRate(item.sell, item.sell > 10 ? 2 : 4)}</span>
                </div>

                {/* Change */}
                <div className="sm:text-right">
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                      isUp ? 'text-emerald-500' : 'text-red-500'
                    }`}
                  >
                    {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {isUp ? '+' : ''}
                    {fmtRate(item.change)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-muted-foreground mt-2 ml-1">
          <ArrowLeftRight className="w-3 h-3 inline mr-0.5 -mt-0.5" />
          Rates are indicative and subject to change. Spread applies to conversions over $5,000.
        </p>
      </section>

      {/* ════════════════════════════════════════════
          SECTION D – Lending Rates
         ════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Landmark className="w-4 h-4 text-[#7C3AED]" />
          <h2 className="text-foreground font-semibold text-sm">Lending Rates</h2>
        </div>

        <div className="glass-card border border-border rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="hidden sm:grid sm:grid-cols-4 gap-4 px-4 py-2.5 bg-muted/60 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground border-b border-border">
            <span>Loan Type</span>
            <span className="text-right">Rate</span>
            <span className="text-right">APR</span>
            <span className="text-right">Points</span>
          </div>

          {lendingRates.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.type}
                className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center px-4 py-3.5 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                {/* Loan type + icon */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#7C3AED]" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">{item.type}</span>
                    <p className="text-[10px] text-muted-foreground sm:hidden mt-0.5">{item.description}</p>
                  </div>
                </div>

                {/* Rate */}
                <div className="sm:text-right pl-10 sm:pl-0">
                  <span className="text-sm font-bold text-foreground">{fmtRate(item.rate, 3)}%</span>
                </div>

                {/* APR */}
                <div className="sm:text-right">
                  <span className="text-sm text-foreground/80 font-mono">{fmtRate(item.apr, 3)}%</span>
                  <span className="text-[10px] text-muted-foreground ml-1">APR</span>
                </div>

                {/* Points / Description */}
                <div className="hidden sm:block sm:text-right">
                  <span className="text-sm text-foreground/80">
                    {item.points > 0 ? `${item.points} pts` : '0 pts'}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-muted-foreground mt-2 ml-1">
          Rates shown are for well-qualified borrowers. Actual rates may vary based on creditworthiness, loan-to-value, and other factors.
        </p>
      </section>

      {/* ════════════════════════════════════════════
          SECTION C – Market News
         ════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Newspaper className="w-4 h-4 text-[#7C3AED]" />
          <h2 className="text-foreground font-semibold text-sm">Market News</h2>
        </div>

        <div className="space-y-3">
          {newsArticles.map((article, i) => (
            <article
              key={i}
              className="glass-card border border-border rounded-xl p-4 hover:border-[#7C3AED]/20 transition-colors"
            >
              {/* Meta row */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[#7C3AED] text-[10px] font-bold">{article.source}</span>
                <span className="text-muted-foreground/50 text-[10px]">·</span>
                <span className="text-muted-foreground text-[10px]">{article.time}</span>
                <span
                  className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    article.sentiment === 'bullish'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : article.sentiment === 'bearish'
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {article.sentiment.toUpperCase()}
                </span>
              </div>

              {/* Title */}
              <h4 className="text-sm font-semibold text-foreground leading-snug mb-1.5">
                {article.title}
              </h4>

              {/* Summary */}
              <p className="text-xs text-muted-foreground leading-relaxed">{article.summary}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="text-center pt-3 pb-2">
        <p className="text-muted-foreground/60 text-[10px]">
          &copy; {new Date().getFullYear()} CoreWealth Bank. All rights reserved.
        </p>
        <p className="text-muted-foreground/40 text-[9px] mt-0.5">
          Rates and data are for informational purposes only and do not constitute an offer.
        </p>
      </footer>
    </div>
  );
}
