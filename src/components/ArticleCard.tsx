import type { Article } from '@/types';
import { KeywordTags } from './KeywordTags';

export function ArticleCard({ article }: { article: Article }) {
  const href = article.url ?? `/features/${article.id}`;
  const year = article.date?.slice(0, 4);
  return (
    <article id={`research-item-${article.id}`} className="flex h-full scroll-mt-28 flex-col border-l border-t border-zinc-300 bg-white p-5 transition-colors hover:bg-zinc-50">
      <a href={href} target={article.url ? '_blank' : undefined} rel={article.url ? 'noopener noreferrer' : undefined} className="block">
        <p className="text-xs leading-5 text-zinc-500">
          <span className="font-medium text-zinc-700">{article.journal ?? article.category}</span>
          {article.status === 'preprint' && <span> · Preprint</span>}
          {year && <span> · {year}</span>}
        </p>
        <h3 className="mt-3 text-lg font-semibold leading-7 text-zinc-900">{article.title}</h3>
      </a>
      {article.image && (
        <figure className="mt-5">
          <a href={href} target="_blank" rel="noopener noreferrer" tabIndex={-1} className="flex aspect-[4/3] items-center justify-center bg-white">
            <img src={article.image} alt={article.imageAlt ?? article.title} className="h-full w-full object-contain" loading="lazy" decoding="async" />
          </a>
          {article.caption && <figcaption className="mt-3 text-sm leading-6 text-zinc-600">{article.caption}</figcaption>}
          {article.figureSourceUrl && <a href={article.figureSourceUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-zinc-500 underline decoration-zinc-300 underline-offset-4 hover:text-black">{article.figureNumber ?? 'Figure'} · Source</a>}
        </figure>
      )}
      {!article.image && article.description && <p className="mt-4 text-sm leading-6 text-zinc-600">{article.description}</p>}
      <KeywordTags tags={article.tags} className="mt-auto pt-5" />
    </article>
  );
}
