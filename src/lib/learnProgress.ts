// Shared Learn (Develop Knowledge) progress storage — used by the Learn
// page itself, the Capstone runner (to award XP) and the Dashboard.

export const LEARN_PROGRESS_KEY = 'findr_learn_progress'

export type LessonProgress = { completed: boolean; bestScore: number; timesCompleted: number }

export type LearnProgressState = {
  xp: number
  streak: number
  lastActiveDate: string | null
  lessons: Record<string, LessonProgress>
}

export function loadLearnProgress(): LearnProgressState {
  try {
    const stored = localStorage.getItem(LEARN_PROGRESS_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* corrupted — start fresh */ }
  return { xp: 0, streak: 0, lastActiveDate: null, lessons: {} }
}

export function saveLearnProgress(p: LearnProgressState) {
  localStorage.setItem(LEARN_PROGRESS_KEY, JSON.stringify(p))
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export function updateStreak(p: LearnProgressState): LearnProgressState {
  const today = todayStr()
  if (p.lastActiveDate === today) return p
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const streak = p.lastActiveDate === yesterday ? p.streak + 1 : 1
  return { ...p, streak, lastActiveDate: today }
}

// Awards XP outside of a lesson session (e.g. completing a capstone step)
// and bumps the streak, same as finishing a lesson would.
export function awardXP(amount: number) {
  const prev = loadLearnProgress()
  const updated = updateStreak({ ...prev, xp: prev.xp + amount })
  saveLearnProgress(updated)
  return updated
}
