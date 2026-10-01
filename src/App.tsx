import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { TagCloud } from '@/components/TagCloud';
import { FeaturesSection } from '@/components/FeaturesSection';
import { ColumnsSection } from '@/components/ColumnsSection';
import { ColumnArticle } from '@/components/ColumnArticle';
import { useEffect, useState } from 'react';
import { ProducersSection } from '@/components/ProducersSection';
import { StatsSection } from '@/components/StatsSection';
import { articles, producers } from '@/data/content';
import { getColumnById } from '@/data/columns';
import { keywordFromHash } from '@/lib/keywords';
import './App.css';

function columnIdFromHash(hash: string) {
  if (!hash.startsWith('#/columns/')) return '';
  try {
    return decodeURIComponent(hash.slice('#/columns/'.length));
  } catch {
    return '';
  }
}

function App() {
  const [hash, setHash] = useState(window.location.hash);
  const column = getColumnById(columnIdFromHash(hash));
  const isColumn = hash.startsWith('#/columns/') && Boolean(column);
  const selectedKeyword = keywordFromHash(hash);
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  useEffect(() => {
    if (!isColumn && hash.startsWith('#')) {
      const target = selectedKeyword !== null ? 'keywords' : hash.slice(1);
      const element = document.getElementById(target);
      element?.scrollIntoView();
      if (target === 'keywords') element?.focus({ preventScroll: true });
    }
  }, [hash, isColumn, selectedKeyword]);
  return (
    <div className="min-h-screen text-zinc-900">
      <Header />
      <main className="site-shell bg-white">
        {isColumn && column ? <ColumnArticle key={column.id} column={column} /> : <>
        <Hero />
        <TagCloud selectedKeyword={selectedKeyword} />
        <FeaturesSection articles={articles} />
        <ColumnsSection />
        <ProducersSection producers={producers} />
        <StatsSection />
        </>}
      </main>
    </div>
  );
}

export default App;

