export interface QuizOption {
  text: string;
  scores: { [careerId: string]: number };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What excites you most about working in finance?',
    options: [
      {
        text: 'Doing massive deals and advising companies on transformative transactions',
        scores: { 'investment-banking': 4, 'private-equity': 3, 'consulting': 2, 'venture-capital': 2 },
      },
      {
        text: 'Analysing markets and making investment calls that generate returns',
        scores: { 'hedge-fund': 4, 'trading': 3, 'portfolio-management': 3, 'equity-research': 3 },
      },
      {
        text: 'Building mathematical models and using data to find hidden signals',
        scores: { 'quantitative-finance': 5, 'risk-management': 2, 'actuarial': 3 },
      },
      {
        text: 'Helping people and businesses achieve their financial goals',
        scores: { 'financial-advisor': 5, 'fp-and-a': 3, 'consulting': 2 },
      },
      {
        text: 'Backing ambitious founders building the next generation of companies',
        scores: { 'venture-capital': 5, 'private-equity': 2, 'investment-banking': 1 },
      },
    ],
  },
  {
    id: 2,
    question: 'How do you prefer to work day-to-day?',
    options: [
      {
        text: 'High-pressure team environment, collaborating on complex projects with tight deadlines',
        scores: { 'investment-banking': 4, 'consulting': 4, 'trading': 3, 'private-equity': 3 },
      },
      {
        text: 'Independently — deep research, building models, following my own convictions',
        scores: { 'hedge-fund': 4, 'equity-research': 4, 'quantitative-finance': 3, 'portfolio-management': 3 },
      },
      {
        text: 'With data and code — solving problems programmatically',
        scores: { 'quantitative-finance': 5, 'risk-management': 2, 'fp-and-a': 2 },
      },
      {
        text: 'Face-to-face with clients — building long-term relationships',
        scores: { 'financial-advisor': 5, 'consulting': 3, 'venture-capital': 2 },
      },
      {
        text: 'In a structured, process-driven environment with clear frameworks',
        scores: { 'risk-management': 4, 'actuarial': 5, 'fp-and-a': 3 },
      },
    ],
  },
  {
    id: 3,
    question: 'What is your ideal lifestyle?',
    options: [
      {
        text: 'Work hard, play hard — big bonuses justify the brutal hours',
        scores: { 'investment-banking': 5, 'trading': 4, 'private-equity': 4 },
      },
      {
        text: 'Intense but with autonomy — I want to be rewarded for my ideas, not my hours',
        scores: { 'hedge-fund': 5, 'quantitative-finance': 4, 'portfolio-management': 3 },
      },
      {
        text: 'Constant travel and variety — I want to see different industries and clients',
        scores: { 'consulting': 5, 'investment-banking': 2, 'venture-capital': 2 },
      },
      {
        text: 'Good work-life balance with a clear separation between work and personal life',
        scores: { 'financial-advisor': 4, 'actuarial': 4, 'risk-management': 3, 'fp-and-a': 4 },
      },
      {
        text: 'Entrepreneurial — building something, with skin in the game',
        scores: { 'venture-capital': 4, 'private-equity': 3, 'financial-advisor': 2 },
      },
    ],
  },
  {
    id: 4,
    question: 'Which skill set best describes your current strengths or aspirations?',
    options: [
      {
        text: 'Excel modelling, PowerPoint, and financial analysis',
        scores: { 'investment-banking': 4, 'private-equity': 3, 'equity-research': 3, 'fp-and-a': 3 },
      },
      {
        text: 'Coding, Python, statistics, and machine learning',
        scores: { 'quantitative-finance': 5, 'risk-management': 3, 'trading': 2 },
      },
      {
        text: 'Communication, persuasion, and client relationship management',
        scores: { 'financial-advisor': 5, 'consulting': 4, 'venture-capital': 3 },
      },
      {
        text: 'Critical thinking, research, and forming strong investment views',
        scores: { 'hedge-fund': 5, 'equity-research': 4, 'portfolio-management': 4 },
      },
      {
        text: 'Risk assessment, probability, and technical problem solving',
        scores: { 'actuarial': 5, 'risk-management': 4, 'quantitative-finance': 3 },
      },
    ],
  },
  {
    id: 5,
    question: 'How do you feel about risk and uncertainty?',
    options: [
      {
        text: 'I thrive on it — I want to be on the right side of big bets',
        scores: { 'trading': 5, 'hedge-fund': 5, 'private-equity': 3, 'venture-capital': 4 },
      },
      {
        text: 'I like measured risk — thorough analysis first, then conviction',
        scores: { 'equity-research': 4, 'portfolio-management': 4, 'investment-banking': 3 },
      },
      {
        text: 'I prefer to quantify and manage risk rather than take it myself',
        scores: { 'risk-management': 5, 'actuarial': 5, 'quantitative-finance': 3 },
      },
      {
        text: 'I prefer a stable, predictable income and career trajectory',
        scores: { 'financial-advisor': 3, 'fp-and-a': 4, 'actuarial': 3, 'consulting': 2 },
      },
      {
        text: 'I accept high risk for the chance of life-changing upside (carry, carry, carry)',
        scores: { 'private-equity': 5, 'venture-capital': 5, 'hedge-fund': 3 },
      },
    ],
  },
  {
    id: 6,
    question: 'What kind of impact do you want to have?',
    options: [
      {
        text: 'Help companies grow, merge, and raise capital for expansion',
        scores: { 'investment-banking': 5, 'private-equity': 4, 'consulting': 3 },
      },
      {
        text: 'Back the entrepreneurs and startups that will change the world',
        scores: { 'venture-capital': 5, 'private-equity': 2, 'consulting': 1 },
      },
      {
        text: 'Help individuals and families build financial security',
        scores: { 'financial-advisor': 5, 'fp-and-a': 1 },
      },
      {
        text: 'Drive better decision-making inside businesses I care about',
        scores: { 'fp-and-a': 5, 'consulting': 3, 'private-equity': 2 },
      },
      {
        text: 'Improve market efficiency and generate returns through better analysis',
        scores: { 'hedge-fund': 4, 'equity-research': 4, 'quantitative-finance': 4, 'portfolio-management': 3 },
      },
    ],
  },
  {
    id: 7,
    question: 'How important is prestige and brand name to you?',
    options: [
      {
        text: 'Very important — I want to work at the most recognised name in finance',
        scores: { 'investment-banking': 5, 'consulting': 4, 'private-equity': 3 },
      },
      {
        text: 'Important, but I care more about the quality of the work and team',
        scores: { 'hedge-fund': 4, 'private-equity': 4, 'equity-research': 3 },
      },
      {
        text: 'I prefer to be judged on my performance, not my employer\'s name',
        scores: { 'trading': 4, 'quantitative-finance': 4, 'hedge-fund': 3 },
      },
      {
        text: 'Prestige matters less to me than building genuine expertise over time',
        scores: { 'actuarial': 4, 'risk-management': 3, 'financial-advisor': 3, 'fp-and-a': 3 },
      },
      {
        text: 'I want to build my own name and reputation, not someone else\'s',
        scores: { 'venture-capital': 4, 'financial-advisor': 3 },
      },
    ],
  },
  {
    id: 8,
    question: 'How do you feel about academic study and professional qualifications?',
    options: [
      {
        text: 'I love structured learning — I would happily sit exams for years if it leads to the right career',
        scores: { 'actuarial': 5, 'portfolio-management': 3, 'risk-management': 3 },
      },
      {
        text: 'I prefer learning on the job — real experience beats textbooks',
        scores: { 'trading': 4, 'investment-banking': 3, 'venture-capital': 3 },
      },
      {
        text: 'I am excited by cutting-edge research — I might consider a PhD',
        scores: { 'quantitative-finance': 5, 'risk-management': 2, 'actuarial': 2 },
      },
      {
        text: 'I like a combination — practical work plus a respected designation (CFA, CPA)',
        scores: { 'portfolio-management': 4, 'equity-research': 4, 'fp-and-a': 3, 'financial-advisor': 3 },
      },
      {
        text: 'I learn best through doing — problem-solving in real situations',
        scores: { 'consulting': 4, 'private-equity': 3, 'hedge-fund': 3 },
      },
    ],
  },
  {
    id: 9,
    question: 'What type of companies or deals most interest you?',
    options: [
      {
        text: 'Large-cap M&A, IPOs, and mega-deals in banking and corporates',
        scores: { 'investment-banking': 5, 'private-equity': 3, 'trading': 2 },
      },
      {
        text: 'Mature businesses with strong cash flows that can be optimised',
        scores: { 'private-equity': 5, 'fp-and-a': 2, 'portfolio-management': 2 },
      },
      {
        text: 'High-growth early-stage startups disrupting traditional industries',
        scores: { 'venture-capital': 5, 'hedge-fund': 1 },
      },
      {
        text: 'Public market stocks — finding undervalued or overvalued companies',
        scores: { 'equity-research': 5, 'hedge-fund': 4, 'portfolio-management': 4, 'trading': 3 },
      },
      {
        text: 'Insurance, pensions, and institutional risk management',
        scores: { 'actuarial': 5, 'risk-management': 4, 'portfolio-management': 2 },
      },
    ],
  },
  {
    id: 10,
    question: 'What most appeals to you about the buy-side vs sell-side divide?',
    options: [
      {
        text: 'Sell-side — advising clients, executing transactions, and being at the heart of deal flow',
        scores: { 'investment-banking': 5, 'equity-research': 4, 'trading': 3 },
      },
      {
        text: 'Buy-side — deploying capital, making investment decisions, and reaping the upside',
        scores: { 'hedge-fund': 5, 'private-equity': 5, 'portfolio-management': 4, 'venture-capital': 4 },
      },
      {
        text: 'Neither — I want to be inside a corporation driving strategy',
        scores: { 'fp-and-a': 5, 'risk-management': 3, 'consulting': 2 },
      },
      {
        text: 'I\'m agnostic — I care more about the role than the side',
        scores: { 'quantitative-finance': 3, 'actuarial': 2, 'financial-advisor': 2, 'risk-management': 2 },
      },
    ],
  },
  {
    id: 11,
    question: 'How do you approach a complex problem?',
    options: [
      {
        text: 'Structure it into a framework, gather data, and work through it systematically',
        scores: { 'consulting': 5, 'risk-management': 3, 'fp-and-a': 3 },
      },
      {
        text: 'Build a model — quantify everything and let the numbers guide the answer',
        scores: { 'quantitative-finance': 5, 'investment-banking': 3, 'actuarial': 4, 'equity-research': 3 },
      },
      {
        text: 'Develop a thesis based on deep research and test it against the market',
        scores: { 'hedge-fund': 5, 'equity-research': 4, 'portfolio-management': 3 },
      },
      {
        text: 'Talk to people — experts, founders, and customers know things models don\'t',
        scores: { 'venture-capital': 5, 'financial-advisor': 4, 'consulting': 3 },
      },
      {
        text: 'Act fast with the information available — speed matters in my environment',
        scores: { 'trading': 5, 'investment-banking': 3 },
      },
    ],
  },
  {
    id: 12,
    question: 'Where do you see yourself in 15 years?',
    options: [
      {
        text: 'Running my own fund, family office, or investment firm',
        scores: { 'hedge-fund': 5, 'private-equity': 4, 'portfolio-management': 3, 'venture-capital': 4 },
      },
      {
        text: 'CFO or Group Finance Director of a major corporation',
        scores: { 'fp-and-a': 5, 'investment-banking': 2, 'consulting': 2 },
      },
      {
        text: 'Partner at a top-tier PE or VC firm',
        scores: { 'private-equity': 5, 'venture-capital': 5 },
      },
      {
        text: 'Chief Risk Officer or Chief Actuary of a major institution',
        scores: { 'risk-management': 5, 'actuarial': 5 },
      },
      {
        text: 'Building a successful financial advisory practice with loyal clients',
        scores: { 'financial-advisor': 5 },
      },
      {
        text: 'Head of research or a senior portfolio manager at a respected fund',
        scores: { 'equity-research': 4, 'portfolio-management': 5, 'hedge-fund': 3 },
      },
    ],
  },
  {
    id: 13,
    question: 'Which of these activities would you find most satisfying on a regular basis?',
    options: [
      {
        text: 'Closing a major transaction after months of hard work',
        scores: { 'investment-banking': 5, 'private-equity': 4, 'venture-capital': 3 },
      },
      {
        text: 'Seeing a stock pitch play out exactly as your thesis predicted',
        scores: { 'hedge-fund': 5, 'equity-research': 5, 'portfolio-management': 4 },
      },
      {
        text: 'Discovering a new quantitative signal that generates consistent alpha',
        scores: { 'quantitative-finance': 5, 'trading': 4, 'risk-management': 2 },
      },
      {
        text: 'Helping a client retire comfortably with a plan you built for them',
        scores: { 'financial-advisor': 5, 'fp-and-a': 2 },
      },
      {
        text: 'Building a rigorous risk model that protects the firm during a market crisis',
        scores: { 'risk-management': 5, 'actuarial': 5, 'quantitative-finance': 3 },
      },
    ],
  },
];
