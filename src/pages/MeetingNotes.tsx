import { useState, useEffect, useRef } from 'react'

type MeetingType = 'interview' | 'coffee-chat' | 'networking' | 'mentorship' | 'client' | 'deal' | 'other'

type Meeting = {
  id: string
  title: string
  type: MeetingType
  company: string
  contactName: string
  contactRole: string
  date: string
  duration: number
  rawNotes: string
  enhancedNotes: EnhancedNotes | null
  status: 'upcoming' | 'in-progress' | 'completed'
}

type EnhancedNotes = {
  summary: string
  keyPoints: string[]
  actionItems: string[]
  followUp: string
  sentiment: 'positive' | 'neutral' | 'mixed' | 'negative'
  nextSteps: string
}

const STORAGE_KEY = 'findr_meetings'

const meetingTypeConfig: Record<MeetingType, { label: string; color: string; icon: string; promptHints: string[] }> = {
  interview: {
    label: 'Interview',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    icon: '🎯',
    promptHints: ['Which questions did they ask?', 'How did technical questions go?', 'What did they say about next steps?'],
  },
  'coffee-chat': {
    label: 'Coffee Chat',
    color: 'text-brand-gold bg-brand-gold/10 border-brand-gold/20',
    icon: '☕',
    promptHints: ['What did they share about their career path?', 'Any advice they gave you?', 'Did they offer to introduce you to anyone?'],
  },
  networking: {
    label: 'Networking',
    color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    icon: '🤝',
    promptHints: ['Where did you meet them?', 'What did you discuss?', 'Any referrals or introductions offered?'],
  },
  mentorship: {
    label: 'Mentorship',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    icon: '🎓',
    promptHints: ['What advice did your mentor give?', 'Goals discussed?', 'What to work on before next session?'],
  },
  client: {
    label: 'Client Meeting',
    color: 'text-green-400 bg-green-500/10 border-green-500/20',
    icon: '💼',
    promptHints: ['Client concerns raised?', 'Decisions made?', 'What deliverables were agreed?'],
  },
  deal: {
    label: 'Deal / Transaction',
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    icon: '📊',
    promptHints: ['Deal structure discussed?', 'Key issues outstanding?', 'Timeline and next milestones?'],
  },
  other: {
    label: 'Other',
    color: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
    icon: '📝',
    promptHints: ['What was the main topic?', 'What was decided?', 'Any follow-ups needed?'],
  },
}

