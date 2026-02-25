import { footerCredits } from '@/data/content';

export function Footer() {
  return (
    <footer className="pb-10">
      <div className="site-shell border-t border-zinc-300 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-200 pb-4">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-500">ARCHIVE</p>
              <p className="text-2xl font-semibold tracking-tight text-zinc-900">
                Archive of Gyuyoung Park
              </p>
            </div>
          </div>

          <div className="grid gap-0 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div className="border-l border-t border-zinc-300 p-4">
              <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-zinc-500">SECTIONS</p>
              <ul className="space-y-1 text-zinc-700">
                <li><a href="#keywords" className="hover:text-black">Keywords</a></li>
                <li><a href="#research" className="hover:text-black">Research</a></li>
                <li><a href="#activities" className="hover:text-black">Activities</a></li>
                <li><a href="#network" className="hover:text-black">Network</a></li>
              </ul>
            </div>

            <div className="border-l border-t border-zinc-300 p-4">
              <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-zinc-500">PUBLISHING</p>
              <p className="text-zinc-700">{footerCredits.publisherOrg}</p>
              <p className="mt-1 text-zinc-600">ISSN {footerCredits.issn}</p>
              <p className="mt-1 text-zinc-600">Typeface {footerCredits.typeface}</p>
            </div>

            <div className="border-l border-t border-zinc-300 p-4">
              <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-zinc-500">CREDIT</p>
              <p className="text-zinc-700">{footerCredits.publisher}</p>
              <p className="mt-1 text-zinc-600">Editor {footerCredits.editors[0]?.name}</p>
              <p className="mt-1 text-zinc-600">Web {footerCredits.webDirector.name}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-zinc-200 pt-4">
          <p className="text-xs leading-6 text-zinc-500">{footerCredits.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
