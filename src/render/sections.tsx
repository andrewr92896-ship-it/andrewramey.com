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

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { C, BOX_PAD, PAD, tint } from '../theme/tokens';
import {
  DEFAULT_FIELDS,
  fieldKind,
  fieldsFor,
  itemOwner,
  type Item,
  type Section,
  type LinkBehavior,
} from '../content/types';
import { Btn, Chips, Field, hasContent, typoFor } from './fields';
import { useFileViewer } from './viewer';

// ---------------------------------------------------------------- box

const TONES: Record<string, CSSProperties> = {
  panel: { border: `1px solid ${C.line}`, background: C.panel },
  plain: { border: '1px solid transparent', background: 'transparent' },
  gold: { border: `1px solid ${tint(C.gold, 0.32)}`, background: tint(C.gold, 0.07) },
  dashed: { border: `1px dashed ${C.line2}`, background: 'rgba(9,22,51,.4)' },
  outline: { border: `1px dashed ${tint(C.gold, 0.32)}`, background: tint(C.gold, 0.05) },
};

function boxStyle(item: Item, fallbackTone: keyof typeof TONES): CSSProperties {
  const tone = item.tone ?? (item.placeholder ? 'dashed' : fallbackTone);
  const base = TONES[tone] ?? TONES.panel;
  return {
    ...base,
    // `feature` brightens the border on whatever tone is in play, so a
    // featured plain box still reads as featured.
    ...(item.feature ? { border: `1px solid ${C.line2}` } : {}),
    padding: BOX_PAD[item.pad ?? 'normal'],
    borderRadius: item.radius ?? 12,
    textAlign: item.align ?? 'left',
    position: 'relative',
    minWidth: 0,
  };
}

/** Grid span. Ignored on one column, which is what phones render. */
function spanStyle(item: Item): CSSProperties {
  if (item.span === 'full') return { gridColumn: '1 / -1' };
  const span = item.span ?? (item.feature ? 2 : 1);
  return span === 2 ? { gridColumn: 'span 2' } : {};
}

function Fields({
  owner,
  item,
  ids,
  gap,
}: {
  owner: string;
  item: Item;
  ids: string[];
  gap: number;
}) {
  const shown = ids.filter((id) => hasContent(item, id));
  if (!shown.length) return null;
  return (
    <div style={{ display: 'grid', gap, minWidth: 0 }}>
      {shown.map((id) => (
        <Field key={id} owner={owner} item={item} id={id} />
      ))}
    </div>
  );
}

/**
 * One box.
 *
 * `sectionOwner` is what the section holds; an item carrying its own `kind`
 * renders as THAT instead, with the look that kind has everywhere else on the
 * site — a credential is dashed gold with the mark wherever it sits. `span` is
 * off inside a stacked layout: `grid-column: span 2` in a one-column grid does
 * not widen the box, it conjures a second column and breaks the stack.
 */
function Box({
  sectionOwner,
  item,
  tone,
  mark,
  span = true,
}: {
  sectionOwner: string;
  item: Item;
  tone: keyof typeof TONES;
  mark?: boolean;
  span?: boolean;
}) {
  const owner = itemOwner(item, sectionOwner);
  if (item.kind === 'credential') {
    tone = 'outline';
    mark = true;
  } else if (item.kind === 'callout') {
    tone = 'gold';
    mark = false;
  } else if (item.kind) {
    tone = 'panel';
    mark = false;
  }
  const ids = fieldsFor(item, DEFAULT_FIELDS[owner] ?? []);
  return (
    <div style={{ ...boxStyle(item, tone), ...(span ? spanStyle(item) : {}) }}>
      {mark && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 14,
            right: 16,
            color: tint(C.gold, 0.55),
            fontSize: 12,
          }}
        >
          ◆
        </span>
      )}
      <Fields owner={owner} item={item} ids={ids} gap={10} />
    </div>
  );
}

/** An item is native when it carries no kind — it is what the section holds. */
const native = (it: Item) => !it.kind;

/**
 * The blocks a section holds that are NOT its own kind of thing, as a grid.
 *
 * Used by the layouts that have one shape for their own items — chips, band
 * lines — so an image or a video added there still has somewhere sensible to
 * land, under the native content, rather than being dropped.
 */
