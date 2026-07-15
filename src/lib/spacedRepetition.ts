// Lightweight spaced-repetition weighting, shared by Practice Tests and the
// Interview Quiz. No accounts — stats are keyed by a caller-supplied storage
// key and a stable item id, and live in localStorage like everything else.

export type QuestionStat = {
  wrongCount: number
  correctStreak: number
  attempts: number
  lastSeen: string
}

type StatMap = Record<string, QuestionStat>

function loadStats(storageKey: string): StatMap {
  try {
    const stored = localStorage.getItem(storageKey)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveStats(storageKey: string, stats: StatMap) {
  localStorage.setItem(storageKey, JSON.stringify(stats))
}

export function getStat(storageKey: string, id: string): QuestionStat {
  const stats = loadStats(storageKey)
  return stats[id] || { wrongCount: 0, correctStreak: 0, attempts: 0, lastSeen: '' }
}

export function recordAnswer(storageKey: string, id: string, correct: boolean) {
  const stats = loadStats(storageKey)
  const prev = stats[id] || { wrongCount: 0, correctStreak: 0, attempts: 0, lastSeen: '' }
  stats[id] = {
    wrongCount: prev.wrongCount + (correct ? 0 : 1),
    correctStreak: correct ? prev.correctStreak + 1 : 0,
    attempts: prev.attempts + 1,
    lastSeen: new Date().toISOString(),
  }
  saveStats(storageKey, stats)
}

// Weight: never-seen and frequently-wrong items are much more likely to be
// picked; items you've gotten right several times in a row fade out (but
// never to zero, so nothing is ever fully "retired").
function weightFor(stat: QuestionStat): number {
  if (stat.attempts === 0) return 3
  const base = 1 + stat.wrongCount * 2.5
  const decay = Math.max(0.2, 1 - stat.correctStreak * 0.25)
  return base * decay
}

// Weighted sample without replacement — higher weight items are more likely
// to be picked but nothing is guaranteed or excluded outright.
export function weightedSample<T>(storageKey: string, items: { id: string; value: T }[], n: number): T[] {
  const pool = [...items]
  const picked: T[] = []
  const count = Math.min(n, pool.length)
  for (let k = 0; k < count; k++) {
    const weights = pool.map(it => weightFor(getStat(storageKey, it.id)))
    const total = weights.reduce((s, w) => s + w, 0)
    let r = Math.random() * total
    let idx = 0
    for (; idx < weights.length; idx++) {
      r -= weights[idx]
      if (r <= 0) break
    }
    idx = Math.min(idx, pool.length - 1)
    picked.push(pool[idx].value)
    pool.splice(idx, 1)
  }
  return picked
}
