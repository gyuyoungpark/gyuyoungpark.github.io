import { useId } from 'react';

const captions = [
  '왼쪽에서는 전자가 원자핵의 인력으로 휘어지며 핵에 운동량을 전달한다. 오른쪽에서는 전자끼리 운동량을 주고받지만 두 전자의 총운동량은 유지된다. 아래 청록색 화살표는 전자계의 운동량, 주황색은 원자핵이 받아가는 운동량이다.',
  '경계가 운동량을 흡수하고 점성이 그 영향을 내부로 전달하면, 이상적인 조건에서 포물선형 푸아죄유 흐름이 나타난다.',
  '수송 영역은 길이척도의 상대적 크기로 달라지며, 선형·비선형 여부는 이와 별도로 구분해야 한다.',
  '장치 크기와 운동량 전달 길이의 관계가 바뀌면 정상적인 전류 소용돌이가 나타나거나 사라질 수 있다.',
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
          {number === 2 && <>
            <text x="160" y="30" textAnchor="middle" className="diagram-heading">채널 안의 전류밀도</text>
            <path d="M 30 65 H 285 M 30 215 H 285" stroke="#949fa3" strokeWidth="7" />
            {[0, 1, 2, 3, 4, 5, 6].map(i => {
              const length = 150 * (1 - ((i - 3) / 3.5) ** 2);
              return <g key={i}>{arrow(65, 80 + i * 20, 65 + length, 80 + i * 20)}</g>;
            })}
            <text x="350" y="30" className="diagram-heading">이상적인 속도 분포</text>
            <text x="350" y="65">jₓ(y)</text>
            {arrow(365, 215, 605, 215, '#71717a')}{arrow(380, 230, 380, 70, '#71717a')}
            <path d="M 390 215 Q 490 -40 590 215" stroke={blue} strokeWidth="3" fill="none" />
            <text x="390" y="242" textAnchor="middle">벽</text><text x="490" y="242" textAnchor="middle">중앙</text><text x="590" y="242" textAnchor="middle">벽</text>
            <text x="612" y="220">y</text>
            <text x="320" y="278" textAnchor="middle">벽에서 평균 흐름 ≈ 0 · 내부 운동량 손실이 약한 경우</text>
          </>}
          {number === 3 && <>
            <text x="320" y="27" textAnchor="middle">ℓₑₑ ≪ Dν · 느린 내부 운동량 완화 · 운동량을 흡수하는 벽</text>
            <rect x="15" y="60" width="195" height="105" fill="#e7eff3" />
            <rect x="222" y="60" width="195" height="105" fill="#e5eee8" />
            <rect x="429" y="60" width="195" height="105" fill="#f1e9df" />
            <path d="M 216 50 V 180 M 423 50 V 180" stroke="#a1a1aa" strokeDasharray="4 6" />
            <text x="112" y="102" textAnchor="middle" className="diagram-heading">탄도 수송</text>
            <text x="320" y="102" textAnchor="middle" className="diagram-heading">점성 지배 수송</text>
            <text x="527" y="102" textAnchor="middle" className="diagram-heading">확산 지배 수송</text>
            <text x="112" y="140" textAnchor="middle">W ≪ ℓₑₑ</text>
            <text x="320" y="140" textAnchor="middle">ℓₑₑ ≪ W ≪ Dν</text>
            <text x="527" y="140" textAnchor="middle">W ≫ Dν</text>
            {arrow(25, 196, 615, 196, '#71717a')}
            <text x="320" y="220" textAnchor="middle">채널 폭 W 증가 · 경계는 점진적인 크로스오버</text>
            <rect x="15" y="240" width="609" height="38" rx="3" fill="#eae9e3" />
            <text x="320" y="265" textAnchor="middle">작은 구동에서는 세 영역 모두 선형 응답 가능</text>
          </>}
          {number === 4 && <>
            <text x="160" y="28" textAnchor="middle" className="diagram-heading">순환하는 전류가 있는 경우</text>
            <text x="480" y="28" textAnchor="middle" className="diagram-heading">더 큰 곁방과 입구</text>
            <path d="M 20 195 H 130 V 152 a 43 43 0 1 1 40 0 V 195 H 300 M 20 240 H 300" stroke="#949fa3" strokeWidth="3" fill="none" />
            <path d="M 340 195 H 425 V 171 a 75 75 0 1 1 110 0 V 195 H 620 M 340 240 H 620" stroke="#949fa3" strokeWidth="3" fill="none" />
            {[210, 227].map(y => <g key={y}>{arrow(35, y, 285, y)}{arrow(355, y, 605, y)}</g>)}
            <path d="M 150 102 A 25 25 0 1 1 149 102" stroke={blue} fill="none" strokeWidth="2.5" />
            {arrow(126, 123, 126, 115)}
            <path d="M 355 205 H 425 Q 480 150 535 205 H 605" stroke={blue} strokeWidth="2.5" fill="none" markerEnd={marker} />
            <text x="480" y="110" textAnchor="middle">닫힌 순환 없음</text>
            <text x="320" y="277" textAnchor="middle">동일한 Dν · 곁방 반경과 입구 폭을 함께 확대</text>
          </>}
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
      {[2, 4, 5].includes(number) && <p className="mt-2 text-xs leading-5 text-zinc-500">화살표와 유선은 전류밀도 방향을 나타냅니다. 개별 전자의 궤적이 아니며, 전자의 평균 이동 방향은 반대입니다.</p>}
    </figure>
  );
}
