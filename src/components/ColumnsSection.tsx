import column from '@/data/columns/electron-fluid.json';

export function ColumnsSection() {
  return (
    <section id="columns" lang="ko" className="relative scroll-mt-28 border-b border-zinc-300 px-4 py-10 sm:px-6 lg:px-8">
      <span id="studies" className="absolute top-0 scroll-mt-28" aria-hidden="true" />
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Columns</h2>
      <div className="mt-6 grid gap-[7px] sm:grid-cols-2 xl:grid-cols-3">
        <article className="border-l border-t border-zinc-300 transition-colors hover:bg-zinc-50">
          <a href={`#/columns/${column.id}`} className="block h-full p-5" aria-label={column.title}>
            <time dateTime={column.date} className="text-xs tabular-nums tracking-[0.08em] text-zinc-500">{column.date.replace(/-/g, '.')}</time>
            <h3 className="mt-3 text-xl font-semibold leading-8 text-zinc-900">{column.title}</h3>
            <img src="/images/columns/electron-fluid.svg" alt="채널 가장자리에서는 느리고 중앙에서는 빠르게 흐르는 전자 유체의 개념도" width="640" height="360" className="mt-5 w-full" />
          </a>
        </article>
      </div>
    </section>
  );
}
