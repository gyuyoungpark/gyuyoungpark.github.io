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
import { contentRouteFromHash, contentRouteFromPath } from '@/lib/contentRoutes';
import './App.css';

function savedKeywords(state: unknown): string[] | undefined {
  const saved = (state as { keywordSelection?: unknown } | null)?.keywordSelection;
  return Array.isArray(saved) && saved.every((value) => typeof value === 'string') ? saved : undefined;
}

type AppLocation = { pathname: string; hash: string };

function browserLocation(): AppLocation {
  return typeof window === 'undefined' ? { pathname: '/', hash: '' }
    : { pathname: window.location.pathname ?? '/', hash: window.location.hash };
}

function App({ initialLocation }: { initialLocation?: AppLocation } = {}) {
  const [location, setLocation] = useState(initialLocation ?? browserLocation);
  const { pathname, hash } = location;
  const [selectedKeywords, setSelectedKeywords] = useState(() => {
    const initialHash = location.hash;
    return location.pathname === '/' && (initialHash.startsWith('#/keywords/') || initialHash === '#keywords' || !initialHash)
      ? keywordsFromHash(initialHash) : typeof window === 'undefined' ? [] : savedKeywords(window.history.state) ?? [];
  });
  const selectionRef = useRef(selectedKeywords);
  const route = contentRouteFromPath(pathname) ?? contentRouteFromHash(hash);
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
      const next = browserLocation();
      const nextHash = next.hash;
      setLocation(next);
      if (next.pathname === '/' && (nextHash.startsWith('#/keywords/') || nextHash === '#keywords' || !nextHash)) {
        selectionRef.current = keywordsFromHash(nextHash);
      }
      setSelectedKeywords(selectionRef.current);
      rememberSelection(selectionRef.current);
    };
    const onPopState = (event: PopStateEvent) => {
      setLocation(browserLocation());
      const previous = savedKeywords(event.state);
      if (previous) {
        selectionRef.current = previous;
        setSelectedKeywords(previous);
      }
    };
    const onLinkClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const target = new URL(anchor.href, window.location.href);
      if (target.origin !== window.location.origin || target.search) return;
      const isPilot = Boolean(contentRouteFromPath(target.pathname));
      const isReturn = Boolean(contentRouteFromPath(window.location.pathname)) && target.pathname === '/' && target.hash.startsWith('#');
      if (!isPilot && !isReturn) return;
      // Local reference anchors keep native scrolling on the current article.
      if (target.pathname === window.location.pathname && target.hash) return;
      event.preventDefault();
      if (target.pathname === '/' && (target.hash.startsWith('#/keywords/') || target.hash === '#keywords')) {
        selectionRef.current = keywordsFromHash(target.hash);
      }
      const nextUrl = `${target.pathname}${target.hash}`;
      if (nextUrl !== `${window.location.pathname}${window.location.hash}`) {
        window.history.pushState({ keywordSelection: selectionRef.current }, '', nextUrl);
      }
      setLocation({ pathname: target.pathname, hash: target.hash });
      setSelectedKeywords(selectionRef.current);
    };
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onPopState);
    document.addEventListener('click', onLinkClick);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onPopState);
      document.removeEventListener('click', onLinkClick);
    };
  }, []);
  useEffect(() => {
    if (!isDetail && hash.startsWith('#')) {
      const target = hash.startsWith('#/keywords/') ? 'keywords' : hash.slice(1);
      const element = document.getElementById(target);
      element?.scrollIntoView();
      if (target === 'keywords') element?.focus({ preventScroll: true });
    }
  }, [hash, pathname, isDetail]);
  return (
    <KeywordSelectionContext.Provider value={selectedKeywords}>
    <div className="min-h-screen text-zinc-900">
      <Header bordered={!isDetail} />
      <main className="site-shell bg-white">
        {route ? column ? <ColumnArticle key={`${column.id}-${route.language ?? 'en'}`} column={column} initialLanguage={route.language} />
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

