'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Diamond, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';

const NAV_LINKS = ['Home', 'About', 'Services', 'Tools', 'Contact'] as const;

const PAGE_MAP: Record<string, string> = {
  'Home': 'home', 'About': 'about', 'Services': 'services',
  'Tools': 'tools', 'Contact': 'contact', 'FAQ': 'faq',
  'Login': 'login', 'Open Account': 'signup', 'Dashboard': 'dashboard',
};

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function useScrolled(threshold = 10) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      window.addEventListener('scroll', onStoreChange, { passive: true });
      return () => window.removeEventListener('scroll', onStoreChange);
    },
    [],
  );

  const getSnapshot = useCallback(() => window.scrollY > threshold, [threshold]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(PAGE_MAP[page] || page.toLowerCase());
    setMobileOpen(false);
  };

  const isDark = theme === 'dark';

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        bg-background/80 backdrop-blur-xl border-b border-border/50
        transition-all duration-500 ease-out
        ${scrolled
          ? 'shadow-[0_1px_30px_rgba(16,185,129,0.08)] border-primary/20'
          : ''
        }
      `}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => handleNav('Home')}
          className="flex items-center gap-2 group transition-opacity hover:opacity-90"
          aria-label="CoreWealth Home"
        >
          <Diamond className="size-5 text-primary fill-primary/20 transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-[family-name:var(--font-dm-sans)] text-xl font-bold tracking-tight text-foreground">
            Vault<span className="text-primary">Edge</span>
          </span>
        </button>

        {/* Center Nav Links (desktop) */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = currentPage === link;
            return (
              <li key={link}>
                <button
                  onClick={() => handleNav(link)}
                  className={`
                    relative px-4 py-2 text-sm font-medium rounded-lg
                    transition-all duration-200
                    ${active
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  {link}
                  {active && (
                    <span className="absolute inset-x-2 -bottom-[9px] h-0.5 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right Side (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="
                flex size-9 items-center justify-center rounded-lg
                text-muted-foreground hover:text-foreground
                hover:bg-accent/50
                transition-all duration-200
              "
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="size-[18px]" />
              ) : (
                <Moon className="size-[18px]" />
              )}
            </button>
          )}

          <Button
            variant="ghost"
            className="btn-ghost h-9 px-4 text-sm"
            onClick={() => handleNav('Login')}
          >
            Login
          </Button>

          <Button
            className="btn-primary h-9 px-5 text-sm"
            onClick={() => handleNav('Open Account')}
          >
            Open Account
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="
                flex size-9 items-center justify-center rounded-lg
                text-muted-foreground hover:text-foreground
                hover:bg-accent/50
                transition-all duration-200
              "
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="size-[18px]" />
              ) : (
                <Moon className="size-[18px]" />
              )}
            </button>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background/95 backdrop-blur-xl border-l border-border/50 p-0">
              <SheetHeader className="px-6 pt-6 pb-2">
                <SheetTitle className="flex items-center gap-2">
                  <Diamond className="size-4 text-primary fill-primary/20" />
                  <span className="font-[family-name:var(--font-dm-sans)] text-lg font-bold tracking-tight">
                    Vault<span className="text-primary">Edge</span>
                  </span>
                </SheetTitle>
              </SheetHeader>

              <Separator className="bg-border/50" />

              <div className="flex flex-col gap-1 px-3 py-4">
                {NAV_LINKS.map((link) => {
                  const active = currentPage === link;
                  return (
                    <button
                      key={link}
                      onClick={() => handleNav(link)}
                      className={`
                        flex items-center rounded-lg px-4 py-3 text-sm font-medium
                        transition-all duration-200
                        ${active
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                        }
                      `}
                    >
                      {link}
                      {active && (
                        <span className="ml-auto size-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                      )}
                    </button>
                  );
                })}
              </div>

              <Separator className="bg-border/50" />

              <div className="flex flex-col gap-3 px-6 py-5">
                <Button
                  variant="ghost"
                  className="btn-ghost w-full h-11 text-sm"
                  onClick={() => handleNav('Login')}
                >
                  Login
                </Button>
                <Button
                  className="btn-primary w-full h-11 text-sm"
                  onClick={() => handleNav('Open Account')}
                >
                  Open Account
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
