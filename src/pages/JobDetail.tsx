import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { jobs } from '../data/jobs'
import { mustKnow } from '../data/mustKnow'

const categoryColors: Record<string, string> = {
  'Capital Markets': 'bg-blue-500/10 text-blue-400',
  'Alternative Investments': 'bg-purple-500/10 text-purple-400',
  'Advisory': 'bg-green-500/10 text-green-400',
  'Technology & Quant': 'bg-cyan-500/10 text-cyan-400',
  'Asset Management': 'bg-orange-500/10 text-orange-400',
  'Wealth Management': 'bg-pink-500/10 text-pink-400',
  'Risk & Control': 'bg-red-500/10 text-red-400',
  'Corporate Finance': 'bg-yellow-500/10 text-yellow-400',
  'Trading': 'bg-teal-500/10 text-teal-400',
}

const aiColors: Record<string, string> = {
  'Low': 'text-green-400 bg-green-500/10',
  'Medium': 'text-yellow-400 bg-yellow-500/10',
  'High': 'text-orange-400 bg-orange-500/10',
  'Very High': 'text-red-400 bg-red-500/10',
}

const tabs = [
  'Overview', 'Salary', 'Break In', 'Career Path', 'Day in the Life',
  'Interview Prep', 'AI & Future', 'Resources'
]

