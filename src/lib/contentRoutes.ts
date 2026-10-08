export type ContentSection = 'research' | 'activities' | 'columns' | 'achievements';
export type ContentRoute = { section: ContentSection; id: string; language?: 'en' | 'ko' };

const columnPathIds = new Set(['electron-fluid', 'molecular-handedness']);

export function contentHref(section: ContentSection, id: string): string {
  if (section === 'columns' && columnPathIds.has(id)) return `/columns/${id}/`;
  return `/#/${section}/${encodeURIComponent(id)}`;
}

export function contentRouteFromPath(pathname: string): ContentRoute | null {
  const match = /^\/columns\/([^/]+)\/(ko\/)?$/.exec(pathname);
  if (!match || !columnPathIds.has(match[1])) return null;
  return { section: 'columns', id: match[1], language: match[2] ? 'ko' : 'en' };
}

export function contentRouteFromHash(hash: string): ContentRoute | null {
  const match = /^#\/(research|activities|columns|achievements)\/([^/]+)$/.exec(hash);
  if (!match) return null;
  try {
    const id = decodeURIComponent(match[2]);
    return id.trim() ? { section: match[1] as ContentSection, id } : null;
  } catch {
    return null;
  }
}

export function doiHref(doi?: string): string | undefined {
  const identifier = doi?.trim().replace(/^(?:https?:\/\/(?:dx\.)?doi\.org\/|doi:\s*)/i, '');
  return identifier ? `https://doi.org/${identifier}` : undefined;
}
