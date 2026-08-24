import { safeMax } from '../lib/num'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jobs } from '../data/jobs'
import { recordCareerQuizAttempt, categoryToLearnUnit } from '../lib/history'

interface CareerMatch {
  id: string
  title: string
  category: string
  shortDescription: string
  salaryRange: string
  aiThreatLevel: string
  score: number
  percentage: number
}

const categoryColors: Record<string, string> = {
  'Capital Markets': 'bg-blue-500/10 text-blue-400',
  'Alternative Investments': 'bg-purple-500/10 text-purple-400',
  'Advisory': 'bg-green-500/10 text-green-400',
  'Technology & Quant': 'bg-cyan-500/10 text-cyan-400',
  'Asset Management': 'bg-orange-500/10 text-orange-400',
  'Wealth Management': 'bg-pink-500/10 text-pink-400',
  'Risk & Control': 'bg-red-500/10 text-red-400',
  'Corporate Finance': 'bg-yellow-500/10 text-yellow-400',
  'Trading': 'bg-teal-500/10 text-teal-400',
}

const sectorImprove: Record<string, { color: string; border: string; tips: string[] }> = {
  "Capital Markets": {
    "color": "text-blue-400",
    "border": "border-blue-500/20",
    "tips": [
      "Build a genuinely clean three-statement model from scratch — not a template you filled in — and be ready to walk through every formula. This is the single most common technical bar-raiser at IB/ECM/DCM interviews.",
      "Track two or three live deals in the news every week and form a one-paragraph view on why the deal was structured the way it was — interviewers ask 'walk me through a deal you've followed' constantly and generic answers stand out immediately.",
      "Get comfortable with the mechanics of accretion/dilution, WACC, and a basic LBO — even for M&A-focused roles, these come up as technical screens.",
      "Do a spring week or insight day at a bank if you can — this is genuinely the single highest-leverage thing you can do, since most banks convert a large share of their graduate class from spring week attendees.",
      "Practise mental maths and the Online Test Practice numerical/logical sections relentlessly — capital markets roles screen hardest on speed-under-pressure psychometrics before any human reviews your CV."
    ]
  },
  "Alternative Investments": {
    "color": "text-purple-400",
    "border": "border-purple-500/20",
    "tips": [
      "Build a full LBO model on a real, publicly-listed company end to end — sources & uses, debt schedule, returns bridge — this is the standard PE/VC technical test and most candidates arrive under-practised on it specifically.",
      "Have 2-3 genuine investment pitches ready (a stock, a private company, or a sector thesis) with a clear entry point, catalyst, and risk — hedge funds and VCs will ask 'pitch me a stock/company' in almost every interview.",
      "Read one long-form investor letter or 10-K a week and take real notes — the depth of your public-market or company knowledge is tested directly and generic answers are obvious to experienced interviewers.",
      "For VC specifically, follow founders and early-stage deals on platforms like Crunchbase or the Sifted newsletter, and be able to discuss a company you'd have backed at seed stage and why.",
      "Alternative investment roles hire disproportionately through networking rather than the standard grad scheme funnel — cold-email 3-5 people a month using the Networking Guide's scripts, since many of these seats are never even formally advertised."
    ]
  },
  "Advisory": {
    "color": "text-green-400",
    "border": "border-green-500/20",
    "tips": [
      "Practise case interviews specifically — profitability cases, market entry, M&A cases — using the Full Case Studies section until the structuring process (not just the arithmetic) becomes automatic.",
      "Build a genuine point of view on 2-3 industries by reading sector-specific news weekly, since consulting interviewers frequently probe 'why this industry' and shallow answers are the most common rejection reason at this stage.",
      "Drill mental maths and market-sizing estimation until you can produce a defensible answer to 'how many piano tuners are in London' in under two minutes, showing your working out loud.",
      "Work on structured verbal communication — practise explaining a complex idea in under 60 seconds with a clear top-line answer first, then supporting logic (the 'pyramid principle'), since consulting interviews explicitly grade communication structure.",
      "Get comfortable being interrupted and redirected mid-case without losing your structure — this is deliberately tested, and rehearsing live cases (not just reading them) is the only way to build resilience to it."
    ]
  },
  "Technology & Quant": {
    "color": "text-cyan-400",
    "border": "border-cyan-500/20",
    "tips": [
      "Be fluent in Python (numpy/pandas at minimum) and at least the basics of probability, linear algebra and statistics — quant interviews test these directly with live coding and brainteaser-style probability questions.",
      "Drill mental maths without a calculator daily — quant and trading firms (Optiver, IMC, Jane Street, DRW) run notoriously fast arithmetic rounds, and the Mental Maths Drill under Online Test Practice mirrors this format directly.",
      "Practise genuine probability brainteasers (expected value, conditional probability, game-theory puzzles) — these are a completely different skill from standard finance technicals and need dedicated practice, not just general 'being good at maths'.",
      "Build one real, documented coding project (a backtest, a pricing model, a data pipeline) you can discuss in depth — 'tell me about a project' is asked constantly and a vague answer signals you haven't actually built anything real.",
      "If targeting fintech specifically, be able to explain how a real financial product actually works end to end (payments rails, how a robo-advisor rebalances, how a neobank makes money) — this sector hires for genuine product curiosity, not just technical ability."
    ]
  },
  "Asset Management": {
    "color": "text-orange-400",
    "border": "border-orange-500/20",
    "tips": [
      "Have a genuine, well-reasoned stock or fund pitch ready, including valuation method (DCF, comps, or both), catalysts, and the strongest counter-argument against your own thesis — being able to argue against yourself is what separates strong candidates.",
      "Understand the difference between active and passive management, and be able to discuss why active managers underperform on average and what that means for how a fund positions itself — this is asked constantly across equity research and portfolio management interviews.",
      "Consider working toward the CFA Level 1 while still at university if this sector is a genuine target — it signals serious commitment and many asset managers explicitly favour candidates already on the path.",
      "Follow a specific sector (tech, healthcare, energy) in real depth rather than trying to know a little about everything — research and portfolio management interviews reward genuine specialism over surface-level breadth.",
      "Practise explaining performance attribution (was a return driven by stock selection, sector allocation, or market timing) — this distinction comes up in both technical interviews and on the job from day one."
    ]
  },
  "Wealth Management": {
    "color": "text-pink-400",
    "border": "border-pink-500/20",
    "tips": [
      "Practise explaining financial concepts (compound interest, diversification, risk tolerance) in plain English with zero jargon — this sector hires specifically for the ability to make complex ideas accessible to non-experts, and interviewers test this directly.",
      "Work on genuine rapport-building and active listening — role-play a client conversation with a friend where your only job is to understand their goals before proposing anything, since premature advice-giving is the most common mistake junior advisors make.",
      "Understand the basics of financial planning (pensions, ISAs, inheritance tax, risk profiling) even before you have formal training — showing you've done this homework unprompted stands out enormously at this level.",
      "Private banking and family office roles hire heavily on trust and discretion — be ready to discuss a time you handled sensitive information carefully, since confidentiality is tested as a genuine competency, not just an assumed value.",
      "Build your network deliberately — client-facing wealth roles disproportionately go to candidates who already present as comfortable and credible with senior, wealthy individuals, so practise the Interview Mastery behavioural questions until your presence feels natural, not rehearsed."
    ]
  },
  "Risk & Control": {
    "color": "text-red-400",
    "border": "border-red-500/20",
    "tips": [
      "Understand the core risk types (market, credit, operational, liquidity) and be able to give a real example of each — this is the most commonly asked technical question in risk and compliance interviews and many candidates cannot answer it precisely.",
      "Follow major regulatory stories (a bank fine, a new capital rule, a market abuse case) and be able to explain what actually went wrong and what rule was meant to prevent it — this sector explicitly rewards candidates who read regulatory news, which most graduates don't.",
      "For actuarial roles specifically, start the actuarial exams (via the IFoA) as early as possible — exam progress is often a hard screening criterion before a CV is even reviewed, more so than in almost any other finance sector.",
      "Practise probability and statistics fluency, since actuarial and quantitative risk roles test this directly, and it is a different muscle from the general numerical reasoning tested elsewhere.",
      "Be ready to discuss a time you flagged a problem or disagreed with a decision (even a small one) — risk and compliance interviewers are explicitly screening for the willingness to raise uncomfortable issues, which the Situational Judgement section of Online Test Practice trains directly."
    ]
  },
  "Corporate Finance": {
    "color": "text-yellow-400",
    "border": "border-yellow-500/20",
    "tips": [
      "Get comfortable building and defending a budget or forecast model with clear assumptions — FP&A and treasury interviews test whether you can explain WHY a number is what it is, not just produce the number.",
      "Understand working capital management (cash conversion cycle, receivables/payables) and basic treasury concepts (FX hedging, liquidity management) — these come up constantly and are rarely covered in university finance courses.",
      "Practise explaining variance analysis (why did actual results differ from budget) in a structured way — this is the single most common day-to-day task in FP&A roles and interviewers test it directly with case-style questions.",
      "For corporate development roles, be ready to discuss how you'd evaluate a potential acquisition target from inside a company (strategic fit, not just financial return) — this differs meaningfully from the sell-side M&A framing taught in most interview prep.",
      "These roles are less oversubscribed than investment banking, so a genuinely strong, well-prepared application stands out more easily — invest the same rigour in technicals and case prep as you would for IB, since the bar per candidate that shows up prepared is lower to clear."
    ]
  },
  "Trading": {
    "color": "text-teal-400",
    "border": "border-teal-500/20",
    "tips": [
      "Drill mental maths without a calculator every single day — trading firms (especially prop shops like Optiver, IMC, Jane Street, Flow Traders) screen almost entirely on speed and accuracy under pressure before discussing anything else.",
      "Practise probability and expected-value brainteasers specifically — 'would you take this bet' style questions are asked constantly and reward a very particular way of thinking that needs dedicated practice, not just general intelligence.",
      "Understand market microstructure basics — bid-ask spread, how a market maker earns the spread, what moves it wider or narrower — since this comes up even in early screening interviews for market-making roles.",
      "Follow one asset class (rates, FX, commodities, equities) closely enough to have a genuine, current view on what's driving it — 'what do you think will happen to X' is asked constantly and vague answers are an instant red flag.",
      "Use the Role Skill Drills and Online Test Practice's logical/inductive reasoning sections specifically — cut-e/Aon-style pattern tests are disproportionately used by trading firms and reward a different kind of fast pattern recognition than standard numerical tests."
    ]
  }
}

