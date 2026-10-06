import type { ColumnReference } from '@/data/columns';

function referenceTarget(columnId: string, referenceId: string) {
  return `column-${columnId}-reference-${referenceId}`;
}

export function ReferenceMark({ columnId, reference, number }: {
  columnId: string;
  reference: ColumnReference;
  number: number;
}) {
  return (
    <sup className="ml-1 text-[11px] font-medium leading-none">
      <button
        type="button"
        aria-label={`Reference ${number}: ${reference.title}`}
        title={reference.title}
        className="px-0.5 py-1 text-[#286b8a] underline-offset-2 hover:underline"
        onClick={() => {
          const target = document.getElementById(referenceTarget(columnId, reference.id));
          target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          target?.focus({ preventScroll: true });
        }}
      >[{number}]</button>
    </sup>
  );
}

export function ColumnReferences({ columnId, references }: {
  columnId: string;
  references: ColumnReference[];
}) {
  if (!references.length) return null;
  return (
    <section lang="en" aria-labelledby="column-references-heading" className="mt-14 border-t border-zinc-300 pt-8">
      <h2 id="column-references-heading" className="mb-6 text-xl font-semibold">References</h2>
      <ol className="space-y-5 text-sm leading-6 text-zinc-600">
        {references.map((reference, index) => (
          <li key={reference.id} id={referenceTarget(columnId, reference.id)} tabIndex={-1}
            className="flex scroll-mt-28 gap-3 rounded-sm [overflow-wrap:anywhere]">
            <span aria-hidden="true" className="shrink-0 tabular-nums text-zinc-400">[{index + 1}]</span>
            <p>
              {reference.authors}{reference.authors.endsWith('.') ? '' : '.'}{' '}
              <a href={reference.doi ? `https://doi.org/${reference.doi}` : reference.url}
                target="_blank" rel="noopener noreferrer"
                className="text-zinc-800 underline decoration-zinc-300 underline-offset-4 hover:text-[#286b8a]">
                {reference.title}
              </a>.{' '}
              <em>{reference.journal}</em>
              {reference.volume && <> <strong className="font-semibold">{reference.volume}</strong></>}
              {(reference.articleNumber || reference.pages) && <>, {reference.articleNumber ?? reference.pages}</>}
              {' '}({reference.year}).
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
