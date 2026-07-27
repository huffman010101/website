import { useState } from 'react'
import { Link } from 'react-router-dom'

const sections = ['Start From Zero', 'Technique', 'Question Bank & Model Answers', 'Formats & Assessment Centres', 'Your Year Ahead'] as const
type Section = typeof sections[number]

// ==================== START FROM ZERO ====================

const processStages = [
  { stage: '1. Online Application', detail: 'CV + cover letter (or short motivation questions) submitted through the firm\'s portal. Many firms review on a rolling basis — applying in week 1 vs week 8 of the window can be the difference between a look and an auto-reject.' },
  { stage: '2. Psychometric Tests', detail: 'Numerical, verbal, logical and situational judgement tests, sent almost immediately. They cut 50-80% of applicants before a human sees anything. Practise these in the Online Test Practice tool until they feel boring.' },
  { stage: '3. Video Interview (HireVue)', detail: 'Pre-recorded: a question appears on screen, you get ~30 seconds to think, then 1-2 minutes to answer to your camera. No human on the other end. Feels weird; entirely learnable.' },
  { stage: '4. Assessment Centre / Final Interviews', detail: 'A half or full day: 2-3 live interviews (motivation, behavioural, light technical/commercial), sometimes a group exercise or case study. For spring weeks this is often shortened to one or two interviews.' },
  { stage: '5. Offer', detail: 'Spring week offers usually land December-February. The spring week itself is then your route to a fast-tracked summer internship interview — which is the real prize.' },
]

const assessmentBuckets = [
  { bucket: 'Motivation', question: 'Do you actually want THIS — finance, this firm, this division — or are you spraying applications?', evidence: 'Specific, researched reasons. Names of teams, deals, programmes. A story of how your interest developed over time. Generic answers ("prestigious global firm") are instant red flags.' },
  { bucket: 'Competence', question: 'Have you done hard things before, and can you prove it?', evidence: 'Concrete stories with your specific role and a measurable result — from societies, group projects, part-time jobs, sport, personal projects. At your stage nobody expects finance experience; they expect evidence of drive.' },
  { bucket: 'Commercial Awareness', question: 'Do you follow markets and can you hold a basic conversation about the world of money?', evidence: 'One or two news stories you can discuss in depth, a view on rates/markets, a stock or company you find interesting. Depth on a few things beats shallow coverage of everything.' },
  { bucket: 'Fit & Polish', question: 'Would I want to sit next to this person at 11pm on a deal? Can I put them in front of a client?', evidence: 'Warmth, energy, listening properly, structured clear answers, asking good questions. This is the famous "airport test" — and it is genuinely scored.' },
]

const goldenRules = [
  { rule: 'Answer the question first, then explain', detail: 'Interviewers switch off during long wind-ups. Lead with your conclusion ("My biggest strength is X"), then support it. This one habit puts you ahead of most candidates immediately.' },
  { rule: 'Specific beats impressive', detail: '"I led a 4-person team that grew society membership 40% in one term" beats "I have strong leadership skills" every single time. Numbers, names, outcomes.' },
  { rule: '60-90 seconds per answer', detail: 'Long enough to show substance, short enough to stay sharp. If they want more, they\'ll ask. Rambling is the most common way strong candidates lose interviews.' },
  { rule: 'Prepare stories, not scripts', detail: 'Memorised scripts collapse under follow-up questions and sound robotic. Instead, know 6 stories cold (situation, what you did, result) and flex them to whatever is asked.' },
  { rule: 'It is a conversation, not an interrogation', detail: 'The best interviews feel like a chat with a curious senior person. Listen fully, react to what they say, be a human. Interviewers hire people they enjoyed talking to.' },
  { rule: 'Nobody expects you to be a banker', detail: 'At spring week level they are hiring potential: curiosity, energy, evidence of effort, and coachability. Trying to sound like a 30-year-old MD reads as fake. Sound like the sharpest, most prepared student they\'ve met.' },
]

// ==================== TECHNIQUE ====================

const starBreakdown = [
  { letter: 'S', word: 'Situation', detail: 'One or two sentences of context. Where were you, what was going on, why did it matter? Keep it tight — this is scenery, not the story.', timeShare: '~15%' },
  { letter: 'T', word: 'Task', detail: 'What specifically were YOU responsible for? Separate your role from the team\'s. "As events lead, I had to..." not "we had to..."', timeShare: '~10%' },
  { letter: 'A', word: 'Action', detail: 'The heart of the answer. What did you actually do, step by step, and why did you choose that approach? Use "I" throughout. This is where interviewers assess how you think.', timeShare: '~55%' },
  { letter: 'R', word: 'Result', detail: 'What happened — quantified if possible — and what you learned. A result with a number sticks in the interviewer\'s notes. Always close the loop.', timeShare: '~20%' },
]

const starExample = {
  question: '"Tell me about a time you led a team through a difficult situation."',
  bad: '"I\'m quite a natural leader. In my society we had some problems organising an event and I helped sort it out, and it ended up going quite well. Everyone said I handled it well and I think it shows I work well with people."',
  badWhy: 'No context, no specific actions, no result, no numbers — the interviewer has learned nothing verifiable and will forget this answer within a minute.',
  good: '"In my first year I was events officer for our investment society, and three weeks before our flagship speaker event, our venue cancelled (S). As the only person on the committee responsible for logistics, rebooking was on me (T). I listed every university space with capacity over 100, but all were booked — so I approached a local cinema, negotiated an off-peak rate by offering them a mention in our 2,000-subscriber newsletter, and reworked the run-of-show for the new space. I also emailed all attendees personally with the change to limit drop-off (A). The event ran with 140 attendees — our biggest of the year — and the cinema deal cut our venue costs 30%, which we\'ve reused twice since (R)."',
  goodWhy: 'Specific, quantified, "I"-driven, shows resourcefulness AND commercial instinct (the negotiation), and lands in about 60 seconds.',
}

