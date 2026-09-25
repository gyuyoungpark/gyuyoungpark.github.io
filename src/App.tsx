import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { TagCloud } from '@/components/TagCloud';
import { FeaturesSection } from '@/components/FeaturesSection';
import { ColumnsSection } from '@/components/ColumnsSection';
import { ColumnArticle } from '@/components/ColumnArticle';
import { useEffect, useState } from 'react';
import { ProducersSection } from '@/components/ProducersSection';
import { CabinetSection } from '@/components/CabinetSection';
import { StatsSection } from '@/components/StatsSection';
import { articles, cabinetItems, producers } from '@/data/content';
import './App.css';

function App() {
  const [hash, setHash] = useState(window.location.hash);
  const isColumn = hash === '#/columns/electron-fluid';
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  useEffect(() => {
    if (!isColumn && hash.startsWith('#')) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    }
  }, [hash, isColumn]);
  return (
    <div className="min-h-screen text-zinc-900">
      <Header />
      <main className="site-shell bg-white">
        {isColumn ? <ColumnArticle /> : <>
        <Hero />
        <TagCloud />
        <FeaturesSection articles={articles} />
        <ColumnsSection />
        <ProducersSection producers={producers} />
        <CabinetSection items={cabinetItems} />
        <StatsSection />
        </>}
      </main>
    </div>
  );
}

export default App;

