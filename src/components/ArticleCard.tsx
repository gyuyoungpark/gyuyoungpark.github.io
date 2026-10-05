import type { Article } from '@/types';
import { ContentCard } from './ContentCard';

export function ArticleCard({ article }: { article: Article }) {
  const year = article.date?.slice(0, 4);
  return (
    <ContentCard
      id={`research-item-${article.id}`}
      title={article.title}
      href={article.url ?? `/features/${article.id}`}
      external={Boolean(article.url)}
      metadata={<>
          <span className="font-medium text-zinc-700">{article.journal ?? article.category}</span>
          {article.status === 'preprint' && <span> · Preprint</span>}
          {year && <span> · {year}</span>}
      </>}
      image={article.image}
      imageAlt={article.imageAlt}
      caption={article.caption ?? article.description}
      imageLabel={article.figureNumber}
      imageSourceUrl={article.figureSourceUrl}
      tags={article.tags}
    />
  );
}
