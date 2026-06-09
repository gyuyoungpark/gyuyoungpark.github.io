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
  tags: Tag[];
  image?: string;
  date?: string;
  category?: string;
  isNew?: boolean;
}

export interface Producer {
  id: string;
  name: string;
  bio: string;
  image?: string;
  role?: string;
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
