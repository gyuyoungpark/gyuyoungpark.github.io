import type { Article } from '@/types';

export function PublicationCitation({ article }: { article: Article }) {
  const year = article.date?.slice(0, 4);
  const locator = article.articleNumber ?? article.pages;
  return (
    <p className="text-zinc-700">
      <em>{article.journal ?? article.category}</em>
      {article.status === 'preprint' ? article.preprintId && `:${article.preprintId}` : <>
        {article.volume && <> <strong className="font-bold">{article.volume}</strong></>}
        {locator && `, ${locator}`}
      </>}
      {year && ` (${year})`}
    </p>
  );
}
