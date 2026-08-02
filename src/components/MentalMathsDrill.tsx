import { useState, useEffect, useRef } from 'react'

type Drill = { q: string; a: number; hint: string }

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const round2 = (n: number) => Math.round(n * 100) / 100

// Generators mirror the arithmetic that actually appears in finance tests and
// trading-firm speed rounds: percentages, ratios, decimals and clean multiples.
function makeEasy(): Drill {
  switch (rnd(1, 6)) {
    case 1: { const a = rnd(11, 89), b = rnd(11, 89); return { q: `${a} + ${b}`, a: a + b, hint: 'Add the tens first, then the units.' } }
    case 2: { const a = rnd(40, 140), b = rnd(11, 39); return { q: `${a} − ${b}`, a: a - b, hint: 'Round the subtrahend up to a 10, subtract, then add back the difference.' } }
    case 3: { const a = rnd(3, 12), b = rnd(11, 25); return { q: `${a} × ${b}`, a: a * b, hint: 'Split the second number: 7×24 = 7×20 + 7×4.' } }
    case 4: { const p = [10, 20, 25, 50][rnd(0, 3)], n = rnd(2, 20) * 20; return { q: `${p}% of ${n}`, a: (p * n) / 100, hint: '25% is a quarter; 20% is a fifth; halve for 50%.' } }
    case 5: { const n = rnd(2, 15) * 4; return { q: `¼ of ${n}`, a: n / 4, hint: 'Halve it, then halve again.' } }
    default: { const a = rnd(2, 15); return { q: `${a}²`, a: a * a, hint: 'Learn squares to 20 by heart — they recur constantly.' } }
  }
}

function makeHard(): Drill {
  switch (rnd(1, 8)) {
    case 1: { const a = rnd(12, 49), b = rnd(12, 49); return { q: `${a} × ${b}`, a: a * b, hint: 'Break it up: 34×27 = 34×25 + 34×2.' } }
    case 2: { const p = [15, 30, 35, 60, 80][rnd(0, 4)], n = rnd(4, 40) * 5; return { q: `${p}% of ${n}`, a: round2((p * n) / 100), hint: '15% = 10% + 5%. Build odd percentages from 10%, 5% and 1%.' } }
    case 3: { const n = rnd(20, 90) * 10, p = [10, 20, 25][rnd(0, 2)]; return { q: `${n} after a ${p}% fall`, a: round2(n * (1 - p / 100)), hint: 'Multiply by (1 − rate), never subtract twice.' } }
    case 4: { const orig = rnd(20, 80) * 10, p = [20, 25, 50][rnd(0, 2)]; const after = round2(orig * (1 - p / 100)); return { q: `A price fell ${p}% to ${after}. Original?`, a: orig, hint: `Divide by ${(1 - p / 100).toFixed(2)} — never add the % back.` } }
    case 5: { const a = rnd(6, 30), b = rnd(2, 9); return { q: `${a * b} ÷ ${b}`, a: a, hint: 'Spot the factor rather than long-dividing.' } }
    case 6: { const n = rnd(3, 20) * 4; return { q: `0.25 × ${n}`, a: n / 4, hint: '×0.25 is ÷4. ×0.5 is ÷2. ×0.2 is ÷5.' } }
    case 7: { const a = rnd(101, 199), b = rnd(3, 9); return { q: `${a} × ${b}`, a: a * b, hint: 'Split into (100 + rest) × b.' } }
    default: { const num = rnd(2, 9), den = [4, 5, 8, 10][rnd(0, 3)]; return { q: `${num}/${den} as a %`, a: round2((num / den) * 100), hint: 'Memorise the common fraction↔% conversions.' } }
  }
}

