#!/usr/bin/env node
/**
 * Content-truth check.
 *
 * Crash/NaN audits do not catch a page confidently stating "13 Finance
 * Careers" when there are 27, or a category badge silently rendering with no
 * colour because a lookup map is missing a key. Those are claims that drifted
 * away from the data, and nothing in a rendering test flags them.
 *
 * This asserts that what the site SAYS matches what the data IS.
 * Run with:  node scripts/content-truth-check.mjs
 * Exits non-zero on any mismatch.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const read = p => readFileSync(p, 'utf8')
const failures = []
const fail = (what, detail) => failures.push({ what, detail })

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(tsx?|html)$/.test(p)) out.push(p)
  }
  return out
}

const jobsSrc = read('src/data/jobs.ts')
const files = [...walk('src'), 'index.html']

// ---- ground truth -------------------------------------------------------
const careerCount = (jobsSrc.match(/^  \{\s*\n\s*id: '/gm) || []).length
const categories = new Set([...jobsSrc.matchAll(/category:\s*'([^']+)'/g)].map(m => m[1]))

const quizSrc = read('src/data/quiz.ts')
const quizDimensions = (quizSrc.match(/"dimension":/g) || []).length

// ---- 1. stated career counts must equal the real count ------------------
// Deliberately loose: any bare integer within ~45 characters of the words
// career/role/profile is treated as a claim about how many careers exist.
// A tight regex ("13 careers") misses the real-world phrasings that actually
// go stale, e.g. "13 in-depth finance career profiles" — which is exactly how
// one survived a previous pass. Over-flagging is cheap; a false claim is not.
// Only letters/hyphens/spaces may sit between the number and the noun, so
// "13 in-depth finance career profiles" is caught while "6 months into your
// analyst role" and "step: 6, description: '...roles'" are not — in those the
// number quantifies something else entirely.
const CLAIM = /(?<!\w)(\d{1,3})\+?\s+([A-Za-z][A-Za-z\- ]{0,40}?)?\b(careers?|roles?|career profiles?)\b/gi
const NOT_A_COUNT = /\b(month|months|year|years|week|weeks|day|days|hour|hours|step|level|round|rounds)\b/i
for (const f of files) {
  const s = read(f)
  for (const m of s.matchAll(CLAIM)) {
    const n = Number(m[1])
    const between = m[2] || ''
    if (n < 5 || n > 200) continue          // not a plausible career count
    if (NOT_A_COUNT.test(between)) continue // the number quantifies something else
    if (n !== careerCount) {
      fail('stale career count',
        `${f}: says "${m[0].replace(/\s+/g, ' ').trim()}" but there are ${careerCount} careers`)
    }
  }
}

// ---- 2. stated quiz length must match the real dimension count ----------
for (const f of files) {
  const s = read(f)
  for (const m of s.matchAll(/(\d+)[- ]question quiz/gi)) {
    if (Number(m[1]) !== quizDimensions) {
      fail('stale quiz length',
        `${f}: says "${m[0]}" but the quiz asks ${quizDimensions} questions`)
    }
  }
}

// ---- 3. every category lookup map must cover every real category --------
for (const f of files) {
  const s = read(f)
  for (const m of s.matchAll(/const\s+(\w*[Cc]olors?\w*|sectorImprove)\s*[^=]*=\s*\{([\s\S]*?)\n\}/g)) {
    const [, name, body] = m
    const keys = new Set([
      ...[...body.matchAll(/'([^']+)':/g)].map(x => x[1]),
      ...[...body.matchAll(/"([^"]+)":/g)].map(x => x[1]),
    ])
    // only treat it as a category map if it already covers several categories
    const hit = [...categories].filter(c => keys.has(c))
    if (hit.length >= 3) {
      const missing = [...categories].filter(c => !keys.has(c))
      if (missing.length) {
        fail('category map missing keys', `${f} ${name}: missing ${missing.join(', ')}`)
      }
    }
  }
}

// ---- 4. every career must map to a Learn unit that exists ---------------
const learnSrc = read('src/data/learn.ts')
const unitIds = new Set([...learnSrc.matchAll(/^    id: '([a-z0-9-]+)'/gm)].map(m => m[1]))
const histSrc = read('src/lib/history.ts')
const mapBody = histSrc.split('categoryToLearnUnit')[1] || ''
const mapped = [...mapBody.matchAll(/'([^']+)':\s*\{\s*unitId:\s*'([^']+)'/g)]
for (const c of categories) {
  if (!mapped.some(m => m[1] === c)) fail('category has no Learn unit', c)
}
for (const [, cat, unit] of mapped) {
  if (!unitIds.has(unit)) fail('Learn unit does not exist', `${cat} -> ${unit}`)
}

// ---- 5. every career must have interview model answers -----------------
for (const block of jobsSrc.split(/^  \{\s*$/m).slice(1)) {
  const id = (block.match(/id: '([a-z0-9-]+)'/) || [])[1]
  if (id && !block.includes('interviewQA')) fail('career has no interviewQA', id)
}

// ---- report -------------------------------------------------------------
console.log(`ground truth: ${careerCount} careers, ${categories.size} categories, ${quizDimensions} quiz questions\n`)
if (!failures.length) {
  console.log('PASS — every stated figure matches the data.')
  process.exit(0)
}
const grouped = {}
for (const f of failures) (grouped[f.what] ||= []).push(f.detail)
for (const [what, items] of Object.entries(grouped)) {
  console.log(`FAIL ${what} (${items.length})`)
  items.forEach(i => console.log('   ' + i))
}
console.log(`\n${failures.length} mismatch(es).`)
process.exit(1)
