// Content for the CV → Interview Coach. Regex patterns are stored as strings
// and compiled in src/lib/cvParse.ts.

export interface Competency { id: string; label: string; icon: string; keywords: string[]; whatTheyTest: string; addIdeas: string[] }
export interface BehaviouralQuestion { id: string; competency: string; question: string; whatTheyTest: string; modelAnswer: string; keyPoints: string[] }
export interface StandoutSignal { id: string; label: string; pattern: string; why: string; howToAdd: string }
export interface WeakPhrase { pattern: string; fix: string }
export interface SizingStep { label: string; given: string; question: string; answer: number; unit: string; tolerancePct: number; working: string }
export interface SizingCase { id: string; title: string; approach: string; steps: SizingStep[]; soWhat: string }
export interface ScenarioOption { text: string; rank: number; why: string }
export interface Scenario { id: string; situation: string; options: ScenarioOption[] }
export interface PsychometricType { name: string; what: string; how: string[] }

export const competencies: Competency[] = [
  {
    "id": "leadership",
    "label": "Leadership",
    "icon": "🧭",
    "keywords": [
      "led ",
      "lead ",
      "leading",
      "captain",
      "president",
      "chair",
      "head of",
      "founded",
      "managed a",
      "organised",
      "organized",
      "coordinated",
      "committee",
      "mentor",
      "supervised",
      "trained",
      "delegated",
      "oversaw",
      "ran the",
      "ran a"
    ],
    "whatTheyTest": "Can you take ownership of a group outcome, make decisions and bring people with you — without needing a formal title?",
    "addIdeas": [
      "Stand for a committee role in a society you already attend — treasurer or events lead are the easiest to win and the most finance-relevant.",
      "Run one thing end to end this term: a society talk, a charity event, a study group. Small and finished beats big and vague.",
      "Mentor a first-year through your department's peer mentoring scheme — it counts and takes an hour a fortnight."
    ]
  },
  {
    "id": "teamwork",
    "label": "Teamwork",
    "icon": "🤝",
    "keywords": [
      "team",
      "collaborat",
      "group",
      "together",
      "peers",
      "colleagues",
      "squad",
      "partnered",
      "cross-functional",
      "worked with",
      "alongside"
    ],
    "whatTheyTest": "Do you make a team better — sharing work, handling friction, and putting the outcome ahead of your own credit?",
    "addIdeas": [
      "Enter a team case competition or stock pitch — it gives you a teamwork story AND a finance one.",
      "Make sure group coursework on your CV says what YOU did inside the team, not just that a team existed.",
      "A part-time job with shifts is a strong teamwork source — add one line on how the team handled a busy period."
    ]
  },
  {
    "id": "resilience",
    "label": "Resilience & setbacks",
    "icon": "🔁",
    "keywords": [
      "despite",
      "overcame",
      "setback",
      "failed",
      "rejected",
      "recovered",
      "adapted",
      "persever",
      "learned from",
      "improved",
      "resit",
      "second attempt",
      "turned around",
      "bounced back"
    ],
    "whatTheyTest": "When something genuinely goes wrong, do you own it, learn from it and change what you do — or blame circumstances?",
    "addIdeas": [
      "You don't need to add an activity for this — you need a story. Pick a real rejection, poor grade or failed project and write down what you changed afterwards.",
      "Track your own application season: every rejection and what you did differently next time is a ready-made resilience answer.",
      "If a grade improved between years, that improvement IS the story — make sure the CV shows both numbers."
    ]
  },
  {
    "id": "persuasion",
    "label": "Persuasion & conflict",
    "icon": "🗣️",
    "keywords": [
      "persuad",
      "negotiat",
      "convinc",
      "pitched",
      "proposal",
      "secured",
      "sponsor",
      "debate",
      "influenc",
      "won over",
      "agreement",
      "resolved",
      "mediat"
    ],
    "whatTheyTest": "Can you change someone's mind with evidence rather than volume, and handle disagreement without damaging the relationship?",
    "addIdeas": [
      "Secure a sponsor for a society event — even £100 from a local business is a real negotiation story with a number attached.",
      "Join debating or a mooting society for a term.",
      "In group projects, note the moment the group changed direction because of a point you made — that's the story."
    ]
  },
  {
    "id": "pressure",
    "label": "Pressure & prioritising",
    "icon": "⏱️",
    "keywords": [
      "deadline",
      "alongside",
      "while studying",
      "part-time",
      "part time",
      "balanc",
      "juggl",
      "simultaneous",
      "under pressure",
      "busy",
      "shifts",
      "hours per week",
      "hours a week",
      "exam"
    ],
    "whatTheyTest": "Can you deliver several things at once to a deadline, prioritise sensibly, and flag early when something is going to slip?",
    "addIdeas": [
      "If you work part-time during term, put the hours on your CV ('15 hrs/week alongside full-time study') — it's instant evidence.",
      "Note any period where you delivered coursework, a job and a society role in the same week.",
      "Spring week application season itself is a pressure story — track how you managed 20 applications alongside exams."
    ]
  },
  {
    "id": "initiative",
    "label": "Initiative & drive",
    "icon": "🚀",
    "keywords": [
      "founded",
      "launched",
      "started",
      "created",
      "built",
      "set up",
      "self-taught",
      "independently",
      "own initiative",
      "proposed",
      "introduced",
      "pioneered",
      "taught myself",
      "developed"
    ],
    "whatTheyTest": "Do you do things nobody asked you to? Interviewers want evidence you'll go beyond the task list.",
    "addIdeas": [
      "Start something small you can finish in 6 weeks: a markets newsletter, a stock pitch write-up, a Python script that tracks a portfolio.",
      "Teach yourself one finance skill with a visible output — build a DCF on a real company and put it on your CV as a project.",
      "Propose an improvement at your part-time job and record the result."
    ]
  },
  {
    "id": "detail",
    "label": "Attention to detail",
    "icon": "🔍",
    "keywords": [
      "accura",
      "reconcil",
      "audit",
      "checked",
      "error",
      "data entry",
      "compliance",
      "cash handling",
      "stock count",
      "proofread",
      "quality",
      "precision",
      "verified",
      "cashing up"
    ],
    "whatTheyTest": "Banks lose money on small errors. They want evidence you check your work, catch mistakes and care about precision.",
    "addIdeas": [
      "Cash handling or stock-taking at a part-time job is genuine evidence — say how much and how accurately ('reconciled a £3k daily till with zero discrepancies').",
      "Practise the Checking & Attention to Detail tests in Online Test Practice — some firms screen on exactly this.",
      "Proofread or edit for a student publication."
    ]
  },
  {
    "id": "communication",
    "label": "Communication",
    "icon": "📢",
    "keywords": [
      "present",
      "explained",
      "wrote",
      "newsletter",
      "blog",
      "public speaking",
      "customer",
      "client",
      "tutor",
      "teach",
      "workshop",
      "article",
      "spoke",
      "pitch"
    ],
    "whatTheyTest": "Can you explain complex things simply and adapt to your audience? Every client-facing role depends on this.",
    "addIdeas": [
      "Tutor a GCSE or A-level student — it's paid, flexible, and a perfect 'explaining complexity' story.",
      "Write one short markets piece a month for a society newsletter or your own LinkedIn.",
      "Volunteer to present your group's findings next time — that single presentation becomes the story."
    ]
  },
  {
    "id": "commercial",
    "label": "Commercial awareness & interest in finance",
    "icon": "📈",
    "keywords": [
      "invest",
      "portfolio",
      "stock",
      "market",
      "trading",
      "finance society",
      "investment society",
      "valuation",
      "economics",
      "deal",
      "m&a",
      "bloomberg",
      "financial times",
      " ft ",
      "equity",
      "bond"
    ],
    "whatTheyTest": "Is your interest in finance real and evidenced, or just stated? 'I'm passionate about finance' with nothing behind it fails.",
    "addIdeas": [
      "Join your university's investment or finance society and go to the actual sessions — then write down one thing you learned from each.",
      "Follow 2-3 live deals a week and keep a one-line note on why each happened. That becomes your 'deal you've followed' answer.",
      "Do a free virtual job simulation (Forage hosts many from banks) — it's quick and gives you something concrete to talk about."
    ]
  },
  {
    "id": "analytical",
    "label": "Analytical & numerical",
    "icon": "🧮",
    "keywords": [
      "excel",
      "model",
      "analys",
      "data",
      "python",
      "sql",
      "statistic",
      "forecast",
      "dcf",
      "calculated",
      "spreadsheet",
      "quantitative",
      "research",
      "regression"
    ],
    "whatTheyTest": "Can you work with numbers and data accurately and reach a sensible conclusion? Every finance role screens on this.",
    "addIdeas": [
      "Build a DCF or comparable-companies model on a real listed company and list it as a project.",
      "Learn the core Excel functions (XLOOKUP, INDEX-MATCH, SUMIFS, pivot tables) and say so specifically — 'advanced Excel' alone means nothing.",
      "Use a dissertation or coursework that involved data, and lead the bullet with the method and the finding."
    ]
  }
]

