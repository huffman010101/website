# Prompt: Finance Career Learning Suite — 3 connected sections

Paste into Base44 / any AI builder. Client-side only, no backend, all progress in localStorage.

---

Build three connected sections of a UK finance-careers site. Dark theme, mobile-first, no backend — all progress saved to localStorage. They share one XP/streak/rank system so progress in any section feeds the same profile.

---

# SECTION 1 — Develop Knowledge (Duolingo-style course)

## Curriculum — 11 units × 3 lessons (33 total)

Each lesson = **4 concept cards** + **5 questions**.

1. 🏛️ Foundations — Time Value of Money · Risk & Return · How the Financial System Works
2. 📒 Accounting — Income Statement · Balance Sheet · Cash Flow & Linking Statements
3. 💰 Valuation — DCF · Multiples & Comps · M&A and LBOs
4. 📈 Equity Markets — Stocks & Markets · Investment Styles · Portfolio Theory & Behavioural Finance
5. 🏦 Fixed Income — Bond Basics · Credit & the Yield Curve · Central Banks & Rates
6. ⚖️ Derivatives — Futures & Forwards · Options · Swaps & Structured Products
7. 🌍 Economics & Macro — GDP & Recessions · Inflation & Monetary Policy · Currencies & Fiscal Policy
8. 🚀 Alternatives — PE & VC · Hedge Funds · Real Assets & Crypto
9. 🏢 Track: Investment Banking — Technicals · Deal Process · Analyst Toolkit
10. 📟 Track: Trading — Market Microstructure · The Greeks & Desk Risk · Macro Trading
11. 📊 Track: Consulting — Case Maths & Market Sizing · Strategy Concepts · Consulting Toolkit

**Card** = term, definition, worked example, why it matters in a real job (all four always filled).
**Questions** = mix of multiple-choice, true/false, fill-in-the-blank (case-insensitive, accept alternative spellings). Full explanation shown after every answer.

## Lesson loop
Cards → quiz → complete. **3 ❤️ per lesson**, one lost per wrong answer; at zero show "Out of hearts", review cards, retry.

## Capstones — actually do the maths
Step-by-step wizards where the user calculates each number:
1. **3-Statement Model** (5 steps) — Revenue → EBIT → Net Income → Free Cash Flow → Ending Cash
2. **LBO Model** (6 steps) — Purchase Price → Financing → Debt Paydown → Exit Value → Equity Proceeds → MOIC
3. **DCF Valuation** (5 steps) — FCF Projection → Discounting → Terminal Value → PV of TV → Enterprise Value

Each step: narrative, given assumptions, one number to calculate, accepted within a % tolerance, then the **full worked solution**. Always carry the *correct* value forward so one slip doesn't corrupt the model.

---

# SECTION 2 — Online Test Practice (psychometric tests)

Six real assessment formats, **timed and scored**, mirroring what firms actually send.

| Format | Questions | Time/question |
|---|---|---|
| Numerical Reasoning | 35 | 75s |
| Verbal Reasoning (True / False / Cannot Say) | 23 | 60s |
| Logical & Abstract (shape sequences) | 36 | 45s |
| Situational Judgement | 26 | 90s |
| Watson Glaser Critical Thinking | 10 | 40s |
| Checking & Attention to Detail | 10 | 20s |

**Watson Glaser** must use the real 5-part format: inference (5-point scale), assumptions, deduction, interpretation, evaluating arguments.
**Checking** = spot the discrepancy between two records (account numbers, dates, amounts) — include some genuine matches so users can't just assume an error exists.
**SJT** = include both "pick the most effective" and rating-scale formats.

## What makes it good
- **Every explanation has three parts:** *Working* (the full method) → *Why the wrong answers tempt* (what each distractor is testing) → *Technique* (the transferable rule). This is the single biggest quality differentiator — never just state the answer.
- **Full Assessment Day mode** — numerical → verbal → logical → SJT back-to-back on one continuous timer, no pausing, like a real assessment day.
- **Expert mode toggle** — draws only the hardest questions.
- **Difficulty tiers unlock with mastery** — Easy from the start, Medium after 1 attempt, Hard after 3 attempts averaging 70%+.
- **Spaced repetition** — questions you got wrong resurface more often.
- **Per-format "How to improve"** panel with specific technique (e.g. reverse percentages: divide by (1±rate), never add the percentage back).
- **Mental Maths Drill** — timed sprint (1/2/3 min, Core or Test-level difficulty), no calculator, tracks personal best. Plus a shortcuts library: ×5 = halve then ×10, ×11 = split the digits, 1/8 = 12.5%, Rule of 72.
- **Percentile framing on results** — real tests score against a norm group and firms sift around the 50th–70th percentile; say so rather than only showing a raw %.
- **For each format show:** which providers use it (SHL, Korn Ferry Talent Q, cut-e/Aon, Cappfinity, Watson Glaser), which firms require it, and why they use it.

