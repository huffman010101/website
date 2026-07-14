import { useState } from 'react'

const sections = ['How AI Works', 'Prompting Masterclass', 'Prompt Library', 'AI by Career', 'Pitfalls & Rules'] as const
type Section = typeof sections[number]

const fundamentals = [
  {
    title: 'What an LLM actually is',
    body: 'Large language models (ChatGPT, Claude, Gemini) predict the most likely next words given everything before them, trained on enormous amounts of text. They are not databases and not calculators — they are extraordinarily good pattern-completers. This explains both their power (fluent reasoning, drafting, explaining) and their weaknesses (confident errors, shaky arithmetic).',
  },
  {
    title: 'Why they "hallucinate"',
    body: 'When a model lacks knowledge, it doesn\'t say "no data found" — it generates the most plausible-sounding answer anyway. It will invent statistics, citations, deal figures and legal cases with total confidence. Rule: any specific fact, number or source an AI gives you must be verified before it goes anywhere near your work.',
  },
  {
    title: 'Context is everything',
    body: 'The model only knows what\'s in your conversation. Vague input → generic output. The single biggest upgrade to your results is giving more relevant context: who you are, what you\'re doing, what you\'ve tried, what good looks like. Treat it like briefing a smart new intern who knows nothing about your situation.',
  },
  {
    title: 'Capabilities you should actually use',
    body: 'Explaining concepts at any level ("explain convexity like I\'m 15, then like I\'m an MD"), drafting and rewriting, summarising long documents, brainstorming, role-playing interviews, critiquing your work, generating practice questions, and writing/debugging code and Excel formulas. It\'s a thinking partner, not an oracle.',
  },
  {
    title: 'Where it\'s weak',
    body: 'Precise arithmetic (verify every number), current events beyond its knowledge cutoff (unless it has web access), niche/firm-specific facts, and anything requiring judgement about YOUR specific situation it hasn\'t been told about. It also mirrors your framing — ask a leading question, get a leading answer.',
  },
]

const promptPrinciples = [
  {
    name: '1. Give it a role',
    detail: 'Set who the AI should be — it shapes tone, depth and vocabulary.',
    bad: 'Explain DCF',
    good: 'You are an investment banking MD interviewing a graduate candidate. Explain how you would want a candidate to answer "walk me through a DCF" — then give the model answer.',
  },
  {
    name: '2. Load the context',
    detail: 'Background, constraints, audience, what you\'ve done already. More relevant context = dramatically better output.',
    bad: 'Improve my CV bullet',
    good: 'I\'m a 2nd-year economics student applying to IB spring weeks. Here\'s my CV bullet about my investment society role: "[bullet]". Rewrite it to emphasise quantifiable impact and finance-relevant skills, in under 25 words.',
  },
  {
    name: '3. Specify the output format',
    detail: 'Say exactly what you want back: length, structure, style, table vs prose.',
    bad: 'Tell me about hedge fund strategies',
    good: 'Create a table of the 6 main hedge fund strategies: name, how it makes money, a famous example fund, and what junior roles there involve. Keep each cell under 15 words.',
  },
  {
    name: '4. Show examples (few-shot)',
    detail: 'Give one or two examples of what "good" looks like and the model will match the pattern.',
    bad: 'Write interview answers for me',
    good: 'Here\'s an example of a STAR-format answer I like: [example]. Now help me structure my own story about leading my university consulting project in the same style, keeping it under 90 seconds spoken.',
  },
  {
    name: '5. Make it think step by step',
    detail: 'For anything analytical, ask for reasoning before conclusions — accuracy improves markedly.',
    bad: 'Is this company a good investment?',
    good: 'Analyse this company step by step: 1) business model, 2) revenue drivers, 3) key risks, 4) valuation vs peers. Only after all four steps, give an overall view and the strongest counter-argument to it.',
  },
  {
    name: '6. Iterate — never accept draft one',
    detail: 'The first answer is a starting point. Push back, ask for alternatives, tighten. The conversation IS the tool.',
    bad: '(accepting the first output)',
    good: '"Make it punchier." "Give me 3 alternative versions." "Now critique your own answer — what would a sceptical MD challenge?" "Rewrite for a 30-second spoken delivery."',
  },
  {
    name: '7. Ask it to critique you',
    detail: 'AI is at its best as a brutal reviewer of your own work — invert the relationship.',
    bad: 'Write my cover letter',
    good: 'Here\'s my cover letter draft. Act as a Goldman Sachs recruiter screening 500 applications: what would make you reject this in 30 seconds? Be brutally honest, then suggest the three highest-impact fixes.',
  },
]

