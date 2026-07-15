import { Link } from 'react-router-dom'
import { units, totalLessons } from '../data/learn'
import { jobs } from '../data/jobs'
import {
  getCareerQuizHistory,
  getCVScoreHistory,
  getPracticeTestHistory,
  categoryToLearnUnit,
} from '../lib/history'

const LEARN_KEY = 'findr_learn_progress'
const MEETINGS_KEY = 'findr_meetings'

type LearnProgress = {
  xp: number
  streak: number
  lastActiveDate: string | null
  lessons: Record<string, { completed: boolean; bestScore: number; timesCompleted: number }>
}

function loadLearnProgress(): LearnProgress {
  try {
    const stored = localStorage.getItem(LEARN_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* ignore corrupted data */ }
  return { xp: 0, streak: 0, lastActiveDate: null, lessons: {} }
}

function loadMeetingsCount(): number {
  try {
    const stored = localStorage.getItem(MEETINGS_KEY)
    return stored ? (JSON.parse(stored) as unknown[]).length : 0
  } catch {
    return 0
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) {
    return <p className="text-gray-600 text-xs">Not enough attempts yet for a trend — do this a couple more times.</p>
  }
  const w = 240
  const h = 48
  const max = Math.max(...values, 100)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((v, i) => {
        const x = (i / (values.length - 1)) * w
        const y = h - ((v - min) / range) * h
        return <circle key={i} cx={x} cy={y} r="2.5" fill={color} />
      })}
    </svg>
  )
}

