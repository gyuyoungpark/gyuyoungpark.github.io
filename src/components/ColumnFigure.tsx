import { useId } from 'react';
import type { ColumnLanguage } from '@/data/columns';

const figures = [
  {
    src: '/images/columns/electron-fluid/figure-1-nuclear-scattering.svg',
    width: 1600,
    height: 900,
    ko: {
      title: '원자핵으로의 운동량 전달과 전자 사이의 운동량 교환',
      caption: '왼쪽에서는 전자가 원자핵의 인력으로 휘어지며 핵에 운동량을 전달한다. 오른쪽에서는 전자끼리 운동량을 주고받지만 두 전자의 총운동량은 유지된다. 아래 청록색 화살표는 전자계의 운동량, 주황색은 원자핵이 받아가는 운동량이다.',
      alt: '왼쪽은 양전하 원자핵을 향해 휘는 전자의 궤적, 오른쪽은 서로 밀어내는 두 전자의 궤적. 아래 벡터는 원자핵으로의 운동량 전달과 전자계 총운동량 보존을 비교한다.',
      note: '무거운 원자핵의 반동 에너지를 무시한 도해다. 이 근사에서는 전자의 운동량 크기는 유지되고 처음 진행하던 방향의 성분이 줄어든다. 아래 벡터는 산란 전후 충분히 멀리 떨어진 상태의 운동량을 나타낸다.',
    },
    en: {
      title: 'Momentum transfer to a nucleus and exchange between electrons',
      caption: 'On the left, an electron is deflected by its attraction to a nucleus and transfers momentum to it. On the right, two electrons exchange momentum while their total momentum stays constant. The teal arrows below show the momentum of the electron system; the orange arrow shows the momentum transferred to the nucleus.',
      alt: 'Left: an electron curves toward a positively charged nucleus. Right: two electrons repel each other. The vectors below compare momentum transfer to the nucleus with conservation of the electron system’s total momentum.',
      note: 'The sketch neglects the recoil energy of the heavy nucleus. In this approximation, the electron’s momentum magnitude is unchanged, while its component along the initial direction decreases. The vectors below show the momenta far from the scattering region, before and after the collision.',
    },
  },
  {
    src: '/images/columns/electron-fluid.svg',
    width: 640,
    height: 360,
    ko: {
      title: '벽에서는 느리고 중앙에서는 빠른 흐름',
      caption: '벽 가까이에서는 느리고 중앙에서는 빠른 전자 유체의 평균 흐름을 나타낸 도해다.',
      alt: '채널의 벽 가까이에서는 짧고 중앙에서는 긴 화살표로 나타낸 전자 유체의 평균 흐름',
      note: '화살표는 전자의 평균 흐름 방향과 상대적 속도를 개념적으로 나타내며, 관습적인 전류 방향은 반대다.',
    },
    en: {
      title: 'Slower at the walls, faster at the center',
      caption: 'A sketch of the mean flow of an electron fluid: slow near the walls and fast in the center.',
      alt: 'Mean electron flow in a channel, shown by shorter arrows near the walls and longer arrows in the center.',
      note: 'The arrows indicate the direction and relative speed of the mean electron flow. Conventional current runs in the opposite direction.',
    },
  },
  {
    src: '/images/columns/electron-fluid/figure-3-transport-regimes.svg',
    width: 1600,
    height: 900,
    ko: {
      title: '도선의 폭에 따라 달라지는 수송 영역',
      caption: '채널 폭이 커지면서 개별 궤적이 중요한 탄도 수송, 점성에 의한 운동량 전달이 중요한 흐름, 내부 운동량 완화가 중요한 흐름으로 바뀌는 예다. 오른쪽에서는 중앙의 평균 속도가 거의 고르고 벽 근처에서 느려진다.',
      alt: '폭이 다른 세 채널에서 탄도 궤적, 중앙이 빠른 점성 흐름, 중앙의 속도가 거의 고른 내부 운동량 완화 지배 흐름을 비교한다. 아래 화살표는 채널 폭의 증가를 나타낸다.',
      note: '회색 점선은 개별 궤적의 도식이고, 청록색 화살표는 각 패널의 중앙 속도로 정규화한 전자의 평균 흐름이다. 관습적인 전류 방향은 반대다. 채널 폭은 실제 비율대로 그리지 않았다. 작은 구동에서는 세 영역 모두 선형 응답이 가능하며, 오른쪽에서도 빈번한 전자 간 충돌과 국소 평형은 유지될 수 있다.',
    },
    en: {
      title: 'Transport regimes as the channel widens',
      caption: 'This example shows a change from ballistic transport, where individual trajectories matter, to viscous flow, where momentum transfer across the flow matters, and then to flow dominated by momentum relaxation in the bulk. On the right, the mean speed is nearly uniform in the center and falls near the walls.',
      alt: 'Three channels of different widths show ballistic trajectories, viscous flow that is fastest in the center, and flow dominated by bulk momentum relaxation with a nearly uniform center speed. The arrow below indicates increasing channel width.',
      note: 'The gray dashed lines sketch individual trajectories. The teal arrows show the mean electron flow, normalized to the center speed in each panel. Conventional current runs in the opposite direction. The channel widths are not to scale. All three regimes can have a linear response at weak drive; frequent electron–electron collisions and local equilibrium can still persist in the rightmost regime.',
    },
  },
  {
    src: '/images/columns/electron-fluid/figure-4-cavity-flow.svg',
    width: 1600,
    height: 900,
    ko: {
      title: '곁방 안에서 생기고 사라지는 전류 소용돌이',
      caption: '같은 채널 폭과 점성 길이에서 곁방과 입구를 함께 키운 두 정상 전류장이다. 작은 곁방에는 닫힌 순환이 뚜렷하고, 큰 곁방의 주 흐름은 들어갔다 나오는 열린 경로다. 두 형상은 같은 공간 축척으로 그렸다.',
      alt: '같은 폭의 채널에 연결된 크기가 다른 두 곁방. 작은 곁방에는 반시계 방향의 닫힌 전류 순환이 있고, 큰 곁방에는 입구로 들어갔다 나오는 열린 유선이 있다.',
      note: '정상·선형 유체 모델의 예시다. 화살표는 관습적인 전류 방향이며 전자의 평균 이동 방향은 반대다. 선의 밀도와 면의 색은 전류 크기나 온도 값을 나타내지 않는다.',
    },
    en: {
      title: 'Current vortices as a side cavity grows',
      caption: 'Two steady current fields with the same channel width and viscous length. Both the side cavity and its opening are larger on the right. The smaller cavity has a clear closed circulation; the main flow in the larger cavity follows open paths into and out of the cavity. Both geometries use the same spatial scale.',
      alt: 'Two side cavities of different sizes connected to channels of the same width. The smaller cavity contains a closed, counterclockwise current circulation. The larger cavity has open streamlines that enter and leave through its opening.',
      note: 'An example from a steady, linear hydrodynamic model. The arrows show conventional current; the mean electron motion is opposite. Line density and shading do not represent current magnitude or temperature.',
    },
  },
  {
    src: '/images/columns/electron-fluid/figure-5-drive-response.svg',
    width: 1600,
    height: 900,
    ko: {
      title: '전압을 높일 때 함께 바뀔 수 있는 두 가지',
      caption: '형상에 따라 흐름이 가속·감속되고, 줄가열로 전자 온도와 산란률·점성이 달라질 수 있다. 두 효과는 함께 나타날 수 있으며, 전류–전압 곡선의 비선형성만으로 원인을 구별할 수 없다.',
      alt: '강한 구동에서 나타날 수 있는 흐름의 가속과 전자 가열. 같은 모양의 채널에서 좁은 구간의 긴 화살표는 큰 전류밀도를, 오른쪽의 온도계와 주황색은 전자 가열을 상징한다.',
      note: '유선과 화살표는 평균 전류 방향을 나타낸 도식이며, 전자의 평균 이동은 반대다. 주황색과 온도계는 가열을 나타내는 상징이며 계산된 온도 분포가 아니다.',
    },
    en: {
      title: 'Two effects that can change as the voltage rises',
      caption: 'The geometry can accelerate or slow the flow, while Joule heating can change the electron temperature, scattering rates and viscosity. Both effects can occur together. A nonlinear current–voltage curve alone cannot identify the cause.',
      alt: 'Flow acceleration and electron heating under stronger drive. Longer arrows in the constrictions of two identically shaped channels indicate higher current density. On the right, a thermometer and orange shading symbolize electron heating.',
      note: 'The streamlines and arrows sketch the mean current direction; the mean electron motion is opposite. The orange shading and thermometer symbolize heating and are not a calculated temperature distribution.',
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
        <span className="mt-2 block text-xs leading-5">{text.note}</span>
      </figcaption>
    </figure>
  );
}
