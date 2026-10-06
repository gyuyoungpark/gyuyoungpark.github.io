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
  return keywordSelectionHref([label]);
}

export function keywordSelectionHref(labels: readonly string[]): string {
  const ids = [...new Set(labels.map(normalizeKeyword).filter(Boolean))];
  return ids.length ? `/#/keywords/${ids.map(encodeURIComponent).join(',')}` : '/#keywords';
}

export function keywordsFromHash(hash: string): string[] {
  const prefix = '#/keywords/';
  if (!hash.startsWith(prefix)) return [];
  try {
    return [...new Set(hash.slice(prefix.length).split(',')
      .map((part) => normalizeKeyword(decodeURIComponent(part))).filter(Boolean))];
  } catch {
    return [];
  }
}

export function keywordFromHash(hash: string): string | null {
  return keywordsFromHash(hash)[0] ?? null;
}

export function toggleKeyword(selected: readonly string[], label: string): string[] {
  const id = normalizeKeyword(label);
  const ids = [...new Set(selected.map(normalizeKeyword).filter(Boolean))];
  if (!id) return ids;
  return ids.includes(id) ? ids.filter((keyword) => keyword !== id) : [...ids, id];
}

export function filterByKeywords<T extends { tags: readonly (string | { name: string })[] }>(
  items: readonly T[], selected: readonly string[],
): T[] {
  const ids = [...new Set(selected.map(normalizeKeyword).filter(Boolean))];
  return items.filter((item) => {
    const topics = new Set(item.tags.map((tag) =>
      normalizeKeyword(typeof tag === 'string' ? tag : tag.name),
    ));
    return ids.every((id) => topics.has(id));
  });
}

// RGB samples from the centers of the 90 swatches in the supplied Munsell chart.
export const keywordPalette = [
  // Red and neutral swatches (left column).
  '#F85B49',
  '#F55279',
  '#C05348',
  '#874C46',
  '#BB896B',
  '#E9A052',
  '#E1A47B',
  '#E88B68',
  '#FB8C66',
  '#FF8889',
  '#FFCB91',
  '#A97382',
  '#EC66AF',
  '#EC6A8F',
  '#F18AA8',
  '#F58BC6',
  '#FED8E1',
  '#FCDAE1',
  '#E7624B',
  '#AE6442',
  '#BD8292',
  '#F2EDD1',
  '#F5EFD8',
  '#EDDCBB',
  '#FDFDF9',
  '#0B0B0B',
  '#89877D',
  '#BDBDBA',
  '#5A5850',
  '#7A6670',
  '#F4F9F0',
  // Yellow, green and blue swatches (middle column).
  '#FAE71F',
  '#F5C858',
  '#DDE900',
  '#FEFECE',
  '#F9FA83',
  '#EECF2B',
  '#FFAC4D',
  '#EFD986',
  '#FF9723',
  '#C57525',
  '#E7DA46',
  '#9F6C2E',
  '#F7DF44',
  '#EBA289',
  '#C09B74',
  '#FFB800',
  '#C6EA64',
  '#EAF599',
  '#008C6F',
  '#008B5D',
  '#29A036',
  '#255444',
  '#5ECBB1',
  '#92E7DD',
  '#444E9D',
  '#00655A',
  '#00B36C',
  '#2A4425',
  '#61697E',
  '#678EB4',
  // Blue, green and purple swatches (right column).
  '#1A2B6B',
  '#007FCE',
  '#6CB6E0',
  '#207CA6',
  '#2EC6B6',
  '#745CAB',
  '#3B5E9E',
  '#2C4061',
  '#222D50',
  '#392356',
  '#5B3677',
  '#6A6A9C',
  '#483355',
  '#292962',
  '#3B7F37',
  '#00AD45',
  '#309332',
  '#539F1E',
  '#8C3B59',
  '#A13B69',
  '#BB4CA4',
  '#875391',
  '#6F3F60',
  '#6C3EA0',
  '#9BB1E0',
  '#C1A7D5',
  '#C3AFC0',
  '#594037',
  '#DF879D',
] as const;

// Choose once per normalized keyword, so all badges agree until the next page load.
const keywordColors = new Map<string, string>();

export function keywordTextColor(hex: string): '#000000' | '#FFFFFF' {
  const channels = [1, 3, 5].map((offset) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  const blackContrast = (luminance + 0.05) / 0.05;
  const whiteContrast = 1.05 / (luminance + 0.05);
  return blackContrast >= whiteContrast ? '#000000' : '#FFFFFF';
}

export function keywordStyle(label: string): { backgroundColor: string; color: string } {
  const key = normalizeKeyword(label);
  let backgroundColor = keywordColors.get(key);
  if (backgroundColor === undefined) {
    backgroundColor = keywordPalette[Math.floor(Math.random() * keywordPalette.length)];
    keywordColors.set(key, backgroundColor);
  }
  return { backgroundColor, color: keywordTextColor(backgroundColor) };
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

  return Array.from(index.values()).filter((keyword) => keyword.contents.length > 0);
}
