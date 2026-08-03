import { useState } from 'react'
import { Link } from 'react-router-dom'
import { techTracks } from '../data/technicals'

const tabs = ['Technicals', 'Application Process', 'How to Break In'] as const
type Tab = typeof tabs[number]

export default function Technicals() {
  const [trackId, setTrackId] = useState(techTracks[0].id)
  const [tab, setTab] = useState<Tab>('Technicals')
  const [openTopic, setOpenTopic] = useState<string | null>(null)
  const track = techTracks.find(t => t.id === trackId)!

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">Technicals & Application Routes</h1>
        <p className="text-gray-400">
          What you actually need to know for each path, what the application process really looks like
          month by month, and the realistic routes in — including the ones nobody tells you about.
        </p>
      </div>

      {/* Track selector */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-1">
        {techTracks.map(t => (
          <button
            key={t.id}
            onClick={() => { setTrackId(t.id); setOpenTopic(null); window.scrollTo(0, 0) }}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              trackId === t.id ? 'bg-brand-gold text-black' : 'bg-brand-card border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {t.icon} {t.path}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className={`bg-brand-card border ${track.border} rounded-2xl p-6 mb-6`}>
        <h2 className={`font-black text-lg mb-2 ${track.color}`}>{track.icon} {track.path}</h2>
        <p className="text-gray-300 text-sm leading-relaxed mb-3">{track.summary}</p>
        <div className="bg-brand-darker border border-white/5 rounded-lg p-3">
          <p className="text-xs text-brand-gold font-bold uppercase tracking-wider mb-1">How deep do the technicals go?</p>
          <p className="text-gray-400 text-sm leading-relaxed">{track.technicalDepth}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t ? 'bg-brand-teal text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* TECHNICALS */}
      {tab === 'Technicals' && (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">
            These are the answers you should be able to give fluently, not just recognise. Expand each topic and
            practise saying them aloud — hesitation on the classics is what reads as unprepared.
          </p>
          {track.technicals.map(group => {
            const key = `${track.id}-${group.topic}`
            const open = openTopic === key
            return (
              <div key={group.topic} className="bg-brand-card border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenTopic(open ? null : key)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-white font-bold text-sm">{group.topic}</span>
                  <span className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-600">{group.mustKnow.length} to know</span>
                    <span className="text-brand-gold">{open ? '−' : '+'}</span>
                  </span>
                </button>
                {open && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                    {group.mustKnow.map((item, i) => (
                      <div key={i}>
                        <p className="text-brand-teal font-semibold text-sm mb-1">{item.q}</p>
                        <p className="text-gray-300 text-sm leading-relaxed">{item.a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-xl p-5">
            <p className="text-gray-300 text-sm leading-relaxed">
              💡 Drill these actively rather than re-reading them: use the{' '}
              <Link to="/skill-drills" className="text-brand-gold hover:underline">Role Skill Drills</Link> for worked maths,
              the <Link to="/interview-quiz" className="text-brand-gold hover:underline">Interview Quiz</Link> to practise saying answers,
              and the <Link to="/learn" className="text-brand-gold hover:underline">capstone models</Link> to build a DCF and LBO end to end.
            </p>
          </div>
        </div>
      )}

      {/* PROCESS */}
      {tab === 'Application Process' && (
        <div className="space-y-3">
          <p className="text-gray-500 text-sm mb-4">
            The stages in order, when they happen, and specifically what gets people cut at each one.
          </p>
          {track.process.map((s, i) => (
            <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-gold text-black font-bold text-sm flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
                    <h3 className="text-white font-bold text-sm">{s.stage}</h3>
                    <span className="text-xs font-semibold text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded-full flex-shrink-0">
                      {s.timing}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-2">{s.detail}</p>
                  <div className="bg-brand-darker border border-white/5 rounded-lg p-3">
                    <p className="text-xs text-brand-gold font-bold uppercase tracking-wider mb-1">How to survive it</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{s.survive}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BREAK IN */}
      {tab === 'How to Break In' && (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">
            Every realistic route in, with an honest read on how viable each one actually is.
          </p>
          {track.breakIn.map((r, i) => (
            <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-1.5">
                <h3 className="text-white font-bold text-sm">{r.route}</h3>
                <span className="text-xs font-semibold text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded-full flex-shrink-0">
                  {r.realism}
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{r.detail}</p>
            </div>
          ))}

          <div className="bg-brand-card border border-brand-teal/20 rounded-xl p-6">
            <h3 className="text-brand-teal font-bold mb-3">What actually differentiates candidates here</h3>
            <ul className="space-y-2.5">
              {track.differentiators.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
                  <span className="text-brand-teal mt-0.5 flex-shrink-0">▸</span> {d}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-gray-500 text-sm text-center pt-2">
            Plan your year around these timelines in{' '}
            <Link to="/interview-guide" className="text-brand-gold hover:underline">Interview Mastery → Your Year Ahead</Link>.
          </p>
        </div>
      )}
    </div>
  )
}
