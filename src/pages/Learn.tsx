import { pctRounded, barWidth } from '../lib/num'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { units, totalLessons, totalQuestions, totalCards, Lesson, Unit, LearnQuestion } from '../data/learn'
import { LearnProgressState as Progress, loadLearnProgress as loadProgress, saveLearnProgress as saveProgress, updateStreak } from '../lib/learnProgress'
import { capstones } from '../data/capstones'
import { getCapstoneProgress } from '../lib/capstoneProgress'
import { getAllBadges } from '../lib/badges'
import { recordAnswer as recordSRAnswer, weightedSample } from '../lib/spacedRepetition'
import { getDueCards, getDueCount, rateCard, seedCardsForLesson } from '../lib/cardReview'

const SR_LEARN_KEY = 'findr_sr_learn_quiz'

function normalise(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '')
}

function isFillCorrect(q: LearnQuestion, input: string) {
  const norm = normalise(input)
  if (!norm) return false
  const answers = [q.answer, ...(q.accept || [])].map(normalise)
  return answers.includes(norm)
}

type LessonPhase = 'learn' | 'quiz' | 'failed' | 'complete'

export default function Learn() {
  const [progress, setProgress] = useState<Progress>(loadProgress)
  const [activeLesson, setActiveLesson] = useState<{ unit: Unit; lesson: Lesson } | null>(null)

  // Lesson session state
  const [phase, setPhase] = useState<LessonPhase>('learn')
  const [cardIndex, setCardIndex] = useState(0)
  const [qIndex, setQIndex] = useState(0)
  const [hearts, setHearts] = useState(3)
  const [correctCount, setCorrectCount] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [fillInput, setFillInput] = useState('')
  const [answered, setAnswered] = useState<null | boolean>(null)
  const [sessionXp, setSessionXp] = useState(0)
  const [quizOrder, setQuizOrder] = useState<number[]>([])

  // Daily Review (spaced-repetition flashcards) session state
  const [reviewCards, setReviewCards] = useState<ReturnType<typeof getDueCards> | null>(null)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [reviewFlipped, setReviewFlipped] = useState(false)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  function startLesson(unit: Unit, lesson: Lesson) {
    setActiveLesson({ unit, lesson })
    setPhase('learn')
    setCardIndex(0)
    setQIndex(0)
    setHearts(3)
    setCorrectCount(0)
    setSelectedOption(null)
    setFillInput('')
    setAnswered(null)
    setSessionXp(0)
    setQuizOrder([])
    window.scrollTo(0, 0)
  }

  // Weighted reorder of this lesson's questions — questions gotten wrong
  // before (in any past attempt) are more likely to be emphasised/repeated
  // in position, giving a simple form of adaptive difficulty by error rate.
  function buildQuizOrder(lesson: Lesson): number[] {
    const pool = lesson.questions.map((_, i) => ({ id: `${lesson.id}-q${i}`, value: i }))
    return weightedSample(SR_LEARN_KEY, pool, pool.length)
  }

  function exitLesson() {
    setActiveLesson(null)
    window.scrollTo(0, 0)
  }

  function checkAnswer() {
    if (!activeLesson || answered !== null) return
    const actualIndex = quizOrder[qIndex] ?? qIndex
    const q = activeLesson.lesson.questions[actualIndex]
    const correct = q.type === 'fill' ? isFillCorrect(q, fillInput) : selectedOption === q.answer
    setAnswered(correct)
    recordSRAnswer(SR_LEARN_KEY, `${activeLesson.lesson.id}-q${actualIndex}`, correct)
    if (correct) {
      setCorrectCount(c => c + 1)
      setSessionXp(x => x + 10)
    } else {
      setHearts(h => h - 1)
    }
  }

  function nextQuestion() {
    if (!activeLesson) return
    if (!answered && hearts <= 0) {
      setPhase('failed')
      return
    }
    const isLast = qIndex >= activeLesson.lesson.questions.length - 1
    if (isLast) {
      finishLesson()
    } else {
      setQIndex(i => i + 1)
      setSelectedOption(null)
      setFillInput('')
      setAnswered(null)
    }
  }

  function finishLesson() {
    if (!activeLesson) return
    const total = activeLesson.lesson.questions.length
    const score = pctRounded(correctCount, total)
    const perfect = correctCount === total
    const bonus = 20 + (perfect ? 10 : 0)
    const earned = sessionXp + bonus
    setSessionXp(earned)
    setProgress(prev => {
      const existing = prev.lessons[activeLesson.lesson.id]
      const updated = updateStreak({
        ...prev,
        xp: prev.xp + earned,
        lessons: {
          ...prev.lessons,
          [activeLesson.lesson.id]: {
            completed: true,
            bestScore: Math.max(existing?.bestScore || 0, score),
            timesCompleted: (existing?.timesCompleted || 0) + 1,
          },
        },
      })
      return updated
    })
    setPhase('complete')
  }

  const completedCount = Object.values(progress.lessons).filter(l => l.completed).length

  // ============ DAILY REVIEW (spaced-repetition flashcards) ============
  if (reviewCards) {
    if (reviewCards.length === 0) {
      return (
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-black text-white mb-3">Nothing due right now</h2>
          <p className="text-gray-400 mb-8">Complete more lessons to build your review queue, or come back later — cards resurface on a schedule based on how well you know them.</p>
          <button onClick={() => setReviewCards(null)} className="px-8 py-4 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors">
            Back to path
          </button>
        </div>
      )
    }

    if (reviewIndex >= reviewCards.length) {
      return (
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-black text-white mb-3">Review complete!</h2>
          <p className="text-gray-400 mb-8">You reviewed {reviewCards.length} card{reviewCards.length !== 1 ? 's' : ''}. Cards you knew well come back later; ones you're still learning come back tomorrow.</p>
          <button onClick={() => setReviewCards(null)} className="px-8 py-4 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors">
            Back to path
          </button>
        </div>
      )
    }

    const rc = reviewCards[reviewIndex]
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setReviewCards(null)} className="text-gray-500 hover:text-white text-sm">✕ Exit review</button>
          <div className="flex-1 mx-4 h-3 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-brand-teal rounded-full transition-all duration-300" style={{ width: barWidth(reviewIndex + 1, reviewCards.length) }} />
          </div>
          <span className="text-xs text-gray-500">{reviewIndex + 1}/{reviewCards.length}</span>
        </div>

        <div className="text-center mb-2">
          <span className="text-xs font-semibold text-brand-teal uppercase tracking-wider">📅 Daily Review — {rc.unit.title}</span>
        </div>

        <div className="bg-brand-card border border-white/10 rounded-2xl p-8 mb-6 min-h-[280px] flex flex-col justify-center">
          {!reviewFlipped ? (
            <div className="text-center">
              <h2 className="text-2xl font-black text-brand-gold mb-6">{rc.card.term}</h2>
              <button onClick={() => setReviewFlipped(true)} className="px-6 py-3 bg-white/5 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-colors">
                Show answer
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-black text-brand-gold mb-3">{rc.card.term}</h2>
              <p className="text-gray-200 leading-relaxed mb-4">{rc.card.definition}</p>
              {rc.card.example && <p className="text-gray-400 text-sm italic">{rc.card.example}</p>}
            </div>
          )}
        </div>

        {reviewFlipped && (
          <div className="flex gap-3">
            <button
              onClick={() => { rateCard(rc.id, false); setReviewFlipped(false); setReviewIndex(i => i + 1) }}
              className="flex-1 py-4 bg-red-500/15 border border-red-500/30 text-red-300 font-bold rounded-xl hover:bg-red-500/25 transition-colors"
            >
              😵 Still learning
            </button>
            <button
              onClick={() => { rateCard(rc.id, true); setReviewFlipped(false); setReviewIndex(i => i + 1) }}
              className="flex-1 py-4 bg-green-500/15 border border-green-500/30 text-green-300 font-bold rounded-xl hover:bg-green-500/25 transition-colors"
            >
              ✅ Got it
            </button>
          </div>
        )}
      </div>
    )
  }

  // ============ LESSON SESSION ============
  if (activeLesson) {
    const { unit, lesson } = activeLesson

    // LEARN PHASE — concept cards
    if (phase === 'learn') {
      const card = lesson.cards[cardIndex]
      const isLastCard = cardIndex >= lesson.cards.length - 1
      return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <button onClick={exitLesson} className="text-gray-500 hover:text-white text-sm">✕ Exit</button>
            <div className="flex-1 mx-4 h-3 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-brand-teal rounded-full transition-all duration-300" style={{ width: barWidth(cardIndex + 1, lesson.cards.length) }} />
            </div>
            <span className="text-xs text-gray-500">{cardIndex + 1}/{lesson.cards.length}</span>
          </div>

          <div className="text-center mb-2">
            <span className="text-xs font-semibold text-brand-teal uppercase tracking-wider">📖 Learn — {lesson.title}</span>
          </div>

          <div className="bg-brand-card border border-white/10 rounded-2xl p-8 mb-6 min-h-[320px]">
            <h2 className="text-2xl font-black text-brand-gold mb-4">{card.term}</h2>
            <p className="text-gray-200 leading-relaxed mb-5">{card.definition}</p>
            {card.example && (
              <div className="bg-brand-darker rounded-xl p-4 mb-4 border border-white/5">
                <p className="text-xs text-brand-teal font-bold uppercase tracking-wider mb-1">Example</p>
                <p className="text-gray-300 text-sm leading-relaxed">{card.example}</p>
              </div>
            )}
            {card.whyItMatters && (
              <div className="bg-brand-gold/5 rounded-xl p-4 border border-brand-gold/10">
                <p className="text-xs text-brand-gold font-bold uppercase tracking-wider mb-1">Why it matters</p>
                <p className="text-gray-300 text-sm leading-relaxed">{card.whyItMatters}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {cardIndex > 0 && (
              <button onClick={() => setCardIndex(i => i - 1)} className="px-6 py-4 bg-white/5 text-gray-300 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                ← Back
              </button>
            )}
            <button
              onClick={() => {
                if (isLastCard) {
                  seedCardsForLesson(unit.id, lesson.id, lesson.cards.length)
                  setQuizOrder(buildQuizOrder(lesson))
                  setPhase('quiz')
                } else {
                  setCardIndex(i => i + 1)
                }
              }}
              className="flex-1 py-4 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors"
            >
              {isLastCard ? "I'm ready — start the exercises →" : 'Continue →'}
            </button>
          </div>
        </div>
      )
    }

    // FAILED PHASE — out of hearts
    if (phase === 'failed') {
      return (
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-3xl font-black text-white mb-3">Out of hearts!</h2>
          <p className="text-gray-400 mb-8">No worries — mastery takes repetition. Review the concept cards and try again. You got {correctCount} right before running out.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => startLesson(unit, lesson)} className="px-8 py-4 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors">
              🔄 Review & Retry
            </button>
            <button onClick={exitLesson} className="px-8 py-4 bg-white/5 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-colors">
              Back to path
            </button>
          </div>
        </div>
      )
    }

    // COMPLETE PHASE
    if (phase === 'complete') {
      const total = lesson.questions.length
      const score = pctRounded(correctCount, total)
      const perfect = correctCount === total
      return (
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="text-6xl mb-4">{perfect ? '🏆' : score >= 80 ? '🎉' : '✅'}</div>
          <h2 className="text-3xl font-black text-white mb-2">{perfect ? 'Perfect lesson!' : 'Lesson complete!'}</h2>
          <p className="text-gray-400 mb-8">{lesson.title} — {unit.title}</p>
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-brand-card border border-brand-gold/20 rounded-xl p-4">
              <div className="text-2xl font-black text-brand-gold">+{sessionXp}</div>
              <div className="text-xs text-gray-500 mt-1">XP earned</div>
            </div>
            <div className="bg-brand-card border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-black text-white">{correctCount}/{total}</div>
              <div className="text-xs text-gray-500 mt-1">Correct</div>
            </div>
            <div className="bg-brand-card border border-orange-500/20 rounded-xl p-4">
              <div className="text-2xl font-black text-orange-400">🔥 {progress.streak}</div>
              <div className="text-xs text-gray-500 mt-1">Day streak</div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={exitLesson} className="px-8 py-4 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors">
              Continue →
            </button>
            {!perfect && (
              <button onClick={() => startLesson(unit, lesson)} className="px-8 py-4 bg-white/5 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-colors">
                Retry for 100%
              </button>
            )}
          </div>
        </div>
      )
    }

    // QUIZ PHASE
    const q = lesson.questions[quizOrder[qIndex] ?? qIndex]
    const options = q.type === 'fill' ? null : q.options || []

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <button onClick={exitLesson} className="text-gray-500 hover:text-white text-sm">✕ Exit</button>
          <div className="flex-1 mx-4 h-3 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-brand-gold rounded-full transition-all duration-300" style={{ width: barWidth(qIndex, lesson.questions.length) }} />
          </div>
          <div className="flex items-center gap-1 text-sm">
            {[0, 1, 2].map(i => (
              <span key={i} className={i < hearts ? '' : 'opacity-20 grayscale'}>❤️</span>
            ))}
          </div>
        </div>

        <div className="mb-2 text-center">
          <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">
            ✏️ Exercise {qIndex + 1} of {lesson.questions.length}
          </span>
        </div>

        <div className="bg-brand-card border border-white/10 rounded-2xl p-6 sm:p-8 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed mb-6">{q.prompt}</h2>

          {options ? (
            <div className="space-y-3">
              {options.map(opt => {
                let cls = 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10'
                if (answered === null && selectedOption === opt) cls = 'bg-brand-gold/15 border-brand-gold text-white'
                if (answered !== null) {
                  if (opt === q.answer) cls = 'bg-green-500/15 border-green-500 text-green-300'
                  else if (opt === selectedOption) cls = 'bg-red-500/15 border-red-500 text-red-300'
                  else cls = 'bg-white/5 border-white/5 text-gray-500'
                }
                return (
                  <button
                    key={opt}
                    onClick={() => answered === null && setSelectedOption(opt)}
                    disabled={answered !== null}
                    className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all ${cls}`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          ) : (
            <input
              type="text"
              value={fillInput}
              onChange={e => setFillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && fillInput.trim() && answered === null) checkAnswer() }}
              disabled={answered !== null}
              placeholder="Type your answer..."
              autoFocus
              className={`w-full bg-brand-darker border rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none text-lg ${
                answered === null ? 'border-white/10 focus:border-brand-gold' : answered ? 'border-green-500 text-green-300' : 'border-red-500 text-red-300'
              }`}
            />
          )}
        </div>

        {/* Feedback */}
        {answered !== null && (
          <div className={`rounded-xl p-5 mb-4 border ${answered ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <p className={`font-bold mb-1 ${answered ? 'text-green-400' : 'text-red-400'}`}>
              {answered ? '✓ Correct! +10 XP' : `✗ Not quite — the answer is: ${q.answer}`}
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {answered === null ? (
          <button
            onClick={checkAnswer}
            disabled={q.type === 'fill' ? !fillInput.trim() : !selectedOption}
            className="w-full py-4 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors disabled:opacity-30"
          >
            Check
          </button>
        ) : (
          <button
            onClick={() => {
              if (!answered && hearts <= 0) { setPhase('failed'); return }
              nextQuestion()
            }}
            className={`w-full py-4 font-bold rounded-xl transition-colors ${answered ? 'bg-green-500 text-black hover:bg-green-400' : 'bg-red-500 text-white hover:bg-red-400'}`}
          >
            {qIndex >= lesson.questions.length - 1 ? 'Finish lesson →' : 'Continue →'}
          </button>
        )}
      </div>
    )
  }

  // ============ PATH VIEW ============
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Develop Your Knowledge</h1>
          <p className="text-gray-400">Master finance from first principles to derivatives and macro — Duolingo-style. Learn bite-sized concepts, then prove them in exercises. {totalCards} concepts · {totalQuestions} exercises across {totalLessons} lessons.</p>
        </div>
        <button
          onClick={() => { setReviewCards(getDueCards(15)); setReviewIndex(0); setReviewFlipped(false); window.scrollTo(0, 0) }}
          className="px-5 py-3 bg-brand-teal text-white font-bold rounded-xl hover:bg-brand-teal2 transition-colors flex-shrink-0 flex items-center gap-2"
        >
          📅 Daily Review {getDueCount() > 0 && <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">{getDueCount()}</span>}
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <div className="bg-brand-card border border-brand-gold/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-brand-gold">⚡ {progress.xp}</div>
          <div className="text-xs text-gray-500 mt-1">Total XP</div>
        </div>
        <div className="bg-brand-card border border-orange-500/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-orange-400">🔥 {progress.streak}</div>
          <div className="text-xs text-gray-500 mt-1">Day streak</div>
        </div>
        <div className="bg-brand-card border border-white/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-white">{completedCount}/{totalLessons}</div>
          <div className="text-xs text-gray-500 mt-1">Lessons done</div>
        </div>
        <div className="bg-brand-card border border-brand-teal/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-brand-teal">{pctRounded(completedCount, totalLessons)}%</div>
          <div className="text-xs text-gray-500 mt-1">Curriculum mastered</div>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">🏅 Certifications & Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {getAllBadges(progress).map(badge => (
            <div key={badge.id} className={`rounded-xl p-4 border text-center ${badge.earned ? 'bg-brand-gold/10 border-brand-gold/40' : 'bg-brand-card border-white/10'}`}>
              <div className={`text-3xl mb-2 ${badge.earned ? '' : 'grayscale opacity-30'}`}>{badge.icon}</div>
              <div className={`text-xs font-bold mb-1 ${badge.earned ? 'text-brand-gold' : 'text-gray-400'}`}>{badge.title}</div>
              <div className="text-gray-600 text-[10px] leading-tight">{badge.progressLabel}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Capstones */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-1">🛠️ Capstone Modules — Build a Real Model</h2>
        <p className="text-gray-500 text-sm mb-4">Guided, step-by-step exercises where you calculate real numbers and get instant checks — not just multiple choice.</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {capstones.map(cap => {
            const entry = getCapstoneProgress()[cap.id]
            return (
              <Link
                key={cap.id}
                to={`/learn/capstone/${cap.id}`}
                className={`rounded-xl p-5 border transition-all group ${entry?.completed ? 'bg-brand-card border-green-500/30 hover:border-green-500/60' : 'bg-brand-card border-brand-teal/30 hover:border-brand-teal'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{cap.icon}</span>
                  {entry?.completed && <span className="text-green-400 text-xs font-bold">✓ Complete</span>}
                </div>
                <div className="text-white font-bold text-sm group-hover:text-brand-teal transition-colors">{cap.title}</div>
                <div className="text-gray-500 text-xs mt-1">{cap.description}</div>
                <div className="text-gray-600 text-xs mt-2">{cap.steps.length} steps · +100 XP</div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Units */}
      <div className="space-y-8">
        {units.map((unit, ui) => {
          const unitDone = unit.lessons.filter(l => progress.lessons[l.id]?.completed).length
          const unitMastered = unitDone === unit.lessons.length
          return (
            <div key={unit.id}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{unit.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className={`text-xl font-black ${unit.color}`}>Unit {ui + 1}: {unit.title}</h2>
                    {unitMastered && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30">👑 Mastered</span>}
                  </div>
                  <p className="text-gray-500 text-sm">{unit.description}</p>
                </div>
                <span className="text-xs text-gray-600 flex-shrink-0">{unitDone}/{unit.lessons.length}</span>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {unit.lessons.map((lesson, li) => {
                  const lp = progress.lessons[lesson.id]
                  const done = lp?.completed
                  const isNext = !done && (li === 0 || progress.lessons[unit.lessons[li - 1].id]?.completed)
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => startLesson(unit, lesson)}
                      className={`text-left rounded-xl p-4 border transition-all group ${
                        done
                          ? 'bg-brand-card border-green-500/30 hover:border-green-500/60'
                          : isNext
                            ? 'bg-brand-card border-brand-gold/40 hover:border-brand-gold shadow-lg shadow-brand-gold/5'
                            : 'bg-brand-card border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600 font-semibold">Lesson {li + 1}</span>
                        {done ? (
                          <span className="text-green-400 text-sm font-bold">✓ {lp.bestScore}%</span>
                        ) : isNext ? (
                          <span className="text-xs font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full">START</span>
                        ) : null}
                      </div>
                      <div className="text-white font-bold text-sm group-hover:text-brand-gold transition-colors">{lesson.title}</div>
                      <div className="text-gray-500 text-xs mt-1">{lesson.description}</div>
                      <div className="text-gray-600 text-xs mt-2">{lesson.cards.length} concepts · {lesson.questions.length} exercises</div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-12 bg-brand-card border border-white/10 rounded-2xl p-6 text-center">
        <p className="text-gray-400 text-sm">💡 <span className="text-white font-semibold">How it works:</span> each lesson teaches concepts with cards, then tests you with exercises. Earn <span className="text-brand-gold font-semibold">10 XP</span> per correct answer, a <span className="text-brand-gold font-semibold">+20 completion bonus</span> and <span className="text-brand-gold font-semibold">+10 for a perfect lesson</span>. You have 3 ❤️ per lesson — run out and you review and retry. Come back daily to build your 🔥 streak.</p>
      </div>
    </div>
  )
}
