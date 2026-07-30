import { useState, useRef } from 'react'
import { jobs } from '../data/jobs'
import { recordCVScore, getCVScoreHistory } from '../lib/history'
import { extractTextFromFile, ACCEPTED_FILE_TYPES } from '../lib/fileText'

type ATSMatch = {
  totalKeywords: number
  matchedKeywords: string[]
  missingKeywords: string[]
  matchPct: number
}

type AICheck = {
  aiScore: number            // 0-100, higher = reads more AI-written
  verdict: string
  verdictColor: string
  flaggedPhrases: string[]
  signals: string[]
  fixes: string[]
}

type ReviewResult = {
  score: number
  scoreLabel: string
  strengths: string[]
  improvements: string[]
  suggestions: string[]
  missingKeywords: string[]
  wordCount: number
  atsMatch: ATSMatch | null
  aiCheck: AICheck
}

// Phrases that recruiters increasingly read as AI-generated filler. None of
// these are "wrong" English — they're just statistically overused by LLMs and
// rare in genuine student writing, so a cluster of them is a strong tell.
const AI_TELL_PHRASES = [
  'delve into', 'in today\'s fast-paced', 'fast-paced world', 'ever-evolving', 'ever-changing',
  'i am passionate about', 'deeply passionate', 'passionate about leveraging', 'leverage my skills',
  'a testament to', 'underscores my', 'showcasing my', 'showcase my ability',
  'pivotal role', 'instrumental in', 'seamlessly', 'meticulous attention to detail',
  'robust understanding', 'comprehensive understanding', 'invaluable experience',
  'honed my skills', 'hone my skills', 'i am eager to leverage', 'eager to contribute',
  'align with my career', 'aligns perfectly', 'perfectly aligns', 'resonates deeply',
  'furthermore,', 'moreover,', 'in conclusion,', 'it is worth noting',
  'dynamic environment', 'fast-paced environment', 'wealth of experience',
  'unwavering commitment', 'steadfast', 'i firmly believe', 'i am confident that my',
  'this opportunity would allow me', 'i am excited about the opportunity',
  'proven track record of', 'results-driven', 'detail-oriented individual',
  'strong foundation in', 'solidified my', 'cultivated a', 'fostered a',
  'navigate the complexities', 'complexities of the financial', 'landscape of finance',
  'rapidly evolving', 'cutting-edge', 'holistic approach', 'multifaceted',
]

