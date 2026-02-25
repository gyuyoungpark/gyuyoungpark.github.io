import type { Article } from '@/types';
import { ArticleCard } from './ArticleCard';

interface FeaturesSectionProps {
  articles: Article[];
  limit?: number;
}

export function FeaturesSection({ articles, limit }: FeaturesSectionProps) {
  const displayArticles = limit ? articles.slice(0, limit) : articles;
  const leadArticle = displayArticles[0];
  const sideArticles = displayArticles.slice(1, 4);
  const gridArticles = displayArticles.slice(4);

  if (!leadArticle) {
    return null;
  }

  return (
    <section id="research" className="scroll-mt-28 border-b border-zinc-300 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Research</h2>
          <a
            href="#research"
            className="text-xs font-medium tracking-[0.08em] text-zinc-600 transition-colors hover:text-black"
          >
            View all research
          </a>
        </div>

        <div className="grid gap-0 lg:grid-cols-12">
          <article className="border-l border-t border-zinc-300 p-6 lg:col-span-8">
            <a href={`/features/${leadArticle.id}`} className="block">
              <p className="text-[11px] tracking-[0.12em] text-zinc-500">{leadArticle.category}</p>
              <h3 className="mt-3 text-3xl font-semibold leading-tight text-zinc-900">
                {leadArticle.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-zinc-700">{leadArticle.description}</p>
            </a>
          </article>

          <div className="lg:col-span-4">
            {sideArticles.map((article) => (
              <article key={article.id} className="border-l border-t border-zinc-300 p-4">
                <a href={`/features/${article.id}`} className="block">
                  <p className="text-[10px] tracking-[0.12em] text-zinc-500">{article.category}</p>
                  <h4 className="mt-2 text-sm font-semibold leading-6 text-zinc-900">
                    {article.title}
                  </h4>
                </a>
              </article>
            ))}
          </div>
        </div>

        {gridArticles.length > 0 && (
          <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-3">
            {gridArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