export const behaviouralQuestions: BehaviouralQuestion[] = [
  {
    "id": "walk",
    "competency": "narrative",
    "question": "Walk me through your CV.",
    "whatTheyTest": "Can you tell a coherent two-minute story that ends with why this role makes sense — rather than reciting a list?",
    "modelAnswer": "I'm a second-year Economics student at Warwick. I got interested in markets in sixth form when I started following the FTSE for an economics project, and that's what pushed me towards Economics. At university I joined the Investment Society, and this year I'm treasurer, which means I manage our £2,000 budget and organise our speaker events. Alongside my degree I work 12 hours a week at a café, which has taught me a lot about working under pressure with a team. Over the summer I built a DCF model on Tesco to teach myself valuation, and that's what made me realise I want to do this properly — I enjoyed the analysis, but I enjoyed forming a view even more. That's why I'm applying for this spring week: I want to see how that kind of thinking is applied on a real deal team.",
    "keyPoints": [
      "About two minutes, structured as a story with a through-line",
      "Two or three experiences, each with a concrete detail or number",
      "Ends by connecting naturally to why THIS role",
      "Cuts anything that doesn't support the story"
    ]
  },
  {
    "id": "leadership",
    "competency": "leadership",
    "question": "Tell me about a time you led a team or took responsibility for a group outcome.",
    "whatTheyTest": "Ownership of an outcome, decisions under uncertainty, and bringing others with you.",
    "modelAnswer": "Situation: as events lead for my university's Finance Society, I was responsible for our biggest event of the year — a panel with three alumni from banking. Two weeks before, one panellist dropped out and ticket sales were only at 40% of our target. Task: I needed to save the event without our committee's budget increasing. Action: I first replaced the speaker by messaging alumni on LinkedIn, and secured a replacement within four days. Then I split promotion across the committee by year group, so each person owned one specific audience, rather than everyone posting the same thing. I tracked sign-ups daily and moved effort to whichever channel was working. Result: we sold out at 120 tickets, 20% above our original target, and the format of giving each committee member one audience is now what the society uses for every event.",
    "keyPoints": [
      "A real problem, not just 'I was in charge'",
      "Specific decisions YOU made, in your own words",
      "How you got others to act, not just what you did yourself",
      "A measurable result and something that changed afterwards"
    ]
  },
  {
    "id": "teamwork",
    "competency": "teamwork",
    "question": "Describe a time you worked in a team to achieve something difficult.",
    "whatTheyTest": "Whether you make the team better — sharing load, handling friction, crediting others.",
    "modelAnswer": "Situation: in a second-year group project, five of us had to build and present a valuation of a listed retailer in three weeks. By the end of week one we'd duplicated work and nobody owned the final model. Task: we needed one coherent model and a presentation, and I took on coordinating it. Action: I proposed we split by section — revenue build, costs, valuation, and presentation — with one owner each, and I took the valuation because it depended on everyone else's numbers. I set up one shared spreadsheet with clearly linked tabs and a short check-in every two days. When one teammate was falling behind because of a job interview, I took half of their section rather than letting the whole timeline slip. Result: we delivered on time and scored 72, the highest in our seminar group, and I learned that agreeing who owns what at the start matters more than how hard anyone works.",
    "keyPoints": [
      "Show the difficulty, not just that a team existed",
      "Your specific role within the team",
      "Supporting a teammate rather than just your own task",
      "Credit the team and state what you learned about teams"
    ]
  },
  {
    "id": "resilience",
    "competency": "resilience",
    "question": "Tell me about a time you failed or faced a setback. What did you learn?",
    "whatTheyTest": "Honesty, ownership, and genuine change in behaviour afterwards. A fake failure is spotted instantly.",
    "modelAnswer": "Situation: last year I applied to twelve spring weeks and was rejected by all twelve, mostly at the online test stage. Task: I needed to work out whether this was bad luck or something I was doing wrong. Action: I went back through every rejection and noticed I'd failed the numerical tests at almost every firm that used them. I'd been taking them late at night, untimed, with no preparation. So I set aside thirty minutes every day for a month to practise timed numerical tests, focusing on the question types I kept getting wrong — percentage change and reading data tables. Result: this cycle I've passed the online tests at every firm so far. What I took from it is that I'd been treating a failure as a verdict rather than as data — now, when something goes wrong, the first thing I do is look for the pattern.",
    "keyPoints": [
      "A real failure, owned without blaming circumstances",
      "How you diagnosed the actual cause",
      "A specific change in behaviour, not just 'I learned to work harder'",
      "Evidence the change worked"
    ]
  },
  {
    "id": "persuasion",
    "competency": "persuasion",
    "question": "Tell me about a time you persuaded someone or handled a disagreement.",
    "whatTheyTest": "Influence through evidence and listening — not through volume or authority.",
    "modelAnswer": "Situation: on our society committee, the president wanted to spend most of our budget on one large networking ball. I thought a series of smaller skills workshops would serve our members better. Task: I wanted to change the plan without creating a split on the committee. Action: rather than arguing in the meeting, I first asked the president what he wanted the ball to achieve — and it was mainly getting more first-years involved. So I surveyed our members, and 70% of first-years said they wanted practical sessions like CV reviews and Excel training. I brought that back as a proposal that met his goal rather than opposing it: three workshops plus a smaller social at the end. Result: the committee voted for it, first-year attendance doubled compared with the previous year, and the president and I ended up running the workshops together.",
    "keyPoints": [
      "Understand the other person's goal before arguing",
      "Use evidence rather than opinion",
      "Frame your proposal around their objective",
      "Preserve the relationship — show how it ended"
    ]
  },
  {
    "id": "pressure",
    "competency": "pressure",
    "question": "Describe a time you had to manage competing deadlines or work under pressure.",
    "whatTheyTest": "Prioritisation, planning, and the maturity to flag problems early rather than silently miss deadlines.",
    "modelAnswer": "Situation: in January I had two coursework deadlines in the same week, my society was running its largest event, and I was working twelve hours a week at my part-time job. Task: I needed to deliver all of it without dropping quality on the coursework, which mattered most. Action: I listed everything with its deadline and how much it really mattered, and accepted I couldn't do it all at the same level. I asked my manager three weeks in advance to swap two shifts to the following week, and handed the event's social media to another committee member with a clear brief. I then blocked my mornings for coursework only. Result: I submitted both pieces on time and got a 68 and a 71, the event went ahead as planned, and I learned that asking for help early is far easier than explaining a missed deadline later.",
    "keyPoints": [
      "Several genuinely competing demands",
      "A clear method for prioritising",
      "Delegating or renegotiating early rather than heroics",
      "Outcome on each, plus what you'd keep doing"
    ]
  },
  {
    "id": "initiative",
    "competency": "initiative",
    "question": "Tell me about something you've achieved that you're proud of — that nobody asked you to do.",
    "whatTheyTest": "Self-starting drive. Firms want people who go beyond the task list without being told.",
    "modelAnswer": "Situation: after my first term, I realised I understood valuation theory from lectures but had never actually built a model. Task: I wanted to prove to myself I could take a real company from raw accounts to a valuation. Action: I picked Tesco because I understood the business, downloaded three years of its annual reports, and built a three-statement model and DCF in Excel over the Christmas break, using free online guides and checking my approach against equity research notes. When my first valuation came out far above the share price, I traced it to an unrealistic margin assumption and rebuilt it. Result: I finished with a valuation within about 10% of the market price, I now explain DCFs confidently in interviews, and I've since used the same template to analyse two other companies.",
    "keyPoints": [
      "Something genuinely self-initiated",
      "Why you started it — the motivation",
      "An obstacle you hit and how you solved it",
      "A concrete result you can be questioned on"
    ]
  },
  {
    "id": "detail",
    "competency": "detail",
    "question": "Give an example of when attention to detail made a difference.",
    "whatTheyTest": "Whether you check your work and catch errors before they cost money.",
    "modelAnswer": "Situation: at my part-time job I was responsible for cashing up the till at the end of each shift — usually around £2,500 a day. Task: the café had a recurring problem with small unexplained shortfalls. Action: rather than just counting at the end, I started recording card and cash totals separately at two points in the day, so if there was a gap I could narrow down when it happened. After two weeks I noticed every shortfall happened on days with refunds, and traced it to refunds being processed to the card machine but not logged on the till. I suggested a simple refund log, which the manager adopted. Result: the shortfalls stopped completely, and the manager asked me to train two new staff on cashing up.",
    "keyPoints": [
      "Real numbers and stakes",
      "A method for checking, not just 'I was careful'",
      "Finding a root cause rather than just spotting an error",
      "A lasting improvement"
    ]
  },
  {
    "id": "communication",
    "competency": "communication",
    "question": "Tell me about a time you explained something complex to someone without your background.",
    "whatTheyTest": "Adapting to your audience — vital in every client-facing role.",
    "modelAnswer": "Situation: I tutor a GCSE maths student, and she was really struggling with percentages, particularly reverse percentages. Task: I needed to explain it in a way that actually stuck, because the textbook explanation clearly wasn't working. Action: I stopped using the formula and started with something she cared about — prices in a sale. If a jacket is £64 after 20% off, what was it originally? She instinctively added 20% back and got £76.80, so we checked it together and saw it was wrong. That moment of her finding the mistake herself did more than any explanation. Then I showed her that 'after 20% off' means she's left with 80%, so she divides by 0.8. Result: she got every reverse percentage question right in her mock, and I've used the same approach — start from their world, let them find the error — when explaining finance to friends.",
    "keyPoints": [
      "Identify what made it hard for THIS person",
      "Start from their frame of reference",
      "Check understanding rather than assume it",
      "Evidence it worked"
    ]
  },
  {
    "id": "commercial",
    "competency": "commercial",
    "question": "Why finance? What have you done to show your interest?",
    "whatTheyTest": "Genuine, evidenced interest — the strongest predictor of who survives the job.",
    "modelAnswer": "My interest started with something specific: following the Royal Mail takeover saga in sixth form and wondering why a company would sell itself rather than fix its own problems. Since then I've tried to test that interest rather than just state it. I joined the Investment Society and pitched a stock at our annual competition, I built a DCF on Tesco to understand how valuation actually works, and I now follow two or three deals a week and keep a short note on why each one happened. What draws me to banking specifically is that it sits at the moment of the decision — you're helping a company decide whether to buy, sell or raise money, and you have to understand both the numbers and the strategy. The work I've enjoyed most so far is exactly that combination.",
    "keyPoints": [
      "A specific origin, not 'I've always loved finance'",
      "Two or three concrete actions that EVIDENCE the interest",
      "Why this specific area of finance",
      "Links back to what you've enjoyed doing"
    ]
  },
  {
    "id": "analytical",
    "competency": "analytical",
    "question": "Tell me about a time you used data or numbers to solve a problem.",
    "whatTheyTest": "Comfort with numbers and reaching a sensible, evidence-based conclusion.",
    "modelAnswer": "Situation: our Investment Society's event attendance had been falling for a year, and the committee assumed it was because of the time slot. Task: before we changed everything, I wanted to check whether that was actually the cause. Action: I pulled our sign-up and attendance data for the last fifteen events into a spreadsheet and compared attendance against day, time, topic and speaker type. The time slot made almost no difference. What mattered was the topic: technical skills sessions averaged 65 attendees, while general talks averaged 25. Result: we rebuilt the term's programme around skills sessions and average attendance rose from 30 to 55. It taught me to test the assumption the group already believes before acting on it.",
    "keyPoints": [
      "A real question with real data",
      "Your method of analysis",
      "A finding that challenged an assumption",
      "A decision taken because of it, with the result"
    ]
  }
]

