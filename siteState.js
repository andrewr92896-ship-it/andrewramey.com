// What the admin tells this site: whether to show the maintenance notice, and
// what the page's content is.
//
// The answer belongs to the admin (admin.andrewramey.com), which is a separate
// deployment. This asks it on a timer and caches what it hears.
//
// IT FAILS OPEN, AND THAT IS THE ONE RULE HERE.
//
// Every way of not knowing — no URL configured, never answered, the admin down,
// slow, mid-deploy, or answering something this cannot parse — resolves to
// "show the portfolio". The admin being unavailable must never be what takes
// the portfolio down: that is a failure with no symptom anybody would think to
// look for, on the site whose whole job is being there when someone looks.
//
// IT POLLS RATHER THAN ASKING PER REQUEST, for two reasons. A per-request fetch
// would put the admin's latency and uptime on every page load, which is the
// coupling the paragraph above exists to prevent. And it lets the notice be a
// real 503 — a request-time answer would arrive after the page had already been
// served 200, leaving a crawler recording the notice as the site's content.

const URL_ = process.env.ADMIN_STATE_URL ?? '';
const POLL_MS = 15_000;
const TIMEOUT_MS = 4_000;

/**
 * How old an answer may be and still count.
 *
 * Comfortably more than the poll interval, so one missed request is not a
 * change of state — but short enough that an admin which stopped answering
 * cannot leave the site down indefinitely on the strength of a stale yes.
 */
const STALE_MS = 120_000;

let last = { maintenance: false, at: 0 };
let logged = null;

/**
 * The published content, and the rule for it is DIFFERENT from maintenance's.
 *
 * Maintenance goes stale on purpose: a silent admin must not be able to leave
 * the site down on the strength of an old yes. Content is the opposite — the
 * last thing that was published is still the right thing to serve, however long
 * ago it was fetched, so this is kept indefinitely once it arrives.
 *
 * Null means it has NEVER arrived, and only then does the site fall back to the
 * model compiled into the bundle. That fallback is what makes the site render
 * on a completely fresh deploy, and what stops an admin outage blanking it.
 */
let content = null;

/**
 * The published model, or null if this site has never managed to fetch one.
 *
 * Null is not an error — it is the honest answer on a first boot, and the
 * caller renders the bundled model rather than nothing.
 */
export function publishedContent() {
  return content;
}

/** The current answer. Never throws, never blocks, never guesses "yes". */
export function maintenanceOn() {
  if (!URL_) return false;
  if (Date.now() - last.at > STALE_MS) return false;
  return last.maintenance;
}

async function pollContent() {
  try {
    const res = await fetch(`${URL_.replace(/\/site-state\/?$/, '')}/content`, {
      headers: { accept: 'application/json', 'x-ar-site': 'portfolio' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    // 404 is "nothing published yet", which is a real answer and not a failure.
    // Anything already held stays held either way.
    if (res.status === 404) return;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    const model = body?.model;
    // Checked before it is kept, because this is what the page renders: a
    // malformed model would throw in the renderer, which is a blank site.
    if (model?.nav && Array.isArray(model.sections) && model.sections.length > 0) {
      content = model;
    }
  } catch {
    // Whatever is already held is still the right thing to serve.
  }
}

async function poll() {
  await pollContent();
  try {
    const res = await fetch(URL_, {
      // The header is how the admin tells a poll from the site apart from a
      // stray request, so it can report honestly whether the site is asking.
      headers: { accept: 'application/json', 'x-ar-site': 'portfolio' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    // Only an explicit true is a yes. A payload this does not understand leaves
    // the site up rather than guessing at it.
    last = { maintenance: body?.maintenance === true, at: Date.now() };
    if (logged !== 'ok') {
      console.log('[site-state] reading maintenance from the admin');
      logged = 'ok';
    }
  } catch (err) {
    // Deliberately not clearing `last`: one failed request is not a state
    // change, and STALE_MS is what decides when silence stops counting.
    if (logged !== 'fail') {
      console.warn(`[site-state] could not reach the admin (${err.message}) — the site stays up`);
      logged = 'fail';
    }
  }
}

export function startPolling() {
  if (!URL_) {
    console.log('[site-state] ADMIN_STATE_URL is not set — maintenance mode is off');
    return;
  }
  void poll();
  // unref'd: this timer must never be the reason the process stays alive.
  setInterval(poll, POLL_MS).unref();
}
