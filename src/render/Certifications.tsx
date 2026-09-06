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

import { C, COLUMN, PAGE_BG, tint } from '../theme/tokens';
import type { Certification, CertificationsPage, Model } from '../content/types';
import { Footer } from './Portfolio';
import { FileViewerProvider, linkProps, useFileViewer } from './viewer';

/**
 * The Certifications page — /certifications on the public site, and the
 * "Certifications page" entry in the editor.
 *
 * A DIRECTORY, NOT A SHOWCASE. A recruiter reads down it: each credential is
 * one row with the certificate on the left and the facts on the right, and
 * the verification address is printed in full as well as linked — the point
 * of the page is that every claim on it can be checked in one click.
 *
 * It renders from `model.certifications`, and a model without one still gets
 * a page: the name comes from the nav's wordmark and the list is empty. That
 * is what keeps /certifications answering before the page has been set up.
 */

const DEFAULT_HOME = 'https://andrewramey.com';

function resolved(model: Model): CertificationsPage {
  const page = model.certifications;
  return {
    ...page,
    name: page?.name || model.nav.wordmark,
    homeHref: page?.homeHref || DEFAULT_HOME,
    homeLabel: page?.homeLabel || 'Full portfolio',
    title: page?.title || 'Certifications',
    items: page?.items ?? [],
  };
}

function Profile({ page }: { page: CertificationsPage }) {
  return (
    <header
      className="cert-profile"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        flexWrap: 'wrap',
        padding: '44px 0 28px',
        borderBottom: `1px solid ${C.line}`,
      }}
    >
      {page.headshotSrc && (
        <img
          src={page.headshotSrc}
          alt={page.name ? `${page.name}, headshot` : 'Headshot'}
          style={{
            width: 96,
            height: 96,
            borderRadius: 16,
            objectFit: 'cover',
            flex: 'none',
            border: `1px solid ${C.line2}`,
            background: tint(C.gold, 0.07),
          }}
        />
      )}
      <div style={{ flex: '1 1 320px', minWidth: 0 }}>
        <h1
          style={{
            margin: 0,
            font: `700 clamp(1.4rem, 2.6vw, 1.9rem)/1.15 ${C.sans}`,
            color: C.text,
          }}
        >
          {page.name}
        </h1>
        {page.role && (
          <p
            style={{
              margin: '6px 0 0',
              font: `500 .7rem/1.5 ${C.mono}`,
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: C.gold,
            }}
          >
            {page.role}
          </p>
        )}
        {page.intro && (
          <p
            style={{
              margin: '12px 0 0',
              font: `400 .98rem/1.65 ${C.sans}`,
              color: C.muted,
              maxWidth: '52rem',
            }}
          >
            {page.intro}
          </p>
        )}
      </div>
      <a
        href={page.homeHref}
        style={{
          flex: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '11px 18px',
          borderRadius: 9,
          background: C.gold,
          color: C.goldText,
          textDecoration: 'none',
          font: `600 .9rem/1 ${C.sans}`,
        }}
      >
        ← {page.homeLabel}
      </a>
    </header>
  );
}

