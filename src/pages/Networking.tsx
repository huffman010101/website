import { useState } from 'react'

const coldEmailTemplates = [
  {
    role: 'Investment Banking',
    subject: 'Quick question from a [University] student interested in IB',
    body: `Hi [Name],

I hope this message finds you well. I came across your profile while researching [Bank]'s M&A team and was struck by your background in [sector coverage].

I'm a [Year] student at [University] studying [Subject] and am keen to pursue a career in investment banking. I would be very grateful for 15 minutes of your time to ask about your experience breaking into the industry and your current work.

I'm happy to work around your schedule completely.

Thank you for considering this.

Best regards,
[Your Name]`,
  },
  {
    role: 'Private Equity',
    subject: 'Aspiring PE professional — would value your perspective',
    body: `Hi [Name],

I'm reaching out as someone who is working towards a career in private equity following my [current role/studies].

I was particularly interested in [Fund]'s focus on [sector/strategy] — I recently read about your investment in [portfolio company] and found the rationale compelling.

Would you be open to a brief call to share your experience transitioning into PE and what you look for in candidates? I'd appreciate even 15 minutes.

Many thanks,
[Your Name]`,
  },
  {
    role: 'Consulting',
    subject: 'Coffee chat request — [University] student interested in consulting',
    body: `Hi [Name],

I'm a [Year] student at [University] and have been preparing for consulting recruitment at [Firm]. I've been practising cases and have attended several industry events, but I wanted to get a practitioner's perspective.

I'd love to learn about your journey into consulting and what you wish you'd known at my stage. Would you have 20 minutes for a call or virtual coffee this month?

Thank you very much,
[Your Name]`,
  },
  {
    role: 'Hedge Fund',
    subject: 'Following your work in [sector] — quick question',
    body: `Hi [Name],

I've been following [Fund]'s approach to [strategy/sector] and was particularly interested in your recent [piece of research/public commentary if available].

I'm a [background] currently exploring opportunities in the hedge fund space. I'd love to understand your perspective on how the industry is evolving and what skills matter most at your firm.

Would a brief call be possible? I'm flexible and happy to work around your availability.

Best,
[Your Name]`,
  },
]

const coffeeChatQuestions = [
  {
    category: 'Career Path',
    questions: [
      'How did you end up in [this role/firm] — was it a deliberate path or did you fall into it?',
      'What did you do in your first role after university and how did it lead you here?',
      'What\'s the one thing you wish you\'d known before starting in this career?',
      'If you were starting again today, would you take the same path?',
    ],
  },
  {
    category: 'Day-to-Day Reality',
    questions: [
      'What does a typical week look like for you — and how does it differ from what you expected?',
      'What parts of the job do you find most energising? And least?',
      'How has the role changed since you started?',
      'What skills do you actually use every day that you didn\'t expect to need?',
    ],
  },
  {
    category: 'Breaking In',
    questions: [
      'What are the most common mistakes you see candidates make during recruitment?',
      'What separates the candidates who get offers from those who don\'t?',
      'How important are grades vs experience at your firm?',
      'Is there anything specific I should focus on in the next 6 months to improve my chances?',
    ],
  },
  {
    category: 'The Firm',
    questions: [
      'What makes [Firm] different from competitors in this space?',
      'How would you describe the culture here — especially for junior people?',
      'Are there things about the firm that surprised you when you joined?',
    ],
  },
  {
    category: 'Staying in Touch',
    questions: [
      'Are there other people at the firm or in the industry you\'d suggest I speak to?',
      'Would it be okay if I kept in touch as I progress through applications?',
      'Is there anything I can do to be helpful to you?',
    ],
  },
]

const linkedinTemplates = [
  {
    scenario: 'Connection request to an alumnus/alumna in your target career',
    message: `Hi [Name], I'm a [Year] student at [University] studying [Subject] and saw you're a [Role] at [Firm] — I noticed we're both [University] alumni. I'm exploring a career in [industry/role] and would love to connect and potentially hear a little about your experience, if you're open to it.`,
  },
  {
    scenario: 'Follow-up message after they accept your connection',
    message: `Thanks for connecting, [Name]! As mentioned, I'm keen to learn more about your path into [role/firm]. Would you have 15 minutes for a quick call in the next few weeks? Completely happy to work around your schedule — no pressure at all if you're too busy right now.`,
  },
  {
    scenario: 'Cold connection request (no shared background)',
    message: `Hi [Name], I've been following [Firm]'s work in [sector/area] and found your recent [post/comment/deal] really interesting. I'm a [Year] student aiming for a career in [industry] and would value the chance to connect and learn from your experience.`,
  },
  {
    scenario: 'Reconnecting after a networking event',
    message: `Hi [Name], great to meet you at [event] yesterday — I really enjoyed our conversation about [specific topic discussed]. I'd love to stay in touch as I continue exploring [industry], and wanted to connect here. Thanks again for your time!`,
  },
  {
    scenario: 'Asking for a referral (only once real rapport is built)',
    message: `Hi [Name], I hope you've been well since we last spoke! I wanted to let you know I've applied for the [Role] position at [Firm] (req #[if known]). Given our conversations about [specific topic], I'd be really grateful if you felt comfortable referring my application internally — but no worries at all if that's not something you're able to do.`,
  },
]

