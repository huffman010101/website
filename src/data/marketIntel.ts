export type DealTeardown = {
  id: string
  name: string
  headline: string
  year: string
  size: string
  type: string
  icon: string
  whatHappened: string[]
  structure: { label: string; value: string }[]
  rationale: string[]
  howItWent: string
  sectorImplications: { sector: string; impact: string }[]
  interviewAngle: string
  lesson: string
}

export const dealTeardowns: DealTeardown[] = [
  {
    id: 'msft-atvi',
    name: 'Microsoft / Activision Blizzard',
    headline: 'The deal that redefined how regulators treat tech acquisitions',
    year: 'Announced Jan 2022, closed Oct 2023',
    size: '~$69bn',
    type: 'Strategic M&A · all-cash',
    icon: '🎮',
    whatHappened: [
      'Microsoft agreed to acquire Activision Blizzard — publisher of Call of Duty, World of Warcraft and Candy Crush — for roughly $69bn in cash, at $95 per share.',
      'The deal was then held up for almost two years by competition regulators in the UK, US and EU simultaneously, which is unusual for a deal with limited direct horizontal overlap.',
      'The UK\'s CMA initially blocked it outright, focused not on gaming consoles but on cloud gaming — a market that barely existed commercially at the time.',
      'Microsoft restructured the deal, divesting cloud streaming rights for Activision titles to Ubisoft outside the EU, and the CMA approved the revised structure.',
    ],
    structure: [
      { label: 'Consideration', value: '100% cash at $95/share' },
      { label: 'Premium', value: '~45% to the undisturbed share price' },
      { label: 'Funding', value: 'Balance sheet cash and new debt — no equity issued' },
      { label: 'Break fee', value: 'Reported reverse break fee of up to ~$3bn payable by Microsoft if it failed on regulatory grounds' },
    ],
    rationale: [
      'Content for the ecosystem: Microsoft wanted first-party titles to drive Game Pass subscriptions, shifting gaming from one-off purchases to recurring revenue.',
      'Mobile exposure: Activision owned King (Candy Crush), giving Microsoft a mobile gaming foothold it completely lacked.',
      'Defensive positioning against Sony and, more importantly, against Apple and Google controlling mobile distribution.',
    ],
    howItWent:
      'Completed roughly 21 months after announcement — an extraordinarily long regulatory timeline that itself became the story. The reverse break fee structure mattered enormously: Microsoft carried the regulatory risk, which is why Activision shareholders were willing to wait rather than push for termination.',
    sectorImplications: [
      { sector: 'Technology M&A', impact: 'Established that regulators will now block on the basis of nascent markets that barely exist yet, dramatically raising execution risk on large tech deals and lengthening timelines.' },
      { sector: 'Gaming', impact: 'Accelerated consolidation logic — content owners became strategically vital as distribution shifted to subscription and cloud.' },
      { sector: 'Investment banking', impact: 'Regulatory and antitrust advisory became a far bigger part of deal value. Reverse break fees on large tech deals rose materially.' },
      { sector: 'Private equity', impact: 'Reinforced that regulatory risk is now a pricing input, not a box-tick — sponsors began building longer timelines and larger contingencies into bids.' },
    ],
    interviewAngle:
      'A superb answer to "tell me about a deal you found interesting" because you can discuss it at three levels: the strategic logic (recurring revenue and content ownership), the financing structure (all cash, no equity, large reverse break fee), and the regulatory dimension (why the CMA focused on cloud gaming and how a structural remedy unlocked it). Most candidates only discuss the first.',
    lesson:
      'Deal risk is not just price and financing — regulatory approval is now a primary determinant of whether large deals complete, and who bears that risk is negotiated explicitly through break fees.',
  },
  {
    id: 'arm-ipo',
    name: 'Arm Holdings IPO',
    headline: 'The UK\'s most significant listing loss and what it says about markets',
    year: 'September 2023',
    size: '~$4.87bn raised',
    type: 'IPO · Nasdaq listing',
    icon: '📈',
    whatHappened: [
      'Arm, the Cambridge-based chip designer whose architecture powers most of the world\'s smartphones, listed on Nasdaq rather than the London Stock Exchange.',
      'SoftBank, which had taken Arm private in 2016 for around $32bn, sold roughly 10% in the IPO at $51 per share, valuing Arm at approximately $54.5bn.',
      'The listing followed a collapsed $40bn sale to Nvidia, which regulators had effectively blocked on competition grounds.',
      'The decision to list in New York rather than London became a focal point in UK debates about the competitiveness of the London market.',
    ],
    structure: [
      { label: 'Shares sold', value: '~10% free float — SoftBank retained ~90%' },
      { label: 'IPO price', value: '$51 per share' },
      { label: 'Implied valuation', value: '~$54.5bn' },
      { label: 'Listing venue', value: 'Nasdaq (US), not LSE' },
    ],
    rationale: [
      'Deeper pools of capital and a more receptive investor base for high-multiple technology businesses in the US.',
      'Higher comparable valuations for semiconductor and IP-licensing businesses on US exchanges.',
      'A small free float allowed SoftBank to establish a public valuation while retaining control and optionality to sell down later.',
    ],
    howItWent:
      'The listing itself was well received, but the strategic story is what matters for interviews: a deliberately small free float means the market price is set by supply and demand on a thin slice of the company, which can flatter the headline valuation.',
    sectorImplications: [
      { sector: 'UK capital markets', impact: 'Intensified concerns about London losing large technology listings, and fed directly into UK listing rule reforms designed to attract founder-led and dual-class companies.' },
      { sector: 'Semiconductors', impact: 'Reinforced that IP-licensing models command higher multiples than manufacturing, because they scale without capital intensity.' },
      { sector: 'ECM / equity capital markets', impact: 'Demonstrated the small-float strategy — list a sliver, establish a valuation, sell down over time — now common for large controlled companies.' },
      { sector: 'Private equity and VC', impact: 'Reminded sponsors that exit venue is a strategic choice affecting valuation, not an administrative detail.' },
    ],
    interviewAngle:
      'Excellent for "why has London struggled to attract listings?" — a genuinely common commercial awareness question in UK banking interviews. Strong answers cover valuation differentials, index inclusion rules, investor base composition, and the reform response, rather than just asserting that London is less attractive.',
    lesson:
      'Where a company lists is a valuation decision. Free float size, index eligibility and investor base composition all feed into the price achieved — the exchange is not interchangeable plumbing.',
  },
  {
    id: 'twitter-lbo',
    name: 'Musk / Twitter (X)',
    headline: 'How leverage on a low-cash-flow business creates immediate distress',
    year: 'Completed October 2022',
    size: '$44bn',
    type: 'Take-private · leveraged',
    icon: '🐦',
    whatHappened: [
      'Elon Musk acquired Twitter for $44bn at $54.20 per share, after attempting to withdraw and being pursued through the Delaware courts to complete.',
      'Roughly $13bn of the purchase price was funded with debt placed onto Twitter itself — a structure resembling a leveraged buyout.',
      'Banks that underwrote the debt were unable to syndicate it to investors on the intended terms and held it on their balance sheets at significant marks.',
      'Interest costs of roughly $1bn+ a year landed on a business whose cash generation had historically been weak and volatile.',
    ],
    structure: [
      { label: 'Price', value: '$54.20 per share, ~$44bn total' },
      { label: 'Debt onto the target', value: '~$13bn' },
      { label: 'Equity', value: 'Musk equity plus co-investors' },
      { label: 'Attempted exit', value: 'Musk sought to terminate citing bot numbers; Delaware litigation forced completion' },
    ],
    rationale: [
      'Stated rationale was free speech and product transformation rather than a conventional financial return case.',
      'Ambition to build an "everything app" combining messaging, payments and content.',
    ],
    howItWent:
      'A textbook illustration of why LBO candidates are chosen for stable cash flows. Twitter\'s advertising revenue was cyclical and, post-acquisition, declined sharply, while the fixed interest burden did not. Aggressive cost reduction followed out of necessity rather than plan.',
    sectorImplications: [
      { sector: 'Leveraged finance', impact: 'Banks were left holding hung debt, which tightened underwriting standards across the market and made banks far more cautious on committed financing.' },
      { sector: 'Private equity', impact: 'Reinforced the core screening criterion — debt is serviced from cash flow, not from strategic ambition. A business with volatile revenue cannot support LBO-level leverage.' },
      { sector: 'Technology', impact: 'Demonstrated advertising revenue\'s sensitivity to both macro conditions and advertiser sentiment, which can move for non-economic reasons.' },
      { sector: 'M&A legal', impact: 'The Delaware litigation reinforced how difficult it is to escape a signed merger agreement using a material adverse change argument.' },
    ],
    interviewAngle:
      'Extremely useful in PE interviews when asked what makes a good or bad LBO candidate. You can contrast it directly against a classic target — stable, recurring, low-capex — and explain precisely why the capital structure and the underlying business were mismatched.',
    lesson:
      'Leverage is unforgiving. The question is never whether a business is interesting, but whether its cash flows are predictable enough to service fixed obligations through a downturn.',
  },
  {
    id: 'kraft-heinz',
    name: 'Kraft Heinz',
    headline: 'When promised synergies never arrive',
    year: 'Merged 2015, impairment 2019',
    size: '~$49bn merger',
    type: 'Merger · cost synergy thesis',
    icon: '🍅',
    whatHappened: [
      'Kraft and Heinz merged in 2015, backed by 3G Capital and Berkshire Hathaway, on an explicit thesis of aggressive cost reduction — 3G\'s zero-based budgeting approach.',
      'In 2019 the combined company took a goodwill impairment of roughly $15bn, writing down the value of the Kraft and Oscar Mayer brands.',
      'Warren Buffett publicly acknowledged Berkshire had overpaid for Kraft.',
      'The cost programme delivered margin improvement initially, but underinvestment in brands coincided with consumer shift toward fresher and private-label products.',
    ],
    structure: [
      { label: 'Structure', value: 'Heinz (3G/Berkshire-controlled) merged with public Kraft' },
      { label: 'Thesis', value: 'Cost synergies via zero-based budgeting' },
      { label: 'Outcome', value: '~$15bn goodwill impairment in 2019' },
    ],
    rationale: [
      'Combine two packaged food portfolios and apply 3G\'s cost discipline to expand margins.',
      'Scale in procurement, distribution and shared overhead.',
    ],
    howItWent:
      'Costs did come out, but revenue stagnated. Cutting marketing and innovation spend in a branded consumer business protects short-term margin while eroding the brand equity that justified the purchase price in the first place — which is exactly what the goodwill write-down recognised.',
    sectorImplications: [
      { sector: 'Consumer goods', impact: 'Marked a turning point in scepticism toward pure cost-synergy theses in branded food, and coincided with the rise of private label and challenger brands.' },
      { sector: 'M&A generally', impact: 'Became the standard reference for synergies being systematically overestimated and for goodwill impairment as the delayed admission of overpayment.' },
      { sector: 'Private equity', impact: 'Prompted a broader shift in narrative from cost-out toward operational growth and buy-and-build as the more durable value creation route.' },
    ],
    interviewAngle:
      'The definitive example for "why do most acquisitions fail?" and for explaining goodwill and impairment in accounting interviews. It lets you connect an accounting mechanic to a real commercial failure, which is far more impressive than defining goodwill abstractly.',
    lesson:
      'Cost synergies are real but finite; revenue synergies are frequently imaginary. Cutting investment in a brand-dependent business borrows margin from the future.',
  },
  {
    id: 'morrisons',
    name: 'CD&R / Morrisons',
    headline: 'A UK take-private that reframed the leverage debate',
    year: '2021',
    size: '~£7bn including debt',
    type: 'Public-to-private LBO',
    icon: '🛒',
    whatHappened: [
      'US private equity firm Clayton, Dubilier & Rice acquired Morrisons, the UK\'s fourth-largest supermarket, after a competitive auction against Fortress that pushed the price materially above the opening bid.',
      'The deal completed shortly before interest rates rose sharply, leaving the acquisition debt considerably more expensive to service than underwritten.',
      'Morrisons\' substantial freehold property portfolio was a central part of the attraction — asset backing supports higher leverage.',
      'The transaction attracted significant political scrutiny over private equity ownership of essential UK infrastructure and employers.',
    ],
    structure: [
      { label: 'Type', value: 'Public-to-private, competitive auction' },
      { label: 'Attraction', value: 'Freehold property portfolio providing asset backing' },
      { label: 'Timing risk', value: 'Completed shortly before a sharp rise in rates' },
    ],
    rationale: [
      'Undervalued freehold property relative to the equity market\'s valuation of the business.',
      'Operational improvement potential in a competitive but defensive grocery market.',
      'Wholesale and convenience growth opportunities.',
    ],
    howItWent:
      'A powerful lesson in interest rate risk in LBOs. A structure underwritten in a low-rate environment became substantially harder to service as rates rose, compressing equity returns even where the operating thesis held.',
    sectorImplications: [
      { sector: 'UK retail', impact: 'Accelerated the debate about leverage in grocery, a sector with thin margins where debt service leaves little room for error.' },
      { sector: 'Private equity', impact: 'A defining example of interest rate risk — deals underwritten at one cost of debt can be materially impaired by rate moves before exit.' },
      { sector: 'Real estate', impact: 'Highlighted the persistent gap between property value held on corporate balance sheets and how equity markets price it, which is a recurring source of take-private opportunities.' },
      { sector: 'Policy', impact: 'Fed directly into UK political debate about foreign and private equity ownership of major employers.' },
    ],
    interviewAngle:
      'Ideal for UK-focused PE and IB interviews. Lets you discuss asset-backed lending, the property-versus-operating-business valuation gap, competitive auction dynamics, and rate risk — all in one deal, and all UK-relevant.',
    lesson:
      'The cost of debt at underwriting is an assumption, not a certainty. Floating-rate structures transfer macro risk directly into equity returns.',
  },
]

