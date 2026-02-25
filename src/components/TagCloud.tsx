import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { getKellyColor, getKellyTextColor } from '@/lib/kellyColors';
import type { Tag } from '@/types';

interface TagCloudProps {
  tags: Tag[];
  onTagClick?: (tagName: string) => void;
  selectedTag?: string | null;
}

export function TagCloud({ tags, onTagClick, selectedTag }: TagCloudProps) {
  const shuffledTags = useMemo(() => {
    return [...tags].sort(() => Math.random() - 0.5);
  }, []);

  return (
    <section className="border-b border-zinc-300 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Keywords</h2>
          <a
            href="/connects"
            className="text-xs font-medium tracking-[0.08em] text-zinc-600 transition-colors hover:text-black"
          >
            View all keywords
          </a>
        </div>

        <div className="flex flex-wrap gap-2">
          {shuffledTags.slice(0, 60).map((tag) => {
            const backgroundColor = getKellyColor(`keyword-${tag.id}`);
            const textColor = getKellyTextColor(backgroundColor);
            const isSelected = selectedTag === tag.name;

            return (
              <button
                key={tag.id}
                onClick={() => onTagClick?.(tag.name)}
                className={cn(
                  'border-l border-t px-3 py-1.5 text-sm leading-5',
                  isSelected ? 'border-zinc-900 bg-zinc-900 text-white' : 'hover:opacity-90'
                )}
                style={
                  isSelected
                    ? undefined
                    : {
                        backgroundColor,
                        color: textColor,
                        borderColor: 'rgba(24, 24, 27, 0.25)',
                      }
                }
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
