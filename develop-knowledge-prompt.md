# Prompt: "Develop Knowledge" — Duolingo-style finance learning section

Paste into Base44 / any AI builder. Client-side only, no backend, all progress in localStorage.

---

Build a gamified finance learning section called **Develop Knowledge**. Dark theme, mobile-first, no backend — all progress saved to localStorage.

## Curriculum — 11 units × 3 lessons (33 total)

Each lesson = **4 concept cards** + **5 questions**.

1. 🏛️ Foundations of Finance — Time Value of Money · Risk & Return · How the Financial System Works
2. 📒 Accounting — Income Statement · Balance Sheet · Cash Flow & Linking the Statements
3. 💰 Valuation & Corporate Finance — DCF · Multiples & Comps · M&A and LBOs
4. 📈 Equity Markets — Stocks & Markets · Investment Styles · Portfolio Theory & Behavioural Finance
5. 🏦 Fixed Income & Credit — Bond Basics · Credit & the Yield Curve · Central Banks & Rates
6. ⚖️ Derivatives — Futures & Forwards · Options · Swaps & Structured Products
7. 🌍 Economics & Macro — GDP & Recessions · Inflation & Monetary Policy · Currencies, Trade & Fiscal Policy
8. 🚀 Alternative Investments — PE & VC · Hedge Funds · Real Assets & Crypto
9. 🏢 Career Track: Investment Banking — Technicals · Deal Process · Analyst Toolkit
10. 📟 Career Track: Trading — Market Microstructure · The Greeks & Desk Risk · Macro Trading
11. 📊 Career Track: Consulting — Case Maths & Market Sizing · Strategy Concepts · Consulting Toolkit

**Card** = term, definition, worked example, why it matters in a real job (all four always filled).
**Questions** = mix of multiple-choice, true/false, and fill-in-the-blank (accept case-insensitive + alternative spellings). Every question shows a full explanation after answering, right or wrong.

Content must be UK-focused, interview-grade, and arithmetically correct — verify every number.

## Core lesson loop

Cards → quiz → complete. **3 ❤️ per lesson**, one lost per wrong answer; at zero, show "Out of hearts", let them review the cards and retry.

**XP:** 10 per correct · +20 lesson completion · +10 perfect lesson · 100 per capstone.
**🔥 Streak:** +1 per active day, resets if a day is missed.

## Make it feel great — the good bits

**Career rank from XP** — Intern → Analyst → Associate → VP → Director → MD, with a progress bar to the next rank. Show the rank badge everywhere.

**Skill tree** — units laid out as a visual path, not a list. Later units show as locked until the prerequisite unit hits ~60%, with a satisfying unlock animation.

**Combo multiplier** — consecutive correct answers build a streak (3× = 1.5× XP, 5× = 2× XP). Show a rising counter with escalating colour. Breaks on a wrong answer.

**Daily goal + heatmap** — user picks a daily XP target (Casual 20 / Regular 50 / Serious 100). Show a GitHub-style contribution heatmap of the last 12 weeks.

**Weak Spots** — automatically collect every question answered wrong into a personal drill deck, with a "Fix my weak spots" button that quizzes only those until mastered.

**Confidence check** — on some questions ask "how sure are you?" before revealing. Being confident and wrong costs an extra heart; unsure and right gives bonus XP. Trains calibration, which is exactly what interviewers probe.

**Unit Exam ("Boss Fight")** — after finishing all 3 lessons in a unit, unlock a timed 15-question exam mixing the whole unit. Pass at 80% to earn the unit's certificate. Distinct dramatic styling.

**Daily Review (spaced repetition)** — concept cards resurface on an SM-2 schedule: "Got it" doubles the interval (cap 60 days), "Still learning" resets to 1 day. Cards seed as due immediately after a lesson. Show a "N cards due" badge.

**Streak freeze** — earn one freeze per 7-day streak (max 2 banked) that auto-protects the streak on a missed day. Removes the all-or-nothing anxiety.

**Shareable progress card** — generate a clean image of rank, XP, streak and badges to save or post.

**Glossary search** — one search box across all 132 concept cards, so it doubles as a finance dictionary.

## Capstones — actually do the maths

Three step-by-step wizards where the user calculates each number themselves:

1. **3-Statement Model** (5 steps) — Revenue → Gross Profit & EBIT → Net Income → Free Cash Flow → Ending Cash
2. **LBO Model** (6 steps) — Purchase Price → Financing → Debt Paydown → Exit Value → Equity Proceeds → MOIC
3. **DCF Valuation** (5 steps) — FCF Projection → Discounting → Terminal Value → PV of Terminal Value → Enterprise Value

Each step: scene-setting narrative, the given assumptions, one number to calculate, answer accepted within a % tolerance, then the **full worked solution**. Always carry the *correct* value into the next step so one slip doesn't corrupt the model. Award 100 XP on first completion.

## Badges

🏛️ Foundations Master · 🏢 IB Certified (track + all 3 capstones) · 📟 Trading Certified · 📊 Consulting Certified · 👑 Full Curriculum Master · 🔥 30-Day Streak · 🎯 Perfectionist (10 perfect lessons) · ⚡ Speed Demon (unit exam in under 5 min)

Earned in colour, unearned dimmed with a progress label ("14/33 lessons").

## Home screen

Rank + XP bar, 🔥 streak, daily-goal ring, % curriculum mastered, "Daily Review (N due)" button, badge shelf, capstone cards, then the skill tree.

## Must not break

- Never divide by a possibly-zero length — `0/0` renders as literal `NaN%`. Guard every percentage and clamp progress bars to 0–100%.
- Wrap all `JSON.parse` of localStorage in try/catch and fall back to fresh state.
- No horizontal page scroll at 375px — tab rows scroll inside themselves, never push the page sideways.
- Tap targets ≥32px.

Write the complete curriculum content — no stubs, no TODOs, no "add more here".