export default function Dashboard() {
  const learn = loadLearnProgress()
  const completedLessons = Object.values(learn.lessons).filter(l => l.completed).length
  const meetingsCount = loadMeetingsCount()

  const quizHistory = getCareerQuizHistory()
  const cvHistory = getCVScoreHistory()
  const testHistory = getPracticeTestHistory()

  const latestQuiz = quizHistory[quizHistory.length - 1]
  const latestCV = cvHistory[cvHistory.length - 1]

  const cvTrend = cvHistory.slice(-10).map(e => e.score)
  const cvDelta = cvHistory.length >= 2 ? cvHistory[cvHistory.length - 1].score - cvHistory[cvHistory.length - 2].score : null

  // Group practice test attempts by category for per-category analytics
  const testsByCategory = testHistory.reduce<Record<string, typeof testHistory>>((acc, t) => {
    ;(acc[t.categoryId] ||= []).push(t)
    return acc
  }, {})

  const hasAnyActivity = quizHistory.length > 0 || cvHistory.length > 0 || testHistory.length > 0 || completedLessons > 0

  const recommendedJob = latestQuiz ? jobs.find(j => j.id === latestQuiz.topMatchId) : null
  const recommendedUnit = recommendedJob ? categoryToLearnUnit[recommendedJob.category] : null
  const recommendedUnitData = recommendedUnit ? units.find(u => u.id === recommendedUnit.unitId) : null

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">Your Progress Dashboard</h1>
        <p className="text-gray-400">Everything you've done across FINdr in one place — quiz results, CV scores, test practice and learning progress, all stored locally in your browser.</p>
      </div>

      {!hasAnyActivity ? (
        <div className="bg-brand-card border border-white/10 rounded-2xl p-10 text-center">
          <div className="text-4xl mb-3">📊</div>
          <h2 className="text-white font-bold text-lg mb-2">Nothing tracked yet</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">Take the Career Quiz, review a CV, try a practice test or start a Learn lesson — your progress will show up here automatically.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/quiz" className="px-5 py-2.5 bg-brand-gold text-black font-bold rounded-xl text-sm hover:bg-brand-gold2 transition-colors">Take the Career Quiz</Link>
            <Link to="/learn" className="px-5 py-2.5 bg-white/5 text-gray-300 font-semibold rounded-xl text-sm hover:bg-white/10 transition-colors">Start Learning</Link>
          </div>
        </div>
      ) : (
        <>
          {/* Top stat strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="bg-brand-card border border-brand-gold/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-brand-gold">⚡ {learn.xp}</div>
              <div className="text-xs text-gray-500 mt-1">Learn XP</div>
            </div>
            <div className="bg-brand-card border border-orange-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-orange-400">🔥 {learn.streak}</div>
              <div className="text-xs text-gray-500 mt-1">Day streak</div>
            </div>
            <div className="bg-brand-card border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-white">{completedLessons}/{totalLessons}</div>
              <div className="text-xs text-gray-500 mt-1">Lessons done</div>
            </div>
            <div className="bg-brand-card border border-brand-teal/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-brand-teal">{meetingsCount}</div>
              <div className="text-xs text-gray-500 mt-1">Meeting notes</div>
            </div>
          </div>

          {/* Recommendation banner */}
          {latestQuiz && (
            <div className="bg-gradient-to-br from-brand-gold/10 to-brand-teal/10 border border-brand-gold/30 rounded-2xl p-6 mb-8">
              <p className="text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">💡 Recommended for you</p>
              <p className="text-white text-lg font-bold mb-3">
                Your quiz result suggests <span className="text-brand-gold">{latestQuiz.topMatchTitle}</span> ({latestQuiz.topMatchPercentage}% match) — here's your path in.
              </p>
              <div className="flex flex-wrap gap-3">
                {recommendedJob && (
                  <Link to={`/jobs/${recommendedJob.id}`} className="px-4 py-2.5 bg-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/20 transition-colors">
                    📋 Explore {recommendedJob.title}
                  </Link>
                )}
                {recommendedUnitData && (
                  <Link to="/learn" className="px-4 py-2.5 bg-brand-gold text-black text-sm font-bold rounded-xl hover:bg-brand-gold2 transition-colors">
                    📖 Study: {recommendedUnitData.title}
                  </Link>
                )}
                <Link to="/interview-quiz" className="px-4 py-2.5 bg-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/20 transition-colors">
                  🎯 Practise {latestQuiz.topMatchTitle} interview questions
                </Link>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Career quiz history */}
            <div className="bg-brand-card border border-white/10 rounded-xl p-5">
              <h2 className="text-white font-bold mb-3">🧭 Career Quiz History</h2>
              {quizHistory.length === 0 ? (
                <p className="text-gray-500 text-sm">No attempts yet. <Link to="/quiz" className="text-brand-gold hover:underline">Take the quiz →</Link></p>
              ) : (
                <div className="space-y-2">
                  {[...quizHistory].reverse().slice(0, 5).map((q, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2.5">
                      <div>
                        <p className="text-white text-sm font-semibold">{q.topMatchTitle}</p>
                        <p className="text-gray-600 text-xs">{formatDate(q.date)}</p>
                      </div>
                      <span className="text-brand-gold font-bold text-sm">{q.topMatchPercentage}%</span>
                    </div>
                  ))}
                  <p className="text-gray-600 text-xs pt-1">{quizHistory.length} attempt{quizHistory.length !== 1 ? 's' : ''} total</p>
                </div>
              )}
            </div>

            {/* CV score history */}
            <div className="bg-brand-card border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-bold">📄 CV & Cover Letter Scores</h2>
                {cvDelta !== null && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cvDelta >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {cvDelta >= 0 ? '+' : ''}{cvDelta} vs last draft
                  </span>
                )}
              </div>
              {cvHistory.length === 0 ? (
                <p className="text-gray-500 text-sm">No reviews yet. <Link to="/cv-reviewer" className="text-brand-gold hover:underline">Review your CV →</Link></p>
              ) : (
                <>
                  <Sparkline values={cvTrend} color="#f5c518" />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-gray-500 text-xs">{cvHistory.length} draft{cvHistory.length !== 1 ? 's' : ''} reviewed</p>
                    <p className="text-white font-bold text-sm">Latest: {latestCV?.score}/100 — {latestCV?.scoreLabel}</p>
                  </div>
                </>
              )}
            </div>

            {/* Practice test analytics */}
            <div className="bg-brand-card border border-white/10 rounded-xl p-5 lg:col-span-2">
              <h2 className="text-white font-bold mb-3">🧮 Practice Test Analytics</h2>
              {testHistory.length === 0 ? (
                <p className="text-gray-500 text-sm">No attempts yet. <Link to="/practice-tests" className="text-brand-gold hover:underline">Practise a test →</Link></p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(testsByCategory).map(([catId, attempts]) => {
                    const best = Math.max(...attempts.map(a => a.percentage))
                    const avg = Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length)
                    const trend = attempts.slice(-8).map(a => a.percentage)
                    return (
                      <div key={catId} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white text-sm font-semibold">{attempts[0].categoryTitle}</p>
                          <span className="text-gray-500 text-xs">{attempts.length} attempt{attempts.length !== 1 ? 's' : ''}</span>
                        </div>
                        <Sparkline values={trend} color="#14b8a6" />
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-xs text-gray-500">Best: <span className="text-brand-gold font-bold">{best}%</span></p>
                          <p className="text-xs text-gray-500">Avg: <span className="text-white font-semibold">{avg}%</span></p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Learn progress by unit */}
            <div className="bg-brand-card border border-white/10 rounded-xl p-5 lg:col-span-2">
              <h2 className="text-white font-bold mb-3">📚 Develop Knowledge Progress</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {units.map(unit => {
                  const done = unit.lessons.filter(l => learn.lessons[l.id]?.completed).length
                  const pct = Math.round((done / unit.lessons.length) * 100)
                  return (
                    <div key={unit.id} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span>{unit.icon}</span>
                        <span className={`text-xs font-bold ${unit.color} truncate`}>{unit.title}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-brand-gold rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-gray-600 text-xs">{done}/{unit.lessons.length} lessons</p>
                    </div>
                  )
                })}
              </div>
              <Link to="/learn" className="inline-block mt-4 text-brand-gold text-sm font-semibold hover:underline">Continue learning →</Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
