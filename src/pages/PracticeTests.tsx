import { useState, useEffect, useRef } from 'react'
import MentalMathsDrill from '../components/MentalMathsDrill'
import { recordPracticeTestAttempt, getPracticeTestHistory } from '../lib/history'

const mentalMathsShortcuts = [
  {
    group: 'Percentages — build them from parts',
    items: [
      '10% = move the decimal one place. 1% = move it two. Every other percentage is built from these.',
      '15% of 240 → 10% (24) + 5% (12) = 36. Never reach for long multiplication.',
      '25% = ÷4 · 50% = ÷2 · 20% = ÷5 · 75% = ÷2 then ×3. Learn these as division, not multiplication.',
      'Percentages are reversible: 18% of 50 is identical to 50% of 18 = 9. Flip whichever way is easier.',
    ],
  },
  {
    group: 'Reverse percentages — the #1 test trap',
    items: [
      'After a 20% FALL to £64, the original is 64 ÷ 0.8 = £80. Adding 20% back gives £76.80 and is wrong.',
      'After a 25% RISE to £150, the original is 150 ÷ 1.25 = £120.',
      'Rule: to undo a percentage change, DIVIDE by (1 ± rate). Never add or subtract the same percentage back.',
      'This appears in almost every numerical test, usually disguised as "what was headcount last year?"',
    ],
  },
  {
    group: 'Growth and compounding',
    items: [
      'Sequential returns multiply, never average. +12% then −8% = 1.12 × 0.92 = 1.03, so +3% — not +2%.',
      'A fall then an equal rise always loses: −20% then +20% = 0.8 × 1.2 = 0.96, down 4%.',
      'Rule of 72: 72 ÷ growth rate ≈ years to double. 8% growth doubles in about 9 years.',
      'For small rates over a few years, quick estimate: 5% for 3 years ≈ +15% plus a little (actually 15.8%).',
    ],
  },
  {
    group: 'Multiplication shortcuts',
    items: [
      '×5 → halve it and ×10. 86 × 5 = 43 × 10 = 430.',
      '×25 → ÷4 then ×100. 32 × 25 = 8 × 100 = 800.',
      '×11 (two digits) → add the digits and drop the sum in the middle. 34 × 11 = 3_(3+4)_4 = 374.',
      '×9 → ×10 then subtract one lot. 47 × 9 = 470 − 47 = 423.',
      'Split awkward numbers: 34 × 27 = 34×25 + 34×2 = 850 + 68 = 918.',
    ],
  },
  {
    group: 'Fractions and decimals worth memorising',
    items: [
      '1/8 = 12.5% · 1/6 ≈ 16.7% · 1/5 = 20% · 1/4 = 25% · 1/3 ≈ 33.3% · 3/8 = 37.5% · 5/8 = 62.5%',
      '×0.25 is ÷4 · ×0.5 is ÷2 · ×0.2 is ÷5 · ×0.125 is ÷8. Decimals hide simple divisions.',
      'Squares to 20 and the 12–19 times tables save seconds on every single question.',
    ],
  },
  {
    group: 'Ratios and shares',
    items: [
      'Add the parts first. Split £1.8m as 5:3:2 → 10 parts → each part £180k → the 3-share is £540k.',
      'A ratio question is always: total ÷ sum of parts = one part. Then multiply.',
      'Per-unit questions: work out the rate for ONE, then scale. 4 analysts × 6 days = 24 analyst-days.',
    ],
  },
  {
    group: 'Estimate first, calculate second',
    items: [
      'Round hard, get a ballpark, then eliminate. Two of four options usually die immediately.',
      'Sanity-check direction before precision: should this number be bigger or smaller than the input?',
      'Check the units the question asks for — £m vs £bn vs % is where careless marks are lost.',
      'If a calculation is taking more than ~40 seconds, you have misread the question. Reread it.',
    ],
  },
]
import { recordAnswer as recordSRAnswer, weightedSample } from '../lib/spacedRepetition'

const SR_KEY = 'findr_sr_practice_tests'

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

// Difficulty is derived from a question's position in its bank (roughly
// increasing complexity as authored), unless the question is explicitly
// tagged — expert questions are always hand-tagged.
function difficultyForIndex(index: number, total: number, tagged?: Difficulty): Difficulty {
  if (tagged) return tagged
  const third = Math.ceil(total / 3)
  if (index < third) return 'easy'
  if (index < third * 2) return 'medium'
  return 'hard'
}

function unlockedTiers(categoryId: string): Set<Difficulty> {
  const history = getPracticeTestHistory().filter(a => a.categoryId === categoryId)
  const tiers = new Set<Difficulty>(['easy'])
  if (history.length >= 1) tiers.add('medium')
  const recent = history.slice(-3)
  const avg = recent.length ? recent.reduce((s, a) => s + a.percentage, 0) / recent.length : 0
  if (history.length >= 3 && avg >= 70) tiers.add('hard')
  return tiers
}

type DataTable = {
  title: string
  headers: string[]
  rows: string[][]
  note?: string
}

type TestQuestion = {
  prompt: string
  context?: string
  shapes?: string
  dataTable?: DataTable
  difficulty?: Difficulty
  options: string[]
  answer: string
  explanation: string
}

