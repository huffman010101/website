// Local-only unified history layer. No accounts, no network — everything
// lives in the browser's localStorage under versioned, namespaced keys.
// This is the single place other pages read/write cross-tool history from,
// so the Progress Dashboard can aggregate them without knowing page internals.

export type CareerQuizAttempt = {
  date: string
  topMatchId: string
  topMatchTitle: string
  topMatchPercentage: number
  top3: { id: string; title: string; percentage: number }[]
}

export type CVScoreEntry = {
  date: string
  type: 'cv' | 'cover'
  role: string
  company: string
  score: number
  scoreLabel: string
}

export type PracticeTestAttempt = {
  date: string
  categoryId: string
  categoryTitle: string
  correct: number
  total: number
  percentage: number
}

const KEYS = {
  careerQuiz: 'findr_history_career_quiz',
  cvScores: 'findr_history_cv_scores',
  practiceTests: 'findr_history_practice_tests',
} as const

function loadArray<T>(key: string): T[] {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function pushEntry<T>(key: string, entry: T, cap = 50) {
  const list = loadArray<T>(key)
  list.push(entry)
  if (list.length > cap) list.splice(0, list.length - cap)
  localStorage.setItem(key, JSON.stringify(list))
}

export function recordCareerQuizAttempt(entry: CareerQuizAttempt) {
  pushEntry(KEYS.careerQuiz, entry)
}

export function getCareerQuizHistory(): CareerQuizAttempt[] {
  return loadArray<CareerQuizAttempt>(KEYS.careerQuiz)
}

export function recordCVScore(entry: CVScoreEntry) {
  pushEntry(KEYS.cvScores, entry)
}

export function getCVScoreHistory(): CVScoreEntry[] {
  return loadArray<CVScoreEntry>(KEYS.cvScores)
}

export function recordPracticeTestAttempt(entry: PracticeTestAttempt) {
  pushEntry(KEYS.practiceTests, entry)
}

export function getPracticeTestHistory(): PracticeTestAttempt[] {
  return loadArray<PracticeTestAttempt>(KEYS.practiceTests)
}

// ---- Recommendation logic (used by the Dashboard) ----

// Maps job categories (see src/data/jobs.ts) to the Learn curriculum unit
// most relevant to breaking into that category.
export const categoryToLearnUnit: Record<string, { unitId: string; unitTitle: string }> = {
  'Capital Markets': { unitId: 'track-ib', unitTitle: 'Career Track: Investment Banking' },
  'Advisory': { unitId: 'track-consulting', unitTitle: 'Career Track: Consulting' },
  'Alternative Investments': { unitId: 'valuation', unitTitle: 'Valuation & Corporate Finance' },
  'Technology & Quant': { unitId: 'derivatives', unitTitle: 'Derivatives' },
  'Asset Management': { unitId: 'equities', unitTitle: 'Equity Markets & Investing' },
  'Wealth Management': { unitId: 'equities', unitTitle: 'Equity Markets & Investing' },
  'Risk & Control': { unitId: 'fixed-income', unitTitle: 'Fixed Income & Credit' },
  'Corporate Finance': { unitId: 'accounting', unitTitle: 'Accounting & Financial Statements' },
}

export function clearAllHistory() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k))
}
