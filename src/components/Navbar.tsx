import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/', label: 'Home' },
    { to: '/jobs', label: 'Careers' },
    { to: '/quiz', label: 'Quiz' },
    { to: '/advisor', label: 'AI Advisor' },
  ]

  return (
    <nav className="bg-brand-darker border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-brand-gold tracking-tight">FIN<span className="text-brand-teal">dr</span></span>
            <span className="hidden sm:block text-xs text-gray-500 font-medium mt-1">Finance Discovery</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'bg-brand-gold/10 text-brand-gold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/quiz"
              className="ml-3 px-4 py-2 bg-brand-gold text-black text-sm font-bold rounded-lg hover:bg-brand-gold2 transition-colors"
            >
              Take the Quiz
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5"
          >
            <span className="sr-only">Menu</span>
            <div className="w-5 h-0.5 bg-current mb-1 transition-all"></div>
            <div className="w-5 h-0.5 bg-current mb-1"></div>
            <div className="w-5 h-0.5 bg-current transition-all"></div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-white/10">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 text-sm font-medium rounded-lg mb-1 ${
                  location.pathname === link.to
                    ? 'bg-brand-gold/10 text-brand-gold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
