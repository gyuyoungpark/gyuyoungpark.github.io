import { aboutContent, articles, cabinetItems, producers, tags } from '@/data/content';
import type { SiteContent } from '@/types';

const STORAGE_KEY = 'agp-site-content-v2';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function getDefaultSiteContent(): SiteContent {
  return clone({
    aboutDescription: aboutContent.description,
    tags,
    articles,
    producers,
    cabinetItems,
  });
}

export function loadSiteContent(): SiteContent {
  if (typeof window === 'undefined') {
    return getDefaultSiteContent();
  }

  const fallback = getDefaultSiteContent();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return {
      aboutDescription:
        typeof parsed.aboutDescription === 'string'
          ? parsed.aboutDescription
          : fallback.aboutDescription,
      tags: Array.isArray(parsed.tags) ? parsed.tags : fallback.tags,
      articles: Array.isArray(parsed.articles) ? parsed.articles : fallback.articles,
      producers: Array.isArray(parsed.producers) ? parsed.producers : fallback.producers,
      cabinetItems: Array.isArray(parsed.cabinetItems)
        ? parsed.cabinetItems
        : fallback.cabinetItems,
    };
  } catch {
    return fallback;
  }
}

export function saveSiteContent(content: SiteContent): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}