function generateEnhancedNotes(meeting: Meeting): EnhancedNotes {
  const raw = meeting.rawNotes.toLowerCase()
  const lines = meeting.rawNotes.split('\n').filter(l => l.trim())

  // Extract action items — lines with action indicators
  const actionPatterns = /follow up|send|email|connect|apply|prepare|research|review|schedule|book|call|reach out|next step|action|todo|need to|should|will|must|by (monday|tuesday|wednesday|thursday|friday|next week)/i
  const actionItems = lines.filter(l => actionPatterns.test(l)).map(l => l.trim().replace(/^[-•*]\s*/, ''))

  // Detect sentiment
  const positiveWords = ['great', 'excellent', 'amazing', 'good', 'well', 'positive', 'excited', 'interested', 'loved', 'enjoyed', 'went well', 'strong', 'impressed', 'offer', 'next round', 'pass']
  const negativeWords = ['rejected', 'no offer', 'failed', 'bad', 'poor', 'difficult', 'awkward', 'nervous', 'struggled', 'didn\'t', 'did not', 'wrong', 'missed']
  const posCount = positiveWords.filter(w => raw.includes(w)).length
  const negCount = negativeWords.filter(w => raw.includes(w)).length
  const sentiment = negCount > posCount ? 'negative' : posCount > 2 ? 'positive' : posCount > 0 ? 'mixed' : 'neutral'

  // Generate key points — longer, meaningful sentences
  const keyPoints = lines
    .filter(l => l.trim().length > 20 && !actionPatterns.test(l))
    .slice(0, 5)
    .map(l => l.trim().replace(/^[-•*]\s*/, ''))

  // Generate a structured summary based on meeting type
  const typeLabel = meetingTypeConfig[meeting.type].label
  const wordCount = meeting.rawNotes.trim().split(/\s+/).length

  let summary = ''
  if (meeting.type === 'interview') {
    summary = `${typeLabel} with ${meeting.contactName || 'interviewer'} at ${meeting.company || 'the firm'} on ${meeting.date}. `
    summary += raw.includes('technical') ? 'Technical questions were covered. ' : ''
    summary += raw.includes('behavioural') || raw.includes('behavioral') ? 'Behavioural questions were discussed. ' : ''
    summary += sentiment === 'positive' ? 'The conversation felt positive and progressed well.' : sentiment === 'negative' ? 'Some areas need improvement for future rounds.' : 'A solid session with areas to build on.'
  } else if (meeting.type === 'coffee-chat' || meeting.type === 'networking') {
    summary = `${typeLabel} with ${meeting.contactName || 'contact'} from ${meeting.company || 'their firm'} on ${meeting.date}. `
    summary += 'Discussed their career background, industry insights, and advice for breaking in. '
    summary += 'Valuable connection to maintain and follow up with.'
  } else if (meeting.type === 'mentorship') {
    summary = `Mentorship session with ${meeting.contactName || 'mentor'} on ${meeting.date}. `
    summary += 'Goals and progress reviewed. Key guidance received on next steps for career development.'
  } else {
    summary = `${typeLabel} with ${meeting.contactName || 'attendees'} at ${meeting.company || 'the organisation'} on ${meeting.date}. ${wordCount > 50 ? 'Detailed discussion with multiple key outcomes.' : 'Brief meeting covering key agenda items.'}`
  }

  // Next steps based on type
  let nextSteps = ''
  if (meeting.type === 'interview') {
    nextSteps = raw.includes('next round') || raw.includes('second round') ? 'Prepare for next round interview — focus on areas raised today.' : raw.includes('offer') ? 'Await offer details and prepare for negotiation.' : 'Send thank-you email within 24 hours. Follow up in 5–7 days if no response.'
  } else if (meeting.type === 'coffee-chat' || meeting.type === 'networking') {
    nextSteps = 'Send a personalised thank-you email within 24 hours referencing a specific point from the conversation. Connect on LinkedIn.'
  } else if (meeting.type === 'mentorship') {
    nextSteps = 'Complete agreed actions before next session. Update your mentor on progress made.'
  } else {
    nextSteps = 'Follow up on agreed action items. Share meeting notes with relevant parties if appropriate.'
  }

  return {
    summary,
    keyPoints: keyPoints.length > 0 ? keyPoints : ['Key discussion points captured in raw notes below'],
    actionItems: actionItems.length > 0 ? actionItems : ['Review notes and identify follow-up actions'],
    followUp: raw.includes('linkedin') ? 'Connect on LinkedIn' : raw.includes('email') ? 'Send follow-up email' : 'Send thank-you note within 24 hours',
    sentiment,
    nextSteps,
  }
}

function saveMeetings(meetings: Meeting[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings))
}

