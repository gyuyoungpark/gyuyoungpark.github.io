import { useEffect, useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { navItems } from '@/data/content';
import { cn } from '@/lib/utils';

const externalLinks = [
  {
    label: 'Google Scholar',
    href: 'https://scholar.google.com/citations?hl=ko&user=FAUWfAcAAAAJ&view_op=list_works&gmla=AF9nlQvJrWhyl6o1in1SHv1pwOSVAFzstBQmA_TVy1hyu2VlShOcVhT_8fFTrLUzmC5pC1ZqmcwTh-SyRTGsOYVMXFCDO6cCduIz3_3aHuFtUgbO2-Ql5D2rFQ',
    icon: '/download/Google_Scholar_logo.svg',
  },
  {
    label: 'ORCID',
    href: 'https://orcid.org/my-orcid?orcid=0009-0001-8492-4299',
    icon: '/download/ORCID_iD.svg',
  },
  {
    label: 'ResearchGate',
    href: 'https://www.researchgate.net/profile/Gyuyoung-Park-2',
    icon: '/download/ResearchGate_icon_SVG.svg',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/gyuyoungpark',
    icon: '/download/github_logo.svg',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/gyuyoungpark/',
    icon: '/download/LinkedIn_icon.svg',
  },
];

export function Header() {
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
    <header className="site-header sticky top-0 z-50 backdrop-blur-sm">
      <div className="site-shell">
        <div
          className={cn(
            'grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-4 sm:px-6 lg:grid-cols-[320px_auto_1fr] lg:px-8',
            isScrolled ? 'text-zinc-900' : 'text-zinc-900'
          )}
        >
          <a href="#top" className="inline-flex items-center">
            <span className="text-[20px] font-semibold tracking-[0.01em] lg:text-[24px]">Archive of Gyuyoung Park</span>
          </a>

          <nav className="hidden items-center gap-4 justify-self-start lg:ml-8 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[14px] font-semibold tracking-[0.02em] text-zinc-700 transition-colors hover:text-black lg:text-[16px]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-self-end">
            <div className="mr-4 hidden items-center gap-2 lg:flex">
              {externalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-8 w-8 place-items-center transition-colors hover:opacity-85"
                  aria-label={link.label}
                  title={link.label}
                >
                  <img src={link.icon} alt={link.label} className="h-8 w-8 object-contain" />
                </a>
              ))}
            </div>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="grid h-8 w-8 place-items-center rounded-full border border-zinc-300 bg-white text-zinc-700 transition-colors hover:text-black"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-2 grid h-8 w-8 place-items-center border border-zinc-300 bg-white text-zinc-700 transition-colors hover:text-black lg:hidden"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div
          className={cn(
            'overflow-hidden border-t border-zinc-300 transition-all duration-300',
            isSearchOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <input
              type="text"
              placeholder="Type to search..."
              className="w-full rounded-full bg-[#f8f7f2] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
            />
          </div>
        </div>
      </div>

      <div
        className={cn(
          'site-shell border-t border-zinc-300 bg-white transition-all duration-300 lg:hidden',
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        )}
      >
        <nav className="space-y-1 px-4 py-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block border-b border-zinc-200 py-2 text-[18px] font-semibold tracking-[0.01em] text-zinc-700 transition-colors hover:text-black"
            >
              {item.label}
            </a>
          ))}

          <div className="mt-4 flex items-center gap-2">
            {externalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="grid h-8 w-8 place-items-center transition-colors hover:opacity-85"
                aria-label={link.label}
                title={link.label}
              >
                <img src={link.icon} alt={link.label} className="h-8 w-8 object-contain" />
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

