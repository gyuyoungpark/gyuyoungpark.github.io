import type { ReactNode } from 'react';
import type { Tag } from '@/types';
import { KeywordTags } from './KeywordTags';

interface ContentCardProps {
  id: string;
  title: string;
  href: string;
  external?: boolean;
  metadata: ReactNode;
  image?: string;
  imageAlt?: string;
  caption?: string;
  imageLabel?: string;
  imageSourceUrl?: string;
  tags: (string | Tag)[];
}

export function ContentCard({ id, title, href, external = true, metadata, image, imageAlt, caption, imageLabel = 'Figure', imageSourceUrl, tags }: ContentCardProps) {
  const linkProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <article id={id} className="flex h-full scroll-mt-28 flex-col border-l border-t border-zinc-300 bg-white p-5">
      <a href={href} {...linkProps} className="block">
        <div className="text-xs leading-5 text-zinc-500">{metadata}</div>
        <h3 className="mt-3 text-lg font-semibold leading-7 text-zinc-900">{title}</h3>
      </a>
      {image ? (
        <figure className="mt-5">
          <a href={href} {...linkProps} tabIndex={-1} className="flex aspect-[4/3] items-center justify-center bg-white">
            <img src={image} alt={imageAlt ?? title} className="h-full w-full object-contain" loading="lazy" decoding="async" />
          </a>
          {caption && <figcaption className="mt-3 text-sm leading-6 text-zinc-600">{caption}</figcaption>}
          {imageSourceUrl && <a href={imageSourceUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-zinc-500 underline decoration-zinc-300 underline-offset-4 hover:text-black">{imageLabel} · Source</a>}
        </figure>
      ) : caption && <p className="mt-4 text-sm leading-6 text-zinc-600">{caption}</p>}
      <KeywordTags tags={tags} className="mt-auto pt-5" />
    </article>
  );
}
