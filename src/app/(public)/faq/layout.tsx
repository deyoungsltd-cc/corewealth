import { Metadata } from 'next';

export const metadata: Metadata = { title: 'FAQ | CoreWealth Bank', description: 'Frequently asked questions about CoreWealth Bank investment platform.' };

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
