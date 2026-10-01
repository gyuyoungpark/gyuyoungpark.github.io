import { keywordIndex } from '@/data/keywordIndex';
import { keywordHref, keywordStyle } from '@/lib/keywords';

interface TagCloudProps {
  selectedKeyword?: string | null;
}

export function TagCloud({ selectedKeyword }: TagCloudProps) {
  const hasSelection = selectedKeyword !== undefined && selectedKeyword !== null;
  const selected = keywordIndex.find((keyword) => keyword.id === selectedKeyword);
  const relatedContents = selected?.contents ?? [];

  return (
    <section id="keywords" tabIndex={-1} className="scroll-mt-28 border-b border-zinc-300 px-4 py-10 outline-none sm:px-6 lg:px-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Keywords</h2>

        <div className="flex flex-wrap gap-2" aria-label="Content keywords">
          {keywordIndex.map((keyword) => {
            const isSelected = keyword.id === selectedKeyword;

            return (
              <a
                key={keyword.id}
                href={keywordHref(keyword.label)}
                aria-current={isSelected ? 'true' : undefined}
                className={`inline-flex w-fit rounded-md border-l border-t border-zinc-300 px-3 py-1.5 text-sm leading-5 transition-shadow hover:ring-2 hover:ring-zinc-400 hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${isSelected ? 'ring-2 ring-zinc-900 ring-offset-2' : ''}`}
                style={keywordStyle(keyword.label)}
              >
                {keyword.label}
              </a>
            );
          })}
        </div>

        {hasSelection && (
          <div className="border-t border-zinc-300 pt-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-zinc-900">
                  {selected ? selected.label : 'Unknown keyword'}
                </h3>
                <p className="mt-1 text-sm text-zinc-500" aria-live="polite">
                  {relatedContents.length} related {relatedContents.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <a
                href="/#keywords"
                className="rounded-sm text-sm text-zinc-600 underline underline-offset-4 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900"
                aria-label="Clear keyword selection"
              >
                Clear
              </a>
            </div>

            {relatedContents.length > 0 ? (
              <ul className="mt-4 divide-y divide-zinc-200">
                {relatedContents.map((content) => (
                  <li key={`${content.section}:${content.id}`} className="py-3 first:pt-0 last:pb-0">
                    <a
                      href={content.href}
                      className="group flex flex-col gap-1 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900 sm:flex-row sm:items-baseline sm:gap-4"
                    >
                      <span className="w-20 shrink-0 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        {content.section}
                      </span>
                      <span className="text-sm leading-6 text-zinc-800 group-hover:underline group-hover:underline-offset-4">
                        {content.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-zinc-600">
                {selected ? 'No content yet.' : 'This keyword is not registered yet.'}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
