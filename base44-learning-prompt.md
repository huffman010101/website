# Prompt: Develop Knowledge + XP/Dashboard + Online Test Practice

Paste into Base44. Client-side only, no backend, all progress in localStorage.

---

Build three connected parts of a UK finance-careers app: a **Develop Knowledge** course, an **Online Test Practice** section, and a **Dashboard** tying them together through one shared XP system. Dark theme, mobile-first, no backend — everything persists to localStorage.

---

# PART 1 — XP, ranks and streaks (shared spine)

Both learning sections feed one profile. Build this first; everything else reads from it.

**XP awards**
| Action | XP |
|---|---|
| Correct answer in a lesson | 10 |
| Lesson completion bonus | +20 |
| Perfect lesson (all correct) | +10 extra |
| Completing a capstone (first time only) | 100 |
| Completing a practice test | score % ÷ 2, rounded (so 80% = 40 XP) |
| Passing a unit exam (80%+) | 50 |

**Combo multiplier** — consecutive correct answers within a session: 3 in a row = 1.5× XP, 5 in a row = 2× XP. Show a rising counter that changes colour as it climbs. Resets to 1× on any wrong answer.

**Career rank from lifetime XP** — display everywhere (header, dashboard, share card):
- Intern (0) · Analyst (500) · Associate (1,500) · VP (3,500) · Director (7,000) · Managing Director (12,000)
- Show a progress bar to the next rank with the XP remaining.

**Streak** — +1 for each calendar day with any activity in either section. Resets to 1 if a day is missed. **Streak freeze**: earn 1 per completed 7-day streak (max 2 banked), auto-consumed to protect a missed day.

**State shape**
```
profile = { xp, streak, lastActiveDate, freezesBanked, dailyGoal }
lessons = { [lessonId]: { completed, bestScore, timesCompleted } }
tests   = [ { date, categoryId, categoryTitle, correct, total, percentage } ]
cards   = { [cardId]: { dueDate, intervalDays } }
```

---

# PART 2 — Develop Knowledge (the course)

## Curriculum: 11 units × 3 lessons = 33 lessons
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

**Concept card** = `{ term, definition, workedExample, whyItMattersInTheJob }` — all four always populated.
**Question** = `{ type: 'mc' | 'tf' | 'fill', prompt, options?, answer, accept?[], explanation }`. Fill-in answers are case- and whitespace-insensitive and accept listed alternatives. Every question shows its explanation after answering, right or wrong.

## Lesson flow
Cards (flip through, progress bar) → quiz (shuffled) → complete. **3 ❤️ per lesson**, one lost per wrong answer. At zero hearts show "Out of hearts", let the user review the cards and retry. On completion show score %, XP earned, and a 🏆 for a perfect lesson.

## Daily Review (spaced repetition)
A separate mode over concept cards, SM-2 style. Completing a lesson's card phase seeds those cards as **due immediately**, so the first reinforcement lands on the next visit. User self-rates by flipping: **"Got it"** doubles the interval (capped at 60 days); **"Still learning"** resets it to 1 day. Only due cards appear. Show a "N cards due" badge on the home screen.

## Unit Exam ("Boss Fight")
Unlocked after all 3 lessons in a unit. Timed, 15 questions mixed from the whole unit, 80% to pass, awards a unit certificate and 50 XP. Visually distinct and higher-stakes than a normal lesson.

## Capstones — actually build the model
Step-by-step wizards where the user calculates each number themselves:
1. **3-Statement Model** (5 steps) — Revenue → EBIT → Net Income → Free Cash Flow → Ending Cash
2. **LBO Model** (6 steps) — Purchase Price → Financing → Debt Paydown → Exit Value → Equity Proceeds → MOIC
3. **DCF Valuation** (5 steps) — FCF Projection → Discounting → Terminal Value → PV of TV → Enterprise Value

Each step: a short narrative, the given assumptions, **one** number to calculate, answer accepted within a % tolerance, then the **full worked solution**. Always carry the *correct* value into the next step so one slip doesn't corrupt the whole model.

## Badges
🏛️ Foundations Master · 🏢 IB Certified (track + all 3 capstones) · 📟 Trading Certified · 📊 Consulting Certified · 👑 Full Curriculum Master · 🔥 30-Day Streak · 🎯 Perfectionist (10 perfect lessons) · ⚡ Speed Demon (unit exam under 5 min) · 🧠 Test Ace (90%+ in all six test formats).
Earned in colour, unearned dimmed with a progress label ("14/33 lessons").

---

# PART 3 — Online Test Practice (psychometric tests)

Six real assessment formats, timed and scored, mirroring what firms actually send.

| Format | Bank size | Per session | Seconds/question |
|---|---|---|---|
| Numerical Reasoning | 40+ | 10 | 75 |
| Verbal Reasoning (True/False/Cannot Say) | 25+ | 9 | 60 |
| Logical & Abstract (shape sequences) | 35+ | 10 | 45 |
| Situational Judgement | 25+ | 8 | 90 |
| Watson Glaser Critical Thinking | 18+ | 10 | 40 |
| Checking & Attention to Detail | 18+ | 10 | 20 |

## The explanation standard — the single most important rule
**Every** explanation has three labelled parts. This is what separates real prep from a quiz:
1. **Working** — the full method, step by step, with the actual arithmetic.
2. **Why the wrong answers tempt** — take each distractor in turn and name the specific error that produces it ("£76.80 adds 20% back to £64 — the classic trap").
3. **Technique** — the transferable rule to apply next time ("to reverse ANY percentage change, divide by (1 ± rate), never add it back").