type TestCategory = {
  id: string
  title: string
  icon: string
  color: string
  border: string
  description: string
  secondsPerQuestion: number
  questionsPerAttempt: number
  tip: string
  providers: string
  requiredBy: string
  whyUsed: string
  questions: TestQuestion[]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const testCategories: TestCategory[] = [
  {
    id: 'numerical',
    title: 'Numerical Reasoning',
    icon: '🔢',
    color: 'text-blue-400',
    border: 'border-blue-500/30',
    description: 'Percentages, ratios and data interpretation — the SHL-style tables and charts banks actually send you.',
    secondsPerQuestion: 75,
    questionsPerAttempt: 10,
    tip: 'Real tests allow a calculator — but the winners estimate first, then verify. Learn percentage shortcuts: 15% of 240 = 10% (24) + 5% (12) = 36.',
    providers: 'SHL Verify, Korn Ferry Talent Q Elements, Cappfinity (gamified), Cut-e/Aon scales',
    requiredBy: 'Investment banking (Goldman, JPMorgan, Morgan Stanley), sales & trading, asset management, Big 4, consulting — essentially every finance graduate scheme.',
    whyUsed: 'Finance is a numbers job. Firms use these to screen for speed and accuracy with data under pressure before any human reviews your application — typically cutting 50%+ of candidates at this stage.',
    questions: [
      {
        context: 'A fund\'s value grows from £2.4m to £3.0m over one year.',
        prompt: 'What is the percentage increase?',
        options: ['20%', '25%', '30%', '60%'],
        answer: '25%',
        explanation: 'Working: the increase is £3.0m − £2.4m = £0.6m. Percentage change = change ÷ ORIGINAL value = 0.6 ÷ 2.4 = 0.25 = 25%.\n\nWhy the wrong answers tempt: 20% comes from dividing by the NEW value (0.6 ÷ 3.0) — the single most common percentage error. 30% comes from a rough guess without calculating. 60% is the raw increase read as a percentage.\n\nTechnique: percentage change always divides by where you started, never where you ended. If you catch yourself dividing by the bigger number, you have made this mistake. A quick sanity check: a quarter of 2.4 is 0.6, so 25% must be right.',
      },
      {
        context: 'Company revenue: 2021: £480m · 2022: £552m · 2023: £600m.',
        prompt: 'In which year was percentage growth higher, and what was it?',
        options: ['2022, at 15%', '2023, at 15%', '2022, at 13%', '2023, at 8.7%'],
        answer: '2022, at 15%',
        explanation: 'Working: 2022 growth = (552 − 480) ÷ 480 = 72 ÷ 480 = 15%. 2023 growth = (600 − 552) ÷ 552 = 48 ÷ 552 = 8.7%. So 2022 grew faster.\n\nWhy the wrong answers tempt: "2023, at 15%" swaps the years — easy to do when scanning quickly. "2022, at 13%" comes from dividing 72 by 552 (the wrong base). "2023, at 8.7%" has the right arithmetic attached to the wrong year.\n\nTechnique: growth on a larger base requires a larger absolute increase to produce the same percentage. Revenue rose £72m then £48m — the absolute increase actually shrank while the base grew, so the percentage had to fall sharply. Spotting that before calculating tells you the answer is 2022 and you only need to compute one figure precisely.',
      },
      {
        context: 'A portfolio is split equities : bonds : cash in the ratio 5 : 3 : 2. The portfolio is worth £1.8m.',
        prompt: 'How much is held in bonds?',
        options: ['£360,000', '£540,000', '£600,000', '£900,000'],
        answer: '£540,000',
        explanation: 'Working: the ratio 5 : 3 : 2 has 5 + 3 + 2 = 10 parts. One part = £1.8m ÷ 10 = £180,000. Bonds are 3 parts = 3 × £180,000 = £540,000.\n\nWhy the wrong answers tempt: £360,000 is 2 parts (the cash allocation). £900,000 is 5 parts (equities). £600,000 comes from dividing by 3 rather than working out the part value — treating "3" as a third rather than three tenths.\n\nTechnique: always sum the ratio parts FIRST, then find the value of one part. Every ratio question in every test reduces to that two-step move. The distractors are almost always the other allocations in the same ratio, so identifying which component was asked for matters as much as the arithmetic.',
      },
      {
        prompt: 'A trader buys shares at £8.00 and sells at £9.20, paying 0.5% commission on each transaction (on transaction value). Approximate net profit per share?',
        options: ['£1.20', '£1.11', '£1.16', '£1.03'],
        answer: '£1.11',
        explanation: 'Working: gross profit = £9.20 − £8.00 = £1.20. Commission is charged on BOTH transactions: 0.5% × £8.00 = 4.0p on the buy, and 0.5% × £9.20 = 4.6p on the sell, totalling 8.6p. Net profit = £1.20 − £0.086 = £1.114, so about £1.11.\n\nWhy the wrong answers tempt: £1.20 ignores commission entirely. £1.16 charges commission only once (a very common slip). £1.03 applies 0.5% to something larger, or double-counts.\n\nTechnique: read carefully for whether a cost applies once or on every transaction — "on each transaction" is doing real work in that sentence. In markets questions, round-trip costs are charged on both legs, and test writers rely on candidates forgetting the second one.',
      },
      {
        context: 'An analyst\'s bonus is 40% of base salary. Base salary is £65,000.',
        prompt: 'What is total compensation?',
        options: ['£91,000', '£105,000', '£26,000', '£89,000'],
        answer: '£91,000',
        explanation: 'Working: bonus = 40% × £65,000 = £26,000. Total compensation = base + bonus = £65,000 + £26,000 = £91,000.\n\nWhy the wrong answers tempt: £26,000 is the bonus alone — answering the wrong question. £105,000 treats the bonus as 40% of an already-grossed-up figure, or simply guesses. £89,000 is arithmetic drift.\n\nTechnique: this one is easy, which is exactly the risk. Under time pressure candidates select the bonus figure because it is the number they just calculated. Before selecting, re-read what was asked — "total compensation" not "bonus". Test writers always include the intermediate value as a distractor.',
      },
      {
        context: 'GDP data: Country A: $2.0tn growing at 3%. Country B: $1.6tn growing at 5%.',
        prompt: 'Approximately how much does each economy add next year?',
        options: ['A: $60bn, B: $80bn', 'A: $80bn, B: $60bn', 'A: $60bn, B: $60bn', 'A: $30bn, B: $50bn'],
        answer: 'A: $60bn, B: $80bn',
        explanation: 'Working: Country A adds 3% × $2,000bn = $60bn. Country B adds 5% × $1,600bn = $80bn.\n\nWhy the wrong answers tempt: "A: $80bn, B: $60bn" swaps them, which is easy when the larger economy intuitively feels like it should add more. "A: $60bn, B: $60bn" comes from applying A\'s figure to both. "A: $30bn, B: $50bn" halves the rates or misplaces a decimal.\n\nTechnique: percentage growth and absolute growth are different questions, and tests deliberately set up cases where the smaller, faster-growing entity adds more in absolute terms. Whenever a question gives you both a size and a rate, check which one it is actually asking about before calculating.',
      },
      {
        prompt: 'An investment falls 20% in year one, then rises 20% in year two. Overall it is:',
        options: ['Back to its starting value', 'Down 4%', 'Up 4%', 'Down 2%'],
        answer: 'Down 4%',
        explanation: 'Working: start at 100. A 20% fall gives 100 × 0.8 = 80. A 20% rise on that gives 80 × 1.2 = 96. So you end at 96, down 4%.\n\nWhy the wrong answers tempt: "back to its starting value" is the intuitive answer and is wrong because the rise applies to a smaller base than the fall did. "Up 4%" reverses the direction. "Down 2%" is a half-remembered version of the effect.\n\nTechnique: percentage changes are multiplicative, not additive — 0.8 × 1.2 = 0.96, always. This asymmetry is why a 50% loss requires a 100% gain to recover, and it is one of the most frequently tested ideas in both aptitude tests and finance interviews. Generalise it: an equal percentage fall and rise always leaves you down.',
      },
      {
        context: 'Exchange rate: £1 = $1.25. A UK firm invoices a US client $150,000.',
        prompt: 'How much does the firm receive in pounds?',
        options: ['£187,500', '£120,000', '£150,000', '£112,500'],
        answer: '£120,000',
        explanation: 'Working: the rate is £1 = $1.25, so to convert dollars into pounds you divide: $150,000 ÷ 1.25 = £120,000.\n\nWhy the wrong answers tempt: £187,500 multiplies instead of dividing — the single most common FX error. £150,000 ignores the conversion. £112,500 uses a different rate or compounds an error.\n\nTechnique: before calculating, decide whether the answer should be bigger or smaller. A pound is worth more than a dollar here, so a dollar amount must convert into FEWER pounds. That directional check alone eliminates £187,500 instantly and takes two seconds. Never do an FX conversion without it — direction errors are far more common than arithmetic errors.',
      },
      {
        context: 'A company\'s costs are 70% of revenue. Revenue rises 10% while costs rise only 5%.',
        prompt: 'If revenue was £100m, what is the new profit?',
        options: ['£30m', '£33m', '£36.5m', '£40m'],
        answer: '£36.5m',
        explanation: 'Working: original costs = 70% × £100m = £70m, so original profit = £30m. New revenue = £100m × 1.10 = £110m. New costs = £70m × 1.05 = £73.5m. New profit = £110m − £73.5m = £36.5m.\n\nWhy the wrong answers tempt: £33m applies the 10% revenue growth to the original profit, ignoring that costs grew more slowly. £30m assumes profit is unchanged. £40m assumes costs were flat.\n\nTechnique: this is operating leverage — profit grew 21.7% from just 10% revenue growth, because costs grew slower than revenue. Whenever revenue and costs grow at different rates, profit growth is amplified relative to revenue growth. The step people skip is converting the 70% cost ratio into an actual pound figure before growing it; work in pounds, not percentages, as soon as you can.',
      },
      {
        prompt: 'A bond pays a £45 annual coupon and trades at £900. Its current yield is:',
        options: ['4.5%', '5.0%', '5.5%', '9.0%'],
        answer: '5.0%',
        explanation: 'Working: current yield = annual coupon ÷ current price = £45 ÷ £900 = 5.0%.\n\nWhy the wrong answers tempt: 4.5% is the COUPON rate (£45 on the £1,000 face value) — correct arithmetic, wrong question. 5.5% overshoots. 9.0% divides by the wrong figure entirely.\n\nTechnique: coupon rate is fixed against face value; current yield floats against the market price. Because this bond trades at a discount to par (£900 versus £1,000), its current yield must exceed its coupon rate — a directional check that tells you the answer is above 4.5% before you calculate. This relationship underpins the whole price-yield seesaw: as price falls, yield rises. Expect it in every fixed income interview.',
      },
      {
        context: 'Team A of 4 analysts completes a model in 6 days.',
        prompt: 'Working at the same rate, how long would 3 analysts take?',
        options: ['4.5 days', '7 days', '8 days', '9 days'],
        answer: '8 days',
        explanation: 'Working: total work required = 4 analysts × 6 days = 24 analyst-days. With 3 analysts, time = 24 ÷ 3 = 8 days.\n\nWhy the wrong answers tempt: 4.5 days applies direct proportion (fewer people, less time) — the intuition trap. 7 days is a guess between 6 and 8. 9 days over-scales.\n\nTechnique: convert to total work units first — analyst-days, machine-hours, person-weeks. Then divide by the new resource. This is inverse proportion: fewer people means MORE time, so your answer must be greater than 6 days, which eliminates 4.5 instantly. In consulting cases this same unit-conversion logic solves most capacity and staffing questions.',
      },
      {
        context: 'A fund charges a 2% management fee. An investor puts in £250,000 and the gross return is 8%.',
        prompt: 'Roughly what is the investor\'s net gain after the fee (fee charged on invested capital)?',
        options: ['£20,000', '£15,000', '£10,000', '£5,000'],
        answer: '£15,000',
        explanation: 'Working: gross gain = 8% × £250,000 = £20,000. Management fee = 2% × £250,000 = £5,000. Net gain = £20,000 − £5,000 = £15,000.\n\nWhy the wrong answers tempt: £20,000 ignores the fee. £10,000 double-counts it or applies 4%. £5,000 is the fee itself, selected because it is the last number calculated.\n\nTechnique: note how large the fee is relative to the return — a 2% fee consumed a quarter of an 8% gross return. That ratio is the entire active-versus-passive investing debate in one line, and it compounds brutally over time: the same 2% drag over 20 years costs roughly a third of your final wealth. Expect this framing in asset management interviews.',
      },
      {
        prompt: '£10,000 invested at 10% compound interest for 2 years grows to:',
        options: ['£12,000', '£12,100', '£11,000', '£12,200'],
        answer: '£12,100',
        explanation: 'Working: Year 1 = £10,000 × 1.10 = £11,000. Year 2 = £11,000 × 1.10 = £12,100. Or directly: 10,000 × 1.1² = £12,100.\n\nWhy the wrong answers tempt: £12,000 is simple interest (£1,000 twice) — it misses the interest earned on the first year\'s interest. £11,000 is one year only. £12,200 is a miscalculation.\n\nTechnique: the £100 gap between £12,000 and £12,100 IS compounding, and over long periods that gap becomes enormous — £10,000 at 10% for 30 years is £174,000 compounded versus £40,000 simple. Always multiply by (1 + r) repeatedly rather than adding the interest amount. Related shortcut worth memorising: the rule of 72 says 10% doubles your money in about 7.2 years.',
      },
      {
        context: 'A product sells at £50 with variable costs of £20 per unit. Fixed costs are £120,000.',
        prompt: 'How many units must be sold to break even?',
        options: ['2,400', '4,000', '6,000', '3,000'],
        answer: '4,000',
        explanation: 'Working: contribution per unit = price − variable cost = £50 − £20 = £30. Breakeven volume = fixed costs ÷ contribution = £120,000 ÷ £30 = 4,000 units.\n\nWhy the wrong answers tempt: 2,400 divides fixed costs by the £50 price, ignoring variable costs — the most common error. 6,000 divides by £20 (the variable cost). 3,000 is a rough guess.\n\nTechnique: only the CONTRIBUTION covers fixed costs, because every unit sold also incurs its own variable cost. Breakeven = fixed ÷ contribution is worth memorising outright — it appears in numerical tests, consulting cases and corporate finance interviews. The powerful follow-up insight: a 10% price cut here drops contribution from £30 to £25, pushing breakeven from 4,000 to 4,800 units, so you need 20% more volume just to stand still.',
      },
      {
        prompt: 'After falling 20%, a share trades at £64. What was its original price?',
        options: ['£76.80', '£80', '£84', '£78'],
        answer: '£80',
        explanation: 'Working: after a 20% fall, £64 represents 80% of the original. So original = £64 ÷ 0.8 = £80. Check: £80 × 0.8 = £64 ✓.\n\nWhy the wrong answers tempt: £76.80 adds 20% back to £64 — the classic and most common trap, because adding 20% to a smaller number does not undo subtracting 20% from a larger one. £84 and £78 are estimates.\n\nTechnique: to reverse ANY percentage change, DIVIDE by (1 ± rate). Never add or subtract the same percentage back. This appears constantly in disguised forms — "headcount is 240 after a 20% rise, what was it before?" is the same question (240 ÷ 1.2 = 200). Always verify by running your answer forward: if it does not reproduce the given figure, you added instead of divided.',
      },
      {
        context: 'A portfolio is 60% in Fund A (returned 5%) and 40% in Fund B (returned 10%).',
        prompt: 'What is the portfolio\'s overall return?',
        options: ['7.5%', '7%', '8%', '6.5%'],
        answer: '7%',
        explanation: 'Working: weighted average = (60% × 5%) + (40% × 10%) = 3.0% + 4.0% = 7.0%.\n\nWhy the wrong answers tempt: 7.5% is the simple average of 5% and 10%, ignoring that more money sits in the lower-returning fund. 8% over-weights Fund B. 6.5% under-weights it.\n\nTechnique: never average returns without weighting by how much is invested in each. The answer must sit closer to the fund holding more money — since 60% is in the 5% fund, the blend must be below 7.5%, which eliminates the simple average immediately. This same weighted-average logic drives WACC, blended margins and portfolio returns, so it is worth being fast at.',
      },
      {
        context: 'Revenue is £250m with a gross margin of 40%.',
        prompt: 'What is the cost of goods sold?',
        options: ['£100m', '£150m', '£40m', '£210m'],
        answer: '£150m',
        explanation: 'Working: gross margin 40% means gross profit = 40% × £250m = £100m. Cost of goods sold = revenue − gross profit = £250m − £100m = £150m. Equivalently, COGS is 60% of revenue.\n\nWhy the wrong answers tempt: £100m is the gross PROFIT — right calculation, wrong question, and the most-selected wrong answer. £40m treats the margin as a pound figure. £210m is arithmetic drift.\n\nTechnique: margin and cost ratio are complements that sum to 100%. If margin is 40%, COGS is automatically 60% — you can go straight to 0.6 × 250 = £150m in one step. Whenever a question gives you a margin, immediately write down the complementary cost percentage; it usually saves a step and prevents answering the wrong question.',
      },
      {
        context: 'A company has EBIT of £45m and annual interest expense of £9m.',
        prompt: 'What is its interest coverage ratio?',
        options: ['5x', '4x', '9x', '0.2x'],
        answer: '5x',
        explanation: 'Working: interest coverage ratio = EBIT ÷ interest expense = £45m ÷ £9m = 5.0x.\n\nWhy the wrong answers tempt: 4x subtracts before dividing (45 − 9 = 36, then a slip). 9x uses the interest figure itself. 0.2x inverts the ratio — dividing interest by EBIT instead.\n\nTechnique: coverage ratios always put the resource ON TOP and the obligation underneath, because you are asking "how many times over can I cover this?" An answer below 1x would mean the company cannot pay its interest at all, so any coverage answer under 1 should trigger a re-check. Context worth knowing: lenders typically want above 3x, below 2x signals distress, and covenants are frequently written against exactly this ratio — so it comes up in both aptitude tests and credit interviews.',
      },
      {
        context: '£1 = $1.25 and €1 = $1.00.',
        prompt: 'What is the £/€ exchange rate?',
        options: ['£1 = €0.80', '£1 = €1.25', '£1 = €1.00', '£1 = €2.25'],
        answer: '£1 = €1.25',
        explanation: 'Working: £1 buys $1.25. Since €1 = $1.00, those $1.25 buy €1.25. Therefore £1 = €1.25.\n\nWhy the wrong answers tempt: £1 = €0.80 inverts the rate (1 ÷ 1.25) — the most common cross-rate error. £1 = €1.00 ignores the dollar leg. £1 = €2.25 adds the rates instead of chaining them.\n\nTechnique: chain cross rates through the common currency, cancelling units as you go — £ → $ → €, so £1 × (1.25 $/£) × (1 €/$) = €1.25. Then sanity-check the direction: the pound is stronger than the dollar, and the euro equals the dollar, so a pound must be worth MORE than a euro. That alone eliminates 0.80 and 1.00. Writing the units explicitly is what stops you inverting.',
      },
      {
        context: 'Headcount data — Front office: 240, up 20% year-on-year. Operations: 600, down 10% year-on-year.',
        prompt: 'What was TOTAL headcount one year ago (front office + operations)?',
        options: ['840', '867', '800', '873'],
        answer: '867',
        explanation: 'Working: reverse each segment separately. Front office rose 20%, so last year = 240 ÷ 1.2 = 200. Operations fell 10%, so last year = 600 ÷ 0.9 = 667. Total last year = 200 + 667 = 867.\n\nWhy the wrong answers tempt: 840 applies a single blended percentage to the combined 840 total, which is invalid because the two segments moved in opposite directions. 800 reverses only the front office. 873 uses slightly wrong division.\n\nTechnique: when segments change at different rates, you must reverse each one individually — never apply an average to the total. Note also the two directions: a RISE reverses by dividing by 1.2, a FALL reverses by dividing by 0.9. Both are divisions, which catches people who instinctively multiply for one of them. Sanity-check: front office grew and operations shrank, so the old total should be close to the new one, which 867 versus 840 satisfies.',
      },
      {
        context: 'A fund returns 12% in year 1 and −8% in year 2.',
        prompt: 'What is the compound (not average) two-year return?',
        options: ['4.0%', '3.0%', '2.96%', '20.0%'],
        answer: '3.0%',
        explanation: 'Working: chain the growth factors. Year 1 turns £1 into 1.12. Year 2 does not take 8% off the original — it takes 8% off the NEW balance: 1.12 × 0.92 = 1.0304. So the two-year compound return is 3.04%, or 3.0% to one decimal.\n\nWhy the wrong answers tempt: 4.0% is the naive (12 − 8) subtraction — it ignores that the 8% loss applies to a bigger base than the 12% gain did. 2.96% is what you get if you compound in the wrong direction (0.88 × 1.12 − 1 = −1.4%, or 1.12 − 1.12×0.08 mis-sequenced) — it looks precise, which is exactly why it is offered. 20.0% is simply 12 + 8, added instead of netted: the answer you pick if you stop reading at “12% and 8%”.\n\nTechnique: percentage changes NEVER add. Convert every move to a multiplier (+12% → 1.12, −8% → 0.92), multiply the chain, subtract 1. Order does not matter for the final figure, so multiply the easy pair first. Permanent sanity check: a gain and a loss of the SAME size always leave you down (1.12 × 0.88 = 0.9856), because the loss hits a bigger base. Here the gain is larger than the loss, so the answer must be positive but smaller than 4% — that single observation eliminates three options in five seconds without any arithmetic.',
      },
      {
        context: 'A company issues 2 million new shares at £4.50 each, raising cash. It previously had 18 million shares outstanding and net income of £27m.',
        prompt: 'By how much does EPS fall purely from the share issuance (assume net income unchanged)?',
        options: ['About 10%', 'About 8%', 'About 11%', 'About 5%'],
        answer: 'About 10%',
        explanation: 'Working: EPS = net income ÷ share count. Old EPS = £27m ÷ 18m = £1.50. New share count = 18m + 2m = 20m, so new EPS = £27m ÷ 20m = £1.35. The fall is £0.15 ÷ £1.50 = 10%.\n\nWhy the wrong answers tempt: “About 11%” is 2 ÷ 18 = 11.1% — the share count rose by 11.1%, but EPS falls by only 10%, because the denominator ratio is 18/20 = 0.90. “About 8%” comes from dividing the £0.15 fall by the NEW EPS (0.15 ÷ 1.35 = 11%) or from a botched 1.5/18. “About 5%” tempts anyone who assumes the £9m raised offsets half the dilution — it cannot, because the question explicitly holds net income constant.\n\nTechnique: for pure dilution, skip EPS entirely — the percentage fall equals 1 − (old shares ÷ new shares) = 1 − 18/20 = 10%. The £4.50 issue price and the £9m raised are deliberate noise: in a real deal that cash earns a return and partially offsets dilution, and that is the standard interview follow-up, but here the stem ring-fences it. Remember the asymmetry: a rise of x% in the share count causes a fall of x/(1+x) in EPS — always slightly smaller than x. Anyone who answers with the same number as the share-count increase has skipped a step.',
      },
      {
        context: 'A UK investor holds a US stock. The stock rises 8% in USD terms, but the pound strengthens 5% against the dollar over the same period.',
        prompt: 'Approximately what is the investor\'s return in GBP terms?',
        options: ['13%', '8%', '3%', '2.9%'],
        answer: '2.9%',
        explanation: 'Working: you earn 1.08 in dollars, but each dollar now buys fewer pounds because sterling strengthened 5%. GBP return = 1.08 ÷ 1.05 − 1 = 1.0286 − 1 ≈ 2.9%.\n\nWhy the wrong answers tempt: 3% is the quick subtraction 8 − 5. It is a perfectly good approximation, and in an interview you would say it out loud — but the option set also contains 2.9%, and when a test offers both a rounded and an exact figure, the exact one is the intended answer. 13% ADDS the FX move, which would be right only if sterling had weakened 5%. 8% ignores currency entirely, which is the single most common real-world error in cross-border performance reporting.\n\nTechnique: ask one question before calculating — did my home currency get stronger or weaker? Stronger home currency means foreign assets translate back into less, a drag, so divide. Weaker home currency is a tailwind, so multiply. The subtraction shortcut is accurate to within about 0.2 percentage points for moves under 10%, so use it to eliminate options fast and only do the division if two candidates survive, which is precisely the trap laid here. In practice this is why funds quote returns both “local” and “GBP hedged” — the gap between them is entirely this arithmetic.',
      },
      {
        context: 'An analyst forecasts revenue growing 8% a year for 3 years from a base of £150m.',
        prompt: 'What is revenue after 3 years (nearest £m)?',
        options: ['£186m', '£189m', '£195m', '£174m'],
        answer: '£189m',
        explanation: 'Working: 1.08³ built in steps — 1.08 × 1.08 = 1.1664, then × 1.08 = 1.2597. Revenue = 150 × 1.2597 = £188.96m ≈ £189m.\n\nWhy the wrong answers tempt: £186m is 150 × 1.24, treating three years of 8% as a flat 24%. That simple-interest error always lands slightly BELOW the true figure, so if you see two close options and one is a touch lower, the lower one is usually the un-compounded trap. £195m over-compounds, roughly 1.30, which is nearer four years. £174m is 150 × 1.16, only two years of growth — an off-by-one on the exponent that happens when you count the base year as year one.\n\nTechnique: memorise the factors that recur constantly in numerical tests — 1.05³ ≈ 1.158, 1.08³ ≈ 1.26, 1.10³ = 1.331, 1.08⁵ ≈ 1.47, and the Rule of 72 (8% doubles in about 9 years). Failing that, use the binomial approximation (1+r)ⁿ ≈ 1 + nr + [n(n−1)/2]r², which here gives 1 + 0.24 + 3 × 0.0064 = 1.2592 — three decimals of accuracy in about four seconds of mental work. Then count the years deliberately: “growing 8% a year for 3 years from a base of £150m” means the exponent is 3.',
      },
      {
        context: 'A company has 400,000 shares outstanding trading at £12.50, and net debt of £1.2m.',
        prompt: 'What is its enterprise value?',
        options: ['£5.0m', '£6.2m', '£3.8m', '£4.8m'],
        answer: '£6.2m',
        explanation: 'Working: equity value (market cap) = shares × price = 400,000 × £12.50 = £5.0m. Enterprise value = equity value + net debt = £5.0m + £1.2m = £6.2m.\n\nWhy the wrong answers tempt: £5.0m is market cap alone — the answer if you forget that a buyer of the whole business also inherits its debt. £3.8m SUBTRACTS net debt, which is the most common EV error of all: you subtract CASH, but net debt is already debt minus cash, so subtracting it flips the sign and double-counts. £4.8m combines both mistakes.\n\nTechnique: hold the logic, not the formula. EV is what it costs to own the operating business free of its capital structure — you pay the shareholders (market cap), you take on the debt (add it), and you get the cash sitting on the balance sheet (subtract it). Hence EV = market cap + debt − cash = market cap + net debt. If a question hands you gross debt and cash separately, add and subtract them separately. If net debt is negative (a net-cash company), EV is LOWER than market cap — the standard trick with cash-rich technology comparables. Learn the bridge in both directions, because banking interviewers ask it both ways: equity value → +net debt → enterprise value, and EV → −net debt → equity value → ÷ shares → implied share price.',
      },
      {
        context: 'Two funds: Fund X returned 15% with a 20% chance of losing money in any given year. Fund Y returned 9% with a 5% chance of losing money.',
        prompt: 'An investor prioritising downside protection over raw return would most likely prefer:',
        options: ['Fund X, for the higher return', 'Fund Y, for the lower loss probability', 'Both are identical', 'Neither — insufficient data on volatility'],
        answer: 'Fund Y, for the lower loss probability',
        explanation: 'Working: the stem sets the decision rule for you — the investor prioritises DOWNSIDE PROTECTION over raw return. Fund X: 15% return, 20% chance of a losing year. Fund Y: 9% return, 5% chance of a losing year. On the stated criterion Y wins outright: a one-in-twenty chance of a down year against one-in-five.\n\nWhy the wrong answers tempt: “Fund X, for the higher return” is the trap the whole question is built around — it is the correct answer to a question that was not asked. Test writers deliberately make the rejected option numerically superior so that scanning for the biggest number fails. “Both are identical” is never right when the two funds differ on the stated criterion. “Insufficient data on volatility” is the seductive sophisticated answer: it is true that loss probability is not standard deviation, and in a real risk conversation you would want volatility, Sharpe ratio and maximum drawdown. But the question asks what the investor would MOST LIKELY prefer given what is shown, and loss probability is a direct measure of downside. Over-thinking into “not enough information” is one of the top three causes of lost marks in data-interpretation sections.\n\nTechnique: underline the criterion clause before you look at any numbers — “prioritising X over Y”, “on a per-unit basis”, “excluding one-offs”, “in real terms”. SHL, Cappfinity and Talent Q build whole question banks around inserting a preference that inverts the obvious ranking. Then calibrate your bar for “insufficient data”: pick it only when the stated criterion cannot be evaluated at all from the information given, never merely because you would like more evidence.',
      },
      {
        context: 'A bond with 5 years to maturity and a duration of 4.2 currently yields 5%. Rates are expected to rise by 0.75%.',
        prompt: 'Approximately what price change should the bondholder expect?',
        options: ['-3.15%', '+3.15%', '-4.2%', '-0.75%'],
        answer: '-3.15%',
        explanation: 'Working: modified duration estimates the percentage price move for a 1% (100bp) change in yield. Price change ≈ −duration × Δyield = −4.2 × 0.75 = −3.15%.\n\nWhy the wrong answers tempt: +3.15% has the right magnitude and the wrong sign — bond prices and yields always move inversely, so the sign is the free mark. −4.2% applies the duration as though yields moved a full 1%. −0.75% is the yield change itself mistaken for the price change; duration is precisely the multiplier that converts one into the other, so ignoring it defeats the question entirely.\n\nTechnique: write the minus sign before you calculate. On the intuition, which you WILL be asked in a rates interview: the bond pays fixed coupons, so when new bonds are issued at higher yields the old one is worth less, and its price falls until its yield-to-maturity matches the market. Duration is roughly the weighted average time to receive the cash flows, which is why longer maturity and lower coupon both raise duration and therefore rate sensitivity. Two follow-ups to have ready. First, this is a first-order estimate only — convexity means the price gain from a fall in yields slightly exceeds the loss from an equal rise, so duration overstates losses and understates gains. Second, sense-check the inputs: duration of 4.2 on a 5-year bond is consistent, because duration is always below maturity for a coupon-paying bond and equals maturity only for a zero-coupon bond.',
      },
      {
        context: 'A retailer\'s like-for-like sales rose 4% while total sales rose 11%, with no store closures.',
        prompt: 'The gap between these two figures is best explained by:',
        options: ['Inflation', 'New store openings', 'Currency movements', 'A calculation error — this is impossible'],
        answer: 'New store openings',
        explanation: 'Working: like-for-like (same-store) sales count only outlets trading in both periods; total sales count everything. Total (+11%) exceeds LFL (+4%) by seven percentage points, and the stem rules out closures — so the gap must come from stores that exist now and did not before: new openings.\n\nWhy the wrong answers tempt: “Inflation” fails because price rises lift the SAME stores, so inflation flows into the LFL figure too and cannot open a gap between the two measures. “Currency movements” is the strongest distractor and would be a real candidate for an international retailer reporting in sterling — but FX also affects both measures similarly, and nothing in the stem points overseas. “Impossible” is the panic answer; total exceeding LFL is completely routine for any expanding chain, and picking it signals you do not know what the metrics mean.\n\nTechnique: LFL is the most scrutinised metric in retail because it isolates whether the underlying business is improving or merely getting bigger by opening doors. Read the gap as a diagnostic: total above LFL means expansion is carrying growth; total below LFL means the estate is shrinking; LFL near zero while total booms is the classic warning that a roll-out is masking a stale core, which is how several retail collapses looked twelve months out. Analysts then decompose LFL into volume (footfall, basket size) and price — if LFL growth is all price in an inflationary year, real volumes are falling. Expect exactly this chain of questions in a retail-sector interview or a consulting case on a struggling chain.',
      },
      {
        difficulty: 'expert',
        context: 'A fund reports: Year 1 +18%, Year 2 −12%, Year 3 +7%. Management fees of 1.5% are charged annually on the closing balance after performance.',
        prompt: 'An investor put in £500,000 at the start. Approximately what is the closing value after three years, net of fees?',
        options: ['£556,000', '£571,000', '£531,000', '£589,000'],
        answer: '£531,000',
        explanation: 'Year 1: 500,000 × 1.18 = 590,000, less 1.5% → 581,150. Year 2: × 0.88 = 511,412, less 1.5% → 503,741. Year 3: × 1.07 = 539,003, less 1.5% → £530,918, so roughly £531,000. Two traps: applying the fee once at the end rather than annually, and averaging the returns (+18−12+7)/3 instead of compounding them sequentially.',
      },
      {
        difficulty: 'expert',
        context: 'Division A: revenue £180m, operating margin 22%. Division B: revenue £320m, operating margin 9%. The group targets a blended operating margin of 16% next year, with Division B revenue unchanged and its margin improving to 12%.',
        prompt: 'What revenue must Division A achieve to hit the group target, assuming its margin holds at 22%?',
        options: ['£213m', '£256m', '£180m', '£310m'],
        answer: '£213m',
        explanation: 'Let A revenue = x. Group profit = 0.22x + (320 × 0.12) = 0.22x + 38.4. Group revenue = x + 320. Set the blend to 16%: 0.22x + 38.4 = 0.16(x + 320) = 0.16x + 51.2 → 0.06x = 12.8 → x = £213m. Sanity check: at £213m, group profit = 46.9 + 38.4 = £85.3m on revenue of £533m = 16.0% ✓. A must therefore grow from £180m to about £213m. Multi-division margin questions are algebra, not estimation — define the unknown and write one equation.',
      },
      {
        dataTable: {
          title: 'Exhibit A — Divisional revenue (£m)',
          headers: ['Division', 'FY22', 'FY23', 'FY24'],
          rows: [
            ['Equities', '420', '455', '486'],
            ['Fixed Income', '380', '362', '398'],
            ['Advisory', '290', '338', '352'],
            ['Wealth Management', '210', '231', '268'],
          ],
          note: 'Three questions in this test may refer to this exhibit — real numerical tests group questions around shared data.',
        },
        prompt: 'Which division grew fastest between FY22 and FY24?',
        options: ['Equities', 'Advisory', 'Wealth Management', 'Fixed Income'],
        answer: 'Wealth Management',
        explanation: 'Two-year growth: Equities 486/420 = +15.7%; Fixed Income 398/380 = +4.7%; Advisory 352/290 = +21.4%; Wealth 268/210 = +27.6%. Wealth grew fastest. The trap is comparing absolute increases — Equities added £66m versus Wealth\'s £58m, but Wealth grew from a much smaller base.',
      },
      {
        dataTable: {
          title: 'Exhibit A — Divisional revenue (£m)',
          headers: ['Division', 'FY22', 'FY23', 'FY24'],
          rows: [
            ['Equities', '420', '455', '486'],
            ['Fixed Income', '380', '362', '398'],
            ['Advisory', '290', '338', '352'],
            ['Wealth Management', '210', '231', '268'],
          ],
        },
        prompt: 'What percentage of FY24 total revenue did Advisory represent?',
        options: ['21.4%', '23.4%', '25.4%', '19.8%'],
        answer: '23.4%',
        explanation: 'Working: total the FY24 column first — 486 + 398 = 884; + 352 = 1,236; + 268 = £1,504m. Advisory share = 352 ÷ 1,504 = 23.40%.\n\nWhy the wrong answers tempt: 25.4% is 352 ÷ 1,386, dividing by the FY23 total — the error your eye makes when it slips one column left mid-addition. 21.4% comes from an inflated total (roughly 1,646) after double-counting a row. 19.8% implies a total near 1,778, which is what you get by highlighting a block of two columns rather than one. Every distractor here is a specific, reproducible reading error rather than a random number — that is how professional test writers build option sets, and it means finding your answer in the list is NOT evidence you read the right cells.\n\nTechnique: on any table question, do three checks before touching the arithmetic — confirm the year, confirm the units (this exhibit is £m, so no zeros to juggle), and confirm whether the question wants a share, a change or a rate. Add the column once, write the total in the margin, and reuse it, because these exhibits almost always carry two or three questions off the same total and the second one then becomes nearly free. Sense-check against an even split: four divisions means 25% each if identical, and Advisory is the third largest, so a shade under a quarter is exactly what you should expect. That benchmark alone flags 19.8% as too low and 21.4% as suspicious before you compute anything.',
      },
      {
        dataTable: {
          title: 'Exhibit A — Divisional revenue (£m)',
          headers: ['Division', 'FY22', 'FY23', 'FY24'],
          rows: [
            ['Equities', '420', '455', '486'],
            ['Fixed Income', '380', '362', '398'],
            ['Advisory', '290', '338', '352'],
            ['Wealth Management', '210', '231', '268'],
          ],
        },
        prompt: 'If total revenue grows in FY25 at the same rate as FY23 to FY24, what will FY25 total revenue be?',
        options: ['£1,632m', '£1,588m', '£1,704m', '£1,552m'],
        answer: '£1,632m',
        explanation: 'Working: three steps. First, FY23 total = 455 + 362 + 338 + 231 = £1,386m. Second, FY24 total = £1,504m (already computed for the previous question — reuse it). Third, growth = 1,504 ÷ 1,386 − 1 = 8.51%, applied forward: FY25 = 1,504 × 1.0851 = £1,632m.\n\nWhy the wrong answers tempt: £1,588m applies the growth to the FY23 base rather than FY24 — an off-by-one-year error that feels right because 1,386 and 1,504 are both on screen. £1,704m compounds twice (1,504 × 1.085²), which is FY26, not FY25. £1,552m is what you get by taking one division’s growth rate instead of the total’s: Equities grew 486/455 = 6.8%, and 1,504 × 1.068 lands close to it.\n\nTechnique: chained questions off a single exhibit reward candidates who wrote down intermediate results — two column totals and one growth rate answer everything this table can ask, so the marginal cost of question two should be about fifteen seconds. Sense-check in absolute terms rather than percentages: revenue rose £118m last year, so growth at a similar RATE on a slightly larger base should add a bit more than £118m, roughly £128m, landing near £1,632m. That check kills £1,704m (+£200m, far too big) and £1,552m (+£48m, far too small) instantly. Finally, read the forward period carefully — “grows in FY25 at the same rate as FY23 to FY24” means one further year, and miscounting forward periods is the most expensive error on projection questions.',
      },
      {
        difficulty: 'expert',
        dataTable: {
          title: 'Exhibit B — Fund performance (annualised)',
          headers: ['Fund', 'Gross return', 'Volatility', 'Annual fee'],
          rows: [
            ['Alpha', '12.4%', '8.2%', '1.50%'],
            ['Beta', '9.1%', '5.0%', '1.00%'],
            ['Gamma', '15.2%', '14.0%', '1.75%'],
            ['Delta', '7.8%', '4.1%', '0.75%'],
          ],
          note: 'Risk-free rate is 3.0%.',
        },
        prompt: 'Which fund delivered the best risk-adjusted return NET of fees (highest Sharpe ratio)?',
        options: ['Alpha', 'Beta', 'Gamma', 'Delta'],
        answer: 'Beta',
        explanation: 'Sharpe = (net return − risk-free) ÷ volatility. Alpha: (10.9−3)/8.2 = 0.96. Beta: (8.1−3)/5.0 = 1.02. Gamma: (13.45−3)/14.0 = 0.75. Delta: (7.05−3)/4.1 = 0.99. Beta wins despite having the second-lowest headline return — and Gamma, with the highest gross return, is worst risk-adjusted. Real tests deliberately reward the candidate who reads which metric was asked for.',
      },
      {
        difficulty: 'expert',
        context: 'A company buys equipment for £2.4m. It depreciates straight-line over 8 years to a residual value of £400,000. The tax rate is 25%.',
        prompt: 'What is the annual cash tax saving generated by the depreciation charge?',
        options: ['£62,500', '£75,000', '£250,000', '£100,000'],
        answer: '£62,500',
        explanation: 'Depreciable amount = 2,400,000 − 400,000 residual = £2,000,000. Annual depreciation = 2,000,000 ÷ 8 = £250,000. Tax saving = 250,000 × 25% = £62,500. Two traps: forgetting to deduct residual value before dividing, and confusing the depreciation charge itself with the tax saving it generates.',
      },
    ],
  },
  {
    id: 'verbal',
    title: 'Verbal Reasoning',
    icon: '📖',
    color: 'text-green-400',
    border: 'border-green-500/30',
    description: 'Read a passage, then judge statements as True, False, or Cannot Say — using ONLY the passage.',
    secondsPerQuestion: 60,
    questionsPerAttempt: 9,
    tip: 'The #1 trap: using outside knowledge. If the passage doesn\'t state or directly imply it, the answer is Cannot Say — even if you know it\'s true in real life.',
    providers: 'SHL Verify Verbal, Watson Glaser (critical thinking variant), Korn Ferry Talent Q, Cut-e/Aon',
    requiredBy: 'Consulting firms, investment banks, asset managers, law-adjacent roles (compliance, risk), and the Big 4. Watson Glaser specifically appears at firms testing critical reasoning.',
    whyUsed: 'Finance runs on dense documents — research notes, term sheets, regulations. These tests screen whether you extract precisely what a text says without adding assumptions, which is exactly the discipline the job needs.',
    questions: [
      {
        context: 'Passage: "The central bank raised interest rates by 0.5% in response to inflation reaching 8%. Analysts had expected a smaller rise of 0.25%. Following the announcement, the currency strengthened against the dollar."',
        prompt: 'Statement: The rate rise was larger than analysts expected.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: 'Answer: True. The passage gives both numbers explicitly — analysts expected 0.25%, the bank delivered 0.5%. 0.5 is larger than 0.25, so the statement is supported by the text alone, with no assumption added.\n\nWhy the other verdicts fail: False would require the passage to say the rise met or undershot expectations; it says the opposite. Cannot Say is the tempting one for over-cautious candidates, who reason “the passage never uses the word larger”. But True does not require the statement to be quoted verbatim — it requires it to follow necessarily from what is written. A one-step numerical comparison between two figures both printed in the passage is exactly that. Refusing to make that comparison is over-correction, and it costs as many marks as careless inference does.\n\nTechnique: calibrate what True means. True = the statement must be so given the passage, including simple arithmetic and direct logical consequence. False = the passage contradicts it. Cannot Say = the passage neither supports nor contradicts it. The mistake most candidates make in the first minute is treating the test as a word-matching exercise; the mistake they make in the last minute, having been burned, is answering Cannot Say to everything. Both fail. Ask instead: could the passage be entirely true and this statement still be false? Here it could not, so the answer is True.',
      },
      {
        context: 'Passage: "The central bank raised interest rates by 0.5% in response to inflation reaching 8%. Analysts had expected a smaller rise of 0.25%. Following the announcement, the currency strengthened against the dollar."',
        prompt: 'Statement: The currency strengthened because of the rate rise.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'Cannot Say',
        explanation: 'Answer: Cannot Say. The passage establishes a sequence — “following the announcement, the currency strengthened” — but never asserts that the announcement caused the move. Sequence is not causation.\n\nWhy the other verdicts fail: True is what most candidates pick, because the causal link is genuinely plausible: a larger-than-expected rate rise usually does attract capital and lift a currency. That real-world knowledge is precisely the trap. The test rewards what the text establishes, not what an economics tutorial would predict. False is also wrong — the passage does not deny causation either; some other driver (a data release, a risk-off move, an intervention) could equally have been at work, and the text simply does not say.\n\nTechnique: build a permanent watch-list of causation words and treat them as alarms — “following”, “after”, “amid”, “as”, “alongside”, “coincided with” all denote timing only, whereas “because”, “due to”, “driven by”, “as a result of”, “led to” denote causation. If the passage uses a timing word and the statement uses a causal one, the answer is Cannot Say almost every time. Note how differently the very next passage in this bank behaves: when a text says outflows occurred “as clients shifted towards passive products”, the same construction is doing causal work because the passage presents it as the explanation. Read the function of the clause, not just the connective.',
      },
      {
        context: 'Passage: "Firm X\'s graduate scheme receives over 50,000 applications for roughly 400 places. Successful candidates typically complete three interview rounds and a numerical assessment. The firm states that academic background is only one of several criteria it considers."',
        prompt: 'Statement: Fewer than 1% of applicants receive a place.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: 'Answer: True. 400 ÷ 50,000 = 0.008 = 0.8%, which is below 1%. Both figures come straight from the passage, so a single division settles it.\n\nWhy the other verdicts fail: Cannot Say tempts candidates who believe verbal tests forbid calculation. They do not — SHL verbal items routinely require one arithmetic step, and refusing to take it is a guaranteed miss. False would require more than 1% to be offered places, which the numbers contradict. There is a subtler point in favour of True: the passage says “over 50,000 applications” and “roughly 400 places”. A larger denominator only pushes the ratio further below 1%, so the vagueness runs in the direction that strengthens the statement rather than undermining it. That is worth thirty seconds of thought, because on a differently worded item — say “over 400 places for roughly 50,000 applications” — the same vagueness would run the other way and Cannot Say would become defensible.\n\nTechnique: when a passage gives approximate figures, check which direction the approximation pushes the claim before you answer. If every value consistent with the wording still supports the statement, answer True. If some do and some do not, answer Cannot Say. For speed, convert to a benchmark rather than computing exactly: 1% of 50,000 is 500, and 400 is fewer than 500, so the claim holds — no long division required.',
      },
      {
        context: 'Passage: "Firm X\'s graduate scheme receives over 50,000 applications for roughly 400 places. Successful candidates typically complete three interview rounds and a numerical assessment. The firm states that academic background is only one of several criteria it considers."',
        prompt: 'Statement: Candidates with poor grades are never hired.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'Cannot Say',
        explanation: 'Answer: Cannot Say. The passage says academic background is “only one of several criteria”. That tells you grades are not the sole filter; it says nothing about whether a candidate with poor grades has ever been, or could be, hired.\n\nWhy the other verdicts fail: False is the popular choice, on the reasoning that if academics are only one of several criteria then poor grades clearly cannot be disqualifying — so “never hired” must be contradicted. That is an inference, not a statement. A firm can genuinely weigh several criteria and still operate an academic floor that no applicant clears from below; “one of several criteria” is entirely compatible with it also being a threshold. True is worse still, requiring the passage to confirm a categorical negative it never mentions.\n\nTechnique: absolutes are the highest-yield signal in verbal reasoning. Words such as never, always, all, none, only and every make a statement very hard to support and very easy to contradict, so scan for them first. Then apply the rule: if the passage contains a matching absolute or a direct counter-example, you can answer True or False; if it merely gestures in the same direction, the answer is Cannot Say. Note the contrast with the fraud-rules passage elsewhere in this bank, where “all victims will be reimbursed” IS answerable — because there the text supplies both a hedge (“most”) and an explicit carve-out (claims below £100), which together contradict the absolute outright. Here no such counter-evidence exists, and the difference between False and Cannot Say is exactly whether the passage supplies it.',
      },
      {
        context: 'Passage: "Index funds now account for over half of US equity fund assets. Their fees average below 0.1%, compared with roughly 0.7% for active funds. Some researchers argue this shift reduces the amount of price discovery in markets, though others dispute the effect is significant."',
        prompt: 'Statement: Researchers agree that index funds harm price discovery.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'False',
        explanation: 'Answer: False. The passage says some researchers argue the shift reduces price discovery “though others dispute the effect is significant”. Disagreement among researchers is stated outright, so a claim of agreement is contradicted.\n\nWhy the other verdicts fail: Cannot Say is the most common wrong pick here, and the reasoning behind it is superficially disciplined — the passage never counts researchers, so how can we say what the field as a whole thinks? But the statement is not about proportions; it asserts agreement, and the passage explicitly reports two opposing camps. One documented dissent is enough to falsify “researchers agree”. True would require the passage to present a settled consensus, which the word “though” exists precisely to deny.\n\nTechnique: watch the concessive connectives — though, however, while, nonetheless, whereas, on the other hand, critics say. They exist to introduce a counterweight, and questions are built on whether you registered them. A useful habit is to mark every one as you read, because the examiner is almost always testing that specific clause. Then remember the asymmetry that makes this item work: statements of universal agreement need only one counter-example to be False, whereas statements of universal disagreement would need much more. Recognising which side of that asymmetry a statement sits on tells you whether False or Cannot Say is even available.',
      },
      {
        context: 'Passage: "Index funds now account for over half of US equity fund assets. Their fees average below 0.1%, compared with roughly 0.7% for active funds. Some researchers argue this shift reduces the amount of price discovery in markets, though others dispute the effect is significant."',
        prompt: 'Statement: Active funds charge roughly seven times more than index funds on average.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: 'Answer: True. The passage gives active fees at roughly 0.7% and index fees at below 0.1%. 0.7 ÷ 0.1 = 7, and since index fees are BELOW 0.1%, the true multiple is at least seven — so “roughly seven times more” is supported.\n\nWhy the other verdicts fail: Cannot Say attracts candidates who notice that “below 0.1%” is imprecise and conclude the ratio is unknowable. Check the direction of that imprecision, as always: a smaller denominator makes the multiple larger, so every value consistent with the passage gives seven times or more. The statement says “roughly seven times”, which that range comfortably supports. False would require the passage to imply a materially different multiple, and it does not.\n\nTechnique: this is the same imprecision test as the 1%-of-applicants item, and it is worth internalising as a single rule — when a passage hedges a figure, ask whether the hedge pushes the claim toward or away from truth, and answer accordingly. Two further habits pay off on fee questions specifically. First, percentages of percentages confuse people under time pressure: the gap here is 0.6 percentage points but a factor of seven, and test writers will offer statements phrased both ways to see whether you know the difference. Second, note that “roughly” in the STATEMENT loosens the bar for True, whereas “roughly” in the PASSAGE loosens what you know — hedges in the two places have opposite effects, and reading which is which decides several items on every real test.',
      },
      {
        context: 'Passage: "The merger was approved by shareholders of both companies in March. Regulators in two of the three required jurisdictions have granted clearance. The companies expect completion by year end, subject to remaining approvals."',
        prompt: 'Statement: The merger has completed.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'False',
        explanation: 'Answer: False. The passage says two of three required jurisdictions have cleared and completion is “expected by year end, subject to remaining approvals”. Both halves of that sentence establish the deal is still pending, so “has completed” is contradicted.\n\nWhy the other verdicts fail: Cannot Say is the near-miss, and it is the answer many disciplined candidates give — the passage never says the words “the merger has not completed”, so they treat completion as unaddressed. But it is addressed twice over: an outstanding approval is by definition a condition unmet, and “expected by year end” places completion in the future relative to the text. A statement in the present perfect (“has completed”) is directly incompatible with both. True would require all three clearances plus a completion event, and the passage supplies neither.\n\nTechnique: tense and conditionality are where merger and regulatory passages are won. Train yourself to sort every verb into happened, is happening, is expected to happen, or is required before it can happen — the last two categories are the ones test writers exploit. “Subject to”, “conditional on”, “pending”, “targeted for”, “anticipated” all mark an event as NOT yet done, which is strong enough to make a completion claim False rather than merely unproven. Note the contrast with the sister question about the third regulator: the passage tells you the state of the process, so completion is answerable, but it tells you nothing about the third regulator’s intentions, so its decision is not. Same passage, different answers, because the text covers one and is silent on the other.',
      },
      {
        context: 'Passage: "The merger was approved by shareholders of both companies in March. Regulators in two of the three required jurisdictions have granted clearance. The companies expect completion by year end, subject to remaining approvals."',
        prompt: 'Statement: The third regulator will block the merger.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'Cannot Say',
        explanation: 'Answer: Cannot Say. The passage tells you the third jurisdiction has not yet granted clearance. It says nothing whatsoever about what that regulator will decide.\n\nWhy the other verdicts fail: False is the popular pick, driven by the passage’s optimistic framing — the companies “expect completion by year end”, so surely a block is ruled out? No. A company’s expectation is a statement about the company, not about the regulator, and deals with confident timetables are blocked regularly. To answer False you would need the passage to indicate the regulator will clear, and it does not. True is worse, requiring evidence of an intended block that appears nowhere in the text.\n\nTechnique: separate three distinct things that passages routinely blur — what has happened, what a party expects, and what will happen. Only the first is fact; the second is attributed opinion; the third is almost never established. When a statement asks you to predict a future decision by a third party, Cannot Say is the default and you should need positive textual evidence to move off it. Also notice the pairing at work here: this passage supports one False (the merger has not completed) and one Cannot Say (what the third regulator will do). Test writers deliberately build both from a single short text to catch candidates who lock into a rhythm and answer the second question with the momentum of the first. Reset your reasoning for every statement, even on a passage you have already read three times.',
      },
      {
        context: 'Passage: "Hedge fund launches fell to a decade low last year, while closures exceeded launches for the third consecutive year. Industry assets nonetheless reached a record high, driven by performance gains at existing funds and inflows to the largest managers."',
        prompt: 'Statement: The number of hedge funds is shrinking while industry assets are growing.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: 'Answer: True. Two facts from the passage combine. Closures have exceeded launches for three consecutive years, so the number of funds must be falling. Industry assets nonetheless reached a record high, so assets are growing. The statement asserts exactly that pairing.\n\nWhy the other verdicts fail: Cannot Say tempts anyone who reads “fell to a decade low” as the key clause and misses that the decisive fact is the closures-versus-launches comparison — the launch rate alone would not tell you the fund count is shrinking, but closures exceeding launches necessarily does. False attracts candidates who sense a contradiction between fewer funds and record assets and conclude the statement must be wrong. There is no contradiction: the passage explains it directly, citing performance gains at existing funds and inflows to the largest managers. Fewer, bigger funds is consolidation, and it is one of the most-reported structural stories in the industry.\n\nTechnique: when a statement combines two claims, verify each independently and only then check that the passage permits both simultaneously. A compound statement is True only if every component is supported. Here both are, so it stands. Learn to spot the arithmetic buried in verbal passages too — “closures exceeded launches” is a net-flow statement about a stock, exactly like deaths exceeding births in a population, and recognising that structure gives you the answer before you have finished the sentence. Finally, resist the instinct that surprising equals unsupported: passages often report genuinely counterintuitive facts, and your job is to check the text, not your expectations.',
      },
      {
        context: 'Passage: "New rules require payment firms to reimburse most victims of authorised fraud within five business days. Industry groups warned the change could encourage complacency among consumers, while consumer advocates said firms had for too long avoided responsibility. The rules exclude claims below £100."',
        prompt: 'Statement: All fraud victims will be reimbursed under the new rules.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'False',
        explanation: 'Answer: False. The passage supplies two separate contradictions of “all”. The rules require reimbursement of MOST victims, not all; and claims below £100 are explicitly excluded, which names a category of victims who will not be reimbursed.\n\nWhy the other verdicts fail: Cannot Say is the disciplined-sounding trap — the passage does not enumerate every victim, so how can we be sure? Because “most” is not “all”, and because the carve-out identifies an excluded group outright. Either alone would be enough. True would require the passage to promise universal reimbursement, which the word “most” exists to prevent.\n\nTechnique: this is the item to compare against the “candidates with poor grades are never hired” question, because the two look alike and split. Both statements contain an absolute. This one is False because the passage supplies explicit counter-evidence — a hedge plus a stated exclusion. That one is Cannot Say because the passage supplies no counter-evidence at all, only a related remark. The rule to carry into the test: an absolute statement is False when the text contradicts it, Cannot Say when the text is merely silent, and True only when the text asserts something equally absolute. Then read quantifiers as precisely as numbers — most, many, some, several, a majority and all are not interchangeable, and a swap between any two of them is the single most common way a statement is falsified.',
      },
      {
        context: 'Passage: "New rules require payment firms to reimburse most victims of authorised fraud within five business days. Industry groups warned the change could encourage complacency among consumers, while consumer advocates said firms had for too long avoided responsibility. The rules exclude claims below £100."',
        prompt: 'Statement: Industry groups and consumer advocates disagree about the rules.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: 'Answer: True. The passage presents two positions side by side: industry groups warned the change could encourage complacency, while consumer advocates said firms had for too long avoided responsibility. One criticises the rules, the other endorses their premise. That is disagreement, stated.\n\nWhy the other verdicts fail: Cannot Say attracts candidates who want an explicit clash — the passage never says the two groups argued with each other, so they hold back. But the statement claims they disagree about the rules, and the text gives each group’s stance on the rules in the same sentence, with “while” signalling the contrast. That is sufficient. False would require the passage to show the two groups aligned, which it does not.\n\nTechnique: “while”, “whereas”, “by contrast” and “meanwhile” are structural markers that a passage is setting up two sides, and questions are frequently built on whether you can characterise each side accurately. Read for stance, not vocabulary: neither group is quoted using the words agree or disagree, and the advocates never mention complacency at all, yet their positions are plainly opposed. Beware the mirror-image trap too — a statement claiming both groups OPPOSE the rules would be False, because the advocates’ complaint is that firms avoided responsibility, which supports the rules rather than attacking them. Getting stance direction right matters as much as spotting that a contrast exists.',
      },
      {
        context: 'Passage: "New rules require payment firms to reimburse most victims of authorised fraud within five business days. Industry groups warned the change could encourage complacency among consumers, while consumer advocates said firms had for too long avoided responsibility. The rules exclude claims below £100."',
        prompt: 'Statement: Fraud rates will rise as a result of the new rules.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'Cannot Say',
        explanation: 'Answer: Cannot Say. Industry groups WARNED the change COULD encourage complacency. That is an attributed prediction, hedged twice over, and consumer complacency is in any case not the same thing as a rise in fraud rates.\n\nWhy the other verdicts fail: True is what you pick if you read the warning as a finding, collapsing “a lobby group says this might happen” into “this will happen”. Two separate leaps are involved: from opinion to fact, and from complacency to actual fraud rates. False is also unavailable — nothing in the passage suggests fraud will fall or stay flat, and the advocates’ counter-argument is about responsibility, not incidence.\n\nTechnique: strip every statement back to who is asserting it and with what confidence. Text of the form “X warned that Y could happen” establishes only that X issued a warning. A statement asserting Y is unsupported; a statement asserting that X warned about Y would be True. Test writers exploit this attribution gap constantly, because it is easy to read a quoted concern as a reported fact when you are moving quickly. Note also that the interested party matters for your reading speed: industry groups are the ones facing the reimbursement bill, so their warning is advocacy, and advocacy is never evidence in this test. And watch modal verbs — could, might, may, is likely to and risks all keep a claim firmly in the unproven column.',
      },
      {
        context: 'Passage: "Funds marketed as sustainable attracted record inflows last year, though definitions of \'sustainable\' vary widely between providers. A regulator\'s review found that a third of funds examined could not adequately evidence their sustainability claims. New labelling requirements take effect next year."',
        prompt: 'Statement: A third of all sustainable funds cannot evidence their claims.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'Cannot Say',
        explanation: 'Answer: Cannot Say. The regulator found that a third of funds EXAMINED could not evidence their claims. The statement generalises that to a third of ALL sustainable funds, which the passage does not support.\n\nWhy the other verdicts fail: True is the trap and it catches most candidates, because the numbers match exactly and the swap of one word feels immaterial. It is not. Nothing tells you how the review selected its sample — regulators typically target funds where they already suspect problems, which would make the reviewed group considerably worse than average, though the passage does not say that either. False is equally unavailable, since the true population figure could plausibly be a third; you simply cannot tell.\n\nTechnique: sample-to-population is one of the three or four highest-frequency traps in verbal reasoning, and it is beatable with a mechanical check — every time a statistic appears, locate the group it describes and compare it word for word with the group in the statement. Examined versus all, surveyed versus employed, respondents versus the public, UK versus global, last quarter versus last year. If those two groups differ at all, the answer is almost always Cannot Say. It is worth noting that this discipline is not merely a test artefact: mistaking a sample for a population is how misleading statistics get into research notes and press releases, which is exactly why assessors screen for it.',
      },
      {
        context: 'Passage: "Funds marketed as sustainable attracted record inflows last year, though definitions of \'sustainable\' vary widely between providers. A regulator\'s review found that a third of funds examined could not adequately evidence their sustainability claims. New labelling requirements take effect next year."',
        prompt: 'Statement: The labelling requirements are already in force.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'False',
        explanation: 'Answer: False. The passage states the new labelling requirements take effect next year. “Already in force” places them in the present, which the text directly contradicts.\n\nWhy the other verdicts fail: Cannot Say tempts the over-cautious, who note the passage never says “the requirements are not yet in force”. It does not need to: “take effect next year” carries that meaning necessarily, since a rule cannot take effect next year and already be in force. True would require present-tense enforcement, and the future tense rules it out.\n\nTechnique: tense questions are among the most reliable marks on the paper, so bank them quickly and spend the saved time on the causation and sample items where the real difficulty lies. Read the timeline explicitly as you go: what is already true, what changes and when. A sentence like “new rules take effect next year” gives you three answerable statements at once — the rules are not in force now (False if asserted), they will be in force next year (True), and any claim about their effects (Cannot Say, because effects are unobserved). Sorting a passage into that structure on first reading is what lets strong candidates answer three items from one sentence in under a minute.',
      },
      {
        context: 'Passage: "Funds marketed as sustainable attracted record inflows last year, though definitions of \'sustainable\' vary widely between providers. A regulator\'s review found that a third of funds examined could not adequately evidence their sustainability claims. New labelling requirements take effect next year."',
        prompt: 'Statement: There is no single agreed definition of a sustainable fund.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: 'Answer: True. The passage says definitions of sustainable “vary widely between providers”. If providers use widely differing definitions, no single agreed definition exists — the statement restates the passage in negative form.\n\nWhy the other verdicts fail: Cannot Say attracts candidates hunting for a literal phrase; the passage never says “there is no agreed definition”, so they withhold. But True requires necessary consequence, not verbatim repetition, and wide variation and universal agreement cannot both hold. False would need the passage to point to a common standard — and note it gestures at the opposite, since new labelling requirements are being introduced precisely because definitions currently diverge.\n\nTechnique: expect statements phrased as the logical complement of a passage line, since it is a cheap way for examiners to test comprehension rather than pattern-matching. “Definitions vary widely” equals “no agreed definition”; “closures exceeded launches” equals “fund numbers are falling”; “expected by year end” equals “not complete now”. Practise the translation deliberately, because under time pressure candidates default to scanning for shared words, and these items are built to punish exactly that. One caution on how far to push it: a single logical step is fair game, but a chain of two or more usually is not. “Definitions vary, therefore some funds are mislabelled” is a step too far — plausible, and unsupported.',
      },
      {
        context: 'Passage: "The bank\'s trading division reported a record quarter, with revenue up 34% year-on-year, driven primarily by fixed income volatility. However, the wealth management division saw outflows for the second consecutive quarter as clients shifted towards passive products."',
        prompt: 'Statement: The bank\'s overall quarterly profit rose 34%.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'Cannot Say',
        explanation: 'Answer: Cannot Say. The 34% refers to the trading division’s REVENUE. The statement claims the bank’s overall PROFIT rose 34%. Two substitutions are made at once — one division for the whole bank, and revenue for profit — and the passage supports neither.\n\nWhy the other verdicts fail: True is the fast-reader’s answer, grabbing the only percentage in the passage and attaching it to whatever the statement asks about. False is more interesting and catches better candidates: they reason that trading is only part of the bank and wealth management is losing assets, so overall growth must be lower than 34%, making the statement contradicted. That inference is unsound. Outflows are a flow of client assets, not a revenue figure, so their profit impact is unquantified; trading might be large enough to carry the group; and profit depends on costs and provisions the passage never mentions. Plausible reasoning is not textual support, and False requires contradiction, not doubt.\n\nTechnique: run a two-part check on every statement carrying a number — is it the same METRIC, and is it the same ENTITY? Revenue is not profit, group is not division, year-on-year is not quarter-on-quarter, and constant currency is not reported. Swapping any one of them is the standard construction for a Cannot Say item on a financial-results passage, and the pair swapped here is the most common of all. It is also the distinction interviewers probe when they ask why a bank can report record revenue and falling profit — the answer being costs, impairments and compensation, none of which a revenue line tells you about.',
      },
      {
        context: 'Passage: "The bank\'s trading division reported a record quarter, with revenue up 34% year-on-year, driven primarily by fixed income volatility. However, the wealth management division saw outflows for the second consecutive quarter as clients shifted towards passive products."',
        prompt: 'Statement: Wealth management clients are moving towards passive investment products.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: 'Answer: True. The passage states wealth management saw outflows “as clients shifted towards passive products”. The statement asserts that clients are moving towards passive investment products, which is exactly what the text says.\n\nWhy the other verdicts fail: Cannot Say is the considered wrong answer here, and it comes from correctly remembering that “as” often marks timing rather than cause. Note carefully what the statement actually claims: it does not say passive investing CAUSED the outflows, only that clients are shifting towards passive products. That shift is asserted outright, so the causation question never arises. Candidates who have just been burned by the “following the announcement” item frequently over-apply the lesson and lose this mark. False would require the passage to indicate a move away from passive, which it does not.\n\nTechnique: read the statement before deciding which trap you are in. The causation trap only bites when the STATEMENT makes a causal claim; if the statement merely reports a fact the passage also reports, the connective is irrelevant. A reliable habit is to underline the verb in the statement and find its counterpart in the passage — here “shifted towards” maps one-to-one onto “are moving towards”, with nothing added. This is also why speed on verbal tests comes from statement-first reading: identify precisely what is being claimed, then go hunting in the passage, rather than re-reading the whole text and hoping the answer surfaces.',
      },
      {
        context: 'Passage: "A survey of 2,000 finance professionals found that 68% considered AI tools essential to their daily work, up from 41% two years earlier. Younger respondents were more likely to report daily AI use, though the survey did not ask about which specific tools were used."',
        prompt: 'Statement: The survey shows ChatGPT is the most-used AI tool among finance professionals.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'False',
        explanation: 'Answer: False. The passage states the survey “did not ask about which specific tools were used”. The statement claims the survey SHOWS ChatGPT is the most-used tool. A survey that did not collect tool-level data cannot show any such thing, so the claim is contradicted rather than merely unsupported.\n\nWhy the other verdicts fail: Cannot Say is the majority answer and the reasoning is nearly right — we genuinely do not know which tool finance professionals use most. But read the statement precisely: it is a claim about what THE SURVEY SHOWS, not about the world. The passage tells you exactly what the survey did and did not measure, so the claim about the survey is answerable and false. Had the statement read “ChatGPT is the most-used AI tool among finance professionals”, Cannot Say would be correct — the passage would then be silent rather than contradictory. That one-word difference between the two framings is the entire question. True would require tool-level findings the survey never gathered.\n\nTechnique: distinguish claims about the EVIDENCE from claims about the WORLD, because they take different answers from the same passage. When a text specifies a study’s scope, methodology or exclusions, it is arming you to falsify claims about that study, and examiners include such clauses for precisely that purpose. Treat any sentence describing what a study did not do as a loaded gun and expect a question on it. The same reflex is worth having outside the test: “the data does not show X” and “X is false” are different statements, and conflating them is how bad analysis gets written.',
      },
      {
        context: 'Passage: "A survey of 2,000 finance professionals found that 68% considered AI tools essential to their daily work, up from 41% two years earlier. Younger respondents were more likely to report daily AI use, though the survey did not ask about which specific tools were used."',
        prompt: 'Statement: Perceived reliance on AI tools has grown over the two-year period covered.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: 'Answer: True. The passage reports 68% considering AI tools essential, “up from 41% two years earlier”. A rise from 41% to 68% over the period is stated directly, and the statement asserts exactly that growth in perceived reliance.\n\nWhy the other verdicts fail: Cannot Say attracts candidates worried about the wording “perceived reliance” — the survey asked whether tools were ESSENTIAL, which is not literally the word reliance. But considering a tool essential to daily work is a statement of perceived reliance, and the statement is careful to say perceived, matching the survey’s subjective measure rather than claiming actual usage rose. False would require the figure to have fallen or held flat.\n\nTechnique: note how tightly this statement is drafted — “perceived”, and “over the two-year period covered”. Well-constructed items are often True precisely because every hedge lines up with the passage, whereas False and Cannot Say items usually contain one word that overreaches. So read the modifiers as a checklist: does each one match the text? Here perceived matches “considered”, and the two-year period matches “two years earlier”. Compare with the ChatGPT item on the same passage, where a single word takes the statement beyond the survey’s scope. Same passage, two statements, one True and one False, separated entirely by drafting precision — which is exactly the skill being screened, since misreading a hedged sentence in a research note or a term sheet is a costly professional error.',
      },
      {
        context: 'Passage: "Three candidates were shortlisted for the analyst role. Candidate A scored highest on the numerical test but was rated weakest at interview. Candidate B scored lowest on the numerical test but impressed most at interview. The firm ultimately hired Candidate C, who scored in the middle on both."',
        prompt: 'Statement: The firm always hires the candidate who performs best in interview.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'False',
        explanation: 'Answer: False. The statement claims the firm ALWAYS hires the best interviewer. Candidate B impressed most at interview and was not hired; Candidate C was. One counter-example is enough to falsify an always-claim.\n\nWhy the other verdicts fail: Cannot Say is the sophisticated-sounding error — one hiring decision cannot establish a firm’s general policy, so surely we cannot judge an “always” claim from a single case? The logic runs the wrong way. Proving “always” would indeed require every case, but DISPROVING it requires only one exception, and the passage hands you one. That asymmetry is the whole point of the item. True would require the best interviewer to have been hired, which is the opposite of what happened.\n\nTechnique: universal claims are cheap to falsify and expensive to confirm, so when you see always, never, all or every, your first move should be to hunt for a single counter-example rather than to assess the general pattern. Find one and the answer is False immediately, no further reading required. Fail to find one and you are usually in Cannot Say territory, because the passage will rarely cover every case. This mirrors the “poor grades are never hired” item, which stays Cannot Say precisely because no counter-example is available there. Same logical structure, opposite answers, decided solely by whether the text supplies an exception — and being able to see that at a glance is worth several marks and a good deal of time.',
      },
      {
        context: 'Passage: "Three candidates were shortlisted for the analyst role. Candidate A scored highest on the numerical test but was rated weakest at interview. Candidate B scored lowest on the numerical test but impressed most at interview. The firm ultimately hired Candidate C, who scored in the middle on both."',
        prompt: 'Statement: Candidate C was hired because of consistency across both measures rather than a standout score on either.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'Cannot Say',
        explanation: 'Answer: Cannot Say. The passage reports two facts about Candidate C — middling scores on both measures, and being hired. It never states the firm’s reason. The statement supplies a motive (“because of consistency”), and motives are almost never established by a passage that does not state them.\n\nWhy the other verdicts fail: True is extremely tempting because the explanation is genuinely elegant and fits every fact given. That is precisely what makes it dangerous: a plausible story that accommodates the data is still a story you constructed. The firm might equally have chosen C for cultural fit, a strong reference, language skills, salary expectations, or a reason the passage never hints at. False is also wrong — the consistency explanation is not contradicted either, merely unevidenced.\n\nTechnique: separate WHAT happened from WHY it happened. Passages report outcomes freely and reasons rarely, and any statement offering a rationale for a decision should trigger an immediate hunt for explicit causal language — “because”, “on the grounds that”, “citing”, “the firm said it valued”. Absent that, answer Cannot Say however satisfying the inference feels. The elegance of an explanation is not evidence for it, and the better the story fits, the more carefully you should check whether the text actually asserts it. This is the highest-value habit the test screens for: in a research note, an investment committee or a client recommendation, presenting a well-fitting hypothesis as an established cause is the error that does real damage.',
      },
      {
        difficulty: 'expert',
        context: 'Passage: "The regulator stated that firms which failed to evidence adequate controls would face enforcement action. Of the 40 firms reviewed, 12 could not produce the required documentation within the deadline, though 5 of those subsequently supplied it during the extended window. The regulator has not yet announced any enforcement decisions."',
        prompt: 'Statement: At most 7 firms remain exposed to enforcement action on documentation grounds.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: '12 failed within the deadline, 5 later supplied it, leaving 7 that never produced documentation. Since only firms failing to evidence controls face action on these grounds, at most 7 remain exposed — "at most" is satisfied even if the regulator ultimately pursues fewer. This tests whether you handle qualified quantifiers precisely rather than defaulting to Cannot Say whenever a passage feels uncertain.',
      },
      {
        difficulty: 'expert',
        context: 'Passage: "The regulator stated that firms which failed to evidence adequate controls would face enforcement action. Of the 40 firms reviewed, 12 could not produce the required documentation within the deadline, though 5 of those subsequently supplied it during the extended window. The regulator has not yet announced any enforcement decisions."',
        prompt: 'Statement: The 28 firms that met the original deadline had adequate controls.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'Cannot Say',
        explanation: 'Producing documentation on time is not the same as having adequate controls — the passage links enforcement to failing to EVIDENCE controls, but never confirms that documented firms were actually compliant. Conflating "provided paperwork" with "was adequate" is exactly the inferential leap these questions punish.',
      },
    ],
  },
  {
    id: 'logical',
    title: 'Logical & Abstract Reasoning',
    icon: '🔷',
    color: 'text-purple-400',
    border: 'border-purple-500/30',
    description: 'The infamous shape-sequence tests: find the pattern, predict what comes next.',
    secondsPerQuestion: 45,
    questionsPerAttempt: 10,
    tip: 'Check patterns systematically: count of shapes, rotation, alternation, size, position, and combinations. If stuck, eliminate options that break an obvious rule and guess — never leave blanks.',
    providers: 'SHL Inductive Reasoning, Cut-e/Aon scales cls & ix (used heavily by trading firms), Korn Ferry logical, Raven\'s Progressive Matrices',
    requiredBy: 'Trading firms (Optiver, IMC, Flow Traders famously use cut-e), quant funds, tech divisions, consulting and most bank graduate schemes.',
    whyUsed: 'Abstract reasoning is the closest proxy for raw pattern-recognition and learning speed — trading and quant firms weight it heavily because spotting patterns fast IS the job. It\'s also degree-agnostic, so firms use it to compare candidates fairly.',
    questions: [
      {
        shapes: '●  ○  ●  ○  ●  ?',
        prompt: 'What comes next in the sequence?',
        options: ['●', '○', '◆', '■'],
        answer: '○',
        explanation: 'Working: the only attribute changing is fill, and it flips every step — ● ○ ● ○ ●. Position 6 must therefore be ○. Equivalently, odd positions are filled and even positions are empty; 6 is even, so ○.\n\nWhy the wrong answers tempt: ● is what you pick by copying the item you just looked at rather than continuing the rule — the single most common careless error on the easy items, because your eye rests on the last symbol. ◆ and ■ introduce a shape change that never appears anywhere in the sequence; abstract tests routinely offer an option that varies an attribute the sequence holds constant, precisely to catch candidates who are pattern-hunting rather than pattern-reading.\n\nTechnique: on inductive tests the opening two or three items are deliberately trivial, and they exist to be banked in under ten seconds each so you have time for the multi-attribute items later. Build the habit now that will carry you through the hard ones — name the attributes present (here: shape, fill, count, position, size, orientation), then state which are moving and which are fixed. Here only fill moves, so any option changing shape is eliminated before you even reason about parity. That elimination-first reflex is what turns a 45-second item into a 10-second one, and cut-e style tests are scored on speed as much as accuracy.',
      },
      {
        shapes: '▲  ▲▲  ▲▲▲  ▲▲▲▲  ?',
        prompt: 'What comes next?',
        options: ['▲▲▲', '▲▲▲▲', '▲▲▲▲▲', '▲'],
        answer: '▲▲▲▲▲',
        explanation: 'Working: the shape never changes; only the count moves — 1, 2, 3, 4. The differences are all +1, so the fifth term is 5 triangles.\n\nWhy the wrong answers tempt: ▲▲▲▲ repeats the previous term, the copying error again. ▲▲▲ goes backwards. ▲ resets to the start, which would be right only if the sequence were cyclic, and nothing here suggests a cycle — the count has risen monotonically with no boundary in sight. That distinction between a progression and a cycle is worth holding onto, because later items in this bank hinge on it.\n\nTechnique: counting sequences are the foundation for the harder second-order ones, so practise writing the counts as a number line underneath the shapes rather than judging by eye. Under time pressure candidates miscount clusters of five or more identical symbols surprisingly often, and a written 1, 2, 3, 4 removes the risk entirely. Then look at the differences: all equal means linear (this item), rising means accelerating (the triangular-number and 1, 2, 4, 7 items), and a constant ratio means geometric (the doubling-stars item). Those three shapes cover the large majority of count-based questions you will see, and identifying which one you are in should take a single glance at the difference row.',
      },
      {
        shapes: '◐  ◓  ◑  ◒  ?',
        prompt: 'The half-filled circle rotates each step. What comes next?',
        options: ['◐', '◓', '◑', '◒'],
        answer: '◐',
        explanation: 'Working: the shaded half moves left → top → right → bottom, a 90° clockwise turn each step. That completes a full revolution in four steps, so the fifth item returns to the starting orientation: ◐.\n\nWhy the wrong answers tempt: ◒ repeats the previous item. ◓ and ◑ are simply the wrong points in the cycle — and because all four options are the same four symbols you have just been staring at, there is no shortcut through elimination here; you must actually track the rotation. This is why examiners like rotation items: every distractor is equally plausible to a candidate who has not identified the direction.\n\nTechnique: for any rotational sequence, settle two things immediately — the direction and the period. Direction is easiest to fix by picking one feature and asking where it went; here the shaded side moves from the 9 o’clock position to 12 o’clock, which is clockwise. Period is the number of distinct states, four in this case, after which everything repeats. With both known you can jump straight to any position using position mod period rather than tracing every step: item 5 has the same state as item 1. That modular shortcut is what makes the expert-level ●○◐ rotation item tractable inside 45 seconds, so it is worth practising on the easy ones where you can check yourself.',
      },
      {
        shapes: '■ ●  |  ● ■  |  ■ ●  |  ?',
        prompt: 'What comes next?',
        options: ['■ ●', '● ■', '■ ■', '● ●'],
        answer: '● ■',
        explanation: 'Working: two elements exchange places every step — ■● then ●■ then ■● and so on, a period-2 cycle. Since item 3 is ■●, item 4 must be ●■.\n\nWhy the wrong answers tempt: ■● repeats the current item, which is the answer you give if you lose your place in a sequence of near-identical groups. ■■ and ●● are the interesting distractors: they abandon the swap rule and change the CONTENTS of the pair instead of its order. Nothing in the sequence ever alters which two shapes are present, and options that change the cast rather than the arrangement should be eliminated on sight.\n\nTechnique: separate arrangement from composition. Some sequences permute a fixed set (this one, and the ◆■● cyclic-shift item); others change what is in the set (the filling ○○○○ item). Ask which kind you are in before hunting for a rule, because that single classification halves the option list immediately. When the sequence permutes, count the period: a two-element swap has period 2, a three-element cyclic shift has period 3, and knowing that lets you answer by parity rather than by tracing. Here position 4 is even, and even positions are ●■ — an answer you can reach without looking at the intervening items at all.',
      },
      {
        shapes: '○  ◔  ◑  ◕  ?',
        prompt: 'The circle fills progressively. What comes next?',
        options: ['●', '○', '◔', '◑'],
        answer: '●',
        explanation: 'Working: the shaded proportion grows in equal steps of one quarter — 0, ¼, ½, ¾ — so the fifth item is completely filled: ●.\n\nWhy the wrong answers tempt: ◔ and ◑ are earlier stages of the same sequence, offered to catch anyone who loses their place; ○ is the starting state, which would be correct only if the pattern cycled back rather than continuing. That is a genuine judgement call rather than a trick, and it is the heart of this item — a progression that reaches a boundary can either stop, reverse, or wrap round to the beginning, and you have to decide which on the evidence available. Here nothing indicates a cycle, and a quarter-by-quarter fill has an obvious natural endpoint at full, so ● is the reading with the fewest assumptions.\n\nTechnique: when a monotonic progression is one step from its limit, prefer the option that simply completes it. Only choose a reversal or a reset when the sequence has already demonstrated one — as the ■□□□ item in this bank does by explicitly telling you the pattern reverses. This is the same discipline as the travelling-dot item, where the filled circle has not yet hit the end of the row and so no bounce may be assumed. Stated as one rule to carry into the test: never invent a boundary behaviour the sequence has not shown you.',
      },
      {
        shapes: '△ △ ▲  |  □ □ ■  |  ○ ○ ?',
        prompt: 'Each group follows the same rule. What completes the third group?',
        options: ['○', '●', '△', '■'],
        answer: '●',
        explanation: 'Working: read each group as a unit. Group 1 is triangle, triangle, filled triangle. Group 2 is square, square, filled square. Both follow the rule “two outlines then the filled version of the same shape”, so group 3 must be circle, circle, filled circle: ●.\n\nWhy the wrong answers tempt: ○ continues with an outline and ignores the fill step that defines the rule. △ and ■ import shapes from the other groups, which is the error of treating the sequence as one long chain rather than three parallel groups — a distinction the vertical bars are there to signal. Notice that the shape identity is constant WITHIN a group and varies BETWEEN groups, while the fill pattern is constant BETWEEN groups and varies within. Recognising which attribute does which is the whole question.\n\nTechnique: whenever separators appear, decode the completed groups first and treat the rule as a template to apply, not a sequence to extend. Then check the attributes on both axes — down the groups and across each group — because the interesting rules almost always live on one axis while the other holds an attribute fixed. This grouped structure is the bridge to matrix-style questions such as Raven’s Progressive Matrices, where you must read a rule across rows and a different one down columns simultaneously. Practising the two-axis read on simple grouped items like this one is the cheapest preparation for the harder matrix formats.',
      },
      {
        shapes: '★ 1  |  ★★ 2  |  ★★★★ 3  |  ★★★★★★★★ 4  |  ? 5',
        prompt: 'How many stars are in the 5th group?',
        options: ['10', '12', '16', '9'],
        answer: '16',
        explanation: 'Working: the counts are 1, 2, 4, 8. The differences (1, 2, 4) are not constant, but the ratios are — each term is twice the last. So the fifth term is 8 × 2 = 16.\n\nWhy the wrong answers tempt: 10 is 8 + 2, applying the most recent difference as though the sequence were arithmetic. 12 is 8 + 4, applying the difference before that. 9 is 8 + 1, using the first difference. Every wrong option comes from treating a geometric sequence as arithmetic, which tells you something useful about how these papers are built: the distractors map the specific misreadings the examiner expects, so an answer landing on one of them is a warning rather than a reassurance.\n\nTechnique: run two checks on every numeric sequence, in this order. Take the differences; if they are constant you are done. If not, take the ratios; if those are constant it is geometric. Only if neither is constant do you look for something more exotic — second-order differences (the 1, 2, 4, 7 item), Fibonacci-style addition of the previous two terms, or squares. That checklist takes about eight seconds and covers nearly every numeric progression on a graduate test. Doubling in particular is worth recognising instantly from the sequence 1, 2, 4, 8, 16, 32, 64, because it appears constantly, and confusing 2ⁿ growth with linear growth is exactly the intuition failure that trading firms screen for when they test inductive reasoning.',
      },
      {
        shapes: '◆ ■ ●  |  ■ ● ◆  |  ● ◆ ■  |  ?',
        prompt: 'What comes next?',
        options: ['◆ ■ ●', '● ■ ◆', '■ ◆ ●', '◆ ● ■'],
        answer: '◆ ■ ●',
        explanation: 'Working: each group is the previous one shifted one place left, with the leftmost element wrapping round to the end — ◆■● becomes ■●◆ becomes ●◆■. Three elements means the cycle has period 3, so the fourth group returns to the original arrangement: ◆■●.\n\nWhy the wrong answers tempt: ●■◆ is the original reversed, not shifted — reversal and rotation produce identical results for two elements but diverge for three, which is exactly why the examiner moved from a pair to a triple. ■◆● and ◆●■ are the other permutations of the same three symbols, filling out the option set so that recognising the shapes gets you nowhere. With three items there are six possible orderings and four are offered, so guessing is worth little.\n\nTechnique: identify the period, then use position mod period. Here period 3 means groups 1 and 4 match, as do 2 and 5, and 3 and 6. That reasoning is what makes the expert ●○◐ item in this bank answerable in seconds rather than by laborious tracing, and it generalises to any cyclic structure. Also fix the direction explicitly by tracking ONE element rather than the whole group: follow ◆ alone and you see it move from position 1 to position 3 to position 2 to position 1. Tracking a single element through a permutation is far more reliable under time pressure than trying to hold three simultaneous movements in your head.',
      },
      {
        shapes: 'A1   C2   E3   G4   ?',
        prompt: 'Letters and numbers each follow their own rule. What comes next?',
        options: ['I5', 'H5', 'I6', 'J5'],
        answer: 'I5',
        explanation: 'Two independent progressions: the letters skip one each time (A, C, E, G → I) while the numbers simply count up (1, 2, 3, 4 → 5). Alphanumeric sequences are a cut-e/Aon staple — write the letter positions out as numbers (A=1, C=3, E=5, G=7) if the pattern is not obvious.',
      },
      {
        shapes: '●○○  ○●○  ○○●  ○●○  ?',
        prompt: 'The filled circle moves. What comes next?',
        options: ['●○○', '○●○', '○○●', '●●●'],
        answer: '●○○',
        explanation: 'Working: track the filled circle’s position — 1, 2, 3, then 2. It reached the right-hand end and turned round. Continuing that reversal, the next position is 1: ●○○.\n\nWhy the wrong answers tempt: ○○● assumes the dot wraps around to the start and continues rightward, which is the natural first guess and is wrong only because item 4 already shows the dot moving back. That fourth item is the entire question — without it, wrap and bounce are indistinguishable. ○●○ repeats the current item. ●●● abandons the single-dot structure altogether.\n\nTechnique: a travelling element that hits a boundary can do one of three things — wrap to the other end, bounce back, or stop — and you cannot tell which until the sequence shows you. So find the item immediately after the boundary and read the answer off it. Compare this directly with the five-cell travelling-dot item elsewhere in this bank, where the dot has reached position 4 of 5 and has NOT yet touched the end: there, assuming a bounce is unjustified and the answer is simply position 5. The two items are deliberate mirror images, and together they teach the rule worth carrying in: look for evidence of the boundary behaviour, and if the sequence has not demonstrated one, do not invent it.',
      },
      {
        shapes: '△   □   ⬠   ⬡   ●',
        prompt: 'Which shape does NOT belong with the others?',
        options: ['△', '⬠', '⬡', '●'],
        answer: '●',
        explanation: 'Every other shape is a polygon with straight edges and corners (3, 4, 5 and 6 sides). The circle has no straight edges or vertices at all. Odd-one-out questions test whether you can find the rule the group shares — check edges, corners, symmetry and fill before guessing.',
      },
      {
        shapes: '① ▲  |  ② ▲▲  |  ③ ▲▲▲▲  |  ④ ▲▲▲▲▲▲▲',
        prompt: 'Triangles added each step: +1, +2, +3... How many triangles at step ⑤?',
        options: ['9', '10', '11', '12'],
        answer: '11',
        explanation: 'Working: the counts are 1, 2, 4, 7. First differences: 1, 2, 3 — not constant, so this is not linear. Second differences: 1, 1 — constant, so the sequence is accelerating steadily. The next first difference is 4, giving 7 + 4 = 11.\n\nWhy the wrong answers tempt: 9 applies the most recent difference of 2 (or reads the differences as 1, 2, 2). 10 applies a difference of 3, repeating the last gap instead of increasing it — the most common error, because holding the increment constant feels like continuing the pattern. 12 over-shoots with a difference of 5, which is the answer you get by counting the differences as 1, 2, 3, 4, 5 and taking the wrong one. Note that all four options sit within three of each other, so there is no sense-checking your way out: only the difference table gives the answer.\n\nTechnique: write the differences underneath the sequence, always, and if those are not constant write the differences of the differences. Two rows of subtraction resolve almost every accelerating sequence in about ten seconds. Learn to recognise the classic second-order families by sight too — 1, 3, 6, 10, 15 (triangular), 1, 4, 9, 16 (squares), 2, 6, 12, 20 (n(n+1)) — because spotting one instantly is worth thirty seconds you can spend on a harder item. This particular sequence, 1, 2, 4, 7, 11, is the triangular numbers plus one, and it appears often enough to be worth memorising outright.',
      },
      {
        shapes: '↑  →  ↓  ←  ?',
        prompt: 'The arrow rotates. What comes next?',
        options: ['↑', '→', '↓', '←'],
        answer: '↑',
        explanation: 'Working: the arrow turns 90° clockwise each step — up, right, down, left. Four steps complete a full revolution, so the fifth item returns to up: ↑.\n\nWhy the wrong answers tempt: ← repeats the previous item. → and ↓ are other points in the cycle. As with the half-filled circle item, all four options are the four symbols already on screen, so elimination gives you nothing and you must genuinely track the rotation. What you can do quickly is fix the direction from the first two items alone — up to right is unambiguously clockwise — and then count positions rather than re-reading the whole sequence.\n\nTechnique: rotation items reduce to modular arithmetic once you know the period. Four orientations means period 4, so item 5 matches item 1, item 6 matches item 2, and so on. Where these get harder is when the step is 45° instead of 90°, giving a period of 8 and eight possible symbols, or when rotation is combined with a second attribute such as fill or count — the multi-attribute versions are where marks are actually lost. Build the habit on the easy version: state the direction, state the period, compute the position, then read off the answer. Doing that consistently on simple items is what makes it automatic when an item combines rotation with something else under time pressure.',
      },
      {
        shapes: '▲▲▲▲▲  ▲▲▲▲  ▲▲▲  ▲▲  ?',
        prompt: 'What comes next?',
        options: ['▲▲', '▲', 'Nothing', '▲▲▲'],
        answer: '▲',
        explanation: 'Working: the counts run 5, 4, 3, 2 — a constant difference of −1. The next term is 1 triangle.\n\nWhy the wrong answers tempt: ▲▲ repeats the previous item. ▲▲▲ goes back up. “Nothing” is the genuinely interesting distractor: the sequence is heading towards zero, so why not continue to an empty item? Because it has not reached zero yet — the next term after 2 is 1, not 0. Choosing “nothing” means running the rule one step too far, and examiners include an empty or null option precisely to catch over-extrapolation. If the sequence had shown 5, 4, 3, 2, 1 and asked for the sixth term, the answer would be different and much more debatable.\n\nTechnique: apply the rule exactly once. Under time pressure candidates frequently answer the question one step ahead, especially when the sequence is obviously heading somewhere — you see where it is going and jump to the destination rather than the next stop. A cheap defence is to number the items as you read, so you know precisely which position you are being asked for. This item also pairs with the increasing-triangles question earlier in the bank: the same structure run backwards, and worth noting because inductive tests often present a rule and its inverse in the same paper, on the assumption that recognising a pattern is not the same skill as recognising it reversed.',
      },
      {
        shapes: 'A△  B□  C⬠  D⬡  E?',
        prompt: 'Letters advance and shapes gain sides. What shape pairs with E?',
        options: ['A triangle (3 sides)', 'A hexagon (6 sides)', 'A heptagon (7 sides)', 'A square (4 sides)'],
        answer: 'A heptagon (7 sides)',
        explanation: 'Working: two attributes progress in parallel. The letters advance one at a time (A, B, C, D, E) and the shapes gain one side at a time (3, 4, 5, 6). E is the fifth letter, so it pairs with the fifth shape, which has 7 sides: a heptagon.\n\nWhy the wrong answers tempt: “A hexagon (6 sides)” repeats the shape from D — the copying error, and here it is especially attractive because a hexagon is the last shape you actually saw drawn. “A square (4 sides)” and “A triangle (3 sides)” come from misaligning the two progressions, for instance by pairing the letter’s position with a shape one or two steps back, or from assuming the shapes cycle after the hexagon.\n\nTechnique: when two attributes move together, check whether they are genuinely independent or whether one is a distractor tracking the other. Here they are locked in step, so either one alone gives the answer. Compare with the expert △1 □4 ⬠9 ⬡16 item elsewhere in this bank: there the numbers appear to track the shapes but are actually the SQUARES OF THE POSITION, and the shape progression is deliberate noise designed to make you compute 7² instead of 5². The lesson is to identify what each attribute is a function of — position, or the other attribute — before you extrapolate. Writing the position index above each item (1, 2, 3, 4, 5) takes three seconds and makes that distinction obvious.',
      },
      {
        shapes: '■□■  □■□  ■□■  ?',
        prompt: 'What comes next?',
        options: ['■□■', '□■□', '■■■', '□□□'],
        answer: '□■□',
        explanation: 'Working: each item is the previous one with every cell’s fill flipped — filled becomes empty and empty becomes filled. ■□■ inverts to □■□, which inverts back to ■□■. Item 3 is ■□■, so item 4 is □■□.\n\nWhy the wrong answers tempt: ■□■ repeats the current item. ■■■ and □□□ are the distractors worth thinking about — they represent “everything fills” or “everything empties”, which is a different and perfectly plausible rule for a sequence about fill. What rules them out is that both items shown alternate cell by cell rather than moving towards uniformity; the rule is inversion, not accumulation. Compare the ○○○○ item, where fill genuinely does accumulate one cell at a time towards ●●●●.\n\nTechnique: fill-based sequences use a small and learnable set of rules — inversion (this item), progressive filling (the four-circle item), rotation of the filled region (the half-circle item), and translation of a single filled cell (the travelling-dot items). Run through that list rather than staring at the symbols, and you will usually identify the rule in a couple of seconds. A second useful habit for inversion items specifically is to check the period: any pure inversion has period 2, so odd positions match item 1 and even positions match item 2. That parity check gives the answer without tracing, and it scales to longer sequences where tracing would burn the clock.',
      },
      {
        shapes: '★ 1  |  ★ 1  |  ★★ 2  |  ★★★ 3  |  ★★★★★ 5  |  ? ',
        prompt: 'How many stars come next?',
        options: ['6', '7', '8', '10'],
        answer: '8',
        explanation: 'Working: the counts are 1, 1, 2, 3, 5. Neither the differences nor the ratios are constant, but each term equals the sum of the previous two: 1+1=2, 1+2=3, 2+3=5. Continuing, 3+5=8.\n\nWhy the wrong answers tempt: 6 is 5 + 1, using the wrong pair or reading the differences as though they repeated. 7 is 5 + 2, one term too far back. 10 doubles the last term, applying the geometric rule from the stars item — a good illustration of why you should test rules rather than pattern-match against a question you did the minute before. The three wrong options are all plausible arithmetic on the visible numbers, so the only defence is identifying the actual rule.\n\nTechnique: Fibonacci is the standard third answer when differences and ratios both fail, and its opening — 1, 1, 2, 3, 5, 8, 13, 21, 34 — is worth committing to memory outright, along with the repeated 1 at the start that makes it recognisable at a glance. More broadly, add “is each term a function of the two before it?” to your checklist as step three, after differences and ratios. That covers Fibonacci, Lucas sequences and their variants, and it is the last general-purpose test before you have to start looking for squares, primes or something bespoke. Knowing the order of the checks matters as much as knowing the checks, because time spent hunting exotic rules is time taken from items you could actually finish.',
      },
      {
        shapes: '◢  ◣  ◤  ◥  ?',
        prompt: 'The corner triangle rotates. What comes next?',
        options: ['◢', '◣', '◤', '◥'],
        answer: '◢',
        explanation: 'Working: track where the shaded triangle sits — bottom-right, then bottom-left, then top-left, then top-right. That is a clockwise circuit of the four corners. Four positions means period 4, so the fifth item returns to the start: ◢.\n\nWhy the wrong answers tempt: ◥ repeats the previous item. ◣ and ◤ are earlier points in the cycle. As with the other rotation items, every option is a symbol already on screen, so you have to establish the direction rather than eliminate. The specific difficulty here is that these glyphs are easy to misread at speed — ◢ and ◣ differ only in which side the right angle sits on — and a single misidentification sends the whole rotation the wrong way.\n\nTechnique: for corner-based rotations, name each position aloud in words as you read (bottom-right, bottom-left, top-left, top-right) rather than trying to hold the glyphs visually. Words are far more robust than shapes under time pressure, and they make the direction unambiguous — moving along the bottom from right to left and then up the left side is clockwise, whatever your eye tells you about the symbols. This verbalising habit is worth applying to any item where the symbols are visually similar, including the half-filled circles and the diagonal arrows in this bank. It costs two seconds and eliminates the most expensive error type on the section, which is not failing to see the rule but misreading the sequence you are applying it to.',
      },
      {
        shapes: '△▲  ▲△  ▲▲  △△   |   ○●  ●○  ●●  ?',
        prompt: 'The second group follows the same rule as the first. What completes it?',
        options: ['○○', '●●', '○●', '●○'],
        answer: '○○',
        explanation: 'The completed first group runs: empty+filled, filled+empty (swapped), both filled, both empty. Applying that identical four-step rule to circles, the missing item is both empty: ○○. When a puzzle gives you one complete group and one incomplete group, always decode the complete one first — it is handing you the rule.',
      },
      {
        shapes: '○○○○  ●○○○  ●●○○  ●●●○  ?',
        prompt: 'What comes next?',
        options: ['●●●●', '○○○○', '●●○○', '○●●●'],
        answer: '●●●●',
        explanation: 'Working: count the filled circles — 0, 1, 2, 3 — and note they fill strictly from the left. The next item has 4 filled: ●●●●.\n\nWhy the wrong answers tempt: ●●○○ goes backwards. ○○○○ resets to the start, which would only be right if the pattern cycled, and nothing has yet shown a cycle. ○●●● is the subtle one: it has the right COUNT of filled circles for a different rule — three filled — but also changes the direction of filling, moving the empty cell to the left. It is there to catch candidates who track the count but not the position, and that combination of a plausible count with a broken spatial rule is a standard construction on these papers.\n\nTechnique: when cells fill progressively, verify both the count and the direction on every item, because examiners build distractors that satisfy one and violate the other. More generally this item sits at a boundary, like the quarter-filling circle: the sequence is one step from full, and you must decide whether it completes, reverses or resets. Completion is the default because it requires no extra assumption. Contrast the ■□□□ item later in the bank, where the stem explicitly states the pattern reverses and the answer therefore unwinds to three filled. The rule to carry: extend the demonstrated behaviour, and change behaviour only when the sequence or the stem tells you to.',
      },
      {
        shapes: '○△   ●△   ○□   ●□   ○⬠   ?',
        prompt: 'Two things change independently here. What comes next?',
        options: ['●⬠', '○⬠', '●⬡', '○△'],
        answer: '●⬠',
        explanation: 'Track the two attributes separately: the fill alternates every step (empty, filled, empty, filled…), while the shape advances every two steps (triangle, square, pentagon). Position 6 is a filled pentagon: ●⬠. Multi-attribute questions are where most candidates lose marks — always isolate one attribute at a time.',
      },
      {
        shapes: '◇  ◈  ◆  ◈  ◇  ◈  ?',
        prompt: 'What comes next?',
        options: ['◇', '◈', '◆', 'None of these'],
        answer: '◆',
        explanation: 'Working: the states run outline, half, solid, half, outline, half — a ping-pong between three states with the middle state visited on every other step. The full cycle ◇ ◈ ◆ ◈ has period 4, so item 7 matches item 3: ◆.\n\nWhy the wrong answers tempt: ◈ repeats the current item and is also what you would answer if you thought the sequence alternated between just two states. ◇ is what you get by assuming a period of 3 (◇ ◈ ◆ repeating), which fits the first three items perfectly and only breaks at item 4 — this is the heart of the question, since a rule that explains the opening but not the whole sequence is the classic inductive-reasoning trap. “None of these” is offered for candidates who cannot make any rule fit and panic; on graduate tests that option is almost never correct, and choosing it should be a last resort rather than a hedge.\n\nTechnique: always test a candidate rule against EVERY item, not just the first few. The cheapest way to do that here is to count the period rather than describe the motion: write the position numbers 1 to 6 under the symbols, notice the sequence repeats every 4, then compute 7 mod 4 = 3 and read off item 3. Bounce patterns have a period of 2(n−1) for n states — three states give a period of 4, four states give 6 — which is worth knowing because it lets you jump far ahead in a sequence without tracing, and examiners set these items at positions deliberately too distant to trace comfortably.',
      },
      {
        shapes: '3+4=7  |  5+2=7  |  6+1=7  |  2+?=7',
        prompt: 'What number completes the pattern?',
        options: ['3', '4', '5', '9'],
        answer: '5',
        explanation: 'Working: check each complete pair — 3+4, 5+2, 6+1 — and every one totals 7. The rule is a fixed sum, not a progression, so the missing value is 7 − 2 = 5.\n\nWhy the wrong answers tempt: 3 comes from continuing the left-hand numbers as a sequence (3, 5, 6, 2) or from pairing 2 with the next number down. 4 repeats a value already used on the right-hand side. 9 adds instead of subtracting, treating the 7 as something to build on rather than a total — the answer you get from reading the equals sign as the start of an operation. The presence of 9 is a hint in itself: it is only reachable by ignoring the equation structure entirely.\n\nTechnique: not every inductive item is a sequence. Some encode a constant relationship that holds independently within each group — a fixed sum here, a squaring relationship in the 5△ 25□ item, a shared shape rule in the △△▲ item. When items are separated by bars and each is self-contained, look for the invariant rather than the progression, and test it on every group before using it. The diagnostic question is simply whether the groups depend on each other: if scrambling their order would change nothing, you are looking at an invariant, and the numbers running down the left are decoration rather than a sequence.',
      },
      {
        shapes: '⬡⬡⬡  |  ⬡⬡●  |  ⬡●●  |  ?',
        prompt: 'What comes next?',
        options: ['●●●', '⬡⬡⬡', '⬡●●', '●⬡⬡'],
        answer: '●●●',
        explanation: 'Working: count the converted cells — 0, then 1, then 2, always converting from the right-hand end inward. The next item has all three converted: ●●●.\n\nWhy the wrong answers tempt: ⬡●● repeats the current item. ⬡⬡⬡ resets to the start. ●⬡⬡ is the pointed distractor: it has one filled cell, so it satisfies neither the count nor the direction, but it looks like a plausible “continuation” to anyone reading the sequence as a single travelling dot rather than an accumulating fill. Distinguishing accumulation from translation is exactly what the option is testing, and it is the same distinction that separates this item from the travelling-dot questions elsewhere in the bank.\n\nTechnique: with only three cells the sequence exhausts itself quickly, which is a useful clue in its own right — when a pattern is one step from completion, the completed state is nearly always the answer, because the alternatives (reset or reverse) require assuming behaviour the sequence has not shown. Note also how short this item is: three visible terms is the minimum from which a rule can be induced, and examiners use short sequences to test whether you can commit to the simplest rule that fits rather than hunting for something more elaborate. The principle worth carrying is parsimony — when several rules fit the visible items, choose the simplest, because that is the one the test was built around.',
      },
      {
        shapes: '↖  ↗  ↘  ↙  ?',
        prompt: 'The diagonal arrow rotates. What comes next?',
        options: ['↖', '↗', '↘', '↙'],
        answer: '↖',
        explanation: 'Working: the arrow points up-left, up-right, down-right, down-left — each step a 90° clockwise turn, just displaced 45° from the cardinal directions. Four steps complete the circuit, so the fifth returns to the start: ↖.\n\nWhy the wrong answers tempt: ↙ repeats the previous item, and ↗ and ↘ are other points in the same cycle. The real difficulty is visual rather than logical — diagonal arrows are harder to read at a glance than cardinal ones, and under a 45-second clock candidates misidentify one symbol and derive the wrong direction from a correct method. Note also that this item is the diagonal twin of the ↑→↓← question earlier in the bank, and examiners include such pairs to check that you have learned the underlying rotation rule rather than memorised a particular symbol sequence.\n\nTechnique: convert symbols to words or numbers before reasoning. Label the diagonals 1 to 4 clockwise from up-left and the sequence becomes 1, 2, 3, 4, ? — trivially 1 again. This numbering trick generalises to any rotational item and removes the visual-confusion risk entirely, which matters because on these tests the expensive errors are misreadings rather than misreasonings. If a test lets you make notes, writing the position numbers under the symbols is almost always worth the few seconds it costs, particularly on items combining rotation with a second changing attribute where holding everything visually becomes genuinely difficult.',
      },
      {
        shapes: '1 shape  |  3 shapes  |  6 shapes  |  10 shapes  |  ? shapes',
        prompt: 'This is the triangular number sequence. How many shapes come next?',
        options: ['13', '14', '15', '16'],
        answer: '15',
        explanation: 'Working: the counts are 1, 3, 6, 10. First differences: 2, 3, 4 — rising by one each time. The next difference is 5, giving 10 + 5 = 15. These are the triangular numbers, n(n+1)/2, so the fifth term is 5 × 6 ÷ 2 = 15.\n\nWhy the wrong answers tempt: 13 applies a difference of 3, repeating an earlier gap. 14 applies 4, repeating the most recent gap — the standard error of holding the increment constant when it is itself increasing, and the most popular wrong answer on any accelerating sequence. 16 applies 6, over-shooting by taking the difference one step too far ahead. All four options lie within three of each other, so there is no sense-check available; only the difference row settles it.\n\nTechnique: learn the triangular numbers by sight — 1, 3, 6, 10, 15, 21, 28, 36, 45, 55 — because they turn up constantly in inductive tests, in probability questions about handshakes and pairings, and in the classic “how many connections between n people” brainteaser that trading and consulting interviewers still ask. The formula n(n+1)/2 is worth knowing alongside the list, since it lets you jump to the tenth or twentieth term without building the whole sequence. Note the relationship to the 1, 2, 4, 7, 11 item in this bank: that is the triangular sequence shifted by one, which is why the same two-row difference method cracks both.',
      },
      {
        shapes: '■▲  ▲■  ■▲  ▲■  ■▲  ?',
        prompt: 'What comes next?',
        options: ['■▲', '▲■', '■■', '▲▲'],
        answer: '▲■',
        explanation: 'Working: the pair alternates between ■▲ and ▲■ every step. Odd positions are ■▲ and even positions are ▲■. Item 5 is ■▲, confirming the parity, so item 6 is ▲■.\n\nWhy the wrong answers tempt: ■▲ repeats the current item, which here is a particularly easy mistake because five near-identical groups make it genuinely hard to keep your place — that is precisely why the examiner used five rather than three. ■■ and ▲▲ break the composition of the pair, which never changes; only the order does.\n\nTechnique: for any two-state alternation, answer by parity rather than by tracing. Establish which state sits on odd positions, count the position you are asked for, and read the answer off — no re-reading required, and no risk of losing your place however long the sequence runs. That approach scales directly to the harder cyclic items in this bank: a three-state cycle is answered by position mod 3, a four-state rotation by position mod 4, and a bounce between three states by position mod 4 as well. Notice too the deliberate design here — a trivial rule stretched over five items to test bookkeeping rather than insight. Recognising when an item is testing care rather than cleverness tells you where to spend your attention, which under a strict per-question clock is most of the skill.',
      },
      {
        shapes: '5△ 25□  |  4△ 16□  |  3△ 9□  |  2△ ?□',
        prompt: 'The square count relates to the triangle count. What replaces the ?',
        options: ['4', '6', '8', '2'],
        answer: '4',
        explanation: 'Working: compare the two numbers within each group rather than across groups. 5 and 25, 4 and 16, 3 and 9 — the square count is always the triangle count squared. So 2 gives 2² = 4.\n\nWhy the wrong answers tempt: 6 comes from continuing the square counts as their own sequence (25, 16, 9, then subtracting 3 or following the differences 9, 7, 5 to reach 4... and mis-landing) or from doubling and adding. 8 is 2 × 4, taking a doubling relationship from the earlier stars item. 2 simply repeats the triangle count, treating the relationship as identity — the answer you give if you notice the two numbers are linked but never establish how. Every distractor represents a different plausible relationship, which is the point: identifying that a relationship exists is easy, and specifying it is the actual test.\n\nTechnique: within-group relationships are read vertically, not horizontally. The diagnostic is whether the groups depend on each other — here they do not, since each group is self-contained and scrambling their order would change nothing, exactly as with the fixed-sum 3+4=7 item. When you spot an invariant, verify it on every group before applying it, because a rule that fits two groups and fails the third is the standard trap. It is also worth noting the falling triangle counts (5, 4, 3, 2) are decoration: they give the groups a plausible order and tempt you into reading a sequence where there is only a rule.',
      },
      {
        shapes: '●○○○○   ○●○○○   ○○●○○   ○○○●○   ?',
        prompt: 'The filled circle travels. What comes next?',
        options: ['○○○○●', '●○○○○', '○○●○○', '○○○●○'],
        answer: '○○○○●',
        explanation: 'The filled position moves one step right each time (1, 2, 3, 4 → 5) and has not yet reached the end, so there is no bounce or wrap yet. Do not assume a pattern reverses until the sequence actually shows it hitting a boundary.',
      },
      {
        shapes: '△   △△   △   △△△   △   △△△△   ?',
        prompt: 'Two alternating sequences are interleaved here. What comes next?',
        options: ['△', '△△△△△', '△△△△', '△△'],
        answer: '△',
        explanation: 'Read every other item. The odd positions are constant at one triangle; the even positions grow 2, 3, 4. Position 7 is odd, so it is a single triangle. Interleaved sequences look chaotic until you split them into two separate lists — always try this when a sequence seems to jump around.',
      },
      {
        shapes: '◐◑   ◑◐   ◒◓   ◓◒   ◔◕   ?',
        prompt: 'What comes next?',
        options: ['◕◔', '◔◕', '◐◑', '◑◐'],
        answer: '◕◔',
        explanation: 'The items come in pairs: each pair shows a symbol combination and then the same combination reversed. ◔◕ has appeared, so its reversal ◕◔ follows. Spotting the grouping (pairs, triples) before hunting for a rule saves time on harder items.',
      },
      {
        shapes: '■□□□   ■■□□   ■■■□   ■■■■   ?',
        prompt: 'The sequence has reached full. What comes next if the pattern reverses?',
        options: ['■■■□', '■■■■', '□□□□', '■□□□'],
        answer: '■■■□',
        explanation: 'The fill grew 1, 2, 3, 4 and has hit the maximum, so a reversing pattern unwinds symmetrically: the next item drops back to 3 filled. Boundary questions test whether you notice a sequence physically cannot continue in the same direction.',
      },
      {
        shapes: '△□  □⬠  ⬠⬡  ⬡?',
        prompt: 'Each item overlaps with the next. What completes the final pair?',
        options: ['A heptagon (7 sides)', 'A triangle', 'A square', 'A pentagon'],
        answer: 'A heptagon (7 sides)',
        explanation: 'Each pair starts with the shape that ended the previous pair, and the second shape always gains one side: triangle(3)→square(4)→pentagon(5)→hexagon(6)→heptagon(7). Chain-overlap patterns are common — check whether consecutive groups share an element before treating them as independent.',
      },
      {
        difficulty: 'expert',
        shapes: '△1   □4   ⬠9   ⬡16   ?',
        prompt: 'The numbers relate to the shapes. What number accompanies a heptagon (7 sides)?',
        options: ['25', '36', '49', '21'],
        answer: '25',
        explanation: 'Do not match the number to the side count directly — the numbers are 1, 4, 9, 16, which are the squares of 1, 2, 3, 4 (the position in the sequence, not the sides). Position 5 gives 5² = 25. The shape gaining a side each step is a deliberate distractor running in parallel. When two attributes both progress, check whether the number tracks POSITION rather than the other attribute.',
      },
      {
        difficulty: 'expert',
        shapes: '●○◐   ○◐●   ◐●○   ●○◐   ○◐●   ?',
        prompt: 'What comes next?',
        options: ['◐●○', '●○◐', '○◐●', '◐○●'],
        answer: '◐●○',
        explanation: 'The triple rotates one position left each step, cycling with period 3: positions 1, 4 are ●○◐; positions 2, 5 are ○◐●; positions 3, 6 are ◐●○. Position 6 is therefore ◐●○. With cyclic patterns, find the period first (here 3) then use position mod period — far more reliable than tracing every step under time pressure.',
      },
      {
        difficulty: 'expert',
        shapes: '2△   6□   12⬠   20⬡   ?',
        prompt: 'What number comes next in the sequence?',
        options: ['30', '28', '32', '25'],
        answer: '30',
        explanation: 'Differences are 4, 6, 8 — increasing by 2, so the next difference is 10: 20 + 10 = 30. Equivalently these are n(n+1): 1×2, 2×3, 3×4, 4×5, 5×6 = 30. Second-order sequences are invisible until you write the differences underneath — always do that before guessing.',
      },
    ],
  },
  {
    id: 'sjt',
    title: 'Situational Judgement',
    icon: '🤔',
    color: 'text-orange-400',
    border: 'border-orange-500/30',
    description: 'Workplace scenarios — choose the MOST effective response. Tests judgement, integrity and professionalism.',
    secondsPerQuestion: 90,
    questionsPerAttempt: 8,
    tip: 'Firms score against their values: integrity first, escalate appropriately, communicate early, never hide mistakes, and don\'t throw colleagues under the bus. Pick what a calm professional would actually do.',
    providers: 'Cappfinity (strengths-based), HireVue (video + SJT hybrid), firm-custom assessments (e.g. JPMorgan\'s "insight" games, HSBC job simulations), SHL SJQ',
    requiredBy: 'Virtually every graduate scheme — banks, Big 4, consulting, insurers. Often combined with a recorded video interview in the same sitting.',
    whyUsed: 'Firms lose money and reputation when juniors show poor judgement — hiding errors, breaching confidentiality, mishandling clients. SJTs cheaply screen thousands of applicants for alignment with the firm\'s stated values before assessment centres.',
    questions: [
      {
        context: 'You\'re an intern and you notice a significant error in a spreadsheet your manager already sent to a client.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Say nothing — it\'s your manager\'s responsibility now',
          'Tell your manager immediately and suggest a corrected version',
          'Email the client directly with a correction',
          'Fix it quietly in the file for next time',
        ],
        answer: 'Tell your manager immediately and suggest a corrected version',
        explanation: 'Why this is best: your manager owns the client relationship and needs to control what the client hears and when. Telling them immediately, with a corrected version ready, lets them decide how to handle the client conversation while showing you can spot errors and fix them, not just flag problems.\n\nWhy the others fail: saying nothing leaves a client acting on wrong numbers, and if it surfaces later you knew and stayed silent — far worse than the original error. Emailing the client directly bypasses your manager entirely, which undermines their relationship and may contradict something they have already told the client verbally. Fixing it quietly in the file helps nobody, since the flawed version is already in the client\'s hands.\n\nThe underlying principle: as an intern or junior, you are rarely the right person to manage a client relationship, but you are always the right person to surface a problem fast. "Escalate immediately, propose a fix" beats both silent concealment and unauthorised direct action in almost every SJT scenario — the two failure modes firms screen hardest for are hiding mistakes and freelancing outside your authority.',
      },
      {
        context: 'You have three urgent tasks from three different senior people, and you cannot finish all of them today.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Work through the night without telling anyone',
          'Do them in the order they were received',
          'Quickly clarify deadlines and priorities with the requesters, then flag the conflict',
          'Choose the task from the most senior person and ignore the others',
        ],
        answer: 'Quickly clarify deadlines and priorities with the requesters, then flag the conflict',
        explanation: 'Why this is best: the three seniors almost certainly don\'t know about each other\'s requests, so you are the only person who can see the conflict. Surfacing it quickly, after first checking real deadlines and priority, lets them resolve it between themselves in seconds — something they can do easily but you cannot.\n\nWhy the others fail: working through the night without telling anyone is "silent heroics" — it might work once, but it is unsustainable, invisible to the people who need to know, and fails badly the moment you cannot pull it off. Doing tasks in the order received ignores that urgency and importance are not the same as arrival time. Picking the most senior person\'s task and ignoring the others assumes seniority always trumps urgency, which is often false — a mid-level manager\'s client-facing deadline may matter more than a director\'s internal request.\n\nThe underlying principle: juniors are almost never expected to silently absorb conflicting demands. Firms would much rather you surface a scheduling conflict in thirty seconds than burn out solving it invisibly or guess wrong about priority. "Flag and let seniors decide" is the answer whenever a conflict exists that you don\'t have the authority or visibility to resolve alone.',
      },
      {
        context: 'A colleague tells you confidential information about an upcoming deal that you are not part of, and suggests you could "make some money" trading the stock.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Trade a small amount so it isn\'t noticeable',
          'Decline, and report the conversation to compliance',
          'Decline but keep the conversation to yourself',
          'Ask a friend outside the firm to trade instead',
        ],
        answer: 'Decline, and report the conversation to compliance',
        explanation: 'Why this is best: declining alone is not enough, because staying silent about a colleague soliciting insider dealing makes you a witness who said nothing — a position that looks very bad in any subsequent investigation and may itself breach your regulatory obligations. Reporting to compliance protects you, protects the firm, and stops your colleague before real harm is done.\n\nWhy the others fail: trading a small amount is still insider dealing, a criminal offence in essentially every jurisdiction, regardless of size — "small" is not a legal defence. Declining but staying silent leaves the colleague free to approach someone else, or to act themselves, while you carry undisclosed knowledge of a crime. Asking a friend outside the firm to trade is a second, distinct offence (tipping) layered on top of the first.\n\nThe underlying principle: SJTs use insider dealing scenarios specifically because they have a uniquely unambiguous right answer — unlike most workplace judgement calls, this one has a clear legal line, and any option that stops short of reporting to compliance is wrong regardless of how reasonable it sounds. Recognise these "bright line" scenarios (market abuse, fraud, conflicts of interest, confidentiality breaches) and answer them as legal questions, not judgement calls.',
      },
      {
        context: 'You realise you made a mistake in your own analysis two days ago. Nobody has noticed, and the presentation using it is tomorrow.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Tell your manager now, with the corrected numbers and impact',
          'Hope nobody notices — it may not matter',
          'Correct it silently and say nothing',
          'Mention it casually after the presentation',
        ],
        answer: 'Tell your manager now, with the corrected numbers and impact',
        explanation: 'Why this is best: telling your manager now, with the corrected numbers and the impact already worked out, gives them everything they need to decide how to handle tomorrow\'s presentation — reprint slides, caveat verbally, or push the meeting. Doing this before the deadline, rather than after, is what separates a manageable correction from a crisis.\n\nWhy the others fail: hoping nobody notices is a bet you don\'t control, and if a client or senior does spot it, your manager is blindsided in the room with no time to react. Correcting it silently might fix the number but leaves your manager unable to explain the change if anyone asks why the figures moved, and it deprives them of the chance to decide whether the fix even needs mentioning. Mentioning it casually after the presentation means it was presented wrong knowingly by you, which is a much bigger problem than the original error.\n\nThe underlying principle: the value of surfacing a mistake decays fast with time, and it decays completely the moment the flawed work is used publicly. "Tell me now, with a fix" is what every manager wants to hear, and firms explicitly train assessors to reward candidates who own errors proactively rather than ones who never seem to make any — nobody believes the second type, and everybody distrusts the ones who hide them.',
      },
      {
        context: 'A client asks you a technical question in a meeting and you don\'t know the answer.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Give your best guess confidently',
          'Say you\'ll confirm the detail and follow up today — then do it',
          'Change the subject',
          'Refer them to your competitor',
        ],
        answer: 'Say you\'ll confirm the detail and follow up today — then do it',
        explanation: 'Why this is best: admitting you don\'t know a specific detail, while committing to a same-day follow-up, protects your credibility far more than a guess would — and clients respect precision over false confidence, especially on technical points where a wrong answer could cause real harm if acted on.\n\nWhy the others fail: a confident guess risks giving materially wrong information that the client might act on, and if it\'s later found to be incorrect, it damages trust in everything else you\'ve told them, not just that one answer. Changing the subject is transparently evasive and clients notice immediately — it reads as either incompetence or dishonesty. Referring them to a competitor actively loses the firm business over a single unanswered question, which is a wildly disproportionate response.\n\nThe underlying principle: the promise "I\'ll confirm and come back to you" is only a good answer if you actually do it — the follow-through is the real test, not the deflection itself. In client-facing SJTs, examiners are checking whether you understand that credibility is built cumulatively across many small interactions, and that one honest "I don\'t know, but I\'ll find out" costs you nothing while one confident wrong answer can cost the relationship.',
      },
      {
        context: 'Your team is celebrating a deal, but you notice a junior colleague has been excluded and looks upset — they did significant work on it.',
        prompt: 'What is the MOST effective response?',
        options: [
          'It\'s not your problem — enjoy the celebration',
          'Publicly criticise the team lead for excluding them',
          'Invite them along and make a point of crediting their work to the team',
          'Privately tell them office politics are just like that',
        ],
        answer: 'Invite them along and make a point of crediting their work to the team',
        explanation: 'Why this is best: inviting the colleague along and crediting their work fixes the actual problem — their exclusion and the loss of recognition — without creating a confrontation that could embarrass the team lead or escalate an already awkward moment. It\'s a concrete, low-risk action that directly addresses both issues at once.\n\nWhy the others fail: treating it as not your problem is passive in a situation where a small, costless action would clearly help — SJTs consistently penalise bystander responses to visible unfairness. Publicly criticising the team lead turns a fixable oversight into a confrontation, likely embarrassing the excluded colleague further and damaging your relationship with the lead over what may have been a simple mistake, not malice. Privately telling them "office politics are just like that" normalises exclusion and offers no actual support.\n\nThe underlying principle: when you witness a minor injustice you have the standing to fix directly, the best response is usually the smallest action that actually solves it — not escalation, and not passivity. Reserve confrontation and escalation for situations where a quiet fix genuinely isn\'t available, which this one is.',
      },
      {
        context: 'It\'s 7pm, your work is done, but the rest of your team is staying late on a deadline that doesn\'t involve you.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Leave quietly — it\'s not your project',
          'Ask the team if you can help with anything before deciding',
          'Stay and look busy so you\'re seen at your desk',
          'Announce loudly that you\'ve finished everything',
        ],
        answer: 'Ask the team if you can help with anything before deciding',
        explanation: 'Why this is best: asking whether you can help shows genuine team spirit and gives the team the option to use your time productively if they need it — and if they say no, you have a clean, low-guilt reason to leave, because you offered.\n\nWhy the others fail: leaving quietly without asking can look indifferent to a team under pressure, even though it\'s honestly not your project — the cost of a thirty-second check-in is far lower than the risk of appearing unsupportive. Staying and looking busy ("presenteeism") is widely recognised as counterproductive: it wastes your evening, fools nobody who\'s actually paying attention, and signals that you value visibility over genuine usefulness. Announcing loudly that you\'ve finished draws attention to your own productivity at a moment when colleagues are stressed, which reads as tone-deaf rather than helpful.\n\nThe underlying principle: presenteeism — staying late purely to be seen, without adding value — is explicitly called out as a red flag by many firms\' graduate assessors, because it signals a culture problem (juniors afraid to leave) rather than genuine commitment. The behaviour that actually reads well is offering real help and then leaving guilt-free once you\'ve made the offer, whichever way it\'s answered.',
      },
      {
        context: 'A senior colleague repeatedly takes sole credit for analysis you produced. It\'s now affecting how others perceive your contribution.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Raise it directly but professionally with the colleague first',
          'Complain about them to other team members',
          'Stop producing good work for them',
          'Immediately escalate to HR',
        ],
        answer: 'Raise it directly but professionally with the colleague first',
        explanation: 'Why this is best: raising it directly and professionally gives the colleague a chance to correct the behaviour — possibly unintentional, possibly a shorthand from a rushed meeting — before you escalate. It\'s the lowest-conflict route that could resolve the issue in a single conversation, and firms note that candidates who default to escalation without trying the direct route first are seen as unable to handle interpersonal friction themselves.\n\nWhy the others fail: complaining to other team members turns a solvable one-on-one issue into office politics, damages your reputation as someone who gossips, and does nothing to actually fix the credit problem. Withholding good work as a passive protest punishes the team and the client, not just the colleague, and is easily read as unprofessional sulking if it\'s ever noticed. Escalating immediately to HR is disproportionate for a first occurrence and burns a relationship that a five-minute conversation might have fixed — HR routes are for patterns that persist after direct and management-level attempts, not a first resort.\n\nThe underlying principle: workplace conflict resolution has a standard escalation ladder — direct conversation, then your manager, then HR — and skipping straight to the top rung (or never leaving the bottom rung when it isn\'t working) both score poorly. Match your response to how many times the problem has actually occurred.',
      },
      {
        context: 'A long-standing client asks you to process a request that slightly bends firm policy, saying "we always did it this way with your predecessor".',
        prompt: 'What is the MOST effective response?',
        options: [
          'Process it — client relationships come first',
          'Politely explain you need to check the policy, then confirm the compliant route with your manager',
          'Refuse bluntly and end the call',
          'Process it but keep no record',
        ],
        answer: 'Politely explain you need to check the policy, then confirm the compliant route with your manager',
        explanation: 'Why this is best: pausing to check policy and confirming the compliant route with your manager protects both the client relationship and the firm — you\'re not refusing the client outright, you\'re finding the correct way to help them, which is usually possible even when the exact shortcut they\'re asking for isn\'t.\n\nWhy the others fail: processing it immediately because "client relationships come first" ignores that policies exist for reasons (often regulatory) that a relationship, however valuable, doesn\'t override — and "my predecessor did it" is not a defence if the request breaches a rule. Refusing bluntly and ending the call is needlessly damaging to a long-standing relationship when a compliant alternative might well exist. Processing it while keeping no record compounds the original policy issue with a second, worse one — concealment — which turns a grey-area request into a clear breach.\n\nThe underlying principle: "the client wants it" and "a predecessor did it this way" are both social pressure, not policy authority, and SJTs use this framing constantly because junior staff are the ones most exposed to it in practice. The professional response to social pressure that conflicts with policy is always to pause and verify through the proper channel — never to bend the rule quietly to keep someone happy, and never to end the relationship over a request that might have a compliant version.',
      },
      {
        context: 'You are falling seriously behind on a project and realise you won\'t hit Friday\'s deadline.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Tell your manager now, with a realistic revised plan and what you need',
          'Say nothing and hope to catch up over the weekend',
          'Deliver something half-finished on Friday without comment',
          'Blame the workload publicly in the team meeting',
        ],
        answer: 'Tell your manager now, with a realistic revised plan and what you need',
        explanation: 'Why this is best: flagging it now, with a realistic revised plan and a specific ask (more time, extra help, reduced scope), gives your manager options while there is still time to use them — they might reallocate resources, negotiate the deadline, or decide the current scope was unrealistic from the start.\n\nWhy the others fail: hoping to catch up over the weekend is a bet with no fallback if it doesn\'t work — you\'ll arrive at Friday in exactly the same position, just later and with less credibility. Delivering something half-finished without comment lets your manager discover the problem at the worst possible moment, with zero time to react, and looks like either poor judgement or an attempt to hide the shortfall. Blaming the workload publicly in a team meeting is defensive and unprofessional — it may even be true, but the venue and framing make it look like an excuse rather than a solution.\n\nThe underlying principle: this is the single most-tested scenario type in junior SJTs, because "surprise failure on deadline day" is the exact outcome every manager fears most from a junior hire. The earlier you flag a slipping deadline, the more options exist to fix it — flagging on day one of a two-week project is a non-event, flagging at 5pm the day before is a crisis. Speed of disclosure is the single biggest driver of how this type of scenario is scored.',
      },
      {
        context: 'A teammate has become withdrawn, is missing small deadlines, and mentioned they\'re "not sleeping much". Your team lead hasn\'t noticed.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Check in with them privately and genuinely, and encourage them to seek support',
          'Report their missed deadlines to the team lead immediately',
          'Ignore it — everyone has rough patches',
          'Tell the whole team to give them space',
        ],
        answer: 'Check in with them privately and genuinely, and encourage them to seek support',
        explanation: 'Why this is best: a private, genuine check-in treats a colleague as a person first, not a performance problem — and "not sleeping much" alongside withdrawal and missed deadlines is a pattern worth taking seriously as a wellbeing concern, which a caring conversation addresses directly.\n\nWhy the others fail: reporting their missed deadlines to the team lead immediately, without speaking to the colleague first, frames a possible wellbeing issue as a performance issue and could feel like being reported on behind their back — damaging trust exactly when they may need support most. Ignoring it as "everyone has rough patches" dismisses signs (sleep, withdrawal, missed deadlines together) that, taken together, are more than a normal bad week. Telling the whole team to give them space is well-intentioned but passive and public — it signals the issue to everyone without anyone actually reaching out, which can deepen isolation rather than relieve it.\n\nThe underlying principle: SJTs increasingly test wellbeing awareness alongside pure work-process judgement, reflecting genuine industry concern about burnout in junior roles. The pattern firms reward is direct, private, human concern first, with escalation reserved for cases where the person needs more support than a colleague can provide or where the work risk becomes serious — never surveillance, gossip, or public performance management as a first move.',
      },
      {
        context: 'You believe your manager\'s chosen approach to a client analysis contains a methodological flaw.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Raise it privately with your manager, explaining your reasoning and proposing an alternative',
          'Say nothing — they outrank you',
          'Use your own approach secretly instead',
          'Point out the flaw in front of the client',
        ],
        answer: 'Raise it privately with your manager, explaining your reasoning and proposing an alternative',
        explanation: 'Why this is best: raising the concern privately, with your reasoning and a proposed alternative, respects the hierarchy while still surfacing a genuine risk — this is precisely what McKinsey\'s well-known "obligation to dissent" principle describes: junior staff are expected to voice disagreement through proper channels, not suppress it out of deference.\n\nWhy the others fail: saying nothing because "they outrank you" risks a flawed analysis reaching the client, and if the flaw is later discovered, "I noticed but didn\'t say anything" is a far worse position than having raised it and been overruled. Secretly using your own approach instead is a serious breach of trust — you\'re not empowered to unilaterally override your manager\'s methodology, and if it\'s discovered, it looks like insubordination regardless of whether you were right. Pointing out the flaw in front of the client is the worst option of all: it embarrasses your manager publicly, undermines the firm\'s credibility in the room, and there was no need to do it there rather than beforehand.\n\nThe underlying principle: the distinction the question is testing is channel, not content — raising a genuine concern is always encouraged, but WHERE and HOW you raise it is what separates constructive dissent from either cowardice (staying silent) or insubordination (acting unilaterally or publicly). Private, reasoned, solution-oriented challenge is the answer to almost every "I disagree with someone senior" scenario.',
      },
      {
        context: 'At a networking event, a senior director from another division gives you their card and says "email me". A week later you still haven\'t.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Email now with a brief, specific message referencing your conversation',
          'Don\'t bother — the moment has passed',
          'Wait until you need a favour from them',
          'Add them on every social platform simultaneously',
        ],
        answer: 'Email now with a brief, specific message referencing your conversation',
        explanation: 'Why this is best: emailing now, briefly and specifically referencing your actual conversation, is far better than not following up at all — a week\'s delay is a minor lapse, easily excused with a one-line acknowledgement, and the relationship value doesn\'t expire on a strict deadline.\n\nWhy the others fail: deciding the moment has passed guarantees you get nothing from an opportunity that cost you nothing to pursue further — a week is a normal, forgivable gap in a busy person\'s inbox, not a closed door. Waiting until you need a favour makes the eventual email transparently transactional, and senior people notice when the first contact in months arrives attached to a request — it reads as using the relationship rather than building it. Adding them on every social platform simultaneously is overfamiliar and slightly alarming on a first follow-up; it signals enthusiasm has tipped into a lack of judgement about professional boundaries.\n\nThe underlying principle: good networking is built on low-pressure, specific, well-timed contact — not on perfect timing, and not on multi-channel intensity. A short email that references something specific from the actual conversation (not a generic "great to meet you") shows you were genuinely listening, which matters far more than whether it arrived in 24 hours or seven days.',
      },
      {
        context: 'Mid-project, you spot a news report that your client is under regulatory investigation — nobody on your team has mentioned it.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Flag it to your project lead immediately',
          'Assume someone senior already knows',
          'Post about it in the team group chat with speculation',
          'Contact the client directly to ask about it',
        ],
        answer: 'Flag it to your project lead immediately',
        explanation: 'Why this is best: flagging it to your project lead immediately ensures material information reaches the person best placed to judge its relevance and decide next steps — and doing it fast, before speculating or acting on it yourself, is exactly the right balance of urgency and restraint.\n\nWhy the others fail: assuming someone senior already knows is a dangerous default — it is precisely how firms get blindsided by information that everyone assumed someone else had seen, and "I assumed you knew" is never an acceptable explanation after the fact. Posting it in the team group chat with speculation spreads unverified, sensitive information informally and invites uninformed commentary that could leak or distort the picture before anyone senior has assessed it properly. Contacting the client directly to ask about it is well beyond a junior\'s authority — it could be seen as improper, could damage the relationship, and pre-empts decisions that should be made by people who understand the full context of the engagement.\n\nThe underlying principle: information about material risk to a client relationship should travel up, fast, through the proper channel, and nowhere else — not sideways into a group chat, not outward to the client, and never assumed to already be known. This is one of the clearest "escalate, don\'t freelance" scenarios in the whole SJT category.',
      },
      {
        context: 'You\'re asked in an interview about a weakness. You genuinely struggle with public speaking, but worry admitting it will cost you the offer.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Claim you have no real weaknesses',
          'Describe a fake, trivial weakness like "I work too hard"',
          'Honestly name the weakness and describe concrete steps you\'re taking to improve it',
          'Deflect by criticising a past employer instead',
        ],
        answer: 'Honestly name the weakness and describe concrete steps you\'re taking to improve it',
        explanation: 'Why this is best: naming a real weakness alongside concrete steps you\'re taking to address it demonstrates exactly the self-awareness and growth mindset the question is designed to surface — interviewers aren\'t looking for perfection, they\'re checking whether you can honestly assess yourself and act on it.\n\nWhy the others fail: claiming to have no real weaknesses is transparently evasive and reads as either a lack of self-awareness or an unwillingness to engage honestly with the question — experienced interviewers have heard it hundreds of times and it actively counts against you. The fake trivial weakness ("I work too hard") is such a well-known dodge that it has become a cliché interviewers specifically screen out; using it signals you either haven\'t prepared thoughtfully or are trying to game the question rather than answer it. Deflecting by criticising a past employer is a red flag regardless of the question — it suggests you might speak about THIS firm the same way one day, and it dodges the self-reflection the question is actually asking for.\n\nThe underlying principle: "tell me a weakness" questions are never really about the weakness itself — they\'re testing whether you can be honestly self-critical under mild social pressure, a skill directly relevant to giving and receiving feedback on the job. The winning formula is always: real weakness, brief and non-catastrophic, plus a specific, ongoing action you\'re taking about it — for public speaking that might be "I\'ve been taking every opportunity to present at team meetings and got structured feedback on my last two."',
      },
      {
        context: 'You accidentally cc\'d an external client on an internal email discussing a sensitive negotiating position.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Say nothing and hope they don\'t read it',
          'Immediately tell your manager and discuss how to handle it with the client',
          'Send a follow-up asking the client to delete the email, without telling your manager',
          'Blame the email system'],
        answer: 'Immediately tell your manager and discuss how to handle it with the client',
        explanation: 'Why this is best: telling your manager immediately gives them the chance to control how the client conversation happens — they may want to call the client directly, frame it a certain way, or assess whether any real harm was done before it becomes a bigger issue. Speed matters because the window to manage the situation proactively closes fast.\n\nWhy the others fail: saying nothing and hoping the client doesn\'t read it is a bet on someone else\'s inattention, and if they do read it and later realise it wasn\'t disclosed, a manageable slip becomes a serious trust breach involving concealment. Asking the client to delete the email without telling your manager oversteps your authority twice over — you\'re making a unilateral decision about how to handle a client-facing incident, and you\'re doing it without your manager even knowing it happened, which removes their ability to manage the fallout if the client mentions it later. Blaming the email system doesn\'t address the substance and looks evasive.\n\nThe underlying principle: accidental disclosure incidents are a distinct SJT category from ordinary mistakes, because they carry regulatory and confidentiality dimensions beyond the immediate embarrassment. The correct instinct is always immediate, full disclosure to your manager — never a unilateral quiet fix, however tempting it is to make the problem disappear yourself before anyone notices.',
      },
      {
        context: 'Two junior colleagues are in open conflict, and it\'s starting to affect team output. You are not their manager.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Take a side to resolve it faster',
          'Ignore it entirely — it\'s not your role',
          'Encourage them to address it directly, and flag the impact on output to your manager if it continues',
          'Discuss the conflict with other colleagues'],
        answer: 'Encourage them to address it directly, and flag the impact on output to your manager if it continues',
        explanation: 'Why this is best: encouraging the two colleagues to address it directly respects that it isn\'t your role to referee a peer dispute, while flagging the impact on output to your actual manager if it continues ensures someone with real authority steps in before the team\'s work suffers further — you\'re neither overstepping nor turning a blind eye.\n\nWhy the others fail: taking a side, even to "resolve it faster", draws you into a conflict that isn\'t yours and likely worsens it — now there are three people involved instead of two, and you\'ve damaged your neutrality with whichever colleague you didn\'t back. Ignoring it entirely because "it\'s not your role" is only defensible if there\'s no impact on shared work — here the prompt states it\'s affecting team output, which makes it everyone\'s problem, not just theirs. Discussing the conflict with other colleagues spreads it further without doing anything to resolve it, and easily tips into gossip.\n\nThe underlying principle: peer conflicts sit in a genuine grey zone — you have no authority to mediate, but you\'re not exempt from the consequences either. The consistent SJT answer for "conflict between others that affects shared outcomes" is to encourage direct resolution first and escalate to the person who DOES have authority only if the impact continues, rather than either inserting yourself as judge or staying silent indefinitely.',
      },
      {
        context: 'You\'re given a task by a senior colleague that you believe is a poor use of your time given other priorities, but they outrank you significantly.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Do the task without question, however long it takes',
          'Politely explain your current priorities and ask them to help you sequence the work',
          'Quietly deprioritise it without telling anyone',
          'Refuse and explain why you think it\'s a bad idea'],
        answer: 'Politely explain your current priorities and ask them to help you sequence the work',
        explanation: 'Why this is best: explaining your current priorities and asking the senior colleague to help you sequence the work is honest about the real conflict without refusing outright — it respects their seniority by asking them to make the call, while making sure they have the information (your other commitments) needed to make it well.\n\nWhy the others fail: doing the task without question, however long it takes, means your actual priorities silently slip with nobody aware it\'s happening — which looks like poor time management on your part later, even though the real cause was an unmanaged conflict you never surfaced. Quietly deprioritising it without telling anyone risks the senior colleague assuming it\'s progressing when it isn\'t, which is worse for them than knowing upfront and worse for you if they ask for an update. Refusing outright and explaining why you think it\'s a bad idea is presumptuous from a junior position — you may not have visibility into why they consider it a priority, and framing it as a refusal rather than a request for guidance reads as insubordinate rather than collaborative.\n\nThe underlying principle: when instructions conflict, juniors are rarely expected to silently comply at any cost or to unilaterally refuse — they\'re expected to surface the conflict transparently and let someone with more context and authority resolve it. Framing matters enormously here: "help me sequence this against my other work" gets a completely different reception than "I don\'t think I should do this."',
      },
      {
        context: 'During onboarding, you notice the training materials contain outdated information that could mislead new starters.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Say nothing — it\'s not your job to fix training materials',
          'Flag it constructively to whoever owns the materials, with the specific correction',
          'Tell other new starters privately to ignore that section',
          'Post publicly on the company intranet criticising the materials'],
        answer: 'Flag it constructively to whoever owns the materials, with the specific correction',
        explanation: 'Why this is best: flagging the specific correction to whoever owns the materials fixes the actual problem — new starters being misled — while doing it constructively and through the right channel means it\'s likely to be acted on rather than dismissed or resented.\n\nWhy the others fail: saying nothing because "it\'s not your job" is a missed opportunity to improve something at essentially no cost to you, and every future new starter is misled by the same outdated information you could have flagged. Telling other new starters privately to ignore that section fixes nothing structurally — it only helps the people you happen to tell, the materials remain wrong for everyone else, and it does nothing to get the actual error corrected. Posting publicly on the intranet criticising the materials embarrasses whoever created them, likely for an honest oversight, and makes you look like someone who escalates loudly rather than fixes things quietly and effectively.\n\nThe underlying principle: proactive, low-drama, specific feedback through the right channel is one of the most consistently rewarded behaviours across SJT categories, because it signals exactly the kind of employee who improves things around them without needing to be asked or without making a show of it. "Flag it constructively, to the right person, with the fix already worked out" is close to a universal template for these scenarios.',
      },
      {
        context: 'You\'re offered a role at a competing firm with a modest pay rise while mid-way through an important project at your current firm.',
        prompt: 'What is the MOST effective response regarding your CURRENT employer?',
        options: [
          'Leave immediately without notice',
          'Say nothing until your last day',
          'Give proper notice, offer a clean handover, and be professional regardless of how you feel about leaving',
          'Tell colleagues your new pay to make a point'],
        answer: 'Give proper notice, offer a clean handover, and be professional regardless of how you feel about leaving',
        explanation: 'Why this is best: giving proper notice, offering a clean handover, and staying professional throughout protects your reputation, your reference, and your relationships in an industry small enough that people you worked with as a junior will reappear as clients, colleagues or hiring managers years later.\n\nWhy the others fail: leaving immediately without notice, mid-project, damages the team you\'re leaving behind and burns a bridge you may well need later — references and informal reputation checks matter enormously in finance recruiting, and this is exactly the kind of exit that gets mentioned when someone calls a former colleague to ask "what were they like to work with?" Saying nothing until your last day denies your current employer any chance to plan a transition, which is unnecessarily disruptive when a normal notice period exists for precisely this reason. Telling colleagues your new pay to make a point is petty and unprofessional, and it can also make colleagues who remain feel undervalued or resentful, which reflects on you rather than the firm.\n\nThe underlying principle: this question isn\'t really about resignations — it\'s testing whether you understand that professional reputation is cumulative and durable, particularly in a small, relationship-driven industry where the same names recur across firms for an entire career. How you handle the moments that cost you nothing to handle well (an exit where you\'re already leaving) is a strong signal of how you\'ll handle moments that cost you more.',
      },
      {
        difficulty: 'expert',
        context: 'You are asked to finalise an analysis for a client meeting tomorrow. You spot that a key assumption, set by a well-regarded VP months ago, now looks clearly outdated and materially changes the conclusion. The VP is on annual leave and uncontactable. Your manager is available but has not been close to this workstream.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Present it as-is — the VP set the assumption and owns it',
          'Quietly update the assumption yourself, since you are confident it is now wrong',
          'Flag it to your manager now with both versions and your recommendation, so they can decide before the meeting',
          'Delay the meeting until the VP returns',
        ],
        answer: 'Flag it to your manager now with both versions and your recommendation, so they can decide before the meeting',
        explanation: 'This tests judgement where several answers are defensible. Presenting knowingly outdated analysis to a client is the worst outcome. Silently changing a senior colleague\'s assumption oversteps your authority and leaves nobody able to defend the change. Delaying is disproportionate and usually not yours to decide. Escalating with both versions plus a recommendation gives the decision-maker what they need while showing you did the thinking — the pattern firms consistently reward.',
      },
      {
        difficulty: 'expert',
        context: 'A senior client contact makes a comment to you over dinner that is clearly inappropriate about a junior colleague of yours who is also present. Other clients are at the table. Your colleague looks visibly uncomfortable but says nothing.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Say nothing at dinner, then check on your colleague privately afterwards and report it internally',
          'Confront the client publicly at the table immediately',
          'Say nothing at all — the client relationship is too commercially important',
          'Tell your colleague privately to let it go, since clients behave like this sometimes',
        ],
        answer: 'Say nothing at dinner, then check on your colleague privately afterwards and report it internally',
        explanation: 'A genuinely difficult one with no comfortable answer. Public confrontation escalates in front of other clients and may expose your colleague to more attention, though calmly redirecting the conversation in the moment is also defensible. What is NOT acceptable is treating it as normal or asking your colleague to absorb it. Firms expect you to support the colleague directly and report through proper channels — commercial importance never justifies leaving it unreported.',
      },
      {
        difficulty: 'expert',
        context: 'You are close to the end of a long project. You discover an error you made three weeks ago that has flowed into work already shared with the client. Correcting it will not change the final recommendation, but will require the team to redo several days of work during an already brutal week.',
        prompt: 'What is the MOST effective response?',
        options: [
          'Tell your manager immediately with the error, its impact, and options for correcting it',
          'Say nothing — the recommendation does not change, so the client is not harmed',
          'Fix it silently going forward without mentioning the earlier version',
          'Mention it after the project ends to avoid disrupting a difficult week',
        ],
        answer: 'Tell your manager immediately with the error, its impact, and options for correcting it',
        explanation: 'The tempting logic — "the conclusion is unchanged, so why cause pain?" — is exactly the reasoning firms most want to screen out. Client-facing work carries a record; if the error surfaces later, the concealment becomes far more serious than the mistake. Reporting immediately WITH an assessment of impact and options lets your manager make a proportionate call, which may well be to correct it quietly. Never make the disclosure decision alone.',
      },
      {
        context: 'RATING FORMAT — Many real SJTs ask you to rate a single response rather than pick the best of four.\n\nScenario: A colleague asks you to sign off their work as reviewed, saying they are under time pressure and it is "definitely fine". You have not actually reviewed it.\n\nProposed response: "Sign it off to help them out, and review it properly afterwards when you have time."',
        prompt: 'How effective is this response?',
        options: ['Very effective', 'Somewhat effective', 'Somewhat ineffective', 'Very ineffective'],
        answer: 'Very ineffective',
        explanation: 'A sign-off is a control, and signing off work you have not reviewed defeats the control entirely — regardless of intention to check later. In regulated environments this can be a disciplinary matter. Rating-format SJTs test the same judgement as the multiple-choice version, but you must calibrate degree rather than pick a winner. Reserve "very ineffective" for responses that breach a control, conceal something, or create risk for others.',
      },
      {
        context: 'RATING FORMAT\n\nScenario: You are three weeks into your internship. In a team meeting, a senior person states a figure about a market you have researched extensively, and you are fairly confident it is out of date.\n\nProposed response: "Say nothing in the meeting, then message them privately afterwards with the updated figure and your source."',
        prompt: 'How effective is this response?',
        options: ['Very effective', 'Somewhat effective', 'Somewhat ineffective', 'Very ineffective'],
        answer: 'Somewhat effective',
        explanation: 'This is deliberately not a clear-cut case, which is what makes it realistic. Correcting privately with a source is respectful and low-risk, so it is genuinely effective. But it is only "somewhat" — if the meeting is making a decision on that figure, staying silent lets a wrong number drive an outcome, and a brief, humble in-meeting flag ("I may have seen a more recent figure, shall I check?") would be better. Rating SJTs frequently include defensible-but-imperfect options; resist the urge to rate everything at the extremes.',
      },
      {
        context: 'RATING FORMAT\n\nScenario: A client asks you directly for your personal opinion on whether they should proceed with a transaction. You are a junior analyst and this is well outside your remit.\n\nProposed response: "Give them your honest personal view, since they asked you directly and deserve a straight answer."',
        prompt: 'How effective is this response?',
        options: ['Very effective', 'Somewhat effective', 'Somewhat ineffective', 'Very ineffective'],
        answer: 'Somewhat ineffective',
        explanation: 'Honesty is a good instinct, so this is not "very ineffective" — but a junior giving unmandated advice to a client can constitute an unauthorised recommendation, may conflict with the firm\'s formal position, and exposes both you and the firm. The effective response acknowledges the question warmly and redirects: "That is really a question for [senior], let me bring them in." Note how the rating scale rewards recognising that a well-intentioned action can still be wrong.',
      },
    ],
  },
]

