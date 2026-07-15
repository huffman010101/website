import { useState } from 'react'
import { Link } from 'react-router-dom'
import { jobs } from '../data/jobs'

const levels = ['Analyst', 'Associate / Manager', 'VP / Senior', 'MD / Partner']

const salaryData: Record<string, Record<string, { base: string; total: string }>> = {
  'investment-banking': {
    'Analyst': { base: '£70,000', total: '£110,000' },
    'Associate / Manager': { base: '£110,000', total: '£200,000' },
    'VP / Senior': { base: '£180,000', total: '£380,000' },
    'MD / Partner': { base: '£300,000', total: '£1,000,000+' },
  },
  'consulting': {
    'Analyst': { base: '£50,000', total: '£65,000' },
    'Associate / Manager': { base: '£90,000', total: '£130,000' },
    'VP / Senior': { base: '£150,000', total: '£230,000' },
    'MD / Partner': { base: '£350,000', total: '£1,000,000+' },
  },
  'private-equity': {
    'Analyst': { base: '£80,000', total: '£120,000' },
    'Associate / Manager': { base: '£120,000', total: '£200,000' },
    'VP / Senior': { base: '£200,000', total: '£400,000' },
    'MD / Partner': { base: '£500,000', total: '£5,000,000+' },
  },
  'hedge-fund': {
    'Analyst': { base: '£80,000', total: '£150,000' },
    'Associate / Manager': { base: '£130,000', total: '£350,000' },
    'VP / Senior': { base: '£250,000', total: '£800,000' },
    'MD / Partner': { base: '£500,000', total: '£10,000,000+' },
  },
  'quantitative-finance': {
    'Analyst': { base: '£80,000', total: '£130,000' },
    'Associate / Manager': { base: '£120,000', total: '£250,000' },
    'VP / Senior': { base: '£200,000', total: '£600,000' },
    'MD / Partner': { base: '£400,000', total: '£2,000,000+' },
  },
  'equity-research': {
    'Analyst': { base: '£55,000', total: '£80,000' },
    'Associate / Manager': { base: '£80,000', total: '£130,000' },
    'VP / Senior': { base: '£130,000', total: '£250,000' },
    'MD / Partner': { base: '£250,000', total: '£600,000' },
  },
  'trading': {
    'Analyst': { base: '£65,000', total: '£120,000' },
    'Associate / Manager': { base: '£100,000', total: '£250,000' },
    'VP / Senior': { base: '£200,000', total: '£700,000' },
    'MD / Partner': { base: '£400,000', total: '£3,000,000+' },
  },
  'portfolio-management': {
    'Analyst': { base: '£60,000', total: '£90,000' },
    'Associate / Manager': { base: '£90,000', total: '£160,000' },
    'VP / Senior': { base: '£150,000', total: '£400,000' },
    'MD / Partner': { base: '£300,000', total: '£2,000,000+' },
  },
  'venture-capital': {
    'Analyst': { base: '£55,000', total: '£80,000' },
    'Associate / Manager': { base: '£80,000', total: '£130,000' },
    'VP / Senior': { base: '£130,000', total: '£250,000' },
    'MD / Partner': { base: '£250,000', total: '£5,000,000+' },
  },
  'financial-advisor': {
    'Analyst': { base: '£28,000', total: '£40,000' },
    'Associate / Manager': { base: '£50,000', total: '£90,000' },
    'VP / Senior': { base: '£80,000', total: '£200,000' },
    'MD / Partner': { base: '£150,000', total: '£500,000+' },
  },
  'risk-management': {
    'Analyst': { base: '£45,000', total: '£60,000' },
    'Associate / Manager': { base: '£70,000', total: '£100,000' },
    'VP / Senior': { base: '£110,000', total: '£180,000' },
    'MD / Partner': { base: '£180,000', total: '£350,000' },
  },
  'fp-and-a': {
    'Analyst': { base: '£35,000', total: '£45,000' },
    'Associate / Manager': { base: '£55,000', total: '£80,000' },
    'VP / Senior': { base: '£90,000', total: '£140,000' },
    'MD / Partner': { base: '£150,000', total: '£300,000' },
  },
  'actuarial': {
    'Analyst': { base: '£35,000', total: '£42,000' },
    'Associate / Manager': { base: '£60,000', total: '£80,000' },
    'VP / Senior': { base: '£100,000', total: '£150,000' },
    'MD / Partner': { base: '£180,000', total: '£300,000' },
  },
  'corporate-development': {
    'Analyst': { base: '£60,000', total: '£80,000' },
    'Associate / Manager': { base: '£95,000', total: '£140,000' },
    'VP / Senior': { base: '£150,000', total: '£250,000' },
    'MD / Partner': { base: '£250,000', total: '£400,000+' },
  },
  'treasury': {
    'Analyst': { base: '£40,000', total: '£55,000' },
    'Associate / Manager': { base: '£70,000', total: '£100,000' },
    'VP / Senior': { base: '£110,000', total: '£160,000' },
    'MD / Partner': { base: '£180,000', total: '£280,000' },
  },
  'real-estate-finance': {
    'Analyst': { base: '£50,000', total: '£75,000' },
    'Associate / Manager': { base: '£90,000', total: '£140,000' },
    'VP / Senior': { base: '£150,000', total: '£280,000' },
    'MD / Partner': { base: '£300,000', total: '£800,000+' },
  },
  'fixed-income': {
    'Analyst': { base: '£65,000', total: '£100,000' },
    'Associate / Manager': { base: '£110,000', total: '£200,000' },
    'VP / Senior': { base: '£220,000', total: '£450,000' },
    'MD / Partner': { base: '£400,000', total: '£1,000,000+' },
  },
  'commodities-trading': {
    'Analyst': { base: '£55,000', total: '£100,000' },
    'Associate / Manager': { base: '£100,000', total: '£300,000' },
    'VP / Senior': { base: '£250,000', total: '£800,000' },
    'MD / Partner': { base: '£500,000', total: '£5,000,000+' },
  },
  'compliance': {
    'Analyst': { base: '£38,000', total: '£50,000' },
    'Associate / Manager': { base: '£70,000', total: '£100,000' },
    'VP / Senior': { base: '£110,000', total: '£170,000' },
    'MD / Partner': { base: '£200,000', total: '£400,000' },
  },
  'fintech': {
    'Analyst': { base: '£45,000', total: '£65,000' },
    'Associate / Manager': { base: '£80,000', total: '£120,000' },
    'VP / Senior': { base: '£130,000', total: '£220,000' },
    'MD / Partner': { base: '£200,000', total: '£500,000+' },
  },
  'sovereign-wealth': {
    'Analyst': { base: '£65,000', total: '£95,000' },
    'Associate / Manager': { base: '£100,000', total: '£160,000' },
    'VP / Senior': { base: '£180,000', total: '£300,000' },
    'MD / Partner': { base: '£320,000', total: '£550,000' },
  },
  'family-office': {
    'Analyst': { base: '£55,000', total: '£80,000' },
    'Associate / Manager': { base: '£95,000', total: '£145,000' },
    'VP / Senior': { base: '£160,000', total: '£260,000' },
    'MD / Partner': { base: '£280,000', total: '£500,000+' },
  },
  'restructuring': {
    'Analyst': { base: '£65,000', total: '£95,000' },
    'Associate / Manager': { base: '£110,000', total: '£170,000' },
    'VP / Senior': { base: '£180,000', total: '£350,000' },
    'MD / Partner': { base: '£350,000', total: '£600,000+' },
  },
  'structured-finance': {
    'Analyst': { base: '£60,000', total: '£90,000' },
    'Associate / Manager': { base: '£100,000', total: '£150,000' },
    'VP / Senior': { base: '£160,000', total: '£250,000' },
    'MD / Partner': { base: '£250,000', total: '£350,000+' },
  },
  'private-banking': {
    'Analyst': { base: '£45,000', total: '£65,000' },
    'Associate / Manager': { base: '£70,000', total: '£110,000' },
    'VP / Senior': { base: '£120,000', total: '£250,000' },
    'MD / Partner': { base: '£250,000', total: '£450,000+' },
  },
  'energy-commodities': {
    'Analyst': { base: '£55,000', total: '£85,000' },
    'Associate / Manager': { base: '£90,000', total: '£160,000' },
    'VP / Senior': { base: '£170,000', total: '£350,000' },
    'MD / Partner': { base: '£350,000', total: '£700,000+' },
  },
  'insurance-underwriting': {
    'Analyst': { base: '£35,000', total: '£50,000' },
    'Associate / Manager': { base: '£55,000', total: '£90,000' },
    'VP / Senior': { base: '£95,000', total: '£180,000' },
    'MD / Partner': { base: '£200,000', total: '£350,000+' },
  },
}

