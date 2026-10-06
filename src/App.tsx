import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { TagCloud } from '@/components/TagCloud';
import { FeaturesSection } from '@/components/FeaturesSection';
import { ColumnsSection } from '@/components/ColumnsSection';
import { ColumnArticle } from '@/components/ColumnArticle';
import { ContentArticle } from '@/components/ContentArticle';
import { AchievementsSection } from '@/components/AchievementsSection';
import { AchievementArticle } from '@/components/AchievementArticle';
import { useEffect, useRef, useState } from 'react';
import { ActivitiesSection } from '@/components/ActivitiesSection';
import { articles, activities, achievements } from '@/data/content';
import { columns, getColumnById } from '@/data/columns';
import { filterByKeywords, keywordSelectionHref, keywordsFromHash, toggleKeyword } from '@/lib/keywords';
import { KeywordSelectionContext } from '@/lib/keywordSelection';
import { contentRouteFromHash } from '@/lib/contentRoutes';
import './App.css';

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
  const route = contentRouteFromHash(hash);
  const column = route?.section === 'columns' ? getColumnById(route.id) : undefined;
  const item = route?.section === 'research' ? articles.find((article) => article.id === route.id)
    : route?.section === 'activities' ? activities.find((activity) => activity.id === route.id) : undefined;
  const achievement = route?.section === 'achievements' ? achievements.find((record) => record.id === route.id) : undefined;
  const isDetail = Boolean(route);
  const filteredArticles = filterByKeywords(articles, selectedKeywords);
  const filteredColumns = filterByKeywords(columns, selectedKeywords);
  const filteredActivities = filterByKeywords(activities, selectedKeywords);
  const filteredAchievements = filterByKeywords(achievements, selectedKeywords);
  const matchingCount = filteredArticles.length + filteredColumns.length + filteredActivities.length + filteredAchievements.length;

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
    if (!isDetail && hash.startsWith('#')) {
      const target = hash.startsWith('#/keywords/') ? 'keywords' : hash.slice(1);
      const element = document.getElementById(target);
      element?.scrollIntoView();
      if (target === 'keywords') element?.focus({ preventScroll: true });
    }
  }, [hash, isDetail]);
  return (
    <KeywordSelectionContext.Provider value={selectedKeywords}>
    <div className="min-h-screen text-zinc-900">
      <Header bordered={!isDetail} />
      <main className="site-shell bg-white">
        {route ? column ? <ColumnArticle key={column.id} column={column} />
          : item ? <ContentArticle key={`${route.section}-${item.id}`} item={item} />
          : achievement ? <AchievementArticle key={achievement.id} achievement={achievement} />
          : <article className="mx-auto max-w-[820px] px-5 py-14 sm:px-10">
            <h1 className="text-3xl font-semibold">Page not found</h1>
            <a href="/#top" className="mt-6 inline-block text-sm underline underline-offset-4">Back to home</a>
          </article> : <>
        <Hero />
        <TagCloud selectedKeywords={selectedKeywords} matchingCount={matchingCount}
          onToggle={(keyword) => selectKeywords(toggleKeyword(selectedKeywords, keyword))}
          onClear={() => selectKeywords([])} />
        <FeaturesSection articles={filteredArticles} />
        <ColumnsSection columns={filteredColumns} />
        <ActivitiesSection activities={filteredActivities} />
        <AchievementsSection achievements={filteredAchievements} />
        </>}
      </main>
    </div>
    </KeywordSelectionContext.Provider>
  );
}

export default App;

