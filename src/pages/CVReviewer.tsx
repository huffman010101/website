import { useState } from 'react'
import { jobs } from '../data/jobs'

type ReviewResult = {
  score: number
  scoreLabel: string
  strengths: string[]
  improvements: string[]
  suggestions: string[]
  missingKeywords: string[]
  wordCount: number
}

const financeKeywords: Record<string, string[]> = {
  'investment-banking': ['M&A', 'DCF', 'LBO', 'valuation', 'pitchbook', 'financial modelling', 'Bloomberg', 'deal', 'capital markets', 'EBITDA', 'leveraged', 'equity', 'debt'],
  'private-equity': ['LBO', 'due diligence', 'portfolio', 'carry', 'buyout', 'returns', 'IRR', 'MOIC', 'investment committee', 'thesis', 'cap table'],
  'quantitative-finance': ['Python', 'C++', 'statistics', 'algorithm', 'quant', 'model', 'backtesting', 'alpha', 'risk', 'machine learning', 'derivatives', 'pricing'],
  'hedge-fund': ['alpha', 'long', 'short', 'P&L', 'portfolio', 'thesis', 'risk-adjusted', 'Sharpe', 'volatility', 'strategy', 'returns'],
  'consulting': ['case', 'framework', 'stakeholder', 'McKinsey', 'strategy', 'analysis', 'recommendation', 'client', 'issue tree', 'MECE'],
  'trading': ['P&L', 'market making', 'risk', 'book', 'Bloomberg', 'execution', 'volatility', 'derivatives', 'position', 'hedging'],
  'equity-research': ['coverage', 'initiation', 'model', 'EPS', 'target price', 'sector', 'buy', 'sell', 'report', 'Bloomberg'],
  'compliance': ['FCA', 'AML', 'KYC', 'regulation', 'PRA', 'risk', 'policy', 'surveillance', 'reporting', 'ICA'],
  'fp-and-a': ['forecast', 'budget', 'variance', 'P&L', 'KPI', 'dashboard', 'management reporting', 'Excel', 'PowerPoint', 'financial planning'],
  'treasury': ['FX', 'hedging', 'liquidity', 'cash flow', 'SWIFT', 'bank', 'debt', 'ACT', 'forward', 'swap'],
}

const actionVerbs = ['led', 'managed', 'built', 'developed', 'analysed', 'created', 'delivered', 'executed', 'drove', 'generated', 'improved', 'increased', 'reduced', 'achieved', 'structured', 'advised', 'presented', 'negotiated']

function generateReview(text: string, role: string, company: string, type: 'cv' | 'cover'): ReviewResult {
  const lower = text.toLowerCase()
  const words = text.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length

  const roleKeywords = financeKeywords[role] || []
  const foundKeywords = roleKeywords.filter(kw => lower.includes(kw.toLowerCase()))
  const missingKeywords = roleKeywords.filter(kw => !lower.includes(kw.toLowerCase())).slice(0, 6)

  const foundVerbs = actionVerbs.filter(v => lower.includes(v))
  const hasQuantification = /£|%|\d+x|\d+m|\d+bn|\d+k|million|billion/.test(lower)
  const hasEducation = /university|degree|bachelor|master|msc|bsc|cfa|acca|aca|mba/.test(lower)
  const hasCompanyMention = company ? lower.includes(company.toLowerCase()) : false
  const hasSentenceStructure = wordCount > 100

  let score = 0
  if (wordCount >= 200 && wordCount <= 800) score += 20
  else if (wordCount > 100) score += 10
  if (foundKeywords.length >= 3) score += 20
  else if (foundKeywords.length >= 1) score += 10
  if (hasQuantification) score += 20
  if (foundVerbs.length >= 3) score += 15
  if (hasEducation) score += 10
  if (hasCompanyMention && company) score += 10
  if (hasSentenceStructure) score += 5

  score = Math.min(score, 95)

  const scoreLabel =
    score >= 80 ? 'Excellent' :
    score >= 65 ? 'Strong' :
    score >= 50 ? 'Good' :
    score >= 35 ? 'Needs Work' : 'Weak'

  const strengths: string[] = []
  const improvements: string[] = []
  const suggestions: string[] = []

  if (foundKeywords.length >= 3) strengths.push(`Strong use of ${role.replace(/-/g, ' ')} keywords (${foundKeywords.slice(0, 3).join(', ')})`)
  if (hasQuantification) strengths.push('Good use of quantified achievements — numbers make your impact concrete')
  if (foundVerbs.length >= 3) strengths.push(`Active language with strong action verbs (${foundVerbs.slice(0, 3).join(', ')})`)
  if (hasEducation) strengths.push('Educational credentials clearly highlighted')
  if (wordCount >= 400 && wordCount <= 700 && type === 'cv') strengths.push('Good length — concise and comprehensive')
  if (hasCompanyMention && company) strengths.push(`Company-specific content referencing ${company} shows genuine research`)
  if (strengths.length === 0) strengths.push('You have made a start — the content can be built on with the improvements below')

  if (!hasQuantification) improvements.push('Add quantified achievements — e.g. "reduced reporting time by 30%" or "modelled a £50m transaction"')
  if (foundKeywords.length < 3) improvements.push(`Include more role-specific keywords for ${role.replace(/-/g, ' ')}: try adding ${missingKeywords.slice(0, 3).join(', ')}`)
  if (foundVerbs.length < 3) improvements.push('Start bullet points with strong action verbs: Led, Built, Delivered, Drove, Analysed')
  if (wordCount < 150 && type === 'cv') improvements.push('CV appears too short — aim for 400–600 words for a finance CV')
  if (wordCount > 900 && type === 'cv') improvements.push('CV may be too long — finance recruiters spend 30 seconds on first pass. Trim to under 800 words')
  if (!hasCompanyMention && company && type === 'cover') improvements.push(`Mention ${company} specifically — cover letters should be tailored, not generic`)
  if (!hasEducation) improvements.push('Ensure your degree, university, and any finance qualifications (CFA, ACA) are clearly listed')

  if (company) {
    suggestions.push(`Research ${company}'s recent deals, strategy, or news and reference one in your cover letter`)
    suggestions.push(`Tailor your experience to match ${company}'s specific focus area in ${role.replace(/-/g, ' ')}`)
  }
  suggestions.push(`For ${role.replace(/-/g, ' ')} roles, emphasise your most relevant deal/project with a clear STAR structure`)
  suggestions.push('Use the exact language from the job description in your application — many firms use ATS screening')
  suggestions.push('Ensure consistency: same date formats, font, and bullet style throughout')

  return { score, scoreLabel, strengths, improvements, suggestions, missingKeywords, wordCount }
}

