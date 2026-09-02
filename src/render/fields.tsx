// ⚠ MIRRORED FILE — an identical copy lives in the other repository.
//
// andrewr92896-ship-it/andrewramey.com  ·  andrewr92896-ship-it/andrewramey-admin
//
// The portfolio renders it for the public; the admin renders it so the owner can
// see the site privately and, once the editor exists, edit through it. THERE IS
// ONE RENDERER, NEVER TWO — this is how two deployments share it without either
// importing across a boundary that exists on purpose.
//
// CHANGE IT IN BOTH REPOSITORIES, AND UPDATE portfolio-mirror.json IN BOTH.
// `npm run verify:mirror` hashes every mirrored file against that manifest: a
// change made in one repo alone fails there, and updating the manifest then
// fails the OTHER repo until its copy is brought across too. That is what makes
// drift impossible to ship rather than merely discouraged.

import type { CSSProperties, ReactNode } from 'react';
import { C, GOLD_GRADIENT, tint } from '../theme/tokens';
import { fieldKind, youtubeId, type Button, type FieldStyle, type Item } from '../content/types';
import { linkProps, useFileViewer } from './viewer';

/**
 * Typography per (owner, field kind).
 *
 * The kind picks the treatment and the full id picks the content, which is
 * what lets a box carry two body paragraphs at `body` and `body#2` that look
 * identical and read differently.
 */
/**
 * A card's typography, defined once because SERVICES USES IT TOO. Services had
 * its own — a heavier title, a gold uppercase meta, a looser paragraph — and
 * read as a different site from the cards above it. A service is a card.
 */
const CARD: Record<string, CSSProperties> = {
  title: { font: `600 1.05rem/1.35 ${C.sans}`, color: C.text },
  meta: {
    font: `500 .72rem/1.5 ${C.mono}`,
    letterSpacing: '.14em',
    textTransform: 'uppercase',
    color: C.faint,
  },
  body: { font: `400 .93rem/1.62 ${C.sans}`, color: C.muted },
};

/** A caption under an image or a video. */
const CAPTION: CSSProperties = { font: `400 .82rem/1.55 ${C.sans}`, color: C.faint };

const TYPO: Record<string, Record<string, CSSProperties>> = {
  hero: {
    eyebrow: {
      font: `500 .7rem/1.4 ${C.mono}`,
      letterSpacing: '.2em',
      textTransform: 'uppercase',
      color: C.gold,
    },
    h1: {
      font: `700 clamp(2.2rem, 5.4vw, 4rem)/1.04 ${C.sans}`,
      letterSpacing: '-.02em',
      color: C.text,
      maxWidth: '34rem',
    },
    lede: {
      font: `400 clamp(1rem, 1.6vw, 1.15rem)/1.65 ${C.sans}`,
      color: C.muted,
      maxWidth: '44rem',
    },
  },
  header: {
    eyebrow: {
      font: `500 .7rem/1.4 ${C.mono}`,
      letterSpacing: '.2em',
      textTransform: 'uppercase',
      color: C.gold,
    },
    title: { font: `700 1.5rem/1.2 ${C.sans}`, letterSpacing: '-.01em', color: C.text },
    note: { font: `400 .95rem/1.65 ${C.sans}`, color: C.muted, maxWidth: '52rem' },
  },
  cards: CARD,
  services: CARD,
  image: { title: CAPTION },
  video: { title: CAPTION },
  callout: CARD,
  certs: {
    title: { font: `600 1rem/1.35 ${C.sans}`, color: C.text },
    meta: { font: `500 .72rem/1.5 ${C.mono}`, letterSpacing: '.12em', color: C.faint },
    body: { font: `400 .88rem/1.6 ${C.sans}`, color: C.muted },
  },
  tiers: {
    title: {
      font: `500 .76rem/1.5 ${C.mono}`,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: C.gold,
    },
    body: { font: `400 .84rem/1.6 ${C.sans}`, color: C.faint },
  },
  timeline: {
    meta: { font: `500 .78rem/1.5 ${C.mono}`, letterSpacing: '.06em', color: C.gold },
    place: { font: `400 .8rem/1.55 ${C.sans}`, color: C.faint },
    title: { font: `600 1.08rem/1.3 ${C.sans}`, color: C.text },
    body: { font: `400 .92rem/1.55 ${C.sans}`, color: C.muted },
  },
  about: {
    body: { font: `400 1rem/1.75 ${C.sans}`, color: C.muted, maxWidth: '46rem' },
  },
  band: {
    meta: {
      font: `500 .7rem/1.5 ${C.mono}`,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: C.faint,
      minWidth: '5.5rem',
    },
    title: { font: `600 1rem/1.5 ${C.sans}`, color: C.text },
  },
};