const storyMatrix = [
  { competency: 'Leadership', prompt: 'A time you took charge, motivated others, or were accountable for a group outcome', sources: 'Society role, group project lead, sports captaincy, organising anything' },
  { competency: 'Teamwork', prompt: 'A time you collaborated well — especially with difficult people or across differences', sources: 'Group coursework, part-time job shifts, society committees, team sport' },
  { competency: 'Failure / Setback', prompt: 'Something that genuinely went wrong, owned honestly, with what you changed afterwards', sources: 'A missed grade, a failed event, a lost competition, a rejected application' },
  { competency: 'Conflict / Persuasion', prompt: 'A disagreement handled maturely, or a time you changed someone\'s mind', sources: 'Committee disagreements, group project disputes, negotiating anything' },
  { competency: 'Pressure / Juggling', prompt: 'Delivering under a deadline or balancing competing demands', sources: 'Exam season with a job, event deadlines, multiple deadlines at once' },
  { competency: 'Initiative / Achievement', prompt: 'Something you built, started, or achieved that nobody asked you to', sources: 'A personal project, starting a society/newsletter, teaching yourself a skill, this year\'s prep itself' },
]

const deliveryTips = [
  { tip: 'Pause instead of filling', detail: '"Um", "like", "sort of" leak confidence. Train yourself to simply pause — a 2-second silence reads as thoughtful; five "ums" read as nervous. Record yourself once and you\'ll hear it immediately.' },
  { tip: 'Slow down by 20%', detail: 'Nerves speed everyone up. Deliberately speaking slightly slower than feels natural lands at exactly the right pace, and gives your brain time to stay ahead of your mouth.' },
  { tip: 'Think out loud when stuck', detail: 'Asked something you don\'t know? Say "That\'s a good question — let me think about it from two angles..." and reason audibly. Interviewers score your thinking process, not just conclusions. Never bluff a fact.' },
  { tip: 'Energy is a skill', detail: 'After interviewing eight candidates, the one who was genuinely warm and engaged is the one they remember. Smile when you greet, lean in slightly, react to what they say. Flat delivery kills good content.' },
  { tip: 'First 10 seconds matter disproportionately', detail: 'A confident greeting, their name, a genuine smile. Interviewers form an early impression and then (unfairly but truly) look for evidence to confirm it — make the early evidence good.' },
  { tip: 'Close strong', detail: 'Have 2-3 genuine questions ready (see the Question Bank tab), thank them by name, and re-state your enthusiasm in one sentence. The last 30 seconds are what they walk away holding.' },
]

const practiceMethods = [
  { method: 'Record yourself answering (weekly)', detail: 'Phone camera, one question, 90 seconds. Watching it back is uncomfortable and is the fastest single improvement method that exists. Track: filler words, eye contact, answer length, whether you answered first.' },
  { method: 'Use the Interview Quiz tool (2-3x/week)', detail: 'Type answers to real questions, get scored against key points, study the model answers. The spaced repetition resurfaces what you got wrong.', link: '/interview-quiz' },
  { method: 'Mock interviews with a friend (fortnightly)', detail: 'Swap 20-minute mocks with a friend also applying. Give each other one "keep doing" and one "change" after each. A friend spotting your habits beats ten solo sessions.' },
  { method: 'AI mock interviewer (anytime)', detail: 'Use the mock interviewer prompt in Develop AI Knowledge → Prompt Library to run unlimited realistic mock interviews with instant feedback.', link: '/ai-skills' },
  { method: 'Daily 15-minute market habit', detail: 'FT, Bloomberg or Morning Brew each morning. Keep a note of 2-3 stories you could discuss for two minutes each. Commercial awareness cannot be crammed the night before — it compounds.' },
]

// ==================== QUESTION BANK ====================

type QA = { q: string; framework: string; model: string }
type QAGroup = { group: string; icon: string; intro: string; items: QA[] }

