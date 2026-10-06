import { useEffect, useRef } from 'react';
import type { Achievement } from '@/types';
import { KeywordTags } from './KeywordTags';

export function AchievementArticle({ achievement }: { achievement: Achievement }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${achievement.title} | Gyuyoung Park`;
    window.scrollTo({ top: 0, behavior: 'instant' });
    titleRef.current?.focus({ preventScroll: true });
    return () => { document.title = previousTitle; };
  }, [achievement.title]);

  return (
    <article lang="en" className="mx-auto max-w-[820px] px-5 py-10 sm:px-10 sm:py-14">
      <a href="/#achievements" className="mb-6 inline-block text-sm text-zinc-600 hover:text-black">← Back to Achievements</a>
      <p className="mb-4 text-sm leading-6 text-zinc-500">{achievement.dateLabel}</p>
      <h1 ref={titleRef} tabIndex={-1} className="text-3xl font-semibold leading-snug tracking-tight outline-none sm:text-4xl">{achievement.title}</h1>
      {achievement.organization && <p className="mt-6 text-base leading-8 text-zinc-700">{achievement.organization}</p>}
      <KeywordTags tags={achievement.tags} className="mt-8" />
    </article>
  );
}
