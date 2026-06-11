import { useEffect, useState } from 'react';
import { siteStats } from '@/data/content';

type VisitorState = {
  visitors: number | null;
  views: number | null;
  status: 'loading' | 'ok' | 'error';
};

function useVisitorCount(code: string): VisitorState {
  const [state, setState] = useState<VisitorState>({
    visitors: null,
    views: null,
    status: 'loading',
  });

  useEffect(() => {
    let cancelled = false;
    const url = `https://${code}.goatcounter.com/counter/TOTAL.json`;

    const toNumber = (value: unknown): number | null => {
      const n = Number(String(value ?? '').replace(/[^0-9]/g, ''));
      return Number.isFinite(n) && String(value ?? '').trim() !== '' ? n : null;
    };

    fetch(url, { headers: { Accept: 'application/json' } })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { count?: string; count_unique?: string }) => {
        if (cancelled) return;
        setState({
          visitors: toNumber(data.count_unique),
          views: toNumber(data.count),
          status: 'ok',
        });
      })
      .catch(() => {
        if (!cancelled) setState({ visitors: null, views: null, status: 'error' });
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  return state;
}

function StatCell({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[15px] font-medium leading-6 text-zinc-700">{label}</p>
      <p className="text-[28px] font-semibold leading-tight tracking-tight text-zinc-900 tabular-nums">
        {value}
      </p>
      {sub ? <p className="text-[13px] leading-5 text-zinc-500">{sub}</p> : null}
    </div>
  );
}

export function StatsSection() {
  const { visitors, views, status } = useVisitorCount(siteStats.goatcounterCode);
  const { scholar, scholarUrl } = siteStats;
  const fmt = (n: number | null) => (n === null ? '—' : n.toLocaleString('en-US'));

  const visitorValue = status === 'loading' ? '···' : fmt(visitors);
  const visitorSub =
    status === 'error'
      ? 'counter not enabled yet'
      : views !== null
        ? `${fmt(views)} pageviews`
        : 'unique visitors';

  return (
    <section
      id="stats"
      className="scroll-mt-28 border-t border-zinc-300 px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCell label="VISITORS" value={visitorValue} sub={visitorSub} />
        <StatCell label="DOCUMENTS" value={fmt(scholar.works)} sub="published works" />
        <StatCell label="CITATIONS" value={fmt(scholar.citations)} sub={`as of ${scholar.asOf}`} />
        <StatCell
          label="CITATION INDEX"
          value={`h ${scholar.hIndex} · i10 ${scholar.i10Index}`}
          sub="Google Scholar"
        />
      </div>

      <div className="mt-5">
        <a
          href={scholarUrl}
          target="_blank"
          rel="noreferrer"
          className="text-[13px] leading-5 text-zinc-500 underline-offset-2 transition-colors hover:text-black hover:underline"
        >
          Source: Google Scholar ↗
        </a>
      </div>
    </section>
  );
}