// Illustrative deferred/carry profile: how much of the ABOVE-BASE portion of
// comp typically shows up as deferred stock/cash or carried interest at
// senior levels, rather than immediate cash bonus. Junior levels are
// treated as ~all cash bonus, which matches how these careers actually pay.
type CompProfile = { deferredShare: number; carryShare: number }
const compProfiles: Record<string, CompProfile> = {
  'private-equity': { deferredShare: 0.10, carryShare: 0.60 },
  'hedge-fund': { deferredShare: 0.15, carryShare: 0.20 },
  'venture-capital': { deferredShare: 0.05, carryShare: 0.50 },
  'family-office': { deferredShare: 0.05, carryShare: 0.15 },
  'sovereign-wealth': { deferredShare: 0.10, carryShare: 0 },
  'investment-banking': { deferredShare: 0.35, carryShare: 0 },
  'trading': { deferredShare: 0.25, carryShare: 0 },
  'fixed-income': { deferredShare: 0.25, carryShare: 0 },
  'commodities-trading': { deferredShare: 0.20, carryShare: 0 },
  'energy-commodities': { deferredShare: 0.15, carryShare: 0.10 },
  'quantitative-finance': { deferredShare: 0.20, carryShare: 0 },
  'equity-research': { deferredShare: 0.15, carryShare: 0 },
  'portfolio-management': { deferredShare: 0.20, carryShare: 0.05 },
  'restructuring': { deferredShare: 0.20, carryShare: 0 },
  'structured-finance': { deferredShare: 0.20, carryShare: 0 },
  'private-banking': { deferredShare: 0.10, carryShare: 0 },
  'real-estate-finance': { deferredShare: 0.15, carryShare: 0.10 },
  'corporate-development': { deferredShare: 0.15, carryShare: 0 },
}
const defaultCompProfile: CompProfile = { deferredShare: 0.10, carryShare: 0 }
const seniorLevels = new Set(['VP / Senior', 'MD / Partner'])

