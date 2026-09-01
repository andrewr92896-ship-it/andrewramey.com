// Maintenance mode and the file proxy, driven against the real server with a
// stand-in admin.
//
// THE CASE THAT MATTERS MOST IS THE LAST GROUP: when the admin cannot be
// reached, the site stays up. That failure is silent in the worst possible way
// — the portfolio would go dark because a completely different service had a
// bad afternoon, with nothing anywhere saying so.
//
// The health check is the second: Railway rolls a deploy back when its health
// check fails, so a maintenance mode covering /healthz would refuse to deploy
// at exactly the moment it was wanted.
//
//   npm run test:maintenance      (build first — it serves the real site)

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';

let pass = 0,
  fail = 0;
const ok = (cond, label, extra = '') => {
  cond ? pass++ : fail++;
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${extra ? '  — ' + extra : ''}`);
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- a stand-in for the admin, whose answer the test controls
let answer = { status: 200, body: '{"maintenance":false}' };
let sawSiteHeader = false;
/** What the stand-in admin serves under /files/. */
const blobs = {
  '/files/resume.pdf': { status: 200, type: 'application/pdf', body: '%PDF-1.4 hello' },
  // The case the type allowlist exists for: an admin answering with something
  // script-bearing must not be able to make this origin host it.
  '/files/evil.html': { status: 200, type: 'text/html', body: '<script>alert(1)</script>' },
};
const admin = createServer((req, res) => {
  const path = (req.url ?? '').split('?')[0];
  if (path.startsWith('/files/')) {
    const blob = blobs[path];
    if (!blob) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    res.writeHead(blob.status, {
      'Content-Type': blob.type,
      'Content-Disposition': 'inline; filename="x"',
    });
    return res.end(blob.body);
  }
  if (req.headers['x-ar-site'] === 'portfolio') sawSiteHeader = true;
  res.writeHead(answer.status, { 'Content-Type': 'application/json' });
  res.end(answer.body);
});
await new Promise((r) => admin.listen(4700, r));
const STATE_URL = 'http://localhost:4700/state';

const CWD = new URL('..', import.meta.url).pathname;
function start(port, env = {}) {
  return spawn('node', ['server.js'], {
    cwd: CWD,
    env: { ...process.env, PORT: String(port), ...env },
    stdio: 'ignore',
  });
}

/**
 * Each case restarts the server, because the poll runs once immediately on boot
 * and then every fifteen seconds — waiting out a real interval would make this
 * test slower than it is worth. It is the same code path either way.
 */
async function withServer(port, env, fn) {
  const p = start(port, env);
  await wait(1200);
  try {
    await fn(`http://localhost:${port}`);
  } finally {
    p.kill();
    await wait(250);
  }
}

// ---- A. off
console.log('\nA. MAINTENANCE OFF');
answer = { status: 200, body: '{"maintenance":false}' };
await withServer(4701, { ADMIN_STATE_URL: STATE_URL }, async (B) => {
  const r = await fetch(`${B}/`, { headers: { Accept: 'text/html' } });
  const html = await r.text();
  ok(r.status === 200 && html.includes('<div id="root">'), 'the site is served', `${r.status}`);
  ok(!html.includes('Down for maintenance'), 'and it is not the notice');
  ok(sawSiteHeader, 'the poll identifies itself as the site');
});