const negotiationScripts = [
  {
    scenario: 'Asking for time to consider an offer',
    script: `Thank you so much for the offer — I'm genuinely excited about the opportunity to join [Firm]. This is a significant decision for me, so I'd like to take [3-5 business days] to review the details fully before confirming. Is that timeline workable on your end?`,
    tip: 'Always thank them and express genuine enthusiasm first — asking for time is completely normal and expected, but tone matters.',
  },
  {
    scenario: 'Negotiating base salary',
    script: `I'm really excited about this offer and joining the team. Based on my research into market rates for this role [and my experience with X], I was hoping we could discuss the base salary — would there be flexibility to move it closer to £[target]?`,
    tip: 'Have specific, credible market data ready (Salary Comparison tool, Glassdoor, recruiter conversations) — vague requests to "pay more" rarely land well.',
  },
  {
    scenario: 'Handling a competing offer',
    script: `I want to be transparent with you — I've also received an offer from another firm with [specific detail, e.g. a higher base]. [Firm] is genuinely my first choice because of [specific reason], and I wanted to see if there's any flexibility before I make my final decision.`,
    tip: 'Never bluff a competing offer that doesn\'t exist — it can be checked, and getting caught destroys trust permanently in a small industry.',
  },
  {
    scenario: 'Declining an offer gracefully',
    script: `Thank you so much for this offer and for the time everyone invested in the process — I really enjoyed getting to know the team. After careful consideration, I've decided to accept another opportunity that's a slightly better fit for my [specific goal]. I hope we can stay in touch, and I'd love to be considered for future opportunities.`,
    tip: 'Decline promptly once you\'ve decided — holding an offer open while you wait on others is considered bad etiquette and burns bridges.',
  },
  {
    scenario: 'Asking about bonus/deferred comp structure',
    script: `Could you help me understand how the bonus is typically structured for this role — is it discretionary or formulaic, and roughly what percentage of total comp does it usually represent? I want to make sure I fully understand the full compensation picture.`,
    tip: 'Check the Salary Comparison tool\'s comp structure breakdown before this conversation so you know what\'s typical for the role and can ask informed questions.',
  },
  {
    scenario: 'Post-interview thank-you note (sent within 24 hours)',
    script: `Thank you for taking the time to speak with me today about the [Role] position. I really enjoyed our conversation about [specific topic discussed] and it confirmed my enthusiasm for the opportunity. Please let me know if there's any additional information I can provide as you move forward with your decision.`,
    tip: 'Send this within 24 hours of every interview round, tailored with a genuine specific — generic "thank you for your time" notes are forgettable.',
  },
]

const timeline = [
  { year: 'Year 1', title: 'Build the Foundation', actions: ['Join your university finance and investment societies', 'Open a paper trading portfolio — track 5 stocks and understand why they move', 'Read the FT daily — develop a market habit early', 'Complete free online courses (CFI, Coursera) in financial modelling basics', 'Attend first networking events — focus on learning, not job hunting'] },
  { year: 'Year 2', title: 'Get Visible', actions: ['Apply for Spring Weeks at banks (applications open October–November)', 'Attend company insight days and firm presentations', 'Start building LinkedIn properly — connect with alumni in target careers', 'Begin mock case interview practice for consulting', 'Research firms deeply: coverage groups, recent deals, culture'] },
  { year: 'Year 3', title: 'Convert the Internship', actions: ['Summer internship is the #1 priority — most full-time offers come through here', 'Network relentlessly inside your internship firm', 'Apply broadly — final year deadline applications open in September', 'Continue technical preparation: DCF, LBO, accounting questions', 'Build a deal tracker if in IB — discuss live markets in every conversation'] },
  { year: 'Final Year', title: 'Land and Prepare', actions: ['Secure your full-time offer — conversion from internship is the priority', 'Complete all outstanding applications for firms not covered by internship', 'Start CFA Level 1 study if targeting buy-side', 'Build a network for your 2-year exit plan from day one', 'Begin planning skills development for your first role'] },
]

const dosDonts = {
  dos: [
    'Do personalise every message — reference something specific about their career or firm',
    'Do follow up once after no response (5–7 days later)',
    'Do come to every conversation prepared — research the person\'s background beforehand',
    'Do send a thank-you email within 24 hours of any call or meeting',
    'Do be specific about what you want from the call — vague asks get ignored',
    'Do build relationships before you need them — not when you\'re desperate',
    'Do keep notes on every conversation and follow up on what you discussed',
  ],
  donts: [
    'Don\'t ask for a job or referral in the first message — build the relationship first',
    'Don\'t send generic messages — recruiters and professionals can spot copy-paste immediately',
    'Don\'t schedule a call and then have nothing to say — prepare 5 specific questions',
    'Don\'t connect on LinkedIn with a blank connection request — always include a message',
    'Don\'t ask questions you could Google — "what does a hedge fund do?" wastes everyone\'s time',
    'Don\'t burn bridges — finance is a small world and reputation travels fast',
    'Don\'t follow up more than twice — if they don\'t respond, move on',
  ],
}

