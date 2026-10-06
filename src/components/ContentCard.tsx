import type { ReactNode } from 'react';
import type { Tag } from '@/types';
import { KeywordTags } from './KeywordTags';

interface ContentCardProps {
  id: string;
  title: string;
  href: string;
  metadata: ReactNode;
  image?: string;
  imageAlt?: string;
  caption?: string;
  tags: (string | Tag)[];
}

export function ContentCard({ id, title, href, metadata, image, imageAlt, caption, tags }: ContentCardProps) {
  return (
    <article id={id} className="trimmed-borders flex h-full scroll-mt-28 flex-col bg-white p-5">
      <a href={href} className="block after:absolute after:inset-0 after:z-[1] after:content-['']">
        <div className="text-xs leading-5 text-zinc-500">{metadata}</div>
        <h3 className="mt-3 text-lg font-semibold leading-7 text-zinc-900">{title}</h3>
      </a>
      {image ? (
        <figure className="mt-5">
          <a href={href} tabIndex={-1} className="flex aspect-[4/3] items-center justify-center bg-white">
            <img src={image} alt={imageAlt ?? title} className="h-full w-full object-contain" loading="lazy" decoding="async" />
          </a>
          {caption && <figcaption className="mt-3 text-sm leading-6 text-zinc-600">{caption}</figcaption>}
        </figure>
      ) : caption && <p className="mt-4 text-sm leading-6 text-zinc-600">{caption}</p>}
      <KeywordTags tags={tags} className="mt-auto pt-5" />
    </article>
  );
}
