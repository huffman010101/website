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

  const rows = jobs.map(job => {
    const data = salaryData[job.id]?.[selectedLevel]
    const total = data ? parseTotal(data.total) : 0
    return { job, data, total }
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
        <p className="text-gray-400">Compare total compensation across all 23 finance careers. Figures in GBP, including base + typical bonus.</p>
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
      </div>

      {/* Chart */}
      <div className="space-y-3">
        {sorted.map(({ job, data, total }, i) => {
          const barWidth = maxTotal > 0 ? (total / maxTotal) * 100 : 0
          const catColor = categoryColors[job.category] || 'bg-gray-500'
          return (
            <Link
              to={`/jobs/${job.id}`}
              key={job.id}
              className="block bg-brand-card border border-white/10 rounded-xl p-4 hover:border-brand-gold/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-500 text-sm w-6 font-mono">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold group-hover:text-brand-gold transition-colors">{job.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${catColor}/20 text-white/70`}>{job.category}</span>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <div className="text-brand-gold font-bold text-sm">{data?.total}</div>
                      <div className="text-gray-500 text-xs">Base: {data?.base}</div>
                    </div>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${catColor} rounded-full transition-all duration-700`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <p className="text-gray-600 text-xs mt-6 text-center">
        Figures represent typical UK market total compensation (base + bonus) at each level. Ranges vary by firm size, location, and performance. Carry and equity not included in all-in figures.
      </p>
    </div>
  )
}