function getCompBreakdown(jobId: string, level: string, base: number, total: number) {
  const basePct = total > 0 ? Math.round((base / total) * 100) : 100
  const remainderPct = 100 - basePct
  const isSenior = seniorLevels.has(level)
  const profile = compProfiles[jobId] || defaultCompProfile
  const deferredPct = isSenior ? Math.round(remainderPct * profile.deferredShare) : 0
  const carryPct = isSenior ? Math.round(remainderPct * profile.carryShare) : 0
  const bonusPct = Math.max(remainderPct - deferredPct - carryPct, 0)
  return { basePct, bonusPct, deferredPct, carryPct }
}

const geographies = ['London', 'New York', 'Singapore', 'Regional UK'] as const
type Geography = typeof geographies[number]
// Illustrative uplift/discount vs London, applied to the same GBP figures
// purely for relative comparability — not a currency conversion.
const geoMultipliers: Record<Geography, number> = { 'London': 1, 'New York': 1.15, 'Singapore': 1.05, 'Regional UK': 0.8 }
const geoNotes: Record<Geography, string> = {
  'London': 'Baseline figures as shown across the rest of FINdr.',
  'New York': 'US financial centre comp typically runs higher in cash terms, partly offsetting a higher cost of living — shown here as an illustrative +15% uplift.',
  'Singapore': 'A growing APAC hub with comp broadly comparable to London, often with more favourable personal tax treatment — illustrative +5% uplift.',
  'Regional UK': 'Roles outside London (Edinburgh, Leeds, Manchester) typically pay less in cash terms but come with a much lower cost of living — illustrative -20% adjustment.',
}

function formatGBP(n: number, hadPlus: boolean): string {
  const rounded = Math.round(n / 1000) * 1000
  return `£${rounded.toLocaleString('en-GB')}${hadPlus ? '+' : ''}`
}

function parseTotal(s: string): number {
  const clean = s.replace(/[£,+]/g, '').replace('000,000', '000000').trim()
  const num = parseFloat(clean.replace(/,/g, ''))
  if (isNaN(num)) return 0
  return num
}

const categoryColors: Record<string, string> = {
  'Capital Markets': 'bg-blue-500',
  'Alternative Investments': 'bg-purple-500',
  'Advisory': 'bg-green-500',
  'Technology & Quant': 'bg-cyan-500',
  'Asset Management': 'bg-orange-500',
  'Wealth Management': 'bg-pink-500',
  'Risk & Control': 'bg-red-500',
  'Corporate Finance': 'bg-yellow-500',
  'Trading': 'bg-brand-teal',
}

