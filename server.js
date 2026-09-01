// Static file server for the built site.
//
// Railway runs a process rather than serving files from a CDN, so the built
// `dist/` needs something in front of it. This is deliberately dependency-free:
// the whole job is four rules, and each one is a real decision.
//
//   1. Hashed assets are cached forever; index.html never is. Vite fingerprints
//      every file in assets/, so those are safe to pin — but a cached
//      index.html would keep pointing at the previous build's filenames after a
//      deploy, and the site would silently serve a version that no longer
//      exists.
//   2. An unmatched path falls back to index.html so client-side routes resolve
//      on a hard refresh. Without it every URL but `/` 404s on a direct visit,
//      which is exactly how a credential badge link arrives.
//   3. The fallback applies only to requests that asked for HTML. A missing
//      image or script must 404 honestly — answering it with the HTML shell
//      turns a broken asset into a confusing parse error instead.
//   4. Paths are resolved and checked to be inside dist/, so a crafted URL
//      cannot read files above the web root.
//   5. /healthz answers 200 unconditionally, INCLUDING while the site is down
//      for maintenance. Railway rolls a deploy back when its health check
//      fails, so a maintenance mode that covered this path would refuse to
//      deploy at exactly the moment it was needed.
//   6. While maintenance is on, every other path gets the notice — see
//      siteState.js for the rule that decides, and maintenance.js for why it
//      is a 503 rather than a 200.
//   7. /files/… is streamed from the admin, so a résumé link is on this domain
//      rather than on admin.andrewramey.com. See files.js.
//   8. index.html is composed per request, with the published content injected
//      into it. See sendShell — the content arrives WITH the document, so the
//      first paint is the real page rather than a flash and a swap.

import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { maintenanceOn, publishedContent, startPolling } from './siteState.js';
import { sendMaintenance } from './maintenance.js';
import { serveFile } from './files.js';

const ROOT = resolve(fileURLToPath(new URL('./dist', import.meta.url)));
const PORT = Number(process.env.PORT) || 8080;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml; charset=utf-8',
};

/** Resolve a URL path to a file inside dist/, or null if it escapes the root. */
function resolvePath(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split('?')[0]);
  } catch {
    return null;
  }
  const full = resolve(join(ROOT, decoded));
  if (full !== ROOT && !full.startsWith(ROOT + sep)) return null;
  return full;
}

async function fileAt(path) {
  try {
    const s = await stat(path);
    return s.isFile() ? s : null;
  } catch {
    return null;
  }
}

function send(res, status, path, size, { immutable = false } = {}) {
  const type = TYPES[extname(path).toLowerCase()] ?? 'application/octet-stream';
  res.writeHead(status, {
    'Content-Type': type,
    'Content-Length': size,
    'Cache-Control': immutable
      ? 'public, max-age=31536000, immutable'
      : 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  });
  createReadStream(path).pipe(res);
}

/**
 * index.html with the published content injected.
 *
 * The alternative — the browser fetching the model after the page loads — costs
 * a round trip before anything can be drawn, and shows an empty page for the
 * length of it. This way the document arrives complete.
 *
 * ESCAPING IS THE WHOLE RISK HERE. The content is written by the owner in the
 * admin, but it is still arbitrary text being placed inside a <script> tag: a
 * literal "</script>" in a body paragraph would close the tag early and the
 * rest of the model would be parsed as markup. Escaping "<" as \u003c is
 * JSON-equivalent and closes that, along with the "<!--" case.
 *
 * The composed HTML is cached against the model it was built from, so this is
 * one serialize per publish rather than one per visitor.
 */
let shellCache = { model: null, html: null };

function composeShell(raw, model) {
  if (!model) return raw;
  if (shellCache.model === model && shellCache.html) return shellCache.html;
  const json = JSON.stringify(model).replace(/</g, '\\u003c');
  const html = raw.replace('</head>', `<script>window.__AR_MODEL__=${json}</script></head>`);
  shellCache = { model, html };
  return html;
}

async function sendShell(req, res, path) {
  let raw;
  try {
    raw = await readFile(path, 'utf8');
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      .end('Site not built. Run `npm run build`.');
    return;
  }
  const html = composeShell(raw, publishedContent());
  const body = Buffer.from(html, 'utf8');
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': body.length,
    // Never cached: it carries the content, so a cached copy is a stale page
    // that outlives a publish — and it already could not be cached, because it
    // names the current build's fingerprinted assets.
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  });
  if (req.method === 'HEAD') return res.end();
  res.end(body);
}

const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed');
    return;
  }

  const reqPath = (req.url ?? '/').split('?')[0];

  // Rule 5. Exempt from everything below, deliberately.
  if (reqPath === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end('ok');
    return;
  }

  // Rule 6.
  if (maintenanceOn()) {
    sendMaintenance(req, res);
    return;
  }

  // Rule 7. Answers only for /files/…; anything else falls through.
  if (await serveFile(req, res, reqPath)) return;

  const urlPath = req.url === '/' ? '/index.html' : req.url;
  const path = resolvePath(urlPath);

  // Rule 8: the shell is composed, never streamed off disk.
  if (path === join(ROOT, 'index.html')) {
    await sendShell(req, res, path);
    return;
  }

  if (path) {
    const found = await fileAt(path);
    if (found) {
      // Vite fingerprints everything under assets/, so those are safe to pin.
      const immutable = urlPath.startsWith('/assets/');
      send(res, 200, path, found.size, { immutable });
      return;
    }
  }

  // Rule 3: only an HTML request gets the SPA shell.
  const wantsHtml = (req.headers.accept ?? '').includes('text/html');
  if (!wantsHtml) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
    return;
  }

  // 200, not 404 — the router decides what this route is, and it may be a real
  // page. Its own NotFound component answers for the ones that are not.
  await sendShell(req, res, join(ROOT, 'index.html'));
});

startPolling();

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Serving ${ROOT} on :${PORT}`);
});
