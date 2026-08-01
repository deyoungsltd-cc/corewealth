import { Metadata } from 'next';

export const metadata: Metadata = { title: 'How to Invest | CoreWealth Bank', description: 'Step-by-step guide on how to start investing with CoreWealth Bank.' };

export default function HowToInvestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
