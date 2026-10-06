import { useEffect, useRef } from 'react';
import type { Activity, Article } from '@/types';
import { doiHref } from '@/lib/contentRoutes';
import { KeywordTags } from './KeywordTags';

export function ContentArticle({ item }: { item: Article | Activity }) {
  const isActivity = 'event' in item;
  const section = isActivity ? 'Activities' : 'Research';
  const sectionHash = isActivity ? 'activities' : 'research';
  const titleRef = useRef<HTMLHeadingElement>(null);
  const doiUrl = doiHref(item.doi);
  const sourceUrl = isActivity ? item.imageSourceUrl : item.figureSourceUrl;
  const imageLabel = isActivity ? item.imageLabel : item.figureNumber;
  const caption = item.caption ?? ('description' in item ? item.description : undefined);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${item.title} | Gyuyoung Park`;
    window.scrollTo({ top: 0, behavior: 'instant' });
    titleRef.current?.focus({ preventScroll: true });
    return () => { document.title = previousTitle; };
  }, [item.title]);

  return (
    <article lang="en" className="trimmed-borders mx-auto max-w-[820px] px-5 py-10 sm:px-10 sm:py-14">
      <header className="mb-8">
        <a href={`/#${sectionHash}`} className="mb-6 inline-block text-sm text-zinc-600 hover:text-black">← Back to {section}</a>
        <div className="mb-4 space-y-1 text-sm leading-6 text-zinc-500">
          <p className="font-medium text-zinc-700">{isActivity ? item.event : item.journal ?? item.category}</p>
          {item.date && <p>
            <time dateTime={item.date}>{isActivity ? item.dateLabel ?? item.date.replace(/-/g, '.') : item.date.replace(/-/g, '.')}</time>
            {isActivity ? ` · ${item.kind}` : item.status === 'preprint' ? ' · Preprint' : ''}
          </p>}
          {isActivity && item.location && <p>{item.location}</p>}
        </div>
        <h1 ref={titleRef} tabIndex={-1} className="text-3xl font-semibold leading-snug tracking-tight [overflow-wrap:anywhere] outline-none sm:text-4xl">{item.title}</h1>
        {(doiUrl || item.url) && <p className="mt-6 text-sm leading-6 [overflow-wrap:anywhere]">
          <a href={doiUrl ?? item.url} target="_blank" rel="noopener noreferrer" className="text-zinc-700 underline decoration-zinc-400 underline-offset-4 hover:text-black">
            {doiUrl ? `DOI: ${item.doi}` : 'Official source'}
          </a>
        </p>}
      </header>
      {item.image ? <figure>
        <a href={item.image} target="_blank" rel="noopener noreferrer" aria-label="View full image" className="block">
          <img src={item.image} alt={item.imageAlt ?? item.title} className="max-h-[80vh] w-full object-contain" decoding="async" />
        </a>
        {caption && <figcaption className="mt-5 text-base leading-8 text-zinc-700">{caption}</figcaption>}
        {sourceUrl && <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-zinc-500 underline decoration-zinc-300 underline-offset-4 hover:text-black">{imageLabel ?? 'Image'} · Source</a>}
      </figure> : caption && <p className="text-base leading-8 text-zinc-700">{caption}</p>}
      <footer className="trimmed-top-border mt-10 pt-6">
        <KeywordTags tags={item.tags} className="mb-6" />
        <a href={`/#${sectionHash}`} className="inline-block text-sm text-zinc-600 hover:text-black">Back to {section}</a>
      </footer>
    </article>
  );
}
