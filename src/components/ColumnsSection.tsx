import column from '@/data/columns/electron-fluid.json';
import { ArrowUpRight } from 'lucide-react';

export function ColumnsSection() {
  return (
    <section id="columns" lang="ko" className="relative scroll-mt-28 border-b border-zinc-300 px-4 py-10 sm:px-6 lg:px-8">
      <span id="studies" className="absolute top-0 scroll-mt-28" aria-hidden="true" />
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">칼럼</h2>
      <div className="mt-6 grid gap-[7px] sm:grid-cols-2 xl:grid-cols-3">
        <article className="border-l border-t border-zinc-300 transition-colors hover:bg-zinc-50">
          <a href={`#/columns/${column.id}`} className="group block h-full p-5">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-[11px] tracking-[0.12em]">물리 이야기 · 01</span>
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <h3 className="mt-3 text-xl font-semibold leading-8 text-zinc-900">{column.title}</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-600">{column.description}</p>
            <div className="mt-5 flex items-center justify-between border-t border-zinc-300 pt-3 text-xs text-zinc-500">
              <span>전자 유체 · 수송 · 점성</span>
              <span className="text-zinc-800">읽기 →</span>
            </div>
          </a>
        </article>
      </div>
    </section>
  );
}
