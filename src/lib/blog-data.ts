export type Metadata = {
  title: string;
  description: string;
};

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorAvatar: string;
  coverImage: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-start-investing-in-2024',
    title: 'How to Start Investing in 2024: A Complete Guide',
    excerpt: 'Everything you need to know about getting started with investing, from setting goals to choosing the right strategy.',
    content: 'Investing in 2024 offers more opportunities than ever before. Whether you are a complete beginner or looking to diversify your existing portfolio, understanding the fundamentals is crucial.\n\n## Setting Your Investment Goals\n\nBefore you invest a single dollar, you need to define what you are trying to achieve. Are you saving for retirement? Building wealth? Generating passive income? Your goals will determine your investment strategy.\n\n## Understanding Risk vs. Reward\n\nAll investments carry some level of risk. Higher potential returns typically come with higher volatility. The key is finding the right balance that matches your risk tolerance and financial situation.\n\n## Why Managed Portfolios Work\n\nFor most investors, professionally managed portfolios offer the best risk-adjusted returns. Fund managers have access to research, tools, and strategies that individual investors simply cannot match.\n\n## Getting Started with CoreWealth Bank\n\n1. Create your free account in under 2 minutes\n2. Choose an investment plan that matches your goals\n3. Fund your account via bank transfer or wire\n4. Watch your capital grow with competitive returns\n\nThe minimum investment is just $500, making it accessible to anyone looking to start their wealth-building journey.',
    category: 'Getting Started',
    author: 'CoreWealth Bank',
    authorAvatar: '',
    coverImage: '',
    publishedAt: '2024-01-15',
    readTime: 6,
    tags: ['beginner', 'guide', 'investing'],
  },
  {
    slug: 'understanding-interest-rates',
    title: 'Understanding Interest Rates: How They Impact Your Savings',
    excerpt: 'A comprehensive look at how interest rates work and why they matter for your savings and investment strategy.',
    content: 'Interest rates are one of the most important concepts in personal finance. They affect everything from your savings account returns to the cost of borrowing.\n\n## How Interest Rates Work\n\nAn interest rate is essentially the cost of borrowing money or the reward for saving it. When you deposit money in a savings account, the bank pays you interest. When you take a loan, you pay interest to the lender.\n\n## The Federal Reserve and You\n\nThe Federal Reserve sets the benchmark interest rate that influences rates across the entire economy. When the Fed raises rates, savings account yields typically increase, which is good news for savers.\n\n## CoreWealth Bank Savings Rates\n\nOur High-Yield Savings account currently offers 4.75% APY, significantly above the national average. Money Market accounts earn 5.10% APY, and our CD rates range from 4.50% to 5.25% depending on term length.\n\n## Tips for Maximizing Returns\n\n1. Ladder your CDs for flexibility and yield\n2. Keep an emergency fund in a high-yield savings account\n3. Consider money market accounts for larger balances\n4. Reinvest interest payments to benefit from compounding',
    category: 'Education',
    author: 'CoreWealth Bank',
    authorAvatar: '',
    coverImage: '',
    publishedAt: '2024-02-20',
    readTime: 8,
    tags: ['interest-rates', 'savings', 'education'],
  },
  {
    slug: 'digital-banking-security-tips',
    title: '5 Digital Banking Security Tips Every Customer Should Know',
    excerpt: 'Protecting your financial assets online is critical. Here are essential security practices for digital banking.',
    content: 'As digital banking becomes the norm, protecting your financial information is more important than ever. Here are five essential security practices.\n\n## 1. Use Strong, Unique Passwords\n\nNever reuse passwords across financial accounts. Use a password manager to generate and store complex passwords. Enable two-factor authentication wherever possible.\n\n## 2. Monitor Your Accounts Regularly\n\nCheck your transaction history daily. Set up account alerts for large transactions or balance changes. Early detection is the best defense against unauthorized access.\n\n## 3. Beware of Phishing Attempts\n\nCoreWealth Bank will never ask for your password via email or phone. Verify the sender address before clicking any links. When in doubt, navigate directly to corewealthbank.com.\n\n## 4. Keep Your Devices Secure\n\nInstall operating system updates promptly. Use biometric authentication on your banking app. Avoid accessing your accounts on public Wi-Fi networks.\n\n## 5. Complete Identity Verification\n\nComplete your KYC verification to unlock higher transaction limits and additional security features. Verified accounts also receive priority fraud monitoring and faster dispute resolution.',
    category: 'Security',
    author: 'CoreWealth Bank',
    authorAvatar: '',
    coverImage: '',
    publishedAt: '2024-03-10',
    readTime: 5,
    tags: ['security', 'banking', 'tips'],
  },
  {
    slug: 'wealth-building-strategies',
    title: 'Wealth Building Strategies for Long-Term Financial Success',
    excerpt: 'Learn proven strategies for building lasting wealth through smart saving, investing, and financial planning.',
    content: 'Building lasting wealth requires a combination of discipline, strategy, and patience. Here are proven approaches that work.\n\n## The Foundation: Emergency Fund First\n\nBefore investing, build an emergency fund covering 3-6 months of expenses. Keep this in a high-yield savings account where it earns interest but remains accessible.\n\n## Dollar-Cost Averaging\n\nInstead of timing the market, invest a fixed amount regularly. This approach reduces the impact of volatility and removes emotional decision-making from your investment strategy.\n\n## Diversification Matters\n\nSpread your investments across different asset classes, sectors, and geographies. CoreWealth Bank investment plans are managed by professionals who employ institutional-grade diversification strategies.\n\n## The Power of Compounding\n\nAlbert Einstein reportedly called compound interest the eighth wonder of the world. Reinvesting your returns allows your earnings to generate their own earnings, creating exponential growth over time.\n\n## Regular Review and Rebalancing\n\nReview your financial plan quarterly. Rebalance your portfolio as needed to maintain your target asset allocation. Adjust your strategy as your goals and circumstances evolve.',
    category: 'Strategy',
    author: 'CoreWealth Bank',
    authorAvatar: '',
    coverImage: '',
    publishedAt: '2024-04-05',
    readTime: 6,
    tags: ['wealth', 'strategy', 'planning'],
  },
  {
    slug: 'international-wire-transfers-guide',
    title: 'Complete Guide to International Wire Transfers',
    excerpt: 'Everything you need to know about sending and receiving international wire transfers with CoreWealth Bank.',
    content: 'International wire transfers are a core banking service for individuals and businesses with global financial needs. Here is what you need to know.\n\n## What Is a Wire Transfer?\n\nA wire transfer is an electronic transfer of funds across a network administered by banks and transfer service agencies. Wire transfers are fast, secure, and can be sent domestically or internationally.\n\n## CoreWealth Bank Wire Transfer Process\n\n1. Log into your dashboard and navigate to Wire Transfer\n2. Enter the recipient banking details (SWIFT/BIC, IBAN, account number)\n3. Specify the amount and currency\n4. Review exchange rates and fees\n5. Confirm and submit\n\n## Fees and Processing Times\n\nCoreWealth Bank offers competitive wire transfer fees. Domestic wires typically process within 1 business day, while international wires arrive in 1-3 business days depending on the destination country.\n\n## Tips for Smooth Transfers\n\n- Double-check all recipient details before submitting\n- Ensure you have sufficient funds including the transfer fee\n- Keep your transaction confirmation for your records\n- Contact support immediately if a transfer is delayed beyond the expected timeframe',
    category: 'Banking',
    author: 'CoreWealth Bank',
    authorAvatar: '',
    coverImage: '',
    publishedAt: '2024-05-12',
    readTime: 5,
    tags: ['wire-transfer', 'international', 'banking'],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const post = getPostBySlug(slug);
  if (!post) return [];
  return blogPosts
    .filter((p) => p.slug !== slug)
    .filter((p) => p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
    .slice(0, limit);
}
