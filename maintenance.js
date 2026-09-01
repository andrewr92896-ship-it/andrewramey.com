// The notice served while the site is down for maintenance.
//
// SELF-CONTAINED, DELIBERATELY. No bundle, no stylesheet, no font, no image, no
// request of its own. This is the one page that has to render correctly at the
// moment something else is not, so anything it depended on would be something
// that could take it down too.
//
// It is a copy of the admin's MaintenanceScreen rather than an import: two
// deployments, and neither may import from the other. The values are the shared
// design tokens, written out.

const HTML = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Down for maintenance — Andrew Ramey</title>
<style>
  :root{color-scheme:dark}
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:56px 24px;
    text-align:center;color:#eef3ff;
    background:radial-gradient(1100px 640px at 20% -6%,#12336f 0%,#061026 62%);
    font-family:'IBM Plex Sans',system-ui,-apple-system,'Segoe UI',Arial,sans-serif}
  div{max-width:460px}
  .eyebrow{margin:0;font:500 .7rem/1.4 'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,monospace;
    letter-spacing:.2em;text-transform:uppercase;color:#ebcb74}
  h1{margin:16px 0 12px;font-size:clamp(1.6rem,4vw,2.2rem);line-height:1.15;
    letter-spacing:-.02em;font-weight:700}
  p{margin:0;font-size:1rem;line-height:1.7;color:#a9b9d9}
  .contact{margin:22px 0 0;font-size:.88rem;line-height:1.6;color:#6f84b0}
  a{color:#ebcb74}
</style></head><body>
<div>
  <p class="eyebrow">Andrew Ramey</p>
  <h1>Down for maintenance</h1>
  <p>The site is being updated and will be back shortly. Thanks for your patience.</p>
  <p class="contact">For anything urgent:
    <a href="mailto:Andrewr92896@gmail.com">Andrewr92896@gmail.com</a></p>
</div></body></html>`;

const BYTES = Buffer.byteLength(HTML);

/**
 * 503 WITH Retry-After, NEVER 200.
 *
 * The condition is temporary. A 200 lets a crawler record this notice as the
 * site's content, and a cacheable one outlives the maintenance itself — so the
 * page keeps being served to someone long after the site is back.
 */
export function sendMaintenance(req, res) {
  res.writeHead(503, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': BYTES,
    'Cache-Control': 'no-store',
    'Retry-After': '600',
    'X-Content-Type-Options': 'nosniff',
  });
  if (req.method === 'HEAD') return res.end();
  res.end(HTML);
}