/** The format ribbon's overrides, applied on top of the template style. */
function applyStyle(base: CSSProperties, s?: FieldStyle): CSSProperties {
  if (!s) return base;
  const out: CSSProperties = { ...base };
  if (s.family) out.fontFamily = s.family === 'mono' ? C.mono : C.sans;
  if (s.size) out.fontSize = `${s.size}px`;
  if (s.weight) out.fontWeight = s.weight;
  if (s.italic) out.fontStyle = 'italic';
  if (s.upper) {
    out.textTransform = 'uppercase';
    out.letterSpacing = '.12em';
  }
  if (s.color) out.color = s.color;
  if (s.align) out.textAlign = s.align;
  if (s.lh) out.lineHeight = s.lh;
  return out;
}

export function typoFor(
  owner: string,
  id: string,
  styles?: Record<string, FieldStyle>,
): CSSProperties {
  const base = TYPO[owner]?.[fieldKind(id)] ?? {};
  return applyStyle({ margin: 0, ...base }, styles?.[id]);
}

// ---------------------------------------------------------------- pieces

export function Btn({ b }: { b: Button }) {
  const solid = b.variant === 'solid';
  const openFile = useFileViewer();
  const style: CSSProperties = {
    display: 'inline-block',
    padding: '.85rem 1.4rem',
    borderRadius: '.6rem',
    textDecoration: 'none',
    font: `${solid ? 700 : 500} .98rem/1 ${C.sans}`,
    ...(solid
      ? { background: GOLD_GRADIENT, color: C.goldText, border: '1px solid transparent' }
      : { background: 'transparent', color: C.text, border: `1px solid ${C.line2}` }),
  };

  // A preview is a BUTTON, not an anchor. An anchor that does not navigate
  // lies to a screen reader and to anybody who middle-clicks it.
  if (b.behavior === 'preview' && b.href) {
    return (
      <button
        type="button"
        onClick={() => openFile({ src: b.href, label: b.label })}
        style={{ ...style, cursor: 'pointer', fontFamily: C.sans }}
      >
        {b.label}
      </button>
    );
  }

  return (
    <a {...linkProps(b.href, b.behavior)} style={style}>
      {b.label}
    </a>
  );
}

export function Buttons({ list }: { list?: Button[] }) {
  if (!list?.length) return null;
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {list.map((b, i) => (
        <Btn key={`${b.label}-${i}`} b={b} />
      ))}
    </div>
  );
}

/** Hero fact chips. */
export function Chips({ items }: { items: Item[] }) {
  if (!items.length) return null;
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {items.map((it, i) => (
        <span
          key={`${String(it.title)}-${i}`}
          style={{
            padding: '8px 14px',
            border: `1px solid ${C.line}`,
            borderRadius: 999,
            background: C.panel,
            font: `400 .82rem/1.4 ${C.sans}`,
            color: C.muted,
            // A chip must never be wider than the viewport; a long one wraps
            // rather than pushing the page sideways.
            maxWidth: '100%',
          }}
        >
          {String(it.title ?? '')}
        </span>
      ))}
    </div>
  );
}

