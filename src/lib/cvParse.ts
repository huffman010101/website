// Local CV analysis for the CV → Interview Coach. Everything runs in the
// browser — the CV never leaves the device.

import { competencies, standoutSignals, weakPhrases, behaviouralQuestions } from '../data/cvCoach'
import type { Competency, StandoutSignal, BehaviouralQuestion } from '../data/cvCoach'

// A number that is evidence (money, %, counts of people/things, 1,000s) —
// deliberately not a bare year like "2024".
const QUANT_RE = /[£$€]\s?\d[\d,.]*\s?(k|m|bn)?|\d+(\.\d+)?\s?(%|k\b|m\b|bn\b)|\b\d{1,3}(,\d{3})+\b|\b\d+\+?\s?(people|members|students|customers|attendees|events|hours|hrs|clients|staff|users|tickets|countries|companies|children|pupils|volunteers|followers|subscribers|sessions|teams|days|weeks)\b|\btop \d+|\b\d+(st|nd|rd|th) (place|out of)|\bout of \d+/i

export function isQuantified(line: string) {
  return QUANT_RE.test(line)
}

export function firstQuantity(line: string): string | null {
  const m = line.match(QUANT_RE)
  return m ? m[0].trim() : null
}

// PDF extraction gives long runs of text with no line breaks, so split on
// bullet glyphs and sentence ends as well as new lines.
export function splitBullets(text: string): string[] {
  const chunks = text
    .replace(/\r/g, '')
    .split(/\n|[•▪●◦‣■□➢►]|\s[-–*]\s/)
    .flatMap(c => (c.split(/\s+/).length > 40 ? c.split(/(?<=[.;])\s+(?=[A-Z])/) : [c]))
    .map(c => c.replace(/^[\s\-–*·>]+/, '').replace(/\s+/g, ' ').trim())
  const seen = new Set<string>()
  return chunks.filter(c => {
    const words = c.split(' ').length
    if (words < 5 || words > 60) return false
    const key = c.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// Keywords with a trailing space are whole words ("led " must not match
// "handled"); the rest are stems ("collaborat" matches "collaborated").
const keywordRes: Record<string, RegExp[]> = {}
for (const c of competencies) {
  keywordRes[c.id] = c.keywords.map(k => {
    const body = k.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(`\\b${body}${k.endsWith(' ') ? '\\b' : ''}`, 'i')
  })
}

function keywordHits(line: string, c: Competency) {
  return keywordRes[c.id].reduce((n, re) => (re.test(line) ? n + 1 : n), 0)
}

const PAST_IRREGULAR = new Set(['led', 'ran', 'built', 'won', 'made', 'set', 'taught', 'wrote', 'grew', 'cut', 'sold', 'took', 'gave', 'spent', 'kept', 'met', 'brought', 'held', 'drove', 'chose', 'found', 'began', 'became', 'raised', 'oversaw', 'undertook', 'spoke', 'saw', 'got', 'put', 'read'])

function startsWithAction(line: string) {
  const first = line.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '')
  return first.endsWith('ed') || PAST_IRREGULAR.has(first)
}

export interface Evidence { line: string; score: number; quantified: boolean }

// Best evidence line per competency. Quantified lines win ties because they
// make stronger STAR results.
export function buildStoryMatrix(bullets: string[]): Record<string, Evidence[]> {
  const out: Record<string, Evidence[]> = {}
  for (const c of competencies) {
    out[c.id] = bullets
      .map(line => {
        const hits = keywordHits(line, c)
        const quantified = isQuantified(line)
        // Bullets that start with an action verb ("Led…", "Built…") make
        // better stories than headings like "Barista, Pret — part-time".
        const action = startsWithAction(line)
        return { line, quantified, score: hits === 0 ? 0 : hits * 2 + (quantified ? 1 : 0) + (action ? 1 : 0) }
      })
      .filter(e => e.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }
  return out
}


function asFirstPerson(line: string) {
  const clean = line.replace(/[.;]+$/, '')
  if (startsWithAction(clean)) {
    return 'I ' + clean.charAt(0).toLowerCase() + clean.slice(1)
  }
  return `Turn "${clean}" into what YOU did, starting "I…"`
}

export interface Scaffold {
  evidence: Evidence | null
  situation: string
  task: string
  action: string
  result: string
}

// Builds a STAR scaffold from the user's own CV line. It never invents
// experience: anything the CV can't tell us is left as an explicit prompt.
export function buildScaffold(q: BehaviouralQuestion, matrix: Record<string, Evidence[]>, bullets: string[]): Scaffold {
  const evidence = q.competency === 'narrative'
    ? null
    : (matrix[q.competency] || [])[0] || null
  if (q.competency === 'narrative') {
    const top = bullets.filter(isQuantified).slice(0, 3)
    return {
      evidence: null,
      situation: 'Open with who you are: degree, year, university — one sentence.',
      task: 'Name the moment your interest in finance started. Make it specific, not "I\'ve always loved finance".',
      action: top.length
        ? `Pick 2–3 experiences with numbers behind them, in order. From your CV: ${top.map(t => `"${t}"`).join('; ')}.`
        : 'Pick 2–3 experiences and give each one concrete detail. Your CV has few numbers yet — see the Gaps tab.',
      result: 'Finish on why THIS role is the logical next step. Aim for about two minutes.',
    }
  }
  if (!evidence) {
    return {
      evidence: null,
      situation: 'Your CV has no clear example for this yet. Think beyond the CV: part-time work, school, sport, family responsibilities and group coursework all count.',
      task: 'What were you personally responsible for?',
      action: 'List 2–3 specific steps you took — use "I", not "we".',
      result: '[Add a result — a number, a deadline met, a grade, or feedback you received]',
    }
  }
  const qty = firstQuantity(evidence.line)
  return {
    evidence,
    situation: '[Where and when was this? What problem or stake made it matter? One or two sentences.]',
    task: '[What were YOU specifically responsible for — not the team?]',
    action: `${asFirstPerson(evidence.line)}. [Now add 2–3 specific steps: how you did it, a decision you made, and why.]`,
    result: qty
      ? `Lead with your number: ${qty}. [Then add what changed afterwards or what you learned.]`
      : '[Add a result — your CV line has no number. A count, %, £, time saved, grade or feedback all work.]',
  }
}

export interface WeakHit { line: string; phrase: string; fix: string }

export interface CvAnalysis {
  bullets: string[]
  wordCount: number
  quantifiedPct: number
  quantifiedCount: number
  matrix: Record<string, Evidence[]>
  covered: Competency[]
  uncovered: Competency[]
  weak: WeakHit[]
  present: StandoutSignal[]
  missing: StandoutSignal[]
  priorities: { title: string; detail: string }[]
}

// Order matters: missing signals are recommended in this priority.
const SIGNAL_PRIORITY = ['experience', 'grades', 'society', 'modelling', 'pitch', 'role', 'virtual', 'investing', 'job', 'coding', 'bloomberg', 'qualification']

export function analyseCv(text: string): CvAnalysis {
  const bullets = splitBullets(text)
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const quantifiedCount = bullets.filter(isQuantified).length
  const quantifiedPct = bullets.length ? Math.round((quantifiedCount / bullets.length) * 100) : 0
  const matrix = buildStoryMatrix(bullets)
  const covered = competencies.filter(c => matrix[c.id].length > 0)
  const uncovered = competencies.filter(c => matrix[c.id].length === 0)

  const weak: WeakHit[] = []
  for (const line of bullets) {
    for (const w of weakPhrases) {
      const m = line.match(new RegExp(`\\b(${w.pattern})\\b`, 'i'))
      if (m) { weak.push({ line, phrase: m[0], fix: w.fix }); break }
    }
  }

  const lower = text.toLowerCase()
  const present = standoutSignals.filter(s => new RegExp(s.pattern, 'i').test(lower))
  const missing = SIGNAL_PRIORITY
    .map(id => standoutSignals.find(s => s.id === id)!)
    .filter(s => s && !present.includes(s))

  const priorities: { title: string; detail: string }[] = []
  if (bullets.length && quantifiedPct < 50) {
    priorities.push({
      title: `Quantify more bullets (${quantifiedPct}% have a number)`,
      detail: 'Aim for at least half. Add a count, %, £ amount, time saved or ranking to each bullet — recruiters skim for numbers.',
    })
  }
  for (const s of missing.slice(0, 3)) priorities.push({ title: `Add: ${s.label}`, detail: s.howToAdd })
  for (const c of uncovered.slice(0, 2)) priorities.push({ title: `No ${c.label.toLowerCase()} story yet`, detail: c.addIdeas[0] })
  if (weak.length) {
    priorities.push({
      title: `Rewrite ${weak.length} weak phrase${weak.length === 1 ? '' : 's'}`,
      detail: 'Passive wording ("responsible for", "helped") hides what you did. See the list below.',
    })
  }

  return {
    bullets, wordCount, quantifiedPct, quantifiedCount, matrix, covered, uncovered,
    weak, present, missing, priorities: priorities.slice(0, 5),
  }
}

export { behaviouralQuestions }

// Accepts "2.3m", "7k", "£3.8bn", "1,895,400", "579".
export function parseNumberInput(raw: string): number | null {
  const s = raw.toLowerCase().replace(/[£$€,\s]/g, '').replace(/(million|mn)$/, 'm').replace(/(billion)$/, 'bn').replace(/(thousand)$/, 'k')
  const m = s.match(/^(-?\d*\.?\d+)(k|m|bn|b)?$/)
  if (!m) return null
  const n = parseFloat(m[1])
  if (!Number.isFinite(n)) return null
  const mult = m[2] === 'k' ? 1e3 : m[2] === 'm' ? 1e6 : m[2] === 'bn' || m[2] === 'b' ? 1e9 : 1
  return n * mult
}

export function withinTolerance(value: number, answer: number, tolerancePct: number) {
  if (answer === 0) return value === 0
  return Math.abs(value - answer) / Math.abs(answer) * 100 <= tolerancePct
}
