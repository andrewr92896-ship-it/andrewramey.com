import { Link } from 'react-router-dom';
import { C } from '../theme/tokens';

export default function NotFound() {
  return (
    <main style={{ minHeight: '100%', display: 'grid', placeItems: 'center', padding: '48px 24px' }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <p style={{ font: `500 12px/1 ${C.mono}`, letterSpacing: '0.18em', color: C.faint, margin: '0 0 16px' }}>
          404
        </p>
        <h1 style={{ font: `700 28px/1.2 ${C.sans}`, margin: '0 0 12px' }}>Page not found</h1>
        <p style={{ font: `400 16px/1.6 ${C.sans}`, color: C.muted, margin: '0 0 24px' }}>
          That address does not exist on this site.
        </p>
        <Link to="/" style={{ font: `500 15px/1 ${C.sans}`, color: C.gold }}>
          Back to the start
        </Link>
      </div>
    </main>
  );
}