export default function Networking() {
  const [activeTemplate, setActiveTemplate] = useState(0)
  const [openCategory, setOpenCategory] = useState<string | null>('Career Path')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-2">Networking & Breaking In</h1>
        <p className="text-gray-400">Cold email templates, coffee chat scripts, networking timelines, and everything you need to build relationships that open doors in finance.</p>
      </div>

      {/* Timeline */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Your Networking Timeline</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {timeline.map((t, i) => (
            <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-5">
              <div className="text-brand-gold font-black text-sm mb-1">{t.year}</div>
              <div className="text-white font-bold mb-3">{t.title}</div>
              <ul className="space-y-2">
                {t.actions.map((a, j) => (
                  <li key={j} className="text-gray-400 text-xs flex items-start gap-1.5">
                    <span className="text-brand-teal mt-0.5 flex-shrink-0">•</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Cold Email Templates */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-2">Cold Email Templates</h2>
        <p className="text-gray-500 text-sm mb-6">These templates work. Personalise every field in [brackets] before sending — generic emails are deleted immediately.</p>

        <div className="flex gap-2 flex-wrap mb-6">
          {coldEmailTemplates.map((t, i) => (
            <button
              key={i}
              onClick={() => setActiveTemplate(i)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTemplate === i ? 'bg-brand-gold text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
            >
              {t.role}
            </button>
          ))}
        </div>

        <div className="bg-brand-card border border-white/10 rounded-xl p-6">
          <div className="mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Subject Line</p>
            <p className="text-brand-teal font-medium">{coldEmailTemplates[activeTemplate].subject}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Body</p>
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">{coldEmailTemplates[activeTemplate].body}</pre>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-gray-600 text-xs">Remember: replace all [bracketed] placeholders before sending. Personalisation is what turns a cold email into a warm introduction.</p>
          </div>
        </div>
      </section>

      {/* LinkedIn Outreach Templates */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-2">LinkedIn Outreach Templates</h2>
        <p className="text-gray-500 text-sm mb-6">LinkedIn moves faster than email but the same rules apply — always personalise, always include a message with connection requests, never lead with an ask.</p>
        <div className="space-y-3">
          {linkedinTemplates.map((t, i) => (
            <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-5">
              <p className="text-brand-teal text-xs font-bold uppercase tracking-wider mb-2">{t.scenario}</p>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{t.message}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coffee Chat Questions */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-2">Coffee Chat Questions</h2>
        <p className="text-gray-500 text-sm mb-6">Use these in virtual or in-person calls. Adapt to the person's background. Always prepare 5–7 questions in advance.</p>

        <div className="space-y-3">
          {coffeeChatQuestions.map((cat) => (
            <div key={cat.category} className="bg-brand-card border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenCategory(openCategory === cat.category ? null : cat.category)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-white font-semibold">{cat.category}</span>
                <span className="text-gray-500">{openCategory === cat.category ? '▲' : '▼'}</span>
              </button>
              {openCategory === cat.category && (
                <div className="px-6 pb-5 border-t border-white/5">
                  <ul className="space-y-3 mt-4">
                    {cat.questions.map((q, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-brand-gold font-bold text-sm flex-shrink-0 mt-0.5">{i + 1}.</span>
                        <span className="text-gray-300 text-sm">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Post-Interview & Negotiation Scripts */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-2">Post-Interview & Negotiation Scripts</h2>
        <p className="text-gray-500 text-sm mb-6">What to say once you're through the process — thank-you notes, buying time, negotiating comp, and handling competing offers professionally.</p>
        <div className="space-y-3">
          {negotiationScripts.map((s, i) => (
            <div key={i} className="bg-brand-card border border-brand-teal/20 rounded-xl p-5">
              <p className="text-white font-semibold text-sm mb-2">{s.scenario}</p>
              <p className="text-gray-300 text-sm leading-relaxed italic mb-3 bg-brand-darker rounded-lg p-3">"{s.script}"</p>
              <p className="text-gray-500 text-xs">💡 {s.tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dos and Don'ts */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Networking Dos & Don'ts</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-brand-card border border-green-500/20 rounded-xl p-6">
            <h3 className="text-green-400 font-bold text-lg mb-4">Do</h3>
            <ul className="space-y-3">
              {dosDonts.dos.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-green-400 flex-shrink-0 mt-0.5">✓</span> {item.replace('Do ', '')}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-brand-card border border-red-500/20 rounded-xl p-6">
            <h3 className="text-red-400 font-bold text-lg mb-4">Don't</h3>
            <ul className="space-y-3">
              {dosDonts.donts.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-red-400 flex-shrink-0 mt-0.5">✗</span> {item.replace('Don\'t ', '')}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
