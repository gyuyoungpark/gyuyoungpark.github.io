import type { Article } from '@/types';
import papers from './research-papers.json';

export const researchArticles: Article[] = papers.map((paper): Article => ({
  ...paper,
  authors: [],
  description: paper.caption,
  status: paper.status === 'preprint' ? 'preprint' : 'published',
})).sort((first, second) => (second.date ?? '').localeCompare(first.date ?? ''));
