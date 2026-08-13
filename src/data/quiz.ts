export interface QuizOption {
  text: string;
  scores: { [careerId: string]: number };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export interface QuizQuestionGroup {
  dimension: string;
  variants: QuizQuestion[];
}

// Each group probes one underlying "dimension" of fit (motivation, work
// style, risk appetite, etc). Each variant is a different phrasing/scenario
// for that same dimension with an equivalent score distribution, so retaking
// the quiz draws a different question per dimension instead of the exact
// same 18 questions every time.
export const quizQuestionGroups: QuizQuestionGroup[] = [
  {
    "dimension": "motivation",
    "variants": [
      {
        "id": 1,
        "question": "What excites you most about working in finance?",
        "options": [
          {
            "text": "Doing massive deals and advising companies on transformative transactions",
            "scores": {
              "investment-banking": 4,
              "private-equity": 3,
              "consulting": 2,
              "venture-capital": 2
            }
          },
          {
            "text": "Analysing markets and making investment calls that generate returns",
            "scores": {
              "hedge-fund": 4,
              "trading": 3,
              "portfolio-management": 3,
              "equity-research": 3
            }
          },
          {
            "text": "Building mathematical models and using data to find hidden signals",
            "scores": {
              "quantitative-finance": 5,
              "risk-management": 2,
              "actuarial": 3
            }
          },
          {
            "text": "Helping people and businesses achieve their financial goals",
            "scores": {
              "financial-advisor": 5,
              "fp-and-a": 3,
              "consulting": 2
            }
          },
          {
            "text": "Backing ambitious founders building the next generation of companies",
            "scores": {
              "venture-capital": 5,
              "private-equity": 2,
              "investment-banking": 1
            }
          }
        ]
      },
      {
        "id": 2,
        "question": "If you could only keep one part of a finance career, what would it be?",
        "options": [
          {
            "text": "Being in the room when a huge transaction gets negotiated and signed",
            "scores": {
              "investment-banking": 4,
              "private-equity": 3,
              "restructuring": 2,
              "venture-capital": 2
            }
          },
          {
            "text": "Having a strong view on where markets are heading and being proven right",
            "scores": {
              "hedge-fund": 4,
              "trading": 4,
              "portfolio-management": 3,
              "equity-research": 2
            }
          },
          {
            "text": "Solving a genuinely hard quantitative puzzle nobody else has cracked",
            "scores": {
              "quantitative-finance": 5,
              "actuarial": 2,
              "risk-management": 2
            }
          },
          {
            "text": "Watching a client's financial situation visibly improve because of your advice",
            "scores": {
              "financial-advisor": 5,
              "private-banking": 3,
              "fp-and-a": 2
            }
          },
          {
            "text": "Spotting the founder or company everyone else missed, early",
            "scores": {
              "venture-capital": 5,
              "private-equity": 2
            }
          }
        ]
      },
      {
        "id": 3,
        "question": "Picture your best possible day at work in ten years. What is happening?",
        "options": [
          {
            "text": "You close a landmark deal after months of pitching, modelling and negotiation",
            "scores": {
              "investment-banking": 4,
              "private-equity": 3,
              "consulting": 2
            }
          },
          {
            "text": "A trade you conviction-sized months ago plays out exactly as you predicted",
            "scores": {
              "hedge-fund": 4,
              "trading": 4,
              "portfolio-management": 3
            }
          },
          {
            "text": "A model you built quietly generates value nobody else can replicate",
            "scores": {
              "quantitative-finance": 5,
              "equity-research": 2,
              "risk-management": 2
            }
          },
          {
            "text": "A long-standing client thanks you for setting them up for a secure retirement",
            "scores": {
              "financial-advisor": 5,
              "private-banking": 3,
              "family-office": 2
            }
          },
          {
            "text": "A company you backed at seed stage announces a transformative funding round",
            "scores": {
              "venture-capital": 5,
              "private-equity": 2
            }
          }
        ]
      }
    ]
  },
  {
    "dimension": "work-style",
    "variants": [
      {
        "id": 4,
        "question": "How do you prefer to work day-to-day?",
        "options": [
          {
            "text": "High-pressure team environment, collaborating on complex projects with tight deadlines",
            "scores": {
              "investment-banking": 4,
              "consulting": 4,
              "trading": 3,
              "private-equity": 3
            }
          },
          {
            "text": "Independently — deep research, building models, following my own convictions",
            "scores": {
              "hedge-fund": 4,
              "equity-research": 4,
              "quantitative-finance": 3,
              "portfolio-management": 3
            }
          },
          {
            "text": "With data and code — solving problems programmatically",
            "scores": {
              "quantitative-finance": 5,
              "risk-management": 2,
              "fp-and-a": 2
            }
          },
          {
            "text": "Face-to-face with clients — building long-term relationships",
            "scores": {
              "financial-advisor": 5,
              "consulting": 3,
              "venture-capital": 2
            }
          },
          {
            "text": "In a structured, process-driven environment with clear frameworks",
            "scores": {
              "risk-management": 4,
              "actuarial": 5,
              "fp-and-a": 3
            }
          }
        ]
      },
      {
        "id": 5,
        "question": "Which of these team setups sounds most appealing?",
        "options": [
          {
            "text": "A deal team pulling all-nighters together under a shared deadline",
            "scores": {
              "investment-banking": 4,
              "consulting": 3,
              "private-equity": 3
            }
          },
          {
            "text": "A small desk where your own research and conviction drive the decisions",
            "scores": {
              "hedge-fund": 4,
              "equity-research": 3,
              "portfolio-management": 3
            }
          },
          {
            "text": "A quant team where the best-tested model wins the argument, not seniority",
            "scores": {
              "quantitative-finance": 5,
              "risk-management": 2
            }
          },
          {
            "text": "A relationship-driven practice where clients trust you personally, not just your firm",
            "scores": {
              "financial-advisor": 5,
              "private-banking": 4,
              "venture-capital": 2
            }
          },
          {
            "text": "A control function with clear procedures everyone is expected to follow precisely",
            "scores": {
              "risk-management": 4,
              "compliance": 4,
              "actuarial": 3
            }
          }
        ]
      },
      {
        "id": 6,
        "question": "A new project lands on your desk with a loose brief. What is your instinct?",
        "options": [
          {
            "text": "Rally the team, split the workstreams and push hard to a deadline together",
            "scores": {
              "investment-banking": 4,
              "consulting": 4,
              "trading": 2
            }
          },
          {
            "text": "Go away and form your own view before discussing it with anyone",
            "scores": {
              "hedge-fund": 4,
              "equity-research": 4,
              "portfolio-management": 3
            }
          },
          {
            "text": "Turn it into a data problem and build something that answers it systematically",
            "scores": {
              "quantitative-finance": 5,
              "fp-and-a": 2,
              "risk-management": 2
            }
          },
          {
            "text": "Get on a call with the people affected before doing anything else",
            "scores": {
              "financial-advisor": 4,
              "consulting": 3,
              "venture-capital": 3
            }
          },
          {
            "text": "Check what the established process or precedent says to do first",
            "scores": {
              "actuarial": 5,
              "risk-management": 4,
              "compliance": 3
            }
          }
        ]
      }
    ]
  },
  {
    "dimension": "lifestyle",
    "variants": [
      {
        "id": 7,
        "question": "What is your ideal lifestyle?",
        "options": [
          {
            "text": "Work hard, play hard — big bonuses justify the brutal hours",
            "scores": {
              "investment-banking": 5,
              "trading": 4,
              "private-equity": 4
            }
          },
          {
            "text": "Intense but with autonomy — I want to be rewarded for my ideas, not my hours",
            "scores": {
              "hedge-fund": 5,
              "quantitative-finance": 4,
              "portfolio-management": 3
            }
          },
          {
            "text": "Constant travel and variety — I want to see different industries and clients",
            "scores": {
              "consulting": 5,
              "investment-banking": 2,
              "venture-capital": 2
            }
          },
          {
            "text": "Good work-life balance with a clear separation between work and personal life",
            "scores": {
              "financial-advisor": 4,
              "actuarial": 4,
              "risk-management": 3,
              "fp-and-a": 4
            }
          },
          {
            "text": "Entrepreneurial — building something, with skin in the game",
            "scores": {
              "venture-capital": 4,
              "private-equity": 3,
              "financial-advisor": 2
            }
          }
        ]
      },
      {
        "id": 8,
        "question": "How would you honestly want to trade off hours versus pay early in your career?",
        "options": [
          {
            "text": "80+ hour weeks for the fastest possible learning curve and biggest paycheque",
            "scores": {
              "investment-banking": 5,
              "trading": 3,
              "private-equity": 4
            }
          },
          {
            "text": "Long hours are fine if my own performance, not the clock, decides my reward",
            "scores": {
              "hedge-fund": 5,
              "quantitative-finance": 3,
              "portfolio-management": 3
            }
          },
          {
            "text": "Full-on but varied — different cities, teams and problems every few months",
            "scores": {
              "consulting": 5,
              "venture-capital": 2
            }
          },
          {
            "text": "Sustainable hours and predictability matter more to me than a bigger bonus",
            "scores": {
              "actuarial": 5,
              "fp-and-a": 4,
              "risk-management": 3,
              "financial-advisor": 3
            }
          },
          {
            "text": "I would trade a stable salary for genuine ownership and upside",
            "scores": {
              "venture-capital": 4,
              "private-equity": 3
            }
          }
        ]
      },
      {
        "id": 9,
        "question": "Which weekly rhythm would actually make you happy, being honest?",
        "options": [
          {
            "text": "Unpredictable, deal-driven, sometimes brutal — I want the intensity",
            "scores": {
              "investment-banking": 5,
              "restructuring": 4,
              "private-equity": 3
            }
          },
          {
            "text": "Market hours, sharp and demanding, but genuinely over when the market closes",
            "scores": {
              "trading": 5,
              "commodities-trading": 3,
              "fixed-income": 2
            }
          },
          {
            "text": "Deep, quiet, research-heavy days with occasional bursts of intensity around calls",
            "scores": {
              "hedge-fund": 4,
              "equity-research": 4,
              "quantitative-finance": 3
            }
          },
          {
            "text": "Steady and predictable, so I can plan my life around my job, not the other way round",
            "scores": {
              "actuarial": 5,
              "fp-and-a": 4,
              "compliance": 4
            }
          },
          {
            "text": "Flexible and relationship-led — my calendar follows my clients, not a desk",
            "scores": {
              "financial-advisor": 4,
              "private-banking": 4,
              "venture-capital": 2
            }
          }
        ]
      }
    ]
  },
  {
    "dimension": "skills",
    "variants": [
      {
        "id": 10,
        "question": "Which skill set best describes your current strengths or aspirations?",
        "options": [
          {
            "text": "Excel modelling, PowerPoint, and financial analysis",
            "scores": {
              "investment-banking": 4,
              "private-equity": 3,
              "equity-research": 3,
              "fp-and-a": 3
            }
          },
          {
            "text": "Coding, Python, statistics, and machine learning",
            "scores": {
              "quantitative-finance": 5,
              "risk-management": 3,
              "trading": 2
            }
          },
          {
            "text": "Communication, persuasion, and client relationship management",
            "scores": {
              "financial-advisor": 5,
              "consulting": 4,
              "venture-capital": 3
            }
          },
          {
            "text": "Critical thinking, research, and forming strong investment views",
            "scores": {
              "hedge-fund": 5,
              "equity-research": 4,
              "portfolio-management": 4
            }
          },
          {
            "text": "Risk assessment, probability, and technical problem solving",
            "scores": {
              "actuarial": 5,
              "risk-management": 4,
              "quantitative-finance": 3
            }
          }
        ]
      },
      {
        "id": 11,
        "question": "If a friend described your genuine strengths honestly, what would they say?",
        "options": [
          {
            "text": "You can build a clean, detailed financial model faster than most people twice your age",
            "scores": {
              "investment-banking": 4,
              "private-equity": 3,
              "fp-and-a": 3
            }
          },
          {
            "text": "You would rather write code to solve a problem than do it by hand",
            "scores": {
              "quantitative-finance": 5,
              "risk-management": 2,
              "trading": 2
            }
          },
          {
            "text": "You can walk into a room of strangers and have them trusting you within minutes",
            "scores": {
              "financial-advisor": 5,
              "consulting": 3,
              "venture-capital": 3
            }
          },
          {
            "text": "You form strong, well-reasoned opinions and are rarely swayed without good evidence",
            "scores": {
              "hedge-fund": 5,
              "equity-research": 4,
              "portfolio-management": 3
            }
          },
          {
            "text": "You are the person who thinks about what could go wrong before anyone else does",
            "scores": {
              "actuarial": 5,
              "risk-management": 4,
              "compliance": 3
            }
          }
        ]
      },
      {
        "id": 12,
        "question": "Which of these would you most like to be genuinely excellent at?",
        "options": [
          {
            "text": "Building a three-statement model from scratch, cell by cell, under time pressure",
            "scores": {
              "investment-banking": 4,
              "private-equity": 4,
              "equity-research": 3
            }
          },
          {
            "text": "Writing production-grade code that trades or prices something real",
            "scores": {
              "quantitative-finance": 5,
              "trading": 3
            }
          },
          {
            "text": "Reading a room and knowing exactly what a client actually needs to hear",
            "scores": {
              "financial-advisor": 5,
              "private-banking": 3,
              "consulting": 3
            }
          },
          {
            "text": "Forming a differentiated view on a company before the market catches up",
            "scores": {
              "hedge-fund": 5,
              "equity-research": 4,
              "portfolio-management": 3
            }
          },
          {
            "text": "Pricing an outcome nobody has ever observed, using only probability and judgement",
            "scores": {
              "actuarial": 5,
              "insurance-underwriting": 4,
              "risk-management": 3
            }
          }
        ]
      }
    ]
  },
  {
    "dimension": "risk",
    "variants": [
      {
        "id": 13,
        "question": "How do you feel about risk and uncertainty?",
        "options": [
          {
            "text": "I thrive on it — I want to be on the right side of big bets",
            "scores": {
              "trading": 5,
              "hedge-fund": 5,
              "private-equity": 3,
              "venture-capital": 4
            }
          },
          {
            "text": "I like measured risk — thorough analysis first, then conviction",
            "scores": {
              "equity-research": 4,
              "portfolio-management": 4,
              "investment-banking": 3
            }
          },
          {
            "text": "I prefer to quantify and manage risk rather than take it myself",
            "scores": {
              "risk-management": 5,
              "actuarial": 5,
              "quantitative-finance": 3
            }
          },
          {
            "text": "I prefer a stable, predictable income and career trajectory",
            "scores": {
              "financial-advisor": 3,
              "fp-and-a": 4,
              "actuarial": 3,
              "consulting": 2
            }
          },
          {
            "text": "I accept high risk for the chance of life-changing upside (carry, carry, carry)",
            "scores": {
              "private-equity": 5,
              "venture-capital": 5,
              "hedge-fund": 3
            }
          }
        ]
      },
      {
        "id": 14,
        "question": "You have £10,000 of your own savings to invest for ten years. What is your instinct?",
        "options": [
          {
            "text": "Concentrate it in a handful of high-conviction bets and check them constantly",
            "scores": {
              "trading": 5,
              "hedge-fund": 5,
              "venture-capital": 3
            }
          },
          {
            "text": "Research thoroughly, then commit to a smaller number of well-understood positions",
            "scores": {
              "equity-research": 4,
              "portfolio-management": 4,
              "investment-banking": 2
            }
          },
          {
            "text": "Build a model to size positions properly and hedge the downside first",
            "scores": {
              "quantitative-finance": 4,
              "risk-management": 5,
              "actuarial": 3
            }
          },
          {
            "text": "Put it somewhere safe and steady — I would rather not think about it day to day",
            "scores": {
              "fp-and-a": 4,
              "actuarial": 4,
              "financial-advisor": 3
            }
          },
          {
            "text": "Put it into something illiquid with huge asymmetric upside and forget it for years",
            "scores": {
              "private-equity": 5,
              "venture-capital": 5
            }
          }
        ]
      },
      {
        "id": 15,
        "question": "A position you hold falls 15% overnight on no new information. What do you do first?",
        "options": [
          {
            "text": "Size up if my conviction hasn't changed — a discount is an opportunity",
            "scores": {
              "hedge-fund": 5,
              "trading": 4,
              "venture-capital": 2
            }
          },
          {
            "text": "Re-check the thesis calmly against the original research before doing anything",
            "scores": {
              "equity-research": 5,
              "portfolio-management": 4,
              "investment-banking": 2
            }
          },
          {
            "text": "Check whether my risk limits or hedges are still doing their job",
            "scores": {
              "risk-management": 5,
              "quantitative-finance": 3,
              "actuarial": 3
            }
          },
          {
            "text": "Feel uncomfortable — I would rather not be exposed to swings like that at all",
            "scores": {
              "fp-and-a": 4,
              "actuarial": 3,
              "compliance": 3
            }
          },
          {
            "text": "Shrug — illiquid, long-term positions are not supposed to be checked overnight",
            "scores": {
              "private-equity": 4,
              "venture-capital": 4
            }
          }
        ]
      }
    ]
  },
  {
    "dimension": "impact",
    "variants": [
      {
        "id": 16,
        "question": "What kind of impact do you want to have?",
        "options": [
          {
            "text": "Help companies grow, merge, and raise capital for expansion",
            "scores": {
              "investment-banking": 5,
              "private-equity": 4,
              "consulting": 3
            }
          },
          {
            "text": "Back the entrepreneurs and startups that will change the world",
            "scores": {
              "venture-capital": 5,
              "private-equity": 2,
              "consulting": 1
            }
          },
          {
            "text": "Help individuals and families build financial security",
            "scores": {
              "financial-advisor": 5,
              "fp-and-a": 1
            }
          },
          {
            "text": "Drive better decision-making inside businesses I care about",
            "scores": {
              "fp-and-a": 5,
              "consulting": 3,
              "private-equity": 2
            }
          },
          {
            "text": "Improve market efficiency and generate returns through better analysis",
            "scores": {
              "hedge-fund": 4,
              "equity-research": 4,
              "quantitative-finance": 4,
              "portfolio-management": 3
            }
          }
        ]
      },
      {
        "id": 17,
        "question": "When you picture the \"why\" behind your career, what fits best?",
        "options": [
          {
            "text": "I want to be the person companies call when they need to make a big move happen",
            "scores": {
              "investment-banking": 5,
              "private-equity": 3,
              "restructuring": 3
            }
          },
          {
            "text": "I want to find and fund the ideas that genuinely change how things work",
            "scores": {
              "venture-capital": 5,
              "fintech": 2
            }
          },
          {
            "text": "I want a person to trust me with something as personal as their financial future",
            "scores": {
              "financial-advisor": 5,
              "private-banking": 3
            }
          },
          {
            "text": "I want the businesses I work with to make smarter decisions because of my numbers",
            "scores": {
              "fp-and-a": 5,
              "corporate-development": 3,
              "consulting": 2
            }
          },
          {
            "text": "I want markets to price things more accurately because of work I contributed to",
            "scores": {
              "equity-research": 4,
              "quantitative-finance": 4,
              "hedge-fund": 3
            }
          }
        ]
      },
      {
        "id": 18,
        "question": "Ten years from now, what would make you feel your work genuinely mattered?",
        "options": [
          {
            "text": "A landmark deal you worked on reshaped an entire industry",
            "scores": {
              "investment-banking": 4,
              "private-equity": 4,
              "corporate-development": 2
            }
          },
          {
            "text": "A company you backed early became something the world actually relies on",
            "scores": {
              "venture-capital": 5
            }
          },
          {
            "text": "Dozens of families are financially secure today because of advice you gave them",
            "scores": {
              "financial-advisor": 5,
              "private-banking": 2
            }
          },
          {
            "text": "A business runs measurably better because of the financial discipline you brought",
            "scores": {
              "fp-and-a": 5,
              "treasury": 3,
              "consulting": 2
            }
          },
          {
            "text": "You protected an institution from a risk that would otherwise have sunk it",
            "scores": {
              "risk-management": 5,
              "actuarial": 3,
              "compliance": 3
            }
          }
        ]
      }
    ]
  },
  {
    "dimension": "prestige",
    "variants": [
      {
        "id": 19,
        "question": "How important is prestige and brand name to you?",
        "options": [
          {
            "text": "Very important — I want to work at the most recognised name in finance",
            "scores": {
              "investment-banking": 5,
              "consulting": 4,
              "private-equity": 3
            }
          },
          {
            "text": "Important, but I care more about the quality of the work and team",
            "scores": {
              "hedge-fund": 4,
              "private-equity": 4,
              "equity-research": 3
            }
          },
          {
            "text": "I prefer to be judged on my performance, not my employer's name",
            "scores": {
              "trading": 4,
              "quantitative-finance": 4,
              "hedge-fund": 3
            }
          },
          {
            "text": "Prestige matters less to me than building genuine expertise over time",
            "scores": {
              "actuarial": 4,
              "risk-management": 3,
              "financial-advisor": 3,
              "fp-and-a": 3
            }
          },
          {
            "text": "I want to build my own name and reputation, not someone else's",
            "scores": {
              "venture-capital": 4,
              "financial-advisor": 3
            }
          }
        ]
      },
      {
        "id": 20,
        "question": "When you tell people where you work, how much does it matter to you?",
        "options": [
          {
            "text": "A lot — a recognisable name opens doors and I want those doors open",
            "scores": {
              "investment-banking": 5,
              "consulting": 4
            }
          },
          {
            "text": "Somewhat — but I would rather work with brilliant people at a firm few outsiders know",
            "scores": {
              "hedge-fund": 4,
              "private-equity": 3,
              "equity-research": 3
            }
          },
          {
            "text": "Not much — I would rather my P&L or track record spoke for me",
            "scores": {
              "trading": 4,
              "quantitative-finance": 4
            }
          },
          {
            "text": "Barely — I want to be known as excellent at a specific, valuable thing",
            "scores": {
              "actuarial": 4,
              "risk-management": 3,
              "compliance": 3
            }
          },
          {
            "text": "I would rather people knew MY name than my employer's",
            "scores": {
              "venture-capital": 4,
              "financial-advisor": 4
            }
          }
        ]
      },
      {
        "id": 21,
        "question": "Two offers, similar pay: one at a household-name bank, one at a small boutique doing better work. Which pulls you?",
        "options": [
          {
            "text": "The household name — the brand is worth something for the next 20 years",
            "scores": {
              "investment-banking": 5,
              "consulting": 3
            }
          },
          {
            "text": "The boutique — better people and better deal flow beats a bigger logo",
            "scores": {
              "hedge-fund": 4,
              "private-equity": 4,
              "equity-research": 2
            }
          },
          {
            "text": "Whichever pays me for performance rather than tenure or title",
            "scores": {
              "trading": 4,
              "quantitative-finance": 3
            }
          },
          {
            "text": "Neither factor moves me much — I care about the actual day-to-day work",
            "scores": {
              "actuarial": 4,
              "fp-and-a": 3,
              "risk-management": 3
            }
          },
          {
            "text": "The boutique — I would rather be known for what I did than where I did it",
            "scores": {
              "venture-capital": 4,
              "financial-advisor": 3
            }
          }
        ]
      }
    ]
  },
  {
    "dimension": "qualifications",
    "variants": [
      {
        "id": 22,
        "question": "How do you feel about academic study and professional qualifications?",
        "options": [
          {
            "text": "I love structured learning — I would happily sit exams for years if it leads to the right career",
            "scores": {
              "actuarial": 5,
              "portfolio-management": 3,
              "risk-management": 3
            }
          },
          {
            "text": "I prefer learning on the job — real experience beats textbooks",
            "scores": {
              "trading": 4,
              "investment-banking": 3,
              "venture-capital": 3
            }
          },
          {
            "text": "I am excited by cutting-edge research — I might consider a PhD",
            "scores": {
              "quantitative-finance": 5,
              "risk-management": 2,
              "actuarial": 2
            }
          },
          {
            "text": "I like a combination — practical work plus a respected designation (CFA, CPA)",
            "scores": {
              "portfolio-management": 4,
              "equity-research": 4,
              "fp-and-a": 3,
              "financial-advisor": 3
            }
          },
          {
            "text": "I learn best through doing — problem-solving in real situations",
            "scores": {
              "consulting": 4,
              "private-equity": 3,
              "hedge-fund": 3
            }
          }
        ]
      },
      {
        "id": 23,
        "question": "Your firm offers to sponsor a multi-year professional qualification alongside your job. Your reaction?",
        "options": [
          {
            "text": "Sign me up — years of structured exams sound genuinely appealing if it is the right path",
            "scores": {
              "actuarial": 5,
              "risk-management": 3,
              "portfolio-management": 2
            }
          },
          {
            "text": "I would rather spend that time getting real deal or market experience instead",
            "scores": {
              "trading": 4,
              "investment-banking": 3,
              "venture-capital": 3
            }
          },
          {
            "text": "Only if it lets me go deeper into genuinely novel, research-level problems",
            "scores": {
              "quantitative-finance": 5,
              "actuarial": 2
            }
          },
          {
            "text": "Yes, as a complement to the job — I like having both the theory and the practice",
            "scores": {
              "equity-research": 4,
              "portfolio-management": 4,
              "fp-and-a": 3
            }
          },
          {
            "text": "I would rather learn by being thrown into ambiguous real problems immediately",
            "scores": {
              "consulting": 5,
              "private-equity": 2
            }
          }
        ]
      },
      {
        "id": 24,
        "question": "Which best describes how you actually like to learn something new?",
        "options": [
          {
            "text": "Systematically — a syllabus, a textbook, and exams to prove I have mastered it",
            "scores": {
              "actuarial": 5,
              "risk-management": 3
            }
          },
          {
            "text": "By doing it badly first, then figuring out what went wrong",
            "scores": {
              "trading": 4,
              "venture-capital": 3,
              "investment-banking": 2
            }
          },
          {
            "text": "By going deep enough to question the existing theory, not just apply it",
            "scores": {
              "quantitative-finance": 5
            }
          },
          {
            "text": "A respected credential alongside hands-on practice, in parallel",
            "scores": {
              "equity-research": 4,
              "portfolio-management": 4,
              "financial-advisor": 3
            }
          },
          {
            "text": "By solving a real, messy client problem with a framework as a starting point only",
            "scores": {
              "consulting": 5,
              "private-equity": 2
            }
          }
        ]
      }
    ]
  },
  {
    "dimension": "deal-type",
    "variants": [
      {
        "id": 25,
        "question": "What type of companies or deals most interest you?",
        "options": [
          {
            "text": "Large-cap M&A, IPOs, and mega-deals in banking and corporates",
            "scores": {
              "investment-banking": 5,
              "private-equity": 3,
              "trading": 2
            }
          },
          {
            "text": "Mature businesses with strong cash flows that can be optimised",
            "scores": {
              "private-equity": 5,
              "fp-and-a": 2,
              "portfolio-management": 2
            }
          },
          {
            "text": "High-growth early-stage startups disrupting traditional industries",
            "scores": {
              "venture-capital": 5,
              "hedge-fund": 1
            }
          },
          {
            "text": "Public market stocks — finding undervalued or overvalued companies",
            "scores": {
              "equity-research": 5,
              "hedge-fund": 4,
              "portfolio-management": 4,
              "trading": 3
            }
          },
          {
            "text": "Insurance, pensions, and institutional risk management",
            "scores": {
              "actuarial": 5,
              "risk-management": 4,
              "portfolio-management": 2
            }
          }
        ]
      },
      {
        "id": 26,
        "question": "If you scrolled the FT every morning, which headline would you click first?",
        "options": [
          {
            "text": "\"£12bn mega-merger creates new sector giant\"",
            "scores": {
              "investment-banking": 5,
              "private-equity": 3,
              "corporate-development": 2
            }
          },
          {
            "text": "\"Buyout firm takes struggling retailer private in turnaround bet\"",
            "scores": {
              "private-equity": 5,
              "restructuring": 3
            }
          },
          {
            "text": "\"Two-year-old AI startup raises $80m Series B at unicorn valuation\"",
            "scores": {
              "venture-capital": 5,
              "fintech": 2
            }
          },
          {
            "text": "\"Analyst downgrades tech giant, cites overstated growth assumptions\"",
            "scores": {
              "equity-research": 5,
              "hedge-fund": 4,
              "portfolio-management": 3
            }
          },
          {
            "text": "\"Regulator raises capital requirements for insurers amid climate risk\"",
            "scores": {
              "actuarial": 4,
              "risk-management": 4,
              "insurance-underwriting": 4
            }
          }
        ]
      },
      {
        "id": 27,
        "question": "Which company situation would you find most interesting to work on?",
        "options": [
          {
            "text": "A household-name company exploring a transformative acquisition",
            "scores": {
              "investment-banking": 5,
              "private-equity": 2
            }
          },
          {
            "text": "A profitable but under-managed business that could be run much better",
            "scores": {
              "private-equity": 5,
              "restructuring": 2
            }
          },
          {
            "text": "A tiny team with a genuinely new idea and almost no track record yet",
            "scores": {
              "venture-capital": 5
            }
          },
          {
            "text": "A well-known stock the market has, in your view, mispriced",
            "scores": {
              "equity-research": 5,
              "hedge-fund": 4,
              "portfolio-management": 3
            }
          },
          {
            "text": "A pension fund trying to make sure it can pay retirees in 40 years' time",
            "scores": {
              "actuarial": 5,
              "portfolio-management": 2
            }
          }
        ]
      }
    ]
  },
  {
    "dimension": "buy-sell-side",
    "variants": [
      {
        "id": 28,
        "question": "What most appeals to you about the buy-side vs sell-side divide?",
        "options": [
          {
            "text": "Sell-side — advising clients, executing transactions, and being at the heart of deal flow",
            "scores": {
              "investment-banking": 5,
              "equity-research": 4,
              "trading": 3
            }
          },
          {
            "text": "Buy-side — deploying capital, making investment decisions, and reaping the upside",
            "scores": {
              "hedge-fund": 5,
              "private-equity": 5,
              "portfolio-management": 4,
              "venture-capital": 4
            }
          },
          {
            "text": "Neither — I want to be inside a corporation driving strategy",
            "scores": {
              "fp-and-a": 5,
              "risk-management": 3,
              "consulting": 2
            }
          },
          {
            "text": "I'm agnostic — I care more about the role than the side",
            "scores": {
              "quantitative-finance": 3,
              "actuarial": 2,
              "financial-advisor": 2,
              "risk-management": 2
            }
          }
        ]
      },
      {
        "id": 29,
        "question": "Would you rather be the one advising on a decision, or the one making it?",
        "options": [
          {
            "text": "Advising — I want to be the trusted expert clients bring the biggest decisions to",
            "scores": {
              "investment-banking": 5,
              "equity-research": 3,
              "consulting": 3
            }
          },
          {
            "text": "Making it — I want the capital and the call to be genuinely mine",
            "scores": {
              "hedge-fund": 5,
              "private-equity": 5,
              "portfolio-management": 4,
              "venture-capital": 4
            }
          },
          {
            "text": "Neither — I want to shape decisions from inside the business itself",
            "scores": {
              "fp-and-a": 5,
              "corporate-development": 3
            }
          },
          {
            "text": "It genuinely does not matter to me which side of the table I sit on",
            "scores": {
              "quantitative-finance": 3,
              "actuarial": 2,
              "risk-management": 2
            }
          }
        ]
      },
      {
        "id": 30,
        "question": "A client wants your honest recommendation on a deal. Would you rather...",
        "options": [
          {
            "text": "Give the best possible advice and let them decide, then move to the next client",
            "scores": {
              "investment-banking": 5,
              "consulting": 3,
              "equity-research": 3
            }
          },
          {
            "text": "Skip the advisory step entirely and just decide it yourself with your own capital",
            "scores": {
              "hedge-fund": 5,
              "private-equity": 5,
              "venture-capital": 4
            }
          },
          {
            "text": "Be the one internally who has to live with whatever gets decided",
            "scores": {
              "fp-and-a": 5,
              "treasury": 3
            }
          },
          {
            "text": "Focus on getting the analysis exactly right, regardless of who acts on it",
            "scores": {
              "quantitative-finance": 3,
              "risk-management": 3
            }
          }
        ]
      }
    ]
  },
  {
    "dimension": "problem-solving",
    "variants": [
      {
        "id": 31,
        "question": "How do you approach a complex problem?",
        "options": [
          {
            "text": "Structure it into a framework, gather data, and work through it systematically",
            "scores": {
              "consulting": 5,
              "risk-management": 3,
              "fp-and-a": 3
            }
          },
          {
            "text": "Build a model — quantify everything and let the numbers guide the answer",
            "scores": {
              "quantitative-finance": 5,
              "investment-banking": 3,
              "actuarial": 4,
              "equity-research": 3
            }
          },
          {
            "text": "Develop a thesis based on deep research and test it against the market",
            "scores": {
              "hedge-fund": 5,
              "equity-research": 4,
              "portfolio-management": 3
            }
          },
          {
            "text": "Talk to people — experts, founders, and customers know things models don't",
            "scores": {
              "venture-capital": 5,
              "financial-advisor": 4,
              "consulting": 3
            }
          },
          {
            "text": "Act fast with the information available — speed matters in my environment",
            "scores": {
              "trading": 5,
              "investment-banking": 3
            }
          }
        ]
      },
      {
        "id": 32,
        "question": "Your manager gives you a genuinely ambiguous problem with no clear starting point. First move?",
        "options": [
          {
            "text": "Break it into a MECE framework so the team can divide and conquer it",
            "scores": {
              "consulting": 5,
              "fp-and-a": 3,
              "risk-management": 2
            }
          },
          {
            "text": "Build a spreadsheet that turns the ambiguity into numbers you can actually argue with",
            "scores": {
              "quantitative-finance": 5,
              "investment-banking": 3,
              "actuarial": 3
            }
          },
          {
            "text": "Read everything available and form your own contrarian view before consulting anyone",
            "scores": {
              "hedge-fund": 5,
              "equity-research": 4
            }
          },
          {
            "text": "Go and ask the people closest to the problem what they actually think",
            "scores": {
              "venture-capital": 5,
              "financial-advisor": 3,
              "consulting": 2
            }
          },
          {
            "text": "Make a fast, reasonable call now rather than over-analyse it",
            "scores": {
              "trading": 5,
              "investment-banking": 2
            }
          }
        ]
      },
      {
        "id": 33,
        "question": "When facing a genuinely hard decision, what do you trust most?",
        "options": [
          {
            "text": "A clear, repeatable framework that removes bias from the answer",
            "scores": {
              "consulting": 5,
              "risk-management": 4
            }
          },
          {
            "text": "The output of a model, provided the assumptions are rigorously tested",
            "scores": {
              "quantitative-finance": 5,
              "actuarial": 4
            }
          },
          {
            "text": "My own judgement, built from deep independent research",
            "scores": {
              "hedge-fund": 5,
              "equity-research": 4,
              "portfolio-management": 3
            }
          },
          {
            "text": "What the people closest to the situation are actually telling me",
            "scores": {
              "venture-capital": 5,
              "financial-advisor": 4
            }
          },
          {
            "text": "My instinct, sharpened by years of making fast calls under pressure",
            "scores": {
              "trading": 5
            }
          }
        ]
      }
    ]
  },
  {
    "dimension": "long-term",
    "variants": [
      {
        "id": 34,
        "question": "Where do you see yourself in 15 years?",
        "options": [
          {
            "text": "Running my own fund, family office, or investment firm",
            "scores": {
              "hedge-fund": 5,
              "private-equity": 4,
              "portfolio-management": 3,
              "venture-capital": 4
            }
          },
          {
            "text": "CFO or Group Finance Director of a major corporation",
            "scores": {
              "fp-and-a": 5,
              "investment-banking": 2,
              "consulting": 2
            }
          },
          {
            "text": "Partner at a top-tier PE or VC firm",
            "scores": {
              "private-equity": 5,
              "venture-capital": 5
            }
          },
          {
            "text": "Chief Risk Officer or Chief Actuary of a major institution",
            "scores": {
              "risk-management": 5,
              "actuarial": 5
            }
          },
          {
            "text": "Building a successful financial advisory practice with loyal clients",
            "scores": {
              "financial-advisor": 5
            }
          },
          {
            "text": "Head of research or a senior portfolio manager at a respected fund",
            "scores": {
              "equity-research": 4,
              "portfolio-management": 5,
              "hedge-fund": 3
            }
          }
        ]
      },
      {
        "id": 35,
        "question": "Which job title, on a business card 15 years from now, would make you proudest?",
        "options": [
          {
            "text": "Founder & Portfolio Manager, [Your Name] Capital",
            "scores": {
              "hedge-fund": 5,
              "portfolio-management": 3,
              "venture-capital": 3
            }
          },
          {
            "text": "Group Chief Financial Officer",
            "scores": {
              "fp-and-a": 5,
              "treasury": 3
            }
          },
          {
            "text": "Managing Partner",
            "scores": {
              "private-equity": 5,
              "venture-capital": 5
            }
          },
          {
            "text": "Chief Risk Officer / Chief Actuary",
            "scores": {
              "risk-management": 5,
              "actuarial": 5
            }
          },
          {
            "text": "Founder, [Your Name] Wealth Advisory",
            "scores": {
              "financial-advisor": 5,
              "private-banking": 3
            }
          },
          {
            "text": "Head of Research",
            "scores": {
              "equity-research": 5,
              "portfolio-management": 3
            }
          }
        ]
      },
      {
        "id": 36,
        "question": "What would genuinely feel like \"making it\" to you, career-wise?",
        "options": [
          {
            "text": "Investing my own fund's capital under my own name",
            "scores": {
              "hedge-fund": 5,
              "venture-capital": 4,
              "portfolio-management": 3
            }
          },
          {
            "text": "Sitting at the table where a major company's financial decisions actually get made",
            "scores": {
              "fp-and-a": 5,
              "corporate-development": 3
            }
          },
          {
            "text": "Making partner at a firm I respect, with genuine carry in the deals",
            "scores": {
              "private-equity": 5,
              "venture-capital": 4
            }
          },
          {
            "text": "Being the person a whole institution trusts to keep it safe",
            "scores": {
              "risk-management": 5,
              "actuarial": 4,
              "compliance": 3
            }
          },
          {
            "text": "Clients recommending me to their friends and family, unprompted",
            "scores": {
              "financial-advisor": 5,
              "private-banking": 3
            }
          },
          {
            "text": "My published research or ratings actually moving how people invest",
            "scores": {
              "equity-research": 5,
              "portfolio-management": 2
            }
          }
        ]
      }
    ]
  },
  {
    "dimension": "satisfaction",
    "variants": [
      {
        "id": 37,
        "question": "Which of these activities would you find most satisfying on a regular basis?",
        "options": [
          {
            "text": "Closing a major transaction after months of hard work",
            "scores": {
              "investment-banking": 5,
              "private-equity": 4,
              "venture-capital": 3
            }
          },
          {
            "text": "Seeing a stock pitch play out exactly as your thesis predicted",
            "scores": {
              "hedge-fund": 5,
              "equity-research": 5,
              "portfolio-management": 4
            }
          },
          {
            "text": "Discovering a new quantitative signal that generates consistent alpha",
            "scores": {
              "quantitative-finance": 5,
              "trading": 4,
              "risk-management": 2
            }
          },
          {
            "text": "Helping a client retire comfortably with a plan you built for them",
            "scores": {
              "financial-advisor": 5,
              "fp-and-a": 2
            }
          },
          {
            "text": "Building a rigorous risk model that protects the firm during a market crisis",
            "scores": {
              "risk-management": 5,
              "actuarial": 5,
              "quantitative-finance": 3
            }
          }
        ]
      },
      {
        "id": 38,
        "question": "Which of these small wins would genuinely make your week?",
        "options": [
          {
            "text": "Getting told by an MD that your model was clean enough to send straight to the client",
            "scores": {
              "investment-banking": 5,
              "private-equity": 3
            }
          },
          {
            "text": "A stock you flagged months ago moves exactly the way your note predicted",
            "scores": {
              "hedge-fund": 5,
              "equity-research": 5,
              "portfolio-management": 3
            }
          },
          {
            "text": "A backtest finally confirms a pattern you suspected was there for weeks",
            "scores": {
              "quantitative-finance": 5,
              "trading": 3
            }
          },
          {
            "text": "A client calls just to say thank you, unprompted, months after you helped them",
            "scores": {
              "financial-advisor": 5,
              "private-banking": 3
            }
          },
          {
            "text": "A stress test you built flags a real vulnerability before it becomes a real problem",
            "scores": {
              "risk-management": 5,
              "actuarial": 4
            }
          }
        ]
      },
      {
        "id": 39,
        "question": "What kind of \"win\" would you find most quietly satisfying?",
        "options": [
          {
            "text": "A deal you thought was dead gets revived and closes because you kept pushing",
            "scores": {
              "investment-banking": 5,
              "restructuring": 3,
              "private-equity": 2
            }
          },
          {
            "text": "Being right about a company when the consensus view was wrong",
            "scores": {
              "hedge-fund": 5,
              "equity-research": 4,
              "portfolio-management": 3
            }
          },
          {
            "text": "Shipping a model that quietly makes the whole desk more efficient",
            "scores": {
              "quantitative-finance": 5,
              "trading": 2
            }
          },
          {
            "text": "A client trusting you with a decision they would not discuss with anyone else",
            "scores": {
              "financial-advisor": 5,
              "private-banking": 4
            }
          },
          {
            "text": "Catching an error in a risk report before it went anywhere near a regulator",
            "scores": {
              "risk-management": 5,
              "compliance": 4,
              "actuarial": 2
            }
          }
        ]
      }
    ]
  },
  {
    "dimension": "niche-interest",
    "variants": [
      {
        "id": 40,
        "question": "Which of these would you most enjoy becoming an expert in?",
        "options": [
          {
            "text": "Property — valuing buildings, structuring development finance, reading local markets",
            "scores": {
              "real-estate-finance": 5,
              "private-equity": 2,
              "structured-finance": 2
            }
          },
          {
            "text": "Physical commodities and energy — oil cargoes, power grids, the energy transition",
            "scores": {
              "energy-commodities": 5,
              "commodities-trading": 5,
              "trading": 2
            }
          },
          {
            "text": "Credit and debt — how loans get priced, packaged, rated and sold on",
            "scores": {
              "structured-finance": 5,
              "fixed-income": 4,
              "restructuring": 2
            }
          },
          {
            "text": "Insurance risk — pricing hurricanes, cyber attacks and things that have never happened before",
            "scores": {
              "insurance-underwriting": 5,
              "actuarial": 4,
              "risk-management": 3
            }
          },
          {
            "text": "Technology and products — how financial services actually get built and delivered",
            "scores": {
              "fintech": 5,
              "quantitative-finance": 2,
              "corporate-development": 2
            }
          },
          {
            "text": "Rules and financial crime — regulation, market abuse, keeping firms out of trouble",
            "scores": {
              "compliance": 5,
              "risk-management": 3
            }
          }
        ]
      },
      {
        "id": 41,
        "question": "You get to pick ONE niche to spend the next decade mastering. Which pulls you?",
        "options": [
          {
            "text": "How cities get built and financed, one development at a time",
            "scores": {
              "real-estate-finance": 5,
              "structured-finance": 2
            }
          },
          {
            "text": "The physical flow of the world's energy — tankers, pipelines, power and the transition away from them",
            "scores": {
              "energy-commodities": 5,
              "commodities-trading": 5
            }
          },
          {
            "text": "How companies borrow, and how that debt gets sliced up and traded",
            "scores": {
              "structured-finance": 5,
              "fixed-income": 4
            }
          },
          {
            "text": "Pricing genuinely rare, catastrophic events that have almost no historical precedent",
            "scores": {
              "insurance-underwriting": 5,
              "actuarial": 4
            }
          },
          {
            "text": "Building the software and products that make financial services actually work",
            "scores": {
              "fintech": 5,
              "corporate-development": 2
            }
          },
          {
            "text": "The rules that keep an entire financial system honest",
            "scores": {
              "compliance": 5,
              "risk-management": 3
            }
          }
        ]
      },
      {
        "id": 42,
        "question": "If you had to read one specialist trade publication every single day, which would it be?",
        "options": [
          {
            "text": "A commercial property and real estate finance journal",
            "scores": {
              "real-estate-finance": 5
            }
          },
          {
            "text": "An energy markets and commodities trading bulletin",
            "scores": {
              "energy-commodities": 5,
              "commodities-trading": 5
            }
          },
          {
            "text": "A credit markets and structured products newsletter",
            "scores": {
              "structured-finance": 5,
              "fixed-income": 4
            }
          },
          {
            "text": "A catastrophe modelling and reinsurance briefing",
            "scores": {
              "insurance-underwriting": 5,
              "actuarial": 4
            }
          },
          {
            "text": "A fintech and financial-services-technology digest",
            "scores": {
              "fintech": 5
            }
          },
          {
            "text": "A financial regulation and enforcement roundup",
            "scores": {
              "compliance": 5,
              "risk-management": 3
            }
          }
        ]
      }
    ]
  },
  {
    "dimension": "whose-money",
    "variants": [
      {
        "id": 43,
        "question": "Whose money would you most like to be responsible for?",
        "options": [
          {
            "text": "A single ultra-wealthy family, across every asset class and generation",
            "scores": {
              "family-office": 5,
              "private-banking": 3,
              "portfolio-management": 2
            }
          },
          {
            "text": "Wealthy individual clients you build long-term personal relationships with",
            "scores": {
              "private-banking": 5,
              "financial-advisor": 4,
              "family-office": 2
            }
          },
          {
            "text": "A nation's sovereign wealth — enormous, patient, long-horizon capital",
            "scores": {
              "sovereign-wealth": 5,
              "portfolio-management": 3,
              "private-equity": 2
            }
          },
          {
            "text": "A company's own balance sheet — its cash, debt, and currency exposure",
            "scores": {
              "treasury": 5,
              "fp-and-a": 3,
              "corporate-development": 2
            }
          },
          {
            "text": "Institutional investors' capital, judged against a benchmark every quarter",
            "scores": {
              "portfolio-management": 5,
              "hedge-fund": 3,
              "equity-research": 2
            }
          }
        ]
      },
      {
        "id": 44,
        "question": "If you could choose the client whose capital you managed, who would it be?",
        "options": [
          {
            "text": "One dynasty, planning across three generations at once",
            "scores": {
              "family-office": 5,
              "private-banking": 2
            }
          },
          {
            "text": "A roster of successful individuals who trust you with everything financial",
            "scores": {
              "private-banking": 5,
              "financial-advisor": 4
            }
          },
          {
            "text": "A country's future — capital with a multi-decade horizon and no quarterly panic",
            "scores": {
              "sovereign-wealth": 5,
              "portfolio-management": 2
            }
          },
          {
            "text": "Your own employer — making sure the company itself never runs out of cash",
            "scores": {
              "treasury": 5,
              "fp-and-a": 3
            }
          },
          {
            "text": "Pension funds and endowments who measure you every single quarter",
            "scores": {
              "portfolio-management": 5,
              "hedge-fund": 2
            }
          }
        ]
      },
      {
        "id": 45,
        "question": "Which capital pool sounds most interesting to be accountable for?",
        "options": [
          {
            "text": "A billionaire family's entire balance sheet — property, businesses, art, everything",
            "scores": {
              "family-office": 5
            }
          },
          {
            "text": "A book of high-net-worth clients, each with their own goals and quirks",
            "scores": {
              "private-banking": 5,
              "financial-advisor": 3
            }
          },
          {
            "text": "A state's reserves, deployed patiently over decades",
            "scores": {
              "sovereign-wealth": 5
            }
          },
          {
            "text": "The cash sitting on a listed company's own books",
            "scores": {
              "treasury": 5,
              "fp-and-a": 2
            }
          },
          {
            "text": "A fund benchmarked publicly, where everyone can see if you beat the index",
            "scores": {
              "portfolio-management": 5,
              "hedge-fund": 3
            }
          }
        ]
      }
    ]
  },
  {
    "dimension": "distress-instinct",
    "variants": [
      {
        "id": 46,
        "question": "A company you follow is in serious financial distress. Your instinct is to:",
        "options": [
          {
            "text": "Work out who gets paid what, and negotiate the restructuring between creditors",
            "scores": {
              "restructuring": 5,
              "fixed-income": 2,
              "investment-banking": 2
            }
          },
          {
            "text": "Analyse whether its debt is now mispriced and worth buying cheaply",
            "scores": {
              "hedge-fund": 4,
              "fixed-income": 4,
              "restructuring": 3
            }
          },
          {
            "text": "Ask whether a stronger competitor should acquire it, and at what price",
            "scores": {
              "investment-banking": 4,
              "corporate-development": 4,
              "private-equity": 3
            }
          },
          {
            "text": "Look at what went wrong operationally and how it could be turned around",
            "scores": {
              "consulting": 4,
              "private-equity": 3,
              "restructuring": 3
            }
          },
          {
            "text": "Check what exposure my own firm has to it, and whether we are protected",
            "scores": {
              "risk-management": 5,
              "compliance": 3,
              "treasury": 3
            }
          }
        ]
      },
      {
        "id": 47,
        "question": "You read that a major retailer just missed a debt payment. What is your first mental move?",
        "options": [
          {
            "text": "Map the capital structure — who is senior, who is subordinated, who takes the hit",
            "scores": {
              "restructuring": 5,
              "fixed-income": 3
            }
          },
          {
            "text": "Ask whether the bonds are now priced for a recovery that is more likely than the market thinks",
            "scores": {
              "hedge-fund": 4,
              "fixed-income": 4,
              "restructuring": 2
            }
          },
          {
            "text": "Wonder which rival could buy the good assets out of the wreckage",
            "scores": {
              "investment-banking": 4,
              "corporate-development": 4,
              "private-equity": 3
            }
          },
          {
            "text": "Think about what operational decisions actually caused this",
            "scores": {
              "consulting": 4,
              "private-equity": 3
            }
          },
          {
            "text": "Check whether any fund or bank you know is exposed, and how badly",
            "scores": {
              "risk-management": 5,
              "treasury": 3
            }
          }
        ]
      },
      {
        "id": 48,
        "question": "When a business is clearly in trouble, what genuinely interests you most about the situation?",
        "options": [
          {
            "text": "The negotiation between everyone owed money, and who ends up controlling the company",
            "scores": {
              "restructuring": 5,
              "fixed-income": 2
            }
          },
          {
            "text": "Whether the market has over- or under-priced the risk of a recovery",
            "scores": {
              "hedge-fund": 4,
              "fixed-income": 3
            }
          },
          {
            "text": "Who the natural strategic buyer of the pieces would be",
            "scores": {
              "investment-banking": 4,
              "corporate-development": 4
            }
          },
          {
            "text": "Diagnosing exactly which operational decisions led here",
            "scores": {
              "consulting": 5,
              "restructuring": 2
            }
          },
          {
            "text": "Whether the wider financial system is adequately protected from this kind of failure",
            "scores": {
              "risk-management": 5,
              "compliance": 3
            }
          }
        ]
      }
    ]
  },
  {
    "dimension": "firm-vs-corporate",
    "variants": [
      {
        "id": 49,
        "question": "Would you rather work inside a financial firm, or inside a normal company's finance team?",
        "options": [
          {
            "text": "A financial firm — I want to be where the deals and markets actually happen",
            "scores": {
              "investment-banking": 3,
              "hedge-fund": 3,
              "private-equity": 3,
              "trading": 3
            }
          },
          {
            "text": "A normal company — buying other businesses and shaping its strategy from within",
            "scores": {
              "corporate-development": 5,
              "fp-and-a": 2,
              "treasury": 2
            }
          },
          {
            "text": "A normal company — forecasting, budgeting and partnering with the business",
            "scores": {
              "fp-and-a": 5,
              "corporate-development": 2,
              "treasury": 3
            }
          },
          {
            "text": "A normal company — managing its cash, funding and financial risk",
            "scores": {
              "treasury": 5,
              "risk-management": 2,
              "fp-and-a": 2
            }
          },
          {
            "text": "A fast-growing startup where the finance function is still being built",
            "scores": {
              "fintech": 5,
              "venture-capital": 3,
              "corporate-development": 2
            }
          }
        ]
      },
      {
        "id": 50,
        "question": "You get two offers with similar pay: one at a bank, one in a well-known company's finance department. Which appeals more?",
        "options": [
          {
            "text": "The bank — I want proximity to markets, deals and the industry's centre of gravity",
            "scores": {
              "investment-banking": 3,
              "hedge-fund": 3,
              "trading": 3
            }
          },
          {
            "text": "The company — I want to help decide which businesses it buys next",
            "scores": {
              "corporate-development": 5,
              "treasury": 2
            }
          },
          {
            "text": "The company — I want to own its budgeting and forecasting end to end",
            "scores": {
              "fp-and-a": 5,
              "corporate-development": 2
            }
          },
          {
            "text": "The company — I want to be the person who makes sure it never runs out of cash",
            "scores": {
              "treasury": 5,
              "risk-management": 2
            }
          },
          {
            "text": "Neither, honestly — I would rather join a startup and build the finance function myself",
            "scores": {
              "fintech": 5,
              "venture-capital": 3
            }
          }
        ]
      },
      {
        "id": 51,
        "question": "Where do you picture yourself sitting: on the finance-industry side of the table, or inside a real business?",
        "options": [
          {
            "text": "The industry side — banks, funds and markets are where I want to build a career",
            "scores": {
              "investment-banking": 3,
              "hedge-fund": 3,
              "private-equity": 3
            }
          },
          {
            "text": "Inside a business, deciding what it acquires and how it grows",
            "scores": {
              "corporate-development": 5
            }
          },
          {
            "text": "Inside a business, as the person who actually understands its numbers",
            "scores": {
              "fp-and-a": 5
            }
          },
          {
            "text": "Inside a business, protecting its cash and managing its risk",
            "scores": {
              "treasury": 5,
              "risk-management": 2
            }
          },
          {
            "text": "Inside a young, fast-moving company still figuring out its own finance function",
            "scores": {
              "fintech": 5,
              "venture-capital": 2
            }
          }
        ]
      }
    ]
  },
  {
    "dimension": "working-pattern",
    "variants": [
      {
        "id": 52,
        "question": "Which working pattern genuinely suits you best?",
        "options": [
          {
            "text": "Brutal hours early on, in exchange for the fastest learning curve and best exits",
            "scores": {
              "investment-banking": 5,
              "private-equity": 4,
              "restructuring": 4,
              "consulting": 3
            }
          },
          {
            "text": "Early starts tied to market hours, intense but genuinely finished by evening",
            "scores": {
              "trading": 5,
              "commodities-trading": 4,
              "energy-commodities": 4,
              "fixed-income": 3
            }
          },
          {
            "text": "Steady professional hours with deep technical work and real job security",
            "scores": {
              "actuarial": 5,
              "insurance-underwriting": 5,
              "compliance": 4,
              "risk-management": 4
            }
          },
          {
            "text": "Balanced hours with genuine responsibility, inside a business rather than a bank",
            "scores": {
              "fp-and-a": 4,
              "treasury": 4,
              "corporate-development": 3,
              "structured-finance": 2
            }
          },
          {
            "text": "Relationship-led and flexible, where my network and trust are the real asset",
            "scores": {
              "private-banking": 5,
              "family-office": 4,
              "financial-advisor": 4,
              "venture-capital": 2
            }
          }
        ]
      },
      {
        "id": 53,
        "question": "Honestly, which working reality could you sustain for years without burning out?",
        "options": [
          {
            "text": "Gruelling now, in exchange for compounding faster than everyone else early on",
            "scores": {
              "investment-banking": 5,
              "private-equity": 4,
              "restructuring": 3
            }
          },
          {
            "text": "Sharp and early, but with a hard stop most days once the market closes",
            "scores": {
              "trading": 5,
              "commodities-trading": 4,
              "fixed-income": 3
            }
          },
          {
            "text": "Consistently demanding but predictable, with a clear technical career ladder",
            "scores": {
              "actuarial": 5,
              "insurance-underwriting": 4,
              "risk-management": 4
            }
          },
          {
            "text": "Full ownership of real decisions, on a schedule that still leaves room for a life",
            "scores": {
              "fp-and-a": 5,
              "treasury": 3,
              "corporate-development": 3
            }
          },
          {
            "text": "Built around relationships and trust rather than a fixed clock",
            "scores": {
              "private-banking": 5,
              "family-office": 3,
              "financial-advisor": 4
            }
          }
        ]
      },
      {
        "id": 54,
        "question": "Which of these career \"deals\" would you sign up for?",
        "options": [
          {
            "text": "Two to three years of extreme hours, for an unmatched CV and network afterwards",
            "scores": {
              "investment-banking": 5,
              "consulting": 3,
              "restructuring": 3
            }
          },
          {
            "text": "Demanding hours tied tightly to the market's own clock, not an arbitrary one",
            "scores": {
              "trading": 5,
              "commodities-trading": 3
            }
          },
          {
            "text": "Consistent, high-skill work with genuine long-term stability",
            "scores": {
              "actuarial": 5,
              "compliance": 4,
              "risk-management": 3
            }
          },
          {
            "text": "Real responsibility from early on, with a schedule I can actually plan around",
            "scores": {
              "fp-and-a": 4,
              "treasury": 4,
              "corporate-development": 2
            }
          },
          {
            "text": "Freedom and flexibility, in exchange for my income depending on relationships I build",
            "scores": {
              "financial-advisor": 5,
              "private-banking": 4,
              "family-office": 2
            }
          }
        ]
      }
    ]
  }
]