export const standoutSignals: StandoutSignal[] = [
  {
    "id": "experience",
    "label": "Spring week, insight day or internship",
    "pattern": "spring (week|insight)|insight (day|programme|program)|internship|summer analyst|work experience|work placement",
    "why": "The strongest single signal on a finance CV. Many banks convert a large share of their graduate intake from spring week and internship attendees.",
    "howToAdd": "Apply to spring weeks and insight days the moment they open — many close early on a rolling basis. If you're too late this cycle, a one-day insight event still counts."
  },
  {
    "id": "virtual",
    "label": "Virtual job simulation",
    "pattern": "forage|virtual (work )?experience|job simulation|bright network",
    "why": "Quick, free proof of interest — and gives you a concrete task to discuss in interview.",
    "howToAdd": "Complete one finance job simulation on Forage (several banks host them). It takes a few hours and gives you a specific talking point."
  },
  {
    "id": "society",
    "label": "Finance / investment society",
    "pattern": "(finance|investment|investing|trading|economics|fintech|banking) society|investment club|finance club",
    "why": "Baseline evidence of interest. Expected rather than impressive — but its absence is noticed.",
    "howToAdd": "Join your university's investment or finance society and actually attend. Write down one thing you learned from each session for interviews."
  },
  {
    "id": "role",
    "label": "Leadership or committee position",
    "pattern": "president|treasurer|vice[- ]president|head of|committee|secretary|captain|chair|lead(er)? of",
    "why": "Turns 'I was a member' into 'I was responsible for something'. Directly feeds leadership questions.",
    "howToAdd": "Stand for a committee role in a society you already attend. Treasurer is especially relevant for finance — you'll manage a real budget."
  },
  {
    "id": "pitch",
    "label": "Stock pitch, investment or case competition",
    "pattern": "stock pitch|pitched (a )?stock|investment competition|trading (challenge|competition)|case competition|investment challenge",
    "why": "Gives you a finance story, a teamwork story and a 'pitch me a stock' answer all at once.",
    "howToAdd": "Enter your society's stock pitch or a national student investment competition this term — even a first-round finish is worth listing."
  },
  {
    "id": "modelling",
    "label": "Excel / financial modelling",
    "pattern": "excel|financial model|dcf|lbo|three[- ]statement|xlookup|vlookup|index[- ]match|pivot",
    "why": "Core analyst skill. 'Advanced Excel' alone is ignored — specific functions and real models are not.",
    "howToAdd": "Build a DCF on one real listed company and list it as a project, naming the specific techniques you used."
  },
  {
    "id": "coding",
    "label": "Python / VBA / SQL",
    "pattern": "python|vba|sql|programming|coding|pandas",
    "why": "Increasingly expected in trading, quant and markets roles; a genuine differentiator elsewhere.",
    "howToAdd": "Write one small Python project — e.g. a script that pulls share prices and tracks a mock portfolio — and put it on GitHub."
  },
  {
    "id": "bloomberg",
    "label": "Bloomberg / market data",
    "pattern": "bloomberg|\\bbmc\\b|refinitiv|capital iq|factset",
    "why": "Shows you've touched the tools used on the desk.",
    "howToAdd": "Check whether your library has a Bloomberg terminal and complete Bloomberg Market Concepts (BMC) — it's self-paced and recognised."
  },
  {
    "id": "qualification",
    "label": "Finance qualification or course",
    "pattern": "\\bcfa\\b|\\bimc\\b|investment foundations|\\bacca\\b|\\bcima\\b|\\baca\\b",
    "why": "Signals commitment, especially for asset management and investment roles.",
    "howToAdd": "CFA Institute offers a free Investment Foundations course — achievable alongside a degree and a credible addition."
  },
  {
    "id": "investing",
    "label": "Personal investing or market writing",
    "pattern": "personal portfolio|my own portfolio|invest(ed|ing) personally|newsletter|blog|market commentary|substack|articles? on",
    "why": "The most convincing proof that interest is genuine — and endless interview material.",
    "howToAdd": "Write one short markets piece a month on LinkedIn or for a society newsletter. Three pieces is enough to list."
  },
  {
    "id": "job",
    "label": "Part-time job",
    "pattern": "part[- ]time|barista|retail|waiter|waitress|cashier|sales assistant|tutor|shifts|bartender|warehouse",
    "why": "Underrated. Shows work ethic, reliability and customer-facing skills — and supplies pressure, teamwork and detail stories.",
    "howToAdd": "If you have one, add the weekly hours and one quantified achievement. If not, tutoring is flexible and well paid."
  },
  {
    "id": "grades",
    "label": "Grades stated",
    "pattern": "first[- ]class|\\b1st\\b|2:1|2\\.1|a\\*|\\baaa\\b|predicted|grade|gpa|\\d{2}%",
    "why": "Many firms screen on grades first. Leaving them off reads as hiding something.",
    "howToAdd": "State your predicted or current degree classification and A-level grades explicitly."
  }
]