export default function Results() {
  const navigate = useNavigate()
  const [matches, setMatches] = useState<CareerMatch[]>([])
  const [loaded, setLoaded] = useState(false)
  const [expandedSector, setExpandedSector] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('findr-quiz-scores')
    if (!stored) {
      navigate('/quiz')
      return
    }

    const scores: Record<string, number> = JSON.parse(stored)
    const maxScore = safeMax(Object.values(scores))

    const ranked: CareerMatch[] = jobs.map(job => ({
      id: job.id,
      title: job.title,
      category: job.category,
      shortDescription: job.shortDescription,
      salaryRange: job.salaryRange,
      aiThreatLevel: job.aiThreatLevel,
      score: scores[job.id] || 0,
      percentage: maxScore > 0 ? Math.round(((scores[job.id] || 0) / maxScore) * 100) : 0,
    }))
      .sort((a, b) => b.score - a.score)

    setMatches(ranked)
    setLoaded(true)

    // Only record once per distinct result — revisiting this page without
    // retaking the quiz shouldn't create duplicate history entries.
    const recordedMarker = localStorage.getItem('findr-quiz-scores-recorded')
    if (ranked.length > 0 && recordedMarker !== stored) {
      recordCareerQuizAttempt({
        date: new Date().toISOString(),
        topMatchId: ranked[0].id,
        topMatchTitle: ranked[0].title,
        topMatchPercentage: ranked[0].percentage,
        top3: ranked.slice(0, 3).map(m => ({ id: m.id, title: m.title, percentage: m.percentage })),
      })
      localStorage.setItem('findr-quiz-scores-recorded', stored)
    }
  }, [navigate])

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-brand-gold animate-pulse text-xl font-bold">Calculating your matches...</div>
      </div>
    )
  }

  const topMatch = matches[0]
  const top3 = matches.slice(0, 3)
  const rest = matches.slice(3)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full px-4 py-1.5 mb-4">
          <span className="text-brand-gold text-sm font-medium">Quiz Complete</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Your Career <span className="text-gradient-gold">Matches</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Based on your answers, here are the finance careers that best match your personality, skills, and goals.
        </p>
      </div>

      {/* Top match hero */}
      <div className="bg-gradient-to-br from-brand-gold/10 to-brand-teal/10 border border-brand-gold/30 rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-brand-gold text-sm font-bold bg-brand-gold/10 px-3 py-1 rounded-full">#1 Best Match</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[topMatch?.category] || ''}`}>
            {topMatch?.category}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">{topMatch?.title}</h2>
        <p className="text-gray-300 leading-relaxed mb-5 max-w-2xl">{topMatch?.shortDescription}</p>

        <div className="flex flex-wrap items-center gap-6 mb-5">
          <div>
            <div className="text-xs text-gray-500 mb-1">Match Score</div>
            <div className="text-3xl font-black text-brand-gold">{topMatch?.percentage}%</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Salary Range</div>
            <div className="text-brand-teal font-bold">{topMatch?.salaryRange}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">AI Threat</div>
            <div className="text-white font-semibold">{topMatch?.aiThreatLevel}</div>
          </div>
        </div>

        {/* Match bar */}
        <div className="h-2 bg-white/10 rounded-full mb-5">
          <div
            className="h-full bg-gradient-to-r from-brand-gold to-brand-teal rounded-full transition-all duration-1000"
            style={{ width: `${topMatch?.percentage}%` }}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/jobs/${topMatch?.id}`}
            className="inline-block px-6 py-3 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors"
          >
            Explore This Career →
          </Link>
          {topMatch && categoryToLearnUnit[topMatch.category] && (
            <Link
              to="/learn"
              className="inline-block px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
            >
              📖 Start {categoryToLearnUnit[topMatch.category].unitTitle}
            </Link>
          )}
          <Link
            to="/interview-quiz"
            className="inline-block px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
          >
            🎯 Practise {topMatch?.title} Interview Questions
          </Link>
        </div>
      </div>

      {/* Top 3 */}
      <h2 className="text-xl font-bold text-white mb-4">Your Top 3 Career Matches</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {top3.map((match, i) => (
          <Link
            key={match.id}
            to={`/jobs/${match.id}`}
            className="bg-brand-card border border-white/10 rounded-xl p-5 hover:border-brand-gold/30 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-brand-gold font-black text-lg">#{i + 1}</span>
              <span className="text-white font-bold text-lg">{match.percentage}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full mb-3">
              <div
                className="h-full bg-brand-gold rounded-full"
                style={{ width: `${match.percentage}%` }}
              />
            </div>
            <h3 className="text-white font-bold text-sm mb-1 group-hover:text-brand-gold transition-colors">{match.title}</h3>
            <p className="text-gray-500 text-xs">{match.category}</p>
          </Link>
        ))}
      </div>

      {/* All results */}
      <h2 className="text-xl font-bold text-white mb-4">All Career Matches</h2>
      <div className="bg-brand-card border border-white/10 rounded-xl overflow-hidden mb-10">
        {matches.map((match, i) => (
          <Link
            key={match.id}
            to={`/jobs/${match.id}`}
            className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group"
          >
            <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white text-sm font-semibold group-hover:text-brand-gold transition-colors truncate mr-2">
                  {match.title}
                </span>
                <span className="text-brand-gold text-sm font-bold flex-shrink-0">{match.percentage}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    i === 0 ? 'bg-brand-gold' :
                    i === 1 ? 'bg-brand-teal' :
                    i === 2 ? 'bg-purple-400' :
                    'bg-white/30'
                  }`}
                  style={{ width: `${match.percentage}%` }}
                />
              </div>
            </div>
            <span className="text-gray-600 text-xs hidden sm:block flex-shrink-0">{match.category}</span>
          </Link>
        ))}
      </div>

      {/* How to strengthen your fit, per sector */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-1">📈 How to strengthen your fit, sector by sector</h2>
        <p className="text-gray-500 text-sm mb-4">Match score reflects fit with your answers — these are concrete, specific actions to become a genuinely stronger candidate for each sector, starting with the ones your top matches sit in.</p>
        <div className="space-y-2.5">
          {Object.keys(sectorImprove)
            .sort((a, b) => {
              const aTop = top3.some(m => m.category === a) ? 0 : 1
              const bTop = top3.some(m => m.category === b) ? 0 : 1
              return aTop - bTop
            })
            .map(sector => {
              const info = sectorImprove[sector]
              const isTopSector = top3.some(m => m.category === sector)
              const isOpen = expandedSector === sector
              return (
                <div key={sector} className={`bg-brand-card border ${info.border} rounded-xl overflow-hidden`}>
                  <button
                    onClick={() => setExpandedSector(isOpen ? null : sector)}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${info.color}`}>{sector}</span>
                      {isTopSector && <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full">In your top 3</span>}
                    </span>
                    <span className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                  </button>
                  {isOpen && (
                    <ul className="px-4 pb-4 space-y-2">
                      {info.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
                          <span className={`mt-0.5 flex-shrink-0 ${info.color}`}>▸</span> {tip}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/quiz"
          onClick={() => localStorage.removeItem('findr-quiz-scores')}
          className="px-6 py-3 bg-white/5 border border-white/10 text-gray-300 font-semibold text-sm rounded-xl hover:bg-white/10 transition-colors text-center"
        >
          Retake Quiz
        </Link>
        <Link
          to="/jobs"
          className="px-6 py-3 bg-brand-gold text-black font-bold text-sm rounded-xl hover:bg-brand-gold2 transition-colors text-center"
        >
          Explore All Careers
        </Link>
        <Link
          to="/advisor"
          className="px-6 py-3 bg-brand-teal text-white font-bold text-sm rounded-xl hover:bg-brand-teal2 transition-colors text-center"
        >
          Chat with AI Advisor
        </Link>
      </div>
    </div>
  )
}
