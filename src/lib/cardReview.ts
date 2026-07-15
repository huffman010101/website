// Spaced-repetition scheduling for Learn concept cards (Daily Review).
// A lightweight SM-2-style scheduler: correct ("Got it") doubles the
// interval (capped), incorrect ("Still learning") resets it to 1 day.

import { units } from '../data/learn'

export type CardRef = { unitId: string; lessonId: string; cardIndex: number; id: string }

type ReviewEntry = { dueDate: string; intervalDays: number }
type ReviewMap = Record<string, ReviewEntry>

const KEY = 'findr_learn_card_review'
const MAX_INTERVAL_DAYS = 60

function loadMap(): ReviewMap {
  try {
    const stored = localStorage.getItem(KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveMap(map: ReviewMap) {
  localStorage.setItem(KEY, JSON.stringify(map))
}

export function cardId(unitId: string, lessonId: string, cardIndex: number): string {
  return `${unitId}::${lessonId}::${cardIndex}`
}

// Called when a lesson's card phase is completed — schedules its cards for
// review starting immediately (due now), so the first reinforcement pass
// happens on the user's very next visit rather than being lost forever.
export function seedCardsForLesson(unitId: string, lessonId: string, cardCount: number) {
  const map = loadMap()
  const now = new Date().toISOString()
  for (let i = 0; i < cardCount; i++) {
    const id = cardId(unitId, lessonId, i)
    if (!map[id]) {
      map[id] = { dueDate: now, intervalDays: 1 }
    }
  }
  saveMap(map)
}

export function rateCard(id: string, gotIt: boolean) {
  const map = loadMap()
  const prev = map[id] || { dueDate: new Date().toISOString(), intervalDays: 1 }
  const nextInterval = gotIt ? Math.min(prev.intervalDays * 2.2, MAX_INTERVAL_DAYS) : 1
  const due = new Date(Date.now() + nextInterval * 24 * 60 * 60 * 1000)
  map[id] = { dueDate: due.toISOString(), intervalDays: nextInterval }
  saveMap(map)
}

function resolveCard(ref: CardRef) {
  const unit = units.find(u => u.id === ref.unitId)
  const lesson = unit?.lessons.find(l => l.id === ref.lessonId)
  const card = lesson?.cards[ref.cardIndex]
  if (!unit || !lesson || !card) return null
  return { unit, lesson, card }
}

// Returns due cards (id + resolved content) ready for a review session,
// most-overdue first, capped at `limit`.
export function getDueCards(limit = 15) {
  const map = loadMap()
  const now = Date.now()
  const due = Object.entries(map)
    .filter(([, entry]) => new Date(entry.dueDate).getTime() <= now)
    .sort((a, b) => new Date(a[1].dueDate).getTime() - new Date(b[1].dueDate).getTime())
    .slice(0, limit)

  return due
    .map(([id]) => {
      const [unitId, lessonId, cardIndexStr] = id.split('::')
      const resolved = resolveCard({ unitId, lessonId, cardIndex: Number(cardIndexStr), id })
      if (!resolved) return null
      return { id, unitId, lessonId, cardIndex: Number(cardIndexStr), ...resolved }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
}

export function getDueCount(): number {
  const map = loadMap()
  const now = Date.now()
  return Object.values(map).filter(e => new Date(e.dueDate).getTime() <= now).length
}
