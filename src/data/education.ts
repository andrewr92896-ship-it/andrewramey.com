// Dates here are Andrew's own corrections where the résumé and LinkedIn
// disagreed. Do not "fix" them back — see AGENTS.md.

export type School = {
  school: string;
  credential: string;
  detail?: string;
  period: string;
  place?: string;
};

export const EDUCATION: School[] = [
  {
    school: 'Ohio University',
    credential: 'B.S. Business Administration',
    detail: 'College of Business · GPA 3.6',
    period: '2022 — 2026',
    place: 'Athens, Ohio',
  },
  {
    school: 'Eastern Gateway Community College',
    credential: "Associate's, Business Administration",
    detail: 'Finance focus',
    period: '2022',
  },
];
