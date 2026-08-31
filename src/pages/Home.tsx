import { C } from '../theme/tokens';

/**
 * Holding page. This exists to prove the deploy pipeline end to end —
 * repository to Cloudflare Pages to the domain — before any design work is
 * layered on top. It is not the design.
 */
export default function Home() {
  return (
    <main
      style={{
        minHeight: '100%',
        display: 'grid',
        placeItems: 'center',
        padding: '48px 24px',
      }}
    >
      <div style={{ maxWidth: 560, width: '100%' }}>
        <p
          style={{
            font: `500 12px/1 ${C.mono}`,
            letterSpacing: '0.18em',
            color: C.faint,
            margin: '0 0 18px',
          }}
        >
          ANDREWRAMEY.COM
        </p>
        <h1
          style={{
            font: `700 clamp(34px, 7vw, 52px)/1.1 ${C.sans}`,
            margin: '0 0 16px',
            textWrap: 'balance',
          }}
        >
          Andrew Ramey
        </h1>
        <p style={{ font: `400 17px/1.6 ${C.sans}`, color: C.muted, margin: 0 }}>
          Portfolio in progress.
        </p>
      </div>
    </main>
  );
}
