import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const themeKeywords = [
  { label: 'Magnetism', color: '#0072B2', textColor: '#ffffff' }, // Okabe-Ito blue
  { label: 'Spintronics', color: '#009E73', textColor: '#ffffff' }, // Okabe-Ito bluish green
  { label: 'Chaos', color: '#D55E00', textColor: '#ffffff' }, // Okabe-Ito vermillion
  { label: 'Magnetic Skyrmion', color: '#CC79A7', textColor: '#ffffff' }, // Okabe-Ito reddish purple
  { label: 'Spin-Orbit Torque', color: '#E69F00', textColor: '#111827' }, // Okabe-Ito orange
  { label: 'Probabilistic Computing', color: '#56B4E9', textColor: '#111827' }, // Okabe-Ito sky blue
];

const journalKeywords = [
  { label: 'Physical Review B', color: 'rgb(205, 37, 68)', textColor: '#ffffff' },
  { label: 'Scientific Reports', color: 'rgb(206, 221, 228)', textColor: '#111827' },
  { label: 'arXiv', color: 'rgb(179, 27, 27)', textColor: '#ffffff' },
  { label: 'Communications Physics', color: 'rgb(255, 204, 0)', textColor: '#111827' },
  { label: 'npj spintronics', color: 'rgb(227, 6, 19)', textColor: '#ffffff' },
  { label: 'Journal of Materials Chemistry C', color: 'rgb(0, 69, 114)', textColor: '#ffffff' },
  { label: 'ACS Applied Electronic Materials', color: 'rgb(0, 82, 165)', textColor: '#ffffff' },
];

function getCollapsedHeight(container: HTMLDivElement | null): number {
  if (!container) return 0;

  const children = Array.from(container.children) as HTMLElement[];
  if (children.length === 0) return 0;

  const rowBottomByTop = new Map<number, number>();
  children.forEach((child) => {
    const top = child.offsetTop;
    const bottom = top + child.offsetHeight;
    const currentBottom = rowBottomByTop.get(top) ?? 0;
    rowBottomByTop.set(top, Math.max(currentBottom, bottom));
  });

  const rowTops = Array.from(rowBottomByTop.keys()).sort((a, b) => a - b);
  if (rowTops.length <= 3) {
    return container.scrollHeight;
  }

  const thirdRowTop = rowTops[2];
  return rowBottomByTop.get(thirdRowTop) ?? container.scrollHeight;
}

function getCollapsedStyle(expanded: boolean, collapsedHeight: number | null) {
  if (expanded || collapsedHeight === null) {
    return undefined;
  }

  return { maxHeight: `${collapsedHeight}px` };
}

export function TagCloud() {
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);
  const [isJournalExpanded, setIsJournalExpanded] = useState(false);
  const [themeCollapsedHeight, setThemeCollapsedHeight] = useState<number | null>(null);
  const [journalCollapsedHeight, setJournalCollapsedHeight] = useState<number | null>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const journalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCollapsedHeights = () => {
      setThemeCollapsedHeight(getCollapsedHeight(themeRef.current));
      setJournalCollapsedHeight(getCollapsedHeight(journalRef.current));
    };

    updateCollapsedHeights();
    window.addEventListener('resize', updateCollapsedHeights);
    return () => window.removeEventListener('resize', updateCollapsedHeights);
  }, []);

  return (
    <section id="keywords" className="scroll-mt-28 border-b border-zinc-300 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Keywords</h2>

        <div className="space-y-5">
          <div className="flex items-end gap-3">
            <div
              ref={themeRef}
              className="flex flex-1 flex-wrap gap-2 overflow-hidden transition-[max-height] duration-300"
              style={getCollapsedStyle(isThemeExpanded, themeCollapsedHeight)}
            >
              {themeKeywords.map((keyword) => (
                <button
                  key={keyword.label}
                  type="button"
                  className="inline-flex w-fit rounded-md border-l border-t border-zinc-300 px-3 py-1.5 text-sm leading-5"
                  style={{
                    backgroundColor: keyword.color,
                    color: keyword.textColor,
                  }}
                >
                  {keyword.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsThemeExpanded((prev) => !prev)}
              className="inline-flex h-6 w-6 items-center justify-center p-0"
              aria-label={isThemeExpanded ? 'Collapse theme keywords' : 'Expand theme keywords'}
            >
              <ChevronDown className={`h-5 w-5 transition-transform ${isThemeExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="h-px w-full bg-zinc-300" aria-hidden="true" />

          <div className="flex items-end gap-3">
            <div
              ref={journalRef}
              className="flex flex-1 flex-wrap gap-2 overflow-hidden transition-[max-height] duration-300"
              style={getCollapsedStyle(isJournalExpanded, journalCollapsedHeight)}
            >
              {journalKeywords.map((keyword) => (
                <button
                  key={keyword.label}
                  type="button"
                  className="inline-flex w-fit whitespace-nowrap rounded-md border-l border-t border-zinc-300 px-3 py-1.5 text-sm font-medium leading-5"
                  style={{
                    backgroundColor: keyword.color,
                    color: keyword.textColor,
                  }}
                >
                  {keyword.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsJournalExpanded((prev) => !prev)}
              className="inline-flex h-6 w-6 items-center justify-center p-0"
              aria-label={isJournalExpanded ? 'Collapse journal keywords' : 'Expand journal keywords'}
            >
              <ChevronDown className={`h-5 w-5 transition-transform ${isJournalExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