export const weakPhrases: WeakPhrase[] = [
  {
    "pattern": "responsible for",
    "fix": "Say what you actually did: 'Led', 'Ran', 'Managed', 'Owned'."
  },
  {
    "pattern": "helped( to)?",
    "fix": "Name your contribution: 'Built', 'Delivered', 'Produced', 'Cut … by …'."
  },
  {
    "pattern": "assisted( with| in)?",
    "fix": "Replace with the specific action you took."
  },
  {
    "pattern": "worked on",
    "fix": "Use 'Built', 'Analysed', 'Designed' or 'Produced', and add the outcome."
  },
  {
    "pattern": "involved in",
    "fix": "State your actual role and what changed because of you."
  },
  {
    "pattern": "participated in",
    "fix": "Say what you did inside it, not that you attended."
  },
  {
    "pattern": "duties included",
    "fix": "Lead with the outcome, not the job description."
  },
  {
    "pattern": "tasked with",
    "fix": "Lead with what you delivered."
  },
  {
    "pattern": "various",
    "fix": "Be specific — name them or give a number."
  },
  {
    "pattern": "hard[- ]?working|team player|passionate about|detail[- ]oriented|self[- ]motivated|excellent communication",
    "fix": "A cliché claims a trait; a bullet with evidence proves it. Delete it and let a result show it instead."
  }
]

