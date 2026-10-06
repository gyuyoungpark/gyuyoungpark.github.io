import { keywordIndex } from '@/data/keywordIndex';
import { keywordStyle } from '@/lib/keywords';

interface TagCloudProps {
  selectedKeywords: readonly string[];
  matchingCount: number;
  onToggle: (keyword: string) => void;
  onClear: () => void;
}

export function TagCloud({ selectedKeywords, matchingCount, onToggle, onClear }: TagCloudProps) {
  return (
    <section id="keywords" tabIndex={-1} className="trimmed-borders scroll-mt-28 px-4 py-10 outline-none sm:px-6 lg:px-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Keywords</h2>
        <div className="flex flex-wrap gap-2" aria-label="Content keywords">
          {keywordIndex.map((keyword) => {
            const isSelected = selectedKeywords.includes(keyword.id);
            return (
              <button key={keyword.id} type="button" onClick={() => onToggle(keyword.id)}
                aria-pressed={isSelected}
                className={`inline-flex w-fit rounded-md border-l border-t border-zinc-300 px-3 py-1.5 text-sm leading-5 transition-shadow hover:ring-2 hover:ring-zinc-400 hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${isSelected ? 'ring-2 ring-zinc-900 ring-offset-2' : ''}`}
                style={keywordStyle(keyword.label)}>{keyword.label}</button>
            );
          })}
        </div>
        {selectedKeywords.length > 0 && (
          <div className="trimmed-top-border pt-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">Selected keywords</h3>
                <div className="mt-3 flex flex-wrap gap-2" aria-label="Selected keywords">
                  {selectedKeywords.map((id) => {
                    const label = keywordIndex.find((keyword) => keyword.id === id)?.label ?? id;
                    return (
                      <button key={id} type="button" onClick={() => onToggle(id)}
                        aria-label={`Remove ${label} keyword`}
                        className="inline-flex items-center gap-2 rounded-md border-l border-t border-zinc-300 px-3 py-1.5 text-sm leading-5 hover:ring-2 hover:ring-zinc-400 hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
                        style={keywordStyle(label)}>
                        {label}<span aria-hidden="true">×</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <button type="button" onClick={onClear}
                className="rounded-sm text-sm text-zinc-600 underline underline-offset-4 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900"
                aria-label="Clear keyword selection">Clear</button>
            </div>
            <p className="mt-4 text-sm text-zinc-600" role="status">
              {matchingCount} matching {matchingCount === 1 ? 'item' : 'items'}
            </p>
            {matchingCount === 0 && <p className="mt-2 text-sm text-zinc-600">No matching posts. Remove a keyword or clear the selection.</p>}
          </div>
        )}
      </div>
    </section>
  );
}
