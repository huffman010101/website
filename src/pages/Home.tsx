import { Link } from 'react-router-dom'
import { jobs } from '../data/jobs'

const features = [
  {
    icon: '🗂️',
    title: '13 Finance Careers',
    description: 'In-depth profiles covering investment banking, private equity, hedge funds, quant finance, and 9 more career paths — all in one place.',
  },
  {
    icon: '🎯',
    title: 'Personality-Matched Quiz',
    description: 'Our 13-question quiz maps your skills, lifestyle preferences, and goals to the finance career that suits you best.',
  },
  {
    icon: '🤖',
    title: 'AI Career Advisor',
    description: 'Chat with our AI advisor to get personalised guidance on breaking in, preparing for interviews, and navigating your career path.',
  },
]

const stats = [
  { value: '13', label: 'Finance Careers' },
  { value: '100+', label: 'Top Firms Covered' },
  { value: '£0', label: 'Cost to You' },
  { value: '∞', label: 'Career Potential' },
]

const categoryColors: Record<string, string> = {
  'Capital Markets': 'bg-blue-500/10 text-blue-400',
  'Alternative Investments': 'bg-purple-500/10 text-purple-400',
  'Advisory': 'bg-green-500/10 text-green-400',
  'Technology & Quant': 'bg-cyan-500/10 text-cyan-400',
  'Asset Management': 'bg-orange-500/10 text-orange-400',
  'Wealth Management': 'bg-pink-500/10 text-pink-400',
  'Risk & Control': 'bg-red-500/10 text-red-400',
  'Corporate Finance': 'bg-yellow-500/10 text-yellow-400',
}

export default function Home() {
  const featuredJobs = jobs.slice(0, 6)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-teal/5" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></span>
            <span className="text-brand-gold text-sm font-medium">UK Finance Career Discovery Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Find your perfect
            <br />
            <span className="text-gradient-gold">finance career</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Explore 13 in-depth finance career profiles, take our personality quiz, and get AI-powered guidance — all built for ambitious students and graduates in the UK.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/quiz"
              className="w-full sm:w-auto px-8 py-4 bg-brand-gold text-black font-bold text-lg rounded-xl hover:bg-brand-gold2 transition-all duration-200 hover:scale-105 shadow-lg shadow-brand-gold/20"
            >
              Take the Career Quiz
            </Link>
            <Link
              to="/jobs"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold text-lg rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              Explore Careers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-brand-card border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-brand-gold">{stat.value}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Everything you need to break into finance</h2>
          <p className="text-gray-400 max-w-xl mx-auto">FINdr gives you the insider knowledge that used to cost thousands in courses and coaching.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(feature => (
            <div key={feature.title} className="bg-brand-card border border-white/10 rounded-2xl p-6 hover:border-brand-gold/30 transition-all duration-300 card-glow">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured careers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Featured Careers</h2>
            <p className="text-gray-400 text-sm mt-1">Click any career to explore salary data, break-in roadmaps, and more</p>
          </div>
          <Link to="/jobs" className="text-brand-gold hover:text-brand-gold2 text-sm font-medium transition-colors">
            View all 13 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredJobs.map(job => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="bg-brand-card border border-white/10 rounded-xl p-5 hover:border-brand-gold/30 hover:bg-brand-card2 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[job.category] || 'bg-gray-500/10 text-gray-400'}`}>
                  {job.category}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  job.aiThreatLevel === 'Very High' ? 'bg-red-500/20 text-red-400' :
                  job.aiThreatLevel === 'High' ? 'bg-orange-500/20 text-orange-400' :
                  job.aiThreatLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  AI: {job.aiThreatLevel}
                </span>
              </div>
              <h3 className="text-white font-bold text-base mb-2 group-hover:text-brand-gold transition-colors">{job.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">{job.shortDescription}</p>
              <div className="text-brand-teal text-xs font-semibold">{job.salaryRange}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-brand-gold/10 to-brand-teal/10 border-y border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Not sure which career is right for you?</h2>
          <p className="text-gray-400 mb-8">Our 13-question quiz matches your personality and goals to the finance careers that suit you best.</p>
          <Link
            to="/quiz"
            className="inline-block px-10 py-4 bg-brand-gold text-black font-bold text-lg rounded-xl hover:bg-brand-gold2 transition-all duration-200 hover:scale-105 shadow-lg shadow-brand-gold/20"
          >
            Discover My Career Match
          </Link>
        </div>
      </section>
    </div>
  )
}
