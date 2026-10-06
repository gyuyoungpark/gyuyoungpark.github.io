import { wikipediaTerms, wikipediaTermsEn } from '../data/columns/wikipediaTerms';
import type { ColumnLanguage } from '../data/columns';

export type ColumnTextToken = {
  type: 'text' | 'math' | 'link';
  text: string;
  href?: string;
} | {
  type: 'strong';
  children: ColumnTextToken[];
};

// Parse the complete article once, so only the first occurrence is linked.
// Keep math separate and preserve text and whitespace inside emphasis.
export function linkColumnParagraphs(blocks: { type: string; text?: string }[], language: ColumnLanguage = 'ko') {
  const terms = language === 'en' ? wikipediaTermsEn : wikipediaTerms;
  const termMap = new Map(terms.map(({ term, href }) => [language === 'en' ? term.toLowerCase() : term, href]));
  const alternatives = terms.map(({ term }) => term).sort((a, b) => b.length - a.length)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const termPattern = new RegExp(language === 'en' ? `\\b(?:${alternatives})\\b` : alternatives, language === 'en' ? 'gi' : 'g');
  const seen = new Set<string>();

  function tokenize(text: string): ColumnTextToken[] {
    const tokens: ColumnTextToken[] = [];
    for (const part of text.split(/(\\\([\s\S]*?\\\)|\*\*[\s\S]+?\*\*)/g)) {
      if (part.startsWith('\\(')) {
        tokens.push({ type: 'math', text: part.slice(2, -2) });
        continue;
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        tokens.push({ type: 'strong', children: tokenize(part.slice(2, -2)) });
        continue;
      }
      let cursor = 0;
      for (const match of part.matchAll(termPattern)) {
        const index = match.index!;
        if (index > cursor) tokens.push({ type: 'text', text: part.slice(cursor, index) });
        const term = match[0];
        const href = termMap.get(language === 'en' ? term.toLowerCase() : term)!;
        const key = language === 'en' ? href : term;
        tokens.push(seen.has(key)
          ? { type: 'text', text: term }
          : { type: 'link', text: term, href });
        seen.add(key);
        cursor = index + term.length;
      }
      if (cursor < part.length) tokens.push({ type: 'text', text: part.slice(cursor) });
    }
    return tokens;
  }

  return blocks.map((block) => block.type === 'paragraph' ? tokenize(block.text ?? '') : []);
}