// ==================== WHAT MOVES MARKETS ====================

export type RateDriver = {
  driver: string
  what: string
  whenReleased: string
  whyItMoves: string
  marketReaction: string
}

export const rateDrivers: RateDriver[] = [
  {
    driver: 'Inflation data (CPI)',
    what: 'The Consumer Price Index measures the change in prices of a basket of goods and services. Core CPI strips out volatile food and energy and is what central banks actually watch. In the UK, services inflation is scrutinised most closely because it reflects domestic wage pressure rather than imported costs.',
    whenReleased: 'Monthly — UK CPI mid-month, US CPI around the 10th-15th',
    whyItMoves: 'Central banks have explicit inflation mandates (2% in the UK and US). A hot print raises the probability of higher rates for longer; a cool print raises the probability of cuts. Markets trade the surprise versus expectations, not the level.',
    marketReaction: 'Hot CPI → yields up, bond prices down, currency up, equities down (especially long-duration growth). Cool CPI → the reverse.',
  },
  {
    driver: 'Labour market data',
    what: 'US non-farm payrolls (NFP) is the single most watched release in global markets. In the UK, the equivalent focus is on average weekly earnings and the unemployment rate. Wage growth matters more than headline employment because wages feed directly into services inflation.',
    whenReleased: 'US NFP: first Friday of the month. UK labour market: mid-month.',
    whyItMoves: 'A tight labour market with strong wage growth makes inflation persistent, which forces central banks to hold rates higher. This is why strong jobs data can be bad news for markets — "good news is bad news".',
    marketReaction: 'Strong payrolls with hot wages → yields up, rate cut expectations pushed back, equities often down. Weak data → cuts priced sooner, bonds rally.',
  },
  {
    driver: 'Central bank meetings and guidance',
    what: 'The Bank of England MPC meets eight times a year; the Federal Reserve FOMC eight times. What matters is rarely the decision itself — which is usually priced — but the statement wording, the vote split, the economic projections, and the press conference tone.',
    whenReleased: 'Eight scheduled meetings a year for each, plus minutes',
    whyItMoves: 'Markets price the expected path of rates. Any shift in that path — via language, dot plots, or vote splits — reprices everything discounted at those rates, which is every asset.',
    marketReaction: 'Hawkish surprise (higher for longer) → yields up, currency up, equities down. Dovish surprise → yields down, equities up, currency down.',
  },
  {
    driver: 'Growth data — GDP and PMIs',
    what: 'GDP is backward-looking and revised heavily. Purchasing Managers\' Indices (PMIs) are forward-looking survey data released monthly, where 50 is the dividing line between expansion and contraction. Markets often react more to PMIs precisely because they are timelier.',
    whenReleased: 'PMIs: flash estimates around the 23rd, final at month start. GDP: quarterly with revisions.',
    whyItMoves: 'Weak growth raises the probability of rate cuts but also implies lower corporate earnings — so the equity reaction depends on which effect dominates, and that changes with the regime.',
    marketReaction: 'Weak growth in a rate-cut regime can lift equities; weak growth in a recession-fear regime hits them. Context determines the sign.',
  },
  {
    driver: 'Government borrowing and fiscal events',
    what: 'Budgets, fiscal statements and gilt or Treasury issuance schedules. When a government announces more borrowing, supply of bonds rises and, absent more demand, yields must rise to clear the market.',
    whenReleased: 'UK Budget and fiscal events; debt management office issuance calendars',
    whyItMoves: 'Bond markets discipline fiscal policy directly. The 2022 UK mini-budget is the definitive example: unfunded tax cuts triggered a gilt sell-off, forced Bank of England intervention over pension fund LDI positions, and the policy was reversed within weeks.',
    marketReaction: 'Unfunded fiscal loosening → yields up sharply, currency down, and a risk premium attached to that country\'s debt.',
  },
  {
    driver: 'Energy and commodity prices',
    what: 'Oil and natural gas prices feed directly into headline inflation and into corporate input costs. Supply shocks — OPEC decisions, conflict, pipeline disruption — transmit into inflation with a lag.',
    whenReleased: 'Continuous, with OPEC meetings and inventory data as scheduled catalysts',
    whyItMoves: 'Energy is a cost-push inflation driver that central banks cannot fix with rates — hiking does not increase oil supply. This creates the hardest policy trade-off: inflation rising while growth falls.',
    marketReaction: 'Oil spike → headline inflation up, energy equities up, airlines and consumer discretionary down, and stagflation risk priced.',
  },
]

