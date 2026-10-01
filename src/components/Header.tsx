import { navItems } from '@/data/content';
import { EdgeNavigation } from './EdgeNavigation';
import { VagueLogo } from './VagueLogo';

const externalLinks = [
  {
    label: 'Google Scholar',
    href: 'https://scholar.google.com/citations?hl=ko&user=FAUWfAcAAAAJ&view_op=list_works&gmla=AF9nlQvJrWhyl6o1in1SHv1pwOSVAFzstBQmA_TVy1hyu2VlShOcVhT_8fFTrLUzmC5pC1ZqmcwTh-SyRTGsOYVMXFCDO6cCduIz3_3aHuFtUgbO2-Ql5D2rFQ',
    icon: '/download/Google_Scholar_logo.svg',
  },
  {
    label: 'ORCID',
    href: 'https://orcid.org/0009-0001-8492-4299',
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
  return (
    <header className="site-header sticky top-0 z-50 backdrop-blur-sm">
      <div className="site-shell">
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-4 text-zinc-900 sm:px-6 lg:grid-cols-[auto_1fr_auto] lg:gap-6 lg:px-8">
          <a href="/#top" className="inline-flex items-center">
            <span className="text-[20px] font-semibold tracking-[0.01em] lg:text-[24px]">Gyuyoung Park</span>
          </a>
          <nav aria-label="Main navigation" className="hidden items-center justify-self-center gap-4 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={`/${item.href}`}
                className="text-[14px] font-semibold tracking-[0.02em] text-zinc-700 transition-colors hover:text-black lg:text-[16px]"
              >
                {item.href === '#columns' ? <VagueLogo /> : item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center justify-self-end">
            <div className="hidden items-center gap-2 lg:flex">
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
            <EdgeNavigation externalLinks={externalLinks} />
          </div>
        </div>
      </div>
    </header>
  );
}
