import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login - CoreWealth Bank',
  robots: 'noindex, nofollow',
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-white">
      {children}
    </div>
  );
}
