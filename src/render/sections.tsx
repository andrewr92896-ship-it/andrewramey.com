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
} from '../content/types';
import { Btn, Chips, Field, hasContent, typoFor } from './fields';

type Ctx = { onOpenImage: (src: string) => void };

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
  ctx,
}: {
  owner: string;
  item: Item;
  ids: string[];
  gap: number;
  ctx: Ctx;
}) {
  const shown = ids.filter((id) => hasContent(item, id));
  if (!shown.length) return null;
  return (
    <div style={{ display: 'grid', gap, minWidth: 0 }}>
      {shown.map((id) => (
        <Field key={id} owner={owner} item={item} id={id} onOpenImage={ctx.onOpenImage} />
      ))}
    </div>
  );
}

function Box({
  owner,
  item,
  ctx,
  tone,
  mark,
}: {
  owner: string;
  item: Item;
  ctx: Ctx;
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
      <Fields owner={owner} item={item} ids={ids} gap={10} ctx={ctx} />
    </div>
  );
}

// ---------------------------------------------------------------- header

function SectionHeader({ s, ctx }: { s: Section; ctx: Ctx }) {
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
      {ctx ? null : null}
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

function Hero({ s, ctx }: { s: Section; ctx: Ctx }) {
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
      {ctx ? null : null}
    </div>
  );
}

function Cards({ s, ctx, certs }: { s: Section; ctx: Ctx; certs?: boolean }) {
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
          ctx={ctx}
          tone={certs ? 'outline' : 'panel'}
          mark={certs}
        />
      ))}
    </div>
  );
}

function Tiers({ s, ctx }: { s: Section; ctx: Ctx }) {
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
            <Fields owner="tiers" item={it} ids={colA} gap={8} ctx={ctx} />
            <Fields owner="tiers" item={it} ids={colB} gap={10} ctx={ctx} />
          </div>
        );
      })}
    </div>
  );
}

function Timeline({ s, ctx }: { s: Section; ctx: Ctx }) {
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
            <Fields owner="timeline" item={it} ids={colA} gap={6} ctx={ctx} />
            <Fields owner="timeline" item={it} ids={colB} gap={10} ctx={ctx} />
          </div>
        );
      })}
    </div>
  );
}

function About({ s, ctx }: { s: Section; ctx: Ctx }) {
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
            ctx={ctx}
          />
        ))}
      </div>
    </div>
  );
}

function Band({ s, ctx }: { s: Section; ctx: Ctx }) {
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
                <Field key={id} owner="band" item={it} id={id} onOpenImage={ctx.onOpenImage} />
              ))}
            </div>
          );
        })}
      </div>
      {s.ctaLabel && (
        <Btn b={{ label: s.ctaLabel, href: s.ctaHref || '#', variant: 'solid' }} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------- entry

export function SectionView({ s, ctx }: { s: Section; ctx: Ctx }) {
  const pad = PAD[s.pad ?? 'normal'];

  if (s.type === 'hero') {
    return (
      <section
        id={s.id}
        style={{ padding: `clamp(48px,8vw,104px) 0 ${Math.round(pad * 0.35)}px`, scrollMarginTop: 90 }}
      >
        <Hero s={s} ctx={ctx} />
      </section>
    );
  }

  // A band is its own panel, so it carries its own top margin rather than
  // section padding — otherwise the gap above it doubles.
  if (s.type === 'band') {
    return (
      <section id={s.id} style={{ scrollMarginTop: 90 }}>
        <div style={{ padding: `${pad}px 0 ${Math.round(pad * 0.35)}px` }}>
          <SectionHeader s={s} ctx={ctx} />
        </div>
        <Band s={{ ...s, pad: 'compact' }} ctx={ctx} />
      </section>
    );
  }

  return (
    <section id={s.id} style={{ scrollMarginTop: 90 }}>
      <div style={{ padding: `${pad}px 0 ${Math.round(pad * 0.35)}px` }}>
        <SectionHeader s={s} ctx={ctx} />
      </div>
      {s.type === 'cards' && <Cards s={s} ctx={ctx} />}
      {s.type === 'certs' && <Cards s={s} ctx={ctx} certs />}
      {s.type === 'tiers' && <Tiers s={s} ctx={ctx} />}
      {s.type === 'timeline' && <Timeline s={s} ctx={ctx} />}
      {s.type === 'about' && <About s={s} ctx={ctx} />}
    </section>
  );
}
