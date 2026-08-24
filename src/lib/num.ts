// Small numeric guards.
//
// Every "0 / 0" in JavaScript silently produces NaN, and "x / 0" produces
// Infinity — both of which render straight into the page as literal "NaN%"
// or "Infinity%" text and as broken CSS widths. These helpers make the
// empty/zero case explicit so a division can never leak a non-finite value
// into the UI.

/** Percentage of part out of whole, safe when whole is 0. Returns 0-100. */
export function pct(part: number, whole: number): number {
  if (!whole || !Number.isFinite(whole) || !Number.isFinite(part)) return 0
  const value = (part / whole) * 100
  return Number.isFinite(value) ? value : 0
}

/** pct() rounded to a whole number — the common case for display. */
export function pctRounded(part: number, whole: number): number {
  return Math.round(pct(part, whole))
}

/** Mean of a list, safe when the list is empty. */
export function mean(values: number[]): number {
  if (!values.length) return 0
  const total = values.reduce((sum, v) => sum + v, 0)
  return Number.isFinite(total) ? total / values.length : 0
}

/** Math.max over a list, safe when empty (Math.max() of nothing is -Infinity). */
export function safeMax(values: number[], fallback = 0): number {
  if (!values.length) return fallback
  const max = Math.max(...values)
  return Number.isFinite(max) ? max : fallback
}

/** Clamp a CSS percentage into 0-100 so a bar can never render outside its track. */
export function barWidth(part: number, whole: number): string {
  return `${Math.min(100, Math.max(0, pct(part, whole)))}%`
}