export const sizingFramework: { step: string; detail: string }[] = [
  {
    "step": "Clarify",
    "detail": "Repeat the question back and pin down the scope: which geography, which time period (per day or per year?), volume or value (cups or £?). Ten seconds here prevents answering the wrong question."
  },
  {
    "step": "Structure",
    "detail": "Say your approach out loud before any maths: 'I'll go top-down from population' or 'bottom-up from one shop'. Interviewers mark the structure more than the final number."
  },
  {
    "step": "Segment",
    "detail": "Split the population where behaviour genuinely differs — adults vs children, peak vs off-peak hours, members vs non-members. One or two splits is enough; five is showing off."
  },
  {
    "step": "Estimate",
    "detail": "Use round, defensible numbers and say why you chose each one. Round aggressively (9m not 8.9m) so the arithmetic stays clean and fast."
  },
  {
    "step": "Sanity-check",
    "detail": "Test the answer from a second angle — per shop, per person, or against something you know. This is the step most candidates skip and the one that impresses most."
  },
  {
    "step": "So what?",
    "detail": "Finish with what the number means: is the market big enough to enter? Is the shop viable? Turn the estimate into a recommendation."
  }
]

export const sizingPitfalls: string[] = [
  "Diving into maths before saying your structure — the interviewer can't follow and can't give you credit.",
  "Mixing up per-day and per-year halfway through. Write the unit next to every number.",
  "False precision: '2,316,600 cups' sounds less credible than 'about 2.3 million'.",
  "Silently changing an assumption when the answer looks wrong. Say 'that feels high — let me revisit my frequency assumption'.",
  "Stopping at the number. Always add the sanity check and the 'so what'."
]