export type SectorSensitivity = {
  sector: string
  ratesUp: string
  ratesDown: string
}

export const sectorSensitivities: SectorSensitivity[] = [
  { sector: 'Banks', ratesUp: 'Generally positive — wider net interest margins on lending, though credit losses rise if rates cause a downturn.', ratesDown: 'Margin compression, though loan demand and credit quality typically improve.' },
  { sector: 'High-growth technology', ratesUp: 'Hit hardest. Value sits in distant future cash flows, so a higher discount rate compresses valuation most. This is the "long duration equity" effect.', ratesDown: 'Benefits most, for the same reason in reverse.' },
  { sector: 'Utilities and infrastructure', ratesUp: 'Negative — heavily indebted, and their bond-like dividend yields become less attractive versus government bonds.', ratesDown: 'Positive, as yield-seeking capital returns.' },
  { sector: 'Real estate', ratesUp: 'Strongly negative — higher financing costs, rising cap rates and therefore falling valuations.', ratesDown: 'Strongly positive.' },
  { sector: 'Consumer discretionary', ratesUp: 'Negative — mortgage and credit costs squeeze disposable income.', ratesDown: 'Positive as household cash flow improves.' },
  { sector: 'Consumer staples', ratesUp: 'Defensive — demand is inelastic, though they behave somewhat like bonds so extreme rate moves still matter.', ratesDown: 'Underperforms in a risk-on rally.' },
  { sector: 'Insurance', ratesUp: 'Generally positive — insurers hold large bond portfolios and reinvest at higher yields.', ratesDown: 'Reinvestment yields fall, pressuring returns.' },
]

