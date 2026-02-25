import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { navItems } from '@/data/content';
import { cn } from '@/lib/utils';

interface HeaderProps {
  currentPage?: string;
  isAdminLoggedIn?: boolean;
  onOpenAdmin?: () => void;
}

export function Header({
  currentPage = 'home',
  isAdminLoggedIn = false,
  onOpenAdmin,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-300 bg-[rgb(244,243,238)]/95 backdrop-blur-sm">
      <div className="site-shell bg-[rgb(244,243,238)]">
        <div
          className={cn(
            'grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-4 sm:px-6 lg:grid-cols-[320px_1fr_auto] lg:px-8',
            isScrolled ? 'text-zinc-900' : 'text-zinc-900'
          )}
        >
          {/* Logo */}
          <a
            href="/"
            className="inline-flex items-center"
          >
            <span className="text-[15px] font-semibold tracking-[0.01em]">
              Archive of Gyuyoung Park
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'text-[13px] font-medium tracking-[0.08em] transition-colors',
                  currentPage === item.href.slice(1)
                    ? 'text-black'
                    : 'text-zinc-600 hover:text-black'
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 justify-self-end">
            <button
              onClick={onOpenAdmin}
              className={cn(
                'hidden border px-3 py-1.5 text-xs tracking-[0.08em] md:block',
                isAdminLoggedIn
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-300 bg-white text-zinc-700 hover:text-black'
              )}
            >
              ADMIN
            </button>

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="grid h-8 w-8 place-items-center border border-zinc-300 bg-white text-zinc-700 transition-colors hover:text-black"
              aria-label="검색"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="grid h-8 w-8 place-items-center border border-zinc-300 bg-white text-zinc-700 transition-colors hover:text-black md:hidden"
              aria-label="메뉴"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={cn(
            'overflow-hidden border-t border-zinc-300 transition-all duration-300',
            isSearchOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="relative px-4 py-4 sm:px-6 lg:px-8">
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              className="w-full border border-zinc-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
            />
            <Search className="absolute right-8 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'site-shell border-t border-zinc-300 bg-white transition-all duration-300 md:hidden',
          isMobileMenuOpen
            ? 'max-h-64 opacity-100'
            : 'max-h-0 opacity-0 pointer-events-none'
        )}
      >
        <nav className="space-y-1 px-4 py-4">
          <button
            onClick={onOpenAdmin}
            className={cn(
              'mb-2 block w-full border px-3 py-2 text-left text-xs tracking-[0.08em]',
              isAdminLoggedIn
                ? 'border-zinc-900 bg-zinc-900 text-white'
                : 'border-zinc-300 text-zinc-700'
            )}
          >
            ADMIN
          </button>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'block border-b border-zinc-200 py-2 text-sm font-medium transition-colors',
                currentPage === item.href.slice(1)
                  ? 'text-black'
                  : 'text-zinc-600 hover:text-black'
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

