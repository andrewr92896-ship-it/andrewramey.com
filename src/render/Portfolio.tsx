import { useCallback, useEffect, useState } from 'react';
import { C, COLUMN, PAGE_BG, tint } from '../theme/tokens';
import type { Model, Nav } from '../content/types';
import { SectionView } from './sections';

/**
 * The portfolio renderer.
 *
 * THERE IS ONE RENDERER, NEVER TWO. The owner editor on
 * admin.andrewramey.com will be chrome around this same component, so anything
 * added here has to be a property of the content model rather than of the
 * public page — otherwise the editor and the live site drift into showing
 * different things.
 *
 * THE PUBLIC SITE HAS NO SIGN-IN. The design handoff carries a "Sign in"
 * button and a sign-in dialog; both are prototype chrome and are deliberately
 * absent. Do not reintroduce them — see AGENTS.md.
 */

/** Scroll to a section, or let the browser handle a real link. */
function useAnchorScroll() {
  return useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    const el = document.getElementById(href.slice(1));
    if (!el) return;
    e.preventDefault();
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 20,
      behavior: reduce ? 'auto' : 'smooth',
    });
    // Keep the address bar honest about where the reader is, without pushing a
    // history entry for every nav click.
    history.replaceState(null, '', href);
  }, []);
}

function Header({ nav }: { nav: Nav }) {
  const onAnchor = useAnchorScroll();
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        padding: '20px clamp(20px,5vw,64px)',
        borderBottom: `1px solid ${C.line}`,
      }}
    >
      <a
        href="#top"
        onClick={(e) => onAnchor(e, '#top')}
        style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', minWidth: 0 }}
      >
        <span
          style={{
            width: nav.logoSize,
            height: nav.logoSize,
            flex: '0 0 auto',
            border: `1px solid ${C.line2}`,
            borderRadius: 8,
            background: tint(C.gold, 0.07),
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
          }}
        >
          {nav.logoMode === 'image' && nav.logoSrc ? (
            <img
              src={nav.logoSrc}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <span style={{ font: `500 .78rem/1 ${C.mono}`, color: C.gold }}>{nav.initials}</span>
          )}
        </span>
        {nav.showWordmark && (
          <span style={{ minWidth: 0 }}>
            <span
              style={{
                display: 'block',
                font: `700 .85rem/1.2 ${C.sans}`,
                letterSpacing: '.22em',
                color: C.text,
              }}
            >
              {nav.wordmark}
            </span>
            {nav.subline && (
              <span
                style={{
                  display: 'block',
                  font: `500 .55rem/1.2 ${C.sans}`,
                  letterSpacing: '.34em',
                  color: C.gold,
                  marginTop: 3,
                }}
              >
                {nav.subline}
              </span>
            )}
          </span>
        )}
      </a>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {nav.items.map((it) => {
          const href = /^(https?:|mailto:)/.test(it.target) ? it.target : `#${it.target}`;
          return (
            <a
              key={it.label}
              href={href}
              onClick={(e) => onAnchor(e, href)}
              style={{
                padding: '8px 12px',
                borderRadius: 7,
                color: C.muted,
                textDecoration: 'none',
                font: `400 .9rem/1 ${C.sans}`,
              }}
            >
              {it.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer
      style={{
        borderTop: `1px solid ${C.line}`,
        marginTop: 48,
        paddingTop: 22,
        display: 'flex',
        gap: 16,
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        color: C.faint,
        font: `400 .82rem/1.6 ${C.sans}`,
      }}
    >
      <span>© 2026 Ramey Essential Solutions LLC</span>
      {/* Load-bearing. Keep it on every page — see AGENTS.md. */}
      <span style={{ maxWidth: '44rem' }}>
        Software engineering and AI work only. Nothing on this site is financial, investment, tax or
        trading advice, or an offer of advisory services.
      </span>
    </footer>
  );
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        background: 'rgba(3,8,20,.92)',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          borderRadius: 10,
          border: `1px solid ${C.line2}`,
        }}
      />
      <button
        type="button"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          padding: '10px 16px',
          borderRadius: 8,
          border: `1px solid ${C.line2}`,
          background: 'transparent',
          color: C.text,
          font: `500 .88rem/1 ${C.sans}`,
          cursor: 'pointer',
        }}
      >
        Close
      </button>
    </div>
  );
}

export default function Portfolio({ model }: { model: Model }) {
  const [lightbox, setLightbox] = useState('');
  const onOpenImage = useCallback((src: string) => setLightbox(src), []);
  const ctx = { onOpenImage };

  return (
    <div style={{ minHeight: '100%', background: PAGE_BG }}>
      <Header nav={model.nav} />
      <main style={{ width: COLUMN, margin: '0 auto', padding: '0 0 64px' }}>
        {model.sections
          .filter((s) => !s.hidden)
          .map((s) => (
            <SectionView key={s.id} s={s} ctx={ctx} />
          ))}
        <Footer />
      </main>
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox('')} />}
    </div>
  );
}