export type NewsHabit = { title: string; detail: string }

export const newsHabits: NewsHabit[] = [
  {
    title: 'Read the FT front page and Lex every morning — 15 minutes',
    detail: 'The front page tells you what matters today; Lex gives you a short, opinionated analytical take on a specific company or situation, which is exactly the register you need in interviews. Many universities provide free FT access through the library — check before paying.',
  },
  {
    title: 'Follow the Companies & Markets section, not just headlines',
    detail: 'This is where deals, results and sector moves are analysed. Headlines tell you what happened; this section tells you why it matters, which is the part interviewers actually test.',
  },
  {
    title: 'Keep a deal tracker with five fields',
    detail: 'For every deal you notice: parties, price and multiple, strategic rationale, financing structure, and your own view. Three well-tracked deals beat thirty headlines you half-remember. Use the Meeting Notes tool to keep these in one place.',
  },
  {
    title: 'Pick two stories and go three layers deep',
    detail: 'Layer one: what happened. Layer two: why it matters and who wins or loses. Layer three: what it means for the firm you are interviewing with. Depth on two stories beats shallow awareness of twenty.',
  },
  {
    title: 'Add one free supplementary source',
    detail: 'Morning Brew or Finimize for a fast daily summary, Bloomberg for market data, and Mergermarket or Reuters for deal flow. For rates specifically, watch the market-implied rate path rather than commentary.',
  },
  {
    title: 'Track where markets actually are',
    detail: 'Before any markets interview, know the FTSE 100 and S&P 500 levels, the UK 10-year gilt and US 10-year Treasury yields, GBP/USD, and Brent crude. Being unable to answer "where is the 10-year?" in a trading interview is disqualifying.',
  },
  {
    title: 'Write a weekly 200-word market summary',
    detail: 'Force yourself to explain the week in your own words. Writing exposes the gaps that reading hides, and gives you ready-made material for "tell me about something happening in markets".',
  },
]
