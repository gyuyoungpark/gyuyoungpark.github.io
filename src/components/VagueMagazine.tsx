import { useEffect, useMemo, useState } from 'react';
import { columns, type Column, type ColumnLanguage } from '@/data/columns';
import { contentHref } from '@/lib/contentRoutes';
import { VagueLogo } from './VagueLogo';
import './VagueMagazine.css';

const magazineText = {
  en: {
    home: 'Gyuyoung Park',
    introduction: 'Physics and chemistry, beginning with familiar questions.',
    topics: 'Explore a topic',
    all: 'All stories',
    latest: 'Latest story',
    more: 'Also in VAGUE',
    read: 'Read the story',
    clear: 'Clear topic',
    language: 'Magazine language',
    footer: 'A science magazine by Gyuyoung Park.',
  },
  ko: {
    home: 'Gyuyoung Park',
    introduction: '물리와 화학, 익숙한 질문에서 시작하는 과학 이야기.',
    topics: '주제로 둘러보기',
    all: '전체 글',
    latest: '가장 최근 이야기',
    more: '함께 읽을 이야기',
    read: '이야기 읽기',
    clear: '선택 해제',
    language: '매거진 언어',
    footer: '박규영의 과학 매거진.',
  },
};

function storyHref(column: Column, language: ColumnLanguage) {
  const href = contentHref('columns', column.id);
  return language === 'ko' && href.startsWith('/columns/') ? `${href}ko/` : href;
}

function storyDescription(column: Column, language: ColumnLanguage) {
  if (language === 'ko') return column.description;
  if (column.descriptionEn) return column.descriptionEn;
  const paragraph = column.blocks.find((block) => block.type === 'paragraph' && block.textEn);
  return paragraph && 'textEn' in paragraph ? paragraph.textEn : column.description;
}

function MagazineStory({ column, language, featured }: {
  column: Column;
  language: ColumnLanguage;
  featured: boolean;
}) {
  const text = magazineText[language];
  const title = language === 'ko' ? column.title : column.titleEn;
  return (
    <article className={`vm-story${featured ? ' vm-story--featured' : ''}`}>
      <a className="vm-story-link" href={storyHref(column, language)}>
        {column.thumbnail && (
          <div className="vm-story-image">
            <img src={column.thumbnail} alt={column.thumbnailAlt ?? ''} width="640" height="360"
              loading={featured ? 'eager' : 'lazy'} decoding="async" />
          </div>
        )}
        <div className="vm-story-copy">
          <div className="vm-story-meta">
            <span>{column.id === columns[0]?.id ? text.latest : text.more}</span>
            <time dateTime={column.date}>{column.date.replace(/-/g, '.')}</time>
          </div>
          <h2>{title}</h2>
          <p className="vm-story-description">{storyDescription(column, language)}</p>
          <ul className="vm-story-tags" lang="en" aria-label={language === 'ko' ? '글의 주제' : 'Story topics'}>
            {column.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          <span className="vm-story-read">{text.read}<span aria-hidden="true">→</span></span>
        </div>
      </a>
    </article>
  );
}

export function VagueMagazine() {
  const [language, setLanguage] = useState<ColumnLanguage>('en');
  const [topic, setTopic] = useState<string | null>(null);
  const text = magazineText[language];
  const topics = useMemo(() => [...new Set(columns.flatMap((column) => column.tags))], []);
  const stories = topic ? columns.filter((column) => column.tags.includes(topic)) : columns;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'VAGUE — Science Magazine';
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <div className="vague-magazine" lang={language}>
      <div className="vm-shell">
        <header className="vm-header">
          <div className="vm-topline">
            <a className="vm-home" href="/#columns"><span aria-hidden="true">←</span>{text.home}</a>
            <div className="vm-language" role="group" aria-label={text.language}>
              {(['en', 'ko'] as const).map((option) => (
                <button key={option} type="button" aria-pressed={language === option}
                  aria-label={option === 'en' ? 'English' : '한국어'}
                  onClick={() => setLanguage(option)}>{option === 'en' ? 'ENG' : 'KOR'}</button>
              ))}
            </div>
          </div>
          <h1 className="vm-masthead"><VagueLogo /></h1>
          <div className="vm-introduction">
            <p>{text.introduction}</p>
            <span lang="en">SCIENCE / IDEAS / EXPLORATION</span>
          </div>
        </header>

        <div className="vm-content">
          <section className="vm-topics" aria-labelledby="vm-topics-heading">
            <div className="vm-section-label">
              <h2 id="vm-topics-heading">{text.topics}</h2>
              <span aria-live="polite" aria-atomic="true">
                {language === 'ko' ? `${stories.length}개의 글` : `${stories.length} ${stories.length === 1 ? 'story' : 'stories'}`}
              </span>
            </div>
            <div className="vm-topic-buttons" role="group" aria-label={text.topics}>
              <button type="button" aria-pressed={topic === null} aria-controls="vm-stories"
                onClick={() => setTopic(null)}>{text.all}</button>
              {topics.map((item) => (
                <button key={item} type="button" lang="en" aria-pressed={topic === item} aria-controls="vm-stories"
                  onClick={() => setTopic(topic === item ? null : item)}>{item}</button>
              ))}
            </div>
            {topic && <button className="vm-clear-topic" type="button" onClick={() => setTopic(null)}>
              <span aria-hidden="true">×</span>{text.clear}
            </button>}
          </section>

          <section id="vm-stories" className="vm-stories" aria-label={text.all}>
            {stories.map((column, index) => (
              <MagazineStory key={column.id} column={column} language={language} featured={index === 0} />
            ))}
          </section>
        </div>

        <footer className="vm-footer">
          <a className="vm-home" href="/#columns"><span aria-hidden="true">←</span>{text.home}</a>
          <p>{text.footer}</p>
        </footer>
      </div>
    </div>
  );
}
