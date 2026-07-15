import { useState } from 'react'
import { Link } from 'react-router-dom'
import { jobs } from '../data/jobs'
import { careerHours } from '../data/careerHours'

const MAX_SLOTS = 3

const intensityColor: Record<string, string> = {
  'Low': 'text-green-400 bg-green-500/10',
  'Moderate': 'text-yellow-400 bg-yellow-500/10',
  'High': 'text-orange-400 bg-orange-500/10',
  'Extreme': 'text-red-400 bg-red-500/10',
}

const aiColor: Record<string, string> = {
  'Low': 'text-green-400 bg-green-500/10',
  'Medium': 'text-yellow-400 bg-yellow-500/10',
  'High': 'text-orange-400 bg-orange-500/10',
  'Very High': 'text-red-400 bg-red-500/10',
}

export default function CareerComparison() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['investment-banking', 'private-equity'])

  const selected = selectedIds.map(id => jobs.find(j => j.id === id)).filter((j): j is NonNullable<typeof j> => !!j)

  function setSlot(index: number, id: string) {
    setSelectedIds(prev => {
      const next = [...prev]
      next[index] = id
      return next
    })
  }

  function addSlot() {
    if (selectedIds.length >= MAX_SLOTS) return
    const unused = jobs.find(j => !selectedIds.includes(j.id))
    setSelectedIds(prev => [...prev, unused?.id || jobs[0].id])
  }

  function removeSlot(index: number) {
    setSelectedIds(prev => prev.filter((_, i) => i !== index))
  }

  // Skill overlap: which skills appear in every selected career vs only some
  const allSkillLists = selected.map(j => new Set(j.skillsToMaster))
  const sharedSkills = selected.length >= 2
    ? Array.from(allSkillLists[0]).filter(skill => allSkillLists.every(set => set.has(skill)))
    : []
  const uniqueSkillsByJob = selected.map((j, i) =>
    j.skillsToMaster.filter(skill => !allSkillLists.some((set, k) => k !== i && set.has(skill)))
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link to="/jobs" className="text-sm text-gray-500 hover:text-brand-gold transition-colors">← Back to Careers</Link>
        <h1 className="text-4xl font-black text-white mt-3 mb-2">Career Comparison</h1>
        <p className="text-gray-400">Put 2-3 careers side by side — hours, comp, exit options and how much their skillsets actually overlap.</p>
      </div>

      {/* Selectors */}
      <div className="flex flex-wrap gap-3 mb-8">
        {selectedIds.map((id, i) => (
          <div key={i} className="flex items-center gap-2">
            <select
              value={id}
              onChange={e => setSlot(i, e.target.value)}
              className="bg-brand-card border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold text-sm"
            >
              {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
            {selectedIds.length > 2 && (
              <button onClick={() => removeSlot(i)} className="text-gray-500 hover:text-red-400 text-sm">✕</button>
            )}
          </div>
        ))}
        {selectedIds.length < MAX_SLOTS && (
          <button onClick={addSlot} className="px-4 py-2.5 bg-white/5 text-gray-300 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors">
            + Add a third career
          </button>
        )}
      </div>

      {selected.length < 2 ? (
        <p className="text-gray-500 text-center py-10">Select at least two careers to compare.</p>
      ) : (
        <>
          {/* Side-by-side comparison table */}
          <div className="overflow-x-auto mb-10">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 text-gray-500 text-xs uppercase tracking-wider w-40"></th>
                  {selected.map(job => (
                    <th key={job.id} className="text-left p-3 bg-brand-card border-b-2 border-brand-gold/30 min-w-[220px]">
                      <Link to={`/jobs/${job.id}`} className="text-white font-black text-lg hover:text-brand-gold transition-colors">{job.title}</Link>
                      <p className="text-gray-500 text-xs mt-1">{job.category}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="p-3 text-gray-400 text-sm font-semibold">💰 Salary Range</td>
                  {selected.map(job => <td key={job.id} className="p-3 bg-brand-card text-brand-gold font-bold text-sm">{job.salaryRange}</td>)}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-3 text-gray-400 text-sm font-semibold">⏰ Hours (Junior)</td>
                  {selected.map(job => (
                    <td key={job.id} className="p-3 bg-brand-card text-sm">
                      <span className="text-white">{careerHours[job.id]?.junior || 'Varies'}</span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-3 text-gray-400 text-sm font-semibold">⏰ Hours (Senior)</td>
                  {selected.map(job => <td key={job.id} className="p-3 bg-brand-card text-white text-sm">{careerHours[job.id]?.senior || 'Varies'}</td>)}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-3 text-gray-400 text-sm font-semibold">🔥 Intensity</td>
                  {selected.map(job => {
                    const intensity = careerHours[job.id]?.intensity || 'Moderate'
                    return <td key={job.id} className="p-3 bg-brand-card"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${intensityColor[intensity]}`}>{intensity}</span></td>
                  })}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-3 text-gray-400 text-sm font-semibold">🤖 AI Threat Level</td>
                  {selected.map(job => <td key={job.id} className="p-3 bg-brand-card"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${aiColor[job.aiThreatLevel]}`}>{job.aiThreatLevel}</span></td>)}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-3 text-gray-400 text-sm font-semibold align-top">🚪 Exit Opportunities</td>
                  {selected.map(job => (
                    <td key={job.id} className="p-3 bg-brand-card align-top">
                      <div className="flex flex-wrap gap-1.5">
                        {job.exitOpportunities.slice(0, 5).map(exit => (
                          <span key={exit} className="text-xs bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded-full">{exit}</span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-3 text-gray-400 text-sm font-semibold align-top">✓ Top Pros</td>
                  {selected.map(job => (
                    <td key={job.id} className="p-3 bg-brand-card align-top">
                      <ul className="space-y-1">
                        {job.prosAndCons.pros.slice(0, 3).map((p, i) => (
                          <li key={i} className="text-gray-300 text-xs flex items-start gap-1.5"><span className="text-green-400 flex-shrink-0">✓</span>{p}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-3 text-gray-400 text-sm font-semibold align-top">✗ Top Cons</td>
                  {selected.map(job => (
                    <td key={job.id} className="p-3 bg-brand-card align-top">
                      <ul className="space-y-1">
                        {job.prosAndCons.cons.slice(0, 3).map((c, i) => (
                          <li key={i} className="text-gray-300 text-xs flex items-start gap-1.5"><span className="text-red-400 flex-shrink-0">✗</span>{c}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 text-gray-400 text-sm font-semibold align-top">🏢 Top Firms</td>
                  {selected.map(job => (
                    <td key={job.id} className="p-3 bg-brand-card align-top text-gray-300 text-xs">{job.topFirms.slice(0, 4).join(', ')}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Skill overlap */}
          <div className="bg-brand-card border border-white/10 rounded-xl p-6">
            <h2 className="text-white font-bold text-lg mb-1">🎯 Skill Overlap</h2>
            <p className="text-gray-500 text-sm mb-5">How much preparation genuinely transfers if you're weighing these careers against each other.</p>

            {sharedSkills.length > 0 ? (
              <div className="mb-5">
                <p className="text-brand-gold text-xs font-bold uppercase tracking-wider mb-2">Shared across all {selected.length} — build these regardless of which you pick</p>
                <div className="flex flex-wrap gap-2">
                  {sharedSkills.map(skill => (
                    <span key={skill} className="text-sm bg-brand-gold/10 text-brand-gold px-3 py-1.5 rounded-lg border border-brand-gold/20">{skill}</span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-5">No skills are shared across all {selected.length} selected careers — they call for genuinely different preparation.</p>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selected.map((job, i) => (
                <div key={job.id}>
                  <p className="text-white text-sm font-semibold mb-2">{job.title}-specific</p>
                  <div className="flex flex-wrap gap-1.5">
                    {uniqueSkillsByJob[i].length > 0 ? uniqueSkillsByJob[i].map(skill => (
                      <span key={skill} className="text-xs bg-white/5 text-gray-300 px-2.5 py-1 rounded-lg">{skill}</span>
                    )) : <span className="text-gray-600 text-xs">Fully overlaps with the others selected</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-gray-600 text-xs mt-6 text-center">Hours and intensity are typical ranges, not guarantees — they vary significantly by firm, team and market conditions. Use the <Link to="/salary-comparison" className="text-brand-gold hover:underline">Salary Comparison</Link> tool for a full compensation breakdown by level and geography.</p>
        </>
      )}
    </div>
  )
}
