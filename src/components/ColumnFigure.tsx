import { useId } from 'react';
import type { ColumnLanguage } from '@/data/columns';

const figures = [
  {
    src: '/images/columns/electron-fluid/figure-1-nuclear-scattering.svg',
    width: 1600,
    height: 900,
    ko: {
      title: '원자핵에 전달되는 운동량과 전자끼리 주고받는 운동량',
      caption: '왼쪽에서는 전자가 원자핵에 끌려 이동 방향이 바뀌고, 핵에 운동량을 전달한다. 오른쪽에서는 두 전자가 서로 밀어내며 운동량을 주고받지만, 두 전자의 총운동량은 그대로다. 아래 청록색 화살표는 전자들의 총운동량을, 주황색 화살표는 원자핵에 전달된 운동량을 나타낸다.',
      alt: '왼쪽은 양전하를 띤 원자핵 쪽으로 휘는 전자의 궤적이고, 오른쪽은 서로 밀어내는 두 전자의 궤적이다. 아래 화살표는 원자핵에 전달되는 운동량과 전자들의 총운동량 보존을 비교한다.',
    },
    en: {
      title: 'Momentum transfer to a nucleus and exchange between electrons',
      caption: 'On the left, an electron is deflected by its attraction to a nucleus and transfers momentum to it. On the right, two electrons exchange momentum while their total momentum stays constant. The teal arrows below show the momentum of the electron system; the orange arrow shows the momentum transferred to the nucleus.',
      alt: 'Left: an electron curves toward a positively charged nucleus. Right: two electrons repel each other. The vectors below compare momentum transfer to the nucleus with conservation of the electron system’s total momentum.',
    },
  },
  {
    src: '/images/columns/electron-fluid.svg',
    width: 640,
    height: 360,
    ko: {
      title: '벽에서는 느리고 중앙에서는 빠른 흐름',
      caption: '전자 유체의 평균 흐름을 그렸다. 벽 근처에서는 느리고 중앙에서는 빠르다.',
      alt: '전자 유체의 평균 흐름. 채널 벽 근처에는 짧은 화살표가, 중앙에는 긴 화살표가 그려져 있다.',
    },
    en: {
      title: 'Slower at the walls, faster at the center',
      caption: 'A sketch of the mean flow of an electron fluid: slow near the walls and fast in the center.',
      alt: 'Mean electron flow in a channel, shown by shorter arrows near the walls and longer arrows in the center.',
    },
  },
  {
    src: '/images/columns/electron-fluid/figure-3-transport-regimes.svg',
    width: 1600,
    height: 900,
    ko: {
      title: '도선의 폭에 따라 달라지는 전자의 흐름',
      caption: '채널 폭을 늘렸을 때 전자의 이동 방식이 바뀌는 예다. 왼쪽에서는 개별 전자의 궤적이 중요한 탄도 수송이 나타난다. 가운데에서는 점성에 따른 운동량 전달이, 오른쪽에서는 채널 내부에서 운동량을 잃는 과정이 흐름을 좌우한다. 오른쪽의 평균 속도는 중앙에서 거의 일정하고 벽 근처에서 느려진다.',
      alt: '폭이 다른 세 채널에서 탄도 수송, 중앙이 빠른 점성 흐름, 내부에서 운동량을 잃는 과정이 중요한 흐름을 비교한다. 오른쪽은 중앙의 속도가 거의 일정하다. 아래 화살표는 채널이 넓어지는 방향을 나타낸다.',
    },
    en: {
      title: 'Transport regimes as the channel widens',
      caption: 'This example shows a change from ballistic transport, where individual trajectories matter, to viscous flow, where momentum transfer across the flow matters, and then to flow dominated by momentum relaxation in the bulk. On the right, the mean speed is nearly uniform in the center and falls near the walls.',
      alt: 'Three channels of different widths show ballistic trajectories, viscous flow that is fastest in the center, and flow dominated by bulk momentum relaxation with a nearly uniform center speed. The arrow below indicates increasing channel width.',
    },
  },
  {
    src: '/images/columns/electron-fluid/figure-4-cavity-flow.svg',
    width: 1600,
    height: 900,
    ko: {
      title: '옆 공간의 크기에 따라 달라지는 전류 소용돌이',
      caption: '채널 폭과 점성 길이는 같게 두고, 옆 공간과 입구의 크기를 함께 늘렸을 때의 전류 흐름을 비교했다. 두 흐름 모두 시간에 따라 변하지 않는 상태다. 작은 공간에서는 전류가 뚜렷한 소용돌이를 이루지만, 큰 공간에서는 주로 입구로 들어갔다가 다시 나오는 경로를 따른다. 두 구조는 같은 축척으로 그렸다.',
      alt: '같은 폭의 채널 옆에 연결된 크기가 다른 두 공간. 작은 공간에서는 전류가 반시계 방향으로 순환한다. 큰 공간에서는 주된 전류 흐름이 입구로 들어갔다가 다시 나오는 경로를 따른다.',
    },
    en: {
      title: 'Current vortices as a side cavity grows',
      caption: 'Two steady current fields with the same channel width and viscous length. Both the side cavity and its opening are larger on the right. The smaller cavity has a clear closed circulation; the main flow in the larger cavity follows open paths into and out of the cavity. Both geometries use the same spatial scale.',
      alt: 'Two side cavities of different sizes connected to channels of the same width. The smaller cavity contains a closed, counterclockwise current circulation. The larger cavity has open streamlines that enter and leave through its opening.',
    },
  },
  {
    src: '/images/columns/electron-fluid/figure-5-drive-response.svg',
    width: 1600,
    height: 900,
    ko: {
      title: '전압을 높일 때 달라질 수 있는 흐름과 전자 온도',
      caption: '채널 모양에 따라 흐름이 빨라지거나 느려지고, 줄가열로 전자 온도와 산란률, 점성이 달라질 수 있다. 두 효과는 함께 나타날 수 있다. 따라서 전류–전압 관계가 비선형이라는 사실만으로는 원인을 구별할 수 없다.',
      alt: '전압을 높였을 때 나타날 수 있는 흐름의 가속과 전자 가열. 같은 모양의 두 채널에서 좁은 구간의 긴 화살표는 더 큰 전류밀도를 나타낸다. 오른쪽의 온도계와 주황색은 전자가 가열되는 모습을 상징한다.',
    },
    en: {
      title: 'Two effects that can change as the voltage rises',
      caption: 'The geometry can accelerate or slow the flow, while Joule heating can change the electron temperature, scattering rates and viscosity. Both effects can occur together. A nonlinear current–voltage curve alone cannot identify the cause.',
      alt: 'Flow acceleration and electron heating under stronger drive. Longer arrows in the constrictions of two identically shaped channels indicate higher current density. On the right, a thermometer and orange shading symbolize electron heating.',
    },
  },
];

export function ColumnFigure({ number, language }: { number: number; language: ColumnLanguage }) {
  const id = useId();
  const figure = figures[number - 1];
  if (!figure) return null;
  const text = figure[language];

  return (
    <figure className="column-figure my-10 border-y border-zinc-300 py-5" aria-labelledby={`${id}-caption`}>
      <p className="mb-4 text-sm font-semibold text-zinc-800">{language === 'en' ? 'Figure' : '그림'} {number}. {text.title}</p>
      <img
        src={figure.src}
        alt={text.alt}
        width={figure.width}
        height={figure.height}
        className="block h-auto w-full"
        loading="lazy"
        decoding="async"
      />
      <figcaption id={`${id}-caption`} className="mt-3 text-sm leading-6 text-zinc-500">
        {text.caption}
      </figcaption>
    </figure>
  );
}
