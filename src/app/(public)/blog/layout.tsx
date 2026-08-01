import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | CoreWealth Bank',
  description: 'Investment insights, market analysis, and financial education from CoreWealth Bank.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
