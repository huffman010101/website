export type Exhibit = {
  title: string
  headers: string[]
  rows: string[][]
  note?: string
}

export type CaseStage = {
  label: string
  interviewerSays: string
  yourTask: string
  exhibit?: Exhibit
  modelStructure?: string[]
  working?: string[]
  insight: string
  commonMistakes: string[]
  followUps?: string[]
}

export type CaseStudy = {
  id: string
  title: string
  type: string
  firm: string
  icon: string
  color: string
  border: string
  duration: string
  difficulty: 'Standard' | 'Hard'
  context: string
  openingPrompt: string
  whatTheyreTesting: string[]
  stages: CaseStage[]
  finalRecommendation: string[]
  strongVsWeak: { strong: string[]; weak: string[] }
  takeaways: string[]
}

export const caseStudies: CaseStudy[] = [
  // ==================== CASE 1: CONSULTING PROFITABILITY ====================
  {
    id: 'brewco',
    title: 'BrewCo — Collapsing Profits',
    type: 'Consulting · Profitability',
    firm: 'MBB-style, interviewer-led',
    icon: '☕',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    duration: '30-35 minutes',
    difficulty: 'Standard',
    context:
      'This is the single most common case archetype in consulting interviews. Profitability cases appear in roughly a third of all first-round MBB interviews because they test the profit tree, clean arithmetic and the ability to convert numbers into a recommendation. Work through each stage properly before revealing the model answer — reading a solution you did not struggle with teaches you very little.',
    openingPrompt:
      'Our client is BrewCo, a UK coffee shop chain with 220 stores. Over the last two years their operating profit has almost halved, from £18.6m to £9.9m, even though revenue has grown. The CEO wants to know what is happening and what to do about it. How would you approach this?',
    whatTheyreTesting: [
      'Do you structure before diving into detail?',
      'Can you decompose profit systematically rather than guessing causes?',
      'Do you notice that growing revenue can hide a deteriorating business?',
      'Can you do percentage arithmetic cleanly out loud, without a calculator?',
      'Do you convert findings into a prioritised, commercially sensible recommendation?',
    ],
    stages: [
      {
        label: 'Stage 1 — Structure the problem',
        interviewerSays: 'Before we look at any data, how would you break this down?',
        yourTask:
          'Take 30-45 seconds of silence to write a structure, then walk the interviewer through it. Do not start listing possible causes off the top of your head — that is the single most common way to lose a case in the first two minutes.',
        modelStructure: [
          '"Profit equals revenue minus costs, so the fall must come from revenue, costs, or both. Revenue has grown, so costs must have grown faster — but I want to verify that rather than assume it."',
          'Revenue branch: decompose into number of stores × revenue per store, and revenue per store into transactions × average transaction value. Growth from new stores can mask decline in existing ones.',
          'Cost branch: split fixed (rent, salaried staff, central overhead) from variable (coffee, milk, packaging, hourly labour). Then identify which line has moved as a percentage of revenue.',
          'External branch: has anything changed in the market — competitor entry, input cost inflation, wage legislation, changing consumer behaviour?',
          '"I would start with the cost side since revenue grew, but I want to check the quality of that revenue growth first."',
        ],
        insight:
          'Announcing which branch you will start with, and why, is what separates a structure from a list. Interviewers are explicitly scoring whether you prioritise rather than trying to analyse everything at once.',
        commonMistakes: [
          'Jumping straight to "maybe coffee prices went up" without any framework.',
          'Producing a generic 4-box framework (Company, Customer, Competitor, Cost) that does not fit a profitability question.',
          'Structuring silently and then just saying "so I would look at costs" — the interviewer needs to hear the tree.',
          'Failing to say where you would start, leaving the interviewer to drive.',
        ],
        followUps: ['"Why would you start there rather than with revenue?"'],
      },
      {
        label: 'Stage 2 — Interrogate the revenue growth',
        interviewerSays: 'Good. Here is the revenue and store data. What do you make of it?',
        yourTask:
          'Do not just read the table aloud. Calculate revenue per store for both years and say what it means. The interviewer is waiting to see whether you spot that the headline growth is misleading.',
        exhibit: {
          title: 'Exhibit 1 — Revenue and store estate',
          headers: ['Metric', 'FY22', 'FY24'],
          rows: [
            ['Total revenue', '£186m', '£198m'],
            ['Number of stores', '200', '220'],
            ['Average transaction value', '£4.20', '£4.60'],
          ],
          note: 'All stores were open for the full year in both periods. No stores were closed.',
        },
        working: [
          'Revenue per store FY22 = £186m ÷ 200 = £930,000.',
          'Revenue per store FY24 = £198m ÷ 220 = £900,000.',
          'So revenue per store FELL by £30,000, or 3.2%, despite total revenue rising 6.5%.',
          'All the growth came from opening 20 new stores (+10% estate). Underlying performance declined.',
          'Now decompose revenue per store into transactions × price:',
          'FY22 transactions per store = £930,000 ÷ £4.20 = ~221,400.',
          'FY24 transactions per store = £900,000 ÷ £4.60 = ~195,700.',
          'Transactions per store fell 11.6% while average transaction value rose 9.5%.',
        ],
        insight:
          'This is the heart of the case. BrewCo raised prices by roughly 10% and lost roughly 12% of its customers — so the price rise more than paid for itself in per-unit terms but destroyed volume, and the store estate expansion papered over it in the headline number. Saying "revenue grew 6.5%" and moving on fails the case.',
        commonMistakes: [
          'Reading the table out without calculating revenue per store.',
          'Noticing per-store revenue fell but not decomposing further into price and volume.',
          'Concluding "so we should cut prices" immediately — you do not yet know whether the volume loss was caused by price or by something else.',
          'Arithmetic slips: dividing by the wrong year\'s store count.',
        ],
        followUps: [
          '"Does the price rise look like a mistake to you?"',
          '"What else could explain falling transactions besides price?"',
        ],
      },
      {
        label: 'Stage 3 — Find the cost driver',
        interviewerSays: 'Here is the cost breakdown as a percentage of revenue. Which line matters most?',
        yourTask:
          'Identify which cost lines moved, then translate the percentage-point change into actual pounds. A percentage-point shift on a £198m revenue base is a large absolute number, and quantifying it is what makes your answer actionable.',
        exhibit: {
          title: 'Exhibit 2 — Costs as % of revenue',
          headers: ['Cost line', 'FY22', 'FY24', 'Change'],
          rows: [
            ['Cost of goods (coffee, milk, food)', '26%', '26%', 'flat'],
            ['Staff costs', '32%', '36%', '+4pp'],
            ['Rent and property', '14%', '15%', '+1pp'],
            ['Other operating costs', '18%', '18%', 'flat'],
            ['Operating margin', '10.0%', '5.0%', '−5pp'],
          ],
        },
        working: [
          'Two lines moved: staff costs +4 percentage points, rent +1 percentage point. Together that is the entire 5pp margin decline.',
          'Convert to pounds on FY24 revenue of £198m:',
          'Staff: 4% × £198m = £7.9m of additional annual cost.',
          'Rent: 1% × £198m = £2.0m of additional annual cost.',
          'Total ≈ £9.9m — which almost exactly matches the £8.7m fall in operating profit.',
          'So staff cost is roughly 80% of the problem. Everything else is noise.',
        ],
        insight:
          'Note what did NOT move: cost of goods held at 26% even though coffee and milk prices rose across the period. That is evidence the price increase successfully passed input inflation through to customers — which reframes the price rise as rational, not a blunder. The real problem is labour.',
        commonMistakes: [
          'Treating all four cost lines as equally worth investigating instead of prioritising the 4pp mover.',
          'Leaving the answer in percentage points without converting to pounds — "staff costs rose 4pp" is far weaker than "that is £7.9m a year".',
          'Missing the significance of COGS staying flat, which is the clue that pricing worked.',
          'Not cross-checking that the identified drivers actually reconcile to the profit decline.',
        ],
        followUps: [
          '"Why might staff costs have risen 4 percentage points?"',
          '"Is this a BrewCo problem or an industry problem?"',
        ],
      },
      {
        label: 'Stage 4 — Diagnose the labour problem',
        interviewerSays: 'You are right that staff cost is the issue. Why might it have risen so much, and does the store expansion matter here?',
        yourTask:
          'Generate hypotheses and, crucially, say how you would test each one. This stage tests commercial judgement rather than arithmetic.',
        modelStructure: [
          'Wage rate: the UK National Living Wage rose materially over this period, and hospitality is heavily minimum-wage exposed. Test by comparing average hourly rate FY22 vs FY24.',
          'Hours: staffing is largely fixed per store — you need a barista on shift whether you serve 200 or 250 customers an hour. With transactions down 11.6% per store, the same labour is spread over fewer sales, so cost per transaction rises mechanically.',
          'New store drag: the 20 new stores are likely below maturity, running near-full staffing on lower volumes. Test by splitting staff cost ratio between mature and new stores.',
          'Mix: more food service or longer opening hours would raise labour intensity. Test against menu and opening-hours changes.',
          '"My leading hypothesis is that this is two effects compounding: statutory wage inflation the client cannot avoid, and operational deleverage from falling transactions against a largely fixed store labour model."',
        ],
        insight:
          'The deep insight is that the volume decline and the cost problem are the same problem, not two separate ones. Fixed store labour means falling transactions automatically inflate staff cost as a percentage of revenue. Recommending cost cuts alone would treat the symptom; recovering volume fixes both sides simultaneously.',
        commonMistakes: [
          'Listing hypotheses without saying how you would test any of them.',
          'Treating the volume problem and cost problem as unconnected workstreams.',
          'Jumping to "cut staff" without recognising that understaffing worsens service and accelerates the volume decline.',
          'Ignoring the new-store drag when the estate grew 10% in the period.',
        ],
        followUps: ['"If wage inflation is statutory and unavoidable, what levers are actually left?"'],
      },
      {
        label: 'Stage 5 — Size the recommendation',
        interviewerSays: 'The CEO wants to get back to a 10% margin. Quantify what it would take.',
        yourTask:
          'Work out the profit gap and test which levers could realistically close it. Show the arithmetic and then judge feasibility — a number without a feasibility view is only half an answer.',
        working: [
          'Target: 10% margin on £198m revenue = £19.8m operating profit. Current £9.9m. Gap = £9.9m.',
          'Lever A — recover transaction volume. If transactions per store returned to FY22 levels (221,400) at the current £4.60 price, revenue per store = £1.018m, so total revenue = £224m, a £26m increase.',
          'Because store labour and rent are largely fixed, most of that incremental revenue drops through after COGS at 26%: roughly £26m × 74% ≈ £19m of incremental profit. This alone more than closes the gap.',
          'Lever B — cut staff cost back by 2pp = £4.0m. Feasible partially through scheduling and automation, but risks service quality and therefore volume.',
          'Lever C — close underperforming stores. If the weakest 20 stores generate below-average contribution, closing them lifts the average but shrinks absolute profit unless they are genuinely loss-making. Needs store-level P&L data to assess.',
          'Conclusion: volume recovery is by far the highest-impact lever, and it also fixes the cost ratio automatically.',
        ],
        insight:
          'Sizing each lever separates strong candidates decisively. Anyone can say "improve efficiency"; showing that volume recovery is worth roughly £19m while a realistic cost programme is worth £4m tells the CEO where to spend management attention. Always state the assumption behind a drop-through rate rather than asserting it.',
        commonMistakes: [
          'Recommending cost cuts because they feel more concrete, without sizing the revenue lever.',
          'Applying the full margin to incremental revenue, forgetting that COGS is genuinely variable.',
          'Proposing store closures without store-level economics to justify it.',
          'Giving a recommendation with no numbers attached at all.',
        ],
        followUps: [
          '"How would you actually recover the transactions you lost?"',
          '"What would make you change your recommendation?"',
        ],
      },
    ],
    finalRecommendation: [
      '"I recommend BrewCo prioritise recovering transaction volume in its existing stores rather than launching a cost-cutting programme."',
      'First, the diagnosis: profit halved because staff costs rose 4 percentage points of revenue — about £7.9m a year — while transactions per store fell 11.6%. Those are the same problem: store labour is largely fixed, so lost volume mechanically inflates the cost ratio.',
      'Second, the sizing: recovering volume to FY22 levels is worth roughly £19m of incremental profit and closes the entire £9.9m gap on its own. A realistic labour efficiency programme is worth around £4m and risks degrading service further.',
      'Third, the reassurance: the 10% price rise was not the error — cost of goods held flat at 26% of revenue, which shows the client successfully passed through input inflation. The error was allowing service and proposition to deteriorate alongside it.',
      'Main risk: if the volume loss is driven by competitor entry rather than BrewCo\'s own execution, recovery may be structurally harder. I would prioritise customer research and a same-store cohort analysis in the first two weeks to test that before committing to the plan.',
    ],
    strongVsWeak: {
      strong: [
        'Calculated revenue per store unprompted and immediately spotted that growth was masking decline.',
        'Converted percentage points into pounds every time, making findings actionable.',
        'Connected the volume decline and the cost problem as one mechanism rather than two issues.',
        'Sized each lever before recommending, and stated the drop-through assumption explicitly.',
        'Named a specific risk with a concrete test rather than a generic caveat.',
      ],
      weak: [
        'Read exhibits aloud without calculating anything derived from them.',
        'Recommended "reduce costs and improve marketing" with no quantification.',
        'Missed that COGS staying flat proved the price rise worked.',
        'Treated the 20 new stores as irrelevant background.',
        'Delivered a chronological recap of the analysis instead of an answer-first synthesis.',
      ],
    },
    takeaways: [
      'Total revenue growth means nothing until you have checked revenue per unit — store, customer, product.',
      'Always convert percentage-point cost changes into absolute pounds.',
      'Fixed cost bases mean volume problems and cost-ratio problems are frequently the same problem.',
      'Size your levers before recommending, so the client knows where the money actually is.',
    ],
  },

  // ==================== CASE 2: MARKET ENTRY ====================
  {
    id: 'petcare',
    title: 'PetCo — UK Market Entry',
    type: 'Consulting · Market Entry',
    firm: 'MBB-style, candidate-led',
    icon: '🐾',
    color: 'text-brand-teal',
    border: 'border-brand-teal/30',
    duration: '30-35 minutes',
    difficulty: 'Standard',
    context:
      'Market entry is the second most common case type. It tests market sizing from first principles, structured assessment of attractiveness and ability to win, and a clear build/buy/partner decision. This one is candidate-led, meaning you drive the case and ask for data rather than being handed it.',
    openingPrompt:
      'Our client is PetCo, a large European pet-care retailer backed by a private equity firm. They currently operate in Germany, France and the Netherlands. They are considering entering the UK market and have asked whether they should, and if so how. What do you want to know?',
    whatTheyreTesting: [
      'Can you size a market from population anchors without any data given?',
      'Do you separate "is this market attractive?" from "can WE win in it?"',
      'Do you consider entry mode rather than just answering yes or no?',
      'Do you attach a number to your recommendation?',
    ],
    stages: [
      {
        label: 'Stage 1 — Clarify then structure',
        interviewerSays: 'What would you like to know before we begin?',
        yourTask:
          'Ask two or three sharp clarifying questions, then lay out your structure. Endless clarifying reads as stalling, so cap it and move.',
        modelStructure: [
          'Clarifying questions worth asking: What does PetCo sell — food, accessories, veterinary services, grooming? What is their store format and is it physical, online or both? What is the investment appetite and time horizon? How do they define success — revenue scale, market share, returns?',
          'Then structure across four areas:',
          '1. Market attractiveness — how big is the UK pet-care market, how fast is it growing, and how profitable is it?',
          '2. Competitive landscape — who holds share, how concentrated is it, how would incumbents respond?',
          '3. Ability to win — what advantages transfer from continental Europe, and what does not travel?',
          '4. Entry mode and economics — build organically, acquire an incumbent, or partner. What does each require and return?',
          '"I would start by sizing the market, because if it is too small the rest of the analysis is moot."',
        ],
        insight:
          'The four-part structure works because it separates two genuinely different questions: is this a good market, and are we the right people to enter it. Candidates who merge them tend to recommend entering attractive markets they have no right to win in.',
        commonMistakes: [
          'Asking eight clarifying questions before structuring anything.',
          'Using a memorised framework without adapting it to pet care.',
          'Failing to state where you would start and why.',
        ],
      },
      {
        label: 'Stage 2 — Size the UK market',
        interviewerSays: 'We do not have a market figure to hand. Can you estimate it?',
        yourTask:
          'Build from population anchors. Say every assumption aloud, use round numbers, and finish with a sanity check. The number matters far less than the transparency of the logic.',
        working: [
          'Start with households: the UK has roughly 28m households.',
          'Pet ownership: a little over half of UK households own a pet. Use 60% → about 17m pet-owning households.',
          'Annual spend per pet-owning household on food, accessories, treats and grooming: estimate £250 a year, or roughly £5 a week. State this is the assumption you are least confident in.',
          '17m × £250 = £4.25bn.',
          'Sanity check: that is about £150 per UK household across the whole population, or £4.25bn against total UK retail of roughly £400bn — around 1%. Plausible for a category of this type.',
          'Then segment: if PetCo only sells food and accessories and not veterinary services, the addressable slice might be 70% → roughly £3bn.',
          'Growth: pet ownership rose materially post-2020 and premiumisation continues, so assume mid-single-digit growth.',
        ],
        insight:
          'Explicitly flagging which assumption you are least confident in is a genuine differentiator. It shows you understand where the estimate is fragile, and interviewers often follow up by giving you the real figure to see whether you can adjust cleanly.',
        commonMistakes: [
          'Starting from the number of pets rather than households, which double-counts multi-pet homes unless handled carefully.',
          'Using precise-sounding but unjustified figures like "£317 per household".',
          'Skipping the sanity check entirely.',
          'Sizing the total market and forgetting to narrow to what the client actually sells.',
        ],
        followUps: ['"The actual market is £4bn. How does that change your view?"'],
      },
      {
        label: 'Stage 3 — Assess the ability to win',
        interviewerSays: 'The UK market is roughly £4bn, growing 5% a year, but it is dominated by one player with 25% share and a strong online challenger. Does that change things?',
        yourTask:
          'Judge whether PetCo has a genuine right to win, not just whether the market is nice. This is where most candidates are too optimistic.',
        modelStructure: [
          'What transfers from continental Europe: purchasing scale with pet food manufacturers, private-label product ranges, store operating model, category management expertise, and PE backing providing capital.',
          'What does not transfer: brand awareness (zero in the UK), supplier relationships with UK-specific brands, property portfolio and site knowledge, and understanding of UK consumer preferences which differ meaningfully by category.',
          'Competitive response: an incumbent with 25% share and scale advantages can price aggressively against a subscale entrant. Ask how profitable the incumbent is — a fat-margin incumbent has more room to retaliate.',
          'Structural question: is the UK market shifting online? If the online challenger is growing fast, a physical store rollout may be entering a channel that is losing relevance.',
          '"My concern is that PetCo would be a subscale entrant with no brand, against an incumbent with the scale to defend. That does not rule out entry, but it changes the mode."',
        ],
        insight:
          'The strongest move here is recognising that market attractiveness and ability to win point in opposite directions, and saying so. A £4bn market growing 5% is genuinely attractive; being the fourth-largest player with no brand is genuinely difficult. Holding both truths is what senior consultants do.',
        commonMistakes: [
          'Concluding "the market is big and growing, so enter" without assessing competitive position.',
          'Listing capabilities without distinguishing which actually transfer across borders.',
          'Ignoring the channel shift signalled by the online challenger.',
          'Failing to ask about incumbent profitability, which determines retaliation capacity.',
        ],
      },
      {
        label: 'Stage 4 — Choose the entry mode',
        interviewerSays: 'So how should they enter, if at all?',
        yourTask:
          'Compare build, buy and partner explicitly on speed, cost, risk and control. Then commit to one. Refusing to choose is the most common way to fail this stage.',
        modelStructure: [
          'Build organically: cheapest per store and full control, but slow. You would need years and significant losses to reach the scale where purchasing economics work, all while the incumbent responds. Highest risk of subscale failure.',
          'Acquire an incumbent: instant scale, brand, sites and supplier relationships. Expensive, and PE backing means acquisition multiples matter enormously to returns. Integration risk is real but manageable in retail. This directly solves the "no brand, no scale" problem.',
          'Partner or franchise: lowest capital and lowest risk, but also lowest control and lowest return. Sensible if the client wants to test the market before committing.',
          'Given PetCo is PE-backed with a finite fund life, organic build is likely too slow to generate returns inside the hold period.',
          '"I recommend entry by acquisition of the number two or three player, provided it can be bought at a sensible multiple."',
        ],
        insight:
          'Bringing the PE ownership into the reasoning is a strong move. A PE-backed business has a 3-7 year horizon, which makes a decade-long organic rollout structurally unattractive regardless of its theoretical merits. Tailoring the recommendation to the owner\'s constraints, not just the market, is genuine commercial judgement.',
        commonMistakes: [
          'Listing all three options and never choosing one.',
          'Recommending organic build without considering the time to reach scale.',
          'Ignoring that the client\'s PE ownership imposes a time horizon.',
          'Not attaching any condition to the recommendation — a good acquisition recommendation always has a price discipline attached.',
        ],
        followUps: ['"What would you pay for the number two player?"', '"What if no acquisition target is available?"'],
      },
    ],
    finalRecommendation: [
      '"I recommend PetCo enter the UK, but by acquisition rather than organic build, and only at a disciplined price."',
      'The market justifies interest: roughly £4bn growing 5% a year, with around £3bn addressable given PetCo does not offer veterinary services.',
      'But PetCo has no right to win organically. They would enter with zero brand awareness against a 25% share incumbent with the scale to price against a subscale challenger, in a market where an online player is already reshaping the channel mix.',
      'Acquisition solves precisely the gaps that matter — brand, sites, supplier relationships and immediate scale — and fits the 3-7 year horizon their PE owner is working to, which organic build almost certainly would not.',
      'Two conditions: the target must be available at a multiple that leaves room for returns, and I would want same-store online penetration data first, because if the channel is shifting faster than it appears, buying physical estate could be buying a declining asset.',
    ],
    strongVsWeak: {
      strong: [
        'Sized the market transparently and flagged the weakest assumption.',
        'Separated market attractiveness from ability to win, and held both in tension.',
        'Factored the PE owner\'s time horizon into the entry mode decision.',
        'Committed to a recommendation with explicit conditions attached.',
      ],
      weak: [
        'Concluded "big growing market, so enter" without competitive analysis.',
        'Presented all three entry modes without choosing.',
        'Ignored the online challenger as a signal about channel shift.',
        'Gave a recommendation with no price discipline or conditions.',
      ],
    },
    takeaways: [
      'Market entry always has two separate questions: is the market good, and can we win in it?',
      'Entry mode is usually where the real answer lives — yes/no is rarely the interesting part.',
      'Who owns the client changes what a good answer looks like.',
      'Always attach conditions and a price discipline to an acquisition recommendation.',
    ],
  },

  // ==================== CASE 3: IB M&A ====================
  {
    id: 'ma-accretion',
    title: 'Acquirer plc — Should We Buy Target Ltd?',
    type: 'Investment Banking · M&A',
    firm: 'Bank superday / lateral interview',
    icon: '🏢',
    color: 'text-yellow-400',
    border: 'border-yellow-500/30',
    duration: '20-25 minutes',
    difficulty: 'Hard',
    context:
      'This is a technical case rather than a business case: the interviewer is testing whether your valuation and accretion mechanics are genuinely fluent. Expect to do the arithmetic on paper while talking. Every number below is calculated, so follow the working rather than memorising the answers.',
    openingPrompt:
      'Acquirer plc has 200m shares trading at £25, and generated £250m of net income last year. They are considering acquiring Target Ltd, which earned £60m of net income. Target\'s shareholders are asking for 15x earnings. Talk me through how you would evaluate this, and tell me whether the deal is accretive.',
    whatTheyreTesting: [
      'Can you calculate market cap, EPS and P/E instantly?',
      'Do you understand accretion/dilution mechanically rather than by memorised rule?',
      'Can you compare funding options on their real economics?',
      'Do you know that accretive does not mean value-creating?',
    ],
    stages: [
      {
        label: 'Stage 1 — Establish the baseline',
        interviewerSays: 'Start with what we know about the acquirer.',
        yourTask: 'Calculate market cap, EPS and P/E before touching the deal. These three numbers drive everything that follows.',
        working: [
          'Market capitalisation = 200m shares × £25 = £5,000m, so £5bn.',
          'EPS = £250m net income ÷ 200m shares = £1.25.',
          'P/E = £25 share price ÷ £1.25 EPS = 20x. Equivalently £5,000m ÷ £250m = 20x.',
          'Acquirer\'s earnings yield = 1 ÷ 20 = 5%. This is the number that actually matters for the accretion test.',
          'Offer for Target = £60m × 15x = £900m.',
          'Target\'s earnings yield at that price = £60m ÷ £900m = 6.67%.',
        ],
        insight:
          'Converting P/E into an earnings yield (1 ÷ P/E) is the move that makes everything else intuitive. Acquirer\'s equity "costs" 5%; Target\'s earnings "yield" 6.67%. You are buying something that returns more than your currency costs, which is why the deal will be accretive in stock.',
        commonMistakes: [
          'Calculating P/E from the wrong figures or confusing equity value with enterprise value.',
          'Not computing earnings yields, then having to reason about accretion by rote.',
          'Forgetting that 15x applies to Target\'s earnings, not the acquirer\'s.',
        ],
      },
      {
        label: 'Stage 2 — All-stock accretion',
        interviewerSays: 'Assume they fund it entirely in stock. Is it accretive, and by how much?',
        yourTask: 'Work out new share count, combined earnings and new EPS. Then express accretion as a percentage.',
        working: [
          'Shares issued = £900m offer ÷ £25 share price = 36m new shares.',
          'New share count = 200m + 36m = 236m.',
          'Combined net income = £250m + £60m = £310m (ignoring synergies and transaction costs).',
          'New EPS = £310m ÷ 236m = £1.3136.',
          'Accretion = £1.3136 ÷ £1.25 − 1 = +5.1%.',
          'Cross-check with the yield logic: buying at a 6.67% earnings yield using currency costing 5% must be accretive. Consistent.',
        ],
        insight:
          'The general rule — in an all-stock deal, buying at a lower P/E than your own is accretive — follows directly from the yield comparison. Deriving it rather than reciting it is what marks out a candidate who actually understands the mechanics, and it protects you when the interviewer changes the assumptions.',
        commonMistakes: [
          'Dividing the offer by Target\'s share price rather than the acquirer\'s when calculating shares issued.',
          'Forgetting to add Target\'s earnings to the numerator.',
          'Quoting the new EPS without expressing accretion as a percentage.',
          'Claiming a deal is accretive without checking, because "P/E is lower" was memorised.',
        ],
      },
      {
        label: 'Stage 3 — Cash versus stock',
        interviewerSays: 'Now assume they borrow the full £900m at 6% instead. Tax is 25%. Which funding route is better for EPS?',
        yourTask: 'Model the debt-funded case and compare. The comparison, not the individual number, is the answer.',
        working: [
          'Interest cost = £900m × 6% = £54m per year.',
          'After-tax interest cost = £54m × (1 − 25%) = £40.5m.',
          'Combined net income = £250m + £60m − £40.5m = £269.5m.',
          'Share count is unchanged at 200m, because no equity was issued.',
          'New EPS = £269.5m ÷ 200m = £1.3475.',
          'Accretion = £1.3475 ÷ £1.25 − 1 = +7.8%.',
          'So debt funding is MORE accretive than stock: +7.8% versus +5.1%.',
        ],
        insight:
          'The reason is the cost comparison. The after-tax cost of debt is 6% × 0.75 = 4.5%, while issuing equity costs the acquirer its 5% earnings yield. Debt is the cheaper currency, so it produces more accretion. This is the same logic in a different guise, and interviewers love candidates who spot that both stages are one idea.',
        commonMistakes: [
          'Using the pre-tax interest cost and overstating the EPS hit.',
          'Adjusting the share count in a cash deal.',
          'Concluding debt is simply "better" without noting it adds leverage and risk.',
          'Not linking back to the after-tax cost of debt versus earnings yield comparison.',
        ],
        followUps: ['"At what interest rate would cash and stock be equally accretive?"'],
      },
      {
        label: 'Stage 4 — The judgement question',
        interviewerSays: 'The deal is accretive either way. Should they do it?',
        yourTask:
          'This is where the case is actually won. Accretion is an EPS arithmetic outcome, not a measure of value creation, and the interviewer is checking whether you know the difference.',
        modelStructure: [
          '"Accretion tells us the deal improves EPS. It does not tell us it creates value, and those are genuinely different questions."',
          'Value creation depends on whether the price paid is below the value received: is £900m less than the present value of Target\'s cash flows plus realisable synergies?',
          'A deal can be accretive and still destroy value — buying a low-multiple business precisely because it is declining will flatter EPS in year one and erode it thereafter.',
          'Questions I would want answered: why is Target on 15x when Acquirer is on 20x? Is that a growth difference, a quality difference, or a structurally declining business? What synergies are realistically achievable and what do they cost to deliver? What are the integration risks?',
          'Debt funding is more accretive but raises leverage — I would check the pro-forma net debt to EBITDA and whether it breaches covenants or threatens the credit rating.',
          '"My answer is that accretion supports the case but does not make it. I would need the strategic rationale and a valuation of Target on its own merits before recommending it."',
        ],
        insight:
          'The multiple gap is the real question in the case. Acquirer trades at 20x and Target at 15x — that gap exists for a reason, and identifying whether it reflects lower growth, lower quality or higher risk is the actual analytical task. Candidates who race to "accretive, so do it" miss the entire commercial question.',
        commonMistakes: [
          'Recommending the deal purely because the EPS maths works.',
          'Not asking why the multiple gap exists.',
          'Ignoring the leverage implications of the debt-funded route.',
          'Treating synergies as free rather than as something with a cost and an execution risk.',
        ],
      },
    ],
    finalRecommendation: [
      '"The deal is accretive on both funding routes — +5.1% in stock, +7.8% in cash — but accretion alone is not sufficient grounds to proceed."',
      'The mechanics: Acquirer trades on 20x, a 5% earnings yield, and would acquire Target\'s earnings at 15x, a 6.67% yield. Buying a higher yield than your currency costs is necessarily accretive. Debt is more accretive still because its after-tax cost is 4.5%, below the 5% cost of issuing equity.',
      'The real question is why Target trades at a five-turn discount. If that reflects slower growth or declining end-markets, the deal will flatter EPS in year one and dilute value thereafter.',
      'I would want three things before recommending: a standalone DCF of Target to test whether £900m is genuinely below intrinsic value, a bottom-up synergy case with delivery costs attached, and pro-forma leverage metrics against covenants if the cash route is chosen.',
      'On funding, cash is more accretive but adds roughly £900m of debt. I would size that against the existing capital structure rather than defaulting to whichever number is highest.',
    ],
    strongVsWeak: {
      strong: [
        'Converted P/E into earnings yield and used it to reason about both funding routes.',
        'Calculated cleanly on paper while narrating, without silent gaps.',
        'Used the after-tax cost of debt, not the headline rate.',
        'Separated accretion from value creation without being prompted.',
        'Asked why the multiple gap exists — the actual commercial question.',
      ],
      weak: [
        'Recited "lower P/E means accretive" without deriving it.',
        'Used pre-tax interest in the cash scenario.',
        'Recommended proceeding purely on the EPS outcome.',
        'Ignored the leverage consequences of debt funding.',
      ],
    },
    takeaways: [
      'Earnings yield (1 ÷ P/E) makes every accretion question intuitive.',
      'After-tax cost of debt versus earnings yield decides which funding route is more accretive.',
      'Accretive and value-creating are different tests, and interviewers deliberately probe the gap.',
      'A multiple gap between acquirer and target always deserves an explanation.',
    ],
  },

  // ==================== CASE 4: PE INVESTMENT CASE ====================
  {
    id: 'pe-testing',
    title: 'Meridian Testing — PE Investment Case',
    type: 'Private Equity · LBO + Diligence',
    firm: 'PE associate interview',
    icon: '💰',
    color: 'text-brand-teal',
    border: 'border-brand-teal/30',
    duration: '35-45 minutes',
    difficulty: 'Hard',
    context:
      'A full PE case: paper LBO under time pressure, then a judgement discussion about whether the business is actually worth owning. In a real interview you would do the maths on blank paper in about 10 minutes while talking. Every figure here reconciles, so work through the arithmetic yourself before revealing it.',
    openingPrompt:
      'Meridian is a UK testing and inspection business — it certifies industrial equipment for safety compliance. EBITDA is £45m. The seller wants 11x. Lenders will provide 5.5x EBITDA of debt. You expect EBITDA to reach £68m in five years and roughly £30m of free cash flow a year available to repay debt. Assume you exit at the same 11x multiple. Walk me through the returns, then tell me whether you would do the deal.',
    whatTheyreTesting: [
      'Can you run a paper LBO cleanly and in the right order?',
      'Can you approximate IRR without a calculator?',
      'Do you decompose returns into their drivers?',
      'Do you assess whether the business suits leverage, not just whether the maths works?',
    ],
    stages: [
      {
        label: 'Stage 1 — Sources and uses',
        interviewerSays: 'Start with the entry.',
        yourTask: 'Establish purchase price, debt quantum and the equity cheque. Do these in a fixed order every time so you never lose your place under pressure.',
        working: [
          'Entry enterprise value = £45m EBITDA × 11.0x = £495m.',
          'Debt = 5.5x × £45m = £247.5m.',
          'Equity cheque = £495m − £247.5m = £247.5m.',
          'Note that debt and equity happen to be equal here, at 50% leverage. That is a moderate structure — many deals run 55-65% debt.',
          'Sanity check: 5.5x leverage on a business with stable regulatory-driven demand is reasonable; on a cyclical business it would be aggressive.',
        ],
        insight:
          'Always state the leverage as both a multiple of EBITDA and a percentage of purchase price. Lenders think in multiples of EBITDA; sponsors think in percentage of price. Fluency in both signals you have seen real deals discussed.',
        commonMistakes: [
          'Calculating debt as a percentage of EV when the interviewer gave it as a multiple of EBITDA.',
          'Forgetting to state the equity cheque explicitly, which is the number every later calculation depends on.',
          'Not commenting on whether the leverage level is appropriate.',
        ],
      },
      {
        label: 'Stage 2 — Exit and returns',
        interviewerSays: 'Now take me to exit.',
        yourTask: 'Build exit enterprise value, subtract remaining debt, and calculate MOIC. Then approximate the IRR from memory.',
        working: [
          'Exit enterprise value = £68m EBITDA × 11.0x = £748m.',
          'Debt repaid over five years = £30m × 5 = £150m.',
          'Exit debt = £247.5m − £150m = £97.5m.',
          'Exit equity value = £748m − £97.5m = £650.5m.',
          'MOIC = £650.5m ÷ £247.5m = 2.63x.',
          'IRR approximation: from the memorised table, 2.5x over five years is about 20% and 3.0x is about 25%. 2.63x sits just above 2.5x, so roughly 21%.',
          'Precisely, 2.63^(1/5) − 1 = 21.3%. The memorised anchors got you within half a point without a calculator.',
        ],
        insight:
          'Interviewers are not testing whether you can compute a fifth root in your head. They are testing whether you have internalised the MOIC-to-IRR relationship well enough to sanity-check a deal instantly. Memorise 2.0x ≈ 15%, 2.5x ≈ 20%, 3.0x ≈ 25% for five-year holds and you will never be stuck.',
        commonMistakes: [
          'Forgetting to subtract remaining debt and quoting enterprise value as equity proceeds.',
          'Assuming all debt is repaid, when only £150m of £247.5m has been.',
          'Freezing on the IRR because no calculator is available.',
          'Not stating whether the return is good — a 21% IRR should be labelled as at or above target.',
        ],
        followUps: ['"What IRR would your fund typically target?"', '"What if you had to exit at 10x instead of 11x?"'],
      },
      {
        label: 'Stage 3 — Decompose the return',
        interviewerSays: 'Where did that return actually come from?',
        yourTask:
          'Split the equity gain into the three levers. This follow-up separates candidates who ran the maths from those who understand the model.',
        working: [
          'Total equity gain = £650.5m − £247.5m = £403m.',
          'Multiple expansion: entry and exit are both 11.0x, so this contributed exactly nothing. Say so explicitly.',
          'EBITDA growth: EBITDA rose £23m (£45m to £68m). At a constant 11.0x, that created £23m × 11 = £253m of enterprise value.',
          'Debt paydown: £150m of debt repaid flows directly to equity holders.',
          '£253m + £150m = £403m, which reconciles exactly to the total gain.',
          'So roughly 63% of the return came from operational growth and 37% from deleveraging.',
        ],
        insight:
          'A return driven by EBITDA growth is regarded as far higher quality than one driven by multiple expansion, which is essentially betting the market re-rates. This deal is attractive partly because it does not require any multiple expansion to hit target returns — that is a genuine strength worth saying out loud.',
        commonMistakes: [
          'Not checking that the three levers reconcile to the total gain, which is a free error check.',
          'Failing to note that zero multiple expansion is a positive feature of the underwriting.',
          'Attributing value to synergies, which do not exist in a standalone LBO.',
        ],
      },
      {
        label: 'Stage 4 — Is this business worth owning?',
        interviewerSays: 'The maths works. Would you actually invest?',
        yourTask:
          'Assess business quality against what leverage requires. This is the stage that actually decides the interview, and pure modellers fail it.',
        modelStructure: [
          'What makes testing and inspection a strong LBO candidate: demand is driven by safety regulation rather than discretionary spend, so it is largely non-cyclical. Revenue is recurring because certification must be renewed. Capex is typically low. Customers face switching costs because recertification with a new provider is disruptive.',
          'Cash conversion is the critical test. £30m of free cash flow on £45m of EBITDA is a 67% conversion rate, which is healthy and confirms the business genuinely produces the cash the debt schedule assumes.',
          'What I would diligence: customer concentration — is any single client more than 10% of revenue? Regulatory dependency — could a rule change remove the requirement entirely? Pricing power — has the business raised prices with inflation? Contract length and renewal rates. Capex requirements for testing equipment. Management quality and whether they roll over equity.',
          'The growth assumption needs scrutiny: £45m to £68m is a 8.6% EBITDA CAGR. Is that organic pricing and volume, or does it assume acquisitions? If it assumes a buy-and-build strategy, the model needs acquisition capital that is not in the current sources and uses.',
          '"I would proceed to detailed diligence. The structure is sensible, returns clear target without requiring multiple expansion, and the business has the characteristics that support leverage — but the entire case rests on that 8.6% growth assumption, which is what I would test hardest."',
        ],
        insight:
          'The strongest single observation available here is that the growth rate carries the deal. 63% of the return comes from EBITDA growth, so if growth halves the return collapses. Identifying which assumption the investment case is most sensitive to, and saying you would stress it, is precisely how PE professionals actually think.',
        commonMistakes: [
          'Answering "yes, 21% IRR is above target" and stopping there.',
          'Listing diligence items generically without connecting them to what the model depends on.',
          'Not checking cash conversion, which is what actually services debt.',
          'Missing that the EBITDA growth assumption may embed acquisitions requiring extra capital.',
          'Failing to run any downside case in your head — at 10x exit, equity is £680m − £97.5m = £582.5m, so MOIC falls to 2.35x and IRR to roughly 18.7%. Still acceptable, which is worth knowing.',
        ],
        followUps: [
          '"What happens to returns if EBITDA only reaches £55m?"',
          '"How much would you pay if the seller wanted 13x?"',
        ],
      },
    ],
    finalRecommendation: [
      '"I would proceed to detailed diligence. On these assumptions the deal returns 2.63x and roughly a 21% IRR over five years, which is at or above a typical fund target."',
      'Structure: £495m enterprise value at 11x, funded with £247.5m of debt at 5.5x EBITDA and a £247.5m equity cheque.',
      'Return composition is a genuine strength: 63% comes from EBITDA growth and 37% from debt paydown, with zero reliance on multiple expansion. The underwriting does not require the market to re-rate the asset.',
      'The business characteristics support leverage — regulatory-driven demand, recurring recertification revenue, low capex, and 67% cash conversion which confirms the debt schedule is fundable.',
      'The case rests almost entirely on achieving 8.6% EBITDA growth. That is what I would stress hardest in diligence: whether it is organic or acquisition-led, whether pricing has kept pace with inflation, and what customer concentration risk sits behind it. At a 10x exit the deal still returns about 2.35x and 19%, so there is some cushion, but a growth miss is what would genuinely break this.',
    ],
    strongVsWeak: {
      strong: [
        'Ran the LBO in a fixed order without losing track, narrating throughout.',
        'Approximated IRR from memorised anchors rather than freezing.',
        'Decomposed returns and checked they reconciled to the total gain.',
        'Identified cash conversion as the test of whether the debt is serviceable.',
        'Named the single assumption the deal depends on and proposed stressing it.',
        'Ran a downside exit multiple unprompted.',
      ],
      weak: [
        'Quoted exit enterprise value as if it were equity proceeds.',
        'Could not attempt an IRR without a calculator.',
        'Said "yes, returns clear hurdle" with no assessment of business quality.',
        'Listed generic diligence items unconnected to the model.',
        'Never questioned whether 8.6% growth was achievable.',
      ],
    },
    takeaways: [
      'Fixed order for every paper LBO: entry EV → debt and equity → exit EV → exit debt → exit equity → MOIC → IRR.',
      'Memorise the MOIC-to-IRR anchors so you can sanity-check instantly.',
      'Decomposing returns proves you understand the model, and the reconciliation is a free error check.',
      'Cash conversion, not EBITDA, is what services debt.',
      'Always identify the assumption carrying the deal, and stress it.',
    ],
  },
]
