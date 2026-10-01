import { articles, producers } from './content';
import { columns } from './columns';
import { buildKeywordIndex, normalizeKeyword, type KeywordContent } from '@/lib/keywords';

const themeKeywords = [
  'Magnetism',
  'Spintronics',
  'Chaos',
  'Magnetic Skyrmion',
  'Spin-Orbit Torque',
  'Probabilistic Computing',
];

export const keywordContents: KeywordContent[] = [
  ...articles.map((article): KeywordContent => ({
    id: article.id,
    title: article.title,
    section: 'Research',
    href: `/#research-item-${article.id}`,
    tags: article.tags,
  })),
  ...columns.map((column): KeywordContent => ({
    id: column.id,
    title: column.titleEn.trim() || column.title,
    section: 'VAGUE',
    href: `/#/columns/${encodeURIComponent(column.id)}`,
    tags: column.tags,
  })),
  ...producers.map((producer): KeywordContent => ({
    id: producer.id,
    title: producer.name,
    section: 'Activities',
    href: `/#activity-item-${producer.id}`,
    tags: producer.tags ?? [],
  })),
];

export const keywordIndex = buildKeywordIndex(keywordContents, themeKeywords);

export function getKeywordById(id: string) {
  return keywordIndex.find((keyword) => keyword.id === normalizeKeyword(id));
}
