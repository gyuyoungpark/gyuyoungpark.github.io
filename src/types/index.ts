export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Author {
  id: string;
  name: string;
  bio?: string;
  image?: string;
}

export interface Article {
  id: string;
  title: string;
  authors: Author[];
  description: string;
  tags: (string | Tag)[];
  image?: string;
  date?: string;
  journal?: string;
  url?: string;
  doi?: string;
  imageAlt?: string;
  caption?: string;
  figureNumber?: string;
  figureSourceUrl?: string;
  status?: 'published' | 'preprint';
  category?: string;
  isNew?: boolean;
}

export interface Activity {
  id: string;
  title: string;
  event: string;
  date: string;
  dateLabel?: string;
  location?: string;
  kind: string;
  url: string;
  doi?: string;
  caption: string;
  image?: string;
  imageAlt?: string;
  imageLabel?: string;
  imageSourceUrl?: string;
  tags: (string | Tag)[];
}

export interface Achievement {
  id: string;
  title: string;
  organization?: string;
  date: string;
  dateLabel: string;
  tags: (string | Tag)[];
}

export interface CabinetItem {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  location?: string;
  date?: string;
  description?: string;
}

export interface StudyItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  period?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export type PageType = 'home' | 'connects' | 'issues' | 'features' | 'producers' | 'cabinet';