const promptLibrary = [
  {
    category: 'Interview Prep',
    prompts: [
      {
        title: 'Mock interviewer',
        prompt: 'You are a [Goldman Sachs IBD] interviewer. Conduct a realistic mock interview with me for a [summer analyst] role. Ask one question at a time, wait for my answer, then give me honest feedback (score /10, what was weak, model answer) before the next question. Mix technical and behavioural. Start now.',
      },
      {
        title: 'Technical drill sergeant',
        prompt: 'Quiz me on [DCF / LBO / accounting] interview questions, one at a time, escalating in difficulty. After each of my answers, tell me exactly what an interviewer would think, what I missed, and the ideal answer. Track my score. Do not go easy on me.',
      },
      {
        title: 'Story polisher',
        prompt: 'Here is a rough story from my experience: [describe]. Turn it into a STAR-format behavioural answer for "[tell me about a time you led a team]" — 60-90 seconds spoken, specific, quantified where possible. Then list 3 follow-up questions an interviewer might ask and how I\'d handle them.',
      },
    ],
  },
  {
    category: 'Learning Finance',
    prompts: [
      {
        title: 'Concept ladder',
        prompt: 'Explain [convexity / the yield curve / carried interest] three times: 1) to a 15-year-old, 2) to a finance student, 3) as it would come up in a trading floor conversation. Then give me two exam-style questions to check I understood.',
      },
      {
        title: 'News decoder',
        prompt: 'Here\'s a financial news article: [paste]. Explain: 1) what actually happened, 2) why it matters to markets, 3) the key terms a student might not know, 4) what a smart interview candidate would say about it if asked.',
      },
      {
        title: 'Socratic tutor',
        prompt: 'Teach me [bond duration] using the Socratic method — ask me guiding questions one at a time, correct my reasoning when I go wrong, and don\'t give me the answer until I\'ve genuinely tried. Push me until I can explain it back to you flawlessly.',
      },
    ],
  },
  {
    category: 'Applications & CV',
    prompts: [
      {
        title: 'Recruiter simulator',
        prompt: 'Act as a recruiter at [firm] screening [investment banking spring week] applications — you reject 95%. Here\'s my CV: [paste]. Give me: the 30-second impression, three reasons you\'d reject it, three strongest points, and the exact rewrites for the two weakest bullets.',
      },
      {
        title: 'Why-this-firm builder',
        prompt: 'I\'m answering "Why [firm]?" for a [division] application. Here\'s what I genuinely know and like about them: [notes]. Structure a 150-word answer that is specific enough that it could ONLY be about this firm — no generic praise. Then flag anything that still sounds copy-paste.',
      },
      {
        title: 'Cover letter stress test',
        prompt: 'Rewrite this cover letter paragraph to pass the "so what?" test — every sentence must either prove a skill with evidence or show specific knowledge of the firm: [paste]. Keep my voice; don\'t make it sound AI-written.',
      },
    ],
  },
  {
    category: 'Work & Analysis',
    prompts: [
      {
        title: 'Excel formula builder',
        prompt: 'I need an Excel formula that [looks up the latest non-blank value in column B for each name in column A]. Give me the formula, explain each part, note version requirements (e.g. XLOOKUP needs 365), and give the older-Excel alternative.',
      },
      {
        title: 'Document summariser',
        prompt: 'Summarise this [annual report section / research note]: [paste]. Give me: 5-bullet executive summary, the 3 numbers that matter most and why, anything management is downplaying, and 3 sharp questions an analyst would ask.',
      },
      {
        title: 'Devil\'s advocate',
        prompt: 'Here\'s my investment thesis / analysis: [paste]. Argue the OTHER side as forcefully as possible — the strongest bear case, what I\'m assuming without evidence, and what data would prove me wrong. Do not agree with me.',
      },
    ],
  },
]

