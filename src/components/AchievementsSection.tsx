import type { Achievement } from '@/types';
import { contentHref } from '@/lib/contentRoutes';

export function AchievementsSection({ achievements }: { achievements: Achievement[] }) {
  if (!achievements.length) return null;
  return (
    <section id="achievements" lang="en" className="trimmed-borders scroll-mt-28 px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Achievements</h2>
      <div className="mt-6 grid gap-[7px] sm:grid-cols-2 xl:grid-cols-4">
        {achievements.map((achievement) => (
          <article key={achievement.id} id={`achievement-item-${achievement.id}`} className="trimmed-borders bg-white p-4">
            <a href={contentHref('achievements', achievement.id)} className="block after:absolute after:inset-0 after:content-['']">
              <p className="text-xs leading-5 text-zinc-500">{achievement.dateLabel}</p>
              <h3 className="mt-2 text-base font-semibold leading-6 text-zinc-900">{achievement.title}</h3>
              {achievement.organization && <p className="mt-2 text-xs leading-5 text-zinc-600">{achievement.organization}</p>}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
