import type { Activity } from '@/types';
import { ContentCard } from './ContentCard';

export function ActivitiesSection({ activities }: { activities: Activity[] }) {
  if (!activities.length) return null;
  return (
    <section id="activities" lang="en" className="trimmed-borders scroll-mt-28 px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Activities</h2>
      <div className="mt-6 grid gap-[7px] md:grid-cols-2 xl:grid-cols-3">
        {activities.map(activity => (
          <ContentCard
            key={activity.id}
            id={`activity-item-${activity.id}`}
            title={activity.title}
            href={activity.url}
            metadata={<>
              <span className="font-medium text-zinc-700">{activity.event}</span>
              <p><time dateTime={activity.date}>{activity.dateLabel ?? activity.date.replace(/-/g, '.')}</time> · {activity.kind}</p>
              {activity.location && <p>{activity.location}</p>}
            </>}
            image={activity.image}
            imageAlt={activity.imageAlt}
            caption={activity.caption}
            imageLabel={activity.imageLabel}
            imageSourceUrl={activity.imageSourceUrl}
            tags={activity.tags}
          />
        ))}
      </div>
    </section>
  );
}
