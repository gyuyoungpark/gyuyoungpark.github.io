import type { Article } from '@/types';
import { cn } from '@/lib/utils';
import { getKellyColor, getKellyTextColor } from '@/lib/kellyColors';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className={cn('h-full border-l border-t border-zinc-300 bg-white transition-colors hover:bg-zinc-50')}>
      <a href={`/features/${article.id}`} className="flex h-full flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-[11px] tracking-[0.12em] text-zinc-500">{article.category}</span>
          {article.isNew && (
            <span className="border border-zinc-900 px-2 py-0.5 text-[10px] font-medium tracking-[0.1em] text-zinc-900">
              NEW
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold leading-7 text-zinc-900">{article.title}</h3>

        <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
          {article.authors.map((author) => (
            <a
              key={author.id}
              href={`/producers/${author.id}`}
              className="text-xs text-zinc-600 transition-colors hover:text-black"
              onClick={(event) => event.stopPropagation()}
            >
              {author.name}
            </a>
          ))}
        </div>

        <p className="mt-4 line-clamp-4 text-sm leading-6 text-zinc-600">{article.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-zinc-300 pt-3">
          {article.tags.slice(0, 4).map((tag) => {
            const backgroundColor = getKellyColor(`article-${article.id}-tag-${tag.id}`);
            const textColor = getKellyTextColor(backgroundColor);

            return (
              <span
                key={tag.id}
                className="border px-2 py-0.5 text-[11px]"
                style={{
                  backgroundColor,
                  color: textColor,
                  borderColor: 'rgba(24, 24, 27, 0.25)',
                }}
              >
                {tag.name}
              </span>
            );
          })}
        </div>
      </a>
    </article>
  );
}