/** Skill pills (tiers). */
export function Pills({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {tags.map((t) => (
        <span
          key={t}
          style={{
            padding: '7px 13px',
            border: `1px solid ${C.line2}`,
            borderRadius: 999,
            font: `400 .84rem/1.4 ${C.sans}`,
            color: C.text,
            maxWidth: '100%',
          }}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

/** Timeline bullets — a gold marker rather than a list disc. */
export function Bullets({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
      {tags.map((t) => (
        <li key={t} style={{ display: 'grid', gridTemplateColumns: '12px minmax(0,1fr)', gap: 8 }}>
          <span aria-hidden="true" style={{ color: C.gold, lineHeight: 1.62 }}>
            ·
          </span>
          <span style={{ font: `400 .9rem/1.62 ${C.sans}`, color: C.muted }}>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function CardLink({ item }: { item: Item }) {
  const openFile = useFileViewer();
  if (!item.href) return null;
  const style: CSSProperties = {
    font: `600 .86rem/1.5 ${C.sans}`,
    color: C.gold,
    textDecoration: 'none',
  };
  const label = `${item.linkLabel || 'Open'} →`;

  if (item.behavior === 'preview') {
    return (
      <button
        type="button"
        onClick={() => openFile({ src: item.href as string, label: item.linkLabel })}
        style={{
          ...style,
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: C.sans,
        }}
      >
        {label}
      </button>
    );
  }
  return (
    <a {...linkProps(item.href, item.behavior)} style={style}>
      {label}
    </a>
  );
}

export function CredentialChip({ value }: { value?: string }) {
  if (!value) return null;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '5px 10px',
        borderRadius: 6,
        border: `1px solid ${C.line2}`,
        font: `500 .68rem/1.4 ${C.mono}`,
        letterSpacing: '.12em',
        color: C.faint,
        maxWidth: '100%',
      }}
    >
      {value}
    </span>
  );
}

/**
 * A band's value renders as a link when it has an href, or when the value
 * itself is plainly an address — an email or a bare domain. Auto-linkifying is
 * worth it here because these are exactly the two rows a reader wants to act
 * on, and a contact row that cannot be clicked is a contact row that gets
 * copied out by hand.
 */
export function BandValue({ item, style }: { item: Item; style: CSSProperties }) {
  const raw = String(item.title ?? '');
  const explicit = typeof item.href === 'string' ? item.href : '';
  const href =
    explicit ||
    (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)
      ? `mailto:${raw}`
      : /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(raw)
        ? `https://${raw}`
        : '');
  if (!href) return <span style={style}>{raw}</span>;
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      style={{ ...style, textDecoration: 'none' }}
    >
      {raw}
    </a>
  );
}

/** A preview image. Clicking opens it in the file viewer. */
export function Preview({ item }: { item: Item }) {
  const openFile = useFileViewer();
  const src = typeof item.imgSrc === 'string' ? item.imgSrc : '';
  const h = item.imgH ?? 190;
  if (!src) {
    // No image uploaded yet. Draw the frame and say so rather than rendering
    // nothing — a slot that vanishes reads as a broken layout.
    return (
      <div
        style={{
          height: h,
          borderRadius: 10,
          border: `1px dashed ${C.line2}`,
          background: tint('#091633', 0.4),
          display: 'grid',
          placeItems: 'center',
          font: `500 .68rem/1.4 ${C.mono}`,
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          color: C.faint,
        }}
      >
        Image to come
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={() =>
        openFile({ src, label: typeof item.title === 'string' ? item.title : undefined })
      }
      style={{
        display: 'block',
        width: '100%',
        height: h,
        padding: 0,
        borderRadius: 10,
        border: `1px solid ${C.line}`,
        overflow: 'hidden',
        background: 'transparent',
        cursor: 'zoom-in',
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: item.imgFit ?? 'cover',
          display: 'block',
        }}
      />
    </button>
  );
}

/**
 * An embedded YouTube video.
 *
 * The id is read out of the pasted address at render time, so the model holds
 * exactly what was typed and a link nobody recognises draws a slot SAYING so —
 * the same rule as the image slot, and the alternative is an embed of nothing
 * with YouTube's own error inside it. The no-cookie host, because a portfolio
 * has no business setting a tracking cookie before anybody presses play.
 */
export function Video({ item }: { item: Item }) {
  const url = typeof item.videoUrl === 'string' ? item.videoUrl : '';
  const id = youtubeId(url);
  const frame: CSSProperties = {
    aspectRatio: '16 / 9',
    width: '100%',
    borderRadius: 10,
    border: `1px solid ${C.line}`,
    overflow: 'hidden',
  };
  if (!id) {
    return (
      <div
        style={{
          ...frame,
          border: `1px dashed ${C.line2}`,
          background: tint('#091633', 0.4),
          display: 'grid',
          placeItems: 'center',
          font: `500 .68rem/1.4 ${C.mono}`,
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          color: C.faint,
          textAlign: 'center',
          padding: 16,
        }}
      >
        {url.trim() ? 'Not a YouTube link' : 'Video to come'}
      </div>
    );
  }
  return (
    <div style={{ ...frame, background: '#000' }}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={typeof item.title === 'string' && item.title ? item.title : 'Video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
      />
    </div>
  );
}

/** A field renders only when it has content. */
export function hasContent(owner: Item, id: string): boolean {
  const kind = fieldKind(id);
  if (kind === 'tags') return Array.isArray(owner[id]) && (owner[id] as string[]).length > 0;
  if (kind === 'buttons') return Array.isArray(owner[id]) && (owner[id] as Button[]).length > 0;
  // Media always draws — an empty one is a slot that says what is missing.
  if (kind === 'image' || kind === 'video') return true;
  if (kind === 'link') return Boolean(owner.href);
  const v = owner[id];
  return typeof v === 'string' && v.trim() !== '';
}

export type FieldProps = {
  owner: string;
  item: Item;
  id: string;
};

/** One field of a box, dispatched on its kind. */
export function Field({ owner, item, id }: FieldProps): ReactNode {
  const kind = fieldKind(id);
  const style = typoFor(owner, id, item.styles);

  switch (kind) {
    case 'image':
      return <Preview item={item} />;
    case 'video':
      return <Video item={item} />;
    case 'tags':
      return owner === 'timeline' ? (
        <Bullets tags={item[id] as string[]} />
      ) : (
        <Pills tags={item[id] as string[]} />
      );
    case 'buttons':
      return <Buttons list={item[id] as Button[]} />;
    case 'link':
      return <CardLink item={item} />;
    case 'credential':
      return <CredentialChip value={item[id] as string} />;
    default:
      if (owner === 'band' && kind === 'title') return <BandValue item={item} style={style} />;
      return <p style={style}>{String(item[id] ?? '')}</p>;
  }
}
