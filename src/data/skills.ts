// Tiered, not flat. A flat list puts Microsoft Word beside prompt engineering
// and flattens the signal on both. The order is the order of the argument:
// what a contract is awarded for, then what makes it defensible, then the rest.

export type SkillGroup = { title: string; note?: string; items: string[] };

export const SKILLS: SkillGroup[] = [
  {
    title: 'AI and engineering',
    items: [
      'AI-assisted software development',
      'Prompt engineering',
      'Evaluating model output',
      'Product design and requirements',
      'Workflow automation',
      'Testing and troubleshooting',
      'Release validation',
      'Role-based access design',
      'Secure credential handling',
      'Web development',
    ],
  },
  {
    title: 'Finance and analysis',
    note: 'The domain knowledge that makes an evaluation worth something.',
    items: [
      'Financial analysis',
      'Financial modelling',
      'Portfolio analysis',
      'Budgeting',
      'Payment and deal structuring',
      'Credit building',
      'Systematic research',
    ],
  },
  {
    title: 'Client and commercial',
    items: [
      'Sales — three years, automotive',
      'Sales training',
      'Needs analysis',
      'Client relationships',
      'CRM management',
      'Negotiation',
      'Operations management',
      'Process improvement',
    ],
  },
  {
    title: 'Tools',
    items: [
      'Claude Code',
      'ChatGPT',
      'GPT Codex',
      'Gemini',
      'Perplexity',
      'GitHub',
      'Railway',
      'TradingView / Pine Script',
      'Excel',
      'Google Workspace',
      'Video editing',
    ],
  },
];