function computeAICheck(text: string, type: 'cv' | 'cover'): AICheck {
  const lower = text.toLowerCase()
  const words = text.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length

  const flaggedPhrases = AI_TELL_PHRASES.filter(p => lower.includes(p))

  const signals: string[] = []
  const fixes: string[] = []
  let aiScore = 0

  // 1. Tell-phrase density (the strongest single signal)
  const phraseDensity = wordCount > 0 ? (flaggedPhrases.length / wordCount) * 1000 : 0
  if (flaggedPhrases.length >= 5) {
    aiScore += 35
    signals.push(`${flaggedPhrases.length} phrases commonly overused by AI writing tools`)
    fixes.push('Replace the flagged phrases below with how you\'d actually describe it out loud to a friend.')
  } else if (flaggedPhrases.length >= 2) {
    aiScore += 18
    signals.push(`${flaggedPhrases.length} mildly AI-flavoured phrases detected`)
    fixes.push('Swap the flagged phrases for plainer wording — they\'re the fastest tell to remove.')
  } else if (flaggedPhrases.length === 1) {
    aiScore += 6
  }
  if (phraseDensity > 8) aiScore += 8

  // 2. Uniform sentence length — humans vary far more than LLMs do
  const sentences = text.split(/[.!?]+/).map(s => s.trim().split(/\s+/).filter(Boolean).length).filter(n => n > 2)
  if (sentences.length >= 4) {
    const mean = sentences.reduce((a, b) => a + b, 0) / sentences.length
    const variance = sentences.reduce((a, b) => a + (b - mean) ** 2, 0) / sentences.length
    const stdev = Math.sqrt(variance)
    if (stdev < 4 && mean > 14) {
      aiScore += 20
      signals.push('Sentences are unusually uniform in length — human writing varies much more')
      fixes.push('Break up the rhythm: cut one long sentence in half, and let another run longer.')
    }
  }

  // 3. Absence of concrete specifics — the most damning content signal
  const hasNumbers = /\d/.test(text)
  const quantCount = (text.match(/£|%|\d+x|\d{2,}/g) || []).length
  if (!hasNumbers) {
    aiScore += 20
    signals.push('No numbers anywhere — AI-written applications are generically impressive but rarely specific')
    fixes.push('Add at least three hard numbers: team sizes, percentages, amounts, dates, member counts.')
  } else if (quantCount < 3 && wordCount > 200) {
    aiScore += 10
    signals.push('Very few concrete figures for the length of the document')
    fixes.push('Quantify two more claims — specificity is the single strongest signal of genuine authorship.')
  }

  // 4. Superlative/adverb inflation
  const inflation = (lower.match(/\b(extremely|highly|deeply|truly|incredibly|significantly|greatly|immensely|profoundly)\b/g) || []).length
  if (inflation >= 4) {
    aiScore += 12
    signals.push(`${inflation} intensifier adverbs ("highly", "deeply", "truly") — a classic LLM habit`)
    fixes.push('Delete most intensifiers. "I improved it 30%" beats "I significantly improved it".')
  }

  // 5. Em-dash overuse (LLMs love them; most students rarely type them)
  const emDashes = (text.match(/—/g) || []).length
  if (emDashes >= 4) {
    aiScore += 8
    signals.push(`${emDashes} em-dashes — heavily overrepresented in AI-generated text`)
    fixes.push('Convert most em-dashes to full stops or commas.')
  }

  // 6. Cover-letter-specific: no named specifics about the firm
  if (type === 'cover') {
    const hasNamedSpecific = /\b(19|20)\d{2}\b/.test(text) || /\bacquisition|deal|IPO|report|launch|fund\b/i.test(text)
    if (!hasNamedSpecific) {
      aiScore += 15
      signals.push('No specific, checkable reference to the firm (a deal, a report, a person, a date)')
      fixes.push('Name one real, verifiable thing about the firm — a deal, a piece of research, someone you spoke to.')
    }
  }

  aiScore = Math.max(0, Math.min(aiScore, 98))

  const verdict =
    aiScore >= 65 ? 'Reads as AI-written' :
    aiScore >= 40 ? 'Some AI tells present' :
    aiScore >= 20 ? 'Mostly human, minor tells' : 'Reads as genuinely human'
  const verdictColor =
    aiScore >= 65 ? 'text-red-400' :
    aiScore >= 40 ? 'text-orange-400' :
    aiScore >= 20 ? 'text-yellow-400' : 'text-green-400'

  if (signals.length === 0) {
    signals.push('No significant AI writing patterns detected')
    fixes.push('Keep the specific, plainly-worded style you\'re using — it reads as authentically yours.')
  }

  return { aiScore, verdict, verdictColor, flaggedPhrases, signals, fixes }
}

// Very common English words + generic job-ad filler excluded so ATS keyword
// extraction surfaces genuinely distinctive terms from the job description.
const STOPWORDS = new Set([
  'the', 'and', 'for', 'you', 'your', 'are', 'with', 'will', 'this', 'that', 'have', 'has',
  'our', 'their', 'from', 'able', 'ability', 'role', 'roles', 'job', 'work', 'working', 'team',
  'teams', 'company', 'candidate', 'candidates', 'experience', 'skills', 'skill', 'strong',
  'excellent', 'good', 'high', 'well', 'across', 'within', 'into', 'other', 'such', 'all',
  'any', 'can', 'may', 'must', 'should', 'would', 'not', 'but', 'they', 'them', 'who', 'what',
  'when', 'where', 'how', 'also', 'more', 'most', 'some', 'each', 'per', 'etc', 'including',
  'related', 'position', 'opportunity', 'applicants', 'apply', 'application', 'please', 'employer',
  'about', 'they\'re', 'we\'re', 'you\'re', 'looking', 'seeking', 'ideal', 'plus', 'like',
])

function extractATSKeywords(jobDescription: string, limit = 25): string[] {
  const words = jobDescription.toLowerCase().match(/[a-z][a-z\-&+]{2,}/g) || []
  const freq = new Map<string, number>()
  words.forEach(w => {
    if (STOPWORDS.has(w)) return
    freq.set(w, (freq.get(w) || 0) + 1)
  })
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w)
}

