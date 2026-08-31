export type Role = {
  title: string;
  org: string;
  period: string;
  place?: string;
  points: string[];
};

export const EXPERIENCE: Role[] = [
  {
    title: 'Sales Representative',
    org: 'Kia of Streetsboro',
    period: 'Aug 2025 — present',
    place: 'Streetsboro, Ohio',
    points: [
      'Structure vehicle financing — payment schedules, rates, trade values, total cost of ownership — and translate the terms into decisions a customer can actually make.',
      'Run each deal from first conversation through financing, documentation and delivery.',
    ],
  },
  {
    title: 'Customer Service Representative',
    org: 'Qualfon',
    period: 'Jan — Apr 2025',
    place: 'Remote',
    points: [
      'Resolved account questions in a high-volume remote service environment, documenting every interaction accurately against service and quality targets.',
    ],
  },
  {
    title: 'Owner and Operator',
    org: 'Ramey Essential Solutions Car Rentals',
    period: 'Feb 2023 — Mar 2025',
    place: 'Garrettsville, Ohio',
    points: [
      'Ran a vehicle rental business end to end — pricing, scheduling, maintenance, marketing and the books — to a 4.9 out of 5 average customer rating.',
    ],
  },
  {
    title: 'Sales Representative',
    org: 'Kia of Streetsboro',
    period: 'Apr 2021 — Aug 2023',
    place: 'Streetsboro, Ohio',
    points: [
      'One of the dealership’s top volume performers, working from a needs analysis rather than a script.',
      'Wrote the reference material the floor used, including a delivery checklist and a documented sales workflow.',
    ],
  },
];
