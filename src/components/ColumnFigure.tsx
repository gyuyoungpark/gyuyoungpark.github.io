import { useId } from 'react';

const captions = [
  '왼쪽에서는 전자가 원자핵의 인력으로 휘어지며 핵에 운동량을 전달한다. 오른쪽에서는 전자끼리 운동량을 주고받지만 두 전자의 총운동량은 유지된다. 아래 청록색 화살표는 전자계의 운동량, 주황색은 원자핵이 받아가는 운동량이다.',
  '벽 가까이에서는 느리고 중앙에서는 빠른 전자 유체의 평균 흐름을 나타낸 도해다.',
  '채널 폭이 커지면서 개별 궤적이 중요한 탄도 수송, 점성에 의한 운동량 전달이 중요한 흐름, 내부 운동량 완화가 중요한 흐름으로 바뀌는 예다. 오른쪽에서는 중앙의 평균 속도가 거의 고르고 벽 근처에서 느려진다.',
  '같은 채널 폭과 점성 길이에서 곁방과 입구를 함께 키운 두 정상 전류장이다. 작은 곁방에는 닫힌 순환이 뚜렷하고, 큰 곁방의 주 흐름은 들어갔다 나오는 열린 경로다. 두 형상은 같은 공간 축척으로 그렸다.',
  '비선형 전기 응답은 흐름의 역학뿐 아니라 가열에 의해서도 나타날 수 있으므로, 원인을 분리해야 한다.',
];
const titles = [
  '원자핵으로의 운동량 전달과 전자 사이의 운동량 교환',
  '벽에서는 느리고 중앙에서는 빠른 흐름',
  '도선의 폭에 따라 달라지는 수송 영역',
  '곁방 안에서 생기고 사라지는 전류 소용돌이',
  '전압을 높일 때 함께 바뀔 수 있는 두 가지',
];
const blue = '#286b8a';

