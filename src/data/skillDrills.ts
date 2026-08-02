export type Drill = {
  title: string
  question: string
  answer?: number          // numeric answer, if checkable
  unit?: string
  tolerancePct?: number    // how close counts as right (estimation questions are generous)
  steps: string[]          // the "how to get there" working
  technique: string        // the transferable lesson
}

export type SkillTrack = {
  id: string
  role: string
  icon: string
  color: string
  border: string
  whatTheyTest: string
  coreSkills: string[]
  rulesOfThumb: { rule: string; detail: string }[]
  drills: Drill[]
  generalTips: string[]
}

export const skillTracks: SkillTrack[] = [
  // ============================= TRADING =============================
  {
    id: 'trading',
    role: 'Trading & Markets',
    icon: '📟',
    color: 'text-red-400',
    border: 'border-red-500/30',
    whatTheyTest:
      'Trading interviews barely test finance knowledge. They test how fast and how well you reason under pressure with incomplete information: mental arithmetic, probability, expected value, and whether you can price something you have never seen before without freezing. Firms like Optiver, IMC, Jane Street and Flow Traders run timed maths rounds before you speak to a human.',
    coreSkills: [
      'Mental arithmetic at speed, no calculator',
      'Expected value — the single most tested concept',
      'Making a two-way market and managing being filled',
      'Fermi estimation from known anchors',
      'Probability, especially conditional probability',
      'Staying calm and thinking aloud when you do not know',
    ],
    rulesOfThumb: [
      { rule: 'EV = Σ (probability × payoff)', detail: 'Play any game where EV is positive; refuse where it is negative. Almost every trading brainteaser reduces to this.' },
      { rule: 'Quote around your estimate, not at it', detail: 'If you think fair value is 100, quote 95 at 105. Your spread is your protection against being wrong.' },
      { rule: 'Widen when uncertain', detail: 'Less confident means a wider spread, not a refusal to quote. Refusing to quote fails the exercise instantly.' },
      { rule: 'UK ≈ 68m people, ~28m households', detail: 'Anchor almost every UK estimation on these two numbers.' },
      { rule: 'Duration × rate move = % price change', detail: 'Duration 5, rates +1% → roughly −5% price. Sign always opposite.' },
    ],
    drills: [
      {
        title: 'Expected value — should you play?',
        question: 'I roll a fair six-sided die. You win £12 if it lands on a 6, and lose £2 otherwise. Should you play, and what is the expected value per roll?',
        answer: 0.33,
        unit: '£ per roll',
        tolerancePct: 15,
        steps: [
          'Identify the outcomes and probabilities: 1/6 chance of a 6, 5/6 chance of anything else.',
          'Multiply each payoff by its probability: (1/6 × £12) = £2.00, and (5/6 × −£2) = −£1.67.',
          'Sum them: £2.00 − £1.67 = +£0.33 per roll.',
          'EV is positive, so yes — play, and play as many times as allowed. Over 600 rolls you would expect roughly +£200.',
        ],
        technique: 'Never answer "yes it feels good" — always compute Σ(probability × payoff). Interviewers are checking whether you instinctively quantify rather than react. If EV is positive, the follow-up is usually "how much would you bet?", where the answer involves your bankroll, not just the edge.',
      },
      {
        title: 'Make me a market',
        question: 'Make me a market on the number of London Underground stations. (Give a bid and an ask — the price you would buy at and sell at.)',
        answer: 272,
        unit: 'stations (true value)',
        tolerancePct: 40,
        steps: [
          'Anchor with what you know: 11 or so lines, and a large line like the Central or District has maybe 40-50 stations.',
          'Estimate: 11 lines × ~30 stations average = 330, but many stations serve several lines, so scale down for double-counting — call it ~250.',
          'Quote a market around that estimate with a spread reflecting your confidence: "230 at 280".',
          'The true figure is 272, which sits inside that quote — a good outcome.',
          'Expect the interviewer to trade against you: if they say "I buy at 280", you are now short 280 and should reason about whether to hedge or requote.',
        ],
        technique: 'The number matters far less than the process. Quote a range around your estimate, justify both sides aloud, and never refuse to quote. When they trade against you, they are testing whether you understand you now hold a position — say what you would do next rather than going quiet.',
      },
      {
        title: 'Fermi estimation',
        question: 'How many petrol stations are there in the UK? Estimate from first principles.',
        answer: 8300,
        unit: 'stations (true value ≈8,300)',
        tolerancePct: 60,
        steps: [
          'Anchor on population: ~68m people in the UK.',
          'Cars: roughly one car per two people → ~33m cars. (True figure is about 33m — a good anchor to remember.)',
          'Fill-ups: an average car fills up perhaps every 2 weeks → 26 fills per year → ~860m fill-ups a year.',
          'Capacity: a station might serve ~250 cars a day → ~90,000 fills a year per station.',
          '860m ÷ 90,000 ≈ 9,500 stations. True answer is about 8,300 — well within a good estimate.',
          'State your answer as a range: "I would say roughly 8,000-10,000."',
        ],
        technique: 'Always build from population or households, state every assumption aloud, and use round numbers you can divide easily. Interviewers score the structure, not the accuracy. Finish with a sanity check: does 9,500 stations for 68m people feel plausible? That is roughly one per 7,000 people — reasonable.',
      },
      {
        title: 'Conditional probability',
        question: 'I flip two fair coins and tell you at least one is heads. What is the probability both are heads?',
        answer: 0.3333,
        unit: 'probability',
        tolerancePct: 5,
        steps: [
          'List every equally likely outcome: HH, HT, TH, TT.',
          'The information "at least one is heads" eliminates TT, leaving three outcomes: HH, HT, TH.',
          'Only one of those three is both heads.',
          'So the probability is 1/3 ≈ 0.333 — not 1/2.',
        ],
        technique: 'The instinctive answer is 1/2 and it is wrong. When you are given information, enumerate the full sample space first, then cross out what the information rules out. Writing out all four outcomes takes five seconds and prevents the single most common trading-interview error.',
      },
      {
        title: 'Fast percentage under pressure',
        question: 'A bond portfolio worth £240m has a duration of 6.5. Rates rise 0.75%. Approximately how much value is lost?',
        answer: 11.7,
        unit: '£m',
        tolerancePct: 10,
        steps: [
          'Price change ≈ −duration × rate change = −6.5 × 0.75% = −4.875%.',
          'Round to make it mental: call it −5%.',
          '5% of £240m = £12m. So roughly a £12m loss.',
          'Precisely: 4.875% × 240 = £11.7m. The rounded estimate was close enough to answer instantly.',
        ],
        technique: 'Round aggressively to get a number out fast, then refine if asked. Saying "about £12m, more precisely £11.7m" is far stronger than five seconds of silence followed by an exact figure. Traders value a fast approximate answer over a slow perfect one.',
      },
    ],
    generalTips: [
      'Practise the mental maths sprint daily — trading firms genuinely filter on raw arithmetic speed before anything else.',
      'Think aloud constantly. Silence reads as freezing; even wrong reasoning spoken clearly scores better than a correct answer with no visible process.',
      'When you do not know something, say what you would need to know to work it out. That is exactly what traders do.',
      'Know where major markets are trading on the day of your interview: index levels, the 10-year gilt/Treasury yield, oil, GBP/USD.',
      'Expect to be pushed after you answer — "are you sure?" is usually a test of conviction, not a signal you are wrong. Defend your reasoning or update it for a real reason, not from pressure.',
    ],
  },

  // ============================= CONSULTING =============================
  {
    id: 'consulting',
    role: 'Consulting',
    icon: '📊',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    whatTheyTest:
      'Case interviews test structured thinking out loud. The maths is deliberately simple — it is your ability to break an ambiguous problem into a logical tree, do clean arithmetic without a calculator, and deliver a crisp answer-first recommendation that is actually being scored.',
    coreSkills: [
      'Market sizing from population anchors',
      'Profitability decomposition (the profit tree)',
      'Breakeven and contribution margin',
      'Clean mental arithmetic with big round numbers',
      'MECE structuring — no overlaps, no gaps',
      'Answer-first synthesis in 60 seconds',
    ],
    rulesOfThumb: [
      { rule: 'Profit = Revenue − Cost', detail: 'Revenue = Price × Volume. Costs split fixed vs variable. Nearly every profitability case decomposes down this tree.' },
      { rule: 'Breakeven = Fixed costs ÷ Contribution per unit', detail: 'Contribution = price − variable cost. This one formula solves a large share of case maths.' },
      { rule: 'UK 68m people / 28m households · US 335m / 130m', detail: 'Anchor every sizing question on one of these, then segment down.' },
      { rule: 'Rule of 72 for doubling', detail: '72 ÷ growth rate ≈ years to double. 8% → ~9 years.' },
      { rule: 'Always state assumptions aloud', detail: 'An examiner cannot follow your logic silently, and cannot give credit for what they cannot hear.' },
    ],
    drills: [
      {
        title: 'Market sizing',
        question: 'Estimate the annual UK market for coffee bought from coffee shops (not supermarket coffee), in £.',
        answer: 12,
        unit: '£bn (roughly)',
        tolerancePct: 50,
        steps: [
          'Start with population: 68m people in the UK.',
          'Segment to the relevant population: exclude young children and the very elderly → roughly 50m adults.',
          'Penetration: what share buy coffee out regularly? Say 60% → 30m regular buyers.',
          'Frequency: an average buyer might purchase 3 coffees a week → 156 a year.',
          'Price: average around £3.50 per cup.',
          '30m × 156 × £3.50 ≈ £16bn. Reality is roughly £10-13bn, so scale down slightly for occasional buyers — call it £12bn.',
          'Sanity check: £12bn ÷ 50m adults ≈ £240 per adult per year, or about £5 a week. Plausible.',
        ],
        technique: 'Population → segment → penetration → frequency → price. Use that chain every time. Round every number to something you can divide in your head, say each assumption out loud, and always finish with a sanity check — the check is what separates strong candidates.',
      },
      {
        title: 'Profitability decomposition',
        question: 'A retail client\'s profits fell 30% last year while revenue stayed flat. Where do you look, and what does flat revenue with falling profit tell you?',
        steps: [
          'Profit = Revenue − Costs. Revenue is flat, so by definition costs must have risen.',
          'Split costs: fixed (rent, salaries, insurance) vs variable (cost of goods, shipping, packaging).',
          'Ask which moved: a jump in fixed costs suggests new stores, rent reviews or headcount; a jump in variable costs suggests input prices, supplier changes or discounting.',
          'Note that flat revenue can itself hide a problem: price up with volume down, or vice versa. Decompose revenue into Price × Volume even though the total did not move.',
          'Prioritise: identify the largest cost line first and check it against last year before analysing anything small.',
        ],
        technique: 'Never start listing random causes. Walk the tree: Profit → Revenue and Costs → decompose whichever moved → decompose again. And always check whether a flat top-line is hiding offsetting price and volume moves — that catch impresses examiners.',
      },
      {
        title: 'Breakeven',
        question: 'A client is launching a product with £4.5m of fixed costs. It sells for £75 with a variable cost of £45 per unit. How many units to break even, and what if they discount the price by 10%?',
        answer: 150000,
        unit: 'units at full price',
        tolerancePct: 2,
        steps: [
          'Contribution per unit = price − variable cost = £75 − £45 = £30.',
          'Breakeven volume = fixed costs ÷ contribution = £4,500,000 ÷ £30 = 150,000 units.',
          'Now the discount: price falls 10% to £67.50, so contribution falls to £67.50 − £45 = £22.50.',
          'New breakeven = £4,500,000 ÷ £22.50 = 200,000 units.',
          'Insight: a 10% price cut required a 33% increase in volume just to stand still.',
        ],
        technique: 'The insight matters more than the number. Small price changes hit contribution disproportionately because variable costs do not fall with price — this is the single most useful commercial point you can make in a pricing case, and interviewers wait for it.',
      },
      {
        title: 'Growth maths',
        question: 'A market is worth £800m and growing 9% a year. Roughly how big is it in 8 years, and how long until it doubles?',
        answer: 1600,
        unit: '£m in 8 years (approx)',
        tolerancePct: 15,
        steps: [
          'Doubling time via rule of 72: 72 ÷ 9 = 8 years.',
          'So in 8 years the market roughly doubles: £800m → about £1.6bn.',
          'Cross-check precisely: 1.09^8 = 1.99, so £800m × 1.99 ≈ £1.59bn. The rule of 72 was essentially exact.',
          'For a different horizon, say 4 years, that is half a doubling: multiply by roughly 1.41 (the square root of 2) → about £1.13bn.',
        ],
        technique: 'The rule of 72 removes the need for compound arithmetic in your head. Learn that half a doubling is ×1.41 and a quarter is ×1.19, and you can approximate almost any growth question in seconds.',
      },
      {
        title: 'Synthesis under time pressure',
        question: 'You have done the analysis. The market is £2bn growing 10%, your client can win maybe 8% share in three years, and margins are 15%. Give your 45-second recommendation.',
        steps: [
          'Lead with the answer, never the journey: "I recommend entering this market."',
          'Give three supporting reasons, each one line: the market is large and growing at 10%; 8% share in three years implies roughly £210m of revenue on a market that has grown to £2.6bn; at 15% margins that is around £30m of profit.',
          'State the main risk honestly: the 8% share assumption is the whole case — if the true achievable share is 4%, the economics halve.',
          'Close with the next step: "I would prioritise validating achievable share through customer research before committing capital."',
        ],
        technique: 'Answer → three reasons → risk → next step. Never re-narrate your analysis chronologically. Interviewers score the synthesis heavily because it is the closest proxy for how you would actually speak to a client.',
      },
    ],
    generalTips: [
      'Do 30+ live practice cases with a partner before your first real one. Reading case books alone does not work — the skill is verbal.',
      'Ask clarifying questions before structuring, but only two or three. Endless clarifying reads as stalling.',
      'Write your structure down and show it. Examiners want to see a visible tree, not hear a stream of consciousness.',
      'When doing maths, narrate it: "so 30 million times 156 is about 4.7 billion cups". Silent calculation gives them nothing to score.',
      'If you get a number badly wrong, say so and correct it calmly. Recovering well is itself assessed.',
    ],
  },

  // ============================= INVESTMENT BANKING =============================
  {
    id: 'investment-banking',
    role: 'Investment Banking',
    icon: '🏢',
    color: 'text-yellow-400',
    border: 'border-yellow-500/30',
    whatTheyTest:
      'IB interviews test whether you have genuinely learned the technical core — valuation, accounting linkages and deal mechanics — and whether you can produce the standard answers fluently under mild pressure. The maths is not hard, but hesitation on the classics reads as unprepared.',
    coreSkills: [
      'Enterprise value to equity value bridge',
      'The three statements and how they link',
      'DCF mechanics and terminal value',
      'Multiples and when each applies',
      'Accretion / dilution intuition',
      'Explaining all of it in under 60 seconds',
    ],
    rulesOfThumb: [
      { rule: 'EV = Equity value + net debt', detail: 'Add debt, subtract cash. Reverse it to bridge back to equity value.' },
      { rule: 'Match the metric to the value', detail: 'EV pairs with pre-interest metrics (EBITDA, revenue). Equity value pairs with post-interest metrics (net income, EPS).' },
      { rule: 'Terminal value = FCF × (1+g) ÷ (WACC − g)', detail: 'Usually 60-80% of total DCF value, which is why small assumption changes swing valuations so much.' },
      { rule: 'All-stock deal accretion test', detail: 'Buying a company on a lower P/E than yours is accretive to EPS; higher P/E is dilutive.' },
      { rule: 'Precedent transactions > trading comps', detail: 'Deal multiples include a control premium, typically 20-40%, so they sit highest on a football field.' },
    ],
    drills: [
      {
        title: 'EV to equity bridge',
        question: 'A company has 80m shares at £14.50, debt of £420m, cash of £75m, and minority interest of £30m. What is enterprise value, and what is equity value?',
        answer: 1535,
        unit: '£m enterprise value',
        tolerancePct: 2,
        steps: [
          'Equity value (market cap) = 80m shares × £14.50 = £1,160m.',
          'Net debt = debt − cash = £420m − £75m = £345m.',
          'EV = equity value + net debt + minority interest = 1,160 + 345 + 30 = £1,535m.',
          'To reverse it: equity value = EV − net debt − minority interest = 1,535 − 345 − 30 = £1,160m.',
        ],
        technique: 'Bridge errors are the most common technical slip in IB interviews, and interviewers probe deliberately. Remember why cash is subtracted: a buyer acquiring the whole business effectively gets the cash back, so it reduces the true cost.',
      },
      {
        title: 'The classic depreciation question',
        question: 'Depreciation increases by £10. Walk me through all three statements, assuming a 25% tax rate.',
        answer: 7.5,
        unit: '£ fall in net income',
        tolerancePct: 5,
        steps: [
          'Income statement: EBIT falls by £10. At a 25% tax rate, net income falls by £7.50.',
          'Cash flow statement: start with net income down £7.50, then add back the £10 non-cash depreciation → cash actually increases by £2.50.',
          'Balance sheet: PP&E falls £10, cash rises £2.50, so assets fall £7.50 net.',
          'On the other side, retained earnings fall £7.50 through net income. Assets fall £7.50, equity falls £7.50 — the balance sheet balances.',
          'The intuition: depreciation is a tax shield. More of it means lower tax and therefore more cash.',
        ],
        technique: 'Practise saying this aloud until it takes 30 seconds. It is the definitive test of whether you actually understand the statement linkages, and almost every IB interview includes some version of it.',
      },
      {
        title: 'Quick DCF terminal value',
        question: 'Year 5 free cash flow is £140m, WACC is 9%, and the perpetuity growth rate is 2.5%. What is terminal value at year 5, and its present value today?',
        answer: 2208,
        unit: '£m terminal value',
        tolerancePct: 3,
        steps: [
          'TV = FCF₅ × (1 + g) ÷ (WACC − g) = £140m × 1.025 ÷ (0.09 − 0.025).',
          'Numerator: 140 × 1.025 = £143.5m. Denominator: 0.065.',
          'TV = 143.5 ÷ 0.065 = £2,208m at the end of year 5.',
          'Discount back 5 years: divide by 1.09⁵ = 1.539 → £2,208m ÷ 1.539 ≈ £1,435m present value.',
          'Note how large that is relative to five years of discounted cash flows — typically 60-80% of total DCF value.',
        ],
        technique: 'The denominator (WACC − g) is tiny, so small changes swing the answer enormously. If asked what happens when g rises from 2.5% to 3%, the denominator falls from 6.5% to 6% — an 8% jump in terminal value from a half-point assumption. Flagging that sensitivity unprompted signals real understanding.',
      },
      {
        title: 'Accretion / dilution intuition',
        question: 'Your company trades at 20x earnings. You acquire a target at 14x earnings in an all-stock deal. Is it accretive or dilutive, and why?',
        steps: [
          'In an all-stock deal, compare the P/E you pay against your own P/E.',
          'Your P/E of 20x means your "cost" of issuing equity is an earnings yield of 1/20 = 5%.',
          'The target at 14x delivers an earnings yield of 1/14 = 7.1%.',
          'You are acquiring earnings at 7.1% while paying away equity costing 5% — so EPS rises. The deal is accretive.',
          'Rule: in an all-stock deal, buying at a lower P/E than your own is always accretive before synergies.',
        ],
        technique: 'Reframing P/E as an earnings yield (1 ÷ P/E) makes accretion instantly intuitive rather than memorised. Add the caveat that accretive does not mean value-creating — you can overpay for a low-multiple business that is declining.',
      },
      {
        title: 'Multiples applied fast',
        question: 'A target has EBITDA of £62m. Comparable companies trade at 8.5x EBITDA, and recent deals happened at 11x. It has net debt of £150m. What is the implied equity value range?',
        answer: 527,
        unit: '£m equity value at 8.5x',
        tolerancePct: 3,
        steps: [
          'Trading comps: EV = £62m × 8.5 = £527m. Equity value = 527 − 150 net debt = £377m.',
          'Precedent transactions: EV = £62m × 11 = £682m. Equity value = 682 − 150 = £532m.',
          'So the implied equity value range is roughly £377m to £532m.',
          'The gap between the two reflects the control premium — deals price above where shares trade.',
        ],
        technique: 'Always finish by bridging from EV to equity value; candidates routinely stop at EV and answer the wrong question. And name why precedents sit higher — the control premium explanation is what interviewers are listening for.',
      },
    ],
    generalTips: [
      'Fluency beats depth at this level. A clean 45-second DCF walkthrough beats a rambling five-minute one.',
      'Prepare two or three recent deals in the group\'s sector: parties, price, multiple, rationale, financing, and your own view.',
      'Know your own CV cold — every line is fair game, and a weak answer on your own experience is unforgivable.',
      'Practise on paper without a calculator. Interviewers often hand you a pen and watch you work.',
      'When you do not know, say so and reason toward it. Bluffing a technical answer is far worse than admitting a gap.',
    ],
  },

  // ============================= PRIVATE EQUITY =============================
  {
    id: 'private-equity',
    role: 'Private Equity',
    icon: '💰',
    color: 'text-brand-teal',
    border: 'border-brand-teal/30',
    whatTheyTest:
      'PE interviews centre on the paper LBO — a returns calculation done on paper, without Excel, usually in under 10 minutes. They also test commercial judgement: whether this is a business worth owning, not just whether you can run the maths.',
    coreSkills: [
      'Paper LBO from entry to exit',
      'MOIC and IRR approximation without a calculator',
      'Debt paydown and cash sweep logic',
      'Decomposing returns into the three levers',
      'Judging business quality for leverage',
    ],
    rulesOfThumb: [
      { rule: 'IRR by memory — 5-year holds', detail: '2.0x ≈ 15% · 2.5x ≈ 20% · 3.0x ≈ 25% · 4.0x ≈ 32%. Memorise these four and you never need a calculator.' },
      { rule: 'IRR by memory — 3-year holds', detail: '1.5x ≈ 15% · 2.0x ≈ 26% · 2.5x ≈ 36% · 3.0x ≈ 44%.' },
      { rule: 'Three return levers', detail: 'Debt paydown, EBITDA growth, multiple expansion. Every deal\'s return decomposes into these three.' },
      { rule: 'Equity = EV − net debt, at both ends', detail: 'Entry equity is the cheque; exit equity is proceeds. MOIC is simply the ratio.' },
      { rule: 'Good LBO candidate', detail: 'Stable predictable cash flows, low capex, defensible market position, and an identifiable exit route.' },
    ],
    drills: [
      {
        title: 'Paper LBO — the full run',
        question: 'Entry: £90m EBITDA at 10x, funded 60% debt. Over 5 years EBITDA grows to £120m and £180m of debt is repaid. Exit at 10x. What is the MOIC and approximate IRR?',
        answer: 2.33,
        unit: 'x MOIC',
        tolerancePct: 5,
        steps: [
          'Entry EV = £90m × 10 = £900m. Debt = 60% × 900 = £540m. Equity cheque = £360m.',
          'Exit EV = £120m × 10 = £1,200m.',
          'Exit debt = £540m − £180m repaid = £360m.',
          'Exit equity = £1,200m − £360m = £840m.',
          'MOIC = £840m ÷ £360m = 2.33x.',
          'IRR over 5 years: 2.0x is about 15% and 2.5x is about 20%, so 2.33x sits around 18-19%.',
        ],
        technique: 'Do these in a fixed order every time: entry EV → debt and equity split → exit EV → exit debt → exit equity → MOIC → IRR. Never deviate, because the sequence prevents you losing your place under pressure. Say each number aloud as you go so the interviewer can follow.',
      },
      {
        title: 'IRR approximation without a calculator',
        question: 'A fund turns £250m of equity into £750m over 4 years. Approximately what IRR is that?',
        answer: 32,
        unit: '% IRR (approx)',
        tolerancePct: 15,
        steps: [
          'MOIC = £750m ÷ £250m = 3.0x.',
          'Anchor from memory: 3.0x over 5 years is about 25%, and over 3 years is about 44%.',
          '4 years sits between them, so the answer is roughly 32%.',
          'Cross-check with doubling logic: 3x in 4 years is a bit under two doublings; two doublings in 4 years would be 100% every 2 years, so this is clearly in the low 30s. Consistent.',
        ],
        technique: 'Memorise the MOIC-to-IRR table for 3 and 5 year holds and interpolate for anything between. Interviewers do not want an exact figure — they want to see that you have internalised the relationship between multiple and time.',
      },
      {
        title: 'Decomposing the return',
        question: 'In the paper LBO above (2.33x), how much of the return came from each of the three levers?',
        steps: [
          'Multiple expansion: entry and exit are both 10x, so this contributed nothing. Say so explicitly.',
          'EBITDA growth: EBITDA rose from £90m to £120m, a 33% increase. At a constant 10x, that alone added £300m of enterprise value.',
          'Debt paydown: £180m of debt repaid flows straight to equity holders.',
          'Total equity gain = £840m − £360m = £480m, of which £300m came from EBITDA growth and £180m from debt paydown.',
          'So roughly 63% from growth and 37% from deleveraging — a healthy, defensible mix.',
        ],
        technique: 'PE interviewers love this follow-up because it separates people who ran the maths from people who understand the model. Returns driven by operational growth are viewed as higher quality than returns driven by multiple expansion, which is essentially market luck.',
      },
      {
        title: 'Leverage capacity judgement',
        question: 'A software business has £40m EBITDA, 90% recurring revenue and minimal capex. A cinema chain has the same £40m EBITDA but heavy capex and cyclical demand. Which supports more leverage, and roughly how much?',
        steps: [
          'Leverage capacity depends on cash flow stability and predictability, not on EBITDA alone.',
          'The software business has recurring revenue and low capex, so its cash conversion is high and reliable — lenders might support 5-6x EBITDA, so £200-240m of debt.',
          'The cinema chain has cyclical demand and high maintenance capex, so free cash flow is volatile — lenders would likely cap it around 3-4x, so £120-160m.',
          'Same EBITDA, materially different debt capacity — because debt is serviced out of cash, not out of EBITDA.',
        ],
        technique: 'Always distinguish EBITDA from actual free cash flow. The gap between them — capex, working capital, cash interest, tax — is exactly what determines how much debt a business can carry. Making that distinction unprompted marks you out immediately.',
      },
    ],
    generalTips: [
      'Practise paper LBOs until you can complete one in under 5 minutes on blank paper, talking throughout.',
      'Prepare two or three deals you find genuinely interesting, with a view on whether YOU would have done them and at what price.',
      'Expect "what would you diligence?" — have a structured answer covering market, competitive position, customer concentration, cash conversion and management.',
      'On-cycle recruiting starts extremely early, often months into your banking analyst role. Headhunters control access, so build those relationships early.',
      'Know why leverage amplifies returns AND risk — a candidate who only describes the upside sounds naive.',
    ],
  },
]
