import type { Column } from '../data/columns';
import {
  columnSeo,
  SITE_ORIGIN,
  type ColumnSeoLanguage,
} from '../data/columnSeo';

export interface ColumnSeoMetaTag {
  name?: string;
  property?: string;
  content: string;
}

export interface ColumnSeoLinkTag {
  rel: 'canonical' | 'alternate';
  href: string;
  hreflang?: ColumnSeoLanguage | 'x-default';
}

export interface ColumnArticleJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description: string;
  datePublished: string;
  author: { '@type': 'Person'; name: 'Gyuyoung Park' };
  url: string;
  mainEntityOfPage: string;
  inLanguage: ColumnSeoLanguage;
  keywords: string[];
  image?: string;
}

export interface ColumnSeoMetadata {
  title: string;
  description: string;
  canonical: string;
  htmlLanguage: ColumnSeoLanguage;
  meta: ColumnSeoMetaTag[];
  links: ColumnSeoLinkTag[];
  jsonLd: ColumnArticleJsonLd;
}

/** The same metadata is used by prerendering and by client navigation. */
export function columnSeoMetadata(
  column: Column,
  language: ColumnSeoLanguage,
): ColumnSeoMetadata | undefined {
  if (column.id !== 'electron-fluid') return undefined;

  const config = columnSeo[column.id];
  const page = config.pages[language];
  const alternateLanguage = language === 'en' ? 'ko' : 'en';
  const canonical = new URL(page.path, SITE_ORIGIN).href;
  const image = column.thumbnail
    ? new URL(column.thumbnail, SITE_ORIGIN).href
    : undefined;

  const meta: ColumnSeoMetaTag[] = [
    { name: 'description', content: page.description },
    { property: 'og:title', content: page.title },
    { property: 'og:description', content: page.description },
    { property: 'og:url', content: canonical },
    { property: 'og:type', content: 'article' },
    { property: 'og:locale', content: page.ogLocale },
    { property: 'og:locale:alternate', content: config.pages[alternateLanguage].ogLocale },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: page.title },
    { name: 'twitter:description', content: page.description },
  ];

  if (image) {
    meta.push(
      { property: 'og:image', content: image },
      { name: 'twitter:image', content: image },
    );
  }

  const links: ColumnSeoLinkTag[] = [
    { rel: 'canonical', href: canonical },
    ...(['en', 'ko'] as const).map((locale) => ({
      rel: 'alternate' as const,
      hreflang: locale,
      href: new URL(config.pages[locale].path, SITE_ORIGIN).href,
    })),
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: new URL(config.pages[config.defaultLanguage].path, SITE_ORIGIN).href,
    },
  ];

  return {
    title: page.title,
    description: page.description,
    canonical,
    htmlLanguage: language,
    meta,
    links,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: language === 'en' ? column.titleEn : column.title,
      description: page.description,
      datePublished: column.date,
      author: { '@type': 'Person', name: 'Gyuyoung Park' },
      url: canonical,
      mainEntityOfPage: canonical,
      inLanguage: language,
      keywords: [...column.tags],
      ...(image ? { image } : {}),
    },
  };
}

/** Client navigation keeps unrelated head nodes and discards prerendered article SEO. */
export function applyColumnSeo(
  column: Column,
  language: ColumnSeoLanguage,
): () => void {
  const metadata = columnSeoMetadata(column, language);
  if (!metadata || typeof document === 'undefined') return () => {};

  const head = document.head;
  const prerendered = Array.from(head.children).filter((node) =>
    node.hasAttribute('data-column-seo'),
  );
  const originalTitle = prerendered.length ? 'Gyuyoung Park' : document.title;
  const originalLanguage = prerendered.length
    ? 'en'
    : document.documentElement.getAttribute('lang');
  for (const node of prerendered) node.remove();

  const names = new Set(metadata.meta.flatMap((tag) => tag.name ? [tag.name] : []));
  const properties = new Set(metadata.meta.flatMap((tag) => tag.property ? [tag.property] : []));

  const replaced = Array.from(head.children).filter((node) => {
    if (node.tagName === 'META') {
      return names.has(node.getAttribute('name')?.toLowerCase() ?? '')
        || properties.has(node.getAttribute('property')?.toLowerCase() ?? '');
    }
    if (node.tagName === 'LINK') {
      const rel = node.getAttribute('rel')?.toLowerCase().split(/\s+/) ?? [];
      return rel.includes('canonical')
        || (rel.includes('alternate') && node.hasAttribute('hreflang'));
    }
    return false;
  }).map((node) => ({ node, nextSibling: node.nextSibling }));

  for (const { node } of replaced) node.remove();

  const managed: HTMLElement[] = [];
  const append = (node: HTMLElement) => {
    node.setAttribute('data-column-seo', column.id);
    head.appendChild(node);
    managed.push(node);
  };

  document.title = metadata.title;
  document.documentElement.setAttribute('lang', metadata.htmlLanguage);

  for (const tag of metadata.meta) {
    const node = document.createElement('meta');
    if (tag.name) node.setAttribute('name', tag.name);
    if (tag.property) node.setAttribute('property', tag.property);
    node.setAttribute('content', tag.content);
    append(node);
  }

  for (const tag of metadata.links) {
    const node = document.createElement('link');
    node.setAttribute('rel', tag.rel);
    node.setAttribute('href', tag.href);
    if (tag.hreflang) node.setAttribute('hreflang', tag.hreflang);
    append(node);
  }

  const structuredData = document.createElement('script');
  structuredData.type = 'application/ld+json';
  structuredData.textContent = JSON.stringify(metadata.jsonLd);
  append(structuredData);

  let active = true;
  return () => {
    if (!active) return;
    active = false;
    for (const node of managed) node.remove();
    for (const { node, nextSibling } of [...replaced].reverse()) {
      head.insertBefore(node, nextSibling?.parentNode === head ? nextSibling : null);
    }
    document.title = originalTitle;
    if (originalLanguage === null) {
      document.documentElement.removeAttribute('lang');
    } else {
      document.documentElement.setAttribute('lang', originalLanguage);
    }
  };
}