const careerAI = [
  {
    career: 'Investment Banking',
    icon: '🏢',
    uses: 'Drafting CIM sections and pitch pages, summarising data room documents, first-cut comps commentary, checking model logic, formatting fixes. Banks now deploy internal AI (JPMorgan\'s LLM Suite, Goldman\'s GS AI) for exactly this.',
    edge: 'Analysts who master AI ship pitchbooks faster and get pulled onto live deals. But every number still gets hand-verified — an AI-invented figure in a board deck is a firing offence.',
    prompt: 'Summarise this 40-page industry report into one pitchbook-ready page: market size and growth, 3 key trends, top 5 players with market share, and 3 implications for a mid-cap [sector] company considering a sale.',
  },
  {
    career: 'Trading & Markets',
    icon: '📟',
    uses: 'Morning market summaries, parsing central bank statements for hawkish/dovish shifts, explaining unfamiliar products instantly, writing Python for backtests and data analysis, scenario brainstorming.',
    edge: 'Speed of synthesis is the edge: traders use AI to digest overnight news across every asset class before the open. Quant desks expect AI-assisted coding as standard now.',
    prompt: 'Compare these two central bank statements [paste both]. List every wording change, classify each as hawkish/dovish/neutral, and give the likely market reading of the overall shift for rates and FX.',
  },
  {
    career: 'Consulting',
    icon: '📊',
    uses: 'Structuring problem trees, industry primers before client meetings, drafting slide storylines, synthesising interview notes, generating MECE issue lists to pressure-test your own. McKinsey\'s internal "Lilli" does exactly this.',
    edge: 'Consultants live on fast synthesis of unfamiliar industries — AI compresses a day of desk research into an hour. The judgement layer (so what for THIS client?) stays human.',
    prompt: 'I have a case interview about a [European airline losing margin]. Build a MECE issue tree for diagnosing the problem, then list the 5 data requests I\'d prioritise and what each would tell me.',
  },
  {
    career: 'Private Equity & VC',
    icon: '💰',
    uses: 'Screening CIMs and pitch decks rapidly, market mapping ("list every UK vertical-SaaS company in logistics"), drafting IC memo sections, summarising expert-call transcripts, diligence question lists.',
    edge: 'Deal teams triage far more opportunities with AI-assisted screening. VCs use it to compress diligence; the winners still differentiate on judgement and network, not summarisation.',
    prompt: 'Here\'s a company one-pager [paste]. Draft the "Key Risks & Mitigants" section of an investment committee memo: 5 risks ranked by severity, evidence for each, possible mitigants, and the 3 diligence questions that matter most.',
  },
  {
    career: 'Equity Research & Asset Management',
    icon: '📈',
    uses: 'Earnings call transcript summaries minutes after the call, extracting guidance changes, comparing management tone quarter-over-quarter, drafting note sections, screening ideas against criteria.',
    edge: 'Coverage analysts process 20+ companies\' earnings in a fortnight — AI turns transcript triage from hours to minutes, freeing time for the differentiated thinking clients pay for.',
    prompt: 'Compare this quarter\'s earnings call transcript to last quarter\'s [paste both]: what guidance changed, what questions management dodged, tone shifts, and the 3 things a Buy-rated analyst should be most worried about.',
  },
  {
    career: 'Risk, Compliance & Ops',
    icon: '🛡️',
    uses: 'Summarising new regulations into action points, drafting policy updates, screening transactions/communications (banks run AI surveillance at scale), writing SQL/Python for data checks.',
    edge: 'RegTech is one of AI\'s biggest finance applications — knowing both the rules and the tools makes you the person who translates regulation into systems, which is where the career upside sits.',
    prompt: 'Summarise this regulatory consultation paper [paste] for a compliance team: what changes, who\'s affected, implementation deadlines, the 5 concrete actions our firm would need to take, and open questions to raise in our response.',
  },
]

const pitfalls = [
  { rule: 'Never paste confidential information into public AI tools', detail: 'Client names, deal details, MNPI, internal financials — putting these into consumer ChatGPT can breach confidentiality agreements, regulation and firm policy. Banks have fired people for this. Use your firm\'s approved internal tools only.' },
  { rule: 'Verify every number and every citation', detail: 'AI invents statistics and sources fluently. If a figure, case, paper or deal detail is going into your work, find the primary source. "The AI said so" has never once been an acceptable answer.' },
  { rule: 'Insider information rules fully apply', detail: 'Asking AI to analyse material non-public information doesn\'t launder it. Market abuse rules apply to AI-assisted analysis exactly as they do to a spreadsheet.' },
  { rule: 'Don\'t submit AI-written applications', detail: 'Recruiters now read hundreds of identical AI-voiced cover letters — the generic ones scream it. Use AI to critique, structure and sharpen YOUR draft, not to generate it. Firms also increasingly use AI-detection and, more simply, interviews expose people who can\'t reproduce their own application\'s quality.' },
  { rule: 'Understand it or don\'t use it', detail: 'If AI writes analysis you can\'t explain line-by-line when challenged, you\'ve created a career time bomb. The interview follow-up, the MD\'s question, the client push-back — all expose borrowed understanding.' },
  { rule: 'AI amplifies, it doesn\'t replace judgement', detail: 'Every serious deployment in finance keeps a human accountable for the output. Your value is shifting from producing first drafts to directing, verifying and judging — get excellent at exactly that.' },
]

