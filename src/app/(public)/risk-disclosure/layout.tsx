import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Risk Disclosure | CoreWealth Bank', description: 'CoreWealth Bank risk disclosure — understand the risks before investing.' };

export default function RiskLayout({ children }: { children: React.ReactNode }) {
  return children;
}
