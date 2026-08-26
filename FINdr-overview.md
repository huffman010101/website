# FINdr — Complete Website Overview

**24 routes · 27 careers · fully offline-capable · all data stored locally on your device (no accounts, no backend)**

---

## Dashboard
Unified progress hub pulling history from every tool — career quiz results, CV scores, practice-test analytics with best/average/trend sparklines, interview-quiz scores, and Learn progress per unit.

---

## Careers

- **All Careers** — 27 finance careers. Each has: salary ladder by seniority, sub-roles, buy-side/sell-side context, day-to-day reality, top firms, break-in roadmap, technical + behavioural questions, internship process.
- **Career Quiz** — 18 dimensions x 3 phrasings = 54 questions. One variant per dimension is drawn at random each attempt, so retakes genuinely differ while match accuracy stays consistent.
- **Salary Comparison** — total compensation across all 27 roles, by seniority level, with geography adjustment and a comp-structure breakdown (base vs bonus vs carry).
- **Career Comparison** — hours, compensation and skills side by side.

---

## Prepare

- **Interview Mastery** — technique, common questions, model answers, and a year-ahead plan for spring weeks. Written assuming zero background knowledge.
- **Interview Quiz** — 104 questions with full model answers + key points, plus 276 extra self-assessed practice questions. Coached questions are served first, and every question is labelled "Model answer" or "Self-assessed".
- **Video / HireVue Practice** — record timed answers to camera.
- **Online Test Practice** — 140 questions across 6 real assessment formats:
  - Numerical Reasoning (35)
  - Verbal Reasoning (23)
  - Logical & Abstract Reasoning (36)
  - Situational Judgement (26)
  - Watson Glaser Critical Thinking (10)
  - Checking & Attention to Detail (10)
  - Plus: Full Assessment Day mode (all sections back-to-back on one timer), Expert difficulty toggle, per-category "How to improve" guides, Mental Maths Drill, spaced-repetition question weighting.
- **Role Skill Drills** — trading / consulting / IB / PE interview maths with worked technique.
- **Full Case Studies** — 4 complete cases worked stage by stage (interviewer says -> your task -> exhibit -> model structure -> working -> insight -> common mistakes -> follow-ups).

---

## Learn

- **Technicals & Routes In** — what to know per role, what the application process looks like, how to break in.
- **Develop Knowledge** — 11 units, 33 lessons, Duolingo-style with spaced repetition, capstones and badges:
  1. Foundations of Finance
  2. Accounting & Financial Statements
  3. Valuation & Corporate Finance
  4. Equity Markets & Investing
  5. Fixed Income & Credit
  6. Derivatives
  7. Economics & Macro
  8. Alternative Investments
  9. Career Track: Investment Banking
  10. Career Track: Trading & Markets
  11. Career Track: Consulting
- **Develop AI Knowledge** — 8 sections: how LLMs actually work, prompting masterclass, prompt library, Claude Code for finance, tool comparison, AI by career, firm policies & interviews, pitfalls & security.
- **Deals & Market Intel** — deal teardowns, rate drivers, sector impact.
- **Networking Guide** — cold emails, coffee chat scripts.
- **Resources** — books, qualifications, glossary, Excel templates.

---

## My Toolkit

- **CV & Cover Letter** — AI review, PDF/Word upload, ATS keyword matching, AI-detection check, version history.
- **AI Advisor** — personalised career guidance.
- **Meeting Notes** — voice recording that listens to a meeting and generates AI takeaways.

---

# Fix status — all 6 issues resolved

| # | Issue | Status |
|---|-------|--------|
| 1 | 16 of 27 careers had no interview model answers | FIXED — added 80 new Q&As, all 27 careers covered |
| 2 | Interview sessions were mostly uncoached (1 in 8) | FIXED — coached-first sampling + labels, now 5 in 8 |
| 3 | Mobile sideways scroll (Resources, Interview Quiz) | FIXED — both now exactly 375px on phone width |
| 4 | Trading careers never linked to their Learn unit | FIXED — wired to Career Track: Trading & Markets |
| 5 | Latent NaN / Infinity in number rendering | FIXED — guarded via src/lib/num.ts, unit-tested |
| 6 | Stale content after service-worker update | FIXED — reload on controllerchange, loop-guarded |

## Verification performed

- **Route audit** — 25 routes x fresh and populated states
- **Deep interactive audit** — every tab and control across 17 pages
- **Driven flow audit** — Learn lessons, interview sessions, CV analysis, capstones, dashboard, all salary filters
- **Mobile audit** — 22 routes at 375px (iPhone SE width)
- **Offline audit** — service worker caching, then network fully disabled

All five suites clean with zero console errors. TypeScript and production build clean. All arithmetic in new technical content verified by script (paper LBO MOIC/IRR, market-sizing estimate, three-statement walkthrough).

## Known caveats

1. The live URL could not be reached from the build sandbox (network policy blocks github.io), so all verification was performed against the identical production build served locally.
2. The originally reported "AI Knowledge numbers" bug never reproduced — every tab was screenshotted and the numbering is correct. Most likely cause was stale cache, which is issue #6 above and is now fixed.
