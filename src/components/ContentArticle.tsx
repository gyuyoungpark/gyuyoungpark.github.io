import { useEffect, useRef } from 'react';
import type { Activity, Article } from '@/types';
import { doiHref } from '@/lib/contentRoutes';
import { KeywordTags } from './KeywordTags';
import { BackLink } from './BackLink';
import { PublicationCitation } from './PublicationCitation';
import { formatDetailDate } from '@/lib/detailDate';

export function ContentArticle({ item }: { item: Article | Activity }) {
  const isActivity = 'event' in item;
  const section = isActivity ? 'Activities' : 'Research';
  const sectionHash = isActivity ? 'activities' : 'research';
  const titleRef = useRef<HTMLHeadingElement>(null);
  const doiUrl = doiHref(item.doi);
  const detailImage = isActivity ? item.detailImage : undefined;
  const image = detailImage?.src ?? item.image;
  const imageAlt = detailImage?.alt ?? item.imageAlt ?? item.title;
  const sourceUrl = detailImage?.sourceUrl ?? (isActivity ? item.imageSourceUrl : item.figureSourceUrl);
  const imageLabel = detailImage?.label ?? (isActivity ? item.imageLabel : item.figureNumber);
  const summary = isActivity ? undefined : item.summary;
  const caption = summary?.length || detailImage ? undefined : item.caption ?? ('description' in item ? item.description : undefined);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${item.title} | Gyuyoung Park`;
    window.scrollTo({ top: 0, behavior: 'instant' });
    titleRef.current?.focus({ preventScroll: true });
    return () => { document.title = previousTitle; };
  }, [item.title]);

  return (
    <article lang="en" className="mx-auto max-w-[820px] px-5 py-10 sm:px-10 sm:py-14">
      <header className="mb-8">
        <BackLink href={`/#${sectionHash}`} className="mb-6">{section}</BackLink>
        <h1 ref={titleRef} tabIndex={-1} className="text-3xl font-semibold leading-snug tracking-tight [overflow-wrap:anywhere] outline-none sm:text-4xl">{item.title}</h1>
        {!isActivity && item.authors.length > 0 && <p className="mt-4 text-sm leading-6 text-zinc-700">{item.authors.map((author) => author.name).join(', ')}</p>}
        <div className="mt-4 space-y-1 text-sm leading-6 text-zinc-500">
          {isActivity ? <p className="font-medium text-zinc-700">{item.event}</p> : <PublicationCitation article={item} />}
          {item.date && <p>
            <time dateTime={item.date}>{formatDetailDate(item.date)}</time>
            {isActivity ? ` · ${item.kind}` : item.status === 'preprint' ? ' · Preprint' : ''}
          </p>}
          {isActivity && item.location && <p>{item.location}</p>}
        </div>
        {(doiUrl || item.url) && <p className="mt-6 text-sm leading-6 [overflow-wrap:anywhere]">
          <a href={doiUrl ?? item.url} target="_blank" rel="noopener noreferrer" className="text-zinc-700 underline decoration-zinc-400 underline-offset-4 hover:text-black">
            {doiUrl ? `DOI: ${item.doi}` : 'Official source'}
          </a>
        </p>}
      </header>
      {summary && summary.length > 0 && <section aria-label="Research overview" className="mb-8 space-y-5 text-base leading-8 text-zinc-700">
        {summary.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </section>}
      {image ? <figure>
        <a href={image} target="_blank" rel="noopener noreferrer" aria-label="View full image" className="block">
          <img src={image} alt={imageAlt} className={`${detailImage ? '' : 'max-h-[80vh] '}w-full object-contain`} decoding="async" />
        </a>
        {caption && <figcaption className="mt-5 text-base leading-8 text-zinc-700">{caption}</figcaption>}
        {sourceUrl && <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-zinc-500 underline decoration-zinc-300 underline-offset-4 hover:text-black">{imageLabel ?? 'Image'} · Source</a>}
      </figure> : caption && <p className="text-base leading-8 text-zinc-700">{caption}</p>}
      {isActivity && detailImage && item.includeThumbnailOnDetail && item.image && item.image !== image && <figure className="mt-10">
        <a href={item.image} target="_blank" rel="noopener noreferrer" aria-label={`View full ${item.imageLabel?.toLowerCase() ?? 'image'}`} className="block">
          <img src={item.image} alt={item.imageAlt ?? item.title} className="h-auto w-full object-contain" loading="lazy" decoding="async" />
        </a>
      </figure>}
      <footer className="trimmed-top-border mt-10 pt-6">
        <KeywordTags tags={item.tags} className="mb-6" />
        <BackLink href={`/#${sectionHash}`}>{section}</BackLink>
      </footer>
    </article>
  );
}
