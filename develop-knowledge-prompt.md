# Prompt: Build the "Develop Knowledge" learning section

Copy everything below into a new chat.

---

Build a **Duolingo-style finance learning section** called **Develop Knowledge** for my React website.

## Tech constraints (non-negotiable)

- React 18 + TypeScript + Vite + Tailwind CSS, React Router with `HashRouter`
- **100% client-side. No backend, no database, no accounts, no external APIs.** All progress persists to `localStorage` only.
- Must work fully offline once loaded
- Routes: `/learn` (main page) and `/learn/capstone/:id` (capstone runner)

## Data model

```ts
export type QuestionType = 'mc' | 'tf' | 'fill'

export type LearnCard = {
  term: string
  definition: string
  example?: string        // a concrete worked example — always populate
  whyItMatters?: string   // why this matters in a real finance job — always populate
}

export type LearnQuestion = {
  type: QuestionType
  prompt: string
  options?: string[]      // for 'mc' and 'tf'
  answer: string
  accept?: string[]       // alternative accepted strings for 'fill'
  explanation: string     // shown after answering, right or wrong
}

export type Lesson = {
  id: string
  title: string
  description: string
  cards: LearnCard[]
  questions: LearnQuestion[]
}

export type Unit = {
  id: string
  title: string
  icon: string      // emoji
  color: string     // tailwind text colour class
  description: string
  lessons: Lesson[]
}
```

## Curriculum — 11 units, 33 lessons, 132 cards, 165 questions

Exactly **3 lessons per unit**, **4 cards per lesson**, **5 questions per lesson**. Every card must have both `example` and `whyItMatters` filled in.

1. 🏛️ **Foundations of Finance** — Time Value of Money · Risk & Return · How the Financial System Works
2. 📒 **Accounting & Financial Statements** — The Income Statement · The Balance Sheet · Cash Flow & Linking the Statements
3. 💰 **Valuation & Corporate Finance** — DCF & Intrinsic Value · Multiples & Comparable Companies · M&A and Leveraged Buyouts
4. 📈 **Equity Markets & Investing** — Stocks & Stock Markets · Investment Styles & Analysis · Portfolio Theory & Behavioural Finance
5. 🏦 **Fixed Income & Credit** — Bond Basics · Credit & the Yield Curve · Central Banks & Interest Rates
6. ⚖️ **Derivatives** — Futures & Forwards · Options · Swaps & Structured Products
7. 🌍 **Economics & Macro** — GDP, Growth & Recessions · Inflation & Monetary Policy · Currencies, Trade & Fiscal Policy
8. 🚀 **Alternative Investments** — Private Equity & Venture Capital · Hedge Funds · Real Assets & Crypto
9. 🏢 **Career Track: Investment Banking** — IB Technicals Masterclass · Deal Process & Products · The Analyst Toolkit
10. 📟 **Career Track: Trading & Markets** — Market Microstructure · The Greeks & Desk Risk · Macro Trading Fluency
11. 📊 **Career Track: Consulting** — Case Maths & Market Sizing · Strategy Concepts · The Consulting Toolkit

**Content quality bar:** UK-focused, interview-grade, genuinely accurate. Every number must actually compute — verify all arithmetic. Explanations should teach the underlying reasoning, not just state the answer. Mix all three question types across each lesson.

## Lesson flow

Four phases: `learn` → `quiz` → `complete` (or `failed`).

**Learn phase** — flip through the lesson's cards one at a time showing term, definition, example, why it matters. Progress bar. Then continue to the quiz.

**Quiz phase** — questions served in shuffled order:
- `mc` — multiple choice buttons
- `tf` — True/False
- `fill` — free-text input, case/whitespace-insensitive, accepting any string in `accept[]`
- After each answer show correct/incorrect plus the `explanation`, then Next.

**Hearts** — start each lesson with **3 ❤️**. Each wrong answer loses one. At 0 hearts go to the `failed` phase ("Out of hearts!") and let the user review the cards and retry.

**Complete phase** — show score %, a 🏆 for a perfect lesson, XP earned, and a retry option if not perfect.

## Gamification rules (exact)

- **10 XP** per correct answer
- **+20 XP** lesson completion bonus
- **+10 XP** extra for a perfect lesson (all questions right)
- **100 XP** for completing a capstone (awarded once only)
- **🔥 Streak** — increments once per calendar day of activity; resets to 1 if a day is missed; unchanged if already active today
- Persist `{ xp, streak, lastActiveDate, lessons: Record<lessonId, { completed, bestScore, timesCompleted }> }`

