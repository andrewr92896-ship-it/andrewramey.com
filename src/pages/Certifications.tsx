import { useEffect } from 'react';
import CertificationsPage from '../render/Certifications';
import { SITE_MODEL } from '../content/live';

const TITLE = 'Certifications · Andrew Ramey';
const DESCRIPTION =
  'Professional certifications held by Andrew Ramey, each with a direct link to the official credential page.';

/**
 * /certifications — the second public page.
 *
 * The document's title and description are set here as well as by server.js,
 * which composes them into the shell for a direct visit. This covers the other
 * way of arriving: a client-side navigation from the portfolio, where the
 * shell that was served carried the portfolio's own.
 */
export default function Certifications() {
  useEffect(() => {
    const prevTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') ?? null;
    document.title = TITLE;
    meta?.setAttribute('content', DESCRIPTION);
    window.scrollTo(0, 0);
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc !== null) meta.setAttribute('content', prevDesc);
    };
  }, []);
  return <CertificationsPage model={SITE_MODEL} />;
}
