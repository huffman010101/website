import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  'How do I break into investment banking from a non-target university?',
  'What is the difference between private equity and venture capital?',
  'Should I do the CFA or an MBA for asset management?',
  'How competitive is the hedge fund analyst recruitment process?',
  'What Python skills do I need for a quant finance role?',
  'Which finance career has the best work-life balance?',
]

const mockResponses: Record<string, string> = {
  default: "That's a great question! Based on my knowledge of the finance industry, I can help you think through this. The finance sector is highly competitive, but the right preparation makes all the difference. I'd recommend exploring the detailed career profiles on FINdr to complement our conversation — each profile includes break-in roadmaps, salary data, and interview preparation materials.",

  'investment banking': "Investment banking is one of the most competitive entry points in finance, but it's very achievable with the right strategy. The key steps are: (1) Target a spring week in your second year — these are the primary pipelines to summer internships. (2) Network aggressively on LinkedIn and at finance society events. (3) Master financial modelling — DCF, LBO, and M&A models are tested in interviews. (4) Practice behavioural questions using the STAR framework. Most analysts at bulge brackets come from Russell Group universities, but boutiques and mid-market banks are much more accessible from non-target schools. Your internship experience and technical skills matter more than your university brand at smaller firms.",

  'private equity': "Private equity is typically entered after 2 years in investment banking (M&A or Leveraged Finance groups). The PE recruitment process (run by headhunters like CPI, Oxbridge Capital, and Blackwood) begins very early — often just 6 months into your IB analyst role. You'll need to master LBO modelling cold — most first-round interviews include a timed LBO test. The key differentiator for PE associate roles is your deal experience from banking, so try to work on M&A transactions in your analyst years. Check the Private Equity career profile on FINdr for a detailed break-in roadmap and example IC memo questions.",

  'cfa': "The CFA is the gold standard credential for investment management, equity research, and portfolio management roles. It consists of three levels (Level 1, 2, and 3) and typically takes 4–5 years to complete all three. For asset management roles, a CFA charterholder designation is often a prerequisite or strong differentiator. For investment banking, an MBA from a target school (London Business School, INSEAD, Wharton) is more valued for career pivots. If your goal is long-only asset management, equity research, or becoming a portfolio manager, I'd prioritise the CFA. If you want to break into PE or IB from a non-finance background, consider an MBA instead.",

  'hedge fund': "Hedge fund recruitment is one of the most competitive and opaque processes in finance. The most common entry paths are: (1) 2–4 years in sell-side equity research — you'll have sector expertise and stock pitch experience. (2) Investment banking (M&A) — strong modelling skills. (3) For quant/systematic funds: directly from PhD programmes in Mathematics, Physics, or Computer Science. The most important thing for any hedge fund interview is having 2–3 well-developed, contrarian stock investment ideas. These should have a clear thesis, a variant perception (why you think differently from consensus), a catalyst, and a price target. Start developing and tracking investment ideas now — even if you're still a student.",

  'python': "Python is becoming essential across quantitative finance, risk management, FP&A, and increasingly equity research. For a quant finance role, you'll need: NumPy and Pandas for data manipulation, Scikit-learn for machine learning models, Matplotlib/Seaborn for visualisation, and ideally some exposure to time series analysis and backtesting frameworks like Backtrader or Zipline. For non-quant roles, Python for automation and data analysis (pulling financial data from APIs, building dashboards) is a strong differentiator. Start with free resources on Kaggle, DataCamp's finance courses, or the QuantEcon textbook. Having 2–3 quantitative projects on GitHub (e.g., a backtested trading strategy, an option pricing tool) dramatically improves your candidacy.",

  'work-life balance': "Work-life balance varies enormously across finance careers. Here's a rough ranking from best to worst: (1) Actuarial Science and Risk Management — typically 9-6 with rare weekend work. (2) FP&A / Corporate Finance — good balance except at month/quarter end. (3) Portfolio Management / Asset Management — reasonable hours, early mornings but rarely past 7pm. (4) Financial Advisory — flexible, especially once you have your own client book. (5) Equity Research — longer hours, especially during earnings seasons. (6) Consulting — heavy travel but often home on weekends. (7) Private Equity — intense around deal processes but less consistently brutal than IB. (8) Investment Banking — the worst. 80–100+ hour weeks are common for analysts. If work-life balance is your top priority, actuarial science or FP&A at a well-run corporate are probably your best bets — check those profiles on FINdr for more detail.",
}