const questionBank: QAGroup[] = [
  {
    group: 'The Big Four Openers',
    icon: '🎬',
    intro: 'These open almost every finance interview. They look casual; they are the most important answers you will give. Prepare them word-for-word-ish (know the beats, not a script).',
    items: [
      {
        q: 'Tell me about yourself / Walk me through your CV',
        framework: 'Past → Present → Future, in 90 seconds. Where you\'re from academically, what sparked finance, what you\'ve done about it, why you\'re here today. End pointing at THIS opportunity.',
        model: '"I\'m a second-year Economics student at [University]. My interest in finance started when [genuine specific spark — e.g. following the 2022 rate rises for an essay and realising I read market news for fun]. Since then I\'ve acted on it: I joined the investment society and now run its weekly market briefing, I\'ve been managing a small personal paper-portfolio to learn how markets actually move, and I\'ve been teaching myself valuation basics. This year I\'m targeting spring weeks because I want to test that interest against the real thing — and [Firm]\'s programme stood out because [one specific reason]. That\'s what brings me here."',
      },
      {
        q: 'Why investment banking? (or trading / asset management — adapt)',
        framework: 'Two or three genuine reasons + evidence you understand the downsides. Never say money or prestige. Show you know what the job actually is.',
        model: '"Three reasons. First, the learning curve — nowhere else gives a 20-year-old exposure to how companies are valued and deals get done at that intensity, and I want the steepest curve I can find. Second, I genuinely enjoy the work I\'ve tried: I\'ve built basic DCF models on companies I follow, and the hours disappeared. Third, the team element — banking is done in small deal teams under pressure, and my best experiences, like [example], have all had that shape. And I\'m clear-eyed about the hours — I\'ve spoken to two analysts about the reality, and it\'s a trade I understand and want to make for what I get back."',
      },
      {
        q: 'Why our firm?',
        framework: 'Firm-specific facts + a personal connection + culture evidence. The test: could this answer be copy-pasted to their competitor? If yes, it fails. Research: recent deals, firm strategy, people you\'ve spoken to.',
        model: '"Three things drew me specifically here. First, your strength in [specific area — e.g. UK mid-market M&A / tech coverage / European rates]: I followed your work on [specific deal or ranking] and it\'s the kind of work I want exposure to. Second, I\'ve spoken to [name/role — e.g. an analyst I met at your campus event], and what stuck with me was [specific cultural detail they mentioned]. Third, the structure of this spring week itself — [specific feature, e.g. the rotation across divisions] — fits exactly where I am: sure about finance, still testing which seat. I couldn\'t honestly give that answer about most of your competitors."',
      },
      {
        q: 'Why should we take you over other candidates?',
        framework: 'Rule of three: pick your three strongest differentiators, each with one line of evidence. Confident, not arrogant — you\'re presenting evidence, not boasting.',
        model: '"Three reasons. One: I\'ve done the work — I haven\'t just decided I like finance, I\'ve built the habit: daily markets reading, self-taught valuation basics, a tracked paper portfolio. Two: I deliver in teams — as [role], I [one-line quantified achievement]. Three: I\'m coachable and I compound — everything on my CV from the last year came from feedback loops: try, get feedback, improve. A spring week is a learning environment, and learning fast is specifically the thing I\'m best at."',
      },
    ],
  },
  {
    group: 'Behavioural Questions (STAR)',
    icon: '🧩',
    intro: 'Every answer here comes from your 6-story matrix (Technique tab). Below are condensed model answers pitched at second-year level — adapt the shape to YOUR stories, don\'t borrow the content.',
    items: [
      {
        q: 'Tell me about a time you worked in a team',
        framework: 'Pick a story with friction or complexity — a smooth team story teaches them nothing. Show your specific role and one moment where you made the team better.',
        model: '"In a five-person coursework group, two members had a running disagreement about approach that was stalling us with two weeks left (S). I wasn\'t the group leader, but I could see we\'d miss the deadline without a reset (T). I suggested we split a trial week — build a small version of both approaches and compare against the mark scheme. I took on the comparison write-up myself so neither \'side\' judged its own work (A). The mark scheme clearly favoured one approach, the disagreement dissolved because the evidence decided rather than either person, and we finished two days early with a 75 (R). What I took from it: in team deadlock, changing the question from \'who is right\' to \'what does the evidence say\' unblocks almost everything."',
      },
      {
        q: 'Tell me about a failure',
        framework: 'A REAL failure (not "I work too hard"), owned without excuses, with a specific change you made after. The failure is the setup; the growth is the answer. Bonus: show the change paying off later.',
        model: '"In first year I ran for society president and lost badly — I got a fraction of the vote (S/T). Honestly, I deserved to: I\'d assumed being visible was enough and barely campaigned, while the winner had spoken to practically every member personally. Afterwards I asked the winner for feedback directly, which was uncomfortable, and the message was blunt: people vote for someone with a plan for them, not a familiar face (A). So when I ran for events officer six months later, I did it properly — I surveyed members on what events they actually wanted and campaigned on the three most requested. I won, and delivered all three that term (R). The lesson genuinely rewired me: effort without understanding your audience is just noise."',
      },
      {
        q: 'Tell me about a time you handled pressure or competing deadlines',
        framework: 'Show a system, not just survival. Interviewers are checking whether you\'ll cope with banking-style load — prioritisation and communication are what they want to hear.',
        model: '"Last term my two biggest coursework deadlines landed the same week as our society\'s largest event, which I was running (S/T). Rather than just working longer, I triaged: I mapped everything into must-do-by-when, delegated the event\'s day-of logistics to two committee members I\'d been developing — which I\'d have found hard a year earlier — and told my study group early that I\'d take the analysis section (my strength) rather than the write-up, to play to speed (A). Both courseworks came in on time at a 2:1 or above, and the event ran without me touching logistics on the day (R). The real lesson was the delegating: pressure taught me that keeping everything yourself isn\'t diligence, it\'s a bottleneck."',
      },
      {
        q: 'Tell me about a time you showed initiative',
        framework: 'Something nobody asked you to do. Your finance prep journey itself is legitimate material here — it shows exactly the self-starting they want.',
        model: '"When I decided finance was my target, I realised waiting for my course to teach me would be too slow — my degree doesn\'t cover valuation until final year (S/T). So I built my own curriculum: I worked through a financial modelling course over the summer, started a paper portfolio of five stocks with a written one-paragraph thesis for each, and set a daily 15-minute markets reading habit that I\'ve now kept for [X] months. I also started writing a short weekly market recap for our society newsletter, partly to force myself to actually understand what I read (A). The newsletter now goes to [N] members, and two committee members have told me they joined the society partly because of it (R)."',
      },
    ],
  },
  {
    group: 'Commercial Awareness',
    icon: '📰',
    intro: 'The most feared and most controllable section. You don\'t need to know everything — you need 2-3 stories you can discuss in real depth, plus a basic view on the macro picture. Depth beats breadth, always.',
    items: [
      {
        q: 'Tell me about a news story that interested you recently',
        framework: 'Pick a story, know it three layers deep: what happened → why it matters (who wins/loses, what it means for markets or the firm\'s clients) → your view, plus what would change your mind. Prepare two stories: one macro (rates, inflation, currencies), one deal or company story.',
        model: '"I\'ve been following [e.g. the Bank of England\'s rate path]. The surface story is [what happened — the latest decision/data]. What makes it interesting to me is the second layer: [why it matters — e.g. what it does to borrowing costs, gilt yields, and which sectors feel it first]. My view is [a modest, reasoned position — e.g. that markets are pricing cuts faster than the inflation data justifies], though I\'d change my mind if [specific evidence — e.g. two consecutive soft services-inflation prints]. And for a firm like yours it matters because [connect to their business — e.g. rate uncertainty directly drives client hedging and deal-timing decisions]."',
      },
      {
        q: 'Pitch me a stock / tell me about a company you find interesting',
        framework: 'Thesis in one line → 2-3 supporting reasons → the main risk → what you\'d watch. You will not out-analyse a professional; you CAN show structured thinking about a business you genuinely follow.',
        model: '"[Company]. One line: it\'s a quality business the market is treating as ordinary. Three reasons: first, [competitive advantage — e.g. switching costs / brand / network]; second, [financial evidence — e.g. margins holding despite input cost pressure]; third, [valuation angle — e.g. trading below its five-year average multiple while the business has improved]. The main risk is [honest bear case — e.g. its biggest segment is cyclical and a downturn hits it first], and what I\'m watching is [specific signpost — e.g. the next set of results for whether volume growth held]. I hold it in my paper portfolio, so I\'ve been tracking whether my thesis survives contact with its earnings — so far it has, roughly."',
      },
      {
        q: 'What do rising interest rates mean for markets? (and variants)',
        framework: 'Have the transmission chain cold — this exact mechanic underpins dozens of question variants. Learn it once in the Develop Knowledge macro unit and reuse it everywhere.',
        model: '"Higher rates raise the discount rate on all future cash flows, so asset valuations fall — hitting growth stocks hardest because their value sits furthest in the future. Bond prices fall as yields rise. Borrowing gets more expensive, so deal activity and leveraged buyouts slow, and companies with heavy floating-rate debt get squeezed. The currency tends to strengthen as capital chases the higher yield. And banks\' lending margins often improve, which is why bank stocks sometimes rise while the wider market falls. In short: rates are the gravity of finance — when they change, every asset price has to adjust."',
      },
    ],
  },
  {
    group: 'Spring-Week-Level Technicals',
    icon: '🔢',
    intro: 'Spring week interviews rarely go deep technically — but they do check basics, and knowing them cold signals seriousness. Study these properly in Develop Knowledge; here are the interview-ready short versions.',
    items: [
      {
        q: 'What does an investment bank actually do?',
        framework: 'Show you understand the divisions — most candidates can\'t. Thirty seconds, structured.',
        model: '"At the core, it connects companies that need capital with investors who have it, and advises on big corporate decisions. Advisory (M&A) helps companies buy and sell each other. Capital markets — ECM and DCM — raises equity and debt for clients. Markets (sales & trading) buys and sells securities for institutional investors and makes markets in them. And divisions like research and asset management sit alongside. I\'m most drawn to [division] because [one genuine sentence]."',
      },
      {
        q: 'What is the difference between a stock and a bond?',
        framework: 'The classic zero-level check. Answer cleanly, add one layer of insight to stand out.',
        model: '"A stock is ownership — a claim on a company\'s future profits, with voting rights, unlimited upside and last claim if things go wrong. A bond is a loan — fixed interest payments and your money back at maturity, paid before shareholders see anything, but with capped upside. The extra layer: that ranking is why equity returns beat bonds over long periods — shareholders take more risk, so they demand more return — and why the same company\'s bonds and shares can tell different stories about how it\'s doing."',
      },
      {
        q: 'What are the three financial statements and how do they connect?',
        framework: 'One sentence each, then one connection — that\'s enough at this level, and the connection is what impresses.',
        model: '"The income statement shows profitability over a period — revenue down to net income. The balance sheet is a snapshot of what the company owns and owes — assets equal liabilities plus equity, always. The cash flow statement tracks actual cash moving, because profit and cash aren\'t the same thing. They link: net income flows into equity on the balance sheet and starts the cash flow statement, and the closing cash balance goes back onto the balance sheet. Change one number and all three move."',
      },
      {
        q: 'If you had £10,000 today, what would you do with it?',
        framework: 'There\'s no right portfolio — they\'re testing whether you think in risk, horizon and diversification terms rather than stock tips.',
        model: '"Depends on horizon, but assuming this is genuinely long-term money for a student with no debts: I\'d keep maybe £2,000 accessible as cash, and put the rest predominantly into a low-cost global index fund — because the evidence says diversified market exposure beats stock-picking for almost everyone, especially over decades. I\'d maybe allocate 10% to individual stocks I follow, honestly labelled as my \'learning budget\' rather than my wealth plan. The main thing I\'d avoid is doing nothing — at my age, time in the market is the single biggest advantage I have."',
      },
    ],
  },
  {
    group: 'Questions to Ask Them',
    icon: '🙋',
    intro: '"Do you have any questions for us?" is still the interview. Good questions show curiosity and preparation; bad ones (or none) undo a strong performance. Prepare 4-5 so you have spares if some get answered naturally.',
    items: [
      {
        q: 'Strong questions to ask (pick 2-3)',
        framework: 'Aim at their experience and judgement, not facts you could Google. Personal + specific + slightly forward-looking.',
        model: '• "What separated the spring week interns who got fast-tracked from the ones who didn\'t?" (shows conversion focus)\n• "What\'s something about working here that surprised you after you joined?" (gets real culture, not brochure culture)\n• "How has [specific live trend — e.g. AI adoption / this year\'s deal environment] changed the day-to-day in your team?" (shows commercial awareness)\n• "What do the best juniors you\'ve worked with have in common?" (shows coachability)\n• "What did you find hardest in your first year, and what helped?" (human, memorable, gets them talking)',
      },
      {
        q: 'Questions to never ask',
        framework: 'Anything about money, hours, or anything on the website.',
        model: '✗ "What\'s the salary/bonus?" (not at interview stage — negotiate after an offer, see the Networking scripts)\n✗ "How many hours will I work?" (legitimate concern, wrong venue — ask analysts privately at networking events instead)\n✗ "What does your firm do in [area]?" (it\'s on their website; this question is a self-report that you didn\'t prepare)\n✗ Nothing at all — always ask something. "You\'ve answered everything" reads as disengaged even when true; have a spare personal question ready.',
      },
    ],
  },
]

