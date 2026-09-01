// Design tokens for andrewramey.com.
//
// These are the VTS marketing site's surface values, not the terminal's
// slightly darker set — Andrew asked the portfolio to match the marketing page
// it sits beside. Values live here and nowhere else: a literal scattered into
// a component is how two surfaces come to disagree about the same colour.
//
// Duplicated from VTS deliberately and permanently. This is a separate
// deployment and may never import from that repository.

export const C = {
  // Surfaces
  bg: '#061026',
  panel: 'rgba(13,31,68,.55)',
  panel2: '#08142e',

  // Hairlines
  line: '#16294f',
  line2: '#1c3a7a',

  // Text
  text: '#eef3ff',
  muted: '#a9b9d9',
  faint: '#6f84b0',

  // Accent
  gold: '#ebcb74',
  gold2: '#c9a24b',
  goldText: '#092151',

  // Fonts
  sans: "'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
} as const;

export const GOLD_GRADIENT = `linear-gradient(180deg, ${C.gold}, ${C.gold2})`;

/** The page ground. One gradient, stated once. */
export const PAGE_BG = `radial-gradient(1100px 640px at 20% -6%, #12336f 0%, ${C.bg} 62%)`;

/** The content column, shared by the header, every section and the footer. */
export const COLUMN = 'min(1080px, calc(100% - 40px))';

/** Vertical space above a section. */
export const PAD = { compact: 44, normal: 68, roomy: 96 } as const;

/** Inner padding of a content box. */
export const BOX_PAD = {
  compact: '14px 16px',
  normal: '22px 24px',
  roomy: '30px 34px',
} as const;

/** A translucent tint of a hex colour. */
export function tint(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}
