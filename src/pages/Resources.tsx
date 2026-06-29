import { useState } from 'react'

const books = [
  { title: 'The Intelligent Investor', author: 'Benjamin Graham', category: 'Investing', description: 'The definitive guide to value investing. Required reading for any serious investor.' },
  { title: 'Barbarians at the Gate', author: 'Bryan Burrough & John Helyar', category: 'M&A / PE', description: 'The story of the RJR Nabisco LBO — the most compelling finance narrative ever written.' },
  { title: 'Liar\'s Poker', author: 'Michael Lewis', category: 'Banking / Trading', description: 'Lewis\'s memoir from the Salomon Brothers trading floor. Vivid, funny, and revealing.' },
  { title: 'The Big Short', author: 'Michael Lewis', category: 'Markets / Crisis', description: 'How a handful of investors saw the 2008 mortgage crisis coming and profited from it.' },
  { title: 'When Genius Failed', author: 'Roger Lowenstein', category: 'Hedge Funds', description: 'The rise and collapse of Long-Term Capital Management — a masterclass in risk and hubris.' },
  { title: 'Flash Boys', author: 'Michael Lewis', category: 'Trading', description: 'High-frequency trading and the battle over the soul of the stock market.' },
  { title: 'Too Big to Fail', author: 'Andrew Ross Sorkin', category: 'Markets / Crisis', description: 'Inside the 2008 financial crisis — the most comprehensive account of the Lehman weekend.' },
  { title: 'The Quants', author: 'Scott Patterson', category: 'Quant Finance', description: 'How mathematicians and computer scientists took over Wall Street.' },
  { title: 'Valuation', author: 'McKinsey & Company', category: 'Financial Modelling', description: 'The definitive corporate valuation textbook. Essential for DCF and fundamental analysis.' },
  { title: 'Investment Banking', author: 'Rosenbaum & Pearl', category: 'Investment Banking', description: 'The standard IB technical reference — LBO, DCF, M&A, and comparable analysis walkthroughs.' },
  { title: 'The Ride of a Lifetime', author: 'Robert Iger', category: 'Leadership', description: 'Disney CEO\'s guide to leadership, M&A, and creative strategy.' },
  { title: 'Zero to One', author: 'Peter Thiel', category: 'Venture Capital', description: 'Thiel\'s contrarian framework for startups and monopoly thinking. VC essential reading.' },
  { title: 'The World for Sale', author: 'Javier Blas & Jack Farchy', category: 'Commodities', description: 'How commodity trading firms like Vitol and Trafigura shaped the modern world.' },
  { title: 'Against the Gods', author: 'Peter Bernstein', category: 'Risk', description: 'A history of risk — from ancient probability to modern derivatives.' },
  { title: 'Principles', author: 'Ray Dalio', category: 'Investing / Management', description: 'Dalio\'s framework for decision-making, built over 40 years running Bridgewater.' },
]

const certifications = [
  {
    name: 'CFA (Chartered Financial Analyst)',
    provider: 'CFA Institute',
    levels: '3 levels (Level I, II, III)',
    duration: '3–4 years (part-time study)',
    cost: '~£3,000–£5,000 total (registration + curriculum)',
    difficulty: 'Very High',
    whoBenefits: ['Asset Management', 'Equity Research', 'Portfolio Management', 'Hedge Funds', 'Sovereign Wealth'],
    description: 'The gold standard in investment management. Highly valued on the buy-side. Level I covers ethics, quant, economics, FRA, equity, FI, derivatives, alts, and PM. Start as early as possible.',
    passRate: '~40–45% per level',
  },
  {
    name: 'ACCA (Association of Chartered Certified Accountants)',
    provider: 'ACCA',
    levels: '13 papers + Ethics module',
    duration: '3–5 years',
    cost: '~£5,000–£8,000 total',
    difficulty: 'High',
    whoBenefits: ['FP&A', 'Corporate Finance', 'Audit', 'Treasury', 'Compliance'],
    description: 'Globally recognised accounting qualification. Strong route into corporate finance, FP&A, and controllership. More flexible than ACA but equally respected.',
    passRate: '~40–50% per paper',
  },
  {
    name: 'ACA (Associate Chartered Accountant)',
    provider: 'ICAEW',
    levels: '15 exams + 3 years training contract',
    duration: '3 years',
    cost: 'Usually employer-sponsored',
    difficulty: 'High',
    whoBenefits: ['Audit', 'Advisory', 'Corporate Finance', 'FP&A', 'Transactions'],
    description: 'The premier UK accounting qualification. Big 4 firms sponsor trainees. Excellent springboard into banking, consulting, PE, and corporate finance roles.',
    passRate: '~75–85% (well supported by employers)',
  },
  {
    name: 'FRM (Financial Risk Manager)',
    provider: 'GARP',
    levels: '2 parts',
    duration: '1–2 years',
    cost: '~£1,500–£2,500 total',
    difficulty: 'High',
    whoBenefits: ['Risk Management', 'Fixed Income', 'Treasury', 'Quant Finance'],
    description: 'The leading risk management qualification. Covers market, credit, operational, and liquidity risk. Valuable in banking risk functions and buy-side risk roles.',
    passRate: '~45% per part',
  },
  {
    name: 'CQF (Certificate in Quantitative Finance)',
    provider: 'Fitch Learning / CQF Institute',
    levels: '1 level (6-month programme)',
    duration: '6 months part-time',
    cost: '~£13,000',
    difficulty: 'Very High',
    whoBenefits: ['Quantitative Finance', 'Algorithmic Trading', 'Derivatives Pricing', 'Risk'],
    description: 'The industry qualification for quantitative finance professionals. Covers stochastic calculus, machine learning, derivatives, and algorithmic trading. Expensive but highly regarded.',
    passRate: 'Completion-based',
  },
  {
    name: 'ACT AMCT (Associate Corporate Treasurer)',
    provider: 'Association of Corporate Treasurers',
    levels: 'Certificate + Diploma',
    duration: '1–2 years',
    cost: '~£3,000–£5,000',
    difficulty: 'Medium',
    whoBenefits: ['Treasury', 'Corporate Finance', 'Banking (transaction)'],
    description: 'The definitive qualification for corporate treasury professionals. Covers cash management, FX, debt, and risk. The Certificate is the entry point; AMCT adds significant credibility and pay.',
    passRate: '~65%',
  },
  {
    name: 'CAIA (Chartered Alternative Investment Analyst)',
    provider: 'CAIA Association',
    levels: '2 levels',
    duration: '1–2 years',
    cost: '~£2,500–£4,000 total',
    difficulty: 'High',
    whoBenefits: ['Hedge Funds', 'Private Equity', 'Real Assets', 'Family Office', 'Sovereign Wealth'],
    description: 'Focused on alternative investments: PE, hedge funds, real assets, and structured products. Complements the CFA for alternatives-focused professionals.',
    passRate: '~55% per level',
  },
]