// ==================== FORMATS ====================

const formats = [
  {
    format: 'HireVue / Recorded Video Interview',
    icon: '📹',
    what: 'A question appears on screen; you get roughly 30 seconds to prepare, then 1-3 minutes to answer into your camera, usually 3-6 questions. No human, no reactions, no second chances per question. Used by most banks for spring weeks.',
    howToWin: [
      'Camera at eye level, light source in front of you (never behind), plain background, phone on silent. Look at the LENS while answering, not your own face on screen.',
      'Use the 30 seconds properly: jot 3 bullet beats on paper (allowed and expected), don\'t try to script full sentences.',
      'Talking to a camera feels dead — deliberately add ~20% more energy than feels natural. It reads as normal on the recording.',
      'Practise the exact format: record yourself with a random question and a 30-second timer at least 5 times before your first real one. The awkwardness burns off fast.',
      'Expect the classics: tell me about yourself, why us, a teamwork/leadership story, a commercial awareness question. Your Big Four prep covers most of it.',
    ],
  },
  {
    format: 'Phone / Live Video Screen',
    icon: '📞',
    what: 'A 20-30 minute conversation with HR or a junior banker — usually motivation questions, CV walkthrough, and one or two behaviourals. The goal is checking you\'re real, prepared, and worth an assessment centre slot.',
    howToWin: [
      'Have your CV, your firm research notes, and your story matrix physically in front of you — this is the one format where notes are usable. Glance, don\'t read.',
      'Stand up if on the phone — it genuinely changes your energy and pace.',
      'Get their name at the start and use it once or twice. Ask what their own role is — screeners are people, and most candidates treat them as gatekeepers.',
      'Close by asking about next steps and the timeline. It signals seriousness and gets you useful information.',
    ],
  },
  {
    format: 'Assessment Centre / Group Exercise',
    icon: '👥',
    what: 'A group of 4-8 candidates given a task — a case discussion, a prioritisation exercise, a mock pitch — while assessors watch how you operate. The core spring week filter at many firms. Crucial truth: you are NOT competing against your group; firms happily take several people from a good table and nobody from a bad one.',
    howToWin: [
      'Speak early — the first 2 minutes set your presence. Volunteering to keep time or structure the discussion ("shall we spend 5 minutes on X then decide?") earns instant credit without needing brilliance.',
      'Build on others by name: "Adding to Sarah\'s point..." is the single highest-scoring behaviour — it shows listening AND contribution simultaneously.',
      'Bring in quiet members: "We haven\'t heard from James — what do you think?" Assessors explicitly score inclusion.',
      'Never dominate, interrupt, or fight to win the argument. The candidate who "wins" the discussion but steamrolls the room fails; the one who makes the room work gets the offer.',
      'Watch the clock and land a conclusion. Groups that run out of time without deciding all score badly — being the person who says "we have 3 minutes, let\'s converge" is gold.',
    ],
  },
  {
    format: 'Final / Superday Interviews',
    icon: '🤝',
    what: 'Back-to-back interviews (2-4) with people of varying seniority — a mix of motivation, behavioural, commercial and light technical. For spring weeks these are friendlier than internship superdays but the bar for polish is real.',
    howToWin: [
      'Treat every interview as fresh — repeat your best stories with full energy even if it\'s the third telling; each interviewer scores independently.',
      'Adapt to seniority: juniors want to see you\'d be good to work with; seniors want motivation and spark. Ask juniors about day-to-day, seniors about direction and judgement.',
      'Get names/roles beforehand if possible and prepare one tailored question each.',
      'Send a short, specific thank-you email within 24 hours — the template is in Networking → Post-Interview Scripts.',
    ],
  },
]

