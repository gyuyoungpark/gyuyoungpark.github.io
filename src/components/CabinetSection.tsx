import type { CabinetItem } from '@/types';

interface CabinetSectionProps {
  items: CabinetItem[];
}

export function CabinetSection({ items }: CabinetSectionProps) {
  return (
    <section id="collaborator" className="scroll-mt-28 border-b border-zinc-300 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Collaborator</h2>

        <div className="space-y-[7px]">
          {items.map((item) => (
            <a
              key={item.id}
              href={`/cabinet/${item.id}`}
              className="grid gap-3 border-l border-t border-zinc-300 p-5 transition-colors hover:bg-zinc-50 sm:grid-cols-[1.5fr_1fr_1fr]"
            >
              <div>
                <p className="text-[10px] tracking-[0.12em] text-zinc-500">{item.subtitle}</p>
                <h3 className="mt-2 text-lg font-semibold leading-7 text-zinc-900">{item.title}</h3>
              </div>

              <div className="text-sm text-zinc-600">
                <p>{item.author}</p>
                <p className="mt-1 text-zinc-500">{item.location}</p>
              </div>

              <div className="text-sm text-zinc-600">{item.description}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