function Blocks({ s, sectionOwner }: { s: Section; sectionOwner: string }) {
  const extra = s.items.filter((it) => !native(it));
  if (!extra.length) return null;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
        gap: 14,
        marginTop: 18,
      }}
    >
      {extra.map((it, i) => (
        <Box key={i} sectionOwner={sectionOwner} item={it} tone="panel" />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- header

function SectionHeader({ s }: { s: Section }) {
  const ids = (s.fields ?? DEFAULT_FIELDS.header).filter((id) => {
    const v = s[id];
    return typeof v === 'string' && v.trim() !== '';
  });
  if (!ids.length) return null;
  return (
    <div style={{ display: 'grid', gap: 10, minWidth: 0 }}>
      {ids.map((id) => (
        <p key={id} style={typoFor('header', id, s.styles)}>
          {String(s[id])}
        </p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- grids

function gridCols(s: Section, defaultMin: number): string {
  if (typeof s.cols === 'number') return `repeat(${s.cols}, minmax(0,1fr))`;
  const min = s.colMin ?? (s.wide ? 300 : defaultMin);
  return `repeat(auto-fit, minmax(min(${min}px, 100%), 1fr))`;
}

// ---------------------------------------------------------------- types

function Hero({ s }: { s: Section }) {
  const ids = fieldsFor(s as unknown as Item, DEFAULT_FIELDS.hero);
  return (
    <div style={{ display: 'grid', gap: 10, minWidth: 0 }}>
      {ids.map((id) => {
        const kind = fieldKind(id);
        if (kind === 'chips') {
          const chips = s.items.filter(native);
          return chips.length ? <Chips key={id} items={chips} /> : null;
        }
        if (kind === 'buttons') {
          const list = s.buttons ?? [];
          return list.length ? (
            <div key={id} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 6 }}>
              {list.map((b, i) => (
                <Btn key={`${b.label}-${i}`} b={b} />
              ))}
            </div>
          ) : null;
        }
        const v = s[id];
        if (typeof v !== 'string' || !v.trim()) return null;
        return (
          <p key={id} style={typoFor('hero', id, s.styles)}>
            {v}
          </p>
        );
      })}
      <Blocks s={s} sectionOwner="hero" />
    </div>
  );
}

function Cards({ s, certs }: { s: Section; certs?: boolean }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: gridCols(s, certs ? 240 : 260),
        gap: s.gap ?? 14,
      }}
    >
      {s.items.map((it, i) => (
        <Box
          key={i}
          sectionOwner={certs ? 'certs' : 'cards'}
          item={it}
          tone={certs ? 'outline' : 'panel'}
          mark={certs}
        />
      ))}
    </div>
  );
}

function Tiers({ s }: { s: Section }) {
  return (
    <div style={{ display: 'grid', gap: s.gap ?? 16 }}>
      {s.items.map((it, i) => {
        if (!native(it))
          return <Box key={i} sectionOwner="tiers" item={it} tone="panel" span={false} />;
        const ids = fieldsFor(it, DEFAULT_FIELDS.tiers);
        const colA = ids.filter((f) => ['title', 'body', 'image'].includes(fieldKind(f)));
        const colB = ids.filter((f) => !['title', 'body', 'image'].includes(fieldKind(f)));
        return (
          <div
            key={i}
            style={{
              ...boxStyle({ ...it, pad: it.pad ?? 'normal' }, 'panel'),
              padding: it.pad ? BOX_PAD[it.pad] : '20px 22px',
              display: 'grid',
              gridTemplateColumns: 'minmax(150px,210px) minmax(0,1fr)',
              gap: 20,
              alignItems: 'start',
            }}
            className="split"
          >
            <Fields owner="tiers" item={it} ids={colA} gap={8} />
            <Fields owner="tiers" item={it} ids={colB} gap={10} />
          </div>
        );
      })}
    </div>
  );
}

/**
 * A services list, with a way to get in touch under it.
 *
 * Its own type rather than a `tiers` section with a different heading, because
 * "add a service" and "add a tier" are different acts to the person writing the
 * page, and the editor can only offer what the model names. It also carries the
 * contact strip, which nothing else does.
 */
function Services({ s }: { s: Section }) {
  return (
    <div style={{ display: 'grid', gap: s.gap ?? 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: gridCols(s, 280), gap: s.gap ?? 16 }}>
        {s.items.map((it, i) => (
          <Box key={i} sectionOwner="services" item={it} tone="panel" />
        ))}
      </div>
      <ContactStrip s={s} />
    </div>
  );
}

/**
 * Email and phone, as links that DO something on the device reading them.
 *
 * A phone number as plain text is a number somebody has to retype into a keypad;
 * `tel:` dials it. The href is stripped to the characters a dialler accepts
 * while the DISPLAYED text is exactly what was typed — a number written
 * "(330) 555-0134" should keep its shape on the page and still be one tap.
 */
export function ContactStrip({ s }: { s: Section }) {
  const email = typeof s.contactEmail === 'string' ? s.contactEmail.trim() : '';
  const phone = typeof s.contactPhone === 'string' ? s.contactPhone.trim() : '';
  if (!email && !phone) return null;

  // Keep a leading + (international), drop everything a dialler cannot use.
  const dial = phone.replace(/(?!^\+)[^\d]/g, '');

  return (
    <div
      style={{
        display: 'flex',
        gap: 'clamp(12px, 3vw, 28px)',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: BOX_PAD.compact,
        borderRadius: 10,
        border: `1px solid ${C.line}`,
        background: tint('#091633', 0.5),
      }}
    >
      {email && <ContactLink label="Email" value={email} href={`mailto:${email}`} />}
      {phone && <ContactLink label="Phone" value={phone} href={`tel:${dial}`} />}
    </div>
  );
}

function ContactLink({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <span style={{ display: 'grid', gap: 3, minWidth: 0 }}>
      <span
        style={{
          font: `500 .62rem/1.4 ${C.mono}`,
          letterSpacing: '.16em',
          textTransform: 'uppercase',
          color: C.faint,
        }}
      >
        {label}
      </span>
      <a
        href={href}
        style={{
          font: `600 .95rem/1.4 ${C.sans}`,
          color: C.gold,
          textDecoration: 'none',
          overflowWrap: 'anywhere',
        }}
      >
        {value}
      </a>
    </span>
  );
}

function Timeline({ s }: { s: Section }) {
  return (
    <div style={{ display: 'grid', gap: s.gap ?? 0 }}>
      {s.items.map((it, i) => {
        if (!native(it)) {
          return (
            <div key={i} style={{ padding: '24px 0', borderTop: `1px solid ${C.line}` }}>
              <Box sectionOwner="timeline" item={it} tone="panel" span={false} />
            </div>
          );
        }
        const ids = fieldsFor(it, DEFAULT_FIELDS.timeline);
        const colA = ids.filter((f) => ['meta', 'place'].includes(fieldKind(f)));
        const colB = ids.filter((f) => !['meta', 'place'].includes(fieldKind(f)));
        return (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(150px,190px) minmax(0,1fr)',
              gap: 24,
              padding: '24px 0',
              borderTop: `1px solid ${C.line}`,
              alignItems: 'start',
            }}
            className="split"
          >
            <Fields owner="timeline" item={it} ids={colA} gap={6} />
            <Fields owner="timeline" item={it} ids={colB} gap={10} />
          </div>
        );
      })}
    </div>
  );
}

function About({ s }: { s: Section }) {
  const portrait = (
    <div style={{ minWidth: 0, ...(s.side === 'right' ? { order: 2 } : {}) }}>
      <div
        style={{
          aspectRatio: '4 / 5',
          border: `1px solid ${C.line}`,
          borderRadius: 12,
          overflow: 'hidden',
          background: C.panel,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {s.portraitSrc ? (
          <img
            src={String(s.portraitSrc)}
            alt="Andrew Ramey"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <span
            style={{
              font: `500 .7rem/1.6 ${C.mono}`,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: C.faint,
              textAlign: 'center',
              padding: 16,
            }}
          >
            Headshot
            <br />
            to come
          </span>
        )}
      </div>
      <p
        style={{
          margin: '10px 0 0',
          font: `500 .74rem/1.5 ${C.mono}`,
          letterSpacing: '.1em',
          color: C.faint,
        }}
      >
        Andrew Ramey
      </p>
    </div>
  );

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(220px,320px) minmax(0,1fr)',
        gap: 36,
        alignItems: 'start',
      }}
      className="about-split"
    >
      {portrait}
      <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
        {s.items.map((it, i) =>
          native(it) ? (
            <Fields
              key={i}
              owner="about"
              item={it}
              ids={fieldsFor(it, DEFAULT_FIELDS.about)}
              gap={10}
            />
          ) : (
            <Box key={i} sectionOwner="about" item={it} tone="panel" span={false} />
          ),
        )}
      </div>
    </div>
  );
}

