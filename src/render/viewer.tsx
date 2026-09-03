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
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { C, tint } from '../theme/tokens';

/**
 * The file viewer, and the one place a link's behaviour is decided.
 *
 * A file on this site can do one of three things when it is clicked: go there,
 * download, or open HERE in a viewer with a download button in it. That last
 * one is the reason this exists. A résumé that downloads on click makes a
 * reader leave the page and go and find a file manager to read one page of PDF;
 * showing it in place, with Download still one press away, keeps them reading.
 *
 * IT IS A CONTEXT RATHER THAN A PROP because a link can be almost anywhere in
 * the tree — a hero button, a card, a band — and threading an opener through
 * every section, box and field is how one of them ends up not having it.
 *
 * It lives in its own module so `fields.tsx` can consume it and `Portfolio.tsx`
 * can provide it without importing each other.
 */

type Opener = (file: { src: string; label?: string }) => void;

const FileViewerContext = createContext<Opener>(() => {});

export function useFileViewer(): Opener {
  return useContext(FileViewerContext);
}

const IMAGE = /\.(png|jpe?g|webp|gif|avif|svg)(\?|$)/i;
const PDF = /\.pdf(\?|$)/i;

export function fileKind(src: string): 'image' | 'pdf' | 'other' {
  if (IMAGE.test(src)) return 'image';
  if (PDF.test(src)) return 'pdf';
  return 'other';
}

/**
 * The anchor props for a behaviour.
 *
 * `preview` returns no props at all — the caller renders a button and opens the
 * viewer, because an anchor that does not navigate is a lie to a screen reader
 * and to anybody who middle-clicks it.
 */
export function linkProps(href: string, behavior?: string) {
  if (behavior === 'download') {
    // `download` is honoured for same-origin URLs only, which is exactly what
    // an uploaded file is — it is served from this domain through the proxy.
    // It also overrides the Content-Disposition the server sent, which is how
    // one file can both preview inline and download on demand.
    return { href, download: '' as const };
  }
  return {
    href,
    ...(/^https?:/.test(href) ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {}),
  };
}

export function FileViewerProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<{ src: string; label?: string } | null>(null);
  const open = useCallback<Opener>((next) => setFile(next), []);
  return (
    <FileViewerContext.Provider value={open}>
      {children}
      {file && <FileViewer file={file} onClose={() => setFile(null)} />}
    </FileViewerContext.Provider>
  );
}

/** The download glyph: an arrow into a tray, drawn rather than imported. */
function DownloadArrow() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="m7 11 5 5 5-5" />
      <path d="M4 20h16" />
    </svg>
  );
}

function FileViewer({
  file,
  onClose,
}: {
  file: { src: string; label?: string };
  onClose: () => void;
}) {
  const kind = fileKind(file.src);
  /**
   * A PDF in an iframe is unusable on a TOUCH device — iOS renders the first
   * page and will not scroll it — so there the viewer offers the file rather
   * than pretending to show it.
   *
   * The test is the POINTER, not the width. Width was the first version and it
   * was wrong in both directions: a 620px editor pane on a desktop, where the
   * embed works perfectly, fell back to the card; and a tablet held wide, where
   * it does not work, embedded anyway. The width check survives only as a floor
   * for a genuinely tiny window.
   *
   * Measured once on open — a viewer that reshaped itself mid-read would be
   * worse than either version of it.
   */
  const [narrow] = useState(
    () =>
      typeof window !== 'undefined' &&
      (window.innerWidth < 420 || window.matchMedia?.('(pointer: coarse)').matches === true),
  );

  /**
   * Focus goes INTO the dialog on open and BACK to what opened it on close.
   * Without the first, a keyboard user who pressed Enlarge is still on the
   * button behind the overlay, tabbing through a page they cannot see; without
   * the second, closing drops them at the top of the document.
   */
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    // The page behind must not scroll while this is over it.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
      opener?.focus?.();
    };
  }, [onClose]);

  const name = file.label || file.src.split('/').pop() || 'File';
  const embed = kind === 'image' || (kind === 'pdf' && !narrow);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={name}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        background: 'rgba(3,8,20,.92)',
        display: 'grid',
        gridTemplateRows: 'auto minmax(0, 1fr)',
        gap: 14,
        padding: 'clamp(14px, 3vw, 26px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            font: `600 .9rem/1.4 ${C.sans}`,
            color: C.text,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </span>
        <span style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {/*
            The standard download arrow, and nothing else (owner instruction).
            It carries a title and an aria-label because an icon on its own says
            nothing to a screen reader or to anybody hovering to check.
          */}
          <a
            href={file.src}
            download=""
            title="Download"
            aria-label="Download"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.4rem',
              height: '2.4rem',
              borderRadius: '.55rem',
              background: C.gold,
              color: C.goldText,
              textDecoration: 'none',
            }}
          >
            <DownloadArrow />
          </a>
          <a
            href={file.src}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '.6rem 1.1rem',
              borderRadius: '.55rem',
              border: `1px solid ${C.line2}`,
              color: C.text,
              font: `500 .85rem/1 ${C.sans}`,
              textDecoration: 'none',
            }}
          >
            Open in a new tab
          </a>
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              padding: '.6rem 1.1rem',
              borderRadius: '.55rem',
              border: `1px solid ${C.line2}`,
              background: 'transparent',
              color: C.text,
              font: `500 .85rem/1 ${C.sans}`,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </span>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{ minHeight: 0, display: 'grid', placeItems: 'center' }}
      >
        {kind === 'image' ? (
          <img
            src={file.src}
            alt={name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              borderRadius: 10,
              border: `1px solid ${C.line2}`,
            }}
          />
        ) : embed ? (
          <iframe
            src={file.src}
            title={name}
            style={{
              width: '100%',
              height: '100%',
              border: `1px solid ${C.line2}`,
              borderRadius: 10,
              background: '#fff',
            }}
          />
        ) : (
          <p
            style={{
              margin: 0,
              maxWidth: '28rem',
              textAlign: 'center',
              font: `400 .95rem/1.7 ${C.sans}`,
              color: C.muted,
              border: `1px solid ${C.line}`,
              background: tint('#091633', 0.6),
              borderRadius: 12,
              padding: '26px 24px',
            }}
          >
            This file opens best in its own tab on a small screen. Use Download or Open above.
          </p>
        )}
      </div>
    </div>
  );
}
