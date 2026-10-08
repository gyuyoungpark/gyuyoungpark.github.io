import electronFluid from './columns/electron-fluid.json';

export const SITE_ORIGIN = 'https://gyuyoungpark.github.io';

export type ColumnSeoId = 'electron-fluid';
export type ColumnSeoLanguage = 'en' | 'ko';

export interface ColumnSeoPage {
  readonly language: ColumnSeoLanguage;
  readonly path: '/columns/electron-fluid/' | '/columns/electron-fluid/ko/';
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
} as const satisfies Readonly<Record<ColumnSeoId, ColumnSeoEntry>>;
