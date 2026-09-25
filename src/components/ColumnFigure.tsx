import { useId } from 'react';

const figures = [
  {
    title: '운동량을 나누는 산란과 잃는 산란',
    kind: 'Schematic',
    caption: '개별 전자의 운동을 바꾸는 산란과 전자계 전체의 운동량을 줄이는 산란은 구별해야 한다. 화살표는 전류가 아니라 운동량을 나타낸다.',
  },
  {
    title: '벽에서는 느리고 중앙에서는 빠른 흐름',
    kind: 'Analytic model',
    caption: '균일한 밀도, no-slip 경계, 약한 내부 운동량 손실을 가정한 이상적인 푸아죄유 해다. 화살표 길이와 곡선은 같은 포물선 식으로 계산했다.',
  },
  {
    title: '도선의 폭에 따라 달라지는 수송 영역',
    kind: 'Schematic',
    caption: '수송 영역은 길이척도의 상대적 크기로 달라지며, 선형·비선형 여부는 이와 별도로 구분해야 한다. 경계 위치는 보편적인 임계값을 뜻하지 않는다.',
  },
  {
    title: '곁방과 입구의 크기에 따라 달라지는 전류 흐름',
    kind: 'Numerical model',
    caption: '주 채널 폭과 운동량 전달 길이를 고정한 선형 정상상태 모델의 계산 예시다. 작은 곁방에는 닫힌 순환이, 큰 곁방에는 주로 열린 흐름이 나타났다. 큰 곁방 입구의 미세한 순환은 격자 수렴이 확정되지 않아 소용돌이가 전혀 없다고 단정하지 않는다. 특정 그래핀 실험을 재현한 결과는 아니다.',
  },
  {
    title: '전압을 높일 때 함께 바뀔 수 있는 두 가지',
    kind: 'Schematic',
    caption: '비선형 전기 응답은 흐름의 역학뿐 아니라 가열에 의해서도 나타날 수 있으므로, 원인을 분리해야 한다. 두 효과는 함께 나타날 수 있다.',
  },
];

export function ColumnFigure({ number }: { number: number }) {
  const id = useId();
  const figure = figures[number - 1];
  if (!figure) return null;
  const source = `/images/columns/electron-fluid/figure-${number}.svg`;
  return (
    <figure className="column-figure my-10 border-y border-zinc-300 py-5" aria-labelledby={`${id}-caption`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-zinc-800">그림 {number}. {figure.title}</p>
        <span className="shrink-0 border border-zinc-300 px-2 py-1 text-[11px] text-zinc-500">{figure.kind}</span>
      </div>
      <a href={source} target="_blank" rel="noreferrer" aria-label={`그림 ${number} 크게 보기: ${figure.title}`} className="block bg-white">
        <img src={source} alt={figure.title} width="1600" height="900" loading="lazy" className="h-auto w-full" />
      </a>
      <figcaption id={`${id}-caption`} className="mt-3 text-sm leading-6 text-zinc-500">{figure.caption}</figcaption>
      {[2, 3, 4, 5].includes(number) && <p className="mt-2 text-xs leading-5 text-zinc-500">파란 화살표와 유선은 관습적인 전류 방향이며, 개별 전자의 궤적이 아닙니다.</p>}
    </figure>
  );
}
