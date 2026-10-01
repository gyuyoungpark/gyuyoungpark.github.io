export interface KeywordContent {
  id: string;
  title: string;
  section: 'Research' | 'VAGUE' | 'Activities';
  href: string;
  tags: readonly (string | { name: string })[];
}

export interface KeywordEntry {
  id: string;
  label: string;
  contents: KeywordContent[];
}

function cleanLabel(value: string): string {
  return value.normalize('NFKC').trim().replace(/\s+/gu, ' ');
}

export function normalizeKeyword(value: string): string {
  return cleanLabel(value).toLowerCase();
}

export function keywordHref(label: string): string {
  return `/#/keywords/${encodeURIComponent(normalizeKeyword(label))}`;
}

export function keywordFromHash(hash: string): string | null {
  const prefix = '#/keywords/';
  if (!hash.startsWith(prefix)) return null;
  try {
    const keyword = normalizeKeyword(decodeURIComponent(hash.slice(prefix.length)));
    return keyword || null;
  } catch {
    return null;
  }
}

const palette = [
  { backgroundColor: '#0072B2', color: '#ffffff' },
  { backgroundColor: '#009E73', color: '#ffffff' },
  { backgroundColor: '#D55E00', color: '#ffffff' },
  { backgroundColor: '#CC79A7', color: '#ffffff' },
  { backgroundColor: '#E69F00', color: '#111827' },
  { backgroundColor: '#56B4E9', color: '#111827' },
] as const;

const establishedColors = new Map<string, number>([
  ['magnetism', 0],
  ['spintronics', 1],
  ['chaos', 2],
  ['magnetic skyrmion', 3],
  ['spin-orbit torque', 4],
  ['probabilistic computing', 5],
  ['electron hydrodynamics', 0],
  ['electron transport theory', 5],
  ['graphene', 4],
]);

export function keywordStyle(label: string): { backgroundColor: string; color: string } {
  const key = normalizeKeyword(label);
  const established = establishedColors.get(key);
  if (established !== undefined) return palette[established];

  // Hash the label itself so adding or reordering other tags never changes its color.
  let hash = 2166136261;
  for (const character of key) {
    hash = Math.imul(hash ^ character.codePointAt(0)!, 16777619) >>> 0;
  }
  return palette[hash % palette.length];
}

export function buildKeywordIndex(
  contentEntries: readonly KeywordContent[],
  seeds: readonly string[] = [],
): KeywordEntry[] {
  const index = new Map<string, KeywordEntry>();
  const linkedContents = new Map<string, Set<string>>();

  function register(label: string): KeywordEntry | undefined {
    const cleaned = cleanLabel(label);
    const id = normalizeKeyword(cleaned);
    if (!id) return undefined;
    if (!index.has(id)) {
      index.set(id, { id, label: cleaned, contents: [] });
      linkedContents.set(id, new Set());
    }
    return index.get(id);
  }

  seeds.forEach(register);
  for (const content of contentEntries) {
    const title = normalizeKeyword(content.title);
    if (!content.id.trim() || !content.href.trim() || !title || title === 'untitled') continue;

    // IDs belong to their section; Research item 1 and Activity item 1 are distinct.
    const contentKey = JSON.stringify([content.section, content.id]);
    for (const tag of content.tags) {
      const keyword = register(typeof tag === 'string' ? tag : tag.name);
      if (!keyword) continue;
      const linked = linkedContents.get(keyword.id)!;
      if (linked.has(contentKey)) continue;
      linked.add(contentKey);
      keyword.contents.push(content);
    }
  }

  return Array.from(index.values());
}