function Entry({ c, index }: { c: Certification; index: number }) {
  const openFile = useFileViewer();
  const str = (v: unknown) => (typeof v === 'string' ? v : '');
  const title = str(c.title) || `Certification ${index + 1}`;
  const src = str(c.imgSrc);
  const href = str(c.href);
  return (
    <article
      className="cert-entry"
      aria-label={title}
      style={{
        padding: 'clamp(18px, 2.4vw, 26px)',
        borderRadius: 14,
        border: `1px solid ${C.line}`,
        background: C.panel,
      }}
    >
      <div className="cert-entry-image">
        {src ? (
          <button
            type="button"
            onClick={() => openFile({ src, label: title })}
            aria-label={`Enlarge: ${title}`}
            style={{
              display: 'block',
              width: '100%',
              padding: 0,
              border: `1px solid ${C.line2}`,
              borderRadius: 10,
              overflow: 'hidden',
              background: tint('#091633', 0.6),
              cursor: 'zoom-in',
            }}
          >
            <img
              src={src}
              alt={`${title} certificate`}
              loading="lazy"
              decoding="async"
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
          </button>
        ) : (
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              aspectRatio: '16 / 10',
              borderRadius: 10,
              border: `1px dashed ${C.line2}`,
              background: tint('#091633', 0.6),
              font: `500 .68rem/1.4 ${C.mono}`,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: C.faint,
            }}
          >
            Certificate to come
          </div>
        )}
      </div>
      <div className="cert-entry-facts" style={{ minWidth: 0 }}>
        <h2 style={{ margin: 0, font: `700 1.2rem/1.3 ${C.sans}`, color: C.text }}>{title}</h2>
        <dl
          style={{
            margin: '12px 0 0',
            display: 'grid',
            gridTemplateColumns: 'auto minmax(0, 1fr)',
            gap: '6px 14px',
            font: `400 .92rem/1.55 ${C.sans}`,
            color: C.muted,
          }}
        >
          {str(c.issuer) && (
            <>
              <dt
                style={{ font: `500 .66rem/1.8 ${C.mono}`, letterSpacing: '.14em', color: C.faint }}
              >
                ISSUER
              </dt>
              <dd style={{ margin: 0, color: C.text }}>{str(c.issuer)}</dd>
            </>
          )}
          {str(c.issued) && (
            <>
              <dt
                style={{ font: `500 .66rem/1.8 ${C.mono}`, letterSpacing: '.14em', color: C.faint }}
              >
                ISSUED
              </dt>
              <dd style={{ margin: 0, color: C.text }}>{str(c.issued)}</dd>
            </>
          )}
        </dl>
        {str(c.body) && (
          <p style={{ margin: '14px 0 0', font: `400 .95rem/1.65 ${C.sans}`, color: C.muted }}>
            {str(c.body)}
          </p>
        )}
        {href && (
          <p style={{ margin: '16px 0 0', font: `400 .86rem/1.6 ${C.sans}`, color: C.faint }}>
            <span
              style={{
                display: 'block',
                font: `500 .66rem/1.8 ${C.mono}`,
                letterSpacing: '.14em',
                color: C.faint,
              }}
            >
              VERIFY
            </span>
            <a
              className="cert-url"
              {...linkProps(href)}
              style={{
                color: C.gold,
                textDecoration: 'underline',
                textDecorationColor: tint(C.gold, 0.5),
                textUnderlineOffset: 3,
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
              }}
            >
              {href}
            </a>
          </p>
        )}
      </div>
    </article>
  );
}

export default function CertificationsPage({ model }: { model: Model }) {
  const page = resolved(model);
  return (
    <FileViewerProvider>
      <div style={{ minHeight: '100%', background: PAGE_BG }}>
        <main style={{ width: COLUMN, margin: '0 auto', padding: '0 0 64px' }}>
          <Profile page={page} />
          <section id="certifications" style={{ paddingTop: 36 }}>
            <p
              style={{
                margin: 0,
                font: `500 .7rem/1.5 ${C.mono}`,
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: C.gold,
              }}
            >
              {page.title}
            </p>
            {page.note && (
              <p
                style={{
                  margin: '8px 0 0',
                  font: `400 .95rem/1.65 ${C.sans}`,
                  color: C.muted,
                  maxWidth: '52rem',
                }}
              >
                {page.note}
              </p>
            )}
            <div style={{ display: 'grid', gap: 18, marginTop: 20 }}>
              {page.items.length === 0 ? (
                <p style={{ margin: 0, font: `400 .95rem/1.6 ${C.sans}`, color: C.faint }}>
                  No certifications listed yet.
                </p>
              ) : (
                page.items.map((c, i) => <Entry key={i} c={c} index={i} />)
              )}
            </div>
          </section>
          <Footer />
        </main>
      </div>
    </FileViewerProvider>
  );
}