type View = 'home' | 'test' | 'results'

type QuestionMeta = { catId: string; catTitle: string; color: string; icon: string; tip: string }

// Full Assessment Day: numerical → verbal → logical → SJT back to back on
// one continuous timer, mirroring a real SHL/Cappfinity assessment day —
// abbreviated counts so it stays a realistic ~30 minutes rather than 90+.
const FULL_ASSESSMENT_COUNTS: Record<string, number> = { numerical: 8, verbal: 6, logical: 8, sjt: 5 }

export default function PracticeTests() {
  const [view, setView] = useState<View>('home')
  const [category, setCategory] = useState<TestCategory | null>(null)
  const [sessionQuestions, setSessionQuestions] = useState<TestQuestion[]>([])
  const [sessionIds, setSessionIds] = useState<string[]>([])
  const [sessionMeta, setSessionMeta] = useState<QuestionMeta[]>([])
  const [isFullAssessment, setIsFullAssessment] = useState(false)
  const [expertMode, setExpertMode] = useState(false)
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const recordedRef = useRef(false)

  function stopTimer() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }

  useEffect(() => stopTimer, [])

  // Record the attempt(s) exactly once when we land on the results view —
  // using state here (not the stale timer closure) so scores are accurate
  // whether the test was submitted manually or the clock ran out. Also
  // feeds spaced-repetition stats so wrong questions resurface more often.
  useEffect(() => {
    if (view !== 'results' || sessionQuestions.length === 0 || recordedRef.current) return
    recordedRef.current = true

    sessionQuestions.forEach((q, i) => {
      recordSRAnswer(SR_KEY, sessionIds[i], answers[i] === q.answer)
    })

    if (isFullAssessment) {
      const byCategory = new Map<string, { title: string; correct: number; total: number }>()
      sessionQuestions.forEach((q, i) => {
        const meta = sessionMeta[i]
        const entry = byCategory.get(meta.catId) || { title: meta.catTitle, correct: 0, total: 0 }
        entry.total += 1
        if (answers[i] === q.answer) entry.correct += 1
        byCategory.set(meta.catId, entry)
      })
      byCategory.forEach((entry, catId) => {
        recordPracticeTestAttempt({
          date: new Date().toISOString(),
          categoryId: catId,
          categoryTitle: entry.title,
          correct: entry.correct,
          total: entry.total,
          percentage: Math.round((entry.correct / entry.total) * 100),
        })
      })
    } else if (category) {
      const correct = sessionQuestions.filter((q, i) => answers[i] === q.answer).length
      recordPracticeTestAttempt({
        date: new Date().toISOString(),
        categoryId: category.id,
        categoryTitle: category.title,
        correct,
        total: sessionQuestions.length,
        percentage: Math.round((correct / sessionQuestions.length) * 100),
      })
    }
  }, [view, category, sessionQuestions, sessionIds, sessionMeta, answers, isFullAssessment])

  // Weighted-sample within the tiers this category has unlocked so far —
  // wrong/unseen questions surface more; mastered ones fade but never vanish.
  // Expert mode ignores unlock gating and draws only from the hardest pool.
  function sampleFromCategory(cat: TestCategory, n: number): { q: TestQuestion; id: string }[] {
    const total = cat.questions.length
    const all = cat.questions.map((q, i) => ({ q, id: `${cat.id}-${i}`, tier: difficultyForIndex(i, total, q.difficulty) }))
    const allowed = unlockedTiers(cat.id)
    const pool = expertMode
      ? all.filter(item => item.tier === 'expert' || item.tier === 'hard')
      : all.filter(item => item.tier !== 'expert' && allowed.has(item.tier))
    const usablePool = pool.length >= n ? pool : all
    const sampled = weightedSample(SR_KEY, usablePool.map(p => ({ id: p.id, value: p })), n)
    return sampled.map(s => ({ q: s.q, id: s.id }))
  }

  function startTest(cat: TestCategory) {
    const sampled = sampleFromCategory(cat, cat.questionsPerAttempt)
    recordedRef.current = false
    setIsFullAssessment(false)
    setCategory(cat)
    setSessionQuestions(sampled.map(s => s.q))
    setSessionIds(sampled.map(s => s.id))
    setSessionMeta(sampled.map(() => ({ catId: cat.id, catTitle: cat.title, color: cat.color, icon: cat.icon, tip: cat.tip })))
    setQIndex(0)
    setAnswers(new Array(sampled.length).fill(null))
    setTimeLeft(sampled.length * cat.secondsPerQuestion)
    setView('test')
    stopTimer()
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          stopTimer()
          setView('results')
          return 0
        }
        return t - 1
      })
    }, 1000)
    window.scrollTo(0, 0)
  }

  function startFullAssessment() {
    recordedRef.current = false
    setIsFullAssessment(true)
    setCategory(null)
    const allQuestions: TestQuestion[] = []
    const allIds: string[] = []
    const allMeta: QuestionMeta[] = []
    let totalSeconds = 0
    testCategories.forEach(cat => {
      const n = FULL_ASSESSMENT_COUNTS[cat.id] ?? cat.questionsPerAttempt
      const sampled = sampleFromCategory(cat, n)
      sampled.forEach(s => {
        allQuestions.push(s.q)
        allIds.push(s.id)
        allMeta.push({ catId: cat.id, catTitle: cat.title, color: cat.color, icon: cat.icon, tip: cat.tip })
      })
      totalSeconds += n * cat.secondsPerQuestion
    })
    setSessionQuestions(allQuestions)
    setSessionIds(allIds)
    setSessionMeta(allMeta)
    setQIndex(0)
    setAnswers(new Array(allQuestions.length).fill(null))
    setTimeLeft(totalSeconds)
    setView('test')
    stopTimer()
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          stopTimer()
          setView('results')
          return 0
        }
        return t - 1
      })
    }, 1000)
    window.scrollTo(0, 0)
  }

  function selectAnswer(opt: string) {
    setAnswers(prev => prev.map((a, i) => (i === qIndex ? opt : a)))
  }

  function finishTest() {
    stopTimer()
    setView('results')
    window.scrollTo(0, 0)
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  // ===== HOME =====
  if (view === 'home') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Online Test Practice</h1>
          <p className="text-gray-400">Practise the psychometric tests banks and firms actually send — numerical, verbal, the shape puzzles, and situational judgement. Timed, scored, and every answer explained. Questions adapt to you: get one wrong and it resurfaces more often until it sticks.</p>
        </div>

        <div className="bg-brand-card border border-brand-gold/20 rounded-xl p-5 mb-8">
          <h2 className="text-brand-gold font-bold mb-2">⚡ How firms use these tests</h2>
          <p className="text-gray-300 text-sm leading-relaxed">Almost every finance graduate scheme sends online assessments (SHL, Korn Ferry/Talent Q, Cappfinity, HireVue games) immediately after your application — often before a human ever sees your CV. They cut 50-80% of candidates. The good news: these tests are extremely learnable. Practise until the formats feel boring.</p>
        </div>

        {/* Full Assessment Day */}
        <div className="bg-gradient-to-br from-brand-gold/10 to-brand-teal/10 border border-brand-gold/30 rounded-2xl p-6 mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">🎯 The real thing</p>
              <h2 className="text-xl font-black text-white mb-2">Full Assessment Day Mode</h2>
              <p className="text-gray-300 text-sm max-w-xl leading-relaxed">
                Numerical → Verbal → Logical → SJT, back to back, on one continuous clock — exactly how SHL and Cappfinity run a real assessment day. No pausing between sections.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                {Object.entries(FULL_ASSESSMENT_COUNTS).map(([id, n]) => `${n} ${id}`).join(' · ')} — {formatTime(Object.entries(FULL_ASSESSMENT_COUNTS).reduce((s, [id, n]) => s + n * (testCategories.find(c => c.id === id)?.secondsPerQuestion || 0), 0))} total
              </p>
            </div>
            <button
              onClick={startFullAssessment}
              className="px-6 py-3.5 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors flex-shrink-0"
            >
              Start Assessment Day →
            </button>
          </div>
        </div>

        {/* Difficulty mode */}
        <div className="bg-brand-card border border-white/10 rounded-2xl p-5 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-white font-bold mb-1">Difficulty</h2>
              <p className="text-gray-400 text-sm max-w-xl">
                {expertMode
                  ? 'Expert mode draws only from the hardest questions — multi-step calculations, subtle Cannot Say distinctions, multi-attribute sequences and genuine judgement dilemmas. Harder than most real tests, deliberately.'
                  : 'Standard mode follows the real thing: it starts at easy questions and unlocks harder tiers as your scores improve, so difficulty tracks your actual level.'}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setExpertMode(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${!expertMode ? 'bg-brand-gold text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              >
                Standard
              </button>
              <button
                onClick={() => setExpertMode(true)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${expertMode ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              >
                🔥 Expert
              </button>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {testCategories.map(cat => {
            const tiers = unlockedTiers(cat.id)
            return (
            <div key={cat.id} className={`bg-brand-card border ${cat.border} rounded-2xl p-6 flex flex-col`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{cat.icon}</span>
                <h2 className={`text-lg font-black ${cat.color}`}>{cat.title}</h2>
              </div>
              <p className="text-gray-400 text-sm mb-3">{cat.description}</p>
              <div className="bg-brand-darker border border-white/5 rounded-xl p-3.5 mb-3 space-y-2 flex-1">
                <p className="text-xs text-gray-400"><span className={`font-bold ${cat.color}`}>Providers you'll meet:</span> {cat.providers}</p>
                <p className="text-xs text-gray-400"><span className={`font-bold ${cat.color}`}>Who requires it:</span> {cat.requiredBy}</p>
                <p className="text-xs text-gray-400"><span className={`font-bold ${cat.color}`}>Why firms use it:</span> {cat.whyUsed}</p>
              </div>
              <div className="flex items-center gap-1.5 mb-3">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(tier => (
                  <span key={tier} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tiers.has(tier) ? `${cat.color} bg-white/10` : 'text-gray-700 bg-white/5'}`}>
                    {tiers.has(tier) ? '✓' : '🔒'} {tier}
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-600 mb-4">
                {cat.questionsPerAttempt} questions per attempt, weighted-sampled from a bank of {cat.questions.length} · {formatTime(cat.questionsPerAttempt * cat.secondsPerQuestion)} time limit · retake for a different test
              </div>
              <button
                onClick={() => startTest(cat)}
                className="w-full py-3 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors"
              >
                Start Test →
              </button>
            </div>
          )})}
        </div>

        {/* Realism notes */}
        <div className="bg-brand-card border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-bold text-lg mb-1">📋 How the real tests differ from practice</h2>
          <p className="text-gray-500 text-xs mb-4">Practice here is deliberately close to the real formats, but there are differences worth knowing before you sit a live one.</p>
          <div className="space-y-3">
            {[
              { t: 'Scoring is percentile, not percentage', d: 'Real tests compare you to a norm group of comparable candidates. Firms sift at a percentile threshold, often around 50th-70th, so what matters is how you did relative to others — not your raw score.' },
              { t: 'Numerical tests group questions around shared exhibits', d: 'You typically get a table or chart with three or four questions on it, so time invested understanding the data pays off across several questions. Some questions here now replicate this.' },
              { t: 'Many are adaptive', d: 'SHL Verify Interactive and similar adjust difficulty based on your answers — get one right and the next is harder. This means you cannot judge how you are doing from question difficulty, so do not panic if items feel hard.' },
              { t: 'Some formats do not let you go back', d: 'Cut-e/Aon tests often auto-advance with a fixed time per item and no navigation. SHL usually allows review within the section. Check the instructions carefully before starting.' },
              { t: 'SJTs use several answer formats', d: 'Beyond "pick the most effective", real SJTs ask you to rate each response on a scale, rank all four, or pick both the best AND worst. Rating-format examples are included here.' },
              { t: 'You will be verified later', d: 'Many firms re-test shortlisted candidates in supervised conditions at the assessment centre. A wildly different score raises flags, which is another reason not to get help on the online stage.' },
              { t: 'Calculators are allowed on numerical, never on trading firm speed tests', d: 'SHL-style tests assume a calculator. Optiver, IMC and similar mental arithmetic rounds explicitly forbid one — train both ways.' },
            ].map((r, i) => (
              <div key={i} className="bg-brand-darker border border-white/5 rounded-lg p-3.5">
                <p className="text-brand-gold font-semibold text-sm mb-0.5">{r.t}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{r.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-card border border-white/10 rounded-xl p-5 mb-8">
          <h2 className="text-white font-bold mb-2">🎚️ How difficulty tiers unlock</h2>
          <p className="text-gray-400 text-sm leading-relaxed">Every category starts with Easy questions only. <span className="text-white font-semibold">Medium</span> unlocks after your first attempt. <span className="text-white font-semibold">Hard</span> unlocks once you've done 3+ attempts averaging 70% or higher over your last 3 — mastery earns you the harder questions, not the other way round.</p>
        </div>

        {/* Mental maths drill */}
        <div className="mb-8">
          <MentalMathsDrill />
        </div>

        {/* Mental maths technique */}
        <div className="bg-brand-card border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-bold text-lg mb-1">🧮 Mental Maths — the shortcuts worth drilling</h2>
          <p className="text-gray-500 text-xs mb-5">
            Numerical tests allow a calculator, but the candidates who score highest barely use it — they estimate,
            eliminate, and only calculate to confirm. Trading firms test raw speed with no calculator at all.
            These are the specific techniques that produce that speed.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {mentalMathsShortcuts.map((sec, i) => (
              <div key={i} className="bg-brand-darker border border-white/5 rounded-xl p-4">
                <h3 className="text-brand-gold font-bold text-sm mb-2.5">{sec.group}</h3>
                <ul className="space-y-2">
                  {sec.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-gray-300 text-xs leading-relaxed">
                      <span className="text-brand-teal mt-0.5 flex-shrink-0">▸</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-white/5">
            <p className="text-gray-400 text-sm leading-relaxed">
              <span className="text-white font-semibold">How to actually improve:</span> run the sprint above for
              5 minutes a day rather than an hour once a week — arithmetic speed is a motor skill and responds to
              frequency, not volume. Keep accuracy above 80% before pushing pace; below that you are guessing, and
              guessing trains the wrong habit. When you miss one, work out <em>which</em> shortcut above would have
              caught it rather than just noting the right answer.
            </p>
          </div>
        </div>

        <div className="bg-brand-card border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-bold text-lg mb-1">🌐 Where to practise further</h2>
          <p className="text-gray-500 text-xs mb-4">Free and paid platforms candidates actually use — plus the providers' own practice portals, which mirror the real tests exactly.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { name: 'SHL Direct (practice.shl.com)', desc: 'Free official practice tests from the biggest provider — do these first, they mirror what banks send.', tag: 'Free · Official' },
              { name: 'AssessmentDay', desc: 'Large free question banks for numerical, verbal and logical tests with worked solutions.', tag: 'Free + Paid' },
              { name: 'Practice Aptitude Tests', desc: 'Free tests categorised by employer and provider — search the firm you\'re applying to.', tag: 'Free + Paid' },
              { name: 'JobTestPrep', desc: 'Paid provider-specific prep packs (SHL, Talent Q, cut-e, Watson Glaser) — worth it for a target firm.', tag: 'Paid' },
              { name: 'Aon/cut-e practice portal', desc: 'Official practice for the scales tests used by Optiver, IMC and other trading firms.', tag: 'Free · Official' },
              { name: 'GraduatesFirst', desc: 'Free trials plus firm-specific test guides for banks and Big 4.', tag: 'Free + Paid' },
            ].map((site, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-white font-semibold text-sm">{site.name}</span>
                  <span className="text-[10px] font-bold text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-full flex-shrink-0">{site.tag}</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{site.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-card border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-4">🎯 Test-day tactics that actually work</h2>
          <ul className="space-y-2.5">
            {[
              'Do the practice questions every provider offers before the real test — formats vary and familiarity is free marks.',
              'Use a proper calculator, pen and paper for numerical tests — mental-only maths under time pressure causes silly errors.',
              'Never leave blanks: most tests don\'t punish wrong answers, so eliminate and guess.',
              'For verbal reasoning: answer ONLY from the passage. Your outside knowledge is the trap.',
              'For logical tests: check count → rotation → alternation → size → position, in that order.',
              'For SJTs: research the firm\'s stated values first — you\'re being scored against them.',
              'Take the test fresh, in the morning, on a proper computer with stable internet — not on your phone at midnight before the deadline.',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                <span className="text-brand-teal mt-0.5 flex-shrink-0">✓</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  // ===== RESULTS =====
  if (view === 'results') {
    const correct = sessionQuestions.filter((q, i) => answers[i] === q.answer).length
    const total = sessionQuestions.length
    const pct = Math.round((correct / total) * 100)
    const band = pct >= 90 ? { label: 'Outstanding — top-tier firm ready', color: 'text-brand-gold' }
      : pct >= 75 ? { label: 'Strong — you\'d pass most screens', color: 'text-green-400' }
      : pct >= 55 ? { label: 'Borderline — more practice needed', color: 'text-yellow-400' }
      : { label: 'Keep practising — review every explanation below', color: 'text-red-400' }

    const sectionBreakdown = isFullAssessment
      ? Array.from(new Map(sessionMeta.map(m => [m.catId, m])).values()).map(meta => {
          const idxs = sessionMeta.map((m, i) => (m.catId === meta.catId ? i : -1)).filter(i => i >= 0)
          const sectionCorrect = idxs.filter(i => answers[i] === sessionQuestions[i].answer).length
          return { meta, correct: sectionCorrect, total: idxs.length, pct: Math.round((sectionCorrect / idxs.length) * 100) }
        })
      : []

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{pct >= 75 ? '🏆' : pct >= 55 ? '📈' : '📚'}</div>
          <h1 className="text-3xl font-black text-white mb-2">{isFullAssessment ? 'Full Assessment Day' : category?.title} — Results</h1>
          <div className="text-5xl font-black text-brand-gold my-4">{correct}/{total}</div>
          <p className={`font-bold ${band.color}`}>{pct}% — {band.label}</p>
          <div className="bg-brand-card border border-white/10 rounded-xl p-4 mt-5 text-left max-w-lg mx-auto">
            <p className="text-xs text-brand-teal font-bold uppercase tracking-wider mb-1">How real tests would score this</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Actual tests report a <span className="text-white font-semibold">percentile against a norm group</span>,
              not a raw percentage — so "you scored in the 75th percentile" means you beat 75% of comparable candidates.
              Banks typically sift at around the <span className="text-white font-semibold">50th-70th percentile</span>,
              and competitive programmes higher. A raw {pct}% here is
              {pct >= 85 ? ' comfortably above where most sifts are set.' : pct >= 70 ? ' around the level most sifts require — build more margin before the real thing.' : ' below where most sifts are set. Keep drilling before you sit a live test.'}
            </p>
          </div>
        </div>

        {isFullAssessment && (
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {sectionBreakdown.map(s => (
              <div key={s.meta.catId} className="bg-brand-card border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{s.meta.icon}</span>
                  <span className={`text-sm font-semibold ${s.meta.color}`}>{s.meta.catTitle}</span>
                </div>
                <span className="text-white font-bold text-sm">{s.correct}/{s.total} ({s.pct}%)</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 justify-center mb-10">
          {isFullAssessment ? (
            <button onClick={startFullAssessment} className="px-6 py-3 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors">
              🔄 Retake Assessment Day
            </button>
          ) : (
            <button onClick={() => category && startTest(category)} className="px-6 py-3 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors">
              🔄 Retake
            </button>
          )}
          <button onClick={() => { setView('home'); setCategory(null); setIsFullAssessment(false) }} className="px-6 py-3 bg-white/5 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-colors">
            All tests
          </button>
        </div>

        <h2 className="text-white font-bold text-lg mb-4">Review your answers</h2>
        <div className="space-y-4">
          {sessionQuestions.map((q, i) => {
            const userAnswer = answers[i]
            const isCorrect = userAnswer === q.answer
            return (
              <div key={i} className={`bg-brand-card border rounded-xl p-5 ${isCorrect ? 'border-green-500/20' : 'border-red-500/20'}`}>
                <div className="flex items-start gap-3 mb-2">
                  <span className={`font-black text-sm flex-shrink-0 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>{isCorrect ? '✓' : '✗'} Q{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    {isFullAssessment && sessionMeta[i] && <p className={`text-xs font-bold mb-1 ${sessionMeta[i].color}`}>{sessionMeta[i].icon} {sessionMeta[i].catTitle}</p>}
                    {q.dataTable && <p className="text-gray-500 text-xs mb-1 italic">[{q.dataTable.title}]</p>}
                    {q.context && <p className="text-gray-500 text-xs mb-1 italic whitespace-pre-line">{q.context}</p>}
                    {q.shapes && <p className="text-white text-xl tracking-widest mb-2 overflow-x-auto">{q.shapes}</p>}
                    <p className="text-gray-200 text-sm font-medium">{q.prompt}</p>
                  </div>
                </div>
                <div className="pl-8 text-sm">
                  <p className="text-gray-400">Your answer: <span className={isCorrect ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>{userAnswer || '(no answer)'}</span></p>
                  {!isCorrect && <p className="text-gray-400">Correct answer: <span className="text-green-400 font-semibold">{q.answer}</span></p>}
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ===== TEST =====
  const q = sessionQuestions[qIndex]
  const currentMeta = sessionMeta[qIndex]
  if (!q || !currentMeta) return null
  const answeredCount = answers.filter(a => a !== null).length
  const urgent = timeLeft <= 60
  const prevMeta = qIndex > 0 ? sessionMeta[qIndex - 1] : null
  const sectionChanged = isFullAssessment && prevMeta && prevMeta.catId !== currentMeta.catId

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => { stopTimer(); setView('home'); setCategory(null); setIsFullAssessment(false) }} className="text-gray-500 hover:text-white text-sm">✕ Quit</button>
        <div className={`font-mono font-bold text-lg px-4 py-1.5 rounded-lg ${urgent ? 'bg-red-500/15 text-red-400 animate-pulse' : 'bg-white/5 text-white'}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
        <span className="text-xs text-gray-500">{answeredCount}/{sessionQuestions.length} answered</span>
      </div>

      <div className="flex-1 mb-6 h-2 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-brand-gold rounded-full transition-all" style={{ width: `${((qIndex + 1) / sessionQuestions.length) * 100}%` }} />
      </div>

      {isFullAssessment && sectionChanged && (
        <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-3 mb-4 text-center">
          <p className="text-brand-gold text-sm font-bold">New section: {currentMeta.icon} {currentMeta.catTitle} — no break, the clock keeps running</p>
        </div>
      )}

      <div className="mb-2">
        <span className={`text-xs font-semibold uppercase tracking-wider ${currentMeta.color}`}>
          {currentMeta.icon} {currentMeta.catTitle} — Question {qIndex + 1} of {sessionQuestions.length}
          {isFullAssessment && ' (Full Assessment Day)'}
        </span>
      </div>

      <div className="bg-brand-card border border-white/10 rounded-2xl p-6 sm:p-8 mb-4">
        {q.dataTable && (
          <div className="bg-brand-darker border border-white/10 rounded-xl p-4 mb-4 overflow-x-auto">
            <p className="text-white font-semibold text-sm mb-2">{q.dataTable.title}</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {q.dataTable.headers.map((h, i) => (
                    <th key={i} className="text-left p-2 text-gray-400 font-semibold border-b border-white/10 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {q.dataTable.rows.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    {row.map((cell, j) => (
                      <td key={j} className={`p-2 whitespace-nowrap ${j === 0 ? 'text-gray-300' : 'text-white font-medium'}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {q.dataTable.note && <p className="text-gray-500 text-xs mt-2 italic">{q.dataTable.note}</p>}
          </div>
        )}
        {q.context && (
          <div className="bg-brand-darker border border-white/5 rounded-xl p-4 mb-4">
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{q.context}</p>
          </div>
        )}
        {q.shapes && (
          <div className="bg-brand-darker border border-white/5 rounded-xl p-5 mb-4 text-center overflow-x-auto">
            <p className="text-white text-3xl tracking-[0.3em] whitespace-nowrap">{q.shapes}</p>
          </div>
        )}
        <h2 className="text-lg font-bold text-white leading-relaxed mb-5">{q.prompt}</h2>
        <div className="space-y-3">
          {q.options.map(opt => (
            <button
              key={opt}
              onClick={() => selectAnswer(opt)}
              className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all ${
                answers[qIndex] === opt
                  ? 'bg-brand-gold/15 border-brand-gold text-white'
                  : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setQIndex(i => Math.max(0, i - 1))}
          disabled={qIndex === 0}
          className="px-6 py-4 bg-white/5 text-gray-300 rounded-xl font-semibold hover:bg-white/10 transition-colors disabled:opacity-30"
        >
          ← Back
        </button>
        {qIndex < sessionQuestions.length - 1 ? (
          <button
            onClick={() => setQIndex(i => i + 1)}
            className="flex-1 py-4 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={finishTest}
            className="flex-1 py-4 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-colors"
          >
            Finish & See Results
          </button>
        )}
      </div>
      <p className="text-gray-600 text-xs text-center mt-3">💡 {currentMeta.tip}</p>
    </div>
  )
}
