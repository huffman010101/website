import { useState, useEffect, useRef } from 'react'
import { recordPracticeTestAttempt, getPracticeTestHistory } from '../lib/history'
import { recordAnswer as recordSRAnswer, weightedSample } from '../lib/spacedRepetition'

const SR_KEY = 'findr_sr_practice_tests'

type Difficulty = 'easy' | 'medium' | 'hard'

// Difficulty is derived from a question's position in its bank (roughly
// increasing complexity as authored) rather than hand-tagged per question —
// avoids touching 70+ question objects individually.
function difficultyForIndex(index: number, total: number): Difficulty {
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

type TestQuestion = {
  prompt: string
  context?: string
  shapes?: string
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
        explanation: 'Increase = 0.6m. 0.6 ÷ 2.4 = 0.25 = 25%. Always divide the change by the ORIGINAL value.',
      },
      {
        context: 'Company revenue: 2021: £480m · 2022: £552m · 2023: £600m.',
        prompt: 'In which year was percentage growth higher, and what was it?',
        options: ['2022, at 15%', '2023, at 15%', '2022, at 13%', '2023, at 8.7%'],
        answer: '2022, at 15%',
        explanation: '2022: 72 ÷ 480 = 15%. 2023: 48 ÷ 552 ≈ 8.7%. Growth on a bigger base needs a bigger absolute rise.',
      },
      {
        context: 'A portfolio is split equities : bonds : cash in the ratio 5 : 3 : 2. The portfolio is worth £1.8m.',
        prompt: 'How much is held in bonds?',
        options: ['£360,000', '£540,000', '£600,000', '£900,000'],
        answer: '£540,000',
        explanation: 'Ratio parts total 10, so each part = £180k. Bonds = 3 parts = £540k.',
      },
      {
        prompt: 'A trader buys shares at £8.00 and sells at £9.20, paying 0.5% commission on each transaction (on transaction value). Approximate net profit per share?',
        options: ['£1.20', '£1.11', '£1.16', '£1.03'],
        answer: '£1.11',
        explanation: 'Gross profit £1.20. Commissions: 0.5% × 8.00 = 4p + 0.5% × 9.20 = 4.6p → 8.6p total. Net ≈ £1.11.',
      },
      {
        context: 'An analyst\'s bonus is 40% of base salary. Base salary is £65,000.',
        prompt: 'What is total compensation?',
        options: ['£91,000', '£105,000', '£26,000', '£89,000'],
        answer: '£91,000',
        explanation: 'Bonus = 0.4 × 65,000 = £26,000. Total = 65,000 + 26,000 = £91,000.',
      },
      {
        context: 'GDP data: Country A: $2.0tn growing at 3%. Country B: $1.6tn growing at 5%.',
        prompt: 'Approximately how much does each economy add next year?',
        options: ['A: $60bn, B: $80bn', 'A: $80bn, B: $60bn', 'A: $60bn, B: $60bn', 'A: $30bn, B: $50bn'],
        answer: 'A: $60bn, B: $80bn',
        explanation: 'A: 3% × 2,000bn = $60bn. B: 5% × 1,600bn = $80bn. The smaller, faster economy adds more in absolute terms here.',
      },
      {
        prompt: 'An investment falls 20% in year one, then rises 20% in year two. Overall it is:',
        options: ['Back to its starting value', 'Down 4%', 'Up 4%', 'Down 2%'],
        answer: 'Down 4%',
        explanation: '100 → 80 → 96. The 20% recovery applies to the smaller base. This asymmetry of losses is a classic test (and investing) trap.',
      },
      {
        context: 'Exchange rate: £1 = $1.25. A UK firm invoices a US client $150,000.',
        prompt: 'How much does the firm receive in pounds?',
        options: ['£187,500', '£120,000', '£150,000', '£112,500'],
        answer: '£120,000',
        explanation: '$150,000 ÷ 1.25 = £120,000. Dividing by the rate converts dollars into (fewer) pounds — sanity-check the direction.',
      },
      {
        context: 'A company\'s costs are 70% of revenue. Revenue rises 10% while costs rise only 5%.',
        prompt: 'If revenue was £100m, what is the new profit?',
        options: ['£30m', '£33m', '£36.5m', '£40m'],
        answer: '£36.5m',
        explanation: 'New revenue £110m; new costs 70 × 1.05 = £73.5m. Profit = 110 − 73.5 = £36.5m — up 21.7% from £30m. Operating leverage in action.',
      },
      {
        prompt: 'A bond pays a £45 annual coupon and trades at £900. Its current yield is:',
        options: ['4.5%', '5.0%', '5.5%', '9.0%'],
        answer: '5.0%',
        explanation: 'Current yield = coupon ÷ price = 45 ÷ 900 = 5%. Buying below face value lifts the yield above the 4.5% coupon rate.',
      },
      {
        context: 'Team A of 4 analysts completes a model in 6 days.',
        prompt: 'Working at the same rate, how long would 3 analysts take?',
        options: ['4.5 days', '7 days', '8 days', '9 days'],
        answer: '8 days',
        explanation: 'Total work = 4 × 6 = 24 analyst-days. 24 ÷ 3 = 8 days. Inverse proportion — fewer people, proportionally longer.',
      },
      {
        context: 'A fund charges a 2% management fee. An investor puts in £250,000 and the gross return is 8%.',
        prompt: 'Roughly what is the investor\'s net gain after the fee (fee charged on invested capital)?',
        options: ['£20,000', '£15,000', '£10,000', '£5,000'],
        answer: '£15,000',
        explanation: 'Gross gain 8% × 250k = £20k. Fee 2% × 250k = £5k. Net = £15k — the fee ate a quarter of the return.',
      },
      {
        prompt: '£10,000 invested at 10% compound interest for 2 years grows to:',
        options: ['£12,000', '£12,100', '£11,000', '£12,200'],
        answer: '£12,100',
        explanation: 'Year 1: £11,000. Year 2: 11,000 × 1.1 = £12,100. The extra £100 is interest on interest.',
      },
      {
        context: 'A product sells at £50 with variable costs of £20 per unit. Fixed costs are £120,000.',
        prompt: 'How many units must be sold to break even?',
        options: ['2,400', '4,000', '6,000', '3,000'],
        answer: '4,000',
        explanation: 'Contribution per unit = 50 − 20 = £30. Breakeven = 120,000 ÷ 30 = 4,000 units.',
      },
      {
        prompt: 'After falling 20%, a share trades at £64. What was its original price?',
        options: ['£76.80', '£80', '£84', '£78'],
        answer: '£80',
        explanation: '£64 is 80% of the original: 64 ÷ 0.8 = £80. Dividing by the remaining fraction reverses a percentage fall — never just add 20% back.',
      },
      {
        context: 'A portfolio is 60% in Fund A (returned 5%) and 40% in Fund B (returned 10%).',
        prompt: 'What is the portfolio\'s overall return?',
        options: ['7.5%', '7%', '8%', '6.5%'],
        answer: '7%',
        explanation: 'Weighted average: 0.6 × 5 + 0.4 × 10 = 3 + 4 = 7%.',
      },
      {
        context: 'Revenue is £250m with a gross margin of 40%.',
        prompt: 'What is the cost of goods sold?',
        options: ['£100m', '£150m', '£40m', '£210m'],
        answer: '£150m',
        explanation: 'Gross profit = 40% × 250 = £100m, so COGS = 250 − 100 = £150m. Watch whether the question asks for profit or cost.',
      },
      {
        context: 'A company has EBIT of £45m and annual interest expense of £9m.',
        prompt: 'What is its interest coverage ratio?',
        options: ['5x', '4x', '9x', '0.2x'],
        answer: '5x',
        explanation: 'Coverage = EBIT ÷ interest = 45 ÷ 9 = 5x. Lenders watch this — below ~2x signals distress risk.',
      },
      {
        context: '£1 = $1.25 and €1 = $1.00.',
        prompt: 'What is the £/€ exchange rate?',
        options: ['£1 = €0.80', '£1 = €1.25', '£1 = €1.00', '£1 = €2.25'],
        answer: '£1 = €1.25',
        explanation: 'Cross rate via the dollar: £1 buys $1.25, and $1.25 buys €1.25 (at €1 = $1). Cross-currency questions are an SHL favourite.',
      },
      {
        context: 'Headcount data — Front office: 240, up 20% year-on-year. Operations: 600, down 10% year-on-year.',
        prompt: 'What was TOTAL headcount one year ago (front office + operations)?',
        options: ['840', '867', '800', '873'],
        answer: '867',
        explanation: 'Front office was 240 ÷ 1.2 = 200. Operations was 600 ÷ 0.9 ≈ 667. Total ≈ 867. Reverse-percentage on each segment separately.',
      },
      {
        context: 'A fund returns 12% in year 1 and −8% in year 2.',
        prompt: 'What is the compound (not average) two-year return?',
        options: ['4.0%', '3.0%', '2.96%', '20.0%'],
        answer: '3.0%',
        explanation: '1.12 × 0.92 = 1.0304 → 3.04% ≈ 3.0%. Simple averaging (12−8)/2=2% is wrong — always compound sequential returns, never average them.',
      },
      {
        context: 'A company issues 2 million new shares at £4.50 each, raising cash. It previously had 18 million shares outstanding and net income of £27m.',
        prompt: 'By how much does EPS fall purely from the share issuance (assume net income unchanged)?',
        options: ['About 10%', 'About 8%', 'About 11%', 'About 5%'],
        answer: 'About 10%',
        explanation: 'Old EPS = 27/18 = £1.50. New EPS = 27/20 = £1.35. Fall = 0.15/1.50 = 10%. Dilution from new shares reduces EPS even if profit is unchanged.',
      },
      {
        context: 'A UK investor holds a US stock. The stock rises 8% in USD terms, but the pound strengthens 5% against the dollar over the same period.',
        prompt: 'Approximately what is the investor\'s return in GBP terms?',
        options: ['13%', '8%', '3%', '2.9%'],
        answer: '2.9%',
        explanation: '1.08 ÷ 1.05 − 1 ≈ 2.9%. A stronger home currency erodes foreign gains — divide (don\'t subtract) the FX move from the asset return.',
      },
      {
        context: 'An analyst forecasts revenue growing 8% a year for 3 years from a base of £150m.',
        prompt: 'What is revenue after 3 years (nearest £m)?',
        options: ['£186m', '£189m', '£195m', '£174m'],
        answer: '£189m',
        explanation: '150 × 1.08³ = 150 × 1.2597 ≈ £189m. Compounding, not multiplying by 1.24 (3×8%).',
      },
      {
        context: 'A company has 400,000 shares outstanding trading at £12.50, and net debt of £1.2m.',
        prompt: 'What is its enterprise value?',
        options: ['£5.0m', '£6.2m', '£3.8m', '£4.8m'],
        answer: '£6.2m',
        explanation: 'Market cap = 400,000 × £12.50 = £5.0m. EV = 5.0m + 1.2m net debt = £6.2m.',
      },
      {
        context: 'Two funds: Fund X returned 15% with a 20% chance of losing money in any given year. Fund Y returned 9% with a 5% chance of losing money.',
        prompt: 'An investor prioritising downside protection over raw return would most likely prefer:',
        options: ['Fund X, for the higher return', 'Fund Y, for the lower loss probability', 'Both are identical', 'Neither — insufficient data on volatility'],
        answer: 'Fund Y, for the lower loss probability',
        explanation: 'This tests reading data with a stated preference (downside protection), not just picking the highest number — a common SHL data-interpretation trap.',
      },
      {
        context: 'A bond with 5 years to maturity and a duration of 4.2 currently yields 5%. Rates are expected to rise by 0.75%.',
        prompt: 'Approximately what price change should the bondholder expect?',
        options: ['-3.15%', '+3.15%', '-4.2%', '-0.75%'],
        answer: '-3.15%',
        explanation: 'Price change ≈ −duration × yield change = −4.2 × 0.75% = −3.15%. Rising rates hurt existing bond prices.',
      },
      {
        context: 'A retailer\'s like-for-like sales rose 4% while total sales rose 11%, with no store closures.',
        prompt: 'The gap between these two figures is best explained by:',
        options: ['Inflation', 'New store openings', 'Currency movements', 'A calculation error — this is impossible'],
        answer: 'New store openings',
        explanation: 'Like-for-like (same-store) sales strip out new/closed stores; total sales include them. A gap this size with no closures implies new stores added the extra growth.',
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
        explanation: 'The passage states analysts expected 0.25% and the bank delivered 0.5% — directly supported.',
      },
      {
        context: 'Passage: "The central bank raised interest rates by 0.5% in response to inflation reaching 8%. Analysts had expected a smaller rise of 0.25%. Following the announcement, the currency strengthened against the dollar."',
        prompt: 'Statement: The currency strengthened because of the rate rise.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'Cannot Say',
        explanation: 'The passage says the currency strengthened FOLLOWING the announcement — sequence, not proven causation. Classic verbal reasoning trap.',
      },
      {
        context: 'Passage: "Firm X\'s graduate scheme receives over 50,000 applications for roughly 400 places. Successful candidates typically complete three interview rounds and a numerical assessment. The firm states that academic background is only one of several criteria it considers."',
        prompt: 'Statement: Fewer than 1% of applicants receive a place.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: '400 ÷ 50,000 = 0.8%, which is below 1%. The passage supports this arithmetically.',
      },
      {
        context: 'Passage: "Firm X\'s graduate scheme receives over 50,000 applications for roughly 400 places. Successful candidates typically complete three interview rounds and a numerical assessment. The firm states that academic background is only one of several criteria it considers."',
        prompt: 'Statement: Candidates with poor grades are never hired.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'Cannot Say',
        explanation: 'The firm says academics are "one of several criteria" — that neither confirms nor rules out hiring candidates with poor grades.',
      },
      {
        context: 'Passage: "Index funds now account for over half of US equity fund assets. Their fees average below 0.1%, compared with roughly 0.7% for active funds. Some researchers argue this shift reduces the amount of price discovery in markets, though others dispute the effect is significant."',
        prompt: 'Statement: Researchers agree that index funds harm price discovery.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'False',
        explanation: 'The passage explicitly says others DISPUTE the effect — so "researchers agree" is contradicted by the text.',
      },
      {
        context: 'Passage: "Index funds now account for over half of US equity fund assets. Their fees average below 0.1%, compared with roughly 0.7% for active funds. Some researchers argue this shift reduces the amount of price discovery in markets, though others dispute the effect is significant."',
        prompt: 'Statement: Active funds charge roughly seven times more than index funds on average.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: '0.7% vs below 0.1% — roughly seven times (or more). Supported by the passage\'s own figures.',
      },
      {
        context: 'Passage: "The merger was approved by shareholders of both companies in March. Regulators in two of the three required jurisdictions have granted clearance. The companies expect completion by year end, subject to remaining approvals."',
        prompt: 'Statement: The merger has completed.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'False',
        explanation: 'Completion is "expected by year end, subject to remaining approvals" — one jurisdiction is still outstanding, so it has not completed.',
      },
      {
        context: 'Passage: "The merger was approved by shareholders of both companies in March. Regulators in two of the three required jurisdictions have granted clearance. The companies expect completion by year end, subject to remaining approvals."',
        prompt: 'Statement: The third regulator will block the merger.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'Cannot Say',
        explanation: 'The passage gives no information about the third regulator\'s likely decision — only that it hasn\'t yet cleared.',
      },
      {
        context: 'Passage: "Hedge fund launches fell to a decade low last year, while closures exceeded launches for the third consecutive year. Industry assets nonetheless reached a record high, driven by performance gains at existing funds and inflows to the largest managers."',
        prompt: 'Statement: The number of hedge funds is shrinking while industry assets are growing.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: 'Closures exceeding launches for three years means fewer funds; record assets means growth. Both are stated — consolidation into bigger funds.',
      },
      {
        context: 'Passage: "New rules require payment firms to reimburse most victims of authorised fraud within five business days. Industry groups warned the change could encourage complacency among consumers, while consumer advocates said firms had for too long avoided responsibility. The rules exclude claims below £100."',
        prompt: 'Statement: All fraud victims will be reimbursed under the new rules.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'False',
        explanation: 'The passage says MOST victims, and explicitly excludes claims below £100 — so "all" is contradicted.',
      },
      {
        context: 'Passage: "New rules require payment firms to reimburse most victims of authorised fraud within five business days. Industry groups warned the change could encourage complacency among consumers, while consumer advocates said firms had for too long avoided responsibility. The rules exclude claims below £100."',
        prompt: 'Statement: Industry groups and consumer advocates disagree about the rules.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: 'Industry warns of complacency (critical); advocates welcome accountability (supportive). Opposing stances are directly presented.',
      },
      {
        context: 'Passage: "New rules require payment firms to reimburse most victims of authorised fraud within five business days. Industry groups warned the change could encourage complacency among consumers, while consumer advocates said firms had for too long avoided responsibility. The rules exclude claims below £100."',
        prompt: 'Statement: Fraud rates will rise as a result of the new rules.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'Cannot Say',
        explanation: 'Industry groups WARNED complacency could result — a prediction, not a stated fact. The passage doesn\'t establish what will actually happen.',
      },
      {
        context: 'Passage: "Funds marketed as sustainable attracted record inflows last year, though definitions of \'sustainable\' vary widely between providers. A regulator\'s review found that a third of funds examined could not adequately evidence their sustainability claims. New labelling requirements take effect next year."',
        prompt: 'Statement: A third of all sustainable funds cannot evidence their claims.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'Cannot Say',
        explanation: 'A third of funds EXAMINED in the review — not of all funds. Generalising from a sample to the whole population is a classic trap.',
      },
      {
        context: 'Passage: "Funds marketed as sustainable attracted record inflows last year, though definitions of \'sustainable\' vary widely between providers. A regulator\'s review found that a third of funds examined could not adequately evidence their sustainability claims. New labelling requirements take effect next year."',
        prompt: 'Statement: The labelling requirements are already in force.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'False',
        explanation: 'The passage states they take effect NEXT year — directly contradicting "already in force".',
      },
      {
        context: 'Passage: "Funds marketed as sustainable attracted record inflows last year, though definitions of \'sustainable\' vary widely between providers. A regulator\'s review found that a third of funds examined could not adequately evidence their sustainability claims. New labelling requirements take effect next year."',
        prompt: 'Statement: There is no single agreed definition of a sustainable fund.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: '"Definitions vary widely between providers" directly supports the absence of a single agreed definition.',
      },
      {
        context: 'Passage: "The bank\'s trading division reported a record quarter, with revenue up 34% year-on-year, driven primarily by fixed income volatility. However, the wealth management division saw outflows for the second consecutive quarter as clients shifted towards passive products."',
        prompt: 'Statement: The bank\'s overall quarterly profit rose 34%.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'Cannot Say',
        explanation: 'The 34% figure applies to trading division REVENUE specifically, not overall bank profit — the passage gives no overall figure, and wealth management is explicitly weaker.',
      },
      {
        context: 'Passage: "The bank\'s trading division reported a record quarter, with revenue up 34% year-on-year, driven primarily by fixed income volatility. However, the wealth management division saw outflows for the second consecutive quarter as clients shifted towards passive products."',
        prompt: 'Statement: Wealth management clients are moving towards passive investment products.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: 'Directly stated as the reason for the outflows.',
      },
      {
        context: 'Passage: "A survey of 2,000 finance professionals found that 68% considered AI tools essential to their daily work, up from 41% two years earlier. Younger respondents were more likely to report daily AI use, though the survey did not ask about which specific tools were used."',
        prompt: 'Statement: The survey shows ChatGPT is the most-used AI tool among finance professionals.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'False',
        explanation: 'The passage explicitly states the survey did NOT ask about specific tools — so any claim about a specific tool is contradicted by the text, not merely unproven.',
      },
      {
        context: 'Passage: "A survey of 2,000 finance professionals found that 68% considered AI tools essential to their daily work, up from 41% two years earlier. Younger respondents were more likely to report daily AI use, though the survey did not ask about which specific tools were used."',
        prompt: 'Statement: Perceived reliance on AI tools has grown over the two-year period covered.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'True',
        explanation: '68% up from 41% is a direct, stated increase.',
      },
      {
        context: 'Passage: "Three candidates were shortlisted for the analyst role. Candidate A scored highest on the numerical test but was rated weakest at interview. Candidate B scored lowest on the numerical test but impressed most at interview. The firm ultimately hired Candidate C, who scored in the middle on both."',
        prompt: 'Statement: The firm always hires the candidate who performs best in interview.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'False',
        explanation: 'Candidate B interviewed best but was NOT hired — Candidate C was, despite only middling scores on both measures. This directly contradicts the statement.',
      },
      {
        context: 'Passage: "Three candidates were shortlisted for the analyst role. Candidate A scored highest on the numerical test but was rated weakest at interview. Candidate B scored lowest on the numerical test but impressed most at interview. The firm ultimately hired Candidate C, who scored in the middle on both."',
        prompt: 'Statement: Candidate C was hired because of consistency across both measures rather than a standout score on either.',
        options: ['True', 'False', 'Cannot Say'],
        answer: 'Cannot Say',
        explanation: 'The passage states C scored in the middle on both and was hired — but never states WHY the firm chose C. Inferring the reason, even a plausible one, goes beyond what\'s written.',
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
        explanation: 'Simple alternation: filled, empty, filled, empty... Next must be empty ○.',
      },
      {
        shapes: '▲  ▲▲  ▲▲▲  ▲▲▲▲  ?',
        prompt: 'What comes next?',
        options: ['▲▲▲', '▲▲▲▲', '▲▲▲▲▲', '▲'],
        answer: '▲▲▲▲▲',
        explanation: 'The count increases by one each step: 1, 2, 3, 4 → 5 triangles.',
      },
      {
        shapes: '◐  ◓  ◑  ◒  ?',
        prompt: 'The half-filled circle rotates each step. What comes next?',
        options: ['◐', '◓', '◑', '◒'],
        answer: '◐',
        explanation: 'The fill rotates 90° clockwise each step (left, top, right, bottom). After bottom it returns to left: ◐.',
      },
      {
        shapes: '■ ●  |  ● ■  |  ■ ●  |  ?',
        prompt: 'What comes next?',
        options: ['■ ●', '● ■', '■ ■', '● ●'],
        answer: '● ■',
        explanation: 'The pair swaps positions each step. After ■●, the next is ●■.',
      },
      {
        shapes: '○  ◔  ◑  ◕  ?',
        prompt: 'The circle fills progressively. What comes next?',
        options: ['●', '○', '◔', '◑'],
        answer: '●',
        explanation: 'Fill increases by a quarter each step: empty, quarter, half, three-quarters → full ●.',
      },
      {
        shapes: '△ △ ▲  |  □ □ ■  |  ○ ○ ?',
        prompt: 'Each group follows the same rule. What completes the third group?',
        options: ['○', '●', '△', '■'],
        answer: '●',
        explanation: 'Each group is: empty, empty, filled version of the same shape. So the circles end with a filled ●.',
      },
      {
        shapes: '★ 1  |  ★★ 2  |  ★★★★ 3  |  ★★★★★★★★ 4  |  ? 5',
        prompt: 'How many stars are in the 5th group?',
        options: ['10', '12', '16', '9'],
        answer: '16',
        explanation: 'Stars double each step: 1, 2, 4, 8 → 16. Geometric, not arithmetic, progression.',
      },
      {
        shapes: '◆ ■ ●  |  ■ ● ◆  |  ● ◆ ■  |  ?',
        prompt: 'What comes next?',
        options: ['◆ ■ ●', '● ■ ◆', '■ ◆ ●', '◆ ● ■'],
        answer: '◆ ■ ●',
        explanation: 'Each shape shifts one position left, with the first wrapping to the end. After three steps the cycle returns to the start: ◆ ■ ●.',
      },
      {
        shapes: '2 △  |  4 □  |  6 ⬠  |  8 ⬡  |  10 ?',
        prompt: 'The number and shape are linked. What shape accompanies 10?',
        options: ['A triangle', 'A circle', 'A seven-sided shape (heptagon)', 'A ten-sided shape'],
        answer: 'A seven-sided shape (heptagon)',
        explanation: 'Sides: 3, 4, 5, 6 — increasing by one while numbers rise by 2. Next: 7 sides. Track BOTH sequences independently.',
      },
      {
        shapes: '●○○  ○●○  ○○●  ○●○  ?',
        prompt: 'The filled circle moves. What comes next?',
        options: ['●○○', '○●○', '○○●', '●●●'],
        answer: '●○○',
        explanation: 'The dot bounces: position 1, 2, 3, 2 → back to 1. A "ping-pong" pattern rather than a loop.',
      },
      {
        shapes: '▲▽  ▽▲  ▲▽  ▽▲  ?',
        prompt: 'What comes next?',
        options: ['▲▽', '▽▲', '▲▲', '▽▽'],
        answer: '▲▽',
        explanation: 'Two states alternating: ▲▽, ▽▲, ▲▽, ▽▲ → ▲▽ again. Odd positions match the first state.',
      },
      {
        shapes: '① ▲  |  ② ▲▲  |  ③ ▲▲▲▲  |  ④ ▲▲▲▲▲▲▲',
        prompt: 'Triangles added each step: +1, +2, +3... How many triangles at step ⑤?',
        options: ['9', '10', '11', '12'],
        answer: '11',
        explanation: 'Counts: 1, 2, 4, 7 — differences of 1, 2, 3. Next difference is 4: 7 + 4 = 11. Second-order (accelerating) sequences are a favourite.',
      },
      {
        shapes: '↑  →  ↓  ←  ?',
        prompt: 'The arrow rotates. What comes next?',
        options: ['↑', '→', '↓', '←'],
        answer: '↑',
        explanation: '90° clockwise each step: up, right, down, left → back to up.',
      },
      {
        shapes: '▲▲▲▲▲  ▲▲▲▲  ▲▲▲  ▲▲  ?',
        prompt: 'What comes next?',
        options: ['▲▲', '▲', 'Nothing', '▲▲▲'],
        answer: '▲',
        explanation: 'The count decreases by one each step: 5, 4, 3, 2 → 1 triangle.',
      },
      {
        shapes: 'A△  B□  C⬠  D⬡  E?',
        prompt: 'Letters advance and shapes gain sides. What shape pairs with E?',
        options: ['A triangle (3 sides)', 'A hexagon (6 sides)', 'A heptagon (7 sides)', 'A square (4 sides)'],
        answer: 'A heptagon (7 sides)',
        explanation: 'Sides: 3, 4, 5, 6 as letters advance A→E. E pairs with 7 sides. Two independent progressions moving together.',
      },
      {
        shapes: '■□■  □■□  ■□■  ?',
        prompt: 'What comes next?',
        options: ['■□■', '□■□', '■■■', '□□□'],
        answer: '□■□',
        explanation: 'The whole triplet inverts each step (every square flips fill). After ■□■ comes □■□.',
      },
      {
        shapes: '★ 1  |  ★ 1  |  ★★ 2  |  ★★★ 3  |  ★★★★★ 5  |  ? ',
        prompt: 'How many stars come next?',
        options: ['6', '7', '8', '10'],
        answer: '8',
        explanation: 'Fibonacci: each count is the sum of the previous two — 1, 1, 2, 3, 5 → 8.',
      },
      {
        shapes: '◢  ◣  ◤  ◥  ?',
        prompt: 'The corner triangle rotates. What comes next?',
        options: ['◢', '◣', '◤', '◥'],
        answer: '◢',
        explanation: 'The filled corner moves anticlockwise through all four positions, then cycles back to the first: ◢.',
      },
      {
        shapes: '●·  ·●  ●·  ·●  ?',
        prompt: 'What comes next?',
        options: ['●·', '·●', '●●', '··'],
        answer: '●·',
        explanation: 'The large dot alternates between first and second position. Odd steps have it first: ●·.',
      },
      {
        shapes: '○○○○  ●○○○  ●●○○  ●●●○  ?',
        prompt: 'What comes next?',
        options: ['●●●●', '○○○○', '●●○○', '○●●●'],
        answer: '●●●●',
        explanation: 'One more circle fills from the left each step: 0, 1, 2, 3 → all 4 filled.',
      },
      {
        shapes: '▢1  ▢▢2  ▢▢▢4  ▢▢▢▢▢7  ?',
        prompt: 'The count follows a hidden rule. How many squares in the 5th group?',
        options: ['9', '10', '11', '12'],
        answer: '11',
        explanation: 'Differences: +1, +2, +3 → next difference +4. 7 + 4 = 11. The same accelerating pattern as before, different shape.',
      },
      {
        shapes: '◇  ◈  ◆  ◈  ◇  ◈  ?',
        prompt: 'What comes next?',
        options: ['◇', '◈', '◆', 'None of these'],
        answer: '◆',
        explanation: 'The pattern is a bounce between three states: ◇ ◈ ◆ ◈ ◇ ◈ ◆... it mirrors back and forth, so after ◇ ◈ comes ◆ again.',
      },
      {
        shapes: '3+4=7  |  5+2=7  |  6+1=7  |  2+?=7',
        prompt: 'What number completes the pattern?',
        options: ['3', '4', '5', '9'],
        answer: '5',
        explanation: 'Every pair sums to 7 — a fixed-sum pattern rather than a sequence. 2 + 5 = 7.',
      },
      {
        shapes: '⬡⬡⬡  |  ⬡⬡●  |  ⬡●●  |  ?',
        prompt: 'What comes next?',
        options: ['●●●', '⬡⬡⬡', '⬡●●', '●⬡⬡'],
        answer: '●●●',
        explanation: 'One more hexagon converts to a filled dot each step, left to right: 0, 1, 2 → 3 filled dots.',
      },
      {
        shapes: '↖  ↗  ↘  ↙  ?',
        prompt: 'The diagonal arrow rotates. What comes next?',
        options: ['↖', '↗', '↘', '↙'],
        answer: '↖',
        explanation: '90° clockwise through the four diagonal directions, then back to the start: ↖.',
      },
      {
        shapes: '1 shape  |  3 shapes  |  6 shapes  |  10 shapes  |  ? shapes',
        prompt: 'This is the triangular number sequence. How many shapes come next?',
        options: ['13', '14', '15', '16'],
        answer: '15',
        explanation: 'Triangular numbers: add one more each time than the last gap (2, 3, 4, 5): 1, 3, 6, 10, 15. A very common inductive-reasoning pattern.',
      },
      {
        shapes: '■▲  ▲■  ■▲  ▲■  ■▲  ?',
        prompt: 'What comes next?',
        options: ['■▲', '▲■', '■■', '▲▲'],
        answer: '▲■',
        explanation: 'Simple two-step alternation. After 5 terms (odd count, back to ■▲), the 6th swaps again to ▲■.',
      },
      {
        shapes: '5△ 25□  |  4△ 16□  |  3△ 9□  |  2△ ?□',
        prompt: 'The square count relates to the triangle count. What replaces the ?',
        options: ['4', '6', '8', '2'],
        answer: '4',
        explanation: 'The square count is always the triangle count squared: 5²=25, 4²=16, 3²=9, so 2²=4.',
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
        explanation: 'Speed and honesty, through the right channel. Hiding it risks the client acting on wrong numbers; going direct to the client bypasses your manager and makes things worse.',
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
        explanation: 'Communicating conflicts early lets the seniors themselves resolve priorities — they usually don\'t know about each other\'s requests. Silent heroics fail unpredictably.',
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
        explanation: 'This is insider dealing — a criminal offence. You must decline AND report it: staying silent makes you complicit if it surfaces later. Options 1 and 4 are crimes.',
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
        explanation: 'Owning mistakes early with a solution attached is the single most valued junior behaviour. Silent fixes leave your manager presenting numbers they can\'t explain if questioned.',
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
        explanation: '"I\'ll confirm and come back to you" preserves credibility; a confident wrong answer destroys it. The follow-through is what actually builds trust.',
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
        explanation: 'Direct positive action fixes the situation without creating conflict. SJTs reward inclusion and credit-sharing — and punish both passivity and public confrontation.',
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
        explanation: 'Offering genuine help shows team spirit; "presenteeism" (staying to be seen) impresses nobody. If they don\'t need you, leaving is fine — you asked.',
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
        explanation: 'The professional sequence: address it directly first, escalate to your manager if it continues, HR after that. Gossip and work-to-rule damage you more than them.',
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
        explanation: 'Neither burn the client nor breach policy: pause, verify, and find the compliant way to serve them. "We always did it this way" is never a policy override.',
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
        explanation: 'Early warning with a plan lets managers re-scope, add help or reset expectations. Surprise failures on deadline day are the cardinal sin of junior work.',
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
        explanation: 'Direct human concern first — most firms\' SJTs reward colleague support. Escalation may follow if work risk grows, but leading with surveillance or gossip scores poorly.',
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
        explanation: 'Respectful, private, reasoned challenge is exactly what firms say they want ("obligation to dissent" at McKinsey). Silent compliance and public undermining both fail.',
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
        explanation: 'A week late is better than never — brief, specific, no ask. Building relationships before you need them is the whole point of networking.',
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
        explanation: 'Material information goes up the chain fast, without speculation or freelancing client contact. "Assume someone knows" is how firms get blindsided.',
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
        explanation: 'Interviewers see through fake weaknesses instantly. Genuine self-awareness plus a credible improvement plan is what the question is actually testing.',
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
        explanation: 'Fast disclosure lets your manager control the situation and any client conversation. Trying to quietly fix it yourself risks making a small error into a serious trust breach if it surfaces later.',
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
        explanation: 'You\'re not positioned to referee, but ignoring a team-damaging conflict isn\'t neutral either. Encourage direct resolution first, escalate to the actual manager if the impact persists.',
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
        explanation: 'Transparency about competing demands, framed as seeking guidance rather than refusing, respects hierarchy while surfacing a genuine conflict for them to resolve.',
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
        explanation: 'Proactive, specific, constructive feedback through the right channel improves things for everyone and reflects well on you — silence or public criticism both help no one.',
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
        explanation: 'Finance is a small, reputation-driven industry — how you leave a firm follows you. A clean, professional exit protects references and future opportunities.',
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
  function sampleFromCategory(cat: TestCategory, n: number): { q: TestQuestion; id: string }[] {
    const allowed = unlockedTiers(cat.id)
    const total = cat.questions.length
    const pool = cat.questions
      .map((q, i) => ({ q, id: `${cat.id}-${i}`, tier: difficultyForIndex(i, total) }))
      .filter(item => allowed.has(item.tier))
    const usablePool = pool.length >= n ? pool : cat.questions.map((q, i) => ({ q, id: `${cat.id}-${i}`, tier: difficultyForIndex(i, total) }))
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

        <div className="bg-brand-card border border-white/10 rounded-xl p-5 mb-8">
          <h2 className="text-white font-bold mb-2">🎚️ How difficulty tiers unlock</h2>
          <p className="text-gray-400 text-sm leading-relaxed">Every category starts with Easy questions only. <span className="text-white font-semibold">Medium</span> unlocks after your first attempt. <span className="text-white font-semibold">Hard</span> unlocks once you've done 3+ attempts averaging 70% or higher over your last 3 — mastery earns you the harder questions, not the other way round.</p>
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
                    {q.context && <p className="text-gray-500 text-xs mb-1 italic">{q.context}</p>}
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
        {q.context && (
          <div className="bg-brand-darker border border-white/5 rounded-xl p-4 mb-4">
            <p className="text-gray-300 text-sm leading-relaxed">{q.context}</p>
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