export function ColumnFigure({ number }: { number: number }) {
  const id = useId();
  if (number === 1) {
    return (
      <figure className="column-figure my-10 border-y border-zinc-300 py-5" aria-labelledby={`${id}-caption`}>
        <p className="mb-4 text-sm font-semibold text-zinc-800">그림 1. {titles[0]}</p>
        <img
          src="/images/columns/electron-fluid/figure-1-nuclear-scattering.svg"
          alt="왼쪽은 양전하 원자핵을 향해 휘는 전자의 궤적, 오른쪽은 서로 밀어내는 두 전자의 궤적. 아래 벡터는 원자핵으로의 운동량 전달과 전자계 총운동량 보존을 비교한다."
          width={1600}
          height={900}
          className="block h-auto w-full"
          loading="lazy"
          decoding="async"
        />
        <figcaption id={`${id}-caption`} className="mt-3 text-sm leading-6 text-zinc-500">
          {captions[0]}
          <span className="mt-2 block text-xs leading-5">
            무거운 원자핵의 반동 에너지를 무시한 도해다. 이 근사에서는 전자의 운동량 크기는 유지되고 처음 진행하던 방향의 성분이 줄어든다. 아래 벡터는 산란 전후 충분히 멀리 떨어진 상태의 운동량을 나타낸다.
          </span>
        </figcaption>
      </figure>
    );
  }
  if (number === 2) {
    return (
      <figure className="column-figure my-10 border-y border-zinc-300 py-5" aria-labelledby={`${id}-caption`}>
        <p className="mb-4 text-sm font-semibold text-zinc-800">그림 2. {titles[1]}</p>
        <img
          src="/images/columns/electron-fluid.svg"
          alt="채널의 벽 가까이에서는 짧고 중앙에서는 긴 화살표로 나타낸 전자 유체의 평균 흐름"
          width={640}
          height={360}
          className="block h-auto w-full"
          loading="lazy"
          decoding="async"
        />
        <figcaption id={`${id}-caption`} className="mt-3 text-sm leading-6 text-zinc-500">
          {captions[1]}
          <span className="mt-2 block text-xs leading-5">
            화살표는 전자의 평균 흐름 방향과 상대적 속도를 개념적으로 나타내며, 관습적인 전류 방향은 반대다.
          </span>
        </figcaption>
      </figure>
    );
  }
  if (number === 3) {
    return (
      <figure className="column-figure my-10 border-y border-zinc-300 py-5" aria-labelledby={`${id}-caption`}>
        <p className="mb-4 text-sm font-semibold text-zinc-800">그림 3. {titles[2]}</p>
        <img
          src="/images/columns/electron-fluid/figure-3-transport-regimes.svg"
          alt="폭이 다른 세 채널에서 탄도 궤적, 중앙이 빠른 점성 흐름, 중앙의 속도가 거의 고른 내부 운동량 완화 지배 흐름을 비교한다. 아래 화살표는 채널 폭의 증가를 나타낸다."
          width={1600}
          height={900}
          className="block h-auto w-full"
          loading="lazy"
          decoding="async"
        />
        <figcaption id={`${id}-caption`} className="mt-3 text-sm leading-6 text-zinc-500">
          {captions[2]}
          <span className="mt-2 block text-xs leading-5">
            회색 점선은 개별 궤적의 도식이고, 청록색 화살표는 각 패널의 중앙 속도로 정규화한 전자의 평균 흐름이다. 관습적인 전류 방향은 반대다. 채널 폭은 실제 비율대로 그리지 않았다. 작은 구동에서는 세 영역 모두 선형 응답이 가능하며, 오른쪽에서도 빈번한 전자 간 충돌과 국소 평형은 유지될 수 있다.
          </span>
        </figcaption>
      </figure>
    );
  }
  if (number === 4) {
    return (
      <figure className="column-figure my-10 border-y border-zinc-300 py-5" aria-labelledby={`${id}-caption`}>
        <p className="mb-4 text-sm font-semibold text-zinc-800">그림 4. {titles[3]}</p>
        <img
          src="/images/columns/electron-fluid/figure-4-cavity-flow.svg"
          alt="같은 폭의 채널에 연결된 크기가 다른 두 곁방. 작은 곁방에는 반시계 방향의 닫힌 전류 순환이 있고, 큰 곁방에는 입구로 들어갔다 나오는 열린 유선이 있다."
          width={1600}
          height={900}
          className="block h-auto w-full"
          loading="lazy"
          decoding="async"
        />
        <figcaption id={`${id}-caption`} className="mt-3 text-sm leading-6 text-zinc-500">
          {captions[3]}
          <span className="mt-2 block text-xs leading-5">
            정상·선형 유체 모델의 예시다. 화살표는 관습적인 전류 방향이며 전자의 평균 이동 방향은 반대다. 선의 밀도와 면의 색은 전류 크기나 온도 값을 나타내지 않는다.
          </span>
        </figcaption>
      </figure>
    );
  }
  const marker = `url(#${id}-arrow)`;
  const arrow = (x1: number, y1: number, x2: number, y2: number, color = blue) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.5" markerEnd={marker} />
  );
  return (
    <figure className="column-figure my-10 border-y border-zinc-300 py-5" aria-labelledby={`${id}-caption`}>
      <p className="mb-4 text-sm font-semibold text-zinc-800">그림 {number}. {titles[number - 1]}</p>
      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={`그림 ${number} 개념도 (좁은 화면에서는 좌우로 스크롤)`}>
        <svg style={{ minWidth: 560 }} viewBox="0 0 640 290" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
          <title id={`${id}-title`}>{titles[number - 1]}</title>
          <desc id={`${id}-desc`}>{captions[number - 1]}</desc>
          <defs>
            <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
            </marker>
          </defs>
          {number === 5 && <>
            <rect x="210" y="10" width="220" height="44" rx="4" fill="#eae9e3" />
            <text x="320" y="38" textAnchor="middle" className="diagram-heading">전압·전류 증가</text>
            <path d="M 320 54 V 70 H 160 V 90 M 320 70 H 480 V 90" stroke="#71717a" strokeWidth="2" fill="none" markerEnd={marker} />
            <rect x="25" y="95" width="270" height="156" rx="4" fill="#e7eff3" />
            <rect x="345" y="95" width="270" height="156" rx="4" fill="#f1e9df" />
            <text x="160" y="125" textAnchor="middle" className="diagram-heading">흐름 속도 증가</text>
            <text x="160" y="152" textAnchor="middle">형상에 따른 대류 가속</text>
            <path d="M 75 175 Q 135 175 140 190 H 180 Q 185 175 245 175 M 75 225 Q 135 225 140 210 H 180 Q 185 225 245 225" fill="none" stroke="#949fa3" strokeWidth="3" />
            {arrow(90, 200, 230, 200)}
            <text x="480" y="125" textAnchor="middle" className="diagram-heading">줄가열</text>
            <text x="480" y="155" textAnchor="middle">↓</text>
            <text x="480" y="180" textAnchor="middle">전자 온도 상승</text>
            <text x="480" y="208" textAnchor="middle">↓</text>
            <text x="480" y="235" textAnchor="middle">산란률·점성 변화</text>
            <text x="320" y="280" textAnchor="middle">전류–전압 곡선의 비선형성만으로는 원인을 구별할 수 없음</text>
          </>}
        </svg>
      </div>
      <figcaption id={`${id}-caption`} className="mt-3 text-sm leading-6 text-zinc-500">{captions[number - 1]}</figcaption>
      {number === 5 && <p className="mt-2 text-xs leading-5 text-zinc-500">화살표와 유선은 전류밀도 방향을 나타냅니다. 개별 전자의 궤적이 아니며, 전자의 평균 이동 방향은 반대입니다.</p>}
    </figure>
  );
}
