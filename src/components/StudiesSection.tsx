import type { StudyItem } from '@/types';

interface StudiesSectionProps {
  studies: StudyItem[];
}

export function StudiesSection({ studies }: StudiesSectionProps) {
  return (
    <section id="studies" className="scroll-mt-28 border-b border-zinc-300 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Studies</h2>

        {studies.length === 0 ? (
          <p className="text-sm leading-6 text-zinc-500">Content coming soon.</p>
        ) : (
          <div className="grid gap-[7px] sm:grid-cols-2 xl:grid-cols-3">
            {studies.map((study) => (
              <div
                key={study.id}
                className="border-l border-t border-zinc-300 p-5 transition-colors hover:bg-zinc-50"
              >
                {study.subtitle && (
                  <p className="text-[10px] tracking-[0.12em] text-zinc-500">{study.subtitle}</p>
                )}
                <h3 className="mt-2 text-lg font-semibold leading-7 text-zinc-900">{study.title}</h3>
                {study.period && <p className="mt-1 text-sm text-zinc-500">{study.period}</p>}
                {study.description && (
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{study.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
