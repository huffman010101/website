import { useState } from 'react'
import { Link } from 'react-router-dom'
import { caseStudies, CaseStudy, CaseStage } from '../data/caseStudies'

function StageBlock({ stage, index }: { stage: CaseStage; index: number }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="bg-brand-card border border-white/10 rounded-xl overflow-hidden mb-4">
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-gold text-black font-bold text-xs flex items-center justify-center">
            {index + 1}
          </div>
          <h3 className="text-white font-bold text-sm pt-0.5">{stage.label}</h3>
        </div>

        <div className="bg-brand-darker border-l-2 border-brand-teal rounded-r-lg p-4 mb-3">
          <p className="text-xs text-brand-teal font-bold uppercase tracking-wider mb-1">Interviewer</p>
          <p className="text-gray-200 text-sm leading-relaxed italic">"{stage.interviewerSays}"</p>
        </div>

        <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-lg p-4 mb-3">
          <p className="text-xs text-brand-gold font-bold uppercase tracking-wider mb-1">Your task — attempt this before revealing</p>
          <p className="text-gray-300 text-sm leading-relaxed">{stage.yourTask}</p>
        </div>

        {stage.exhibit && (
          <div className="bg-brand-darker border border-white/10 rounded-lg p-4 mb-3 overflow-x-auto">
            <p className="text-white font-semibold text-sm mb-2">{stage.exhibit.title}</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {stage.exhibit.headers.map((h, i) => (
                    <th key={i} className="text-left p-2 text-gray-400 font-semibold border-b border-white/10 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stage.exhibit.rows.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    {row.map((cell, j) => (
                      <td key={j} className={`p-2 whitespace-nowrap ${j === 0 ? 'text-gray-300' : 'text-white font-medium'}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {stage.exhibit.note && <p className="text-gray-500 text-xs mt-2 italic">{stage.exhibit.note}</p>}
          </div>
        )}

        <button
          onClick={() => setRevealed(v => !v)}
          className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors ${
            revealed ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-brand-teal text-white hover:bg-brand-teal2'
          }`}
        >
          {revealed ? '▲ Hide model answer' : '▼ Reveal model answer & working'}
        </button>
      </div>

      {revealed && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
          {stage.modelStructure && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">What a strong answer sounds like</p>
              <ul className="space-y-2">
                {stage.modelStructure.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
                    <span className="text-brand-teal mt-0.5 flex-shrink-0">▸</span> {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stage.working && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">The working</p>
              <ol className="space-y-1.5 bg-brand-darker rounded-lg p-4 border border-white/5">
                {stage.working.map((w, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-gray-300 text-sm leading-relaxed">
                    <span className="text-brand-gold font-mono text-xs flex-shrink-0 mt-0.5">{i + 1}.</span> {w}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-lg p-4">
            <p className="text-xs text-brand-teal font-bold uppercase tracking-wider mb-1">The insight that wins marks</p>
            <p className="text-gray-300 text-sm leading-relaxed">{stage.insight}</p>
          </div>

          <div>
            <p className="text-xs text-red-400 uppercase tracking-wider font-semibold mb-2">Common mistakes at this stage</p>
            <ul className="space-y-1.5">
              {stage.commonMistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-400 text-sm leading-relaxed">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span> {m}
                </li>
              ))}
            </ul>
          </div>

          {stage.followUps && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Follow-ups to expect</p>
              <ul className="space-y-1">
                {stage.followUps.map((f, i) => (
                  <li key={i} className="text-gray-400 text-sm italic">{f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CaseView({ study, onBack }: { study: CaseStudy; onBack: () => void }) {
  const [showFinal, setShowFinal] = useState(false)

  return (
    <div>
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-brand-gold transition-colors mb-4">
        ← All cases
      </button>

      <div className={`bg-brand-card border ${study.border} rounded-2xl p-6 mb-6`}>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="text-2xl">{study.icon}</span>
          <h1 className="text-2xl font-black text-white">{study.title}</h1>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${study.difficulty === 'Hard' ? 'bg-red-500/15 text-red-400' : 'bg-brand-teal/15 text-brand-teal'}`}>
            {study.difficulty}
          </span>
        </div>
        <p className={`text-sm font-semibold mb-3 ${study.color}`}>{study.type} · {study.firm} · {study.duration}</p>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">{study.context}</p>

        <div className="bg-brand-darker border-l-2 border-brand-gold rounded-r-lg p-4 mb-4">
          <p className="text-xs text-brand-gold font-bold uppercase tracking-wider mb-1">The prompt</p>
          <p className="text-gray-200 text-sm leading-relaxed italic">"{study.openingPrompt}"</p>
        </div>

        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">What they're testing</p>
        <ul className="space-y-1">
          {study.whatTheyreTesting.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
              <span className="text-brand-teal flex-shrink-0">▸</span> {t}
            </li>
          ))}
        </ul>
      </div>

      {study.stages.map((s, i) => <StageBlock key={i} stage={s} index={i} />)}

      {/* Final recommendation */}
      <div className="bg-brand-card border border-brand-gold/30 rounded-xl p-5 mb-4">
        <button onClick={() => setShowFinal(v => !v)} className="w-full text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-brand-gold font-bold">🎯 Model final recommendation</h3>
            <span className="text-brand-gold">{showFinal ? '−' : '+'}</span>
          </div>
          <p className="text-gray-500 text-xs mt-1">Deliver yours out loud in 60-90 seconds before revealing this.</p>
        </button>
        {showFinal && (
          <ul className="space-y-2.5 mt-4">
            {study.finalRecommendation.map((r, i) => (
              <li key={i} className={`text-sm leading-relaxed ${i === 0 ? 'text-white font-semibold' : 'text-gray-300'}`}>{r}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Strong vs weak */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-brand-card border border-green-500/20 rounded-xl p-5">
          <h3 className="text-green-400 font-bold mb-3">What a strong candidate did</h3>
          <ul className="space-y-2">
            {study.strongVsWeak.strong.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
                <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-brand-card border border-red-500/20 rounded-xl p-5">
          <h3 className="text-red-400 font-bold mb-3">What a weak candidate did</h3>
          <ul className="space-y-2">
            {study.strongVsWeak.weak.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
                <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-brand-card border border-white/10 rounded-xl p-5">
        <h3 className="text-white font-bold mb-3">Key takeaways</h3>
        <ul className="space-y-2">
          {study.takeaways.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
              <span className="text-brand-gold mt-0.5 flex-shrink-0">▸</span> {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function CaseStudies() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = caseStudies.find(c => c.id === activeId)

  if (active) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CaseView study={active} onBack={() => { setActiveId(null); window.scrollTo(0, 0) }} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">Full Case Studies</h1>
        <p className="text-gray-400">
          Complete cases worked stage by stage — the interviewer's actual words, real exhibits, your task at each
          point, then the model answer with full arithmetic, the insight that wins marks, and the mistakes that lose them.
          Attempt each stage properly before revealing. These take 20-45 minutes each and are meant to be done with pen and paper.
        </p>
      </div>

      <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-xl p-5 mb-8">
        <p className="text-gray-300 text-sm leading-relaxed">
          <span className="text-white font-semibold">How to use these properly:</span> read the prompt, then set a timer
          and work the whole case on paper before opening any reveal. Speak your reasoning out loud — the verbal skill is
          what is actually being assessed, and silent reading builds none of it. When you finish, deliver the final
          recommendation aloud in 60-90 seconds, then compare against the model.
        </p>
      </div>

      <div className="space-y-4">
        {caseStudies.map(c => (
          <button
            key={c.id}
            onClick={() => { setActiveId(c.id); window.scrollTo(0, 0) }}
            className={`w-full text-left bg-brand-card border ${c.border} rounded-xl p-5 hover:border-brand-gold/50 transition-all group`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xl">{c.icon}</span>
                <span className="text-white font-bold group-hover:text-brand-gold transition-colors">{c.title}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.difficulty === 'Hard' ? 'bg-red-500/15 text-red-400' : 'bg-brand-teal/15 text-brand-teal'}`}>
                  {c.difficulty}
                </span>
              </div>
              <span className="text-gray-600 text-xs flex-shrink-0">{c.duration}</span>
            </div>
            <p className={`text-xs font-semibold mb-2 ${c.color}`}>{c.type} · {c.firm}</p>
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{c.openingPrompt}</p>
            <p className="text-gray-600 text-xs mt-2">{c.stages.length} stages · exhibits, full working and model recommendation</p>
          </button>
        ))}
      </div>

      <p className="text-gray-500 text-sm text-center mt-8">
        Drill the underlying maths in <Link to="/skill-drills" className="text-brand-gold hover:underline">Role Skill Drills</Link>,
        and the technical concepts in <Link to="/technicals" className="text-brand-gold hover:underline">Technicals & Routes In</Link>.
      </p>
    </div>
  )
}
