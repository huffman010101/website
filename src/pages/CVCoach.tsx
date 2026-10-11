import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ACCEPTED_FILE_TYPES, extractTextFromFile } from '../lib/fileText'
import { analyseCv, buildScaffold, parseNumberInput, withinTolerance } from '../lib/cvParse'
import {
  behaviouralQuestions, competencies, sizingCases, sizingFramework, sizingPitfalls,
  psychometricTypes, sjtPrinciples, scenarios,
} from '../data/cvCoach'

const CV_KEY = 'findr_cv_text'
const ANSWERS_KEY = 'findr_cv_answers'

function load(key: string, fallback: string) {
  try { return localStorage.getItem(key) ?? fallback } catch { return fallback }
}
function save(key: string, value: string) {
  try { localStorage.setItem(key, value) } catch { /* storage full or blocked */ }
}

const SAMPLE_CV = `Alex Morgan — BSc Economics, University of Bristol (2024–2027). Predicted 2:1. A-levels: A*AA.

Investment Society — Treasurer
• Managed a £3,000 annual budget and secured £500 sponsorship from a local firm
• Organised 6 speaker events with an average attendance of 80 students
• Pitched a stock at the society's annual stock pitch competition

Barista, Pret A Manger — part-time, 12 hours per week alongside full-time study
• Served 200+ customers per shift during the morning peak as part of a team of 5
• Responsible for cashing up the till at the end of each shift
• Helped train new staff on the coffee machine

Projects
• Built a DCF model on Tesco in Excel to teach myself valuation
• Analysed 10 years of UK inflation data in Python for coursework

Skills: Excel (XLOOKUP, pivot tables), Python, hard-working team player`

type Tab = 'cv' | 'answers' | 'gaps' | 'sizing' | 'scenarios'

const TABS: { id: Tab; label: string }[] = [
  { id: 'cv', label: '📄 Your CV' },
  { id: 'answers', label: '🎯 Behavioural answers' },
  { id: 'gaps', label: '🔍 Gaps & stand out' },
  { id: 'sizing', label: '📐 Market sizing' },
  { id: 'scenarios', label: '🧠 Scenarios & psychometrics' },
]

export default function CVCoach() {
  const [tab, setTab] = useState<Tab>('cv')
  const [cvText, setCvText] = useState(() => load(CV_KEY, ''))
  const analysis = useMemo(() => analyseCv(cvText), [cvText])
  const hasCv = analysis.bullets.length > 0

  function updateCv(text: string) {
    setCvText(text)
    save(CV_KEY, text)
  }

  return (
    <div className="min-h-screen bg-brand-dark px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            CV → <span className="text-gradient-gold">Interview Coach</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Add your CV once. It's mapped to the competencies interviewers test, turned into STAR answer
            plans built from your own experience, and checked for what's missing to stand out. Plus market
            sizing and scenario questions. Your CV stays on this device.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                tab === t.id ? 'bg-brand-gold text-black' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'cv' && <CvTab cvText={cvText} onChange={updateCv} analysis={analysis} onNext={() => setTab('answers')} />}
        {tab === 'answers' && <AnswersTab analysis={analysis} hasCv={hasCv} goCv={() => setTab('cv')} />}
        {tab === 'gaps' && <GapsTab analysis={analysis} hasCv={hasCv} goCv={() => setTab('cv')} />}
        {tab === 'sizing' && <SizingTab />}
        {tab === 'scenarios' && <ScenariosTab />}
      </div>
    </div>
  )
}

