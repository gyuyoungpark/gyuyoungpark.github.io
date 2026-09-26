import column from '@/data/columns/electron-fluid.json';

const tagStyles = [
  { backgroundColor: '#0072B2', color: '#ffffff' },
  { backgroundColor: '#56B4E9', color: '#111827' },
  { backgroundColor: '#E69F00', color: '#111827' },
];

export function ColumnsSection() {
  return (
    <section id="columns" lang="en" className="relative scroll-mt-28 border-b border-zinc-300 px-4 py-10 sm:px-6 lg:px-8">
      <span id="studies" className="absolute top-0 scroll-mt-28" aria-hidden="true" />
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Columns</h2>
      <div className="mt-6 grid gap-[7px] sm:grid-cols-2 xl:grid-cols-3">
        <article className="border-l border-t border-zinc-300 transition-colors hover:bg-zinc-50">
          <a href={`#/columns/${column.id}`} className="block h-full p-5" aria-label={column.titleEn}>
            <time dateTime={column.date} className="text-xs tabular-nums tracking-[0.08em] text-zinc-500">{column.date.replace(/-/g, '.')}</time>
            <h3 className="mt-3 text-xl font-semibold leading-8 text-zinc-900">{column.titleEn}</h3>
            <img src="/images/columns/electron-fluid.svg" alt="Electron fluid flowing slowly near the channel walls and faster in the center" width="640" height="360" className="mt-5 w-full" />
            <ul aria-label="Topics" className="mt-4 flex flex-wrap gap-2">
              {column.tags.map((tag, index) => (
                <li key={tag} className="inline-flex w-fit rounded-md border-l border-t border-zinc-300 px-3 py-1.5 text-sm leading-5" style={tagStyles[index % tagStyles.length]}>
                  {tag}
                </li>
              ))}
            </ul>
          </a>
        </article>
      </div>
    </section>
  );
}
