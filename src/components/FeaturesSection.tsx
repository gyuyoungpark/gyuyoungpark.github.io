import type { Article } from '@/types';
import { ArticleCard } from './ArticleCard';

interface FeaturesSectionProps {
  articles: Article[];
  limit?: number;
}

export function FeaturesSection({ articles, limit }: FeaturesSectionProps) {
  const displayArticles = limit ? articles.slice(0, limit) : articles;
  if (!displayArticles.length) return null;

  return (
    <section id="research" lang="en" className="scroll-mt-28 border-b border-zinc-300 px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Research</h2>
      <div className="mt-6 grid gap-[7px] md:grid-cols-2 xl:grid-cols-3">
        {displayArticles.map((article) => <ArticleCard key={article.id} article={article} />)}
      </div>
    </section>
  );
}
