import type { Article } from '@/types';
import { KeywordTags } from './KeywordTags';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article id={`research-item-${article.id}`} className="flex h-full scroll-mt-28 flex-col border-l border-t border-zinc-300 bg-white p-5 transition-colors hover:bg-zinc-50">
      <a href={`/features/${article.id}`} className="block">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-[11px] tracking-[0.12em] text-zinc-500">{article.category}</span>
          {article.isNew && (
            <span className="border border-zinc-900 px-2 py-0.5 text-[10px] font-medium tracking-[0.1em] text-zinc-900">
              NEW
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold leading-7 text-zinc-900">{article.title}</h3>
        <p className="mt-4 line-clamp-4 text-sm leading-6 text-zinc-600">{article.description}</p>
      </a>
      <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
        {article.authors.map((author) => (
          <a key={author.id} href={`/producers/${author.id}`} className="text-xs text-zinc-600 transition-colors hover:text-black">
            {author.name}
          </a>
        ))}
      </div>
      <KeywordTags tags={article.tags} className="mt-4 border-t border-zinc-300 pt-3" />
    </article>
  );
}
