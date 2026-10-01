export type ColumnBlock =
  | { type: 'paragraph' | 'heading' | 'equation'; text: string }
  | { type: 'figure'; number: number };

export interface Column {
  id: string;
  title: string;
  titleEn: string;
  date: string;
  tags: string[];
  description: string;
  blocks: ColumnBlock[];
  thumbnail?: string;
  thumbnailAlt?: string;
}

// Every JSON article in this folder participates in VAGUE and the keyword index.
const columnFiles = import.meta.glob<Column>('./*.json', { eager: true, import: 'default' });

export const columns = Object.values(columnFiles).sort((first, second) =>
  second.date.localeCompare(first.date) || first.id.localeCompare(second.id),
);

export function getColumnById(id: string): Column | undefined {
  return columns.find((column) => column.id === id);
}
