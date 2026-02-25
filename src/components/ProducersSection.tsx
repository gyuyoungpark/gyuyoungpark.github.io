import type { Producer } from '@/types';

interface ProducersSectionProps {
  producers: Producer[];
}

export function ProducersSection({ producers }: ProducersSectionProps) {
  return (
    <section id="activities" className="scroll-mt-28 border-b border-zinc-300 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Activities</h2>
          <a
            href="#activities"
            className="text-xs font-medium tracking-[0.08em] text-zinc-600 transition-colors hover:text-black"
          >
            View all activities
          </a>
        </div>

        <div className="grid gap-0 sm:grid-cols-2 xl:grid-cols-4">
          {producers.map((producer) => (
            <a
              key={producer.id}
              href={`/producers/${producer.id}`}
              className="border-l border-t border-zinc-300 p-5 transition-colors hover:bg-zinc-50"
            >
              <p className="text-[10px] tracking-[0.12em] text-zinc-500">{producer.role}</p>
              <h3 className="mt-2 text-lg font-semibold text-zinc-900">{producer.name}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">{producer.bio}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