export const sizingCases: SizingCase[] = [
  {
    "id": "coffee",
    "title": "How many coffees are bought in London every day?",
    "approach": "Top-down: population → coffee drinkers → cups → share bought out",
    "steps": [
      {
        "label": "Adults in London",
        "given": "London has about 9 million people, and roughly 78% are adults.",
        "question": "How many adults is that?",
        "answer": 7020000,
        "unit": "people",
        "tolerancePct": 3,
        "working": "9,000,000 × 0.78 = 7,020,000 — call it about 7 million."
      },
      {
        "label": "Daily coffee drinkers",
        "given": "Assume 55% of adults drink coffee every day.",
        "question": "How many daily coffee drinkers?",
        "answer": 3861000,
        "unit": "people",
        "tolerancePct": 4,
        "working": "7,020,000 × 0.55 = 3,861,000 — about 3.9 million."
      },
      {
        "label": "Cups drunk per day",
        "given": "A daily drinker has about 2 cups a day.",
        "question": "How many cups are drunk per day in total?",
        "answer": 7722000,
        "unit": "cups",
        "tolerancePct": 4,
        "working": "3,861,000 × 2 = 7,722,000 — about 7.7 million cups."
      },
      {
        "label": "Cups bought out",
        "given": "Assume 30% of cups are bought from a shop rather than made at home or work.",
        "question": "How many coffees are bought per day?",
        "answer": 2316600,
        "unit": "cups",
        "tolerancePct": 5,
        "working": "7,722,000 × 0.30 = 2,316,600 — about 2.3 million coffees a day."
      },
      {
        "label": "Sanity check",
        "given": "Assume London has about 4,000 coffee shops.",
        "question": "How many coffees does that imply per shop per day?",
        "answer": 579,
        "unit": "cups per shop",
        "tolerancePct": 5,
        "working": "2,316,600 ÷ 4,000 ≈ 579 a day. Over a ten-hour day that's roughly one a minute — busy but believable for London, so the estimate holds."
      }
    ],
    "soWhat": "About 2.3 million coffees a day. If you're asked whether a new chain should enter, the next question is share: winning even 1% is roughly 23,000 cups a day."
  },
  {
    "id": "gym",
    "title": "What is the annual size of the UK gym membership market?",
    "approach": "Top-down: adults → members → annual spend",
    "steps": [
      {
        "label": "Gym members",
        "given": "The UK has about 53 million adults. Assume 17% have a gym membership.",
        "question": "How many gym members?",
        "answer": 9010000,
        "unit": "members",
        "tolerancePct": 3,
        "working": "53,000,000 × 0.17 = 9,010,000 — about 9 million members."
      },
      {
        "label": "Spend per member per year",
        "given": "Assume an average membership of £35 a month.",
        "question": "What does one member spend a year?",
        "answer": 420,
        "unit": "£",
        "tolerancePct": 1,
        "working": "£35 × 12 = £420 a year."
      },
      {
        "label": "Market size",
        "given": "Combine the two.",
        "question": "What is the annual market size in £?",
        "answer": 3784200000,
        "unit": "£",
        "tolerancePct": 4,
        "working": "9,010,000 × £420 = £3,784,200,000 — about £3.8 billion a year."
      },
      {
        "label": "Sanity check",
        "given": "Assume there are about 7,000 gyms in the UK.",
        "question": "How many members per gym does that imply?",
        "answer": 1287,
        "unit": "members per gym",
        "tolerancePct": 5,
        "working": "9,010,000 ÷ 7,000 ≈ 1,287 members per gym. Budget chains have several thousand and small studios a few hundred, so this average is plausible."
      }
    ],
    "soWhat": "Roughly a £3.8bn market. Note the biggest sensitivity: the 17% penetration. Moving it by 3 points moves the market by about £670m — say that out loud, it shows you know which assumption matters most."
  },
  {
    "id": "sandwich",
    "title": "What is the annual revenue of a busy sandwich shop in the City of London?",
    "approach": "Bottom-up: customers per hour → daily revenue → annual",
    "steps": [
      {
        "label": "Peak customers",
        "given": "The shop is open 12 hours. Over the 5 peak hours (breakfast and lunch) it serves about 120 customers an hour.",
        "question": "How many peak customers per day?",
        "answer": 600,
        "unit": "customers",
        "tolerancePct": 1,
        "working": "5 × 120 = 600 customers."
      },
      {
        "label": "Off-peak customers",
        "given": "Over the other 7 hours it serves about 30 customers an hour.",
        "question": "How many off-peak customers per day?",
        "answer": 210,
        "unit": "customers",
        "tolerancePct": 1,
        "working": "7 × 30 = 210 customers."
      },
      {
        "label": "Daily revenue",
        "given": "Total customers × an average spend of £6.50.",
        "question": "What is daily revenue?",
        "answer": 5265,
        "unit": "£",
        "tolerancePct": 2,
        "working": "(600 + 210) = 810 customers × £6.50 = £5,265 a day."
      },
      {
        "label": "Annual revenue",
        "given": "Assume the shop trades about 360 days a year.",
        "question": "What is annual revenue?",
        "answer": 1895400,
        "unit": "£",
        "tolerancePct": 3,
        "working": "£5,265 × 360 = £1,895,400 — about £1.9 million a year."
      },
      {
        "label": "Sanity check",
        "given": "Divide daily revenue by opening hours.",
        "question": "What is the average revenue per hour?",
        "answer": 439,
        "unit": "£ per hour",
        "tolerancePct": 3,
        "working": "£5,265 ÷ 12 ≈ £439 an hour — around 67 sandwiches an hour on average, which fits a busy City shop with a lunchtime queue."
      }
    ],
    "soWhat": "About £1.9m a year. A sharp extension: City shops lose most of their weekend trade, so challenge your own 360 days — on weekdays only (about 250 days) it's nearer £1.3m. Volunteering that is exactly what makes an answer stand out."
  }
]

