import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | CoreWealth Bank',
  description: 'Learn about CoreWealth Bank — our mission, team, and commitment to investor success.'
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
