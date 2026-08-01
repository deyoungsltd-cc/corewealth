import { type Metadata } from 'next';
import LandingPageClient from './LandingPageClient';

export const metadata: Metadata = {
  title: 'CoreWealth Bank | Premier Digital Banking',
  description: 'Experience banking reimagined. Secure digital banking with competitive rates, 24/7 support, and innovative financial solutions.',
  keywords: ['digital banking', 'online bank', 'savings', 'loans', 'credit cards', 'business banking'],
};

export default function LandingPage() {
  return <LandingPageClient />;
}