export const psychometricTypes: PsychometricType[] = [
  {
    "name": "Situational judgement tests (SJTs)",
    "what": "Realistic workplace scenarios — rank or rate possible responses. They measure judgement against the firm's values, not knowledge.",
    "how": [
      "Read the firm's values page before the test: the 'best' answer is the one that fits their culture.",
      "Default priorities: integrity and client interest first, then escalate appropriately, then solve it yourself within your authority.",
      "Never pick the option that conceals a problem, ignores it, or acts far above your role.",
      "Practise in Online Test Practice → Situational Judgement."
    ]
  },
  {
    "name": "Personality questionnaires",
    "what": "Statements you agree or disagree with ('I prefer to plan ahead'). Used to check fit and to steer interview questions.",
    "how": [
      "Answer honestly and consistently — they repeat similar items to detect people trying to game them.",
      "Before starting, picture yourself at your best at work, and answer as that person.",
      "Avoid extreme answers on everything; a profile of all 'strongly agree' looks inconsistent.",
      "Expect the interviewer to probe your results — have an example ready for your strongest traits."
    ]
  },
  {
    "name": "Game-based assessments",
    "what": "Short games measuring traits like risk appetite, attention, memory and how you learn from feedback. Several banks use them.",
    "how": [
      "There's no single 'right' play — most measure your consistency and style, not a score.",
      "Do them rested, in a quiet place, on a laptop if allowed, with phone notifications off.",
      "Read every instruction screen; most mistakes come from rushing the rules.",
      "Don't over-strategise. Play naturally and stay consistent."
    ]
  },
  {
    "name": "Video / immersive assessments",
    "what": "Scenario-based 'day in the life' tasks combining SJT questions, short written replies and recorded answers.",
    "how": [
      "Treat written replies like work emails: clear, polite, decision first.",
      "Use the same judgement priorities as SJTs.",
      "Practise recorded answers in Video / HireVue Practice."
    ]
  }
]

