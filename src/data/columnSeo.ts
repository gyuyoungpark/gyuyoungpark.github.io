import electronFluid from './columns/electron-fluid.json';

export const SITE_ORIGIN = 'https://gyuyoungpark.github.io';

export type ColumnSeoId = 'electron-fluid' | 'molecular-handedness';
export type ColumnSeoLanguage = 'en' | 'ko';

export interface ColumnSeoPage {
  readonly language: ColumnSeoLanguage;
  readonly path: `/columns/${ColumnSeoId}/` | `/columns/${ColumnSeoId}/ko/`;
  readonly title: string;
  readonly description: string;
  readonly ogLocale: 'en_US' | 'ko_KR';
}

export interface ColumnSeoEntry {
  readonly defaultLanguage: 'en';
  readonly pages: Readonly<Record<ColumnSeoLanguage, ColumnSeoPage>>;
}

export const columnSeo = {
  'electron-fluid': {
    defaultLanguage: 'en',
    pages: {
      en: {
        language: 'en',
        path: '/columns/electron-fluid/',
        title: `Electron Hydrodynamics: ${electronFluid.titleEn} | Gyuyoung Park`,
        description:
          'An introduction to electron hydrodynamics: how momentum exchange, momentum loss, and viscosity shape electron flow, with examples from graphene.',
        ogLocale: 'en_US',
      },
      ko: {
        language: 'ko',
        path: '/columns/electron-fluid/ko/',
        title: `전자 유체역학: ${electronFluid.title} | Gyuyoung Park`,
        description:
          '전자 유체역학: 전자 사이의 운동량 교환, 운동량 손실과 점성이 전류의 흐름을 결정하는 조건을 그래핀 실험과 함께 살펴봅니다.',
        ogLocale: 'ko_KR',
      },
    },
  },
  'molecular-handedness': {
    defaultLanguage: 'en',
    pages: {
      en: {
        language: 'en',
        path: '/columns/molecular-handedness/',
        title: 'Chirality: Why does life use only one hand? | Gyuyoung Park',
        description:
          'An accessible introduction to molecular chirality and the Soai reaction: how a small initial imbalance between mirror-image molecules can grow through autocatalysis.',
        ogLocale: 'en_US',
      },
      ko: {
        language: 'ko',
        path: '/columns/molecular-handedness/ko/',
        title: '카이랄성과 자기촉매: 생명은 왜 한쪽 손만 쓸까? | Gyuyoung Park',
        description:
          '분자의 카이랄성과 소아이 반응을 손의 비유로 살펴봅니다. 거울상 분자 사이의 작은 불균형이 자기촉매를 통해 커지는 과정을 쉽게 설명합니다.',
        ogLocale: 'ko_KR',
      },
    },
  },
} as const satisfies Readonly<Record<ColumnSeoId, ColumnSeoEntry>>;

export function getColumnSeo(id: string): ColumnSeoEntry | undefined {
  return Object.prototype.hasOwnProperty.call(columnSeo, id)
    ? columnSeo[id as ColumnSeoId] : undefined;
}
