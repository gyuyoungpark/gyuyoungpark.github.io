import { articles, activities, achievements } from './content';
import { columns } from './columns';
import { buildKeywordIndex, normalizeKeyword, type KeywordContent } from '@/lib/keywords';
import { contentHref } from '@/lib/contentRoutes';

const themeKeywords = [
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
    href: contentHref('research', article.id),
    tags: article.tags,
  })),
  ...columns.map((column): KeywordContent => ({
    id: column.id,
    title: column.titleEn.trim() || column.title,
    section: 'VAGUE',
    href: contentHref('columns', column.id),
    tags: column.tags,
  })),
  ...activities.map((activity): KeywordContent => ({
    id: activity.id,
    title: activity.title,
    section: 'Activities',
    href: contentHref('activities', activity.id),
    tags: activity.tags,
  })),
  ...achievements.map((achievement): KeywordContent => ({
    id: achievement.id,
    title: achievement.title,
    section: 'Achievements',
    href: contentHref('achievements', achievement.id),
    tags: achievement.tags,
  })),
];

export const keywordIndex = buildKeywordIndex(keywordContents, themeKeywords);

export function getKeywordById(id: string) {
  return keywordIndex.find((keyword) => keyword.id === normalizeKeyword(id));
}
