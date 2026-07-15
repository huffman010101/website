import { useState } from 'react'

const sections = [
  'How AI Works', 'Prompting Masterclass', 'Prompt Library',
  'Claude Code for Finance', 'Tool Comparison', 'AI by Career',
  'Firm Policies & Interviews', 'Pitfalls & Security',
] as const
type Section = typeof sections[number]

const fundamentals = [
  {
    title: 'What an LLM actually is',
    body: 'Large language models (ChatGPT, Claude, Gemini) predict the most likely next words given everything before them, trained on enormous amounts of text. They are not databases and not calculators — they are extraordinarily good pattern-completers. This explains both their power (fluent reasoning, drafting, explaining) and their weaknesses (confident errors, shaky arithmetic).',
  },
  {
    title: 'Tokenization — how text becomes numbers',
    body: 'Models don\'t read letters or words directly — text is chopped into "tokens", small chunks that are often sub-words (e.g. "discounting" might split into "discount" + "ing"). Roughly 1 token ≈ ¾ of an English word. Everything the model does — reading your prompt, generating a reply, its pricing, its limits — happens in units of tokens, not characters or words.',
  },
  {
    title: 'Transformers & attention — the architecture underneath',
    body: 'Since 2017 ("Attention Is All You Need"), almost every modern LLM uses the transformer architecture. Its key trick is "attention": when producing each word, the model looks back over every other word in the input and learns how much weight to give each one. That\'s how it "knows" that in "the bank raised rates because inflation was high", the word "it" later on refers to the bank, not the rate. Attention run at massive scale, across billions of parameters, is what produces fluent, context-aware text.',
  },
  {
    title: 'The context window — the model\'s working memory',
    body: 'A model can only "see" a limited number of tokens at once — its context window (modern models range from roughly 100k to 1m+ tokens). Everything in your current conversation, any documents you\'ve pasted, and the model\'s reply all count against this budget. Once you exceed it, the oldest content gets dropped or the model starts losing track — which is why very long chats can start "forgetting" things you said earlier, and why pasting a 300-page document isn\'t always a good idea even when technically possible.',
  },
  {
    title: 'Why they "hallucinate"',
    body: 'When a model lacks knowledge, it doesn\'t say "no data found" — it generates the most plausible-sounding answer anyway. It will invent statistics, citations, deal figures and legal cases with total confidence. Rule: any specific fact, number or source an AI gives you must be verified before it goes anywhere near your work.',
  },
  {
    title: 'RAG — grounding answers in real documents',
    body: 'Retrieval-Augmented Generation fixes the hallucination problem for specific documents: instead of relying purely on what the model memorised during training, a RAG system first searches a real, up-to-date source (a filing, a database, your company\'s knowledge base) for relevant passages, then feeds those passages into the model\'s context so it answers FROM the actual text. This is how "chat with this PDF" or "ask questions about our internal research" tools work — and why answers from them are far more trustworthy than a model working from memory alone.',
  },
  {
    title: 'Agentic tool use — AI that does things, not just talks',
    body: 'A plain chatbot only produces text. An "agent" is a model given tools — web search, a calculator, code execution, file access, an API — that it can choose to call mid-task, look at the result, and decide what to do next, often repeating this loop multiple times before giving you a final answer. This is the shift from "AI that answers questions" to "AI that completes multi-step tasks": researching a company across several sources, writing and running code to check its own arithmetic, or navigating a spreadsheet to find and fix an error.',
  },
  {
    title: 'MCP — Model Context Protocol',
    body: 'MCP (created by Anthropic, now an open standard) is a common way for AI assistants to connect to external tools and data sources — think of it as a "USB-C port for AI": one standard connector instead of a custom integration for every combination of assistant and tool. A finance-relevant example: an MCP server could give an AI assistant a consistent way to read a company\'s internal deal tracker, a market data feed, or a document repository, so the same assistant can plug into many different systems without bespoke code for each one.',
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
  { rule: 'Watch for prompt injection when AI reads external content', detail: 'If an AI agent reads a document, email or webpage on your behalf, hidden text inside it can try to hijack the AI ("ignore previous instructions, now do X"). This is a real and growing attack as agents gain more autonomy. Never let an agent take irreversible actions (sending, deleting, trading, paying) without you reviewing exactly what it\'s about to do first.' },
]

const claudeCodeSections = [
  {
    title: 'What Claude Code actually is',
    body: 'Claude Code is an agentic coding assistant that runs in your terminal (or IDE) rather than a chat window. The difference matters: instead of copy-pasting code or formulas back and forth, it can directly read your files, write and edit them, run commands, execute scripts, and check its own output — then report back what it did. For a finance student, that means it can work on a real spreadsheet, a real dataset or a real codebase sitting on your laptop, not just talk about one in the abstract.',
  },
  {
    title: 'Use case 1 — Building and auditing Excel models',
    body: 'Claude Code can open a workbook (via a library like openpyxl or a CSV export), map out every formula, and flag the classic red flags an analyst checks for manually: hardcoded numbers buried inside formulas, broken or circular references, inconsistent formulas across a row, totals that don\'t tie out, and mismatched units. It can then propose specific fixes — cell by cell — for you to review and apply. This turns hours of tedious formula auditing into a focused review of a short list of flagged issues.',
  },
  {
    title: 'Use case 2 — Automating research and tracker workflows',
    body: 'A lot of junior finance work is repetitive data assembly: updating a comps tracker with the latest share prices and multiples, refreshing a deal pipeline sheet, or compiling a weekly macro/market summary from several sources. Claude Code can write a small script that pulls the data, formats it consistently, and updates the tracker automatically — the kind of automation that used to require a VBA macro or a manual hour every Monday morning.',
  },
  {
    title: 'Use case 3 — Structuring due diligence packs',
    body: 'Given a folder of data room documents, Claude Code can help build a standardised DD checklist mapped to what\'s actually present versus missing, organise files into a consistent structure, extract key terms from contracts into a summary table, and draft first-cut sections of an IC memo grounded in the source documents — all of which a human then reviews, verifies and takes ownership of before it goes anywhere near a partner.',
  },
]

const claudeCodeWorkedExample = {
  scenario: 'You\'re a PE summer analyst. Tomorrow\'s IC meeting needs a working comps tracker and a sanity-checked version of a colleague\'s LBO model.',
  steps: [
    { step: '1. Brief it like a colleague', detail: 'Tell Claude Code the file paths, what the comps tracker should contain (which companies, which multiples, which source columns), and what "checking" the LBO model means to you — e.g. "flag any hardcoded cell that should be a formula, any formula that doesn\'t match the pattern of the row it\'s in, and confirm the debt schedule ties to the balance sheet."' },
    { step: '2. Let it read and analyse first', detail: 'It opens the workbook, walks every sheet, and builds a list of findings — e.g. "Cell F34 is hardcoded at 12.4x but every other cell in row 34 is a live formula referencing the comps tab" or "the exit EBITDA multiple doesn\'t match the entry multiple assumption stated in the summary tab."' },
    { step: '3. Review every proposed change before it\'s applied', detail: 'Claude Code shows you exactly what it wants to change, cell by cell, before touching anything — this is the human-in-the-loop step that matters most. You approve, reject, or redirect each one; nothing is silently overwritten.' },
    { step: '4. You still own the numbers', detail: 'Once changes are applied, you re-check the model\'s outputs yourself — the same way you\'d check any junior\'s work. The tool caught the tedious pattern-matching errors fast; the judgement call on whether the assumptions themselves make sense is still entirely yours.' },
  ],
  takeaway: 'The realistic value isn\'t "the AI built the model" — it\'s "hours of mechanical formula-auditing became a 15-minute review of a short, specific findings list." That\'s a genuinely useful skill to bring into an internship, and increasingly an expected one.',
}

const toolComparisonRows = [
  { task: 'Analysing a long document (10-K, credit agreement, CIM)', claude: 'Very strong — large context window, follows detailed multi-part instructions closely', chatgpt: 'Strong, especially with the latest models; broad ecosystem of plugins', copilot: 'Not built for this — lives inside Office/VS Code, not a document-analysis tool', perplexity: 'Good for quick Q&A with citations, weaker for deep multi-step analysis' },
  { task: 'Excel formulas, VBA, in-spreadsheet automation', claude: 'Good via chat — generates and explains formulas, but you paste them in yourself', chatgpt: 'Good via chat, same limitation — no native Excel integration', copilot: 'Best fit — Copilot for Microsoft 365 works directly inside Excel', perplexity: 'Not a fit — it\'s a research tool, not a coding/spreadsheet assistant' },
  { task: 'Real-time market/company research with citations', claude: 'Capable with web search enabled, citations less central to the product', chatgpt: 'Capable with browsing enabled, similar to Claude here', copilot: 'Not a fit', perplexity: 'Best fit — built specifically for cited, sourced web research' },
  { task: 'Writing and running code (data pulls, model automation)', claude: 'Very strong — Claude Code runs directly in your terminal/IDE on real files', chatgpt: 'Strong via Code Interpreter/Canvas, sandboxed rather than your own files directly', copilot: 'Very strong inside VS Code for in-editor autocomplete and inline suggestions', perplexity: 'Not a fit' },
  { task: 'Drafting memos, emails, case prep, interview practice', claude: 'Excellent — strong at following tone/structure instructions precisely', chatgpt: 'Excellent — the most widely used for this, huge familiarity', copilot: 'Not a fit', perplexity: 'Weak fit — optimised for search, not long-form drafting' },
]

const firmPolicySections = [
  {
    title: 'Most firms now have an explicit AI policy',
    body: 'Major banks and funds have moved from ignoring AI to actively governing it. Many have built internal-only AI tools precisely so staff get the productivity benefit without the confidentiality risk — examples include JPMorgan\'s internal LLM Suite and Goldman Sachs\' internal GS AI assistant. If your firm offers an approved internal tool, that\'s almost always what you should be using for anything work-related, not the consumer version of ChatGPT or Claude.',
  },
  {
    title: 'What\'s typically fine',
    body: 'Using consumer AI tools on your own devices for learning, general skill-building, practising interview answers, or drafting things that contain no client, deal or firm-confidential information whatsoever. Personal coding projects. Asking general conceptual questions ("explain how a CDS works") with no specifics attached.',
  },
  {
    title: 'What\'s typically banned',
    body: 'Pasting any client name, deal detail, internal financials, or material non-public information into a public AI tool. Using AI to produce final client-facing analysis without disclosure and full human review. Installing or connecting unapproved AI tools/plugins to a work laptop or work accounts. When in doubt, ask compliance before you paste — not after.',
  },
  {
    title: 'What interviewers are starting to ask',
    body: '"How do you use AI in your work or study?" is now a genuine, increasingly common interview question — not a trick. Interviewers are listening for a specific, credible answer that shows real use with real judgement: using it for first drafts, practice and research, while independently verifying outputs and clearly owning the final work. Two answers that land badly: "I don\'t use it at all" (reads as behind the curve) and "it basically does the work for me" (reads as someone who can\'t be trusted with judgement calls). Some firms are now even building AI-augmented case studies into assessment centres, where using the tool well — not blindly, not by ignoring it — is explicitly part of what\'s being scored.',
  },
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

      {active === 'Claude Code for Finance' && (
        <div className="space-y-4">
          <div className="bg-brand-card border border-brand-teal/20 rounded-xl p-6 mb-2">
            <p className="text-gray-300 text-sm leading-relaxed">Chat-based AI helps you think and draft. <span className="text-white font-semibold">Agentic coding tools like Claude Code go further — they act</span>: reading your actual files, running real commands, and reporting back what changed. That distinction is the difference between "AI helped me think about the model" and "AI helped me audit the actual spreadsheet on my desktop."</p>
          </div>
          {claudeCodeSections.map((s, i) => (
            <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-bold text-lg mb-2">{s.title}</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}

          <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-xl p-6">
            <h2 className="text-brand-gold font-bold text-lg mb-2">Worked example — a real PE workflow</h2>
            <p className="text-white text-sm font-semibold mb-4">{claudeCodeWorkedExample.scenario}</p>
            <div className="space-y-3 mb-4">
              {claudeCodeWorkedExample.steps.map((s, i) => (
                <div key={i} className="bg-brand-darker rounded-lg p-4 border border-white/5">
                  <p className="text-brand-teal font-semibold text-sm mb-1">{s.step}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed italic">{claudeCodeWorkedExample.takeaway}</p>
          </div>
        </div>
      )}

      {active === 'Tool Comparison' && (
        <div className="space-y-4">
          <div className="bg-brand-card border border-white/10 rounded-xl p-6 mb-2">
            <p className="text-gray-300 text-sm leading-relaxed">There’s no single "best" AI tool — each is strongest at different finance tasks. Here’s how Claude, ChatGPT, Copilot and Perplexity actually compare on the work you’ll be doing, not generic feature lists.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-brand-card border border-white/10 rounded-xl overflow-hidden text-sm">
              <thead>
                <tr className="bg-brand-darker">
                  <th className="text-left p-3 text-gray-400 font-semibold border-b border-white/10">Finance Task</th>
                  <th className="text-left p-3 text-brand-gold font-semibold border-b border-white/10">Claude</th>
                  <th className="text-left p-3 text-green-400 font-semibold border-b border-white/10">ChatGPT</th>
                  <th className="text-left p-3 text-blue-400 font-semibold border-b border-white/10">Copilot</th>
                  <th className="text-left p-3 text-purple-400 font-semibold border-b border-white/10">Perplexity</th>
                </tr>
              </thead>
              <tbody>
                {toolComparisonRows.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0 align-top">
                    <td className="p-3 text-white font-medium">{row.task}</td>
                    <td className="p-3 text-gray-400">{row.claude}</td>
                    <td className="p-3 text-gray-400">{row.chatgpt}</td>
                    <td className="p-3 text-gray-400">{row.copilot}</td>
                    <td className="p-3 text-gray-400">{row.perplexity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-brand-card border border-white/10 rounded-xl p-5">
            <p className="text-gray-400 text-sm leading-relaxed"><span className="text-white font-semibold">Bottom line:</span> most finance students end up using two or three of these together — a general assistant (Claude or ChatGPT) for thinking, drafting and learning, Copilot inside Office/VS Code for in-app formula and code help, and Perplexity when they specifically need cited, sourced web research. Pick based on the task, not brand loyalty.</p>
          </div>
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

      {active === 'Firm Policies & Interviews' && (
        <div className="space-y-4">
          <div className="bg-brand-card border border-white/10 rounded-xl p-6 mb-2">
            <p className="text-gray-300 text-sm leading-relaxed">How you talk about — and actually use — AI is now part of how firms evaluate candidates and junior staff. Knowing the landscape before your first day (or your first interview) matters.</p>
          </div>
          {firmPolicySections.map((s, i) => (
            <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-bold text-lg mb-2">{s.title}</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      )}

      {active === 'Pitfalls & Security' && (
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