export default function CVReviewer() {
  const [tab, setTab] = useState<'cv' | 'cover'>('cv')
  const [text, setText] = useState('')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [loading, setLoading] = useState(false)

  function handleReview() {
    if (!text.trim() || !role) return
    setLoading(true)
    setTimeout(() => {
      setResult(generateReview(text, role, company, tab))
      setLoading(false)
    }, 1200)
  }

  const scoreColor = !result ? '' :
    result.score >= 80 ? 'text-green-400' :
    result.score >= 60 ? 'text-brand-gold' :
    result.score >= 40 ? 'text-orange-400' : 'text-red-400'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">CV & Cover Letter Reviewer</h1>
        <p className="text-gray-400">Paste your CV or cover letter and get targeted AI-powered feedback for your target role and company.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['cv', 'cover'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setResult(null) }}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${tab === t ? 'bg-brand-gold text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
          >
            {t === 'cv' ? 'CV Review' : 'Cover Letter Review'}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Target Role *</label>
          <select
            value={role}
            onChange={e => { setRole(e.target.value); setResult(null) }}
            className="w-full bg-brand-card border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold"
          >
            <option value="">Select a role...</option>
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Target Company (optional)</label>
          <input
            type="text"
            value={company}
            onChange={e => { setCompany(e.target.value); setResult(null) }}
            placeholder="e.g. Goldman Sachs, Blackstone..."
            className="w-full bg-brand-card border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Paste your {tab === 'cv' ? 'CV' : 'cover letter'} below *
        </label>
        <textarea
          value={text}
          onChange={e => { setText(e.target.value); setResult(null) }}
          placeholder={tab === 'cv'
            ? 'Paste the full text of your CV here...'
            : 'Paste your cover letter here...'}
          rows={12}
          className="w-full bg-brand-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold resize-none font-mono text-sm"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-600">{text.trim().split(/\s+/).filter(Boolean).length} words</span>
          {tab === 'cv' && <span className="text-xs text-gray-600">Recommended: 400–600 words</span>}
          {tab === 'cover' && <span className="text-xs text-gray-600">Recommended: 250–400 words</span>}
        </div>
      </div>

      <button
        onClick={handleReview}
        disabled={!text.trim() || !role || loading}
        className="w-full py-4 bg-brand-gold text-black font-bold rounded-xl text-lg hover:bg-brand-gold2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Analysing...' : `Review My ${tab === 'cv' ? 'CV' : 'Cover Letter'}`}
      </button>

      {loading && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-3 text-gray-400">
            <div className="w-5 h-5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
            Analysing your {tab === 'cv' ? 'CV' : 'cover letter'} for {role.replace(/-/g, ' ')} roles...
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="mt-8 space-y-6 animate-fade-in">
          {/* Score */}
          <div className="bg-brand-card border border-white/10 rounded-2xl p-6 text-center">
            <div className={`text-7xl font-black mb-2 ${scoreColor}`}>{result.score}<span className="text-3xl">/100</span></div>
            <div className={`text-2xl font-bold ${scoreColor}`}>{result.scoreLabel}</div>
            <p className="text-gray-400 text-sm mt-2">{result.wordCount} words detected · Targeting {role.replace(/-/g, ' ')}{company ? ` at ${company}` : ''}</p>
          </div>

          {/* Strengths */}
          <div className="bg-brand-card border border-green-500/20 rounded-xl p-6">
            <h3 className="text-green-400 font-bold text-lg mb-4 flex items-center gap-2">
              <span>✓</span> Strengths
            </h3>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-green-400 mt-0.5 flex-shrink-0">•</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="bg-brand-card border border-orange-500/20 rounded-xl p-6">
            <h3 className="text-orange-400 font-bold text-lg mb-4 flex items-center gap-2">
              <span>↑</span> Areas to Improve
            </h3>
            <ul className="space-y-2">
              {result.improvements.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-orange-400 mt-0.5 flex-shrink-0">•</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Keywords */}
          {result.missingKeywords.length > 0 && (
            <div className="bg-brand-card border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Missing Keywords for {role.replace(/-/g, ' ')}</h3>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm border border-red-500/20">{kw}</span>
                ))}
              </div>
              <p className="text-gray-500 text-sm mt-3">Try naturally incorporating these terms into your experience descriptions.</p>
            </div>
          )}

          {/* Suggestions */}
          <div className="bg-brand-card border border-brand-teal/20 rounded-xl p-6">
            <h3 className="text-brand-teal font-bold text-lg mb-4">Specific Suggestions</h3>
            <ul className="space-y-2">
              {result.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-brand-teal mt-0.5 flex-shrink-0">→</span> {s}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => { setResult(null); setText(''); setCompany('') }}
            className="w-full py-3 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm"
          >
            Review Another Document
          </button>
        </div>
      )}
    </div>
  )
}
