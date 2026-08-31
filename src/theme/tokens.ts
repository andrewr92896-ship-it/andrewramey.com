// Design tokens for andrewramey.com.
//
// The palette is lifted from the VTS Terminal's "Meridian" tokens so the
// portfolio and the terminal it showcases read as one person's work. The
// values are duplicated deliberately rather than imported: this is a separate
// deployment and must never depend on that repository.

export const C = {
  // Surfaces (blue-tinted dark)
  bg: '#050B18',
  panel: '#0A1426',
  panel2: '#0C1930',

  // Hairlines
  line: '#152139',
  line2: '#1E2E52',
  hover: '#24365F',

  // Text
  text: '#E9EFFB',
  muted: '#93A5C9',
  faint: '#5E7098',

  // Accent
  gold: '#EBCB74',
  gold2: '#C9A24B',
  goldText: '#241A05',

  // Fonts
  mono: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  sans: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
} as const;

export const GOLD_GRADIENT = 'linear-gradient(180deg, #EBCB74, #C9A24B)';

/** A translucent tint of a hex colour. */
export function tint(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}
