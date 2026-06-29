import { Link, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

type DropdownItem = { to: string; label: string; description: string }

type NavItem = {
  label: string
  to?: string
  dropdown?: DropdownItem[]
}

const navItems: NavItem[] = [
  {
    label: 'Careers',
    dropdown: [
      { to: '/jobs', label: 'All Careers', description: 'Browse all 23 finance careers' },
      { to: '/salary-comparison', label: 'Salary Comparison', description: 'Compare pay across roles' },
      { to: '/interview-quiz', label: 'Interview Quiz', description: 'Practice real interview questions' },
    ],
  },
  {
    label: 'Tools',
    dropdown: [
      { to: '/quiz', label: 'Career Quiz', description: 'Find your perfect finance career' },
      { to: '/cv-reviewer', label: 'CV & Cover Letter', description: 'AI-powered application review' },
      { to: '/advisor', label: 'AI Advisor', description: 'Personalised career guidance' },
    ],
  },
  {
    label: 'Learn',
    dropdown: [
      { to: '/networking', label: 'Networking Guide', description: 'Cold emails, coffee chat scripts' },
      { to: '/resources', label: 'Resources', description: 'Books, qualifications, glossary' },
    ],
  },
]

function Dropdown({ items, onClose }: { items: DropdownItem[]; onClose: () => void }) {
  return (
    <div className="absolute top-full left-0 mt-1 w-64 bg-brand-darker border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
      {items.map(item => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onClose}
          className="flex flex-col px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
        >
          <span className="text-white text-sm font-semibold">{item.label}</span>
          <span className="text-gray-500 text-xs mt-0.5">{item.description}</span>
        </Link>
      ))}
    </div>
  )
}

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    setOpenDropdown(null)
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <nav className="bg-brand-darker border-b border-white/10 sticky top-0 z-50" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl font-black text-brand-gold tracking-tight">FIN<span className="text-brand-teal">dr</span></span>
            <span className="hidden sm:block text-xs text-gray-500 font-medium mt-1">Finance Discovery</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <div key={item.label} className="relative">
                {item.dropdown ? (
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                      openDropdown === item.label
                        ? 'bg-brand-gold/10 text-brand-gold'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                    <svg className={`w-3 h-3 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    to={item.to!}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.to
                        ? 'bg-brand-gold/10 text-brand-gold'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
                {item.dropdown && openDropdown === item.label && (
                  <Dropdown items={item.dropdown} onClose={() => setOpenDropdown(null)} />
                )}
              </div>
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
            <div className="w-5 h-0.5 bg-current mb-1"></div>
            <div className="w-5 h-0.5 bg-current mb-1"></div>
            <div className="w-5 h-0.5 bg-current"></div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-white/10 max-h-96 overflow-y-auto">
            {navItems.map(item => (
              <div key={item.label}>
                {item.dropdown ? (
                  <div>
                    <div className="px-4 py-2 text-xs text-gray-600 font-semibold uppercase tracking-wider">{item.label}</div>
                    {item.dropdown.map(sub => (
                      <Link
                        key={sub.to}
                        to={sub.to}
                        onClick={() => setMenuOpen(false)}
                        className="block px-6 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg mb-0.5"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    to={item.to!}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium rounded-lg mb-1 text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="px-4 pt-3 border-t border-white/5 mt-2">
              <Link
                to="/quiz"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 bg-brand-gold text-black text-sm font-bold rounded-lg text-center hover:bg-brand-gold2 transition-colors"
              >
                Take the Career Quiz
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
