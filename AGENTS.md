# AGENTS.md

Project guidance for any coding agent working on **andrewramey.com**. This file
is the current source of truth. `CLAUDE.md` exists only to import it and holds
no instructions of its own — **write every instruction here.** Two instruction
files drift within a month, and whichever one is stale then gets followed
confidently.

> When you change how the site works, update the relevant part of this file in
> the same change so it never goes stale.

## What this is

Andrew Ramey's personal portfolio. One job: **secure AI contract work.**

Everything on the page serves that. It is also a **living document** — Andrew
adds to it as his experience grows — so anything that makes adding a credential
or a project harder than editing one file is the wrong design.

### The second job, and why it shapes the build

Claude Academy issues one credential link per completed course, and a badge can
carry only that single link. So this site **is** that link: a visitor arriving
from a credential badge lands here expecting to see credentials, and the page
has to make sense to them immediately.

That is why the site has **real URL routing**. Links go out into credential
badges, job applications and messages, and some of them are effectively
permanent — you may not be able to update a badge's URL later. **Never change a
published route.** Add a new one and redirect the old.

## The audience

Someone deciding whether to hire Andrew for AI contract work — through
Handshake, another marketplace, or directly. They give the page well under a
minute before deciding whether to keep reading.

Contracts are awarded to a **person**, not a company. The certificates, the
degrees, the headshot are all his. Write and design for that.

## Order of emphasis — do not reshuffle without asking

1. **VTS Terminal.** A real, deployed, complex production system with a live
   demo anyone can click, built through AI-assisted development. This is not a
   claimed skill; it is evidence, and it is the strongest asset on the page by a
   wide margin. It leads.
2. **Claude Academy certificates** and the hands-on AI stack.
3. **Degrees, the automotive sales record, the rental company.**

The finance background is a **differentiator, not filler** — most applicants for
AI evaluation work cannot judge finance-domain output. Frame it that way.

## COMPLIANCE — THE HARD RULES

Andrew is preparing for the **Series 65**. That makes some ordinary-sounding
phrasing genuinely risky. These are not style preferences.

**Never publish:**

- The words *financial advisor*, *investment advisor*, *portfolio management*,
  *advisory services*, or any offer to help someone with their money.
- **Any performance figure. No profit and loss, no returns, no win rates** — not
  from VTS, not from the demo, not anywhere, in any form.
- Anything implying he acts or has acted in an advisory capacity.

**Safe to publish:**

- That he is preparing for the Series 65 examination. This is a factual
  statement about an exam and carries no advisory claim.
- **VTS Terminal described strictly as software he built** — an engineering
  project, a system, a product. The demo link is a software portfolio piece and
  nothing more.
- Employment history, education, honour societies, skills.

His résumé and LinkedIn currently position him for *"associate advisor,
paraplanner, client service, or RIA operations"*. **This site deliberately
points the other way.** Do not mirror that framing back in.

(None of this is legal advice. An attorney review is owed before the site
scales.)

## Architecture

- **Vite + React 18 + TypeScript.** Routing is `react-router-dom` — real URLs,
  for the reason above.
- **Styling is inline-style / token-based** (`src/theme/tokens.ts`), matching
  the convention Andrew already works in on VTS. Not a CSS framework.
- **Static site.** No server, no database, no API, no secrets. If a change
  wants any of those, stop and ask — it probably belongs in the portal instead
  (see below).

### The design language is borrowed; the code is not

`src/theme/tokens.ts` carries the VTS Terminal's "Meridian" palette and its IBM
Plex type stack, so the portfolio and the terminal it showcases read as one
person's work.

**The values are duplicated deliberately and must stay duplicated.** This is a
separate deployment and may never import from the `vts-terminal` repository.

What was taken is the *visual identity only*. The terminal's sidebar-workspace
shell was deliberately left behind: it is built for someone who signs in daily,
and a portfolio visitor scrolls and leaves.

## The portal is a DIFFERENT SITE — do not build it here

Andrew wants a private portal for managing AI contracts and personal admin. It
lives at **`portal.andrewramey.com`**, in its **own private repository**, as its
**own deployment**.

**It is a subdomain, never a path.** `andrewramey.com/portal` would put private
code in the same build as the public site, redeploy each on every change to the
other, and let a bug in either take down both. A path is not a boundary.

So: **nothing in this repository may gain a login, a session, a database, or a
private screen.** If a request here starts to need one, it belongs in the portal
repo instead. Say so rather than building it.

Not linking the portal from this site is tidiness, not security — the login is
the security. Never treat an unlinked URL as protection.

## Deployment

**Cloudflare Pages**, building from `main`. The domain's DNS is already at
Cloudflare, the build is static, and it is free — Railway would mean paying for
a process to run around the clock serving files a CDN serves better. Railway is
the right home for the *portal* later, which needs a server and a database.

- Build command `npm run build`, output directory `dist`.
- `public/_redirects` sends every unmatched path to `index.html` so client-side
  routes resolve on a hard refresh. **Without it, every URL but `/` 404s** on a
  direct visit — which is exactly how a credential badge link arrives.
- Pushing to `main` deploys. Treat a merge to `main` as a production release.

## Verifying changes

`npm run verify` — typecheck then build. Run it before pushing; a failed build
means the site does not update, and the previous version stays live.

## Conventions

- Plain, direct voice. No filler, no marketing superlatives, no "passionate
  about". Specific beats clever.
- **No tips or how-to-use-this copy.** If a control says what it does, do not
  add a sentence explaining it.
- Content that grows (certificates, projects) belongs in a **data file** that
  renders through one component, never hand-placed markup per item. Adding a
  certificate should be appending an entry.
- Every route must work on a hard refresh and be linkable in isolation.

## Facts — verified with Andrew

Dates below reflect his own corrections where the résumé and LinkedIn
disagreed. **Do not "fix" them back to what those documents say.**

| | |
|---|---|
| Name | Andrew Ramey (He/Him) |
| Location | Stow, Ohio |
| Email | Andrewr92896@gmail.com |
| LinkedIn | linkedin.com/in/andrew-ramey1 |
| Business entity | Ramey Essential Solutions LLC |

**Education**

- Ohio University, College of Business — B.S. Business Administration, Aug 2022
  – June 2026, GPA 3.6, graduated. Golden Key International Honour Society
  (2024).
- Eastern Gateway Community College — Associate's, Business Administration,
  finance focus, **2022**. Phi Theta Kappa (2022).
- A-Tech — vocational, Multimedia Productions. *Details still needed.*

**Experience**

- Kia of Streetsboro — **Sales Representative** (not Senior), Aug 2025 –
  Present.
- Vitalis Trading Systems — Founder & Product Builder, **2026** – Present.
- Qualfon — Customer Service Representative, Jan 2025 – Apr 2025.
- Ramey Essential Solutions Car Rentals — Owner & Operator, Feb 2023 – Mar 2025.
- Kia of Streetsboro — Sales Representative, Apr 2021 – Aug 2023.

**AI work**

- Vitalis Trading Systems — vitalistradingsystems.com, where a visitor enters
  demo mode themselves. The two sites stay separate; this one links out and
  does not embed it.
- Project Hedgehog — an AI contract via Handshake. *Scope, dates and whether it
  may be named publicly are still unconfirmed — do not put it on the page until
  they are.*

## Still needed before launch

- Claude Academy certificates — course names, completion dates, credential URLs.
- Project Hedgehog — scope, dates, and naming permission.
- A-Tech — full school name, program, dates.
- A high-resolution headshot.
- Preferred contact method on the page.
- A résumé PDF to host — an AI-contract version, not the advisory-facing one.