function computeATSMatch(cvText: string, jobDescription: string): ATSMatch | null {
  if (!jobDescription.trim()) return null
  const keywords = extractATSKeywords(jobDescription)
  if (keywords.length === 0) return null
  const lowerCV = cvText.toLowerCase()
  const matchedKeywords = keywords.filter(kw => lowerCV.includes(kw))
  const missingKeywords = keywords.filter(kw => !matchedKeywords.includes(kw))
  return {
    totalKeywords: keywords.length,
    matchedKeywords,
    missingKeywords,
    matchPct: Math.round((matchedKeywords.length / keywords.length) * 100),
  }
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

function generateReview(text: string, role: string, company: string, type: 'cv' | 'cover', jobDescription: string): ReviewResult {
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

  const atsMatch = computeATSMatch(text, jobDescription)

  const aiCheck = computeAICheck(text, type)

  return { score, scoreLabel, strengths, improvements, suggestions, missingKeywords, wordCount, atsMatch, aiCheck }
}

export default function CVReviewer() {
  const [tab, setTab] = useState<'cv' | 'cover'>('cv')
  const [text, setText] = useState('')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [showATSInput, setShowATSInput] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [extracting, setExtracting] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File | undefined | null) {
    if (!file) return
    setFileError(null)
    setResult(null)
    setExtracting(true)
    try {
      const extracted = await extractTextFromFile(file)
      if (!extracted || extracted.split(/\s+/).filter(Boolean).length < 20) {
        setFileError('Barely any text could be read from that file. If it\'s a scanned/image PDF, paste the text manually instead.')
        setFileName(null)
      } else {
        setText(extracted)
        setFileName(file.name)
      }
    } catch (err) {
      setFileError(err instanceof Error ? err.message : 'Could not read that file.')
      setFileName(null)
    } finally {
      setExtracting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [priorBestScore, setPriorBestScore] = useState<number | null>(null)

  function handleReview() {
    if (!text.trim() || !role) return
    setLoading(true)
    // Snapshot the previous best BEFORE recording this attempt, so the
    // delta shown compares against past drafts, not against itself.
    const priorHistory = getCVScoreHistory().filter(e => e.type === tab && e.role === role)
    const priorBest = priorHistory.length > 0 ? Math.max(...priorHistory.map(e => e.score)) : null
    setPriorBestScore(priorBest)
    setTimeout(() => {
      const review = generateReview(text, role, company, tab, jobDescription)
      setResult(review)
      setLoading(false)
      recordCVScore({
        date: new Date().toISOString(),
        type: tab,
        role,
        company,
        score: review.score,
        scoreLabel: review.scoreLabel,
      })
    }, 1200)
  }

  const scoreColor = !result ? '' :
    result.score >= 80 ? 'text-green-400' :
    result.score >= 60 ? 'text-brand-gold' :
    result.score >= 40 ? 'text-orange-400' : 'text-red-400'

  // Version history: past drafts of the same document type + role, so
  // improvement across drafts is visible rather than only the latest score.
  const versionHistory = getCVScoreHistory().filter(e => e.type === tab && e.role === role)
  const scoreDelta = result && priorBestScore !== null ? result.score - priorBestScore : null

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

      {/* File upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Upload your {tab === 'cv' ? 'CV' : 'cover letter'}
        </label>
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]) }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragging ? 'border-brand-gold bg-brand-gold/5' : 'border-white/15 bg-brand-card hover:border-brand-gold/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            onChange={e => handleFile(e.target.files?.[0])}
            className="hidden"
          />
          {extracting ? (
            <div className="flex items-center justify-center gap-3 text-gray-300 text-sm">
              <div className="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
              Reading your file...
            </div>
          ) : fileName ? (
            <div>
              <p className="text-green-400 font-semibold text-sm">✓ {fileName}</p>
              <p className="text-gray-500 text-xs mt-1">Text extracted below — click to replace with a different file</p>
            </div>
          ) : (
            <div>
              <p className="text-3xl mb-2">📎</p>
              <p className="text-white font-semibold text-sm">Drop a file here, or click to browse</p>
              <p className="text-gray-500 text-xs mt-1">PDF, DOCX, TXT or MD · processed entirely in your browser, never uploaded</p>
            </div>
          )}
        </div>
        {fileError && <p className="text-red-400 text-xs mt-2">{fileError}</p>}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {fileName ? 'Extracted text — edit if anything came through wrong' : `Or paste your ${tab === 'cv' ? 'CV' : 'cover letter'} below`} *
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

      {versionHistory.length > 0 && (
        <div className="bg-brand-card border border-brand-teal/20 rounded-xl p-4 mb-6">
          <p className="text-brand-teal text-sm font-semibold mb-2">📈 Your progress on this {tab === 'cv' ? 'CV' : 'cover letter'} for {role.replace(/-/g, ' ')}</p>
          <div className="flex flex-wrap gap-2">
            {versionHistory.slice(-8).map((v, i) => (
              <div key={i} className="bg-white/5 rounded-lg px-3 py-1.5 text-xs">
                <span className="text-gray-500">{new Date(v.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}: </span>
                <span className="text-white font-bold">{v.score}/100</span>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-2">{versionHistory.length} previous draft{versionHistory.length !== 1 ? 's' : ''} on record — best so far: {Math.max(...versionHistory.map(v => v.score))}/100</p>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => setShowATSInput(v => !v)}
          className="text-sm text-brand-gold hover:underline flex items-center gap-1"
        >
          {showATSInput ? '▲' : '▼'} {showATSInput ? 'Hide' : 'Add'} a real job description for ATS keyword matching (optional)
        </button>
        {showATSInput && (
          <div className="mt-3">
            <textarea
              value={jobDescription}
              onChange={e => { setJobDescription(e.target.value); setResult(null) }}
              placeholder="Paste the full job description you're applying to. We'll extract its most distinctive keywords and check how many appear in your document — the same basic idea real Applicant Tracking Systems use."
              rows={6}
              className="w-full bg-brand-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold resize-none font-mono text-sm"
            />
          </div>
        )}
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
            {scoreDelta !== null && (
              <p className={`text-sm font-bold mt-3 inline-block px-3 py-1 rounded-full ${scoreDelta >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {scoreDelta >= 0 ? '↑' : '↓'} {scoreDelta >= 0 ? '+' : ''}{scoreDelta} vs your previous best draft
              </p>
            )}
          </div>

          {/* AI-Written Check */}
          <div className="bg-brand-card border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-purple-400 font-bold text-lg">🤖 AI-Written Check</h3>
              <div className="text-right">
                <span className={`text-2xl font-black ${result.aiCheck.verdictColor}`}>{result.aiCheck.aiScore}%</span>
                <p className={`text-xs font-bold ${result.aiCheck.verdictColor}`}>{result.aiCheck.verdict}</p>
              </div>
            </div>
            <div className="h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${result.aiCheck.aiScore >= 65 ? 'bg-red-400' : result.aiCheck.aiScore >= 40 ? 'bg-orange-400' : result.aiCheck.aiScore >= 20 ? 'bg-yellow-400' : 'bg-green-400'}`}
                style={{ width: `${Math.max(result.aiCheck.aiScore, 3)}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm mb-4">
              How much this reads as AI-generated. Recruiters now screen hundreds of identically-voiced applications a season — sounding like a real person is a genuine advantage. Lower is better.
            </p>

            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">What we detected</p>
            <ul className="space-y-1.5 mb-4">
              {result.aiCheck.signals.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className={`mt-0.5 flex-shrink-0 ${result.aiCheck.aiScore >= 40 ? 'text-orange-400' : 'text-green-400'}`}>
                    {result.aiCheck.aiScore >= 40 ? '!' : '✓'}
                  </span> {s}
                </li>
              ))}
            </ul>

            {result.aiCheck.flaggedPhrases.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Flagged phrases in your text</p>
                <div className="flex flex-wrap gap-2">
                  {result.aiCheck.flaggedPhrases.map((p, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-xs border border-purple-500/20">"{p}"</span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">How to sound more like you</p>
            <ul className="space-y-1.5">
              {result.aiCheck.fixes.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-brand-teal mt-0.5 flex-shrink-0">→</span> {f}
                </li>
              ))}
            </ul>

            <p className="text-gray-600 text-xs mt-4 pt-3 border-t border-white/5">
              This is a heuristic writing-style check, not a forensic detector — no tool can prove authorship. Use it to make your writing sound more specific and more like you, which helps regardless of how you drafted it.
            </p>
          </div>

          {/* ATS Match */}
          {result.atsMatch && (
            <div className="bg-brand-card border border-brand-teal/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-brand-teal font-bold text-lg">🎯 ATS Keyword Match</h3>
                <span className="text-2xl font-black text-brand-teal">{result.atsMatch.matchPct}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
                <div className="h-full bg-brand-teal rounded-full transition-all" style={{ width: `${result.atsMatch.matchPct}%` }} />
              </div>
              <p className="text-gray-400 text-sm mb-4">{result.atsMatch.matchedKeywords.length} of {result.atsMatch.totalKeywords} distinctive keywords from the job description appear in your document. Many real ATS systems screen on exactly this kind of overlap before a human ever reads your application.</p>
              {result.atsMatch.missingKeywords.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Missing from your document</p>
                  <div className="flex flex-wrap gap-2">
                    {result.atsMatch.missingKeywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm border border-red-500/20">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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
            onClick={() => { setResult(null); setText(''); setCompany(''); setFileName(null); setFileError(null) }}
            className="w-full py-3 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm"
          >
            Review Another Document
          </button>
        </div>
      )}
    </div>
  )
}
