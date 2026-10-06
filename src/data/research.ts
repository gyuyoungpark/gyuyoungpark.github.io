import type { Article } from '@/types';
import papers from './research-papers.json';
import summaries from './research-summaries.json';

const summariesById = new Map(summaries.map((summary) => [summary.id, summary.paragraphs]));

export const researchArticles: Article[] = papers.map((paper): Article => ({
  ...paper,
  authors: paper.authors.map((name, index) => ({ id: `${paper.id}-author-${index}`, name })),
  description: paper.caption,
  summary: summariesById.get(paper.id),
  status: paper.status === 'preprint' ? 'preprint' : 'published',
})).sort((first, second) => (second.date ?? '').localeCompare(first.date ?? ''));