export default function AISkills() {
  const [active, setActive] = useState<Section>('How AI Works')
  const [copied, setCopied] = useState<string | null>(null)

  function copyPrompt(text: string, key: string) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">Develop AI Knowledge</h1>
        <p className="text-gray-400">AI fluency is becoming as fundamental to finance careers as Excel. Learn how these tools actually work, how to prompt like a power user, and how each finance career is already using them.</p>
      </div>

      {/* Section nav */}
      <div className="flex overflow-x-auto gap-1 mb-8 pb-1">
        {sections.map(s => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              active === s ? 'bg-brand-gold text-black' : 'bg-brand-card border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {active === 'How AI Works' && (
        <div className="space-y-4">
          {fundamentals.map((f, i) => (
            <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-bold text-lg mb-2">{f.title}</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
          <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-xl p-6">
            <h2 className="text-brand-gold font-bold text-lg mb-2">The one-sentence mental model</h2>
            <p className="text-gray-300 text-sm leading-relaxed">Treat AI like a brilliant, endlessly patient intern with a photographic memory of the public internet, zero knowledge of your specific situation, occasional confident lying, and no accountability — brief it properly, check its work, and it will multiply your output.</p>
          </div>
        </div>
      )}

      {active === 'Prompting Masterclass' && (
        <div className="space-y-4">
          <div className="bg-brand-card border border-white/10 rounded-xl p-6 mb-2">
            <p className="text-gray-300 text-sm leading-relaxed">Prompting isn’t magic words — it’s briefing quality. The same seven habits below separate people who get generic mush from people who get genuinely useful output. Each shows a weak prompt and a strong one.</p>
          </div>
          {promptPrinciples.map((p, i) => (
            <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-bold mb-1">{p.name}</h2>
              <p className="text-gray-400 text-sm mb-4">{p.detail}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1.5">✗ Weak</p>
                  <p className="text-gray-400 text-sm italic">{p.bad}</p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <p className="text-green-400 text-xs font-bold uppercase tracking-wider mb-1.5">✓ Strong</p>
                  <p className="text-gray-300 text-sm">{p.good}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {active === 'Prompt Library' && (
        <div className="space-y-8">
          <p className="text-gray-400 text-sm -mb-2">Battle-tested templates — copy, replace the [brackets], and iterate on the output.</p>
          {promptLibrary.map(group => (
            <div key={group.category}>
              <h2 className="text-xl font-black text-brand-gold mb-4">{group.category}</h2>
              <div className="space-y-3">
                {group.prompts.map((p, i) => {
                  const key = `${group.category}-${i}`
                  return (
                    <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-5">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <h3 className="text-white font-semibold text-sm">{p.title}</h3>
                        <button
                          onClick={() => copyPrompt(p.prompt, key)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-brand-teal/10 text-brand-teal border border-brand-teal/30 hover:bg-brand-teal/20 transition-colors flex-shrink-0"
                        >
                          {copied === key ? '✓ Copied' : '📋 Copy'}
                        </button>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed font-mono bg-brand-darker rounded-lg p-3 border border-white/5">{p.prompt}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {active === 'AI by Career' && (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm -mb-1">How each career is actually deploying AI today, why fluency gives you an edge, and a ready-to-use prompt for that world.</p>
          {careerAI.map((c, i) => (
            <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-black text-lg mb-3">{c.icon} {c.career}</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-brand-teal font-bold uppercase tracking-wider mb-1">How it’s used today</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{c.uses}</p>
                </div>
                <div>
                  <p className="text-xs text-brand-gold font-bold uppercase tracking-wider mb-1">Your edge</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{c.edge}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Try this prompt</p>
                  <p className="text-gray-400 text-sm leading-relaxed font-mono bg-brand-darker rounded-lg p-3 border border-white/5">{c.prompt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {active === 'Pitfalls & Rules' && (
        <div className="space-y-4">
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 mb-2">
            <h2 className="text-red-400 font-bold text-lg mb-2">⚠️ The rules that end careers when broken</h2>
            <p className="text-gray-300 text-sm leading-relaxed">In finance, AI misuse isn’t just embarrassing — it can breach regulation, confidentiality and employment contracts. Learn these before your first day, not after your first mistake.</p>
          </div>
          {pitfalls.map((p, i) => (
            <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-bold text-sm mb-1.5">{i + 1}. {p.rule}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{p.detail}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
