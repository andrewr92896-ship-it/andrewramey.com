import { MODEL } from './model';
import type { Model } from './types';

/**
 * The model this site actually renders.
 *
 * The server fetches the published content from the admin and injects it into
 * index.html as `window.__AR_MODEL__` before the page is sent. That is why
 * there is no fetch here and no loading state: the content arrives WITH the
 * document, so the first paint is the real page rather than a flash of nothing
 * followed by a swap.
 *
 * `MODEL` from code is the fallback and only that — a brand new deploy that has
 * not yet reached the admin, or an admin that has never published. Falling back
 * to it means the site always renders something true rather than nothing; see
 * siteState.js, which holds the last published content indefinitely for the
 * same reason.
 *
 * NOT A MIRRORED FILE. It is how this deployment gets its content, and the
 * admin gets its own a different way.
 */

declare global {
  interface Window {
    __AR_MODEL__?: unknown;
  }
}

function injected(): Model | null {
  const raw = typeof window === 'undefined' ? null : window.__AR_MODEL__;
  if (!raw || typeof raw !== 'object') return null;
  const m = raw as Partial<Model>;
  // Checked rather than trusted: a malformed model throws inside the renderer,
  // which is a blank page. The bundled one is a better answer than that.
  if (!m.nav || !Array.isArray(m.sections) || m.sections.length === 0) return null;
  return m as Model;
}

export const SITE_MODEL: Model = injected() ?? MODEL;
