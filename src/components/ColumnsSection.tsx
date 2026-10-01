import { columns } from '@/data/columns';
import { VagueLogo } from './VagueLogo';
import { KeywordTags } from './KeywordTags';

export function ColumnsSection() {
  return (
    <section id="columns" lang="en" className="relative scroll-mt-28 border-b border-zinc-300 px-4 py-10 sm:px-6 lg:px-8">
      <span id="studies" className="absolute top-0 scroll-mt-28" aria-hidden="true" />
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900"><VagueLogo /></h2>
      <div className="mt-6 grid gap-[7px] sm:grid-cols-2 xl:grid-cols-3">
        {columns.map((column) => (
          <article key={column.id} className="border-l border-t border-zinc-300 p-5 transition-colors hover:bg-zinc-50">
            <a href={`#/columns/${encodeURIComponent(column.id)}`} className="block" aria-label={column.titleEn}>
              <time dateTime={column.date} className="text-xs tabular-nums tracking-[0.08em] text-zinc-500">{column.date.replace(/-/g, '.')}</time>
              <h3 className="mt-3 text-xl font-semibold leading-8 text-zinc-900">{column.titleEn}</h3>
              {column.thumbnail && <img src={column.thumbnail} alt={column.thumbnailAlt ?? ''} width="640" height="360" className="mt-5 w-full" />}
            </a>
            <KeywordTags tags={column.tags} className="mt-4" />
          </article>
        ))}
      </div>
    </section>
  );
}
