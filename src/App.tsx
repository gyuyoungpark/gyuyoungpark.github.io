import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { TagCloud } from '@/components/TagCloud';
import { FeaturesSection } from '@/components/FeaturesSection';
import { ColumnsSection } from '@/components/ColumnsSection';
import { ColumnArticle } from '@/components/ColumnArticle';
import { useEffect, useRef, useState } from 'react';
import { ActivitiesSection } from '@/components/ActivitiesSection';
import { articles, activities } from '@/data/content';
import { columns, getColumnById } from '@/data/columns';
import { filterByKeywords, keywordSelectionHref, keywordsFromHash, toggleKeyword } from '@/lib/keywords';
import { KeywordSelectionContext } from '@/lib/keywordSelection';
import './App.css';

function columnIdFromHash(hash: string) {
  if (!hash.startsWith('#/columns/')) return '';
  try {
    return decodeURIComponent(hash.slice('#/columns/'.length));
  } catch {
    return '';
  }
}

function savedKeywords(state: unknown): string[] | undefined {
  const saved = (state as { keywordSelection?: unknown } | null)?.keywordSelection;
  return Array.isArray(saved) && saved.every((value) => typeof value === 'string') ? saved : undefined;
}

function App() {
  const [hash, setHash] = useState(window.location.hash);
  const [selectedKeywords, setSelectedKeywords] = useState(() => {
    const initialHash = window.location.hash;
    return initialHash.startsWith('#/keywords/') || initialHash === '#keywords' || !initialHash
      ? keywordsFromHash(initialHash) : savedKeywords(window.history.state) ?? [];
  });
  const selectionRef = useRef(selectedKeywords);
  const column = getColumnById(columnIdFromHash(hash));
  const isColumn = hash.startsWith('#/columns/') && Boolean(column);
  const filteredArticles = filterByKeywords(articles, selectedKeywords);
  const filteredColumns = filterByKeywords(columns, selectedKeywords);
  const filteredActivities = filterByKeywords(activities, selectedKeywords);
  const matchingCount = filteredArticles.length + filteredColumns.length + filteredActivities.length;

  function selectKeywords(keywords: string[]) {
    selectionRef.current = keywords;
    setSelectedKeywords(keywords);
    window.location.hash = keywordSelectionHref(keywords).slice(1);
  }

  useEffect(() => {
    function rememberSelection(keywords: string[]) {
      window.history.replaceState({ ...window.history.state, keywordSelection: keywords }, '');
    }
    rememberSelection(selectionRef.current);
    const onHashChange = () => {
      const nextHash = window.location.hash;
      setHash(nextHash);
      if (nextHash.startsWith('#/keywords/') || nextHash === '#keywords' || !nextHash) {
        selectionRef.current = keywordsFromHash(nextHash);
      }
      setSelectedKeywords(selectionRef.current);
      rememberSelection(selectionRef.current);
    };
    const onPopState = (event: PopStateEvent) => {
      const previous = savedKeywords(event.state);
      if (previous) {
        selectionRef.current = previous;
        setSelectedKeywords(previous);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);
  useEffect(() => {
    if (!isColumn && hash.startsWith('#')) {
      const target = hash.startsWith('#/keywords/') ? 'keywords' : hash.slice(1);
      const element = document.getElementById(target);
      element?.scrollIntoView();
      if (target === 'keywords') element?.focus({ preventScroll: true });
    }
  }, [hash, isColumn]);
  return (
    <KeywordSelectionContext.Provider value={selectedKeywords}>
    <div className="min-h-screen text-zinc-900">
      <Header />
      <main className="site-shell bg-white">
        {isColumn && column ? <ColumnArticle key={column.id} column={column} /> : <>
        <Hero />
        <TagCloud selectedKeywords={selectedKeywords} matchingCount={matchingCount}
          onToggle={(keyword) => selectKeywords(toggleKeyword(selectedKeywords, keyword))}
          onClear={() => selectKeywords([])} />
        <FeaturesSection articles={filteredArticles} />
        <ColumnsSection columns={filteredColumns} />
        <ActivitiesSection activities={filteredActivities} />
        </>}
      </main>
    </div>
    </KeywordSelectionContext.Provider>
  );
}

export default App;

