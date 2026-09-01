// Serving the files uploaded through the admin.
//
// The blobs live on the admin's volume; this streams them through so the public
// address is on andrewramey.com. THAT IS THE WHOLE REASON THE PROXY EXISTS: a
// résumé link is pasted into applications and sits in strangers' inboxes for
// months, and a link reading admin.andrewramey.com would both look wrong on a
// job application and advertise the door to everyone who saw it. It also means
// where the files are actually stored can change later without breaking a
// single link already in circulation.
//
// It carries no session and no credential — these files exist to be public.
//
// THE ADMIN DECIDES WHAT IS SERVED AND HOW, and this passes that decision
// through unexamined but not unbounded: only a Content-Type from a short
// allowlist is forwarded, so an admin answering with something unexpected
// cannot turn this origin into a host for it. `nosniff` on every response.

/**
 * Derived from ADMIN_STATE_URL rather than being its own variable — one
 * address to set, and no way for the two to end up pointing at different
 * services. Taken as the ORIGIN, not by trimming the known path off the end:
 * a suffix match silently produces a wrong base the moment that path changes,
 * and the failure looks like every file 404ing for no visible reason.
 */
const ADMIN = (() => {
  const raw = process.env.ADMIN_STATE_URL ?? '';
  if (!raw) return '';
  try {
    return new URL(raw).origin;
  } catch {
    return '';
  }
})();
const TIMEOUT_MS = 20_000;

/**
 * Content types this will pass on.
 *
 * Mirrors the admin's own allowlist. Deliberately no text/html, image/svg+xml
 * or anything script-bearing: those served from andrewramey.com would be script
 * running on this origin, which is the one thing a file host must never do.
 */
const PASS = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/avif',
  'text/plain; charset=utf-8',
  'text/csv; charset=utf-8',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
]);

function miss(res, status, message) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(message);
}

export function filesConfigured() {
  return Boolean(ADMIN);
}

/** True if this request was handled here. */
export async function serveFile(req, res, reqPath) {
  if (!reqPath.startsWith('/files/')) return false;
  if (req.method !== 'GET' && req.method !== 'HEAD') return false;

  if (!ADMIN) {
    miss(res, 404, 'Not found');
    return true;
  }

  // The slug is forwarded as one path segment. A path separator in it would let
  // a crafted URL reach past the admin's files route, so it is refused here as
  // well as there — the admin's own slug rules are the enforcement, this is the
  // check that stays correct if those ever loosen.
  const slug = reqPath.slice('/files/'.length);
  if (!slug || slug.includes('/') || slug.includes('..')) {
    miss(res, 404, 'Not found');
    return true;
  }

  try {
    const upstream = await fetch(`${ADMIN}/files/${encodeURIComponent(slug)}`, {
      method: req.method,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!upstream.ok) {
      miss(res, upstream.status === 404 ? 404 : 502, upstream.status === 404 ? 'Not found' : 'Unavailable');
      return true;
    }
    const type = upstream.headers.get('content-type') ?? '';
    if (!PASS.has(type)) {
      miss(res, 502, 'Unavailable');
      return true;
    }
    const headers = {
      'Content-Type': type,
      'Cache-Control': 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    };
    const length = upstream.headers.get('content-length');
    if (length) headers['Content-Length'] = length;
    const disposition = upstream.headers.get('content-disposition');
    if (disposition) headers['Content-Disposition'] = disposition;

    res.writeHead(200, headers);
    if (req.method === 'HEAD' || !upstream.body) {
      res.end();
      return true;
    }
    // Streamed rather than buffered: a 25 MB download must not become 25 MB of
    // this process's memory per person fetching it.
    for await (const chunk of upstream.body) {
      if (!res.write(chunk)) await new Promise((r) => res.once('drain', r));
    }
    res.end();
  } catch (err) {
    console.warn(`[files] could not fetch ${slug}: ${err.message}`);
    // The page is unaffected — only this download failed. Same posture as the
    // maintenance poll: the admin having a bad afternoon must not be visible
    // anywhere except the thing that actually needed it.
    if (!res.headersSent) miss(res, 502, 'Unavailable');
    else res.end();
  }
  return true;
}