function getMockResponse(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('investment bank') || lower.includes('non-target') || lower.includes('spring week')) {
    return mockResponses['investment banking']
  }
  if (lower.includes('private equity') || lower.includes('lbo') || lower.includes('buyout')) {
    return mockResponses['private equity']
  }
  if (lower.includes('cfa') || lower.includes('mba') || lower.includes('asset management') || lower.includes('charterholder')) {
    return mockResponses['cfa']
  }
  if (lower.includes('hedge fund') || lower.includes('stock pitch') || lower.includes('long/short')) {
    return mockResponses['hedge fund']
  }
  if (lower.includes('python') || lower.includes('quant') || lower.includes('coding') || lower.includes('programming')) {
    return mockResponses['python']
  }
  if (lower.includes('work-life') || lower.includes('work life') || lower.includes('balance') || lower.includes('hours')) {
    return mockResponses['work-life balance']
  }
  return mockResponses['default']
}

export default function Advisor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm your FINdr AI Career Advisor. I can help you explore finance careers, understand break-in strategies, compare roles, and prepare for interviews. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800))

    const response = getMockResponse(text)
    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    }

    setIsTyping(false)
    setMessages(prev => [...prev, assistantMessage])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleSuggestion = (question: string) => {
    sendMessage(question)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-brand-teal/10 border border-brand-teal/20 rounded-full px-4 py-1.5 mb-4">
          <span className="w-2 h-2 bg-brand-teal rounded-full animate-pulse"></span>
          <span className="text-brand-teal text-sm font-medium">AI Advisor — Demo Mode</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
          AI Career <span className="text-gradient-teal">Advisor</span>
        </h1>
        <p className="text-gray-400 text-sm">Ask me anything about finance careers, break-in strategies, and interview preparation.</p>
      </div>

      {/* Chat container */}
      <div className="bg-brand-card border border-white/10 rounded-2xl overflow-hidden flex flex-col" style={{ height: '520px' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                message.role === 'assistant'
                  ? 'bg-brand-teal/20 text-brand-teal'
                  : 'bg-brand-gold/20 text-brand-gold'
              }`}>
                {message.role === 'assistant' ? 'AI' : 'You'}
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'assistant'
                  ? 'bg-white/5 border border-white/10 text-gray-200'
                  : 'bg-brand-gold/10 border border-brand-gold/20 text-white'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center text-xs font-bold text-brand-teal">
                AI
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  <div className="w-2 h-2 bg-brand-teal/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-brand-teal/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-brand-teal/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/10 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about any finance career..."
              disabled={isTyping}
              className="flex-1 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-teal/50 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-5 py-2.5 bg-brand-teal text-white font-bold text-sm rounded-xl hover:bg-brand-teal2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Suggested questions */}
      <div className="mt-6">
        <p className="text-gray-500 text-xs mb-3 font-medium">SUGGESTED QUESTIONS</p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map(q => (
            <button
              key={q}
              onClick={() => handleSuggestion(q)}
              disabled={isTyping}
              className="text-xs bg-white/5 border border-white/10 text-gray-400 px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-gray-600 text-xs mt-6">
        This is a demo AI advisor with pre-programmed responses. For the full AI experience, explore our career profiles.{' '}
        <Link to="/jobs" className="text-brand-gold hover:underline">Browse careers →</Link>
      </p>
    </div>
  )
}
