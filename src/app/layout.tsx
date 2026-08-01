import type { Metadata, Viewport } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoreWealth Bank | Premier Digital Banking",
  description: "Experience banking reimagined. Secure digital banking with competitive rates, 24/7 support, and innovative financial solutions. Your trusted partner for growth.",
  keywords: ["CoreWealth", "digital banking", "online bank", "savings account", "loans", "credit cards", "business banking", "wealth management", "secure banking"],
  openGraph: {
    title: "CoreWealth Bank | Premier Digital Banking",
    description: "Secure digital banking with competitive rates and innovative financial solutions.",
    siteName: "CoreWealth Bank",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CoreWealth Bank | Premier Digital Banking",
    description: "Secure digital banking with competitive rates and innovative financial solutions.",
  },
  icons: {
    icon: "/favicon.svg",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable} dark`} suppressHydrationWarning>
      <body className="min-h-full min-h-[100dvh] bg-background text-foreground overflow-x-hidden antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}