export default function MentalMathsDrill() {
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const [hard, setHard] = useState(false)
  const [duration, setDuration] = useState(60)
  const [timeLeft, setTimeLeft] = useState(60)
  const [drill, setDrill] = useState<Drill | null>(null)
  const [input, setInput] = useState('')
  const [correct, setCorrect] = useState(0)
  const [attempted, setAttempted] = useState(0)
  const [feedback, setFeedback] = useState<null | 'right' | 'wrong'>(null)
  const [lastMissed, setLastMissed] = useState<Drill[]>([])
  const [best, setBest] = useState<number>(() => Number(localStorage.getItem('findr_mm_best') || 0))
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  function start() {
    setRunning(true); setFinished(false)
    setCorrect(0); setAttempted(0); setLastMissed([]); setInput(''); setFeedback(null)
    setTimeLeft(duration)
    setDrill(hard ? makeHard() : makeEasy())
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setRunning(false); setFinished(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  // Persist personal best once a run ends
  useEffect(() => {
    if (finished && correct > best) {
      setBest(correct)
      localStorage.setItem('findr_mm_best', String(correct))
    }
  }, [finished, correct, best])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!drill || !input.trim()) return
    const val = parseFloat(input.replace(/,/g, ''))
    const isRight = Math.abs(val - drill.a) < 0.005
    setAttempted(a => a + 1)
    if (isRight) { setCorrect(c => c + 1); setFeedback('right') }
    else { setFeedback('wrong'); setLastMissed(m => [...m.slice(-4), drill]) }
    setInput('')
    setDrill(hard ? makeHard() : makeEasy())
    setTimeout(() => setFeedback(null), 350)
  }

  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0

  return (
    <div className="bg-brand-card border border-brand-teal/30 rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <h2 className="text-brand-teal font-black text-lg">⚡ Mental Maths Sprint</h2>
          <p className="text-gray-400 text-sm mt-1 max-w-lg">
            Speed comes from reps, not reading. Trading firms like Optiver run exactly this format
            (their famous test is 80 questions in 8 minutes). Aim for accuracy first, then push pace.
          </p>
        </div>
        {best > 0 && (
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-black text-brand-gold">{best}</div>
            <div className="text-xs text-gray-500">personal best</div>
          </div>
        )}
      </div>

      {!running && !finished && (
        <>
          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Length</p>
              <div className="flex gap-2">
                {[60, 120, 180].map(d => (
                  <button key={d} onClick={() => setDuration(d)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${duration === d ? 'bg-brand-gold text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                    {d / 60} min
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Level</p>
              <div className="flex gap-2">
                <button onClick={() => setHard(false)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${!hard ? 'bg-brand-gold text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                  Core
                </button>
                <button onClick={() => setHard(true)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${hard ? 'bg-brand-gold text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                  Test-level
                </button>
              </div>
            </div>
          </div>
          <button onClick={start} className="w-full py-3.5 bg-brand-teal text-white font-bold rounded-xl hover:bg-brand-teal2 transition-colors">
            Start Sprint →
          </button>
          <p className="text-gray-600 text-xs mt-2 text-center">No calculator. Type the answer and hit Enter — it moves on instantly.</p>
        </>
      )}

      {running && drill && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500">{correct} correct · {accuracy}% accuracy</span>
            <span className={`font-mono font-bold text-lg ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className={`rounded-xl p-6 mb-3 text-center transition-colors ${
            feedback === 'right' ? 'bg-green-500/15' : feedback === 'wrong' ? 'bg-red-500/15' : 'bg-brand-darker'
          }`}>
            <p className="text-3xl sm:text-4xl font-black text-white">{drill.q}</p>
          </div>
          <form onSubmit={submit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Answer"
              autoFocus
              className="flex-1 bg-brand-darker border border-white/10 rounded-xl px-4 py-3 text-white text-lg text-center focus:outline-none focus:border-brand-teal"
            />
            <button type="submit" className="px-6 py-3 bg-brand-teal text-white font-bold rounded-xl hover:bg-brand-teal2 transition-colors">
              Enter
            </button>
          </form>
        </div>
      )}

      {finished && (
        <div>
          <div className="text-center py-4">
            <div className="text-5xl font-black text-brand-gold mb-1">{correct}</div>
            <p className="text-gray-400 text-sm">correct in {duration / 60} min · {accuracy}% accuracy · {attempted} attempted</p>
            {correct > 0 && (
              <p className="text-gray-500 text-xs mt-2">
                That's roughly {(correct / (duration / 60)).toFixed(1)} per minute.
                {accuracy < 80
                  ? ' Accuracy below 80% means you are rushing — slow down slightly and it will paradoxically raise your score.'
                  : ' Strong accuracy — now push the pace.'}
              </p>
            )}
          </div>
          {lastMissed.length > 0 && (
            <div className="bg-brand-darker rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Ones you missed</p>
              <ul className="space-y-1.5">
                {lastMissed.map((m, i) => (
                  <li key={i} className="text-sm">
                    <span className="text-white font-mono">{m.q} = {m.a}</span>
                    <span className="text-gray-500 text-xs block">{m.hint}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={start} className="flex-1 py-3 bg-brand-teal text-white font-bold rounded-xl hover:bg-brand-teal2 transition-colors">
              🔄 Go Again
            </button>
            <button onClick={() => { setFinished(false); setRunning(false) }} className="px-5 py-3 bg-white/5 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-colors">
              Settings
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