// ---- B. on
console.log('\nB. MAINTENANCE ON');
answer = { status: 200, body: '{"maintenance":true}' };
await withServer(4702, { ADMIN_STATE_URL: STATE_URL }, async (B) => {
  let r = await fetch(`${B}/`, { headers: { Accept: 'text/html' } });
  const html = await r.text();
  ok(r.status === 503, 'the notice answers 503, not 200', `${r.status}`);
  ok(r.headers.get('retry-after') !== null, 'with Retry-After, so it reads as temporary');
  ok(
    (r.headers.get('cache-control') ?? '').includes('no-store'),
    'and is not cacheable — it must not outlive the maintenance',
  );
  ok(html.includes('Down for maintenance'), 'and it is the notice');
  ok(!html.includes('<div id="root">'), 'the site itself is not served underneath it');

  r = await fetch(`${B}/assets/nothing.js`);
  ok(r.status === 503, 'assets are covered too', `${r.status}`);

  // The one that decides whether a deploy survives.
  r = await fetch(`${B}/healthz`);
  ok(r.status === 200, 'BUT /healthz still answers 200 — a rollback here would be the outage', `${r.status}`);

  // A DELIBERATE DECISION, PINNED HERE SO IT IS NOT QUIETLY REVERSED EITHER
  // WAY. "Down for maintenance" means the site is off the air, and its files
  // are part of the site. Exempting them was considered — a résumé link in a
  // stranger's inbox is a promise — and rejected: the label would then be
  // false, and the 503 already tells a browser the condition is temporary.
  r = await fetch(`${B}/files/resume.pdf`);
  ok(r.status === 503, 'and files are covered by maintenance too, deliberately', `${r.status}`);
});

// ---- C. fail open
console.log('\nC. FAIL OPEN');
answer = { status: 500, body: 'nope' };
await withServer(4703, { ADMIN_STATE_URL: STATE_URL }, async (B) => {
  const r = await fetch(`${B}/`, { headers: { Accept: 'text/html' } });
  ok(r.status === 200, 'an admin answering 500 leaves the site up', `${r.status}`);
});

answer = { status: 200, body: '{"maintenance":"yes"}' };
await withServer(4704, { ADMIN_STATE_URL: STATE_URL }, async (B) => {
  const r = await fetch(`${B}/`, { headers: { Accept: 'text/html' } });
  ok(r.status === 200, 'a payload it cannot understand leaves the site up', `${r.status}`);
});

await withServer(4705, { ADMIN_STATE_URL: 'http://localhost:4799/nothing-listening' }, async (B) => {
  const r = await fetch(`${B}/`, { headers: { Accept: 'text/html' } });
  ok(r.status === 200, 'an unreachable admin leaves the site up', `${r.status}`);
});

await withServer(4706, {}, async (B) => {
  const r = await fetch(`${B}/`, { headers: { Accept: 'text/html' } });
  ok(r.status === 200, 'no ADMIN_STATE_URL at all leaves the site up', `${r.status}`);
});

// ---- D. the file proxy
console.log('\nD. THE FILE PROXY');
answer = { status: 200, body: '{"maintenance":false}' };
await withServer(4707, { ADMIN_STATE_URL: STATE_URL }, async (B) => {
  let r = await fetch(`${B}/files/resume.pdf`);
  ok(r.status === 200, 'a file is served from THIS domain', `${r.status}`);
  ok(r.headers.get('content-type') === 'application/pdf', 'with its type passed through');
  ok(r.headers.get('x-content-type-options') === 'nosniff', 'and nosniff');
  ok((await r.text()).includes('%PDF'), 'and the bytes arrive');

  // The whole reason the type allowlist exists.
  r = await fetch(`${B}/files/evil.html`);
  ok(r.status === 502, 'an upstream text/html is REFUSED — this origin never hosts script', `${r.status}`);

  r = await fetch(`${B}/files/nothing.pdf`);
  ok(r.status === 404, 'a missing file is an honest 404', `${r.status}`);

  r = await fetch(`${B}/files/..%2F..%2Fetc%2Fpasswd`);
  ok(r.status === 404, 'a traversal attempt gets nothing', `${r.status}`);
});

await withServer(4708, { ADMIN_STATE_URL: 'http://localhost:4799/api/public/site-state' }, async (B) => {
  const r = await fetch(`${B}/files/resume.pdf`);
  ok(r.status === 502, 'an unreachable admin fails the download', `${r.status}`);
  const page = await fetch(`${B}/`, { headers: { Accept: 'text/html' } });
  ok(page.status === 200, 'and leaves the page itself completely alone', `${page.status}`);
});

await withServer(4709, {}, async (B) => {
  const r = await fetch(`${B}/files/resume.pdf`);
  ok(r.status === 404, 'with no admin configured at all, files are simply not there', `${r.status}`);
});

admin.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