export default function SalaryComparison() {
  const [selectedLevel, setSelectedLevel] = useState('Analyst')
  const [sortBy, setSortBy] = useState<'name' | 'salary'>('salary')
  const [geography, setGeography] = useState<Geography>('London')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const multiplier = geoMultipliers[geography]

  const rows = jobs.map(job => {
    const data = salaryData[job.id]?.[selectedLevel]
    if (!data) return { job, data: null, total: 0, base: 0, hadPlus: false, breakdown: null }
    const rawTotal = parseTotal(data.total)
    const rawBase = parseTotal(data.base)
    const hadPlus = data.total.includes('+')
    const total = rawTotal * multiplier
    const base = rawBase * multiplier
    const breakdown = getCompBreakdown(job.id, selectedLevel, base, total)
    return { job, data, total, base, hadPlus, breakdown }
  }).filter(r => r.data)

  const sorted = [...rows].sort((a, b) =>
    sortBy === 'salary' ? b.total - a.total : a.job.title.localeCompare(b.job.title)
  )

  const maxTotal = Math.max(...sorted.map(r => r.total))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link to="/jobs" className="text-sm text-gray-500 hover:text-brand-gold transition-colors">← Back to Careers</Link>
        <h1 className="text-4xl font-black text-white mt-3 mb-2">Salary Comparison</h1>
        <p className="text-gray-400">Compare total compensation across {jobs.length} finance careers. Figures include base + typical bonus, with a comp structure breakdown and geography adjustment for each.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Seniority Level</p>
          <div className="flex gap-2 flex-wrap">
            {levels.map(level => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedLevel === level
                    ? 'bg-brand-gold text-black'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Sort By</p>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('salary')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${sortBy === 'salary' ? 'bg-brand-teal text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
            >
              Highest Paid
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${sortBy === 'name' ? 'bg-brand-teal text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
            >
              A–Z
            </button>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Geography</p>
          <div className="flex gap-2 flex-wrap">
            {geographies.map(geo => (
              <button
                key={geo}
                onClick={() => setGeography(geo)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${geography === geo ? 'bg-brand-gold text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              >
                {geo}
              </button>
            ))}
          </div>
        </div>
      </div>

      {geography !== 'London' && (
        <div className="bg-brand-card border border-brand-gold/20 rounded-xl p-4 mb-6">
          <p className="text-gray-300 text-sm">📍 <span className="text-brand-gold font-semibold">{geography}:</span> {geoNotes[geography]}</p>
        </div>
      )}

      {/* Chart */}
      <div className="space-y-3">
        {sorted.map(({ job, data, total, base, hadPlus, breakdown }, i) => {
          const barWidth = maxTotal > 0 ? (total / maxTotal) * 100 : 0
          const catColor = categoryColors[job.category] || 'bg-gray-500'
          const isExpanded = expandedId === job.id
          return (
            <div key={job.id} className="bg-brand-card border border-white/10 rounded-xl overflow-hidden hover:border-brand-gold/30 transition-all group">
              <button onClick={() => setExpandedId(isExpanded ? null : job.id)} className="w-full text-left p-4">
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 text-sm w-6 font-mono">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-semibold group-hover:text-brand-gold transition-colors">{job.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${catColor}/20 text-white/70`}>{job.category}</span>
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <div className="text-brand-gold font-bold text-sm">{formatGBP(total, hadPlus)}</div>
                        <div className="text-gray-500 text-xs">Base: {formatGBP(base, false)}</div>
                      </div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${catColor} rounded-full transition-all duration-700`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-gray-600 text-xs flex-shrink-0">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </button>
              {isExpanded && breakdown && (
                <div className="px-4 pb-4 pt-1 border-t border-white/5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Comp Structure at {selectedLevel}</p>
                  <div className="h-3 w-full flex rounded-full overflow-hidden mb-3">
                    <div className="bg-brand-gold" style={{ width: `${breakdown.basePct}%` }} title={`Base ${breakdown.basePct}%`} />
                    <div className="bg-brand-teal" style={{ width: `${breakdown.bonusPct}%` }} title={`Cash bonus ${breakdown.bonusPct}%`} />
                    {breakdown.deferredPct > 0 && <div className="bg-purple-400" style={{ width: `${breakdown.deferredPct}%` }} title={`Deferred ${breakdown.deferredPct}%`} />}
                    {breakdown.carryPct > 0 && <div className="bg-orange-400" style={{ width: `${breakdown.carryPct}%` }} title={`Carry ${breakdown.carryPct}%`} />}
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-gold inline-block" /> Base {breakdown.basePct}%</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-teal inline-block" /> Cash bonus {breakdown.bonusPct}%</span>
                    {breakdown.deferredPct > 0 && <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" /> Deferred stock/cash {breakdown.deferredPct}%</span>}
                    {breakdown.carryPct > 0 && <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" /> Carried interest {breakdown.carryPct}%</span>}
                  </div>
                  {(breakdown.deferredPct === 0 && breakdown.carryPct === 0) && (
                    <p className="text-gray-600 text-xs mt-2">At {selectedLevel.toLowerCase()} level, comp here is almost entirely cash — deferred stock and carry typically only kick in from VP/Senior upward.</p>
                  )}
                  <Link to={`/jobs/${job.id}`} className="inline-block mt-3 text-brand-gold text-xs font-semibold hover:underline">View full career profile →</Link>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-gray-600 text-xs mt-6 text-center">
        Figures represent typical UK market total compensation (base + bonus) at each level, adjusted for the selected geography using an illustrative multiplier. Comp structure breakdowns (base/bonus/deferred/carry) are approximate and vary significantly by firm — click any row to expand. Ranges vary by firm size, location, and performance.
      </p>
    </div>
  )
}
