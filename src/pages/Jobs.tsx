import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { jobs } from '../data/jobs'

const categoryColors: Record<string, string> = {
  'Capital Markets': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Alternative Investments': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Advisory': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Technology & Quant': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Asset Management': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Wealth Management': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  'Risk & Control': 'bg-red-500/10 text-red-400 border-red-500/20',
  'Corporate Finance': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Trading': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
}

const aiColors: Record<string, string> = {
  'Low': 'text-green-400',
  'Medium': 'text-yellow-400',
  'High': 'text-orange-400',
  'Very High': 'text-red-400',
}

const categories = ['All', ...Array.from(new Set(jobs.map(j => j.category)))]

export default function Jobs() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return jobs.filter(job => {
      const matchesCategory = activeCategory === 'All' || job.category === activeCategory
      const matchesSearch = search === '' ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
        job.category.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Finance <span className="text-gradient-gold">Careers</span>
        </h1>
        <p className="text-gray-400 text-lg">Explore {jobs.length} in-depth finance career profiles with salary data, break-in guides, and AI threat analysis.</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search careers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-80 bg-brand-card border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold/50 transition-colors"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-brand-gold text-black border-brand-gold'
                : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/20 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-gray-500 text-sm mb-6">{filtered.length} career{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-2">No careers match your search.</p>
          <button onClick={() => { setSearch(''); setActiveCategory('All') }} className="text-brand-gold text-sm hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(job => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="bg-brand-card border border-white/10 rounded-2xl p-6 hover:border-brand-gold/40 hover:bg-brand-card2 transition-all duration-300 group flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColors[job.category] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                  {job.category}
                </span>
              </div>

              <h2 className="text-white font-bold text-lg mb-2 group-hover:text-brand-gold transition-colors">{job.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">{job.shortDescription}</p>

              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">Salary Range</span>
                  <span className="text-brand-teal text-xs font-semibold">{job.salaryRange}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">AI Threat</span>
                  <span className={`text-xs font-semibold ${aiColors[job.aiThreatLevel]}`}>{job.aiThreatLevel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">Top Firms</span>
                  <span className="text-gray-300 text-xs">{job.topFirms.slice(0, 2).join(', ')}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-1">
                  {job.subRoles.slice(0, 3).map(role => (
                    <span key={role} className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded">
                      {role}
                    </span>
                  ))}
                  {job.subRoles.length > 3 && (
                    <span className="text-xs text-gray-500">+{job.subRoles.length - 3} more</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
