import { mean, barWidth } from '../lib/num'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { jobs } from '../data/jobs'
import { recordAnswer as recordSRAnswer, weightedSample } from '../lib/spacedRepetition'
import { recordInterviewQuizAttempt, getInterviewQuizHistory } from '../lib/history'

const SR_KEY = 'findr_sr_interview_quiz'

type Question = {
  id: string
  question: string
  type: 'technical' | 'behavioural'
  careerTitle: string
  careerId: string
  modelAnswer: string
  keyPoints: string[]
}

const allQuestions: Question[] = jobs.flatMap(job => {
  const techQ = (job.interviewQA?.technical || []).map(q => ({
    id: `${job.id}-tech-${q.question.slice(0, 20)}`,
    question: q.question,
    type: 'technical' as const,
    careerTitle: job.title,
    careerId: job.id,
    modelAnswer: q.answer,
    keyPoints: q.keyPoints,
  }))
  const behQ = (job.interviewQA?.behavioural || []).map(q => ({
    id: `${job.id}-beh-${q.question.slice(0, 20)}`,
    question: q.question,
    type: 'behavioural' as const,
    careerTitle: job.title,
    careerId: job.id,
    modelAnswer: q.answer,
    keyPoints: q.keyPoints,
  }))
  return [...techQ, ...behQ]
})

// Also pull from raw technical/behavioural question lists as practice-only questions
const practiceQuestions: Question[] = jobs.flatMap(job => {
  const techQ = job.technicalQuestions.map((q, i) => ({
    id: `${job.id}-tech-raw-${i}`,
    question: q,
    type: 'technical' as const,
    careerTitle: job.title,
    careerId: job.id,
    modelAnswer: '',
    keyPoints: [],
  }))
  const behQ = job.behaviouralQuestions.map((q, i) => ({
    id: `${job.id}-beh-raw-${i}`,
    question: q,
    type: 'behavioural' as const,
    careerTitle: job.title,
    careerId: job.id,
    modelAnswer: '',
    keyPoints: [],
  }))
  return [...techQ, ...behQ]
})

const combinedQuestions = [...allQuestions, ...practiceQuestions]

function evaluateAnswer(userAnswer: string, modelAnswer: string, keyPoints: string[]): {
  score: number
  label: string
  feedback: string
  matchedPoints: string[]
  missedPoints: string[]
} {
  const lower = userAnswer.toLowerCase()
  const matchedPoints = keyPoints.filter(kp => {
    const words = kp.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    return words.some(w => lower.includes(w))
  })
  const missedPoints = keyPoints.filter(kp => !matchedPoints.includes(kp))

  const lengthScore = Math.min(Math.floor(userAnswer.trim().split(/\s+/).length / 8), 30)
  const coverageScore = keyPoints.length > 0 ? Math.round((matchedPoints.length / keyPoints.length) * 50) : 25
  const hasStructure = /first|second|because|therefore|however|example|instance|result/.test(lower)
  const hasNumbers = /\d+|%|£/.test(lower)
  const structureScore = hasStructure ? 15 : 0
  const detailScore = hasNumbers ? 10 : 0

  const score = Math.min(lengthScore + coverageScore + structureScore + detailScore, 95)
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Developing' : 'Needs Practice'

  const feedback = score >= 80
    ? 'Strong answer. You covered the key points clearly and structured your response well.'
    : score >= 60
    ? 'Good attempt. You touched on important points but could add more depth and structure.'
    : score >= 40
    ? 'You are on the right track. Try to incorporate the key points below and add a concrete example.'
    : 'This answer needs more development. Study the model answer and key points, then try again.'

  return { score, label, feedback, matchedPoints, missedPoints }
}

