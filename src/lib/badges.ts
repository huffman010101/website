import { units, totalLessons } from '../data/learn'
import { capstones } from '../data/capstones'
import { LearnProgressState } from './learnProgress'
import { getCapstoneProgress } from './capstoneProgress'

export type Badge = {
  id: string
  title: string
  icon: string
  description: string
  earned: boolean
  progressLabel: string
}

function unitComplete(unitId: string, progress: LearnProgressState): boolean {
  const unit = units.find(u => u.id === unitId)
  if (!unit) return false
  return unit.lessons.every(l => progress.lessons[l.id]?.completed)
}

export function getAllBadges(progress: LearnProgressState): Badge[] {
  const capstoneProgress = getCapstoneProgress()
  const allCapstonesDone = capstones.every(c => capstoneProgress[c.id]?.completed)
  const capstonesDoneCount = capstones.filter(c => capstoneProgress[c.id]?.completed).length

  const foundationsDone = unitComplete('foundations', progress)
  const ibLessonsDone = unitComplete('track-ib', progress)
  const tradingDone = unitComplete('track-trading', progress)
  const consultingDone = unitComplete('track-consulting', progress)
  const totalDone = Object.values(progress.lessons).filter(l => l.completed).length

  return [
    {
      id: 'foundations-master',
      title: 'Foundations Master',
      icon: '🏛️',
      description: 'Complete every lesson in the Foundations of Finance unit.',
      earned: foundationsDone,
      progressLabel: foundationsDone ? 'Earned' : 'Complete the Foundations unit',
    },
    {
      id: 'ib-certified',
      title: 'Investment Banking Certified',
      icon: '🏢',
      description: 'Complete the IB career track and all 3 capstone models (3-statement, LBO, DCF).',
      earned: ibLessonsDone && allCapstonesDone,
      progressLabel: ibLessonsDone && allCapstonesDone ? 'Earned' : `${ibLessonsDone ? 'Lessons done' : 'Lessons in progress'} · ${capstonesDoneCount}/${capstones.length} capstones`,
    },
    {
      id: 'trading-certified',
      title: 'Trading & Markets Certified',
      icon: '📟',
      description: 'Complete every lesson in the Trading & Markets career track.',
      earned: tradingDone,
      progressLabel: tradingDone ? 'Earned' : 'Complete the Trading & Markets track',
    },
    {
      id: 'consulting-certified',
      title: 'Consulting Certified',
      icon: '📊',
      description: 'Complete every lesson in the Consulting career track.',
      earned: consultingDone,
      progressLabel: consultingDone ? 'Earned' : 'Complete the Consulting track',
    },
    {
      id: 'curriculum-master',
      title: 'Full Curriculum Master',
      icon: '👑',
      description: 'Complete every single lesson across the entire Develop Knowledge curriculum.',
      earned: totalDone >= totalLessons,
      progressLabel: totalDone >= totalLessons ? 'Earned' : `${totalDone}/${totalLessons} lessons`,
    },
  ]
}
