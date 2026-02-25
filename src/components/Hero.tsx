import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroProps {
  aboutDescription: string;
}

export function Hero({ aboutDescription }: HeroProps) {
  const [isOpen, setIsOpen] = useState(false);
  const paragraphs = aboutDescription
    .split('\n\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const visibleParagraphs = isOpen ? paragraphs : paragraphs.slice(0, 2);

  return (
    <section className="border-b border-zinc-300 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 pb-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-[11px] tracking-[0.14em] text-zinc-500">FOCUS</p>
              <p className="mt-1 text-sm text-zinc-700">Research-led personal archive</p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.14em] text-zinc-500">SECTIONS</p>
              <p className="mt-1 text-sm text-zinc-700">Keywords / Research / Activities / Knowledge</p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.14em] text-zinc-500">FORMAT</p>
              <p className="mt-1 text-sm text-zinc-700">Linear editorial boundaries</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-2 border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition-colors hover:text-black"
          >
            About {isOpen ? 'Collapse' : 'Expand'}
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                isOpen ? 'rotate-180' : ''
              )}
            />
          </button>
        </div>

        <div className="space-y-4">
          {visibleParagraphs.map((paragraph, index) => (
            <p key={index} className="text-[15px] leading-7 text-zinc-700">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
