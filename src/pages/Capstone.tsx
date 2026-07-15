import { useState, useEffect, useRef } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { capstones, CapstoneFormat } from '../data/capstones'
import { recordCapstoneAttempt, markCapstoneComplete, getCapstoneEntry } from '../lib/capstoneProgress'
import { awardXP } from '../lib/learnProgress'

const CAPSTONE_XP = 100

function formatValue(value: number, format: CapstoneFormat): string {
  switch (format) {
    case 'currency': return `£${value.toFixed(value % 1 === 0 ? 0 : 1)}m`
    case 'percent': return `${value}%`
    case 'multiple': return `${value.toFixed(2)}x`
    case 'years': return `${value} yr${value === 1 ? '' : 's'}`
    default: return `${value}`
  }
}

export default function Capstone() {
  const { id } = useParams<{ id: string }>()
  const capstone = capstones.find(c => c.id === id)

  const [stepIndex, setStepIndex] = useState(0)
  const [values, setValues] = useState<Record<string, number>>({})
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState<null | boolean>(null)
  const [revealed, setRevealed] = useState(false)
  const [xpAwarded, setXpAwarded] = useState(false)
  const attemptRecorded = useRef(false)

  useEffect(() => {
    if (!capstone) return
    setValues({ ...capstone.initialState })
    setStepIndex(0)
    setInput('')
    setChecked(null)
    setRevealed(false)
    setXpAwarded(false)
    if (!attemptRecorded.current) {
      attemptRecorded.current = true
      recordCapstoneAttempt(capstone.id)
    }
    window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capstone?.id])

  if (!capstone) return <Navigate to="/learn" replace />

  const step = capstone.steps[stepIndex]
  const isComplete = stepIndex >= capstone.steps.length

  useEffect(() => {
    if (!isComplete || xpAwarded) return
    const wasAlreadyDone = getCapstoneEntry(capstone.id).completed
    if (!wasAlreadyDone) awardXP(CAPSTONE_XP)
    markCapstoneComplete(capstone.id)
    setXpAwarded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete])

  if (isComplete) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-6xl mb-4">{capstone.icon}</div>
        <h1 className="text-3xl font-black text-white mb-2">{capstone.title} — Complete!</h1>
        <p className="text-gray-400 mb-6">You built the full model from scratch, step by step. Badge earned:</p>
        <div className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full px-5 py-2.5 mb-8">
          <span className="text-xl">🏅</span>
          <span className="text-brand-gold font-bold">{capstone.badgeName}</span>
        </div>
        <div className="bg-brand-card border border-white/10 rounded-xl p-5 mb-8 text-left">
          <p className="text-white font-semibold text-sm mb-3">Your model's final outputs:</p>
          <div className="grid grid-cols-2 gap-2">
            {capstone.steps.map(s => (
              <div key={s.id} className="text-xs">
                <span className="text-gray-500">{s.resultLabel}: </span>
                <span className="text-brand-teal font-semibold">{formatValue(values[s.resultKey] ?? 0, s.format)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Link to="/learn" className="px-6 py-3 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors">
            Back to Learn
          </Link>
          <button
            onClick={() => { setValues({ ...capstone.initialState }); setStepIndex(0); setInput(''); setChecked(null); setRevealed(false) }}
            className="px-6 py-3 bg-white/5 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-colors"
          >
            🔄 Rebuild it again
          </button>
        </div>
      </div>
    )
  }

  const expectedVal = step.expected(values)

  function checkAnswer() {
    const userVal = parseFloat(input)
    if (isNaN(userVal)) return
    const tolerance = Math.abs(expectedVal) * (step.tolerancePct / 100)
    const correct = Math.abs(userVal - expectedVal) <= Math.max(tolerance, 0.05)
    setChecked(correct)
  }

  function continueToNext() {
    const nextValues = { ...values, [step.resultKey]: expectedVal, ...(step.derived ? step.derived({ ...values, [step.resultKey]: expectedVal }) : {}) }
    setValues(nextValues)
    setStepIndex(i => i + 1)
    setInput('')
    setChecked(null)
    setRevealed(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link to="/learn" className="text-gray-500 hover:text-white text-sm">✕ Exit</Link>
        <div className="flex-1 mx-4 h-3 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-brand-teal rounded-full transition-all duration-300" style={{ width: `${((stepIndex + 1) / capstone.steps.length) * 100}%` }} />
        </div>
        <span className="text-xs text-gray-500">{stepIndex + 1}/{capstone.steps.length}</span>
      </div>

      <div className="text-center mb-2">
        <span className="text-xs font-semibold text-brand-teal uppercase tracking-wider">{capstone.icon} {capstone.title}</span>
      </div>

      <div className="bg-brand-card border border-white/10 rounded-2xl p-6 sm:p-8 mb-4">
        <h2 className="text-lg font-black text-brand-gold mb-2">{step.title}</h2>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">{step.narrative}</p>

        <div className="bg-brand-darker rounded-xl p-4 mb-5 border border-white/5">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Given</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {step.given.map(g => (
              <div key={g.key} className="text-sm">
                <span className="text-gray-500">{g.label}: </span>
                <span className="text-white font-semibold">{formatValue(values[g.key] ?? 0, g.format)}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white font-semibold mb-3">{step.question}</p>

        <div className="flex gap-3">
          <input
            type="number"
            step="any"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && input && checked === null) checkAnswer() }}
            disabled={checked === true}
            placeholder="Type your calculated answer..."
            autoFocus
            className={`flex-1 bg-brand-darker border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none text-lg ${
              checked === null ? 'border-white/10 focus:border-brand-gold' : checked ? 'border-green-500 text-green-300' : 'border-red-500 text-red-300'
            }`}
          />
          {checked === null && (
            <button onClick={checkAnswer} disabled={!input} className="px-6 py-3 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors disabled:opacity-30">
              Check
            </button>
          )}
        </div>
      </div>

      {checked === true && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 mb-4">
          <p className="text-green-400 font-bold mb-1">✓ Correct! {step.resultLabel} = {formatValue(expectedVal, step.format)}</p>
          <p className="text-gray-300 text-sm leading-relaxed">{step.explanation(values, expectedVal)}</p>
        </div>
      )}

      {checked === false && !revealed && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 mb-4">
          <p className="text-red-400 font-bold mb-2">Not quite — check your formula and try again.</p>
          <button onClick={() => setChecked(null)} className="text-sm text-white underline mr-4">Try again</button>
          <button onClick={() => setRevealed(true)} className="text-sm text-gray-400 underline">Show me the answer</button>
        </div>
      )}

      {checked === false && revealed && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-5 mb-4">
          <p className="text-orange-400 font-bold mb-1">{step.resultLabel} = {formatValue(expectedVal, step.format)}</p>
          <p className="text-gray-300 text-sm leading-relaxed">{step.explanation(values, expectedVal)}</p>
        </div>
      )}

      {(checked === true || (checked === false && revealed)) && (
        <button onClick={continueToNext} className="w-full py-4 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors">
          {stepIndex === capstone.steps.length - 1 ? 'Finish the model →' : 'Continue →'}
        </button>
      )}
    </div>
  )
}
