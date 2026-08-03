export type TechnicalItem = { q: string; a: string }
export type TechnicalGroup = { topic: string; mustKnow: TechnicalItem[] }
export type ProcessStage = { stage: string; timing: string; detail: string; survive: string }
export type BreakInRoute = { route: string; realism: string; detail: string }

export type TechTrack = {
  id: string
  path: string
  icon: string
  color: string
  border: string
  summary: string
  technicalDepth: string
  technicals: TechnicalGroup[]
  process: ProcessStage[]
  breakIn: BreakInRoute[]
  differentiators: string[]
}

export const techTracks: TechTrack[] = [
  // ===================== INVESTMENT BANKING =====================
  {
    id: 'ib',
    path: 'Investment Banking',
    icon: '🏢',
    color: 'text-yellow-400',
    border: 'border-yellow-500/30',
    summary: 'The most structured and most competitive graduate pipeline in finance. Spring week in year 2 → summer internship in penultimate year → full-time offer. Miss that ladder and you are climbing in through lateral hiring or a boutique.',
    technicalDepth: 'Spring week: light — know what a bank does and the basics below. Summer internship: full accounting, valuation and DCF depth. Full-time/lateral: everything here plus LBO mechanics and live deal discussion.',
    technicals: [
      {
        topic: 'Accounting — the foundation',
        mustKnow: [
          { q: 'The three statements and how they link', a: 'Income statement shows profitability over a period. Balance sheet is a snapshot: assets = liabilities + equity. Cash flow tracks actual cash. Net income flows into retained earnings on the balance sheet and starts the cash flow statement; closing cash returns to the balance sheet. Change one number and all three move.' },
          { q: 'Depreciation increases by £10 — walk me through it', a: 'At 25% tax: EBIT −£10, net income −£7.50. Cash flow: −7.50 net income, add back +£10 non-cash → cash +£2.50. Balance sheet: PP&E −£10, cash +£2.50 (assets −£7.50); retained earnings −£7.50. It balances. Depreciation is a tax shield, so more of it means more cash.' },
          { q: 'Why can a profitable company go bankrupt?', a: 'Profit is an accounting opinion; cash is a fact. A company growing fast ties up cash in inventory and receivables before customers pay. If it cannot fund that working capital gap, it fails despite being profitable. This is called overtrading.' },
          { q: 'What is working capital and why does it matter?', a: 'Current assets minus current liabilities — the short-term cash tied up in running the business. An increase in working capital consumes cash; a decrease releases it. It is a line in free cash flow and a common way models are wrong.' },
          { q: 'EBITDA vs free cash flow', a: 'EBITDA is earnings before interest, tax, depreciation and amortisation — a rough proxy for operating cash generation. FCF subtracts real cash costs EBITDA ignores: capex, working capital changes, cash tax and cash interest. EBITDA flatters capital-intensive businesses badly.' },
        ],
      },
      {
        topic: 'Valuation',
        mustKnow: [
          { q: 'The three valuation methodologies', a: 'DCF (intrinsic — present value of future cash flows), trading comparables (relative to similar listed companies), precedent transactions (prices actually paid in similar deals). Precedents sit highest because they include a control premium of typically 20-40%.' },
          { q: 'Walk me through a DCF', a: 'Project unlevered free cash flow for 5-10 years. Discount at WACC. Calculate terminal value via perpetuity growth or exit multiple. Discount that back too. Sum to enterprise value. Subtract net debt to get equity value. Divide by shares for implied share price.' },
          { q: 'Enterprise value vs equity value', a: 'Equity value is market cap — what shareholders own. EV = equity value + net debt (+ minority interest, preferred). EV is the cost of the whole business. Pair EV with pre-interest metrics (EBITDA, revenue); pair equity value with post-interest metrics (net income, EPS).' },
          { q: 'Why subtract cash in enterprise value?', a: 'A buyer acquiring the entire company effectively receives the cash on the balance sheet, reducing the true cost of acquisition. So cash nets against debt.' },
          { q: 'What is WACC and how do you calculate cost of equity?', a: 'WACC is the blended required return of all capital providers, weighted by proportion, with debt taken after tax because interest is deductible. Cost of equity comes from CAPM: risk-free rate + beta × equity risk premium.' },
          { q: 'Terminal value and why it matters so much', a: 'TV = FCF × (1+g) ÷ (WACC − g). It typically represents 60-80% of total DCF value, so tiny changes in g or WACC swing the valuation enormously. Always sanity-check the implied exit multiple.' },
        ],
      },
      {
        topic: 'Deal mechanics',
        mustKnow: [
          { q: 'Walk me through a sell-side M&A process', a: 'Pitch → win the mandate → prepare materials (teaser, then CIM) → contact buyers → first-round indicative bids → management presentations and data room diligence → final binding bids → negotiate the SPA → sign → regulatory approvals → close. Typically 4-9 months.' },
          { q: 'Accretion / dilution', a: 'Does the deal raise or lower the acquirer\'s EPS? In an all-stock deal, buying at a lower P/E than your own is accretive. Reframe P/E as an earnings yield (1 ÷ P/E) and it becomes intuitive. Accretive does not mean value-creating.' },
          { q: 'Cash vs stock vs debt funding', a: 'Cash is cheapest if you have it (forgone interest is low). Debt is next (tax-deductible, but adds risk and covenants). Stock is most expensive and signals the acquirer may believe its own shares are overvalued.' },
          { q: 'What are synergies?', a: 'Cost synergies (removing duplicate functions, procurement scale) are more credible and quicker than revenue synergies (cross-selling). Both are systematically overestimated, which is why goodwill impairments follow bad deals years later.' },
        ],
      },
    ],
    process: [
      { stage: 'Application opens', timing: 'Early September', detail: 'CV, cover letter or motivation questions through the bank\'s portal. Most are ROLLING — assessed as they arrive, not after the deadline.', survive: 'Apply within the first two weeks. A strong late application loses to an average early one when seats fill.' },
      { stage: 'Psychometric tests', timing: 'Within days of applying', detail: 'Numerical, logical, situational judgement — usually SHL, Cappfinity or cut-e. Cuts 50-80% of applicants.', survive: 'Never sit one cold. Do a practice set the same morning. Use a calculator and paper.' },
      { stage: 'Video interview (HireVue)', timing: 'October-November', detail: 'Pre-recorded: ~30s prep then 1-2 minutes per answer, 3-6 questions, no human present.', survive: 'Camera at eye level, light in front, look at the lens. Practise the format at least five times first.' },
      { stage: 'Assessment centre', timing: 'November-January', detail: 'Half or full day: 2-3 interviews, sometimes a group exercise or case. Mix of motivation, behavioural and light technical.', survive: 'Prepare 2-3 recent deals in the bank\'s sector. Every interviewer scores independently — repeat your best stories with full energy.' },
      { stage: 'Offer', timing: 'December-February', detail: 'Spring week offers land here. The week itself runs in April.', survive: 'The spring week exists to fast-track you into a summer internship interview. Treat every day of it as assessed.' },
    ],
    breakIn: [
      { route: 'Spring week → summer internship → full-time', realism: 'The main route', detail: 'Apply in year 2 of a 4-year course (or year 1 of a 3-year). Convert to a penultimate-year summer internship, which converts to a graduate offer. Roughly 60-80% of graduate seats are filled this way.' },
      { route: 'Direct summer internship application', realism: 'Very competitive without a spring week', detail: 'Applying to a penultimate-year summer internship without a spring week is possible but you compete against people the bank already knows. Compensate with strong networking and a differentiated CV.' },
      { route: 'Off-cycle internships', realism: 'Underused and effective', detail: 'Boutiques and mid-market banks hire 3-6 month off-cycle interns year-round, often through direct outreach rather than portals. Far less competitive and genuinely converts.' },
      { route: 'Boutique first, then lateral', realism: 'Slow but reliable', detail: 'Start at a smaller advisory firm, get real deal experience, then lateral to a larger bank after 1-2 years. Deal experience beats brand at the lateral stage.' },
      { route: 'Masters in Finance', realism: 'Effective reset', detail: 'A target-school MSc gives you a second shot at the graduate pipeline with a stronger CV. Common for non-target or non-finance backgrounds.' },
    ],
    differentiators: [
      'A live deal tracker — 2-3 current transactions you can discuss with a view, not just facts.',
      'Genuine modelling ability at spring week level is rare and stands out enormously.',
      'Networking that produces a named person you spoke to at the bank, referenced naturally in your answers.',
      'Any evidence of commercial curiosity outside your course: a newsletter, a portfolio, a society you built.',
    ],
  },

  // ===================== SALES & TRADING =====================
  {
    id: 'trading',
    path: 'Sales & Trading / Markets',
    icon: '📟',
    color: 'text-red-400',
    border: 'border-red-500/30',
    summary: 'Faster, more meritocratic and less CV-driven than banking. Prop firms and market makers care almost entirely about how you think, not where you studied. Bank S&T divisions still run the standard spring-week pipeline.',
    technicalDepth: 'Banks: markets awareness plus basic product knowledge. Prop firms (Optiver, IMC, Jane Street, Flow Traders): heavy mental maths and probability, essentially no finance knowledge required.',
    technicals: [
      {
        topic: 'Market structure',
        mustKnow: [
          { q: 'Bid, ask and the spread', a: 'The bid is the highest price buyers will pay; the ask is the lowest sellers will accept. The spread between them compensates market makers for providing liquidity and is your transaction cost. Tighter spreads mean more liquid markets.' },
          { q: 'What does a market maker actually do?', a: 'Continuously quotes both a bid and an ask, earning the spread while managing inventory risk. They profit from uninformed flow and lose to informed traders — that trade-off, called adverse selection, is the core of the business.' },
          { q: 'Market order vs limit order', a: 'A market order executes immediately at the best available price — you control execution but not price. A limit order rests in the book at your price — you control price but may never fill.' },
          { q: 'Why does liquidity disappear in a crisis?', a: 'Market makers widen or pull quotes when volatility spikes, because the risk of being picked off rises. Liquidity is there until you actually need it — this is how panics accelerate.' },
        ],
      },
      {
        topic: 'Products and risk',
        mustKnow: [
          { q: 'Bond price and yield relationship', a: 'They move inversely. When rates rise, existing bonds paying lower coupons must fall in price until their yield matches new issues. This is the most fundamental mechanic in fixed income.' },
          { q: 'Duration', a: 'Sensitivity to interest rate changes: roughly the percentage price change per 1% move in rates. Duration 6 means a 1% rate rise costs about 6% of value. Longer maturity and lower coupons increase duration.' },
          { q: 'Call vs put option', a: 'A call is the right (not obligation) to buy at the strike; a put is the right to sell. Buyers risk only the premium paid; sellers collect the premium but carry large potential losses.' },
          { q: 'Delta and delta hedging', a: 'Delta is how much an option price moves per £1 move in the underlying. 200 calls at 0.4 delta means 80 share-equivalents of exposure — hedge by shorting 80 shares. Delta hedging is the daily work of an options desk.' },
          { q: 'What is the VIX?', a: 'The implied volatility of S&P 500 options, distilled into one number. It rises when markets expect turbulence, which is why it is called the fear index.' },
        ],
      },
      {
        topic: 'Mental maths and probability',
        mustKnow: [
          { q: 'Expected value', a: 'Σ(probability × payoff). Play positive-EV games, refuse negative-EV ones. Almost every trading brainteaser reduces to this.' },
          { q: 'Fast percentage work', a: 'Build from 10%, 5% and 1%. Learn squares to 20, the fraction-to-percentage conversions, and that ×0.25 is ÷4. Speed here is filtered on directly.' },
          { q: 'Conditional probability', a: 'When given information, enumerate the full sample space then eliminate. "Two coins, at least one heads — probability both heads?" is 1/3, not 1/2.' },
        ],
      },
    ],
    process: [
      { stage: 'Application', timing: 'September-November (banks) · rolling (prop firms)', detail: 'Banks follow the standard graduate pipeline. Prop firms often open earlier and move much faster.', survive: 'Prop firms genuinely do not filter hard on university. Apply even if your CV feels weak elsewhere.' },
      { stage: 'Timed maths test', timing: 'Immediately after applying', detail: 'Prop firms use brutal speed tests — Optiver\'s is famously 80 questions in 8 minutes with no calculator. Banks use standard numerical tests.', survive: 'This is pure practice. Drill daily for weeks beforehand; there is no technique substitute for reps.' },
      { stage: 'Numerical/logical follow-up', timing: 'Days later', detail: 'Often a second round of harder sequences or a mental arithmetic interview.', survive: 'Accuracy above 80% before pushing speed — rushing trains the wrong habit.' },
      { stage: 'Interviews', timing: 'Weeks 3-6', detail: 'Brainteasers, expected value games, market-making exercises, and "what is your view on markets today?"', survive: 'Think aloud constantly. Silence reads as freezing. When they trade against your quote, say what you would do about the position.' },
      { stage: 'Final round / trading floor day', timing: 'Weeks 6-10', detail: 'Sometimes a trading game or simulation, plus meeting the desk you would join.', survive: 'Know where major markets closed that morning: indices, 10-year yields, oil, GBP/USD.' },
    ],
    breakIn: [
      { route: 'Prop firm / market maker direct', realism: 'Most meritocratic route in finance', detail: 'Optiver, IMC, Flow Traders, Jane Street, DRW, SIG. They test raw ability, not pedigree. A maths-strong student from any university has a genuine shot.' },
      { route: 'Bank S&T spring week', realism: 'Standard pipeline', detail: 'Same timeline as IB — apply September of your second year, convert to summer internship, then full-time.' },
      { route: 'Quant-adjacent conversion', realism: 'Strong for STEM students', detail: 'Maths, physics, engineering and CS students convert well into trading. Emphasise probability, coding and competition results over finance knowledge.' },
      { route: 'Trading competitions and games', realism: 'Genuine differentiator', detail: 'University trading societies, Optiver/IMC-run competitions, and options-trading games are actively used by firms as recruiting funnels.' },
    ],
    differentiators: [
      'Demonstrable mental maths speed — it is the single most-weighted filter at prop firms.',
      'Poker, chess, competitive gaming or maths olympiad — all read as evidence of EV thinking under pressure.',
      'A tracked personal portfolio or trading journal with reasoning, not just positions.',
      'Python for data analysis, even at a basic level, increasingly expected on modern desks.',
    ],
  },

  // ===================== CONSULTING =====================
  {
    id: 'consulting',
    path: 'Consulting',
    icon: '📊',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    summary: 'The case interview dominates everything. Firms hire from any degree discipline, so your subject matters far less than your ability to structure ambiguity out loud and do clean arithmetic without a calculator.',
    technicalDepth: 'Almost no finance knowledge required. The "technicals" are frameworks, business economics and mental maths. MBB will test all of it verbally rather than on paper.',
    technicals: [
      {
        topic: 'Case frameworks',
        mustKnow: [
          { q: 'The profit tree', a: 'Profit = Revenue − Costs. Revenue = Price × Volume. Costs split into fixed and variable. Nearly every profitability case decomposes down this tree — walk it systematically rather than guessing causes.' },
          { q: 'MECE', a: 'Mutually Exclusive, Collectively Exhaustive — breakdowns with no overlaps and no gaps. "New vs returning customers" is MECE; "young vs loyal customers" is not.' },
          { q: 'Market entry structure', a: 'Assess the market (size, growth, profitability), the competition (structure, likely response), the company (capabilities, economics), then choose the entry mode: build, buy or partner.' },
          { q: 'Porter\'s Five Forces', a: 'Rivalry, new entrants, substitutes, supplier power, buyer power. Use it to explain why an industry is structurally profitable or not — airlines are unprofitable because four of the five forces are hostile.' },
        ],
      },
      {
        topic: 'Case maths',
        mustKnow: [
          { q: 'Market sizing method', a: 'Population → segment → penetration → frequency → price. Anchor on 68m UK / 335m US. State every assumption aloud, round hard, and always sanity-check the final number per person.' },
          { q: 'Breakeven', a: 'Fixed costs ÷ contribution per unit, where contribution = price − variable cost. A 10% price cut can require a 30%+ volume increase to stand still, because variable costs do not fall with price.' },
          { q: 'Growth and the rule of 72', a: '72 ÷ growth rate ≈ years to double. Half a doubling is ×1.41. This removes compound arithmetic from your head.' },
          { q: 'Percentage discipline', a: 'Build from 10%/5%/1%. Reverse percentages divide by (1 ± rate). Sequential growth multiplies, never averages.' },
        ],
      },
      {
        topic: 'Communication',
        mustKnow: [
          { q: 'The pyramid principle', a: 'Answer first, then three grouped supporting arguments, then evidence. Slide titles should state conclusions ("Logistics drove the 15% cost rise") not topics ("Cost analysis").' },
          { q: 'Case synthesis', a: 'Recommendation → three reasons → main risk → next step, in about 60 seconds. Never re-narrate your analysis chronologically.' },
          { q: 'Hypothesis-driven thinking', a: 'State a best-guess answer early and test it with targeted analysis, rather than boiling the ocean. Say your hypothesis aloud — it signals you think like a consultant.' },
        ],
      },
    ],
    process: [
      { stage: 'Application', timing: 'August-October (MBB) · varies for others', detail: 'CV and cover letter. MBB deadlines are firm and early. Some firms also require a written motivation.', survive: 'CV screening at MBB is genuinely academic-weighted — grades and a recognisable extracurricular record matter here more than in trading.' },
      { stage: 'Online tests / digital assessment', timing: 'On application', detail: 'McKinsey uses the Solve game (a scenario-based problem-solving assessment); BCG and Bain use numerical/logical tests or their own digital cases.', survive: 'Do the firm\'s own official practice materials — these formats are unusual and format shock costs marks.' },
      { stage: 'First round interviews', timing: 'October-December', detail: 'Two interviews, each with a case plus a personal experience interview (PEI). Cases are conversational and interviewer-led at McKinsey, more candidate-led at Bain/BCG.', survive: 'Practise 30+ live cases with partners beforehand. Reading case books alone does not build the verbal skill.' },
      { stage: 'Final round', timing: 'November-January', detail: 'Two to three interviews with partners. Harder cases, deeper PEI probing, and a real assessment of client-readiness.', survive: 'Partners test whether they would put you in front of a client. Warmth and structured clarity matter as much as the maths.' },
      { stage: 'Offer', timing: 'Within days of final round', detail: 'Consulting firms decide fast, often within 48 hours.', survive: 'Be ready to answer competing-offer questions honestly and professionally.' },
    ],
    breakIn: [
      { route: 'Spring/insight programme → internship → full-time', realism: 'The standard ladder', detail: 'First-year insight programmes exist at MBB and Big 4 strategy arms and convert well. Penultimate-year summer internship is the main conversion point.' },
      { route: 'Direct penultimate-year internship', realism: 'Very achievable with strong case prep', detail: 'Consulting is more open to direct internship applicants than banking, because the case interview is a genuine leveller.' },
      { route: 'Big 4 strategy or boutique first', realism: 'Common and effective', detail: 'Strategy&, Monitor Deloitte, EY-Parthenon, or specialist boutiques. Two years there makes an MBB lateral move realistic.' },
      { route: 'Non-target route via case competitions', realism: 'Genuinely works', detail: 'University consulting societies and case competitions are used directly as recruiting channels, and give you the verbal reps that matter.' },
    ],
    differentiators: [
      'Live case practice volume — 30+ cases is roughly where fluency appears, and it is visible.',
      'Any experience where you influenced a decision with analysis, however small.',
      'International or language capability, given how much consulting work is cross-border.',
      'A genuine "why consulting" that is not "I like problem solving" — everyone says that.',
    ],
  },

  // ===================== PRIVATE EQUITY =====================
  {
    id: 'pe',
    path: 'Private Equity & Buy-Side',
    icon: '💰',
    color: 'text-brand-teal',
    border: 'border-brand-teal/30',
    summary: 'Very few graduate seats. The overwhelming majority of PE hires come from 2 years of investment banking, recruited through headhunters in an on-cycle process that starts alarmingly early.',
    technicalDepth: 'Everything in the IB list, plus LBO mechanics cold, returns maths without a calculator, and genuine commercial judgement about whether a business is worth owning.',
    technicals: [
      {
        topic: 'LBO mechanics',
        mustKnow: [
          { q: 'Walk me through an LBO', a: 'Buy a company mostly with debt. Use its own cash flows to service and repay that debt over ~5 years. Grow EBITDA operationally. Exit by sale or IPO. The equity holder captures the value of debt repaid plus any growth in enterprise value.' },
          { q: 'The paper LBO order', a: 'Entry EV (EBITDA × multiple) → debt and equity split → exit EV (exit EBITDA × exit multiple) → exit debt after paydown → exit equity → MOIC → IRR. Always in that order so you never lose your place.' },
          { q: 'The three return levers', a: 'Debt paydown, EBITDA growth, and multiple expansion. Returns from operational growth are considered highest quality; multiple expansion is essentially market timing.' },
          { q: 'MOIC to IRR from memory', a: '5-year hold: 2.0x ≈ 15%, 2.5x ≈ 20%, 3.0x ≈ 25%. 3-year hold: 2.0x ≈ 26%, 3.0x ≈ 44%. Memorise these and interpolate.' },
          { q: 'What makes a good LBO candidate?', a: 'Stable predictable cash flows, low capex, defensible market position, non-cyclical demand, and a clear exit route. Debt is serviced from cash, not EBITDA — so the gap between them matters enormously.' },
        ],
      },
      {
        topic: 'Fund and deal context',
        mustKnow: [
          { q: 'How does a PE fund make money?', a: 'A 2% annual management fee on committed capital, plus 20% carried interest on profits above a hurdle (typically 8%). Carry is where partner wealth is actually created.' },
          { q: 'What is the J-curve?', a: 'Fund returns dip in early years — fees are paid while investments are immature — before rising as companies are improved and exited. The plotted return traces a J.' },
          { q: 'IRR vs MOIC — which matters?', a: 'MOIC measures absolute money returned; IRR measures annualised speed. A quick 2.0x can beat a slow 3.0x on IRR. LPs look at both, plus DPI (cash actually returned).' },
          { q: 'What would you diligence?', a: 'Market size and growth, competitive position and customer concentration, quality of earnings, cash conversion, management capability, and downside scenarios. Have a structured answer ready.' },
        ],
      },
    ],
    process: [
      { stage: 'Headhunter registration', timing: 'Within months of starting as an IB analyst', detail: 'Firms like CPI, KEA, Blackwood and Dartmouth control access. They screen you before funds ever see your CV.', survive: 'Register early, be specific about strategy and geography preferences, and prepare for their screening call properly — it is a real interview.' },
      { stage: 'On-cycle kickoff', timing: 'Unpredictable — sometimes weeks into your analyst job', detail: 'The process launches suddenly and compresses into days. Interviews can run overnight.', survive: 'Have your paper LBO and deal stories ready BEFORE you start your analyst role. There is no time to prepare once it begins.' },
      { stage: 'Interviews and modelling test', timing: 'Days, sometimes hours', detail: 'Behavioural, deal walkthroughs, paper LBO, and often a timed full LBO model in Excel (1-3 hours).', survive: 'Practise building an LBO from a blank sheet under time pressure, not just reading models.' },
      { stage: 'Investment case / partner round', timing: 'Final stage', detail: 'Discuss a live or historical deal and defend a view on whether you would invest.', survive: 'Have a genuine opinion with a price attached. "It depends" without a conclusion fails.' },
      { stage: 'Off-cycle alternative', timing: 'Year-round', detail: 'Mid-market and European funds hire off-cycle at a saner pace, judged more on substance than speed.', survive: 'Often a better route if you missed on-cycle — and increasingly common in the UK/Europe.' },
    ],
    breakIn: [
      { route: 'IB analyst → on-cycle PE', realism: 'The dominant route', detail: '2 years in M&A or Leveraged Finance, then recruited by headhunters. Around 80%+ of associate seats are filled this way.' },
      { route: 'Consulting → operationally-focused PE', realism: 'Real but narrower', detail: 'MBB consultants move into funds that prize operational improvement over financial engineering, and into portfolio operations roles.' },
      { route: 'Direct graduate PE schemes', realism: 'Rare but they exist', detail: 'A handful of funds (some UK mid-market, plus firms like Blackstone in limited numbers) run analyst programmes. Extremely competitive but worth applying.' },
      { route: 'Off-cycle / smaller funds', realism: 'Underrated', detail: 'Mid-market, growth equity and regional funds hire year-round with far less frenzy. Excellent experience and a common stepping stone.' },
    ],
    differentiators: [
      'A paper LBO you can complete in under 5 minutes on blank paper, narrating throughout.',
      'Two or three deals you have a genuine, priced view on — including deals you would NOT have done.',
      'Evidence of commercial judgement beyond modelling: why a business is good, not just what it is worth.',
      'Headhunter relationships built early, before the process starts.',
    ],
  },

  // ===================== QUANT =====================
  {
    id: 'quant',
    path: 'Quant & Technology',
    icon: '🧮',
    color: 'text-cyan-400',
    border: 'border-cyan-500/30',
    summary: 'The most technically demanding and least CV-snobbish path in finance. Firms test maths and coding ability directly, so a strong candidate from any university with the right skills genuinely competes.',
    technicalDepth: 'Probability and statistics to a high level, coding to production standard, and for derivatives roles stochastic calculus. Finance knowledge is largely optional at entry.',
    technicals: [
      {
        topic: 'Probability and statistics',
        mustKnow: [
          { q: 'Expected value and variance', a: 'EV = Σ(p × payoff). Variance measures dispersion around it. Almost every quant brainteaser starts here — and the follow-up is usually about risk, not just return.' },
          { q: 'Conditional probability and Bayes', a: 'P(A|B) = P(B|A)P(A) ÷ P(B). The classic test: a rare disease with an accurate test still yields mostly false positives. Interviewers use this to check you reason rather than pattern-match.' },
          { q: 'Distributions worth knowing', a: 'Normal (central limit theorem), lognormal (asset prices — they cannot go negative), Poisson (arrival rates), binomial. Know when each applies and why asset returns are not truly normal.' },
          { q: 'Central limit theorem', a: 'The sum of many independent random variables tends toward a normal distribution regardless of their individual shape. It underpins most of statistical finance — and its failure in fat-tailed markets underpins most blow-ups.' },
        ],
      },
      {
        topic: 'Coding',
        mustKnow: [
          { q: 'Python fundamentals', a: 'NumPy and Pandas for data manipulation, vectorisation over loops, and clean readable code. Expect live coding and take-home tasks.' },
          { q: 'Complexity and data structures', a: 'Big-O reasoning, dictionaries vs lists vs sets, and why an O(n²) loop breaks at scale. LeetCode-style preparation genuinely applies here.' },
          { q: 'C++ for low latency', a: 'Required for market-making and execution roles. Memory management, cache behaviour and avoiding allocation in hot paths.' },
        ],
      },
      {
        topic: 'Financial maths',
        mustKnow: [
          { q: 'Black-Scholes intuition', a: 'You do not need to derive it, but know what it prices, its inputs (spot, strike, time, rate, volatility) and its assumptions — constant volatility and lognormal prices — plus why those assumptions fail in reality.' },
          { q: 'The Greeks', a: 'Delta (spot sensitivity), gamma (delta\'s rate of change), theta (time decay), vega (volatility sensitivity). Long options means long gamma and paying theta.' },
          { q: 'What is alpha?', a: 'Return beyond what market exposure explains. Beta is cheap and buyable via index funds; alpha is rare, decays as it is discovered, and is what quant funds are actually hunting.' },
        ],
      },
    ],
    process: [
      { stage: 'Application', timing: 'Rolling, often very early', detail: 'Many quant firms open applications 12+ months before start dates and hire continuously until full.', survive: 'Apply early. Seats genuinely run out.' },
      { stage: 'Online assessment', timing: 'Immediately', detail: 'Timed maths and probability test, or a coding assessment (HackerRank/Codility style), sometimes both.', survive: 'Practise timed probability problems and LeetCode-style questions specifically — general maths ability is not enough.' },
      { stage: 'Technical phone screens', timing: 'Weeks 2-4', detail: 'Probability problems and live coding with an engineer or researcher, often screen-shared.', survive: 'Narrate your reasoning. They score the approach, and a clean wrong answer beats a silent right one.' },
      { stage: 'Onsite / final rounds', timing: 'Weeks 4-8', detail: 'Multiple rounds: harder probability, system design or research discussion, and cultural fit.', survive: 'Be ready to discuss any project on your CV in complete technical depth — they will go deeper than you expect.' },
      { stage: 'Offer', timing: 'Fast', detail: 'Quant firms move quickly and often give exploding deadlines.', survive: 'Know your other timelines before you get an offer, so you can negotiate a decision window sensibly.' },
    ],
    breakIn: [
      { route: 'STEM degree → direct application', realism: 'The main route', detail: 'Maths, physics, CS, engineering or stats. Firms care about demonstrable ability, not your university\'s brand.' },
      { route: 'PhD → quant researcher', realism: 'Standard for research seats', detail: 'Many researchers at top funds hold PhDs, though exceptional Bachelor\'s/Master\'s candidates absolutely get hired.' },
      { route: 'Competitions and open-source', realism: 'Genuinely opens doors', detail: 'Maths olympiads, Kaggle, competitive programming and public GitHub projects are actively recruited from.' },
      { route: 'MSc in Financial Engineering / Quant Finance', realism: 'Effective conversion', detail: 'A structured route for those with quantitative ability but no finance exposure.' },
    ],
    differentiators: [
      '2-3 substantive projects on GitHub — a backtested strategy, an option pricer, a data pipeline.',
      'Competition results, which serve as an objective external signal of ability.',
      'Ability to explain a complex technical idea simply — researchers must communicate with traders.',
      'Genuine curiosity about markets, not just the maths. Firms screen out people who only want an interesting problem.',
    ],
  },
]
