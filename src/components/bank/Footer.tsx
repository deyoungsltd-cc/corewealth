'use client';

import { Diamond, Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Shield, Lock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="mt-auto">
      {/* Top divider */}
      <div className="section-divider" />

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Column 1: Brand & Social */}
          <div className="sm:col-span-2 lg:col-span-1">
            <button className="flex items-center gap-2 group mb-4">
              <Diamond className="size-5 text-primary fill-primary/20 transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-[family-name:var(--font-dm-sans)] text-xl font-bold tracking-tight text-foreground">
                Vault<span className="text-primary">Edge</span>
              </span>
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Empowering your financial future with innovative digital banking and unwavering commitment to security.
            </p>
            <div className="flex items-center gap-2">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Linkedin, label: 'LinkedIn' },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="
                    flex size-9 items-center justify-center rounded-lg
                    text-muted-foreground
                    hover:text-primary hover:bg-primary/10
                    transition-all duration-200
                  "
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {['About Us', 'Services', 'Loans & Credit', 'Contact'].map((link) => (
                <li key={link}>
                  <button className="
                    text-sm text-muted-foreground
                    hover:text-primary
                    transition-colors duration-200
                    text-left
                  ">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Services
            </h3>
            <ul className="flex flex-col gap-2.5">
              {['Personal Banking', 'Business Banking', 'Cards', 'Wealth Management'].map((link) => (
                <li key={link}>
                  <button className="
                    text-sm text-muted-foreground
                    hover:text-primary
                    transition-colors duration-200
                    text-left
                  ">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Contact
            </h3>
            <ul className="flex flex-col gap-3.5">
              <li className="flex items-start gap-2.5">
                <MapPin className="size-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  123 Banking Street, Financial District, New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">1-800-BANKING</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">support@corewealth.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <Separator className="bg-border/50" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 CoreWealth Bank. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="size-3 text-primary" />
              FDIC Insured
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3 text-primary" />
              256-bit SSL
            </span>
            <button className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
              Privacy Policy
            </button>
            <button className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