// ==================== YEAR AHEAD ====================

const yearPlan = [
  {
    period: 'Now → August',
    title: 'Foundations & Ammunition',
    urgency: 'Build mode',
    actions: [
      'Get your CV to one clean page: education, activities, any work, skills. Run it through the CV Reviewer against "investment banking" and iterate until you\'re scoring 75+.',
      'Fix LinkedIn: proper photo, headline ("Second-year Economics @ X | Aspiring [division]"), and connect with 10-15 alumni in finance using the templates in Networking.',
      'Start the daily 15-minute markets habit TODAY — by September interviews you\'ll have months of compounded commercial awareness that can\'t be faked.',
      'Work through Develop Knowledge: Foundations, Accounting and Equity Markets units minimum; the IB career track if banking is the target.',
      'Draft your 6-story matrix (Technique tab) and your Big Four answers. Record yourself once to get a baseline.',
      'Build your target list: 12-18 firms across tiers — bulge brackets, elite boutiques, mid-market — plus which specific programme at each.',
    ],
  },
  {
    period: 'September',
    title: 'Applications Open — Speed Matters',
    urgency: 'CRITICAL',
    actions: [
      'Spring week applications open from early September and many are ROLLING — banks fill seats as they go. Applying in the first 2 weeks materially raises your odds. Set calendar alerts for each firm\'s open date now.',
      'As a 2nd year on a 4-year course you are squarely in the spring week target group — apply broadly. Also check each bank\'s summer internship eligibility: most want penultimate-year (your year 3), but some boutiques, smaller firms and insight programmes will take you — apply where eligible.',
      'Submit 3-4 applications per week, each genuinely tailored (the "could this go to a competitor?" test). Quality over spray — but volume still matters: 12+ applications is normal.',
      'Start psychometric practice in earnest: 3 practice tests a week in Online Test Practice, plus the free official SHL tests. Real tests arrive within days of applying.',
      'Register for every campus event/insight day your target firms run this term — they feed application credibility ("I spoke to X at your event") and occasionally fast-tracks.',
    ],
  },
  {
    period: 'October – November',
    title: 'Peak Season — Apply, Test, First Rounds',
    urgency: 'CRITICAL',
    actions: [
      'Finish remaining applications by mid-October where possible; some deadlines run to December but don\'t rely on late windows.',
      'Psychometric tests and HireVues arrive continuously now — never sit a real test cold; do a practice set the same day before each real one.',
      'Do your first 5 recorded HireVue-style practices before your first real video interview.',
      'First-round interviews begin. Before each: re-read your application for that firm (they will reference it), refresh your two news stories, prepare 2 firm-specific questions.',
      'Run the Full Assessment Day mode weekly as conditioning.',
      'Keep a tracker: firm, programme, date applied, test done, interview stage, contacts spoken to. Meeting Notes can hold your conversation notes.',
    ],
  },
  {
    period: 'December – January',
    title: 'Assessment Centres & Late Applications',
    urgency: 'High',
    actions: [
      'Assessment centres and final interviews concentrate here. Group exercise technique (Formats tab) matters as much as interview answers now — recruit friends for one mock group discussion if you can.',
      'Use the winter break deliberately: finish the IB career track in Develop Knowledge, complete all three capstone models (3-statement, LBO, DCF), and do a mock interview marathon week.',
      'Some spring weeks are still open in January — a strong late application beats no application.',
      'Offers start landing December-February. If rejections come first (they will — everyone\'s do), log them, request feedback where offered, and keep going: this is a numbers-and-persistence game and it only takes one yes.',
    ],
  },
  {
    period: 'February – March',
    title: 'Convert Offers Into Preparation',
    urgency: 'Moderate',
    actions: [
      'Final spring week offers arrive. Once confirmed: research that firm deeply — recent deals, divisional structure, people on LinkedIn who\'ll be hosting.',
      'Prepare for the spring week like an extended interview, because it is one: refresh technicals, sharpen your markets habit, prepare questions for every session type.',
      'No offers yet? Pivot immediately to plan B for the summer: insight days, small-firm/boutique internships (often hired informally through direct outreach — use the Networking cold email templates), society leadership, or a self-driven project. The goal is a strong penultimate-year application in September — many people who missed spring weeks still land internships.',
    ],
  },
  {
    period: 'April (Spring Week Time)',
    title: 'The Week That Decides Your Summer',
    urgency: 'CRITICAL',
    actions: [
      'The real purpose of a spring week is the fast-track interview for next summer\'s internship — often held during or immediately after the week. Treat every session accordingly.',
      'Be visibly engaged: front-half of the room, questions prepared for every session, names remembered and used.',
      'Network deliberately: aim for 2-3 genuine conversations per day, note them in Meeting Notes same-day, connect on LinkedIn with a personal message within 48 hours.',
      'Do the work tasks (there are usually small ones) exceptionally — they\'re watched more than they appear.',
      'Ask explicitly about the fast-track process early in the week so you can prepare for any conversion interview while there.',
      'Energy management is real: sleep properly that week. The candidate who fades on day 4 is remembered for day 4.',
    ],
  },
  {
    period: 'May – June',
    title: 'Exams + Conversion Interviews',
    urgency: 'High',
    actions: [
      'Conversion/fast-track interviews for summer internships often land in this window — technicals get more serious than spring week level. The capstones and IB track are your prep.',
      'Protect your grades: a 2:1 minimum is a hard filter at most firms; exams matter more than any networking event this month.',
      'If converted to a summer internship offer for next year: congratulations, you\'re done early — spend summer building skills, not applications.',
    ],
  },
  {
    period: 'Summer → September (Year 3)',
    title: 'The Penultimate-Year Launch',
    urgency: 'Build mode',
    actions: [
      'With or without a converted offer, penultimate-year summer internship applications open in August-September — earlier every year. These convert to full-time offers, making them the single most important applications of your degree.',
      'Spend summer on one substantive thing you can talk about: a small internship (any firm size), a research/investing project with written output, a coding-plus-finance project, or serious society leadership planning.',
      'Rerun this whole cycle from a stronger base: updated CV, deeper technicals, real interview experience, and a network that already knows you.',
    ],
  },
]

