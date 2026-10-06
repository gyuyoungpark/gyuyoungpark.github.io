import { useEffect, useRef, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import type { Column } from '@/data/columns';
import { ColumnFigure } from './ColumnFigure';
import { ColumnPaperFigure } from './ColumnPaperFigure';
import { ColumnReferences, ReferenceMark } from './ColumnReferences';
import { VagueLogo } from './VagueLogo';
import { KeywordTags } from './KeywordTags';
import { BackLink } from './BackLink';
import { formatDetailDate } from '@/lib/detailDate';
import { linkColumnParagraphs, type ColumnTextToken } from '@/lib/columnText';

function ArticleText({ tokens }: { tokens: ColumnTextToken[] }) {
  return tokens.map((token, index) => {
    if (token.type === 'strong') return <strong key={index} className="font-semibold text-zinc-900"><ArticleText tokens={token.children} /></strong>;
    if (token.type === 'math') return <span key={index} dangerouslySetInnerHTML={{ __html: katex.renderToString(token.text, { throwOnError: false, trust: false }) }} />;
    if (token.type === 'link') return (
      <a key={index} href={token.href} target="_blank" rel="noopener noreferrer"
        title={`${token.text} — Wikipedia (새 탭)`}
        className="underline decoration-zinc-400 decoration-dotted underline-offset-4 transition-colors hover:text-[#286b8a] hover:decoration-solid">
        {token.text}
      </a>
    );
    return token.text;
  });
}

export function ColumnArticle({ column }: { column: Column }) {
  const paragraphs = linkColumnParagraphs(column.blocks);
  const articleTitles = { en: column.titleEn, ko: column.title };
  const [language, setLanguage] = useState<'en' | 'ko'>('en');
  const titleRef = useRef<HTMLHeadingElement>(null);
  const title = articleTitles[language];
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | Gyuyoung Park`;
    return () => { document.title = previousTitle; };
  }, [title]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    titleRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <article lang={language} className="column-article mx-auto max-w-[820px] px-5 py-10 sm:px-10 sm:py-14">
      <header className="mb-10 border-b border-zinc-300 pb-8">
        <BackLink href="/#columns" className="mb-6"><VagueLogo /></BackLink>
        <time dateTime={column.date} className="mb-4 block text-xs tabular-nums tracking-[0.08em] text-zinc-500">{formatDetailDate(column.date)}</time>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-4">
          <h1 ref={titleRef} tabIndex={-1} className="min-w-0 flex-[1_1_260px] text-3xl font-semibold leading-snug tracking-tight outline-none focus-visible:outline-none sm:text-4xl">{title}</h1>
          <div role="group" aria-label="Article language" lang="en" className="inline-flex shrink-0 items-center gap-1 text-xs tracking-[0.08em]">
            {(['en', 'ko'] as const).map((option, index) => (
              <span key={option} className="inline-flex items-center gap-1">
                {index > 0 && <span aria-hidden="true" className="text-zinc-300">/</span>}
                <button type="button" onClick={() => setLanguage(option)} aria-pressed={language === option}
                  aria-label={option === 'en' ? 'English (ENG)' : '한국어 (KOR)'} aria-controls="column-content"
                  className={`px-2 py-2 transition-colors ${language === option ? 'font-semibold text-zinc-900 underline underline-offset-[6px]' : 'text-zinc-500 hover:text-zinc-700'}`}>
                  {option === 'en' ? 'ENG' : 'KOR'}
                </button>
              </span>
            ))}
          </div>
        </div>
      </header>
      <div id="column-content" className="column-body">
        {language === 'en' ? (
          <p className="text-base leading-8 text-zinc-500">The English version is coming soon. Select KOR to read the Korean version.</p>
        ) : column.blocks.map((block, index) => {
          if (block.type === 'figure') return <ColumnFigure key={index} number={block.number!} />;
          if (block.type === 'paperFigure') {
            const referenceIndex = column.references?.findIndex((reference) => reference.id === block.referenceId) ?? -1;
            return <ColumnPaperFigure key={index} columnId={column.id} block={block}
              reference={column.references?.[referenceIndex]} referenceNumber={referenceIndex + 1} />;
          }
          if (block.type === 'heading') return <h2 key={index} className="mb-6 mt-14 text-2xl font-semibold leading-relaxed">{block.text}</h2>;
          if (block.type === 'equation') return <div key={index} className="my-8 overflow-x-auto py-2" dangerouslySetInnerHTML={{ __html: katex.renderToString(block.text!, { displayMode: true, throwOnError: false, trust: false }) }} />;
          return <p key={index} className="mb-6 text-base leading-[1.95] text-zinc-700 sm:text-[17px]">
            <ArticleText tokens={paragraphs[index]} />
            {block.references?.map((referenceId) => {
              const referenceIndex = column.references?.findIndex((reference) => reference.id === referenceId) ?? -1;
              const reference = column.references?.[referenceIndex];
              return reference ? <ReferenceMark key={referenceId} columnId={column.id} reference={reference} number={referenceIndex + 1} /> : null;
            })}
          </p>;
        })}
      </div>
      <ColumnReferences columnId={column.id} references={column.references ?? []} />
      <footer className="mt-12 border-t border-zinc-300 pt-6">
        <KeywordTags tags={column.tags} className="mb-6" />
        <BackLink href="/#columns"><VagueLogo /></BackLink>
      </footer>
    </article>
  );
}