## Daily Review — spaced repetition

A separate review mode over **concept cards** (not questions), using a lightweight SM-2-style scheduler:

- When a lesson's card phase is completed, seed all its cards as **due immediately** so the first reinforcement happens on the next visit
- Review shows the term, user self-rates by flipping: **"Got it"** → interval **doubles** (capped at **60 days**); **"Still learning"** → interval **resets to 1 day**
- Only cards whose `dueDate` has passed appear
- Show an empty state when the queue is clear, and a summary when the session ends
- Store under its own localStorage key, card id format `unitId::lessonId::cardIndex`

Also weight the **lesson quiz** questions by spaced repetition, so questions previously answered wrong resurface more often.

## Capstones — guided model-building wizards

Three step-by-step wizards where the user **actually does the maths**, at `/learn/capstone/:id`:

1. **Build a 3-Statement Model** (5 steps) — Revenue Build → Gross Profit & EBIT → Net Income → Free Cash Flow → Ending Cash Balance. Badge: *3-Statement Model Builder*
2. **Build an LBO Model** (6 steps) — Purchase Price → Financing Structure → Debt Paydown → Exit Value → Equity Proceeds → Returns (MOIC). Badge: *LBO Model Builder*
3. **Build a DCF Valuation** (5 steps) — FCF Projection → Discounting a Cash Flow → Terminal Value → PV of Terminal Value → Enterprise Value. Badge: *DCF Model Builder*

Each step:
```ts
type CapstoneStep = {
  id: string
  title: string
  narrative: string                       // sets the scene
  given: { label: string; key: string; format: CapstoneFormat }[]
  question: string                        // asks for ONE number
  expected: (state: Record<string, number>) => number
  tolerancePct: number                    // accept within a % tolerance
  resultKey: string                       // feeds the next step
  resultLabel: string
  format: 'currency' | 'percent' | 'number' | 'years' | 'multiple'
  explanation: (state, expectedVal) => string   // full worked solution
  derived?: (state) => Record<string, number>   // silent values later steps need
}
```

The user types a number; accept it within `tolerancePct` (with a small absolute floor so near-zero answers work). Show the full worked explanation either way, then carry the **correct** value forward so one early mistake doesn't corrupt the whole model. Progress bar across steps. Award 100 XP on first completion only.

## Badges (5)

| Badge | Icon | Earned by |
|---|---|---|
| Foundations Master | 🏛️ | Complete every lesson in Foundations of Finance |
| Investment Banking Certified | 🏢 | Complete the IB track **and** all 3 capstones |
| Trading & Markets Certified | 📟 | Complete every lesson in the Trading track |
| Consulting Certified | 📊 | Complete every lesson in the Consulting track |
| Full Curriculum Master | 👑 | Complete every lesson in the whole curriculum |

Show earned badges in colour and unearned ones dimmed with a progress label (e.g. "14/33 lessons", "Lessons done · 2/3 capstones").

## Main page layout

- Header with **total XP**, **🔥 streak**, **% curriculum mastered**, and a **Daily Review** button showing the number of cards due
- A "How it works" explainer stating the XP and hearts rules explicitly
- Badge shelf
- Capstone cards
- Unit list — each unit shows icon, title, description, a progress bar, and its 3 lessons with completion ticks and best score

## Robustness requirements

- **Never divide by a possibly-zero length.** `0/0` renders as literal `NaN%` and `x/0` as `Infinity%`. Route every percentage and progress-bar width through guarded helpers that return 0 for a zero denominator, and clamp bar widths to 0–100%.
- Handle corrupted `localStorage` (wrap `JSON.parse` in try/catch and fall back to a fresh state)
- Mobile-first: no horizontal page scroll at 375px — tab/filter rows must scroll within themselves (`overflow-x-auto` + `flex-shrink-0`), never push the page sideways
- Dark theme, high contrast, tap targets at least 32px

## Deliverables

- `src/data/learn.ts` — the full curriculum (all 11 units, 33 lessons, 132 cards, 165 questions)
- `src/data/capstones.ts` — the 3 capstone wizards
- `src/pages/Learn.tsx` — main page + lesson runner + review mode
- `src/pages/Capstone.tsx` — capstone runner
- `src/lib/learnProgress.ts` — XP, streak, lesson progress
- `src/lib/cardReview.ts` — SM-2 card scheduling
- `src/lib/badges.ts` — badge logic

Write the **complete** curriculum content — do not stub lessons, leave TODOs, or say "add more here". Verify every calculation in the content is arithmetically correct before finishing.
