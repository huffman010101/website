# Prompt: Build FINdr — a UK finance careers discovery & preparation platform

Paste into Base44 / Claude / any AI builder.

---

Build **FINdr**, a UK-focused finance careers platform for university students targeting spring weeks, internships and graduate schemes. It does three jobs: help you **find** the right finance career, **prepare** for the whole recruitment process, and **learn** the underlying finance.

## Hard constraints

- **100% client-side. No backend, no database, no accounts, no external APIs.** All progress persists to `localStorage` only.
- Must work **fully offline** after the first load (service worker precaching the whole app + a web manifest so it's installable).
- Dark theme, gold/teal accents on near-black. Mobile-first.
- UK-focused throughout: £ salaries, UK firms, UK application timelines, UK qualifications.

## Navigation — group by user intent, not by feature type

- **Dashboard**
- **Careers** — All Careers · Career Quiz · Salary Comparison · Career Comparison
- **Prepare** — Interview Mastery · Interview Quiz · Video/HireVue Practice · Online Test Practice · Role Skill Drills · Full Case Studies
- **Learn** — Technicals & Routes In · Develop Knowledge · Develop AI Knowledge · Deals & Market Intel · Networking · Resources
- **My Toolkit** — CV & Cover Letter · AI Advisor · Meeting Notes

---

# 1. CAREERS

## 27 career profiles
Cover the real breadth of finance, not just the obvious five: investment banking, private equity, hedge funds, quantitative finance, equity research, trading, portfolio management, venture capital, consulting, financial advisory, risk management, FP&A, actuarial, corporate development, treasury, real estate finance, fixed income, commodities trading, energy commodities, structured finance, private banking, family office, sovereign wealth, restructuring, compliance, insurance underwriting, fintech.

Each profile contains:
```
id, title, category, shortDescription, salaryRange
salaryLadder[]        — Analyst → Associate → VP → MD, each with £ range and what you actually do
subRoles[]            — e.g. M&A, ECM, DCM, LevFin, Restructuring
buySellContext        — buy-side vs sell-side and why it matters
breakInRoadmap[]      — numbered, realistic steps
careerPath[], exitOpportunities[]
prosAndCons { pros[], cons[] }   — be honest about the cons
topFirms[]            — real UK employers
dayInTheLife[]        — hour-by-hour
skillsToMaster[], aiThreatLevel, aiThreatAnalysis, aiSkillsToLearn[]
technicalQuestions[], behaviouralQuestions[]
interviewQA { technical[], behavioural[] }  — each { question, answer, keyPoints[] }
calculationWalkthroughs[], internshipProcess, networkingTips[]
booksAndPodcasts, salaryNegotiationTips[]
```
Group into 9 categories: Capital Markets · Alternative Investments · Advisory · Technology & Quant · Asset Management · Wealth Management · Risk & Control · Corporate Finance · Trading.

## Career Quiz
**18 dimensions × 3 differently-worded variants = 54 questions.** Each attempt randomly draws one variant per dimension, so retakes genuinely differ while every dimension is still covered.

Each option scores several careers. **Normalise scores**: careers appear in different numbers of questions, so divide each career's raw score by the maximum it could possibly have scored — otherwise frequently-mentioned careers always win. Verify by simulation that **all 27 careers can actually be the top match**.

Results page: top match hero, top 3, full ranked list, and **"How to strengthen your fit, sector by sector"** — 5 concrete actions per category (e.g. Trading: "drill mental maths daily — prop shops screen almost entirely on speed under pressure"), with the user's own top-3 sectors surfaced first.

## Salary Comparison
All 27 roles by seniority, with geography adjustment (London/regional/international) and a comp-structure breakdown (base vs bonus vs carry). Bar chart of totals.

## Career Comparison
Put 2–3 careers side by side: hours, comp, exit options, skill overlap.

---

# 2. PREPARE

## Interview Mastery
Written assuming **zero prior knowledge**. Sections: the UK process stage by stage with timings · what each stage is really assessing · golden rules · the STAR method broken down with a worked example · a **story matrix** (map your experiences to the competencies they're actually testing) · delivery tips · practice methods · interview formats · and a **month-by-month year plan** (Foundations & Ammunition → Applications Open, Speed Matters → Peak Season).

## Interview Quiz
Pull questions from every career profile. Questions **with** a written model answer and key points are served **first**; extra practice questions are clearly labelled "Self-assessed" so an empty model answer is never a surprise. Filter by career and by technical/behavioural. Score the user's typed answer on key-point coverage, structure and use of specifics. Spaced repetition: questions scored poorly resurface more often.

## Video / HireVue Practice
`getUserMedia` + `MediaRecorder`. Pick a question, get 30s prep then a timed recording, play it back. Revoke blob URLs on cleanup. Tips on eye-line, framing, pacing and the STAR structure under time pressure.

## Online Test Practice
Six real formats, timed and scored:

| Format | Per session | Sec/question |
|---|---|---|
| Numerical Reasoning | 10 | 75 |
| Verbal (True/False/Cannot Say) | 9 | 60 |
| Logical & Abstract | 10 | 45 |
| Situational Judgement | 8 | 90 |
| Watson Glaser Critical Thinking | 10 | 40 |
| Checking & Attention to Detail | 10 | 20 |

**The explanation standard — the most important rule in the whole app.** Every explanation has three labelled parts:
1. **Working** — the full method with actual arithmetic
2. **Why the wrong answers tempt** — take each distractor and name the specific error that produces it
3. **Technique** — the transferable rule for next time

**Numerical must be exhibit-driven** like the real thing: shared data tables and **charts** (inline SVG bar/line), 2–3 questions per exhibit. Must cover: reverse percentages · **percentage points vs percentage change** (inflation 9.1%→2.1% is a fall of 7.0 percentage points, not 76.9% — both computable, which is why it's the most-failed item) · **level vs rate of change** (a falling inflation line means prices rise *more slowly*) · index rebasing (index points ≠ percentages) · market share including the "All others" row and acquisitions where the denominator doesn't change · compounding · FX (divide, don't subtract) · margins · weighted averages · break-even.

**Verbal** traps: timing vs causal words ("following" ≠ "because") · sample-to-population leaps · absolutes · "no evidence that X" ≠ "not X" · like-for-like failures · confounders making a claim *Cannot Say*, not *False*.

**Watson Glaser**: the genuine 5-part format, including **affirming the consequent vs the contrapositive** on identical premises.

**Checking**: transpositions buried mid-string · DD/MM vs MM/DD collisions with identical digits · an error copied *identically into both records* so only recomputation catches it · multi-discrepancy items · and **genuine full matches** so users can't assume an error exists.

Modes: **difficulty tiers** (Easy now; Medium after 1 attempt; Hard after 3 attempts averaging 70%+) · **Expert toggle** drawing only from the hard/expert pool, running a **shorter** session rather than padding with easy questions · **Full Assessment Day** (Numerical 8 → Verbal 6 → Logical 8 → SJT 5, one continuous timer) · spaced repetition · **Mental Maths Drill** (1/2/3-min sprint, no calculator, personal best) with a shortcuts library · **percentile framing** on results (firms sift around the 50th–70th percentile) · per-format "How to improve" panels · and which providers/firms use each format.

## Role Skill Drills
Tracks for trading, consulting, IB and PE. Each drill: question, numeric answer with a tolerance, **step-by-step working**, and the transferable technique. Mental maths, approximation, market sizing, paper LBOs.

## Full Case Studies
Complete consulting/finance cases worked stage by stage. Each stage: `interviewerSays` · `yourTask` · an `exhibit` (table) · `modelStructure` · `working` · `insight` · `commonMistakes` · `followUps`. This is the depth standard for the whole site — never shallow.

---

# 3. LEARN

## Technicals & Routes In
Per career path: the technicals you must know (Q&A grouped by topic) · what the application process actually looks like stage by stage with timings and how to survive each · and honest **routes in** with a realism rating for each.

## Develop Knowledge — Duolingo-style course
**11 units × 3 lessons = 33 lessons.** Each lesson = 4 concept cards + 5 questions.

Units: Foundations · Accounting · Valuation · Equity Markets · Fixed Income · Derivatives · Economics & Macro · Alternatives · Track: IB · Track: Trading · Track: Consulting.

Card = `{ term, definition, workedExample, whyItMattersInTheJob }`. Question types: multiple choice, true/false, fill-in-the-blank (case-insensitive, accepts alternatives). Every question explains itself after answering.

Flow: cards → quiz → complete. **3 ❤️ per lesson**; at zero, review and retry.

**Daily Review (spaced repetition)** over concept cards: "Got it" doubles the interval (cap 60 days), "Still learning" resets to 1 day. Cards seed as due immediately after a lesson.

**Capstones** — wizards where the user calculates every number: 3-Statement Model (5 steps) · LBO (6 steps) · DCF (5 steps). Each step gives assumptions, asks for **one** number, accepts within a tolerance, then shows the **full worked solution** — and carries the *correct* value forward so one slip doesn't corrupt the model.

## Develop AI Knowledge
Eight sections: How AI Works (LLMs, tokenization, transformers, context windows, hallucination, RAG, agents, MCP) · Prompting Masterclass (7 principles, each with weak vs strong prompt side by side) · Prompt Library (copy-to-clipboard, 4 categories) · AI Coding Tools for Finance · Tool Comparison table · AI by Career · Firm Policies & Interviews (how to answer "how do you use AI?") · Pitfalls & Security (never paste confidential data, verify every number, prompt injection).

## Deals & Market Intel
Deal teardowns: what happened · structure · rationale · how it went · **sector implications** · the interview angle. Plus what drives rates and markets, for trading interviews.

## Networking
Cold email templates, coffee chat scripts, LinkedIn approaches, follow-up cadence.

## Resources
Books, qualifications (CFA/ACA/IMC), a searchable glossary, and downloadable Excel templates.

---

# 4. MY TOOLKIT

## CV & Cover Letter
Upload **PDF or Word** (parse client-side) or paste text. Produces: an overall score, section-by-section feedback, an **ATS keyword match** against a pasted job description (extract keywords, show matched/missing and a match %), and an **AI-detection check** flagging LLM tells (uniform sentence length, giveaway phrases) with specific fixes. Keeps version history so you can see your score improve.

## AI Advisor
Rule-based guidance chat over the site's own career data — no external API. Answers "which career suits me", "how do I break into X", "what should I do this month".

## Meeting Notes
Web Speech API live transcription with auto-restart (browsers cut recognition after ~60s). Turns a coffee-chat or meeting transcript into structured takeaways and action points.

---

# 5. DASHBOARD & SHARED XP

**XP:** 10 per correct answer · +20 lesson completion · +10 perfect lesson · 100 per capstone · practice test = score% ÷ 2 · 50 per unit exam passed.
**Combo:** 3 correct in a row = 1.5× XP, 5 = 2×.
**Career rank from lifetime XP:** Intern 0 · Analyst 500 · Associate 1,500 · VP 3,500 · Director 7,000 · MD 12,000.
**Streak:** +1 per active day in any section; earn a freeze per 7-day streak (max 2 banked) that protects a missed day.

Dashboard shows: rank + XP bar · streak · daily goal ring (Casual 20 / Regular 50 / Serious 100) · % curriculum mastered · **Next Up card** recommending one action in priority order (cards due → lesson in progress → weakest test format → available unit exam → next lesson) · 12-week activity heatmap · practice-test analytics per format with best/average and a trend sparkline, weakest highlighted · Develop Knowledge progress per unit · **Weak Spots** deck pooling every wrong answer from any section · badge shelf · career quiz history · CV score history.

Every panel needs a real **empty state** with a prompt and a link — never a blank box or a bare zero.

---

# Quality bar

- **Verify every calculation.** A wrong worked example teaches the wrong thing. Check the arithmetic in every numerical question, capstone step and drill before finishing.
- Be honest in career content — real cons, real hours, real odds. Students can tell when it's brochure copy.
- Write the **complete** content. No stubs, no TODOs, no "add more here", no placeholder lessons.

# Must not break

- Never divide by a possibly-zero length — `0/0` renders as literal `NaN%` and `x/0` as `Infinity%`. Guard every percentage; clamp progress bars to 0–100%.
- Wrap every `JSON.parse` of localStorage in try/catch and fall back to a fresh state.
- No horizontal page scroll at 375px — tab and filter rows scroll inside themselves, never push the page sideways.
- Tap targets ≥32px.
- **Any number shown in copy** (career counts, question counts, lesson counts) must be derived from the data, never hardcoded — otherwise it silently goes stale when content is added.
- Every lookup map keyed by category must cover **all** categories, or badges render with no styling.
- If using a service worker, make it take control on first visit and reload once when a new version activates, or users get stale content.