## Format-specific requirements

**Numerical** — must be **exhibit-driven**, like the real thing. At least a third of questions hang off a shared data table or **chart** (render bar and line charts as inline SVG), with 2–3 questions per exhibit. Cover explicitly:
- Reverse percentages (divide by 1±rate)
- **Percentage points vs percentage change** — inflation falling 9.1% → 2.1% is a fall of **7.0 percentage points**, not 76.9%. Both are computable, which is why it's the most-failed item type.
- **Level vs rate of change** — a falling inflation line means prices rise *more slowly*, not that prices fall.
- Index numbers and rebasing (index points ≠ percentages; only growth from the base year reads straight off)
- Market share, including the "All others" row people skip, and acquisitions where the denominator does **not** change
- Compound growth, FX (divide, don't subtract), margins, ratios, weighted averages, break-even

**Verbal** — True / False / Cannot Say from a passage only. Traps to include: timing words vs causal words ("following" ≠ "because"); sample-to-population leaps; absolutes (never/always/all); "no evidence that X" ≠ "not X"; like-for-like failures (post-acquisition totals vs standalone prior year); acknowledged confounders making a causal claim *Cannot Say* rather than *False*.

**Logical** — shape/pattern sequences. Rotation, alternation, progressive fill, counts, second-order differences, Fibonacci, interleaved sequences, multi-attribute items, and boundary behaviour (never assume a bounce or wrap the sequence hasn't demonstrated).

**Situational Judgement** — both "pick the most effective" and rating-scale formats. Score against: escalate appropriately, disclose fast, never conceal a mistake, challenge privately not publicly, never freelance outside your authority.

**Watson Glaser** — the genuine 5-part format: Inference (5-point scale), Recognising Assumptions, Deduction, Interpretation, Evaluating Arguments. Must include **affirming the consequent vs the contrapositive** on identical premises — the highest-value logic distinction on the test.

**Checking** — spot the discrepancy between two records. Include: transpositions buried mid-string (digit count and digit set both still match); DD/MM vs MM/DD date collisions using identical digits; an error copied *identically into both records* so cross-referencing passes and only recomputation catches it; multi-discrepancy items; and **genuine full matches**, so users can't just assume an error exists.

## Modes and progression
- **Difficulty tiers** — Easy available immediately; **Medium** unlocks after 1 completed attempt; **Hard** after 3 attempts averaging 70%+.
- **Expert mode toggle** — draws only from the hard/expert pool. If that pool is smaller than the normal session length, run a **shorter** session rather than padding with easier questions — Expert must never quietly serve easy items.
- **Full Assessment Day** — Numerical (8) → Verbal (6) → Logical (8) → SJT (5) back-to-back on **one continuous timer**, no pausing, with a per-section breakdown at the end.
- **Spaced repetition** — questions answered wrong resurface more often in later sessions.
- **Mental Maths Drill** — timed sprint (1/2/3 minutes, Core or Test-level), no calculator, tracks a personal best. Plus a shortcuts library: ×5 = halve then ×10; ×11 = split the digits; 1/8 = 12.5%; Rule of 72.
- **Percentile framing on results** — explain that real tests score against a norm group and firms sift around the 50th–70th percentile, so a raw % is not the real measure.
- **Per-format "How to improve"** panel with specific technique, collapsed by default.
- For each format show which **providers** use it (SHL, Korn Ferry Talent Q, cut-e/Aon, Cappfinity, Watson Glaser), which firms require it, and why.

---

# PART 4 — The Dashboard

One screen answering "where am I and what should I do next?".

**Top strip**
- Career rank + XP bar to next rank
- 🔥 Streak, with freezes banked
- Daily goal ring (user picks Casual 20 / Regular 50 / Serious 100 XP) showing today's progress
- % of curriculum mastered

**Next Up card** — one recommended action, chosen in this priority order:
1. Cards due for review today
2. An unfinished lesson in progress
3. The weakest test format (lowest average) — "Numerical is your weakest at 58%, practise it"
4. The next locked unit exam now available
5. Next unstarted lesson

**Activity heatmap** — GitHub-style 12-week grid of daily XP.

**Practice Test Analytics** — per format: best score, average, attempts, and a **trend sparkline** of the last 8 attempts. Highlight the weakest format in red.

**Develop Knowledge progress** — per unit: icon, title, a progress bar, and lessons completed (e.g. "2/3").

**Weak Spots** — every question answered wrong in *either* section pools into one deck, with a "Fix my weak spots" button that drills only those until answered right twice.

**Badge shelf** — all badges, earned in colour, unearned dimmed with progress labels.

**Empty states** — before any activity, each panel shows a one-line prompt and a link to start, never a blank box or a zero.

---

# Content quality bar

- UK-focused, interview-grade, genuinely accurate.
- **Verify every calculation.** A wrong worked example teaches the wrong thing — check the arithmetic in every numerical question and capstone step before finishing.
- Write the **complete** content: all 33 lessons, all six question banks, all three capstones. No stubs, no TODOs, no "add more here".

# Must not break

- Never divide by a possibly-zero length — `0/0` renders as literal `NaN%` and `x/0` as `Infinity%`. Guard every percentage; clamp progress bars to 0–100%.
- Wrap every `JSON.parse` of localStorage in try/catch and fall back to a fresh state.
- No horizontal page scroll at 375px — tab and filter rows must scroll inside themselves, never push the page sideways.
- Tap targets ≥32px.
- Any number shown in copy (question counts, lesson counts) must be derived from the data, not hardcoded, so it can't go stale.