export default function InterviewQuiz() {
  const [selectedCareer, setSelectedCareer] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'technical' | 'behavioural'>('all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showModel, setShowModel] = useState(false)
  const [score, setScore] = useState<ReturnType<typeof evaluateAnswer> | null>(null)
  const [sessionScores, setSessionScores] = useState<number[]>([])
  const [started, setStarted] = useState(false)
  const [sessionLength, setSessionLength] = useState<10 | 15 | 20 | 'all'>(15)
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([])
  const recordedRef = useRef(false)

  const filtered = combinedQuestions.filter(q => {
    if (selectedCareer && q.careerId !== selectedCareer) return false
    if (selectedType !== 'all' && q.type !== selectedType) return false
    return true
  })

  const current = sessionQuestions[currentIndex]

  // Record the session once it ends (current becomes undefined after the last question)
  useEffect(() => {
    if (!started || current || sessionScores.length === 0 || recordedRef.current) return
    recordedRef.current = true
    const avgScore = Math.round(mean(sessionScores))
    recordInterviewQuizAttempt({
      date: new Date().toISOString(),
      careerId: selectedCareer || 'all',
      careerTitle: selectedCareer ? (jobs.find(j => j.id === selectedCareer)?.title || selectedCareer) : 'All Careers',
      questionsAnswered: sessionScores.length,
      avgScore,
    })
  }, [started, current, sessionScores, selectedCareer])

  function handleSubmit() {
    if (!userAnswer.trim() || !current) return
    if (current.modelAnswer) {
      const result = evaluateAnswer(userAnswer, current.modelAnswer, current.keyPoints)
      setScore(result)
      setSessionScores(prev => [...prev, result.score])
      recordSRAnswer(SR_KEY, current.id, result.score >= 60)
    } else {
      setShowModel(true)
    }
    setSubmitted(true)
  }

  function handleNext() {
    setCurrentIndex(i => Math.min(i + 1, sessionQuestions.length - 1))
    setUserAnswer('')
    setSubmitted(false)
    setShowModel(false)
    setScore(null)
  }

  function handleStart() {
    recordedRef.current = false
    const n = sessionLength === 'all' ? filtered.length : Math.min(sessionLength, filtered.length)

    // Only some questions carry a written model answer and key points; the
    // rest are practice-only and can just be self-assessed. Coached questions
    // are far more useful, so fill the session from those first and only top
    // up with practice-only ones if the session is longer than the coached
    // pool. Without this, a session drawn at random is mostly uncoached.
    const coached = filtered.filter(q => q.modelAnswer)
    const selfAssessed = filtered.filter(q => !q.modelAnswer)

    // Weighted sampling means questions you've gotten wrong before are more
    // likely to be picked and appear more often across repeated sessions.
    const chosen = weightedSample(SR_KEY, coached.map(q => ({ id: q.id, value: q })), Math.min(n, coached.length))
    if (chosen.length < n) {
      chosen.push(...weightedSample(
        SR_KEY,
        selfAssessed.map(q => ({ id: q.id, value: q })),
        n - chosen.length,
      ))
    }

    setSessionQuestions(chosen)
    setStarted(true)
    setCurrentIndex(0)
    setSessionScores([])
  }

  const avgScore = sessionScores.length > 0
    ? Math.round(mean(sessionScores))
    : 0

  const scoreColor = (s: number) =>
    s >= 80 ? 'text-green-400' : s >= 60 ? 'text-brand-gold' : s >= 40 ? 'text-orange-400' : 'text-red-400'

  if (!started) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Link to="/jobs" className="text-sm text-gray-500 hover:text-brand-gold transition-colors">← Back to Careers</Link>
          <h1 className="text-4xl font-black text-white mt-3 mb-2">Interview Question Quiz</h1>
          <p className="text-gray-400">Practice real finance interview questions, type your answer, and get AI-powered feedback on how you did.</p>
        </div>

        <div className="bg-brand-card border border-white/10 rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Career (optional)</label>
            <select
              value={selectedCareer}
              onChange={e => setSelectedCareer(e.target.value)}
              className="w-full bg-brand-darker border border-white/10 rounded-lg px-4 py-3 text-white"
            >
              <option value="">All careers ({combinedQuestions.length} questions)</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} ({combinedQuestions.filter(q => q.careerId === j.id).length} questions)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Question Type</label>
            <div className="flex gap-2">
              {(['all', 'technical', 'behavioural'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    selectedType === t ? 'bg-brand-gold text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Session Length</label>
            {/* Scrolls horizontally rather than pushing the whole page sideways
                on narrow phones — "All (383)" is wide enough to overflow 375px */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {([10, 15, 20, 'all'] as const).map(len => (
                <button
                  key={len}
                  onClick={() => setSessionLength(len)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    sessionLength === len ? 'bg-brand-gold text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {len === 'all' ? `All (${filtered.length})` : `${len} questions`}
                </button>
              ))}
            </div>
            <p className="text-gray-600 text-xs mt-2">Questions you've scored poorly on before are weighted to appear more often — the quiz adapts to your weak spots.</p>
          </div>

          <div className="bg-brand-darker rounded-xl p-4">
            <p className="text-gray-300 text-sm">
              <span className="text-white font-bold">{filtered.length} questions</span> available with current filters.
              Questions with model answers will give you a score; others show the model answer for self-assessment.
            </p>
          </div>

          <button
            onClick={handleStart}
            disabled={filtered.length === 0}
            className="w-full py-4 bg-brand-gold text-black font-bold rounded-xl text-lg hover:bg-brand-gold2 transition-colors disabled:opacity-40"
          >
            Start Practice Session
          </button>
        </div>
      </div>
    )
  }

  if (!current) {
    const historyTrend = getInterviewQuizHistory().slice(-10).map(a => a.avgScore)
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <h2 className="text-3xl font-black text-white mb-4">Session Complete!</h2>
        {sessionScores.length > 0 && (
          <div className={`text-6xl font-black mb-4 ${scoreColor(avgScore)}`}>{avgScore}<span className="text-2xl">/100</span></div>
        )}
        <p className="text-gray-400 mb-8">{sessionScores.length} questions answered</p>

        {historyTrend.length >= 2 && (
          <div className="bg-brand-card border border-white/10 rounded-xl p-5 mb-8 text-left max-w-sm mx-auto">
            <p className="text-white font-semibold text-sm mb-2">Score trend — last {historyTrend.length} sessions</p>
            <svg viewBox="0 0 240 48" className="w-full h-12">
              <polyline
                points={historyTrend.map((v, i) => `${(i / (historyTrend.length - 1)) * 240},${48 - (v / 100) * 48}`).join(' ')}
                fill="none" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
              {historyTrend.map((v, i) => (
                <circle key={i} cx={(i / (historyTrend.length - 1)) * 240} cy={48 - (v / 100) * 48} r="2.5" fill="#f5c518" />
              ))}
            </svg>
            <p className="text-gray-500 text-xs mt-1">Latest: {historyTrend[historyTrend.length - 1]}/100</p>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button onClick={() => { setStarted(false); setCurrentIndex(0) }} className="px-6 py-3 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors">
            New Session
          </button>
          <Link to="/jobs" className="px-6 py-3 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-colors">
            Back to Careers
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setStarted(false)} className="text-sm text-gray-500 hover:text-brand-gold transition-colors">← Back to Setup</button>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {sessionScores.length > 0 && <span className={`font-semibold ${scoreColor(avgScore)}`}>Avg: {avgScore}/100</span>}
          <span>{currentIndex + 1} / {sessionQuestions.length}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/5 rounded-full mb-8">
        <div className="h-full bg-brand-gold rounded-full transition-all" style={{ width: barWidth(currentIndex + 1, sessionQuestions.length) }} />
      </div>

      {/* Question card */}
      <div className="bg-brand-card border border-white/10 rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${current.type === 'technical' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
            {current.type === 'technical' ? 'Technical' : 'Behavioural'}
          </span>
          <Link to={`/jobs/${current.careerId}`} className="text-xs text-gray-500 hover:text-brand-gold transition-colors">
            {current.careerTitle}
          </Link>
          {/* Be upfront about which questions come with a written model answer
              and which are self-assessed, so an empty model answer is never a
              silent surprise after you have committed to an answer. */}
          <span
            title={current.modelAnswer
              ? 'A written model answer and key points are provided for this question.'
              : 'Extra practice question — you assess your own answer against the prompts provided.'}
            className={`text-xs font-bold px-3 py-1 rounded-full ml-auto ${
              current.modelAnswer ? 'bg-brand-teal/10 text-brand-teal' : 'bg-white/5 text-gray-500'
            }`}
          >
            {current.modelAnswer ? '✓ Model answer' : 'Self-assessed'}
          </span>
        </div>
        <h2 className="text-xl font-bold text-white leading-relaxed">{current.question}</h2>
      </div>

      {/* Answer area */}
      {!submitted ? (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Your Answer</label>
          <textarea
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder="Type your answer here. Try to answer as you would in a real interview — you can speak your thoughts or write them out..."
            rows={8}
            className="w-full bg-brand-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold resize-none"
          />
          <div className="flex items-center justify-between mt-2 mb-4">
            <span className="text-xs text-gray-600">{userAnswer.trim().split(/\s+/).filter(Boolean).length} words</span>
            <span className="text-xs text-gray-600">Aim for 100–250 words in a real interview</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className="flex-1 py-3 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors disabled:opacity-40"
            >
              Submit Answer
            </button>
            <button
              onClick={() => { setShowModel(true); setSubmitted(true) }}
              className="px-4 py-3 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-colors text-sm"
            >
              Skip & See Answer
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {/* Score */}
          {score && (
            <div className="bg-brand-card border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className={`text-4xl font-black ${scoreColor(score.score)}`}>{score.score}</span>
                  <span className="text-gray-500 text-sm">/100 — </span>
                  <span className={`font-bold ${scoreColor(score.score)}`}>{score.label}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">{score.feedback}</p>

              {score.matchedPoints.length > 0 && (
                <div className="mb-3">
                  <p className="text-green-400 text-xs font-semibold mb-1 uppercase tracking-wider">Points You Hit</p>
                  <ul className="space-y-1">
                    {score.matchedPoints.map((p, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-green-400">✓</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {score.missedPoints.length > 0 && (
                <div>
                  <p className="text-orange-400 text-xs font-semibold mb-1 uppercase tracking-wider">Points to Add</p>
                  <ul className="space-y-1">
                    {score.missedPoints.map((p, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-orange-400">→</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Your answer */}
          <div className="bg-brand-card border border-white/10 rounded-xl p-5">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Your Answer</p>
            <p className="text-gray-300 text-sm whitespace-pre-wrap">{userAnswer || '(skipped)'}</p>
          </div>

          {/* Model answer */}
          {current.modelAnswer ? (
            <div>
              <button
                onClick={() => setShowModel(v => !v)}
                className="w-full text-left bg-brand-card border border-brand-teal/20 rounded-xl p-5 hover:border-brand-teal/40 transition-colors"
              >
                <p className="text-brand-teal font-semibold flex items-center justify-between">
                  Model Answer
                  <span className="text-sm">{showModel ? '▲ Hide' : '▼ Show'}</span>
                </p>
                {showModel && (
                  <div className="mt-3">
                    <p className="text-gray-300 text-sm leading-relaxed">{current.modelAnswer}</p>
                    {current.keyPoints.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Key Points</p>
                        <ul className="space-y-1">
                          {current.keyPoints.map((kp, i) => (
                            <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                              <span className="text-brand-teal">•</span> {kp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </button>
            </div>
          ) : showModel && (
            <div className="bg-brand-card border border-white/10 rounded-xl p-5">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Self-Assessment</p>
              <p className="text-gray-400 text-sm">Reflect on your answer — did you cover the core concepts? Was your structure clear? Could you give a specific example?</p>
            </div>
          )}

          <button
            onClick={handleNext}
            className="w-full py-3 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors"
          >
            {currentIndex < sessionQuestions.length - 1 ? 'Next Question →' : 'Finish Session'}
          </button>
        </div>
      )}
    </div>
  )
}
