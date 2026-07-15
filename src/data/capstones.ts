// Guided-wizard capstone modules: build a real (simplified) financial
// model step by step. Each step shows given assumptions, asks the user to
// calculate one number, and checks it against the correct answer within a
// tolerance — genuinely "doing the maths", not just reading about it.

export type CapstoneFormat = 'currency' | 'percent' | 'number' | 'years' | 'multiple'

export type GivenItem = { label: string; key: string; format: CapstoneFormat }

export type CapstoneStep = {
  id: string
  title: string
  narrative: string
  given: GivenItem[]
  question: string
  expected: (state: Record<string, number>) => number
  tolerancePct: number
  resultKey: string
  resultLabel: string
  format: CapstoneFormat
  explanation: (state: Record<string, number>, expectedVal: number) => string
  // Extra values computed silently (not asked/checked) needed by later steps
  derived?: (state: Record<string, number>) => Record<string, number>
}

export type Capstone = {
  id: string
  title: string
  icon: string
  description: string
  unitId: string
  initialState: Record<string, number>
  steps: CapstoneStep[]
  badgeName: string
}

export const capstones: Capstone[] = [
  {
    id: 'three-statement',
    title: 'Build a 3-Statement Model',
    icon: '📒',
    description: 'Walk revenue through to EBIT, net income, free cash flow and the ending cash balance — the core skill of every financial analyst.',
    unitId: 'accounting',
    initialState: { revenue: 500, growthPct: 8 },
    badgeName: '3-Statement Model Builder',
    steps: [
      {
        id: 'revenue',
        title: 'Step 1 — Revenue Build',
        narrative: 'Your company\'s current year revenue is £500m. Management guides to 8% growth next year.',
        given: [
          { label: 'Current Year Revenue', key: 'revenue', format: 'currency' },
          { label: 'Revenue Growth', key: 'growthPct', format: 'percent' },
        ],
        question: 'What is Next Year Revenue (£m)?',
        expected: s => s.revenue * (1 + s.growthPct / 100),
        tolerancePct: 1,
        resultKey: 'nextRevenue',
        resultLabel: 'Next Year Revenue',
        format: 'currency',
        explanation: (s, v) => `Next Year Revenue = Current Revenue × (1 + growth) = £${s.revenue}m × 1.${s.growthPct.toString().padEnd(2, '0')} = £${v.toFixed(0)}m.`,
      },
      {
        id: 'ebit',
        title: 'Step 2 — Gross Profit & EBIT',
        narrative: 'COGS runs at 40% of revenue, and operating expenses (SG&A) run at 35% of revenue.',
        given: [
          { label: 'Next Year Revenue', key: 'nextRevenue', format: 'currency' },
          { label: 'COGS % of Revenue', key: 'cogsPct', format: 'percent' },
          { label: 'Opex % of Revenue', key: 'opexPct', format: 'percent' },
        ],
        question: 'What is EBIT (£m)? (Revenue − COGS − Opex)',
        expected: s => s.nextRevenue - (s.nextRevenue * s.cogsPct) / 100 - (s.nextRevenue * s.opexPct) / 100,
        tolerancePct: 1,
        resultKey: 'ebit',
        resultLabel: 'EBIT',
        format: 'currency',
        explanation: (s, v) => `EBIT = Revenue × (1 − COGS% − Opex%) = £${s.nextRevenue.toFixed(0)}m × ${100 - s.cogsPct - s.opexPct}% = £${v.toFixed(0)}m.`,
        derived: () => ({ cogsPct: 40, opexPct: 35 }),
      },
      {
        id: 'net-income',
        title: 'Step 3 — Net Income',
        narrative: 'The company pays £15m of interest expense on its debt, and faces a 25% tax rate.',
        given: [
          { label: 'EBIT', key: 'ebit', format: 'currency' },
          { label: 'Interest Expense', key: 'interest', format: 'currency' },
          { label: 'Tax Rate', key: 'taxRatePct', format: 'percent' },
        ],
        question: 'What is Net Income (£m)? (EBIT − Interest, then apply tax)',
        expected: s => (s.ebit - s.interest) * (1 - s.taxRatePct / 100),
        tolerancePct: 1,
        resultKey: 'netIncome',
        resultLabel: 'Net Income',
        format: 'currency',
        explanation: (s, v) => `Pre-tax income = EBIT − Interest = £${s.ebit.toFixed(0)}m − £${s.interest}m = £${(s.ebit - s.interest).toFixed(0)}m. Net Income = that × (1 − 25%) = £${v.toFixed(0)}m.`,
        derived: () => ({ interest: 15, taxRatePct: 25 }),
      },
      {
        id: 'fcf',
        title: 'Step 4 — Free Cash Flow',
        narrative: 'D&A is £20m (non-cash, added back). Capex is £25m. Working capital absorbs £5m of cash this year.',
        given: [
          { label: 'Net Income', key: 'netIncome', format: 'currency' },
          { label: 'D&A (add back)', key: 'da', format: 'currency' },
          { label: 'Capex', key: 'capex', format: 'currency' },
          { label: 'Increase in Working Capital', key: 'nwcIncrease', format: 'currency' },
        ],
        question: 'What is Free Cash Flow (£m)? (Net Income + D&A − Capex − Increase in NWC)',
        expected: s => s.netIncome + s.da - s.capex - s.nwcIncrease,
        tolerancePct: 1,
        resultKey: 'fcf',
        resultLabel: 'Free Cash Flow',
        format: 'currency',
        explanation: (s, v) => `FCF = Net Income + D&A − Capex − ΔNWC = ${s.netIncome.toFixed(0)}+${s.da}−${s.capex}−${s.nwcIncrease} = £${v.toFixed(0)}m.`,
        derived: () => ({ da: 20, capex: 25, nwcIncrease: 5 }),
      },
      {
        id: 'ending-cash',
        title: 'Step 5 — Ending Cash Balance',
        narrative: 'The company started the year with £60m of cash and repaid £30m of debt this year.',
        given: [
          { label: 'Beginning Cash', key: 'beginningCash', format: 'currency' },
          { label: 'Free Cash Flow', key: 'fcf', format: 'currency' },
          { label: 'Debt Repayment', key: 'debtRepayment', format: 'currency' },
        ],
        question: 'What is the Ending Cash Balance (£m)? (Beginning Cash + FCF − Debt Repayment)',
        expected: s => s.beginningCash + s.fcf - s.debtRepayment,
        tolerancePct: 1,
        resultKey: 'endingCash',
        resultLabel: 'Ending Cash Balance',
        format: 'currency',
        explanation: (s, v) => `Ending Cash = Beginning Cash + FCF − Debt Repayment = ${s.beginningCash}+${s.fcf.toFixed(0)}−${s.debtRepayment} = £${v.toFixed(0)}m. This is exactly how the cash flow statement links to the balance sheet.`,
        derived: () => ({ beginningCash: 60, debtRepayment: 30 }),
      },
    ],
  },
  {
    id: 'lbo',
    title: 'Build an LBO Model',
    icon: '💰',
    description: 'Size the purchase price, structure the debt, model the paydown and calculate the fund\'s MOIC on exit — the core private equity exercise.',
    unitId: 'valuation',
    initialState: { ebitda: 80, entryMultiple: 9 },
    badgeName: 'LBO Model Builder',
    steps: [
      {
        id: 'purchase-price',
        title: 'Step 1 — Purchase Price',
        narrative: 'You\'re evaluating a buyout target with £80m of EBITDA. Comparable deals have traded at 9.0x EBITDA.',
        given: [
          { label: 'Target EBITDA', key: 'ebitda', format: 'currency' },
          { label: 'Entry Multiple', key: 'entryMultiple', format: 'multiple' },
        ],
        question: 'What is the Purchase Price / Enterprise Value (£m)?',
        expected: s => s.ebitda * s.entryMultiple,
        tolerancePct: 1,
        resultKey: 'purchasePrice',
        resultLabel: 'Purchase Price',
        format: 'currency',
        explanation: (s, v) => `Purchase Price = EBITDA × Entry Multiple = £${s.ebitda}m × ${s.entryMultiple}x = £${v.toFixed(0)}m.`,
      },
      {
        id: 'financing',
        title: 'Step 2 — Financing Structure',
        narrative: 'The PE firm plans to finance 60% of the purchase price with debt, funding the rest with equity.',
        given: [
          { label: 'Purchase Price', key: 'purchasePrice', format: 'currency' },
          { label: 'Debt % of Purchase Price', key: 'debtPct', format: 'percent' },
        ],
        question: 'What is the Equity Cheque required (£m)? (Purchase Price × (1 − Debt%))',
        expected: s => s.purchasePrice * (1 - s.debtPct / 100),
        tolerancePct: 1,
        resultKey: 'equityCheque',
        resultLabel: 'Equity Cheque',
        format: 'currency',
        explanation: (s, v) => `Debt = ${s.purchasePrice.toFixed(0)}×${s.debtPct}% = £${((s.purchasePrice * s.debtPct) / 100).toFixed(0)}m. Equity Cheque = Purchase Price − Debt = £${v.toFixed(0)}m.`,
        derived: s => ({ debtPct: 60, debtAmount: (s.purchasePrice * 60) / 100 }),
      },
      {
        id: 'paydown',
        title: 'Step 3 — Debt Paydown',
        narrative: 'Over the 5-year hold, the company generates £45m of free cash flow per year, all used to pay down debt.',
        given: [
          { label: 'Initial Debt', key: 'debtAmount', format: 'currency' },
          { label: 'Annual FCF for Paydown', key: 'annualFcf', format: 'currency' },
          { label: 'Hold Period', key: 'years', format: 'years' },
        ],
        question: 'What is the remaining Debt at exit (£m)? (Debt − FCF × Years, floor at 0)',
        expected: s => Math.max(s.debtAmount - s.annualFcf * s.years, 0),
        tolerancePct: 1,
        resultKey: 'exitDebt',
        resultLabel: 'Exit Debt',
        format: 'currency',
        explanation: (s, v) => `Total paydown = £${s.annualFcf}m × ${s.years} years = £${(s.annualFcf * s.years).toFixed(0)}m. Exit Debt = £${s.debtAmount.toFixed(0)}m − £${(s.annualFcf * s.years).toFixed(0)}m = £${v.toFixed(0)}m.`,
        derived: () => ({ annualFcf: 45, years: 5 }),
      },
      {
        id: 'exit-value',
        title: 'Step 4 — Exit Value',
        narrative: 'At exit, EBITDA has grown to £96m through operational improvements, and the fund sells at the same 9.0x multiple it paid.',
        given: [
          { label: 'Exit EBITDA', key: 'exitEbitda', format: 'currency' },
          { label: 'Exit Multiple', key: 'exitMultiple', format: 'multiple' },
        ],
        question: 'What is the Exit Enterprise Value (£m)?',
        expected: s => s.exitEbitda * s.exitMultiple,
        tolerancePct: 1,
        resultKey: 'exitEV',
        resultLabel: 'Exit Enterprise Value',
        format: 'currency',
        explanation: (s, v) => `Exit EV = Exit EBITDA × Exit Multiple = £${s.exitEbitda}m × ${s.exitMultiple}x = £${v.toFixed(0)}m.`,
        derived: () => ({ exitEbitda: 96, exitMultiple: 9 }),
      },
      {
        id: 'equity-proceeds',
        title: 'Step 5 — Equity Proceeds',
        narrative: 'Subtract remaining debt from Exit EV to find what equity holders actually receive.',
        given: [
          { label: 'Exit Enterprise Value', key: 'exitEV', format: 'currency' },
          { label: 'Exit Debt', key: 'exitDebt', format: 'currency' },
        ],
        question: 'What are the Equity Proceeds at exit (£m)?',
        expected: s => s.exitEV - s.exitDebt,
        tolerancePct: 1,
        resultKey: 'exitEquity',
        resultLabel: 'Exit Equity Proceeds',
        format: 'currency',
        explanation: (s, v) => `Equity Proceeds = Exit EV − Exit Debt = £${s.exitEV.toFixed(0)}m − £${s.exitDebt.toFixed(0)}m = £${v.toFixed(0)}m.`,
      },
      {
        id: 'moic',
        title: 'Step 6 — Returns (MOIC)',
        narrative: 'Compare exit equity proceeds to the original equity cheque to find the fund\'s money multiple.',
        given: [
          { label: 'Exit Equity Proceeds', key: 'exitEquity', format: 'currency' },
          { label: 'Original Equity Cheque', key: 'equityCheque', format: 'currency' },
        ],
        question: 'What is the MOIC (x)? (Exit Equity ÷ Entry Equity)',
        expected: s => s.exitEquity / s.equityCheque,
        tolerancePct: 3,
        resultKey: 'moic',
        resultLabel: 'MOIC',
        format: 'multiple',
        explanation: (s, v) => `MOIC = £${s.exitEquity.toFixed(0)}m ÷ £${s.equityCheque.toFixed(0)}m ≈ ${v.toFixed(2)}x. Over a 5-year hold, that's roughly a ${(((v ** (1 / 5)) - 1) * 100).toFixed(0)}% IRR — a strong, realistic PE outcome.`,
      },
    ],
  },
  {
    id: 'dcf',
    title: 'Build a DCF Valuation',
    icon: '📈',
    description: 'Project cash flows, discount them at WACC, calculate a terminal value and land on an enterprise value — the gold standard of valuation.',
    unitId: 'valuation',
    initialState: { fcf1: 100, fcfGrowthPct: 6, wacc: 9 },
    badgeName: 'DCF Valuation Builder',
    steps: [
      {
        id: 'fcf-projection',
        title: 'Step 1 — Free Cash Flow Projection',
        narrative: 'Year 1 free cash flow is £100m, projected to grow 6% a year.',
        given: [
          { label: 'Year 1 FCF', key: 'fcf1', format: 'currency' },
          { label: 'Annual FCF Growth', key: 'fcfGrowthPct', format: 'percent' },
        ],
        question: 'What is Year 2 FCF (£m)?',
        expected: s => s.fcf1 * (1 + s.fcfGrowthPct / 100),
        tolerancePct: 1,
        resultKey: 'fcf2',
        resultLabel: 'Year 2 FCF',
        format: 'currency',
        explanation: (s, v) => `Year 2 FCF = £${s.fcf1}m × 1.${s.fcfGrowthPct.toString().padEnd(2, '0')} = £${v.toFixed(1)}m.`,
        derived: s => {
          const g = 1 + s.fcfGrowthPct / 100
          const fcf2 = s.fcf1 * g
          const fcf3 = fcf2 * g
          const fcf4 = fcf3 * g
          const fcf5 = fcf4 * g
          return { fcf3, fcf4, fcf5 }
        },
      },
      {
        id: 'discount-year3',
        title: 'Step 2 — Discounting a Cash Flow',
        narrative: 'The company\'s WACC is 9%. Discount Year 3\'s cash flow back to today.',
        given: [
          { label: 'Year 3 FCF', key: 'fcf3', format: 'currency' },
          { label: 'WACC', key: 'wacc', format: 'percent' },
          { label: 'Year Number', key: 'yearNum3', format: 'years' },
        ],
        question: 'What is the Present Value of Year 3\'s FCF (£m)? (FCF ÷ (1+WACC)^year)',
        expected: s => s.fcf3 / Math.pow(1 + s.wacc / 100, s.yearNum3),
        tolerancePct: 2,
        resultKey: 'pvFcf3',
        resultLabel: 'PV of Year 3 FCF',
        format: 'currency',
        explanation: (s, v) => `PV = £${s.fcf3.toFixed(1)}m ÷ 1.${s.wacc}³ ≈ £${v.toFixed(1)}m. This is the entire idea of discounting — future cash is worth less today.`,
        derived: () => ({ yearNum3: 3 }),
      },
      {
        id: 'terminal-value',
        title: 'Step 3 — Terminal Value',
        narrative: 'Beyond Year 5, assume cash flows grow at a perpetual 2.5% rate forever.',
        given: [
          { label: 'Year 5 FCF', key: 'fcf5', format: 'currency' },
          { label: 'WACC', key: 'wacc', format: 'percent' },
          { label: 'Perpetuity Growth Rate', key: 'terminalGrowthPct', format: 'percent' },
        ],
        question: 'What is the Terminal Value at Year 5 (£m)? (FCF5×(1+g) ÷ (WACC−g))',
        expected: s => (s.fcf5 * (1 + s.terminalGrowthPct / 100)) / ((s.wacc - s.terminalGrowthPct) / 100),
        tolerancePct: 2,
        resultKey: 'terminalValue',
        resultLabel: 'Terminal Value',
        format: 'currency',
        explanation: (s, v) => `TV = FCF5×(1+g) ÷ (WACC−g) = £${(s.fcf5 * (1 + s.terminalGrowthPct / 100)).toFixed(0)}m ÷ ${(s.wacc - s.terminalGrowthPct).toFixed(1)}% ≈ £${v.toFixed(0)}m. This single number is usually 60-80% of total DCF value.`,
        derived: () => ({ terminalGrowthPct: 2.5 }),
      },
      {
        id: 'pv-terminal',
        title: 'Step 4 — PV of Terminal Value',
        narrative: 'Discount the Terminal Value back 5 years to today, exactly like any other cash flow.',
        given: [
          { label: 'Terminal Value', key: 'terminalValue', format: 'currency' },
          { label: 'WACC', key: 'wacc', format: 'percent' },
          { label: 'Year Number', key: 'yearNum5', format: 'years' },
        ],
        question: 'What is the Present Value of the Terminal Value (£m)?',
        expected: s => s.terminalValue / Math.pow(1 + s.wacc / 100, s.yearNum5),
        tolerancePct: 2,
        resultKey: 'pvTerminalValue',
        resultLabel: 'PV of Terminal Value',
        format: 'currency',
        explanation: (s, v) => `PV of TV = £${s.terminalValue.toFixed(0)}m ÷ 1.${s.wacc}⁵ ≈ £${v.toFixed(0)}m.`,
        derived: () => ({ yearNum5: 5, pvFcfSum: 420 }),
      },
      {
        id: 'enterprise-value',
        title: 'Step 5 — Enterprise Value',
        narrative: 'The sum of Years 1–5\'s discounted cash flows comes to £420m (already calculated for you, for brevity). Add the discounted terminal value to get total Enterprise Value.',
        given: [
          { label: 'PV of Years 1–5 FCF (sum)', key: 'pvFcfSum', format: 'currency' },
          { label: 'PV of Terminal Value', key: 'pvTerminalValue', format: 'currency' },
        ],
        question: 'What is the Enterprise Value (£m)?',
        expected: s => s.pvFcfSum + s.pvTerminalValue,
        tolerancePct: 2,
        resultKey: 'enterpriseValue',
        resultLabel: 'Enterprise Value',
        format: 'currency',
        explanation: (s, v) => `EV = PV of explicit FCFs + PV of Terminal Value = £${s.pvFcfSum}m + £${s.pvTerminalValue.toFixed(0)}m ≈ £${v.toFixed(0)}m. You've just built a full DCF from scratch.`,
      },
    ],
  },
]