const weeklyRoutine = [
  { day: 'Every day', task: '15 min markets reading (FT/Bloomberg/Morning Brew) + keep your two "discussable stories" current', time: '15 min' },
  { day: '3x per week', task: 'Develop Knowledge lessons + Daily Review flashcards', time: '25 min' },
  { day: '2x per week', task: 'Online Test Practice (rotate categories; Full Assessment Day weekly in Oct-Nov)', time: '30 min' },
  { day: '2x per week', task: 'Interview Quiz session or one recorded answer to a random question', time: '20 min' },
  { day: 'Weekly', task: 'One application (tailored) during season, or 2-3 networking messages outside season', time: '60-90 min' },
  { day: 'Fortnightly', task: 'Mock interview with a friend or AI mock interviewer, with written feedback', time: '30 min' },
]

// ==================== COMPONENT ====================

export default function InterviewGuide() {
  const [active, setActive] = useState<Section>('Start From Zero')
  const [openQA, setOpenQA] = useState<string | null>(null)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">Interview Mastery</h1>
        <p className="text-gray-400">From zero interview experience to spring-week ready — how finance interviews actually work, the technique, every common question with a model answer, and a month-by-month plan for your year.</p>
      </div>

      {/* Section nav */}
      <div className="flex overflow-x-auto gap-1 mb-8 pb-1">
        {sections.map(s => (
          <button
            key={s}
            onClick={() => { setActive(s); window.scrollTo(0, 0) }}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              active === s ? 'bg-brand-gold text-black' : 'bg-brand-card border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ============ START FROM ZERO ============ */}
      {active === 'Start From Zero' && (
        <div className="space-y-8">
          <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-xl p-6">
            <h2 className="text-brand-gold font-bold text-lg mb-2">If you remember one thing</h2>
            <p className="text-gray-300 text-sm leading-relaxed">Finance interviews are not intelligence tests — they are <span className="text-white font-semibold">preparation tests</span>. Every question that will be asked is knowable in advance, every format is practisable, and the candidates who win are almost never the smartest in the room — they're the ones who treated preparation as a project. Starting from zero in second year is not behind; it's exactly on time.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">The process, start to finish</h2>
            <div className="space-y-3">
              {processStages.map((s, i) => (
                <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-5 flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-gold text-black font-bold text-sm flex items-center justify-center">{i + 1}</div>
                  <div>
                    <h3 className="text-white font-bold text-sm mb-1">{s.stage.replace(/^\d+\.\s/, '')}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">What they're actually assessing</h2>
            <p className="text-gray-500 text-sm mb-4">Every question maps to one of four buckets. Once you see the buckets, interviews stop being unpredictable.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {assessmentBuckets.map((b, i) => (
                <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-5">
                  <h3 className="text-brand-teal font-bold mb-1">{b.bucket}</h3>
                  <p className="text-gray-500 text-xs italic mb-2">{b.question}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{b.evidence}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">The golden rules</h2>
            <div className="space-y-3">
              {goldenRules.map((r, i) => (
                <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-5">
                  <h3 className="text-white font-bold text-sm mb-1">{i + 1}. {r.rule}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{r.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============ TECHNIQUE ============ */}
      {active === 'Technique' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">STAR — the behavioural answer structure</h2>
            <p className="text-gray-500 text-sm mb-4">Every "tell me about a time..." question gets this shape. The percentages are where your 60-90 seconds should go — most candidates drown in Situation and starve the Action.</p>
            <div className="grid sm:grid-cols-4 gap-3 mb-6">
              {starBreakdown.map(s => (
                <div key={s.letter} className="bg-brand-card border border-white/10 rounded-xl p-4">
                  <div className="text-3xl font-black text-brand-gold mb-1">{s.letter}</div>
                  <div className="text-white font-bold text-sm mb-1">{s.word} <span className="text-brand-teal text-xs">({s.timeShare})</span></div>
                  <p className="text-gray-400 text-xs leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>

            <div className="bg-brand-card border border-white/10 rounded-xl p-6">
              <p className="text-white font-semibold mb-4">{starExample.question}</p>
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 mb-2">
                <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1.5">✗ Weak answer</p>
                <p className="text-gray-400 text-sm italic leading-relaxed">{starExample.bad}</p>
              </div>
              <p className="text-gray-500 text-xs mb-4">{starExample.badWhy}</p>
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 mb-2">
                <p className="text-green-400 text-xs font-bold uppercase tracking-wider mb-1.5">✓ Strong answer</p>
                <p className="text-gray-300 text-sm leading-relaxed">{starExample.good}</p>
              </div>
              <p className="text-gray-500 text-xs">{starExample.goodWhy}</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Your 6-story matrix</h2>
            <p className="text-gray-500 text-sm mb-4">Six stories, known cold, cover practically every behavioural question ever asked. Write yours out this week — bullet the S/T/A/R beats for each, don't script sentences.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {storyMatrix.map((s, i) => (
                <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-5">
                  <h3 className="text-brand-gold font-bold text-sm mb-1">{s.competency}</h3>
                  <p className="text-gray-300 text-sm mb-2">{s.prompt}</p>
                  <p className="text-gray-600 text-xs">Where to find yours: {s.sources}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Delivery — the half nobody practises</h2>
            <div className="space-y-3">
              {deliveryTips.map((t, i) => (
                <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-5">
                  <h3 className="text-white font-bold text-sm mb-1">{t.tip}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{t.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">How to actually practise</h2>
            <div className="space-y-3">
              {practiceMethods.map((m, i) => (
                <div key={i} className="bg-brand-card border border-brand-teal/20 rounded-xl p-5">
                  <h3 className="text-brand-teal font-bold text-sm mb-1">{m.method}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{m.detail}{m.link && <> <Link to={m.link} className="text-brand-gold hover:underline">Open →</Link></>}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============ QUESTION BANK ============ */}
      {active === 'Question Bank & Model Answers' && (
        <div className="space-y-8">
          <div className="bg-brand-card border border-white/10 rounded-xl p-5">
            <p className="text-gray-300 text-sm leading-relaxed">Model answers below are calibrated to a second-year student with no finance work experience — which is exactly what interviewers expect at spring week level. <span className="text-white font-semibold">Use the structure, replace the content with YOUR specifics.</span> An interviewer who has heard a borrowed answer twice in one day will end your candidacy politely. Practise these live in the <Link to="/interview-quiz" className="text-brand-gold hover:underline">Interview Quiz</Link>.</p>
          </div>

          {questionBank.map(group => (
            <div key={group.group}>
              <h2 className="text-2xl font-bold text-white mb-1">{group.icon} {group.group}</h2>
              <p className="text-gray-500 text-sm mb-4">{group.intro}</p>
              <div className="space-y-3">
                {group.items.map((item, i) => {
                  const key = `${group.group}-${i}`
                  const isOpen = openQA === key
                  return (
                    <div key={i} className="bg-brand-card border border-white/10 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenQA(isOpen ? null : key)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left"
                      >
                        <span className="text-white font-semibold text-sm pr-4">{item.q}</span>
                        <span className="text-brand-gold flex-shrink-0">{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 border-t border-white/5 pt-4">
                          <p className="text-xs text-brand-teal font-bold uppercase tracking-wider mb-1">How to approach it</p>
                          <p className="text-gray-400 text-sm leading-relaxed mb-4">{item.framework}</p>
                          <p className="text-xs text-brand-gold font-bold uppercase tracking-wider mb-1">Model answer</p>
                          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{item.model}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============ FORMATS ============ */}
      {active === 'Formats & Assessment Centres' && (
        <div className="space-y-6">
          {formats.map((f, i) => (
            <div key={i} className="bg-brand-card border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-black text-lg mb-2">{f.icon} {f.format}</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{f.what}</p>
              <p className="text-xs text-brand-gold font-bold uppercase tracking-wider mb-2">How to win it</p>
              <ul className="space-y-2">
                {f.howToWin.map((tip, j) => (
                  <li key={j} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
                    <span className="text-brand-teal mt-0.5 flex-shrink-0">✓</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* ============ YEAR AHEAD ============ */}
      {active === 'Your Year Ahead' && (
        <div className="space-y-8">
          <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-xl p-6">
            <h2 className="text-brand-gold font-bold text-lg mb-2">Your situation, mapped</h2>
            <p className="text-gray-300 text-sm leading-relaxed">Second year of a four-year course means this year is your <span className="text-white font-semibold">spring week year</span> — you're squarely in the target group. The spring week converts (via fast-track interview) into next summer's penultimate-year internship, which converts into a full-time offer. That chain is the standard route into finance, and this year is its first link. Some internships are open to you now too (boutiques, insight programmes, firms without strict penultimate-year rules) — apply to those opportunistically, but spring weeks are the priority.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Month-by-month plan</h2>
            <div className="space-y-4">
              {yearPlan.map((p, i) => (
                <div key={i} className={`rounded-xl border p-6 ${p.urgency === 'CRITICAL' ? 'bg-brand-card border-brand-gold/40' : 'bg-brand-card border-white/10'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                    <h3 className="text-brand-gold font-black">{p.period}</h3>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      p.urgency === 'CRITICAL' ? 'bg-red-500/15 text-red-400' :
                      p.urgency === 'High' ? 'bg-orange-500/15 text-orange-400' :
                      p.urgency === 'Moderate' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-brand-teal/15 text-brand-teal'
                    }`}>{p.urgency}</span>
                  </div>
                  <h4 className="text-white font-bold mb-3">{p.title}</h4>
                  <ul className="space-y-2">
                    {p.actions.map((a, j) => (
                      <li key={j} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
                        <span className="text-brand-teal mt-0.5 flex-shrink-0">•</span> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Your weekly routine</h2>
            <p className="text-gray-500 text-sm mb-4">Roughly 4-5 hours a week, sustained from now until offers — consistency beats cramming by an enormous margin.</p>
            <div className="bg-brand-card border border-white/10 rounded-xl overflow-hidden">
              {weeklyRoutine.map((r, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-3.5 border-b border-white/5 last:border-0">
                  <span className="text-brand-gold font-bold text-xs w-24 flex-shrink-0 mt-0.5">{r.day}</span>
                  <span className="text-gray-300 text-sm flex-1">{r.task}</span>
                  <span className="text-gray-600 text-xs flex-shrink-0">{r.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-card border border-brand-teal/20 rounded-xl p-6">
            <h2 className="text-brand-teal font-bold text-lg mb-3">Your FINdr toolkit for each stage</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <p className="text-gray-300"><Link to="/cv-reviewer" className="text-brand-gold font-semibold hover:underline">CV Reviewer</Link> — before every application, with the real job description pasted in for ATS matching</p>
              <p className="text-gray-300"><Link to="/practice-tests" className="text-brand-gold font-semibold hover:underline">Online Test Practice</Link> — the psychometric stage that cuts most candidates</p>
              <p className="text-gray-300"><Link to="/interview-quiz" className="text-brand-gold font-semibold hover:underline">Interview Quiz</Link> — live practice on the questions in this guide</p>
              <p className="text-gray-300"><Link to="/learn" className="text-brand-gold font-semibold hover:underline">Develop Knowledge</Link> — technicals, capstone models and daily review</p>
              <p className="text-gray-300"><Link to="/networking" className="text-brand-gold font-semibold hover:underline">Networking</Link> — cold emails, LinkedIn templates, thank-you and negotiation scripts</p>
              <p className="text-gray-300"><Link to="/meeting-notes" className="text-brand-gold font-semibold hover:underline">Meeting Notes</Link> — log every coffee chat and spring week conversation same-day</p>
              <p className="text-gray-300"><Link to="/dashboard" className="text-brand-gold font-semibold hover:underline">Dashboard</Link> — watch your scores trend up across the year</p>
              <p className="text-gray-300"><Link to="/ai-skills" className="text-brand-gold font-semibold hover:underline">Develop AI Knowledge</Link> — the AI mock interviewer prompt + the "how do you use AI?" interview question</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