export const sjtPrinciples: { rule: string; detail: string }[] = [
  {
    "rule": "Integrity is non-negotiable",
    "detail": "Any option that conceals an error, misleads a client or bends a rule is wrong — even if it's convenient or the boss suggested it."
  },
  {
    "rule": "Disclose problems early",
    "detail": "Raising an issue the moment you spot it beats fixing it quietly later. Banks fear surprises more than mistakes."
  },
  {
    "rule": "Act within your authority",
    "detail": "Do what's in your role yourself; escalate what isn't. Don't freelance on decisions above your level, and don't escalate trivia."
  },
  {
    "rule": "Challenge privately and respectfully",
    "detail": "Disagree with a colleague one-to-one, with evidence, before going over their head — unless it's an ethical or compliance issue, which goes straight to the right channel."
  },
  {
    "rule": "The client and the team come before your own credit",
    "detail": "Options that protect your reputation at the team's expense are rarely best."
  }
]

export const scenarios: Scenario[] = [
  {
    "id": "error",
    "situation": "The night before a client meeting, you spot an error in a slide you prepared. The pitch book has already been sent to the managing director for final review. It's 10pm.",
    "options": [
      {
        "text": "Fix the slide and email your associate immediately, flagging exactly what changed and why.",
        "rank": 1,
        "why": "Fast, transparent, and goes to the person who owns the book — they can decide whether to tell the MD."
      },
      {
        "text": "Email the managing director directly with the corrected slide.",
        "rank": 2,
        "why": "Transparent, but skips your associate, who is accountable for the book and may already be making changes."
      },
      {
        "text": "Wait until the morning and mention it to your associate before the meeting.",
        "rank": 3,
        "why": "Honest, but leaves almost no time to correct and reprint before the client sees it."
      },
      {
        "text": "Quietly replace the slide in the shared drive without telling anyone.",
        "rank": 4,
        "why": "Conceals the problem — someone may already have printed the old version. Concealment is always the worst answer."
      }
    ]
  },
  {
    "id": "colleague",
    "situation": "A fellow intern tells you they've been rounding hours on their timesheet up to make it look like they work longer. They ask you not to mention it.",
    "options": [
      {
        "text": "Encourage them to correct it themselves, and explain that if they don't you'll have to raise it with your manager.",
        "rank": 1,
        "why": "Gives them the chance to fix it while being clear that integrity matters more than loyalty."
      },
      {
        "text": "Report it to your manager straight away.",
        "rank": 2,
        "why": "Correct outcome, but skips a reasonable chance for them to put it right first."
      },
      {
        "text": "Say nothing — it's not your business.",
        "rank": 3,
        "why": "Leaves a known integrity issue unaddressed, and you now share the knowledge."
      },
      {
        "text": "Start rounding your own hours too so you don't look less committed.",
        "rank": 4,
        "why": "Joins in the dishonesty. Always the worst option."
      }
    ]
  },
  {
    "id": "deadlines",
    "situation": "Two senior bankers each give you an urgent task due by 9am tomorrow. You realise you can only do one to a good standard.",
    "options": [
      {
        "text": "Tell both bankers straight away, explain the clash, and ask them to agree the priority.",
        "rank": 1,
        "why": "Raises the conflict early and lets the people with authority decide — the classic best answer."
      },
      {
        "text": "Ask your associate or staffer which task should take priority.",
        "rank": 2,
        "why": "Sensible escalation; slightly less direct than telling both bankers, who may want to rearrange themselves."
      },
      {
        "text": "Work through the night and do both as best you can.",
        "rank": 3,
        "why": "Well-intentioned, but risks two poor pieces of work and hides the problem."
      },
      {
        "text": "Pick the more senior banker's task and do the other one next week without telling anyone.",
        "rank": 4,
        "why": "Decides priority unilaterally and silently misses a deadline."
      }
    ]
  },
  {
    "id": "client",
    "situation": "A client calls asking for a figure from a model you've built. Your associate, who normally handles the client, is on leave, and you're not certain the figure is final.",
    "options": [
      {
        "text": "Thank the client, tell them you'll confirm the figure today, then check with the VP before replying.",
        "rank": 1,
        "why": "Responsive to the client without sending unverified numbers — and uses the right senior person."
      },
      {
        "text": "Ask the client to wait until your associate is back next week.",
        "rank": 2,
        "why": "Avoids risk but gives the client poor service when someone else could help."
      },
      {
        "text": "Send the figure, noting it may change.",
        "rank": 3,
        "why": "A caveat doesn't undo the damage of a wrong number reaching a client."
      },
      {
        "text": "Send the figure without mentioning any uncertainty.",
        "rank": 4,
        "why": "Puts unverified information in front of the client as if it were final."
      }
    ]
  }
]
