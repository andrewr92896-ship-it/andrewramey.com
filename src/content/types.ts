// ⚠ MIRRORED FILE — an identical copy lives in the other repository.
//
// andrewr92896-ship-it/andrewramey.com  ·  andrewr92896-ship-it/andrewramey-admin
//
// The portfolio renders it for the public; the admin renders it so the owner can
// see the site privately and, once the editor exists, edit through it. THERE IS
// ONE RENDERER, NEVER TWO — this is how two deployments share it without either
// importing across a boundary that exists on purpose.
//
// CHANGE IT IN BOTH REPOSITORIES, AND UPDATE portfolio-mirror.json IN BOTH.
// `npm run verify:mirror` hashes every mirrored file against that manifest: a
// change made in one repo alone fails there, and updating the manifest then
// fails the OTHER repo until its copy is brought across too. That is what makes
// drift impossible to ship rather than merely discouraged.

// The content model. The whole page is one JSON document of this shape.
//
// The public site is a pure renderer of this model, and the owner editor —
// which lives on admin.andrewramey.com, in its own repository — will be chrome
// around the same renderer. That is why the types live apart from the
// components: **there is one renderer, never two.**

export type SectionType =
  | 'hero'
  | 'cards'
  | 'certs'
  | 'tiers'
  | 'timeline'
  | 'about'
  | 'services'
  | 'band';

/**
 * What happens when a link is clicked.
 *
 *   link      go there. An http(s) address opens in a new tab, as it always did.
 *   download  save the file rather than opening it.
 *   preview   open it in a viewer on the page, WITH a download button in it.
 *
 * Absent means `link`, which is exactly what every link did before this
 * existed — so nothing already written changed behaviour when it landed.
 *
 * `preview` is the one worth explaining: a résumé that downloads on click makes
 * a reader leave the page and open a file manager to read one page. Showing it
 * in place, with Download still one press away, keeps them on the site.
 */
export type LinkBehavior = 'link' | 'download' | 'preview';

export type Button = {
  label: string;
  href: string;
  variant: 'solid' | 'ghost';
  behavior?: LinkBehavior;
};

/** Per-field typography overrides, written by the editor's format ribbon. */
export type FieldStyle = {
  family?: 'sans' | 'mono';
  /** px; 0 or absent means the template default for this field. */
  size?: number;
  weight?: 0 | 700;
  italic?: boolean;
  /** uppercase + .12em letter-spacing */
  upper?: boolean;
  color?: string;
  align?: 'left' | 'center' | 'right';
  lh?: string;
};

/**
 * A box inside a section.
 *
 * Content is addressed by **field id**, so a duplicated field lives at
 * `body#2`. That is why this carries an index signature: the id is the content
 * key, and only the part before the `#` decides how it renders.
 */
export type Item = {
  title?: string;
  meta?: string;
  body?: string;
  place?: string;
  credential?: string;
  href?: string;
  linkLabel?: string;
  /** How this box's own link behaves. See LinkBehavior. */
  behavior?: LinkBehavior;
  tags?: string[];
  buttons?: Button[];

  /** The image's address — usually /files/<something> from File Uploads. */
  imgSrc?: string;
  imgId?: string;
  /** px, 100–420. */
  imgH?: number;
  imgFit?: 'cover' | 'contain';

  fields?: string[];
  styles?: Record<string, FieldStyle>;

  tone?: 'panel' | 'plain' | 'gold' | 'dashed' | 'outline';
  pad?: 'compact' | 'normal' | 'roomy';
  /** px, 0–28. */
  radius?: number;
  span?: 1 | 2 | 'full';
  align?: 'left' | 'center';

  /** Seeds span 2 and a brighter border. */
  feature?: boolean;
  /** Seeds the dashed tone. */
  placeholder?: boolean;

  [key: string]: unknown;
};

export type Section = {
  /**
   * The URL anchor. Must be unique and stable: these ids go into credential
   * badges and job applications, and some of those links cannot be updated
   * later. Never rewrite one automatically.
   */
  id: string;
  type: SectionType;
  /** Hidden from the public page; still visible in the editor. */
  hidden?: boolean;

  eyebrow?: string;
  title?: string;
  note?: string;
  h1?: string;
  lede?: string;
  buttons?: Button[];

  fields?: string[];
  styles?: Record<string, FieldStyle>;

  pad?: 'compact' | 'normal' | 'roomy';
  cols?: 'auto' | 1 | 2 | 3;
  colMin?: number;
  gap?: number;
  wide?: boolean;
  side?: 'left' | 'right';
  portraitId?: string;

  ctaLabel?: string;
  ctaHref?: string;
  ctaBehavior?: LinkBehavior;

  /**
   * A way to get in touch, shown under a services list.
   *
   * On the SECTION rather than as an item, because it is one fact about the
   * whole list — a per-service email would be four copies of one address to
   * keep in step. Either may be left empty; the strip draws what it has and
   * disappears entirely when it has neither.
   */
  contactEmail?: string;
  contactPhone?: string;

  items: Item[];

  [key: string]: unknown;
};

export type NavItem = { label: string; target: string };

export type Nav = {
  logoMode: 'initials' | 'image';
  initials: string;
  /** px, 24–72. */
  logoSize: number;
  wordmark: string;
  subline: string;
  showWordmark: boolean;
  items: NavItem[];
  /** Set when logoMode is 'image'. */
  logoSrc?: string;
};

export type Model = {
  nav: Nav;
  sections: Section[];
};

// ---------------------------------------------------------------- fields

/**
 * The default field order per owner. A section or item may override it with
 * its own `fields`; when it does not, this is what renders.
 */
export const DEFAULT_FIELDS: Record<string, string[]> = {
  hero: ['eyebrow', 'h1', 'lede', 'buttons', 'chips'],
  header: ['eyebrow', 'title', 'note'],
  cards: ['title', 'meta', 'body', 'link'],
  certs: ['title', 'meta', 'body', 'credential'],
  tiers: ['title', 'body', 'tags'],
  timeline: ['meta', 'place', 'title', 'body', 'tags'],
  about: ['body'],
  services: ['title', 'meta', 'body', 'tags'],
  band: ['meta', 'title'],
};

/** A field id is `kind` or `kind#n`; only the kind decides how it renders. */
export function fieldKind(id: string): string {
  const hash = id.indexOf('#');
  return hash === -1 ? id : id.slice(0, hash);
}

/**
 * The fields an owner renders, in order.
 *
 * `image` is implicit: a box carrying an `imgId` renders it first unless the
 * field is listed explicitly somewhere else.
 */
export function fieldsFor(
  owner: { fields?: string[]; imgId?: string },
  fallback: string[],
): string[] {
  const listed = owner.fields ?? fallback;
  if (owner.imgId && !listed.some((f) => fieldKind(f) === 'image')) {
    return ['image', ...listed];
  }
  return listed;
}