---

# SECTION 3 — Develop AI Knowledge

Eight tabbed sections teaching AI fluency for finance.

1. **How AI Works** — what an LLM actually is, tokenization, transformers & attention, the context window, why they hallucinate, RAG, agentic tool use, MCP. Plain-English, no maths.
2. **Prompting Masterclass** — 7 principles, each with a **weak prompt vs strong prompt** side by side: give it a role · load the context · specify output format · show examples (few-shot) · make it think step by step · iterate, never accept draft one · ask it to critique you.
3. **Prompt Library** — copy-to-clipboard templates in 4 categories: Applications & CV · Interview Prep · Learning Finance · Work & Analysis. Use `[square brackets]` for the bits to replace.
4. **AI Coding Tools for Finance** — worked example of using an AI coding assistant on a real spreadsheet task (audit an LBO model for hardcoded cells), with the human-in-the-loop review step emphasised.
5. **Tool Comparison** — honest table of Claude vs ChatGPT vs Copilot vs Perplexity across real finance tasks (long document analysis, Excel work, cited research, drafting).
6. **AI by Career** — how AI is actually used day-to-day in IB, trading, consulting, PE, research, risk.
7. **Firm Policies & Interviews** — what banks actually permit, and how to answer "how do you use AI?" in an interview (the two answers that land badly: "I don't use it" and "it does the work for me").
8. **Pitfalls & Security** — never paste confidential data into public tools, verify every number and citation, insider information rules apply, don't submit AI-written applications, understand it or don't use it, prompt injection when AI reads external content.

---

# Shared across all three sections

**XP:** 10 per correct answer · +20 lesson completion · +10 perfect lesson · 100 per capstone · XP for completed practice tests scaled by score.

**🔥 Streak** — +1 per active day in *any* section, resets if a day is missed. **Streak freeze**: earn one per 7-day streak (max 2 banked), auto-protects a missed day.

**Career rank from total XP** — Intern → Analyst → Associate → VP → Director → MD, with a bar to the next rank, shown on every page.

**Combo multiplier** — consecutive correct answers build a streak (3× = 1.5× XP, 5× = 2× XP), rising counter, breaks on a wrong answer.

**Daily goal + heatmap** — user picks a target (Casual 20 / Regular 50 / Serious 100 XP). GitHub-style 12-week contribution grid.

**Weak Spots** — every wrong answer from *any* section auto-collects into one drill deck with a "Fix my weak spots" button.

**Daily Review (spaced repetition)** — concept cards resurface on an SM-2 schedule: "Got it" doubles the interval (cap 60 days), "Still learning" resets to 1 day. Show a "N cards due" badge.

**Confidence check** — on some questions ask "how sure are you?" before revealing. Confident + wrong costs an extra heart; unsure + right gives bonus XP. Trains calibration, which interviewers genuinely probe.

**Unit Exams ("Boss Fight")** — after all 3 lessons in a unit, unlock a timed 15-question exam mixing the whole unit. 80% to pass and earn a certificate.

**Skill tree** — units as a visual path, later ones locked until the prerequisite hits ~60%, with an unlock animation.

**Badges** — 🏛️ Foundations Master · 🏢 IB Certified (track + all 3 capstones) · 📟 Trading Certified · 📊 Consulting Certified · 👑 Full Curriculum Master · 🔥 30-Day Streak · 🎯 Perfectionist (10 perfect lessons) · ⚡ Speed Demon (unit exam under 5 min) · 🧠 Test Ace (90%+ on all six test formats). Earned in colour, unearned dimmed with a progress label.

**Unified dashboard** — rank + XP bar, streak, daily-goal ring, % curriculum mastered, best/average per test format with a trend sparkline, cards due, badge shelf.

**Glossary search** — one box searching all concept cards, doubling as a finance dictionary.

**Shareable progress card** — image of rank, XP, streak and badges.

---

# Quality bar

- UK-focused, interview-grade, genuinely accurate. **Verify every calculation** — a wrong worked example teaches the wrong thing.
- Write the **complete** content: all 33 lessons, all 140 test questions, all 8 AI sections. No stubs, no TODOs, no "add more here".

# Must not break

- Never divide by a possibly-zero length — `0/0` renders as literal `NaN%`. Guard every percentage; clamp progress bars to 0–100%.
- Wrap all `JSON.parse` of localStorage in try/catch and fall back to a fresh state.
- No horizontal page scroll at 375px — tab rows scroll inside themselves, never push the page sideways.
- Tap targets ≥32px.
