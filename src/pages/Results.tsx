import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jobs } from '../data/jobs'
import { recordCareerQuizAttempt } from '../lib/history'

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
}

export default function Results() {
  const navigate = useNavigate()
  const [matches, setMatches] = useState<CareerMatch[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('findr-quiz-scores')
    if (!stored) {
      navigate('/quiz')
      return
    }

    const scores: Record<string, number> = JSON.parse(stored)
    const maxScore = Math.max(...Object.values(scores))

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

        <Link
          to={`/jobs/${topMatch?.id}`}
          className="inline-block px-6 py-3 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors"
        >
          Explore This Career →
        </Link>
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