type Analysis = ReturnType<typeof analyseCv>

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-brand-card border border-white/10 rounded-2xl p-5 ${className}`}>{children}</div>
}

function NeedCv({ goCv }: { goCv: () => void }) {
  return (
    <Card className="text-center">
      <p className="text-gray-300 text-sm mb-3">Add your CV first — everything here is built from it.</p>
      <button onClick={goCv} className="px-4 py-2 bg-brand-gold text-black font-bold text-sm rounded-xl">Add my CV →</button>
    </Card>
  )
}

// ─── Your CV ────────────────────────────────────────────────────────────────

function CvTab({ cvText, onChange, analysis, onNext }: { cvText: string; onChange: (t: string) => void; analysis: Analysis; onNext: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onFile(file: File | undefined) {
    if (!file) return
    setBusy(true); setError(null)
    try {
      const text = await extractTextFromFile(file)
      if (!text.trim()) throw new Error('No text found in that file — if it\'s a scanned image, paste the text instead.')
      onChange(text)
    } catch (e: any) {
      setError(e?.message || 'Could not read that file.')
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap gap-2 mb-3">
          <button onClick={() => fileRef.current?.click()} disabled={busy}
            className="px-4 py-2 bg-brand-teal text-black font-bold text-sm rounded-xl disabled:opacity-50">
            {busy ? 'Reading…' : '⬆ Upload CV (PDF, DOCX, TXT)'}
          </button>
          <button onClick={() => onChange(SAMPLE_CV)}
            className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm rounded-xl hover:bg-white/10">
            Try an example CV
          </button>
          {cvText && (
            <button onClick={() => onChange('')}
              className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 text-sm rounded-xl hover:bg-white/10">
              Clear
            </button>
          )}
          <input ref={fileRef} type="file" accept={ACCEPTED_FILE_TYPES} className="hidden" onChange={e => onFile(e.target.files?.[0])} />
        </div>
        {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
        <textarea
          value={cvText}
          onChange={e => onChange(e.target.value)}
          placeholder="…or paste your CV text here. One bullet per line works best."
          className="w-full h-72 bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-gray-200 focus:outline-none focus:border-brand-gold/50"
        />
        <p className="text-gray-600 text-[11px] mt-2">Saved on this device only. Nothing is uploaded anywhere.</p>
      </Card>

      {analysis.bullets.length > 0 && (
        <Card>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-4">
            <Stat value={`${analysis.bullets.length}`} label="bullets read" />
            <Stat value={`${analysis.covered.length}/${competencies.length}`} label="competencies evidenced" />
            <Stat value={`${analysis.quantifiedPct}%`} label="bullets with a number" />
            <Stat value={`${analysis.present.length}/${analysis.present.length + analysis.missing.length}`} label="stand-out signals" />
          </div>
          <button onClick={onNext} className="w-full px-4 py-2.5 bg-brand-gold text-black font-bold text-sm rounded-xl">
            Build my interview answers →
          </button>
        </Card>
      )}
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white/5 rounded-xl p-3">
      <div className="text-xl font-black text-brand-gold">{value}</div>
      <div className="text-gray-500 text-[11px] mt-0.5">{label}</div>
    </div>
  )
}

// ─── Behavioural answers ────────────────────────────────────────────────────

function loadAnswers(): Record<string, string> {
  try { return JSON.parse(load(ANSWERS_KEY, '{}')) || {} } catch { return {} }
}

function AnswersTab({ analysis, hasCv, goCv }: { analysis: Analysis; hasCv: boolean; goCv: () => void }) {
  const [open, setOpen] = useState<string | null>(behaviouralQuestions[0].id)
  const [showModel, setShowModel] = useState<Record<string, boolean>>({})
  const [answers, setAnswers] = useState<Record<string, string>>(loadAnswers)

  if (!hasCv) return <NeedCv goCv={goCv} />

  function setAnswer(id: string, text: string) {
    const next = { ...answers, [id]: text }
    setAnswers(next)
    save(ANSWERS_KEY, JSON.stringify(next))
  }

  return (
    <div className="space-y-3">
      <Card className="!p-4">
        <p className="text-gray-300 text-sm leading-relaxed">
          Each plan below uses a real line from <b>your</b> CV. Bracketed parts are what only you know — fill them in,
          then write your answer in the box. Model answers show the standard to aim for; they're an example
          candidate's story, so never borrow the experience.
        </p>
      </Card>
      {behaviouralQuestions.map(q => {
        const sc = buildScaffold(q, analysis.matrix, analysis.bullets)
        const comp = competencies.find(c => c.id === q.competency)
        const isOpen = open === q.id
        const mine = answers[q.id] || ''
        const words = mine.trim() ? mine.trim().split(/\s+/).length : 0
        const iCount = (mine.match(/\bI\b/g) || []).length
        const weCount = (mine.match(/\bwe\b/gi) || []).length
        return (
          <Card key={q.id} className="!p-0 overflow-hidden">
            <button onClick={() => setOpen(isOpen ? null : q.id)} className="w-full text-left p-4 flex items-start gap-3">
              <span className="text-lg">{comp?.icon || '🗺️'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{q.question}</p>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  {comp?.label || 'Your story'} · {sc.evidence || q.competency === 'narrative' ? <span className="text-green-400">evidence found</span> : <span className="text-yellow-400">no evidence on CV yet</span>}
                  {words > 0 && <span className="text-brand-teal"> · drafted</span>}
                </p>
              </div>
              <span className="text-gray-500 text-xs">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                <p className="text-gray-400 text-xs"><b className="text-gray-300">What they're testing:</b> {q.whatTheyTest}</p>
                {sc.evidence && (
                  <div className="bg-brand-teal/10 border border-brand-teal/20 rounded-lg p-3">
                    <p className="text-brand-teal text-[11px] font-bold uppercase tracking-wide mb-1">From your CV</p>
                    <p className="text-gray-200 text-sm">"{sc.evidence.line}"</p>
                  </div>
                )}
                <div className="space-y-2">
                  {([['S', 'Situation', sc.situation], ['T', 'Task', sc.task], ['A', 'Action', sc.action], ['R', 'Result', sc.result]] as const).map(([k, l, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-md bg-brand-gold/15 text-brand-gold text-xs font-black flex items-center justify-center">{k}</span>
                      <p className="text-gray-300 text-sm"><b className="text-white">{l}:</b> {v}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <textarea
                    value={mine}
                    onChange={e => setAnswer(q.id, e.target.value)}
                    placeholder="Write your answer here — it saves automatically."
                    className="w-full h-32 bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-gray-200 focus:outline-none focus:border-brand-gold/50"
                  />
                  {words > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] mt-1">
                      <span className={words >= 180 && words <= 320 ? 'text-green-400' : 'text-yellow-400'}>
                        {words} words ≈ {Math.max(1, Math.round(words / 140 * 60))}s spoken {words < 180 ? '(aim for 180–320)' : words > 320 ? '(too long — cut to ~2 min)' : '✓'}
                      </span>
                      <span className={/\d/.test(mine) ? 'text-green-400' : 'text-yellow-400'}>
                        {/\d/.test(mine) ? '✓ includes a number' : 'add a number to the result'}
                      </span>
                      {q.competency !== 'narrative' && (
                        <span className={iCount >= weCount ? 'text-green-400' : 'text-yellow-400'}>
                          {iCount >= weCount ? `✓ "I" ${iCount} vs "we" ${weCount}` : `more "we" (${weCount}) than "I" (${iCount}) — say what YOU did`}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button onClick={() => setShowModel(s => ({ ...s, [q.id]: !s[q.id] }))} className="text-brand-gold text-xs font-semibold">
                  {showModel[q.id] ? 'Hide model answer' : 'Show model answer (example candidate)'}
                </button>
                {showModel[q.id] && (
                  <div className="bg-white/5 rounded-lg p-3 space-y-2">
                    <p className="text-gray-300 text-sm leading-relaxed">{q.modelAnswer}</p>
                    <ul className="space-y-1">
                      {q.keyPoints.map(k => <li key={k} className="text-gray-400 text-xs">✓ {k}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}

// ─── Gaps & stand out ───────────────────────────────────────────────────────

function GapsTab({ analysis, hasCv, goCv }: { analysis: Analysis; hasCv: boolean; goCv: () => void }) {
  if (!hasCv) return <NeedCv goCv={goCv} />
  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-white font-bold mb-3">Your top {analysis.priorities.length} moves to stand out</h2>
        {analysis.priorities.length === 0 ? (
          <p className="text-green-400 text-sm">Strong CV — every major signal is covered. Focus on practising your answers.</p>
        ) : (
          <ol className="space-y-3">
            {analysis.priorities.map((p, i) => (
              <li key={p.title} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-gold text-black text-xs font-black flex items-center justify-center">{i + 1}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{p.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{p.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Card>

      <Card>
        <h2 className="text-white font-bold mb-1">Competency coverage</h2>
        <p className="text-gray-500 text-xs mb-3">Interviewers will ask about all of these. Each needs one story ready.</p>
        <div className="space-y-2">
          {competencies.map(c => {
            const ev = analysis.matrix[c.id][0]
            return (
              <div key={c.id} className="bg-white/5 rounded-lg p-3">
                <p className="text-sm font-semibold text-white">
                  {c.icon} {c.label} {ev ? <span className="text-green-400 text-xs">✓</span> : <span className="text-yellow-400 text-xs">— gap</span>}
                </p>
                {ev
                  ? <p className="text-gray-400 text-xs mt-1">Best evidence: "{ev.line}"{!ev.quantified && <span className="text-yellow-400"> · add a number</span>}</p>
                  : <ul className="mt-1 space-y-1">{c.addIdeas.map(a => <li key={a} className="text-gray-400 text-xs">→ {a}</li>)}</ul>}
              </div>
            )
          })}
        </div>
      </Card>

      {analysis.weak.length > 0 && (
        <Card>
          <h2 className="text-white font-bold mb-3">Weak wording to rewrite</h2>
          <div className="space-y-2">
            {analysis.weak.map(w => (
              <div key={w.line} className="bg-white/5 rounded-lg p-3">
                <p className="text-gray-300 text-xs">"{w.line}"</p>
                <p className="text-xs mt-1"><span className="text-red-400 font-semibold">"{w.phrase}"</span> <span className="text-gray-400">→ {w.fix}</span></p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="text-white font-bold mb-3">Stand-out signals for finance</h2>
        <div className="space-y-2">
          {analysis.present.map(s => (
            <p key={s.id} className="text-sm text-gray-300"><span className="text-green-400">✓</span> {s.label}</p>
          ))}
          {analysis.missing.map(s => (
            <div key={s.id} className="bg-white/5 rounded-lg p-3">
              <p className="text-sm text-white font-semibold"><span className="text-yellow-400">○</span> {s.label}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.why}</p>
              <p className="text-gray-300 text-xs mt-1">→ {s.howToAdd}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Market sizing ──────────────────────────────────────────────────────────

function SizingTab() {
  const [caseId, setCaseId] = useState(sizingCases[0].id)
  const c = sizingCases.find(x => x.id === caseId)!
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Record<string, 'right' | 'wrong' | 'revealed'>>({})

  const key = (i: number) => `${c.id}-${i}`
  const done = (i: number) => status[key(i)] === 'right' || status[key(i)] === 'revealed'
  const reached = c.steps.findIndex((_, i) => !done(i))
  const visibleUpTo = reached === -1 ? c.steps.length - 1 : reached

  function check(i: number) {
    const v = parseNumberInput(inputs[key(i)] || '')
    const step = c.steps[i]
    setStatus(s => ({ ...s, [key(i)]: v !== null && withinTolerance(v, step.answer, step.tolerancePct) ? 'right' : 'wrong' }))
  }

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-white font-bold mb-3">The six-step method</h2>
        <ol className="space-y-2">
          {sizingFramework.map((f, i) => (
            <li key={f.step} className="text-sm text-gray-300"><b className="text-brand-gold">{i + 1}. {f.step}</b> — {f.detail}</li>
          ))}
        </ol>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {sizingCases.map(x => (
          <button key={x.id} onClick={() => setCaseId(x.id)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold ${x.id === caseId ? 'bg-brand-teal text-black' : 'bg-white/5 text-gray-300 border border-white/10'}`}>
            {x.id === 'coffee' ? '☕ London coffees' : x.id === 'gym' ? '🏋️ UK gym market' : '🥪 Sandwich shop'}
          </button>
        ))}
      </div>

      <Card>
        <h2 className="text-white font-bold">{c.title}</h2>
        <p className="text-gray-500 text-xs mt-1 mb-4">Structure: {c.approach}. Type answers like 7m, 2.3m, 420 or £3.8bn.</p>
        <div className="space-y-3">
          {c.steps.slice(0, visibleUpTo + 1).map((s, i) => {
            const st = status[key(i)]
            return (
              <div key={key(i)} className="bg-white/5 rounded-xl p-3">
                <p className="text-brand-gold text-[11px] font-bold uppercase tracking-wide">Step {i + 1} · {s.label}</p>
                <p className="text-gray-300 text-sm mt-1">{s.given}</p>
                <p className="text-white text-sm font-semibold mt-1">{s.question}</p>
                {!done(i) ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    <input
                      value={inputs[key(i)] || ''}
                      onChange={e => setInputs(x => ({ ...x, [key(i)]: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') check(i) }}
                      inputMode="decimal"
                      placeholder={s.unit}
                      className="flex-1 min-w-0 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-gold/50"
                    />
                    <button onClick={() => check(i)} className="px-3 py-2 bg-brand-gold text-black text-xs font-bold rounded-lg">Check</button>
                    <button onClick={() => setStatus(x => ({ ...x, [key(i)]: 'revealed' }))} className="px-3 py-2 bg-white/5 text-gray-400 text-xs rounded-lg border border-white/10">Show</button>
                  </div>
                ) : null}
                {st === 'wrong' && <p className="text-yellow-400 text-xs mt-2">Not quite — check your arithmetic and units, or press Show.</p>}
                {done(i) && (
                  <p className={`text-xs mt-2 ${st === 'right' ? 'text-green-400' : 'text-gray-300'}`}>
                    {st === 'right' ? '✓ ' : ''}{s.working}
                  </p>
                )}
              </div>
            )
          })}
        </div>
        {reached === -1 && (
          <div className="mt-4 bg-brand-gold/10 border border-brand-gold/20 rounded-xl p-3">
            <p className="text-brand-gold text-[11px] font-bold uppercase tracking-wide mb-1">So what?</p>
            <p className="text-gray-200 text-sm">{c.soWhat}</p>
            <button onClick={() => setStatus(s => Object.fromEntries(Object.entries(s).filter(([k]) => !k.startsWith(c.id + '-'))))}
              className="text-brand-gold text-xs font-semibold mt-2">↻ Try again</button>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-white font-bold mb-2">Where candidates lose marks</h2>
        <ul className="space-y-1.5">{sizingPitfalls.map(p => <li key={p} className="text-gray-400 text-sm">✗ {p}</li>)}</ul>
        <p className="text-gray-500 text-xs mt-3">
          More cases: <Link to="/case-studies" className="text-brand-teal">Full Case Studies</Link> · <Link to="/skill-drills" className="text-brand-teal">Role Skill Drills</Link>
        </p>
      </Card>
    </div>
  )
}

// ─── Scenarios & psychometrics ──────────────────────────────────────────────

function ScenariosTab() {
  // Order the user clicked options in, best first.
  const [order, setOrder] = useState<Record<string, number[]>>({})
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-white font-bold mb-3">"What would you do?" — the five rules</h2>
        <div className="space-y-2">
          {sjtPrinciples.map(p => (
            <p key={p.rule} className="text-sm text-gray-300"><b className="text-white">{p.rule}.</b> {p.detail}</p>
          ))}
        </div>
      </Card>

      {scenarios.map((s, si) => {
        const picked = order[s.id] || []
        const isChecked = checked[s.id]
        const score = isChecked ? picked.filter((oi, pos) => s.options[oi].rank === pos + 1).length : 0
        return (
          <Card key={s.id}>
            <p className="text-brand-gold text-[11px] font-bold uppercase tracking-wide mb-1">Scenario {si + 1}</p>
            <p className="text-white text-sm font-semibold mb-1">{s.situation}</p>
            <p className="text-gray-500 text-xs mb-3">Tap the responses from <b>best</b> to <b>worst</b>.</p>
            <div className="space-y-2">
              {s.options.map((o, oi) => {
                const pos = picked.indexOf(oi)
                return (
                  <button
                    key={oi}
                    disabled={isChecked || pos !== -1}
                    onClick={() => setOrder(x => ({ ...x, [s.id]: [...picked, oi] }))}
                    className={`w-full text-left p-3 rounded-xl border text-sm transition-colors ${
                      pos !== -1 ? 'border-brand-gold/40 bg-brand-gold/10 text-white' : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full border border-white/20 text-[11px] font-bold flex items-center justify-center">{pos !== -1 ? pos + 1 : ''}</span>
                      <span>{o.text}</span>
                    </div>
                    {isChecked && (
                      <p className={`text-xs mt-2 ${o.rank === pos + 1 ? 'text-green-400' : 'text-yellow-400'}`}>
                        Best rank: {o.rank}. {o.why}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-3 mt-3">
              {!isChecked && picked.length === s.options.length && (
                <button onClick={() => setChecked(x => ({ ...x, [s.id]: true }))} className="px-4 py-2 bg-brand-gold text-black text-xs font-bold rounded-lg">Check my ranking</button>
              )}
              {picked.length > 0 && (
                <button onClick={() => { setOrder(x => ({ ...x, [s.id]: [] })); setChecked(x => ({ ...x, [s.id]: false })) }} className="text-gray-400 text-xs">↻ Reset</button>
              )}
              {isChecked && <span className={`text-sm font-bold ${score === s.options.length ? 'text-green-400' : 'text-brand-gold'}`}>{score}/{s.options.length} in the right place</span>}
            </div>
          </Card>
        )
      })}

      <Card>
        <h2 className="text-white font-bold mb-3">Psychometric tests — what each one is and how to approach it</h2>
        <div className="space-y-3">
          {psychometricTypes.map(p => (
            <div key={p.name} className="bg-white/5 rounded-lg p-3">
              <p className="text-white text-sm font-semibold">{p.name}</p>
              <p className="text-gray-400 text-xs mt-0.5">{p.what}</p>
              <ul className="mt-2 space-y-1">{p.how.map(h => <li key={h} className="text-gray-300 text-xs">→ {h}</li>)}</ul>
            </div>
          ))}
        </div>
        <Link to="/practice-tests" className="inline-block mt-4 px-4 py-2 bg-brand-teal text-black font-bold text-sm rounded-xl">
          Practise SJT & aptitude tests →
        </Link>
      </Card>
    </div>
  )
}