function loadMeetings(): Meeting[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const sentimentConfig = {
  positive: { label: 'Positive', color: 'text-green-400', bg: 'bg-green-500/10' },
  neutral: { label: 'Neutral', color: 'text-gray-400', bg: 'bg-gray-500/10' },
  mixed: { label: 'Mixed', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  negative: { label: 'Needs Work', color: 'text-red-400', bg: 'bg-red-500/10' },
}

const defaultMeetings: Meeting[] = [
  {
    id: 'demo-1',
    title: 'Goldman Sachs — IBD Superday',
    type: 'interview',
    company: 'Goldman Sachs',
    contactName: 'James Chen & Sarah Mitchell',
    contactRole: 'VP, M&A',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration: 60,
    rawNotes: `Technical round went well - DCF questions straightforward\nAsked about walk me through LBO - covered all steps clearly\nJames asked about why Goldman specifically - mentioned Marcus acquisition analysis\nSarah focused on behavioural - leadership example from investment society\nThey mentioned next steps within 1 week\nNeed to follow up on the deal I mentioned - research it more\nSend thank you email to both interviewers tonight`,
    status: 'completed',
    enhancedNotes: null,
  },
  {
    id: 'demo-2',
    title: 'Coffee Chat — Blackstone Associate',
    type: 'coffee-chat',
    company: 'Blackstone',
    contactName: 'Priya Sharma',
    contactRole: 'Associate, Real Estate PE',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration: 30,
    rawNotes: `Started at RBC in DCM then moved to Blackstone after 2 years\nSaid REPE recruiting is earlier than regular PE - starts in Sept\nAdvised to get ARGUS experience before applying\nOffered to connect me with analyst on her team\nSaid cap rates and debt markets are the most important topics to know\nReach out to her analyst contact - James Wu\nPractice ARGUS Enterprise before applying`,
    status: 'completed',
    enhancedNotes: null,
  },
]

export default function MeetingNotes() {
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const loaded = loadMeetings()
    return loaded.length > 0 ? loaded : defaultMeetings
  })
  const [view, setView] = useState<'list' | 'new' | 'detail'>('list')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [enhancing, setEnhancing] = useState(false)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<MeetingType | 'all'>('all')
  const notesRef = useRef<HTMLTextAreaElement>(null)

  const [form, setForm] = useState<Partial<Meeting>>({
    type: 'interview',
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    rawNotes: '',
    company: '',
    contactName: '',
    contactRole: '',
    title: '',
  })

  useEffect(() => {
    saveMeetings(meetings)
  }, [meetings])

  const selected = meetings.find(m => m.id === selectedId)

  const filtered = meetings.filter(m => {
    if (filterType !== 'all' && m.type !== filterType) return false
    if (search && !m.title.toLowerCase().includes(search.toLowerCase()) && !m.company.toLowerCase().includes(search.toLowerCase()) && !m.contactName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  function handleCreate() {
    const id = `meeting-${Date.now()}`
    const newMeeting: Meeting = {
      id,
      title: form.title || `${meetingTypeConfig[form.type as MeetingType].label} — ${form.company || 'Meeting'}`,
      type: form.type as MeetingType,
      company: form.company || '',
      contactName: form.contactName || '',
      contactRole: form.contactRole || '',
      date: form.date || new Date().toISOString().split('T')[0],
      duration: form.duration || 60,
      rawNotes: form.rawNotes || '',
      enhancedNotes: null,
      status: 'completed',
    }
    setMeetings(prev => [newMeeting, ...prev])
    setSelectedId(id)
    setView('detail')
    setForm({ type: 'interview', date: new Date().toISOString().split('T')[0], duration: 60, rawNotes: '', company: '', contactName: '', contactRole: '', title: '' })
  }

  function handleEnhance(id: string) {
    const meeting = meetings.find(m => m.id === id)
    if (!meeting || !meeting.rawNotes.trim()) return
    setEnhancing(true)
    setTimeout(() => {
      const enhanced = generateEnhancedNotes(meeting)
      setMeetings(prev => prev.map(m => m.id === id ? { ...m, enhancedNotes: enhanced } : m))
      setEnhancing(false)
    }, 1500)
  }

  function handleDelete(id: string) {
    setMeetings(prev => prev.filter(m => m.id !== id))
    setView('list')
    setSelectedId(null)
  }

  function updateRawNotes(id: string, notes: string) {
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, rawNotes: notes, enhancedNotes: null } : m))
  }

  const typeEntries = Object.entries(meetingTypeConfig) as [MeetingType, typeof meetingTypeConfig[MeetingType]][]

  // LIST VIEW
  if (view === 'list') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-1">Meeting Notes</h1>
            <p className="text-gray-400 text-sm">Jot rough notes during any meeting — AI turns them into structured summaries, action items, and follow-ups. Inspired by Granola.</p>
          </div>
          <button
            onClick={() => setView('new')}
            className="px-5 py-3 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors flex-shrink-0"
          >
            + New Meeting
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Meetings', value: meetings.length },
            { label: 'Interviews', value: meetings.filter(m => m.type === 'interview').length },
            { label: 'Coffee Chats', value: meetings.filter(m => m.type === 'coffee-chat').length },
            { label: 'With AI Notes', value: meetings.filter(m => m.enhancedNotes).length },
          ].map((stat, i) => (
            <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-brand-gold">{stat.value}</div>
              <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search meetings..."
            className="flex-1 bg-brand-card border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold text-sm"
          />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${filterType === 'all' ? 'bg-brand-gold text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              All
            </button>
            {typeEntries.map(([type, cfg]) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${filterType === type ? 'bg-brand-gold text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                {cfg.icon} {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Meeting list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <div className="text-4xl mb-3">📝</div>
            <p className="font-semibold text-gray-400">No meetings yet</p>
            <p className="text-sm mt-1">Create your first meeting note to get started</p>
            <button onClick={() => setView('new')} className="mt-4 px-5 py-2.5 bg-brand-gold text-black font-bold rounded-xl text-sm hover:bg-brand-gold2 transition-colors">
              + New Meeting
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(meeting => {
              const cfg = meetingTypeConfig[meeting.type]
              const sentCfg = meeting.enhancedNotes ? sentimentConfig[meeting.enhancedNotes.sentiment] : null
              return (
                <button
                  key={meeting.id}
                  onClick={() => { setSelectedId(meeting.id); setView('detail') }}
                  className="w-full text-left bg-brand-card border border-white/10 rounded-xl p-5 hover:border-brand-gold/30 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">{cfg.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-white font-semibold group-hover:text-brand-gold transition-colors">{meeting.title}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.label}</span>
                          {sentCfg && (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sentCfg.bg} ${sentCfg.color}`}>{sentCfg.label}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          {meeting.contactName && <span>{meeting.contactName}</span>}
                          {meeting.company && <span className="text-gray-600">· {meeting.company}</span>}
                          <span className="text-gray-600">· {new Date(meeting.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        {meeting.rawNotes && (
                          <p className="text-gray-600 text-xs mt-1.5 truncate">{meeting.rawNotes.split('\n')[0]}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs text-gray-600">{meeting.duration}min</div>
                      {meeting.enhancedNotes ? (
                        <div className="text-xs text-brand-teal mt-1">✓ AI Notes</div>
                      ) : (
                        <div className="text-xs text-gray-600 mt-1">Raw notes</div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // NEW MEETING FORM
  if (view === 'new') {
    const selectedType = (form.type || 'interview') as MeetingType
    const typeCfg = meetingTypeConfig[selectedType]

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setView('list')} className="text-sm text-gray-500 hover:text-brand-gold transition-colors">← Back</button>
          <h1 className="text-3xl font-black text-white">New Meeting</h1>
        </div>

        <div className="space-y-6">
          {/* Meeting type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Meeting Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {typeEntries.map(([type, cfg]) => (
                <button
                  key={type}
                  onClick={() => setForm(f => ({ ...f, type }))}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2 ${
                    form.type === type ? `${cfg.color} border-current` : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <span>{cfg.icon}</span> {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Details grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Meeting Title</label>
              <input
                type="text"
                value={form.title || ''}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder={`e.g. Goldman Sachs First Round`}
                className="w-full bg-brand-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company / Organisation</label>
              <input
                type="text"
                value={form.company || ''}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                placeholder="e.g. Goldman Sachs"
                className="w-full bg-brand-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Contact Name</label>
              <input
                type="text"
                value={form.contactName || ''}
                onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
                placeholder="e.g. James Chen"
                className="w-full bg-brand-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Their Role</label>
              <input
                type="text"
                value={form.contactRole || ''}
                onChange={e => setForm(f => ({ ...f, contactRole: e.target.value }))}
                placeholder="e.g. VP, M&A"
                className="w-full bg-brand-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <input
                type="date"
                value={form.date || ''}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full bg-brand-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes)</label>
              <select
                value={form.duration || 60}
                onChange={e => setForm(f => ({ ...f, duration: +e.target.value }))}
                className="w-full bg-brand-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold text-sm"
              >
                {[15, 20, 30, 45, 60, 90, 120].map(d => <option key={d} value={d}>{d} minutes</option>)}
              </select>
            </div>
          </div>

          {/* Raw notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Your Notes</label>
            <div className="bg-brand-darker border border-white/5 rounded-xl p-3 mb-2 flex flex-wrap gap-2">
              {typeCfg.promptHints.map((hint, i) => (
                <span key={i} className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-lg">{hint}</span>
              ))}
            </div>
            <textarea
              ref={notesRef}
              value={form.rawNotes || ''}
              onChange={e => setForm(f => ({ ...f, rawNotes: e.target.value }))}
              placeholder={`Jot anything — bullet points, fragments, key phrases. AI will structure it after.\n\nExamples:\n• asked about DCF\n• felt nervous on the LBO question\n• she mentioned next steps in 1 week\n• follow up with thank you email`}
              rows={10}
              className="w-full bg-brand-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold resize-none font-mono text-sm leading-relaxed"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              className="flex-1 py-4 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors"
            >
              Save Meeting Notes
            </button>
            <button
              onClick={() => setView('list')}
              className="px-6 py-4 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // DETAIL VIEW
  if (view === 'detail' && selected) {
    const cfg = meetingTypeConfig[selected.type]

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <button onClick={() => setView('list')} className="text-sm text-gray-500 hover:text-brand-gold transition-colors mb-3 block">← Back to meetings</button>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-2xl">{cfg.icon}</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{selected.title}</h1>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${cfg.color}`}>{cfg.label}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              {selected.contactName && <span>{selected.contactName}</span>}
              {selected.contactRole && <span className="text-gray-600">· {selected.contactRole}</span>}
              {selected.company && <span className="text-gray-600">· {selected.company}</span>}
              <span>· {new Date(selected.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span>· {selected.duration}min</span>
            </div>
          </div>
          <button
            onClick={() => handleDelete(selected.id)}
            className="text-gray-600 hover:text-red-400 transition-colors text-sm flex-shrink-0"
          >
            Delete
          </button>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: raw notes */}
          <div className="lg:col-span-2">
            <div className="bg-brand-card border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold text-sm">Raw Notes</h3>
                <span className="text-xs text-gray-600">{selected.rawNotes.trim().split(/\s+/).filter(Boolean).length} words</span>
              </div>
              <textarea
                value={selected.rawNotes}
                onChange={e => updateRawNotes(selected.id, e.target.value)}
                placeholder="Add your meeting notes here..."
                rows={14}
                className="w-full bg-transparent text-gray-300 text-sm font-mono leading-relaxed resize-none focus:outline-none placeholder-gray-600"
              />
              <div className="border-t border-white/5 pt-3 mt-3">
                <button
                  onClick={() => handleEnhance(selected.id)}
                  disabled={!selected.rawNotes.trim() || enhancing}
                  className="w-full py-2.5 bg-brand-gold text-black font-bold rounded-lg text-sm hover:bg-brand-gold2 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {enhancing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>✨ Enhance with AI</>
                  )}
                </button>
                {selected.enhancedNotes && (
                  <p className="text-xs text-gray-600 text-center mt-2">Edit notes above and re-enhance anytime</p>
                )}
              </div>
            </div>
          </div>

          {/* Right: enhanced notes */}
          <div className="lg:col-span-3">
            {selected.enhancedNotes ? (
              <div className="space-y-4 animate-fade-in">
                {/* Summary */}
                <div className="bg-brand-card border border-white/10 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">AI Summary</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${sentimentConfig[selected.enhancedNotes.sentiment].bg} ${sentimentConfig[selected.enhancedNotes.sentiment].color}`}>
                      {sentimentConfig[selected.enhancedNotes.sentiment].label}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{selected.enhancedNotes.summary}</p>
                </div>

                {/* Key points */}
                <div className="bg-brand-card border border-white/10 rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-3">Key Points</h3>
                  <ul className="space-y-2">
                    {selected.enhancedNotes.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                        <span className="text-brand-teal mt-0.5 flex-shrink-0">•</span> {pt}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action items */}
                {selected.enhancedNotes.actionItems.length > 0 && (
                  <div className="bg-brand-card border border-orange-500/20 rounded-xl p-5">
                    <h3 className="text-orange-400 font-semibold mb-3">Action Items</h3>
                    <ul className="space-y-2">
                      {selected.enhancedNotes.actionItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                          <span className="text-orange-400 mt-0.5 flex-shrink-0">☐</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next steps */}
                <div className="bg-brand-card border border-brand-teal/20 rounded-xl p-5">
                  <h3 className="text-brand-teal font-semibold mb-2">Recommended Next Step</h3>
                  <p className="text-gray-300 text-sm">{selected.enhancedNotes.nextSteps}</p>
                </div>
              </div>
            ) : (
              <div className="bg-brand-card border border-white/10 rounded-xl p-8 text-center h-full flex flex-col items-center justify-center">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-white font-bold text-lg mb-2">Enhance with AI</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs">
                  Add your rough notes on the left, then hit "Enhance with AI" to get a structured summary, key points, and action items — just like Granola.
                </p>
                <button
                  onClick={() => handleEnhance(selected.id)}
                  disabled={!selected.rawNotes.trim() || enhancing}
                  className="px-6 py-3 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold2 transition-colors disabled:opacity-40"
                >
                  {enhancing ? 'Enhancing...' : '✨ Enhance with AI'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}
