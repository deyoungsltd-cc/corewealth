'use client';

import Link from 'next/link';

const companyLinks = ['About Us', 'Careers', 'Press', 'Blog'];
const productLinks = ['Checking', 'Savings', 'Cards', 'Investments', 'Wire Transfers'];
const legalLinks = ['Terms of Service', 'Privacy Policy', 'AML Policy', 'Cookie Policy'];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
      {children}
    </h3>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-gray-500 hover:text-[#7C3AED] transition-colors duration-200"
      >
        {children}
      </Link>
    </li>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#060A13] border-t border-gray-700/60">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Company */}
          <div>
            <SectionTitle>Company</SectionTitle>
            <ul className="flex flex-col gap-2.5">
              {companyLinks.map((l) => (
                <FooterLink key={l} href="#">{l}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <SectionTitle>Products</SectionTitle>
            <ul className="flex flex-col gap-2.5">
              {productLinks.map((l) => (
                <FooterLink key={l} href="#">{l}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <SectionTitle>Legal</SectionTitle>
            <ul className="flex flex-col gap-2.5">
              {legalLinks.map((l) => (
                <FooterLink key={l} href="#">{l}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <SectionTitle>Connect</SectionTitle>
            <div className="flex items-center gap-3">
              {/* Twitter/X */}
              <a href="#" aria-label="Twitter/X" className="text-gray-500 hover:text-[#7C3AED] transition-colors duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-[#7C3AED] transition-colors duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              {/* Telegram */}
              <a href="#" aria-label="Telegram" className="text-gray-500 hover:text-[#7C3AED] transition-colors duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700/60">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} CoreWealth Bank. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <span>Member FDIC</span>
            <span className="text-gray-700">|</span>
            <span>Equal Housing Lender</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
