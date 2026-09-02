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

import type { CSSProperties } from 'react';
import { C, BOX_PAD, PAD, tint } from '../theme/tokens';
import {
  DEFAULT_FIELDS,
  fieldKind,
  fieldsFor,
  type Item,
  type Section,
  type LinkBehavior,
} from '../content/types';
import { Btn, Chips, Field, hasContent, typoFor } from './fields';

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

function Box({
  owner,
  item,
  tone,
  mark,
}: {
  owner: string;
  item: Item;
  tone: keyof typeof TONES;
  mark?: boolean;
}) {
  const ids = fieldsFor(item, DEFAULT_FIELDS[owner] ?? []);
  return (
    <div style={{ ...boxStyle(item, tone), ...spanStyle(item) }}>
      {mark && (
        <span
          aria-hidden="true"
          style={{ position: 'absolute', top: 14, right: 16, color: tint(C.gold, 0.55), fontSize: 12 }}
        >
          ◆
        </span>
      )}
      <Fields owner={owner} item={item} ids={ids} gap={10} />
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
          return s.items.length ? <Chips key={id} items={s.items} /> : null;
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
          owner={certs ? 'certs' : 'cards'}
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
          <Box key={i} owner="services" item={it} tone={(it.tone as keyof typeof TONES) ?? 'panel'} />
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
        {s.items.map((it, i) => (
          <Fields
            key={i}
            owner="about"
            item={it}
            ids={fieldsFor(it, DEFAULT_FIELDS.about)}
            gap={10}
           
          />
        ))}
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
        {s.items.map((it, i) => {
          const ids = fieldsFor(it, DEFAULT_FIELDS.band).filter((id) => hasContent(it, id));
          return (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'baseline', flexWrap: 'wrap' }}>
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

export function SectionView({ s }: { s: Section }) {
  const pad = PAD[s.pad ?? 'normal'];

  if (s.type === 'hero') {
    return (
      <section
        id={s.id}
        style={{ padding: `clamp(48px,8vw,104px) 0 ${Math.round(pad * 0.35)}px`, scrollMarginTop: 90 }}
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
    </section>
  );
}
