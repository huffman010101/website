import { useState } from 'react'
import { Link } from 'react-router-dom'
import { dealTeardowns, rateDrivers, sectorSensitivities, newsHabits } from '../data/marketIntel'

const tabs = ['Deal Teardowns', 'What Moves Rates', 'Sector Sensitivity', 'Build Your Own Edge'] as const
type Tab = typeof tabs[number]

export default function MarketIntel() {
  const [tab, setTab] = useState<Tab>('Deal Teardowns')
  const [openDeal, setOpenDeal] = useState<string | null>(null)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-4xl font-black text-white mb-2">Deals & Market Intelligence</h1>
        <p className="text-gray-400">
          Landmark deals broken down properly — what happened, how they were structured, what they mean for each
          sector, and how to use them in interviews. Plus what actually moves rates, how sectors react, and a
          system for keeping your own commercial awareness current.
        </p>
      </div>

      <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-xl p-4 mb-6">
        <p className="text-gray-300 text-sm leading-relaxed">
          <span className="text-white font-semibold">Note on live news:</span> this page is a curated teardown library
          and framework, not a live feed — a hardcoded news list would be stale within weeks and worse than useless in
          an interview. The <span className="text-brand-gold">Build Your Own Edge</span> tab shows you how to run a
          daily FT habit so your commercial awareness is genuinely current. Figures below are approximate and worth
          verifying against a primary source before you quote them.
        </p>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-6 pb-1">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); window.scrollTo(0, 0) }}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === t ? 'bg-brand-gold text-black' : 'bg-brand-card border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* DEAL TEARDOWNS */}
      {tab === 'Deal Teardowns' && (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">
            Five deals that each teach a distinct lesson. Learn two or three properly rather than skimming all of them —
            interviewers probe depth, and a candidate who can discuss structure and sector impact beats one who
            remembers a headline number.
          </p>
          {dealTeardowns.map(d => {
            const open = openDeal === d.id
            return (
              <div key={d.id} className="bg-brand-card border border-white/10 rounded-xl overflow-hidden">
                <button onClick={() => setOpenDeal(open ? null : d.id)} className="w-full text-left p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xl">{d.icon}</span>
                        <span className="text-white font-bold">{d.name}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold">{d.size}</span>
                      </div>
                      <p className="text-brand-teal text-sm font-medium">{d.headline}</p>
                      <p className="text-gray-600 text-xs mt-1">{d.type} · {d.year}</p>
                    </div>
                    <span className="text-brand-gold flex-shrink-0">{open ? '−' : '+'}</span>
                  </div>
                </button>

                {open && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-5">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">What happened</p>
                      <ul className="space-y-1.5">
                        {d.whatHappened.map((w, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
                            <span className="text-brand-teal mt-0.5 flex-shrink-0">▸</span> {w}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Structure</p>
                      <div className="bg-brand-darker rounded-lg border border-white/5 overflow-hidden">
                        {d.structure.map((s, i) => (
                          <div key={i} className="flex justify-between gap-4 px-4 py-2.5 border-b border-white/5 last:border-0">
                            <span className="text-gray-400 text-sm">{s.label}</span>
                            <span className="text-white text-sm font-medium text-right">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Strategic rationale</p>
                      <ul className="space-y-1.5">
                        {d.rationale.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
                            <span className="text-brand-gold mt-0.5 flex-shrink-0">▸</span> {r}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-brand-darker rounded-lg p-4 border border-white/5">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">How it actually went</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{d.howItWent}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">What it means by sector</p>
                      <div className="space-y-2">
                        {d.sectorImplications.map((s, i) => (
                          <div key={i} className="bg-white/5 rounded-lg p-3">
                            <p className="text-brand-teal font-semibold text-sm mb-0.5">{s.sector}</p>
                            <p className="text-gray-300 text-sm leading-relaxed">{s.impact}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-lg p-4">
                      <p className="text-xs text-brand-gold font-bold uppercase tracking-wider mb-1">How to use it in an interview</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{d.interviewAngle}</p>
                    </div>

                    <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-lg p-4">
                      <p className="text-xs text-brand-teal font-bold uppercase tracking-wider mb-1">The transferable lesson</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{d.lesson}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* RATE DRIVERS */}
      {tab === 'What Moves Rates' && (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">
            Rates are the gravity of finance — when they move, every asset reprices. These are the six things that
            actually move them, when each is released, and how markets react. Essential for any markets, trading or
            fixed income interview.
          </p>
          {rateDrivers.map((r, i) => (
            <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                <h3 className="text-white font-bold">{r.driver}</h3>
                <span className="text-xs font-semibold text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded-full flex-shrink-0">
                  {r.whenReleased}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">{r.what}</p>
              <div className="bg-brand-darker rounded-lg p-3 mb-2 border border-white/5">
                <p className="text-xs text-brand-gold font-bold uppercase tracking-wider mb-1">Why it moves rates</p>
                <p className="text-gray-300 text-sm leading-relaxed">{r.whyItMoves}</p>
              </div>
              <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-lg p-3">
                <p className="text-xs text-brand-teal font-bold uppercase tracking-wider mb-1">Typical market reaction</p>
                <p className="text-gray-300 text-sm leading-relaxed">{r.marketReaction}</p>
              </div>
            </div>
          ))}
          <div className="bg-brand-card border border-brand-gold/20 rounded-xl p-5">
            <h3 className="text-brand-gold font-bold mb-2">The one principle underneath all of it</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Markets trade the <span className="text-white font-semibold">surprise versus expectations</span>, not the
              absolute level. Inflation at 4% is bullish if markets expected 4.5% and bearish if they expected 3.5%.
              This is why a company can report record profits and see its shares fall, and why "good" economic data can
              sell off equities. Always ask what was priced in before asking what happened.
            </p>
          </div>
        </div>
      )}

      {/* SECTOR SENSITIVITY */}
      {tab === 'Sector Sensitivity' && (
        <div>
          <p className="text-gray-500 text-sm mb-4">
            When rates move, sectors do not react uniformly. Being able to explain why is a standard commercial
            awareness question and separates candidates who follow markets from those who understand them.
          </p>
          <div className="space-y-3 mb-6">
            {sectorSensitivities.map((s, i) => (
              <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-5">
                <h3 className="text-white font-bold mb-3">{s.sector}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                    <p className="text-xs text-red-400 font-bold uppercase tracking-wider mb-1">Rates rise ↑</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{s.ratesUp}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                    <p className="text-xs text-green-400 font-bold uppercase tracking-wider mb-1">Rates fall ↓</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{s.ratesDown}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-brand-card border border-brand-teal/20 rounded-xl p-5">
            <h3 className="text-brand-teal font-bold mb-2">The mechanism to remember</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              A higher discount rate reduces the present value of all future cash flows, and it reduces them most for
              cash flows furthest in the future. That single sentence explains why unprofitable growth technology falls
              hardest when rates rise, why utilities and real estate suffer, and why banks — whose earnings actually
              rise with rates — can outperform in the same move. If you can explain that mechanism clearly, you can
              answer almost any rates-and-sectors question.
            </p>
          </div>
        </div>
      )}

      {/* BUILD YOUR OWN EDGE */}
      {tab === 'Build Your Own Edge' && (
        <div className="space-y-4">
          <div className="bg-brand-card border border-white/10 rounded-xl p-5">
            <p className="text-gray-300 text-sm leading-relaxed">
              Commercial awareness cannot be crammed. It compounds — which is good news, because 15 minutes a day from
              now until interviews puts you far ahead of candidates who start the week before. This is the system.
            </p>
          </div>
          {newsHabits.map((h, i) => (
            <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-gold text-black font-bold text-xs flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">{h.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{h.detail}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-xl p-5">
            <h3 className="text-brand-gold font-bold mb-2">Your deal tracker template</h3>
            <p className="text-gray-400 text-sm mb-3">Copy this into <Link to="/meeting-notes" className="text-brand-gold hover:underline">Meeting Notes</Link> for every deal you follow:</p>
            <div className="bg-brand-darker rounded-lg p-4 border border-white/5 font-mono text-xs text-gray-300 space-y-1">
              <p>Parties: [acquirer] / [target]</p>
              <p>Price &amp; multiple: [£Xbn, Yx EBITDA]</p>
              <p>Rationale: [why, in one sentence]</p>
              <p>Financing: [cash / stock / debt, and leverage]</p>
              <p>My view: [would I have done it, at what price]</p>
              <p>Sector read-across: [who else is affected]</p>
            </div>
          </div>
        </div>
      )}

      <p className="text-gray-500 text-sm text-center mt-8">
        Apply this in <Link to="/case-studies" className="text-brand-gold hover:underline">Full Case Studies</Link>, and
        practise discussing it in the <Link to="/interview-quiz" className="text-brand-gold hover:underline">Interview Quiz</Link>.
      </p>
    </div>
  )
}
