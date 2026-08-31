// Certificates and examinations.
//
// This list is the second reason the site exists: a credential badge can carry
// only one link, so it points here and this page holds all of them. Adding one
// is appending an entry — never new markup.

export type Credential = {
  name: string;
  issuer: string;
  /** As issued. A year alone is fine. */
  date: string;
  /** The issuer's own verification page, where there is one. */
  href?: string;
};

/** Claude Academy and any other course certificates. */
export const CERTIFICATES: Credential[] = [
  // Awaiting course names, dates and credential links.
];

export type Exam = { name: string; body: string; status: string };

// COMPLIANCE: "preparing for" is a statement about an examination and nothing
// more. Never phrase this as advisory capability. See AGENTS.md.
export const EXAMS: Exam[] = [
  {
    name: 'Series 65',
    body: 'Uniform Investment Adviser Law Examination',
    status: 'Currently preparing',
  },
];

export const HONORS: Credential[] = [
  { name: 'Golden Key International Honour Society', issuer: 'Ohio University', date: '2024' },
  { name: 'Phi Theta Kappa Honor Society', issuer: 'Eastern Gateway Community College', date: '2022' },
];
