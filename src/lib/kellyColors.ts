const kellyColors = [
  '#F3C300', // Vivid Yellow
  '#875692', // Strong Purple
  '#F38400', // Vivid Orange
  '#BE0032', // Vivid Red
  '#008856', // Vivid Green
  '#E68FAC', // Strong Purplish Pink
  '#0067A5', // Strong Blue
  '#F99379', // Strong Yellowish Pink
  '#604E97', // Strong Violet
  '#B3446C', // Strong Purplish Red
  '#DCD300', // Vivid Greenish Yellow
  '#882D17', // Strong Reddish Brown
] as const;

const sessionSalt = Math.floor(Math.random() * 1_000_000).toString(36);

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace('#', '');
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return { r, g, b };
}

export function getKellyColor(seed: string): string {
  const hashed = Math.abs(hashString(`${seed}-${sessionSalt}`));
  return kellyColors[hashed % kellyColors.length];
}

export function getKellyTextColor(hexColor: string): '#111827' | '#F8FAFC' {
  const { r, g, b } = hexToRgb(hexColor);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#111827' : '#F8FAFC';
}