const glossary = [
  { term: 'EBITDA', definition: 'Earnings Before Interest, Taxes, Depreciation and Amortisation. A proxy for operating cash flow, used heavily in valuation (EV/EBITDA multiples) and lending (leverage ratios).' },
  { term: 'DCF (Discounted Cash Flow)', definition: 'A valuation method that values a business by discounting its projected future free cash flows back to present value using the WACC. The most theoretically rigorous valuation methodology.' },
  { term: 'WACC', definition: 'Weighted Average Cost of Capital. The blended cost of debt and equity financing, used as the discount rate in a DCF. Reflects the riskiness of the business.' },
  { term: 'LBO (Leveraged Buyout)', definition: 'An acquisition of a company using significant debt financing (leverage). The target\'s assets and cash flows collateralise the debt. Standard PE deal structure.' },
  { term: 'IRR (Internal Rate of Return)', definition: 'The annualised return of an investment. The discount rate that makes the NPV of all cash flows equal to zero. PE funds target 20%+ IRR on deals.' },
  { term: 'MOIC (Multiple on Invested Capital)', definition: 'Total value returned / total equity invested. A 3x MOIC means you tripled your money. Used alongside IRR to measure PE returns.' },
  { term: 'Alpha', definition: 'Returns generated above a relevant benchmark (market return). True alpha means a fund manager is generating value through skill, not just riding market gains.' },
  { term: 'Beta', definition: 'A measure of a stock\'s sensitivity to market movements. Beta of 1 = moves with the market. Beta > 1 = more volatile. Beta < 1 = more defensive.' },
  { term: 'Sharpe Ratio', definition: 'Risk-adjusted return measure: (Portfolio Return – Risk-Free Rate) / Standard Deviation. Higher is better. Measures return per unit of volatility.' },
  { term: 'Duration', definition: 'A bond\'s sensitivity to interest rate changes. A 5-year duration bond falls ~5% in price for every 1% rise in rates. Critical for fixed income portfolio management.' },
  { term: 'Carry (Carried Interest)', definition: 'The share of investment profits paid to PE/VC fund managers. Typically 20% of profits above an 8% hurdle rate. The primary wealth-creation mechanism for senior PE professionals.' },
  { term: 'Cap Rate', definition: 'Capitalisation rate in real estate: Net Operating Income / Property Value. A lower cap rate means higher valuation. Inversely related to interest rates.' },
  { term: 'Credit Spread', definition: 'The yield differential between a corporate bond and a risk-free government bond of the same maturity. Reflects the credit risk of the issuer. Widens in stress; tightens in benign conditions.' },
  { term: 'Covenant', definition: 'A condition in a loan agreement restricting the borrower\'s behaviour (e.g., maintaining leverage below 4x EBITDA). Breach of covenant triggers lender rights.' },
  { term: 'AUM (Assets Under Management)', definition: 'The total market value of assets a fund or manager invests on behalf of clients. Size indicator for investment firms.' },
  { term: 'NAV (Net Asset Value)', definition: 'Total assets minus liabilities, divided by shares outstanding. Used to value funds, particularly hedge funds and REITs.' },
  { term: 'Hedge', definition: 'An offsetting position taken to reduce risk. E.g., a company selling USD receivables forward to eliminate FX risk. Reduces upside as well as downside.' },
  { term: 'Arbitrage', definition: 'The simultaneous purchase and sale of an asset in different markets to profit from price differences. True risk-free arbitrage is rare; most arb involves some residual risk.' },
  { term: 'Mark-to-Market', definition: 'Valuing an asset at its current market price rather than cost. Daily practice in trading but controversial for illiquid PE and credit assets.' },
  { term: 'Working Capital', definition: 'Current Assets – Current Liabilities. A measure of short-term liquidity. Increasing working capital is a cash outflow; decreasing is a cash inflow — critical in FCF calculations.' },
]

