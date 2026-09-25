import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import column from '@/data/columns/electron-fluid.json';
import { ColumnFigure } from './ColumnFigure';
import { linkColumnParagraphs, type ColumnTextToken } from '@/lib/columnText';

const paragraphs = linkColumnParagraphs(column.blocks);

function ArticleText({ tokens }: { tokens: ColumnTextToken[] }) {
  return tokens.map((token, index) => {
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

export function ColumnArticle() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${column.title} | Gyuyoung Park`;
    window.scrollTo({ top: 0, behavior: 'instant' });
    titleRef.current?.focus({ preventScroll: true });
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <article lang="ko" className="column-article mx-auto max-w-[820px] px-5 py-10 sm:px-10 sm:py-14">
      <header className="mb-10 border-b border-zinc-300 pb-8">
        <time dateTime={column.date} className="mb-4 block text-xs tabular-nums tracking-[0.08em] text-zinc-500">{column.date.replace(/-/g, '.')}</time>
        <h1 ref={titleRef} tabIndex={-1} className="text-3xl font-semibold leading-snug tracking-tight outline-none sm:text-4xl">{column.title}</h1>
      </header>
      <div className="column-body">
        {column.blocks.map((block, index) => {
          if (block.type === 'figure') return <ColumnFigure key={index} number={block.number!} />;
          if (block.type === 'heading') return <h2 key={index} className="mb-6 mt-14 text-2xl font-semibold leading-relaxed">{block.text}</h2>;
          if (block.type === 'equation') return <div key={index} className="my-8 overflow-x-auto py-2" dangerouslySetInnerHTML={{ __html: katex.renderToString(block.text!, { displayMode: true, throwOnError: false, trust: false }) }} />;
          return <p key={index} className="mb-6 text-base leading-[1.95] text-zinc-700 sm:text-[17px]"><ArticleText tokens={paragraphs[index]} /></p>;
        })}
      </div>
      <footer className="mt-12 border-t border-zinc-300 pt-6">
        <a href="/#columns" className="text-sm text-zinc-600 hover:text-black">Back to Columns</a>
      </footer>
    </article>
  );
}