function Band({ s }: { s: Section }) {
  return (
    <div
      style={{
        marginTop: PAD[s.pad ?? 'normal'],
        padding: '30px clamp(22px,3vw,34px)',
        borderRadius: 12,
        border: `1px solid ${tint(C.gold, 0.32)}`,
        background: tint(C.gold, 0.07),
        display: 'flex',
        gap: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'grid', gap: s.gap ?? 8, minWidth: 0 }}>
        {s.items.filter(native).map((it, i) => {
          const ids = fieldsFor(it, DEFAULT_FIELDS.band).filter((id) => hasContent(it, id));
          return (
            <div
              key={i}
              style={{ display: 'flex', gap: 14, alignItems: 'baseline', flexWrap: 'wrap' }}
            >
              {ids.map((id) => (
                <Field key={id} owner="band" item={it} id={id} />
              ))}
            </div>
          );
        })}
      </div>
      {s.ctaLabel && (
        <Btn
          b={{
            label: s.ctaLabel,
            href: s.ctaHref || '#',
            variant: 'solid',
            behavior: s.ctaBehavior as LinkBehavior | undefined,
          }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------- entry

// ---------------------------------------------------------------- gallery

/**
 * An image slideshow — screenshots of a project, a set of logos.
 *
 * THE FRAME IS A FIXED SHAPE (16:10) AND THE IMAGE FITS INSIDE IT, so moving
 * between a tall phone screenshot and a wide desktop one never shifts the page
 * under the reader. `contain` (the default) keeps every pixel of a screenshot
 * or a logo; `cover` fills and crops, for images where that is the intent.
 *
 * ONLY THE CURRENT SLIDE IS IN THE DOCUMENT. That is what makes the first
 * image the only one fetched on page load — every other one loads when it is
 * reached — without a lazy-loading scheme to get wrong.
 *
 * THE VISITOR MOVES IT; NOTHING AUTOPLAYS. Previous and next, a counter, the
 * thumbnails, the arrow keys while the slideshow is focused, and a swipe on a
 * touch screen. Pressing the image opens it, enlarged, in the same viewer
 * every other file on the site opens in — Escape closes it and focus comes
 * back to where it was.
 *
 * A slide with no image, or one whose file is gone, draws a slot that says so
 * rather than a broken picture — the rule every image on the site follows.
 */
const SWIPE_PX = 40;

function Gallery({ s }: { s: Section }) {
  const slides = s.items;
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState<Record<string, boolean>>({});
  const openFile = useFileViewer();
  const region = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  // A swipe ends on the same button a tap does, so the click that follows it
  // would open the lightbox on every swipe. This marks the click as spent.
  const swiped = useRef(false);

  // Deleting slides in the editor can leave the index past the end.
  useEffect(() => {
    if (index > Math.max(0, count - 1)) setIndex(Math.max(0, count - 1));
  }, [count, index]);

  const go = useCallback(
    (to: number) => {
      if (count === 0) return;
      setIndex(((to % count) + count) % count);
    },
    [count],
  );
  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  if (count === 0) return null;

  const slide = slides[Math.min(index, count - 1)];
  const src = typeof slide.imgSrc === 'string' ? slide.imgSrc : '';
  const alt = typeof slide.alt === 'string' ? slide.alt : '';
  const title = typeof slide.title === 'string' ? slide.title : '';
  const caption = typeof slide.caption === 'string' ? slide.caption : '';
  const fit = s.imgFit ?? 'contain';
  const thumbs = s.thumbs !== false && count > 1;
  const name = s.title || 'Image slideshow';
  const missing = !src || broken[src];

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(count - 1);
    else return;
    e.preventDefault();
  };

  const navButton = (side: 'prev' | 'next'): CSSProperties => ({
    position: 'absolute',
    top: '50%',
    [side === 'prev' ? 'left' : 'right']: 10,
    transform: 'translateY(-50%)',
    width: 44,
    height: 44,
    borderRadius: 999,
    // Legible on a white screenshot and on a dark one alike: a translucent
    // navy disc with a light rim, never the image's own colours.
    background: 'rgba(6,16,38,.72)',
    border: '1px solid rgba(233,239,251,.32)',
    color: C.text,
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    padding: 0,
    font: `600 1.1rem/1 ${C.sans}`,
    backdropFilter: 'blur(2px)',
  });

  return (
    <div
      ref={region}
      className="gallery"
      role="region"
      aria-roledescription="carousel"
      aria-label={name}
      tabIndex={0}
      onKeyDown={onKeyDown}
      style={{ outlineOffset: 4, borderRadius: 14 }}
    >
      <div
        className="gallery-stage"
        onPointerDown={(e) => {
          swiped.current = false;
          pointer.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const start = pointer.current;
          pointer.current = null;
          if (!start) return;
          const dx = e.clientX - start.x;
          const dy = e.clientY - start.y;
          // A horizontal swipe, not a vertical scroll and not a tap.
          if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return;
          swiped.current = true;
          // The click, if there is one, is dispatched before this runs; a
          // release with no click must not leave the next tap spent.
          setTimeout(() => {
            swiped.current = false;
          }, 0);
          dx < 0 ? next() : prev();
        }}
        onPointerCancel={() => {
          pointer.current = null;
        }}
        style={{
          position: 'relative',
          aspectRatio: '16 / 10',
          borderRadius: 12,
          border: `1px solid ${C.line}`,
          background: tint('#091633', 0.6),
          overflow: 'hidden',
          touchAction: 'pan-y',
          userSelect: 'none',
        }}
      >
        {missing ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              font: `500 .68rem/1.4 ${C.mono}`,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: C.faint,
              textAlign: 'center',
              padding: 20,
            }}
          >
            {src ? 'Image not found' : 'Image to come'}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (swiped.current) {
                swiped.current = false;
                return;
              }
              openFile({ src, label: alt || title || `Slide ${index + 1}` });
            }}
            aria-label={`Enlarge: ${alt || title || `slide ${index + 1}`}`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              padding: 0,
              border: 'none',
              background: 'transparent',
              cursor: 'zoom-in',
              outlineOffset: -4,
            }}
          >
            <img
              key={src}
              src={src}
              alt={alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
              onError={() => setBroken((b) => ({ ...b, [src]: true }))}
              style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }}
            />
          </button>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              style={navButton('prev')}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button type="button" onClick={next} aria-label="Next slide" style={navButton('next')}>
              <span aria-hidden="true">›</span>
            </button>
          </>
        )}
      </div>

      <div
        aria-live="polite"
        style={{
          display: 'flex',
          gap: 14,
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginTop: 10,
          minHeight: '1.6rem',
        }}
      >
        <div style={{ minWidth: 0 }}>
          {title && (
            <p style={{ margin: 0, font: `600 .95rem/1.4 ${C.sans}`, color: C.text }}>{title}</p>
          )}
          {caption && (
            <p style={{ margin: 0, font: `400 .88rem/1.55 ${C.sans}`, color: C.muted }}>
              {caption}
            </p>
          )}
        </div>
        <span
          className="gallery-counter"
          style={{
            flex: 'none',
            font: `500 .72rem/1.5 ${C.mono}`,
            letterSpacing: '.14em',
            color: C.faint,
          }}
        >
          {index + 1} / {count}
        </span>
      </div>

      {thumbs && (
        <div
          className="gallery-thumbs"
          style={{ display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto', paddingBottom: 4 }}
        >
          {slides.map((it, i) => {
            const tsrc = typeof it.imgSrc === 'string' ? it.imgSrc : '';
            const talt = typeof it.alt === 'string' && it.alt ? it.alt : `slide ${i + 1}`;
            const current = i === index;
            return (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1}: ${talt}`}
                aria-current={current ? 'true' : undefined}
                style={{
                  flex: 'none',
                  width: 64,
                  height: 44,
                  padding: 0,
                  borderRadius: 7,
                  overflow: 'hidden',
                  border: `2px solid ${current ? C.gold : C.line2}`,
                  background: tint('#091633', 0.6),
                  cursor: 'pointer',
                  opacity: current ? 1 : 0.7,
                }}
              >
                {tsrc && !broken[tsrc] ? (
                  <img
                    src={tsrc}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function SectionView({ s }: { s: Section }) {
  const pad = PAD[s.pad ?? 'normal'];

  if (s.type === 'hero') {
    return (
      <section
        id={s.id}
        style={{
          padding: `clamp(48px,8vw,104px) 0 ${Math.round(pad * 0.35)}px`,
          scrollMarginTop: 90,
        }}
      >
        <Hero s={s} />
      </section>
    );
  }

  // A band is its own panel, so it carries its own top margin rather than
  // section padding — otherwise the gap above it doubles.
  if (s.type === 'band') {
    return (
      <section id={s.id} style={{ scrollMarginTop: 90 }}>
        <div style={{ padding: `${pad}px 0 ${Math.round(pad * 0.35)}px` }}>
          <SectionHeader s={s} />
        </div>
        <Band s={{ ...s, pad: 'compact' }} />
        <Blocks s={s} sectionOwner="band" />
      </section>
    );
  }

  return (
    <section id={s.id} style={{ scrollMarginTop: 90 }}>
      <div style={{ padding: `${pad}px 0 ${Math.round(pad * 0.35)}px` }}>
        <SectionHeader s={s} />
      </div>
      {s.type === 'cards' && <Cards s={s} />}
      {s.type === 'certs' && <Cards s={s} certs />}
      {s.type === 'tiers' && <Tiers s={s} />}
      {s.type === 'timeline' && <Timeline s={s} />}
      {s.type === 'about' && <About s={s} />}
      {s.type === 'services' && <Services s={s} />}
      {s.type === 'gallery' && <Gallery s={s} />}
    </section>
  );
}
