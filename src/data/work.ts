// Selected work. The order here is the order on the page, and it is the whole
// argument the site makes — see AGENTS.md. VTS leads because it is evidence
// rather than a claim.
//
// COMPLIANCE: a project is described as software that was built. Never as a
// trading record, and never with a performance figure of any kind.

export type Project = {
  slug: string;
  name: string;
  role: string;
  period: string;
  /** One line: what it is. */
  summary: string;
  /** What was actually built, in the reader's terms. */
  points: string[];
  stack: string[];
  link?: { href: string; label: string; note?: string };
  /** Set when the project cannot be described yet. */
  pending?: string;
};

export const WORK: Project[] = [
  {
    slug: 'vts-terminal',
    name: 'VTS Terminal',
    role: 'Founder and product builder',
    period: '2026 — present',
    summary:
      'A private, multi-workspace web terminal built through AI-assisted development, in daily use by a small group of invited users.',
    points: [
      'Designed and built the whole system — front end, API, database and deployment — translating my own requirements into working trading, study, administrative and notification tools.',
      'Role-based access across workspaces, per-user feature entitlements, and a subscription tier layer gating twenty paid features.',
      'Broker credentials encrypted at rest with per-record binding, and every use of one written to an append-only audit trail.',
      'Server-side AI usage controls: monthly budgets, burst limits, and guardrails that cannot be edited from inside the running application.',
      'A public demo built from the same codebase, with the private half excluded at the build boundary and enforced by automated checks rather than a runtime flag.',
      'Continuous deployment from a single branch, with a verification suite that runs typechecks, database round-trips and browser tests before anything ships.',
    ],
    stack: ['TypeScript', 'React', 'Fastify', 'SQLite / Drizzle', 'Claude API', 'Railway'],
    link: {
      href: 'https://vitalistradingsystems.com',
      label: 'See the demo',
      note: 'Opens the product site. Choose "Explore the demo" for sample data — no account needed.',
    },
  },
  {
    slug: 'project-hedgehog',
    name: 'Project Hedgehog',
    role: 'AI contractor',
    period: 'via Handshake',
    summary: 'AI contract work.',
    points: [],
    stack: [],
    pending: 'Details to follow.',
  },
];
