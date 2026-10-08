import { columns as allColumns, type Column } from '@/data/columns';
import { VagueLogo } from './VagueLogo';
import { KeywordTags } from './KeywordTags';
import { contentHref } from '@/lib/contentRoutes';
import { normalizeKeyword } from '@/lib/keywords';

export function ColumnsSection({ columns = allColumns }: { columns?: Column[] }) {
  if (!columns.length) return null;
  return (
    <section id="columns" lang="en" className="trimmed-borders scroll-mt-28 px-4 py-10 sm:px-6 lg:px-8">
      <span id="studies" className="absolute top-0 scroll-mt-28" aria-hidden="true" />
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900"><VagueLogo /></h2>
      <div className="mt-6 grid gap-[7px] sm:grid-cols-2 xl:grid-cols-3">
        {columns.map((column) => {
          const headerTags = column.headerTags ?? [];
          const headerTagIds = new Set(headerTags.map(normalizeKeyword));
          const footerTags = column.tags.filter((tag) => !headerTagIds.has(normalizeKeyword(tag)));
          return (
            <article key={column.id} className="trimmed-borders bg-white p-5">
              <time dateTime={column.date} className="text-xs tabular-nums tracking-[0.08em] text-zinc-500">{column.date.replace(/-/g, '.')}</time>
              <div className="mt-3 flex items-start gap-3">
                <a href={contentHref('columns', column.id)} className="min-w-0 flex-1 after:absolute after:inset-0 after:z-[1] after:content-['']" aria-label={column.titleEn}>
                  <h3 className="text-xl font-semibold leading-8 text-zinc-900">{column.titleEn}</h3>
                </a>
                <KeywordTags tags={headerTags} className="shrink-0 justify-end" />
              </div>
              {column.thumbnail && <img src={column.thumbnail} alt={column.thumbnailAlt ?? ''} width="640" height="360" className="mt-5 w-full" />}
              <KeywordTags tags={footerTags} className="mt-4" />
            </article>
          );
        })}
      </div>
    </section>
  );
}
