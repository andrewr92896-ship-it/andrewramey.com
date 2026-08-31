import type { CSSProperties, ReactNode } from 'react';
import { C } from '../theme/tokens';

/** The reading column. Everything on the page sits inside one of these. */
export const SHELL: CSSProperties = {
  width: '100%',
  maxWidth: 1040,
  margin: '0 auto',
  padding: '0 clamp(20px, 5vw, 48px)',
};

/** Running prose stays near 68 characters; long lines are hard to read. */
export const PROSE: CSSProperties = { maxWidth: '62ch' };

export function Mono({
  children,
  color = C.faint,
  size = 12,
  style,
}: {
  children: ReactNode;
  color?: string;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        font: `500 ${size}px/1.4 ${C.mono}`,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/**
 * A page section. The mono label names what kind of thing the section is,
 * which is information the reader can use; a number would only be decoration,
 * since these are not a sequence.
 */
export function Section({
  id,
  label,
  title,
  intro,
  children,
}: {
  id: string;
  label: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} style={{ scrollMarginTop: 32, padding: 'clamp(48px, 8vw, 88px) 0 0' }}>
      <div style={SHELL}>
        <div style={{ borderBottom: `1px solid ${C.line}`, paddingBottom: 14, marginBottom: 28 }}>
          <Mono>{label}</Mono>
          <h2
            style={{
              font: `700 clamp(24px, 3.4vw, 32px)/1.2 ${C.sans}`,
              color: C.text,
              margin: '10px 0 0',
              textWrap: 'balance',
            }}
          >
            {title}
          </h2>
        </div>
        {intro && (
          <p style={{ ...PROSE, font: `400 17px/1.65 ${C.sans}`, color: C.muted, margin: '0 0 28px' }}>
            {intro}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

/** The panel treatment carried over from the terminal: hairline, no shadow. */
export function Panel({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.line}`,
        borderRadius: 10,
        padding: 'clamp(20px, 3vw, 28px)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        font: `500 12px/1 ${C.mono}`,
        color: C.muted,
        background: C.panel2,
        border: `1px solid ${C.line2}`,
        // Not a pill: a long label has to be able to wrap, and a lozenge with
        // two lines of text in it reads worse than a tag does. A tag also sits
        // better with the panel radii than a capsule.
        borderRadius: 6,
        padding: '6px 11px',
        // Without this a label longer than the viewport pushes the whole page
        // sideways — which is exactly what a phone found first.
        maxWidth: '100%',
      }}
    >
      {children}
    </span>
  );
}

/** A list whose markers are gold rules rather than bullets. */
export function Points({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
      {items.map((t) => (
        <li
          key={t}
          style={{
            font: `400 16px/1.6 ${C.sans}`,
            color: C.muted,
            paddingLeft: 20,
            position: 'relative',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              top: '0.72em',
              width: 10,
              height: 1,
              background: C.gold,
              opacity: 0.65,
            }}
          />
          {t}
        </li>
      ))}
    </ul>
  );
}

/**
 * An empty state that says what is missing rather than rendering nothing.
 * A section that silently disappears reads as a site that is broken; one that
 * says what is coming reads as a site that is maintained.
 */
export function Awaiting({ children }: { children: ReactNode }) {
  return (
    <Panel style={{ borderStyle: 'dashed', background: 'transparent' }}>
      <p style={{ font: `400 15px/1.6 ${C.sans}`, color: C.faint, margin: 0 }}>{children}</p>
    </Panel>
  );
}
