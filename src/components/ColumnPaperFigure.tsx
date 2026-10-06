import type { ColumnBlock, ColumnReference } from '@/data/columns';
import { ReferenceMark } from './ColumnReferences';

export function ColumnPaperFigure({ columnId, block, reference, referenceNumber }: {
  columnId: string;
  block: Extract<ColumnBlock, { type: 'paperFigure' }>;
  reference?: ColumnReference;
  referenceNumber: number;
}) {
  return (
    <figure className="column-paper-figure my-10 border-y border-zinc-300 py-5">
      <p className="mb-4 text-sm font-semibold text-zinc-800">논문 그림 · {reference?.title ?? block.figureLabel}{reference && ` (${reference.year})`}</p>
      <a href={block.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${block.figureLabel} — 원본 논문 그림 (새 탭)`}>
        <img src={block.image} alt={block.alt} width={block.width} height={block.height}
          className="block h-auto w-full" loading="lazy" decoding="async" />
      </a>
      <figcaption className="mt-3 text-sm leading-6 text-zinc-500">
        {block.caption}
        {reference && <ReferenceMark columnId={columnId} reference={reference} number={referenceNumber} />}
        <span lang="en" className="mt-2 block text-xs leading-5 text-zinc-500">
          {block.credit}.{' '}
          <a href={block.sourceUrl} target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2">Original {block.figureLabel}</a>
          {reference?.doi && <>{' · '}<a href={`https://doi.org/${reference.doi}`} target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2">DOI: {reference.doi}</a></>}
          {' · '}
          <a href={block.licenseUrl} target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2">{block.license}</a>
          {' · Reproduced without alteration.'}
        </span>
      </figcaption>
    </figure>
  );
}
