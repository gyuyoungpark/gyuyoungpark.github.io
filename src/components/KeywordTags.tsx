import { useContext } from 'react';
import { keywordSelectionHref, keywordStyle, normalizeKeyword } from '@/lib/keywords';
import { KeywordSelectionContext } from '@/lib/keywordSelection';
import { cn } from '@/lib/utils';

export function KeywordTags({ tags = [], className }: {
  tags?: readonly (string | { name: string })[];
  className?: string;
}) {
  const selectedKeywords = useContext(KeywordSelectionContext);
  const labels = new Map<string, string>();
  tags.forEach((tag) => {
    const label = (typeof tag === 'string' ? tag : tag.name).trim().replace(/\s+/g, ' ');
    const id = normalizeKeyword(label);
    if (id && !labels.has(id)) labels.set(id, label);
  });
  if (!labels.size) return null;

  return (
    <ul aria-label="Topics" className={cn('flex flex-wrap gap-2', className)}>
      {Array.from(labels, ([id, label]) => (
        <li key={id}>
          <a href={keywordSelectionHref([...selectedKeywords, label])}
            onClick={() => {
              if (window.location.hash === keywordSelectionHref([...selectedKeywords, label]).slice(1)) {
                const target = document.getElementById('keywords');
                target?.scrollIntoView();
                target?.focus({ preventScroll: true });
              }
            }}
            className="inline-flex max-w-full rounded-md border-l border-t border-zinc-300 px-3 py-1.5 text-sm leading-5 transition-shadow hover:ring-2 hover:ring-zinc-400 hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
            style={keywordStyle(label)}>
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
