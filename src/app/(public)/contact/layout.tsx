import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Contact Us | CoreWealth Bank', description: 'Get in touch with CoreWealth Bank support team.' };

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
