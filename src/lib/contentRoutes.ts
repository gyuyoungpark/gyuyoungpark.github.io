export type ContentSection = 'research' | 'activities' | 'columns' | 'achievements';

export function contentHref(section: ContentSection, id: string): string {
  return `/#/${section}/${encodeURIComponent(id)}`;
}

export function contentRouteFromHash(hash: string): { section: ContentSection; id: string } | null {
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