export default function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState('Overview')
  const [openCalc, setOpenCalc] = useState<number | null>(null)

  const job = jobs.find(j => j.id === id)

  if (!job) return <Navigate to="/jobs" replace />

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/jobs" className="hover:text-brand-gold transition-colors">Careers</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300">{job.title}</span>
      </nav>

      {/* Hero card */}
      <div className="bg-brand-card border border-white/10 rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-wrap items-start gap-3 mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[job.category] || 'bg-gray-500/10 text-gray-400'}`}>
            {job.category}
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${aiColors[job.aiThreatLevel]}`}>
            AI Threat: {job.aiThreatLevel}
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal font-semibold">
            {job.buySellContext.split('.')[0]}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">{job.title}</h1>
        <p className="text-gray-300 text-base leading-relaxed mb-5 max-w-3xl">{job.shortDescription}</p>

        <div className="flex flex-wrap gap-6">
          <div>
            <div className="text-xs text-gray-500 mb-1">Salary Range</div>
            <div className="text-brand-gold font-bold text-lg">{job.salaryRange}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Sub-Roles</div>
            <div className="text-white font-semibold">{job.subRoles.length} specialisations</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Top Firm</div>
            <div className="text-white font-semibold">{job.topFirms[0]}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 mb-8 pb-1 scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? 'bg-brand-gold text-black'
                : 'bg-brand-card border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          {/* Buy/Sell context */}
          <div className="bg-brand-card border border-white/10 rounded-xl p-5">
            <h2 className="text-white font-bold text-lg mb-3">Buy-Side / Sell-Side Context</h2>
            <p className="text-gray-300 leading-relaxed">{job.buySellContext}</p>
          </div>

          {/* Key things to know */}
          {mustKnow[job.id] && (
            <div className="bg-brand-card border border-brand-gold/20 rounded-xl p-5">
              <h2 className="text-brand-gold font-bold text-lg mb-1">🔑 Key Things to Know</h2>
              <p className="text-gray-500 text-xs mb-4">The concepts, realities and insider knowledge you need before pursuing this career.</p>
              <div className="space-y-3">
                {mustKnow[job.id].map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-brand-gold font-black text-sm flex-shrink-0 mt-0.5">{i + 1}.</span>
                      <div>
                        <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{item.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-roles */}
          <div className="bg-brand-card border border-white/10 rounded-xl p-5">
            <h2 className="text-white font-bold text-lg mb-3">Sub-Roles & Specialisations</h2>
            <div className="flex flex-wrap gap-2">
              {job.subRoles.map(role => (
                <span key={role} className="bg-white/5 border border-white/10 text-gray-300 text-sm px-3 py-1.5 rounded-lg">
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Top firms */}
          <div className="bg-brand-card border border-white/10 rounded-xl p-5">
            <h2 className="text-white font-bold text-lg mb-3">Top Firms</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {job.topFirms.map((firm, i) => (
                <div key={firm} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-brand-gold text-xs font-bold">#{i + 1}</span>
                  <span className="text-gray-300 text-sm">{firm}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pros and cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5">
              <h2 className="text-green-400 font-bold text-lg mb-3">Pros</h2>
              <ul className="space-y-2">
                {job.prosAndCons.pros.map(pro => (
                  <li key={pro} className="flex items-start gap-2 text-gray-300 text-sm">
                    <span className="text-green-400 mt-0.5">✓</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
              <h2 className="text-red-400 font-bold text-lg mb-3">Cons</h2>
              <ul className="space-y-2">
                {job.prosAndCons.cons.map(con => (
                  <li key={con} className="flex items-start gap-2 text-gray-300 text-sm">
                    <span className="text-red-400 mt-0.5">✗</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Exit opportunities */}
          <div className="bg-brand-card border border-white/10 rounded-xl p-5">
            <h2 className="text-white font-bold text-lg mb-3">Exit Opportunities</h2>
            <div className="flex flex-wrap gap-2">
              {job.exitOpportunities.map(exit => (
                <span key={exit} className="bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-sm px-3 py-1.5 rounded-lg">
                  {exit}
                </span>
              ))}
            </div>
          </div>

          {/* Skills to master */}
          <div className="bg-brand-card border border-white/10 rounded-xl p-5">
            <h2 className="text-white font-bold text-lg mb-3">Skills to Master</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {job.skillsToMaster.map(skill => (
                <div key={skill} className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="w-1.5 h-1.5 bg-brand-gold rounded-full flex-shrink-0"></span>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Salary' && (
        <div className="space-y-6">
          <div className="bg-brand-card border border-white/10 rounded-xl p-5">
            <h2 className="text-white font-bold text-lg mb-2">Total Salary Range</h2>
            <div className="text-3xl font-black text-brand-gold mb-1">{job.salaryRange}</div>
            <p className="text-gray-500 text-sm">All figures in GBP. Includes base salary and typical bonus/variable compensation.</p>
          </div>

          <div className="space-y-4">
            {job.salaryLadder.map((level, i) => (
              <div key={level.level} className="bg-brand-card border border-white/10 rounded-xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold text-sm font-bold">
                      {i + 1}
                    </div>
                    <h3 className="text-white font-bold">{level.level}</h3>
                  </div>
                  <span className="text-brand-teal font-bold text-sm">{level.salary}</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed pl-11">{level.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Break In' && (
        <div className="space-y-6">
          <div className="bg-brand-card border border-white/10 rounded-xl p-5">
            <h2 className="text-white font-bold text-lg mb-4">Break-In Roadmap</h2>
            <div className="space-y-4">
              {job.breakInRoadmap.map((step, i) => (
                <div key={step.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-gold text-black font-bold text-sm flex items-center justify-center">
                    {step.step}
                  </div>
                  <div className="pt-0.5">
                    <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                    {i < job.breakInRoadmap.length - 1 && (
                      <div className="w-0.5 h-4 bg-brand-gold/20 ml-[-12px] mt-2 ml-3.5"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Career Path' && (
        <div className="space-y-4">
          {job.careerPath.map((level, i) => (
            <div key={level.level} className="relative">
              <div className="bg-brand-card border border-white/10 rounded-xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-white font-bold text-base">{level.level}</h3>
                  <span className="text-brand-gold text-xs font-semibold bg-brand-gold/10 px-2.5 py-1 rounded-full">
                    Years {level.years}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{level.description}</p>
              </div>
              {i < job.careerPath.length - 1 && (
                <div className="flex justify-center my-1">
                  <span className="text-brand-gold/40 text-lg">↓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Day in the Life' && (
        <div className="bg-brand-card border border-white/10 rounded-xl p-5">
          <h2 className="text-white font-bold text-lg mb-4">A Typical Day as a {job.title} Professional</h2>
          <div className="space-y-4">
            {job.dayInTheLife.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-16 text-right">
                  <span className="text-brand-gold text-sm font-mono font-bold">{item.time}</span>
                </div>
                <div className="flex-1 relative pl-4 border-l border-white/10">
                  <div className="absolute left-0 top-2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-gold"></div>
                  <p className="text-gray-300 text-sm leading-relaxed pt-0.5">{item.activity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Interview Prep' && (
        <div className="space-y-6">
          {/* Technical questions */}
          <div className="bg-brand-card border border-white/10 rounded-xl p-5">
            <h2 className="text-white font-bold text-lg mb-4">Technical Questions</h2>
            <div className="space-y-2">
              {job.technicalQuestions.map((q, i) => (
                <div key={i} className="flex gap-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-brand-gold font-bold text-sm flex-shrink-0">Q{i + 1}</span>
                  <p className="text-gray-300 text-sm">{q}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Behavioural questions */}
          <div className="bg-brand-card border border-white/10 rounded-xl p-5">
            <h2 className="text-white font-bold text-lg mb-4">Behavioural Questions</h2>
            <div className="space-y-2">
              {job.behaviouralQuestions.map((q, i) => (
                <div key={i} className="flex gap-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-brand-teal font-bold text-sm flex-shrink-0">B{i + 1}</span>
                  <p className="text-gray-300 text-sm">{q}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Calculation walkthroughs */}
          {job.calculationWalkthroughs.length > 0 && (
            <div className="bg-brand-card border border-white/10 rounded-xl p-5">
              <h2 className="text-white font-bold text-lg mb-4">Calculation Walkthroughs</h2>
              <div className="space-y-3">
                {job.calculationWalkthroughs.map((calc, i) => (
                  <div key={i} className="border border-white/10 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setOpenCalc(openCalc === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="text-white font-semibold text-sm">{calc.title}</span>
                      <span className="text-brand-gold text-sm">{openCalc === i ? '−' : '+'}</span>
                    </button>
                    {openCalc === i && (
                      <div className="border-t border-white/10 p-4 bg-white/5">
                        <ol className="space-y-2">
                          {calc.steps.map((step, j) => (
                            <li key={j} className="text-gray-300 text-sm leading-relaxed font-mono text-xs bg-black/20 rounded p-2">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'AI & Future' && (
        <div className="space-y-6">
          {/* Threat level */}
          <div className={`border rounded-xl p-5 ${aiColors[job.aiThreatLevel].includes('red') ? 'bg-red-500/5 border-red-500/20' : aiColors[job.aiThreatLevel].includes('orange') ? 'bg-orange-500/5 border-orange-500/20' : aiColors[job.aiThreatLevel].includes('yellow') ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-2xl font-black ${aiColors[job.aiThreatLevel].split(' ')[0]}`}>{job.aiThreatLevel}</span>
              <span className="text-gray-400 text-sm">AI Disruption Threat Level</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{job.aiThreatAnalysis}</p>
          </div>

          {/* AI skills to learn */}
          <div className="bg-brand-card border border-white/10 rounded-xl p-5">
            <h2 className="text-white font-bold text-lg mb-4">AI Skills to Learn Now</h2>
            <div className="space-y-2">
              {job.aiSkillsToLearn.map((skill, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-brand-teal text-sm">→</span>
                  <span className="text-gray-300 text-sm">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Resources' && (
        <div className="space-y-6">
          <div className="bg-brand-card border border-white/10 rounded-xl p-5">
            <h2 className="text-white font-bold text-lg mb-4">YouTube Resources</h2>
            <div className="space-y-3">
              {job.youtubeResources.map((resource, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 bg-red-500/20 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-red-400 text-xs font-bold">▶</span>
                  </div>
                  <div>
                    <p className="text-gray-200 text-sm font-medium">{resource.title}</p>
                    <p className="text-gray-500 text-xs">{resource.channel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation between jobs */}
      <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-between">
        <Link to="/jobs" className="text-gray-400 hover:text-brand-gold text-sm transition-colors">
          ← Back to all careers
        </Link>
        <Link
          to="/quiz"
          className="px-5 py-2.5 bg-brand-gold text-black font-bold text-sm rounded-xl hover:bg-brand-gold2 transition-colors"
        >
          Take Career Quiz
        </Link>
      </div>
    </div>
  )
}
