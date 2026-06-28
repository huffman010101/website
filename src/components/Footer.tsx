import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-brand-darker border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-black text-brand-gold">FIN<span className="text-brand-teal">dr</span></Link>
            <p className="mt-3 text-gray-400 text-sm leading-relaxed">
              Discover your perfect career in finance. Explore roles, take the quiz, and get AI-powered advice.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Platform</h3>
            <ul className="space-y-2">
              {[
                { to: '/jobs', label: 'Explore Careers' },
                { to: '/quiz', label: 'Career Quiz' },
                { to: '/advisor', label: 'AI Advisor' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-brand-gold text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Careers */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Top Careers</h3>
            <ul className="space-y-2">
              {[
                { id: 'investment-banking', label: 'Investment Banking' },
                { id: 'private-equity', label: 'Private Equity' },
                { id: 'hedge-fund', label: 'Hedge Funds' },
                { id: 'quantitative-finance', label: 'Quant Finance' },
                { id: 'venture-capital', label: 'Venture Capital' },
              ].map(career => (
                <li key={career.id}>
                  <Link to={`/jobs/${career.id}`} className="text-gray-400 hover:text-brand-gold text-sm transition-colors">
                    {career.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Founders */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Built by</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold text-sm">R</div>
                <div>
                  <a
                    href="https://www.linkedin.com/in/roykers/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-brand-gold text-sm font-medium transition-colors"
                  >
                    Roy Kers
                  </a>
                  <p className="text-gray-500 text-xs">Co-founder</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal font-bold text-sm">R</div>
                <div>
                  <a
                    href="https://www.linkedin.com/in/raichana/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-brand-gold text-sm font-medium transition-colors"
                  >
                    Rai Chana
                  </a>
                  <p className="text-gray-500 text-xs">Co-founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2025 FINdr. Helping the next generation find their path in finance.</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>13 Careers</span>
            <span>•</span>
            <span>100+ Firms</span>
            <span>•</span>
            <span>UK Focused</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
