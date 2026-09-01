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

// The published content model.
//
// This is the design handoff's own export, unchanged in content. It is the
// single source of the page: every section, box and field below is rendered
// by `src/render/Portfolio.tsx` and by nothing else.
//
// ADDING A CERTIFICATE OR A ROLE IS EDITING THIS FILE — never writing markup.
// That is the property the site is built around: it grows with Andrew's
// experience without anyone touching a component.
//
// Eventually the editor on admin.andrewramey.com writes this shape to a store
// and the public build reads it from there. Until that exists, this file is
// the store.
//
// COMPLIANCE: read the rules in AGENTS.md before editing any copy here. In
// particular there is no performance figure anywhere in this file, and the
// Series 65 line states a fact about an examination and nothing more.

import type { Model } from './types';

export const MODEL: Model = {
    "nav": {
      "logoMode": "initials",
      "initials": "AR",
      "logoSize": 30,
      "wordmark": "ANDREW RAMEY",
      "subline": "AI-ASSISTED DEVELOPMENT",
      "showWordmark": true,
      "items": [
        {
          "label": "Work",
          "target": "work"
        },
        {
          "label": "Credentials",
          "target": "credentials"
        },
        {
          "label": "Experience",
          "target": "experience"
        },
        {
          "label": "About",
          "target": "about"
        },
        {
          "label": "Contact",
          "target": "contact"
        }
      ]
    },
    "sections": [
      {
        "id": "top",
        "type": "hero",
        "eyebrow": "Andrew Ramey · Summit County, Ohio",
        "h1": "AI-assisted development, shipped as working software.",
        "lede": "I build and maintain production systems through AI-assisted development — requirements to release. A business and finance background means I can judge domain output, not just code it.",
        "buttons": [
          {
            "label": "See the work",
            "href": "#work",
            "variant": "solid"
          },
          {
            "label": "Get in touch",
            "href": "#contact",
            "variant": "ghost"
          }
        ],
        "items": [
          {
            "title": "Available for AI contract work"
          },
          {
            "title": "B.S. Business Administration"
          },
          {
            "title": "Preparing for the Series 65 examination"
          }
        ]
      },
      {
        "id": "work",
        "type": "cards",
        "eyebrow": "Selected work",
        "title": "Systems built and shipped",
        "note": "Deployed software, not claimed skills.",
        "wide": true,
        "items": [
          {
            "title": "VTS Terminal — Vitalis Trading Systems",
            "meta": "2026 – present · Founder & product builder",
            "href": "https://vitalistradingsystems.com",
            "linkLabel": "Open the public site",
            "body": "A private web terminal built through AI-assisted development: trade records, market data, news, study tools and personal finance in one workspace. Team-scoped role-based access, encrypted credential handling, server-side AI usage controls and Railway deployment workflows. I own requirements, testing, release validation and ongoing improvements for a small group of invited users.",
            "feature": true
          },
          {
            "title": "AI evaluation contract",
            "meta": "Via Handshake · Name withheld",
            "body": "Reviewing and scoring AI responses against task rubrics, with written rationales. Scope and naming permission pending — this card is the slot it will fill.",
            "placeholder": true
          }
        ]
      },
      {
        "id": "credentials",
        "type": "certs",
        "eyebrow": "Credentials",
        "title": "Claude Academy certificates",
        "note": "Each badge carries one link, so they all land here. New certificates are appended — the grid grows with them.",
        "items": [
          {
            "title": "Certificate slot",
            "meta": "COURSE NAME · COMPLETION DATE",
            "body": "Course title exactly as issued, the date it was completed, and the verification link from the badge.",
            "credential": "CREDENTIAL LINK"
          },
          {
            "title": "Certificate slot",
            "meta": "COURSE NAME · COMPLETION DATE",
            "body": "Course title exactly as issued, the date it was completed, and the verification link from the badge.",
            "credential": "CREDENTIAL LINK"
          },
          {
            "title": "Certificate slot",
            "meta": "COURSE NAME · COMPLETION DATE",
            "body": "Course title exactly as issued, the date it was completed, and the verification link from the badge.",
            "credential": "CREDENTIAL LINK"
          },
          {
            "title": "Certificate slot",
            "meta": "COURSE NAME · COMPLETION DATE",
            "body": "Course title exactly as issued, the date it was completed, and the verification link from the badge.",
            "credential": "CREDENTIAL LINK"
          }
        ]
      },
      {
        "id": "skills",
        "type": "tiers",
        "eyebrow": "Abilities",
        "title": "AI stack and skills",
        "items": [
          {
            "title": "AI & technical",
            "body": "What a contract is awarded for.",
            "tags": [
              "AI-assisted software development",
              "Prompt engineering",
              "Analyzing AI responses",
              "Workflow automation",
              "Front-end development",
              "Product design & management",
              "Requirements & testing",
              "QA and release validation",
              "Role-based access design"
            ]
          },
          {
            "title": "Finance & analysis",
            "body": "The differentiator — domain judgment most evaluators do not have.",
            "tags": [
              "Financial analysis",
              "Financial modeling",
              "Budgeting",
              "Payment structuring",
              "Financial product analysis",
              "Systematic research"
            ]
          },
          {
            "title": "Client & commercial",
            "body": "Three years client-facing, top volume performer.",
            "tags": [
              "Automotive sales",
              "Needs analysis",
              "Client relations",
              "CRM management",
              "Negotiation",
              "Operations management",
              "Process improvement"
            ]
          },
          {
            "title": "Tools",
            "body": "In regular use.",
            "tags": [
              "Claude Code",
              "ChatGPT",
              "GPT Codex",
              "Perplexity",
              "Gemini",
              "GitHub",
              "Railway",
              "TradingView",
              "Pine Script",
              "Excel",
              "Video editing"
            ]
          }
        ]
      },
      {
        "id": "experience",
        "type": "timeline",
        "eyebrow": "Experience",
        "title": "Work history",
        "items": [
          {
            "title": "Sales Representative",
            "body": "Kia of Streetsboro",
            "meta": "Aug 2025 – Present",
            "place": "Streetsboro, OH · Full-time · On-site",
            "tags": [
              "Guides clients through vehicle selection, financing, payment structures, trade values and total cost of ownership.",
              "Translates complex financial and contractual detail into clear client decisions.",
              "Owns the transaction from consultation through financing, documentation, delivery and follow-up."
            ]
          },
          {
            "title": "Founder & Product Builder",
            "body": "Vitalis Trading Systems",
            "meta": "2026 – Present",
            "place": "Self-employed · Remote",
            "tags": [
              "Builds and maintains a private web terminal through AI-assisted development.",
              "Designed role-based access, encrypted credential handling and deployment workflows.",
              "Manages requirements, testing, troubleshooting and release validation."
            ]
          },
          {
            "title": "Customer Service Representative",
            "body": "Qualfon",
            "meta": "Jan 2025 – Apr 2025",
            "place": "Remote · Full-time",
            "tags": [
              "Resolved account questions in a high-volume remote service environment.",
              "Documented interactions accurately against service and quality expectations."
            ]
          },
          {
            "title": "Owner & Operator",
            "body": "Ramey Essential Solutions Car Rentals",
            "meta": "Feb 2023 – Mar 2025",
            "place": "Garrettsville, OH · Self-employed",
            "tags": [
              "Ran a vehicle-rental business on Turo: customer communication, scheduling, maintenance, pricing and financial tracking.",
              "Held a 4.9 / 5 average customer rating through consistent turnaround and responsive service."
            ]
          },
          {
            "title": "Sales Representative",
            "body": "Kia of Streetsboro",
            "meta": "Apr 2021 – Aug 2023",
            "place": "Streetsboro, OH · Full-time · On-site",
            "tags": [
              "Guided clients through selection, financing, documentation and delivery.",
              "Built reference tools including a delivery checklist and a Road-to-the-Sale workflow.",
              "One of the dealership’s top volume performers."
            ]
          }
        ]
      },
      {
        "id": "education",
        "type": "cards",
        "eyebrow": "Education",
        "title": "Degrees and honors",
        "items": [
          {
            "title": "Ohio University, College of Business",
            "meta": "Aug 2022 – Jun 2026 · Athens, OH",
            "body": "B.S. Business Administration and Management. Graduated, GPA 3.6. Golden Key International Honour Society, 2024."
          },
          {
            "title": "Eastern Gateway Community College",
            "meta": "2022",
            "body": "Associate’s degree, Business Administration — finance focus. Phi Theta Kappa Honor Society, 2022."
          },
          {
            "title": "A-Tech",
            "meta": "Vocational",
            "body": "Multimedia Productions — the formal credential behind the video and media work. Program name and dates to be added."
          },
          {
            "title": "Series 65 examination",
            "meta": "In preparation",
            "body": "Uniform Investment Adviser Law Examination. Stated as a fact about an exam — no advisory services are offered here."
          }
        ]
      },
      {
        "id": "about",
        "type": "about",
        "eyebrow": "About",
        "title": "About me",
        "portraitId": "ar-headshot",
        "items": [
          {
            "body": "I am Andrew Ramey, based in Summit County, Ohio. I came to software from business and finance, and I build the way that background trained me to: define the requirement, ship it, then test whether it actually holds up in use."
          },
          {
            "body": "My degree is in business administration with a finance focus, and I am preparing for the Series 65 examination. That grounding is why I read finance-domain AI output differently than most people reviewing it — I can tell when an answer is merely fluent."
          },
          {
            "body": "Day to day I work with AI as a build partner rather than a novelty: Claude Code and Codex for development, and structured prompting and evaluation for everything else. VTS Terminal is the clearest evidence of it — a real system, in use, that I designed, built and maintain."
          }
        ]
      },
      {
        "id": "hobbies",
        "type": "cards",
        "eyebrow": "Outside work",
        "title": "Hobbies",
        "items": [
          {
            "title": "Chess",
            "body": "Long games, studied openings. The same habit as debugging: sit with the position until it makes sense."
          },
          {
            "title": "Animals",
            "body": "Most of my downtime is spent with them. Patient, unhurried, no screens involved."
          },
          {
            "title": "Learning",
            "body": "Courses, documentation and self-teaching for their own sake — the reason the credential list keeps growing."
          },
          {
            "title": "Online MMOs",
            "body": "Systems, economies and coordinated groups. An interest in mechanics that never really turned off."
          }
        ]
      },
      {
        "id": "resume",
        "type": "band",
        "eyebrow": "Résumé",
        "title": "Download the résumé",
        "note": "An AI-contract version — one page, current as of this build.",
        "ctaLabel": "Download PDF",
        "ctaHref": "#",
        "items": [
          {
            "meta": "Format",
            "title": "PDF · 1 page"
          },
          {
            "meta": "Updated",
            "title": "August 2026"
          }
        ]
      },
      {
        "id": "contact",
        "type": "band",
        "eyebrow": "Contact",
        "title": "Get in touch",
        "note": "Email is the fastest route. I answer contract enquiries the same day.",
        "ctaLabel": "Email me",
        "ctaHref": "mailto:Andrewr92896@gmail.com",
        "items": [
          {
            "meta": "Email",
            "title": "Andrewr92896@gmail.com",
            "href": "mailto:Andrewr92896@gmail.com"
          },
          {
            "meta": "LinkedIn",
            "title": "linkedin.com/in/andrew-ramey1",
            "href": "https://linkedin.com/in/andrew-ramey1"
          }
        ]
      }
    ]
  } as Model;