type Category = 'All' | 'Investing' | 'M&A / PE' | 'Banking / Trading' | 'Quant Finance' | 'Markets / Crisis' | 'Hedge Funds' | 'Commodities' | 'Risk' | 'Venture Capital' | 'Leadership' | 'Investment Banking' | 'Financial Modelling' | 'Investing / Management'

export default function Resources() {
  const [bookFilter, setBookFilter] = useState<Category>('All')
  const [certFilter, setCertFilter] = useState<string>('All')
  const [glossarySearch, setGlossarySearch] = useState('')
  const [activeSection, setActiveSection] = useState<'books' | 'certs' | 'glossary'>('books')

  const bookCategories: Category[] = ['All', ...Array.from(new Set(books.map(b => b.category as Category)))]
  const certCategories = ['All', 'Investment', 'Accounting', 'Risk', 'Quant', 'Alternatives', 'Treasury']

  const filteredBooks = bookFilter === 'All' ? books : books.filter(b => b.category === bookFilter)
  const filteredGlossary = glossarySearch
    ? glossary.filter(g => g.term.toLowerCase().includes(glossarySearch.toLowerCase()) || g.definition.toLowerCase().includes(glossarySearch.toLowerCase()))
    : glossary

  const difficultyColor: Record<string, string> = {
    'Very High': 'text-red-400 bg-red-500/10',
    'High': 'text-orange-400 bg-orange-500/10',
    'Medium': 'text-yellow-400 bg-yellow-500/10',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">Resources Hub</h1>
        <p className="text-gray-400">The finance library — books, qualifications, and a glossary of every term you need to know.</p>
      </div>

      {/* Section nav */}
      <div className="flex gap-2 mb-8">
        {(['books', 'certs', 'glossary'] as const).map(s => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all capitalize ${activeSection === s ? 'bg-brand-gold text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
          >
            {s === 'certs' ? 'Qualifications' : s === 'books' ? 'Books' : 'Glossary'}
          </button>
        ))}
      </div>

      {activeSection === 'books' && (
        <div>
          <div className="flex gap-2 flex-wrap mb-6">
            {bookCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setBookFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${bookFilter === cat ? 'bg-brand-teal text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book, i) => (
              <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-5">
                <div className="text-xs text-brand-gold font-semibold mb-2">{book.category}</div>
                <h3 className="text-white font-bold mb-1">{book.title}</h3>
                <p className="text-gray-500 text-sm mb-3">by {book.author}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{book.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'certs' && (
        <div className="space-y-4">
          {certifications.map((cert, i) => (
            <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{cert.name}</h3>
                  <p className="text-gray-500 text-sm">{cert.provider}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${difficultyColor[cert.difficulty]}`}>
                  {cert.difficulty} Difficulty
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">{cert.description}</p>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div><p className="text-xs text-gray-600 mb-1">Duration</p><p className="text-gray-300 text-sm">{cert.duration}</p></div>
                <div><p className="text-xs text-gray-600 mb-1">Cost</p><p className="text-gray-300 text-sm">{cert.cost}</p></div>
                <div><p className="text-xs text-gray-600 mb-1">Pass Rate</p><p className="text-gray-300 text-sm">{cert.passRate}</p></div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-2">Best for</p>
                <div className="flex flex-wrap gap-2">
                  {cert.whoBenefits.map((r, j) => (
                    <span key={j} className="text-xs px-2 py-1 bg-brand-teal/10 text-brand-teal rounded-full">{r}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'glossary' && (
        <div>
          <div className="mb-6">
            <input
              type="text"
              value={glossarySearch}
              onChange={e => setGlossarySearch(e.target.value)}
              placeholder="Search terms..."
              className="w-full bg-brand-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold"
            />
          </div>
          <div className="space-y-3">
            {filteredGlossary.map((item, i) => (
              <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <span className="text-brand-gold font-black text-sm mt-0.5 flex-shrink-0">{item.term}</span>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.definition}</p>
                </div>
              </div>
            ))}
            {filteredGlossary.length === 0 && (
              <p className="text-gray-500 text-center py-8">No terms found for "{glossarySearch}"</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
