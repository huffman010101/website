import { useState } from 'react'
import { Link } from 'react-router-dom'
import { skillTracks, Drill } from '../data/skillDrills'

function DrillCard({ drill, index, accent }: { drill: Drill; index: number; accent: string }) {
  const [input, setInput] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [checked, setChecked] = useState<null | boolean>(null)

  const checkable = typeof drill.answer === 'number'

  function check() {
    if (!checkable || !input.trim()) return
    const val = parseFloat(input.replace(/[,£%x]/gi, ''))
    if (isNaN(val)) return
    const tol = Math.abs(drill.answer!) * ((drill.tolerancePct ?? 5) / 100)
    setChecked(Math.abs(val - drill.answer!) <= tol)
    setRevealed(true)
  }

  return (
    <div className="bg-brand-card border border-white/10 rounded-xl p-5 mb-4">
      <div className="flex items-start gap-3 mb-3">
        <span className={`font-black text-sm flex-shrink-0 ${accent}`}>{index + 1}</span>
        <div className="min-w-0">
          <h3 className="text-white font-bold text-sm mb-1.5">{drill.title}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{drill.question}</p>
        </div>
      </div>

      {checkable && !revealed && (
        <div className="flex gap-2 mb-3 pl-8">
          <input
            type="text"
            inputMode="decimal"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') check() }}
            placeholder={`Your answer (${drill.unit})`}
            className="flex-1 bg-brand-darker border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-gold"
          />
          <button onClick={check} disabled={!input.trim()}
            className="px-4 py-2 bg-brand-gold text-black font-bold rounded-lg text-sm hover:bg-brand-gold2 transition-colors disabled:opacity-30">
            Check
          </button>
        </div>
      )}

      {checked !== null && (
        <p className={`text-sm font-bold mb-2 pl-8 ${checked ? 'text-green-400' : 'text-orange-400'}`}>
          {checked
            ? `✓ Correct — ${drill.answer} ${drill.unit}`
            : `Not quite. The answer is ${drill.answer} ${drill.unit} — follow the working below.`}
        </p>
      )}

      <div className="pl-8">
        <button
          onClick={() => setRevealed(v => !v)}
          className="text-brand-gold text-xs font-semibold hover:underline"
        >
          {revealed ? '▲ Hide working' : '▼ How to get there'}
        </button>

        {revealed && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Step by step</p>
            <ol className="space-y-2 mb-4">
              {drill.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-gray-300 text-sm leading-relaxed">
                  <span className="text-brand-teal font-mono text-xs flex-shrink-0 mt-0.5">{i + 1}.</span> {s}
                </li>
              ))}
            </ol>
            <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-lg p-3">
              <p className="text-xs text-brand-gold font-bold uppercase tracking-wider mb-1">The technique</p>
              <p className="text-gray-300 text-sm leading-relaxed">{drill.technique}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SkillDrills() {
  const [activeId, setActiveId] = useState(skillTracks[0].id)
  const track = skillTracks.find(t => t.id === activeId)!

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">Role Skill Drills</h1>
        <p className="text-gray-400">
          Each finance career interviews on a different skill. Trading tests mental maths and expected value,
          consulting tests structured estimation, banking tests valuation mechanics, PE tests the paper LBO.
          Pick your target and drill the exact thing they will put in front of you — every question has full
          working and the transferable technique.
        </p>
      </div>

      {/* Track selector */}
      <div className="flex overflow-x-auto gap-2 mb-8 pb-1">
        {skillTracks.map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveId(t.id); window.scrollTo(0, 0) }}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeId === t.id ? 'bg-brand-gold text-black' : 'bg-brand-card border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {t.icon} {t.role}
          </button>
        ))}
      </div>

      {/* What they test */}
      <div className={`bg-brand-card border ${track.border} rounded-2xl p-6 mb-6`}>
        <h2 className={`font-black text-lg mb-2 ${track.color}`}>What {track.role} interviews actually test</h2>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">{track.whatTheyTest}</p>
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Core skills</p>
        <div className="flex flex-wrap gap-2">
          {track.coreSkills.map((s, i) => (
            <span key={i} className="text-xs bg-white/5 text-gray-300 px-3 py-1.5 rounded-lg border border-white/5">{s}</span>
          ))}
        </div>
      </div>

      {/* Rules of thumb */}
      <div className="bg-brand-card border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-bold text-lg mb-1">⚡ Rules of thumb to memorise</h2>
        <p className="text-gray-500 text-xs mb-4">These remove the need for a calculator. Learn them cold — they are what makes fast answers possible.</p>
        <div className="space-y-3">
          {track.rulesOfThumb.map((r, i) => (
            <div key={i} className="bg-brand-darker border border-white/5 rounded-lg p-3.5">
              <p className="text-brand-gold font-bold text-sm font-mono mb-1">{r.rule}</p>
              <p className="text-gray-400 text-xs leading-relaxed">{r.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Drills */}
      <div className="mb-6">
        <h2 className="text-white font-bold text-lg mb-1">🎯 Drills</h2>
        <p className="text-gray-500 text-xs mb-4">
          Attempt each one properly before revealing the working — reading a solution you did not struggle with teaches you very little.
          Estimation questions accept a wide range, because the reasoning is what is scored.
        </p>
        {track.drills.map((d, i) => (
          <DrillCard key={`${track.id}-${i}`} drill={d} index={i} accent={track.color} />
        ))}
      </div>

      {/* General tips */}
      <div className="bg-brand-card border border-brand-teal/20 rounded-2xl p-6 mb-6">
        <h2 className="text-brand-teal font-bold text-lg mb-3">General tips — {track.role}</h2>
        <ul className="space-y-2.5">
          {track.generalTips.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
              <span className="text-brand-teal mt-0.5 flex-shrink-0">▸</span> {t}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-gray-500 text-sm text-center">
        Pair this with the <Link to="/practice-tests" className="text-brand-gold hover:underline">Mental Maths Sprint</Link> for raw speed,
        the <Link to="/interview-guide" className="text-brand-gold hover:underline">Interview Mastery</Link> guide for technique and model answers,
        and the <Link to="/learn" className="text-brand-gold hover:underline">capstone models</Link> to build a DCF and LBO end to end.
      </p>
    </div>
  )
}
