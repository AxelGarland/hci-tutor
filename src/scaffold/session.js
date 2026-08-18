import { lessons, lessonItems, dueItems, SESSION_CAP } from './store'

export const DURATIONS = [45, 60, 90]
export const DEFAULT_MINUTES = 60

/**
 * Phase split of the session clock. Warm-up runs BEFORE any reading: attempting
 * retrieval before study improves later encoding even when the attempt fails.
 *
 * Sized for one chapter properly rather than a slice of one. At 60 minutes that is
 * roughly 6 / 33 / 15 / 6 — a study phase long enough to read, run the demo and
 * work the exercise, and a closing test long enough to cover most of the chapter.
 * Retrieval wants the opposite shape and lives in the short review mode instead:
 * three short sittings across three days beat one long one for retention.
 */
const SPLIT = { warmup: 0.1, study: 0.55, test: 0.25, summary: 0.1 }

export function budgets(minutes) {
  const total = minutes * 60 * 1000
  return Object.fromEntries(Object.entries(SPLIT).map(([k, v]) => [k, Math.round(total * v)]))
}

/**
 * Above this many genuinely overdue reviews the session stops introducing new
 * material. Letting the backlog grow while adding more is what kills the habit.
 */
export const REVIEW_GATE = 25

/**
 * Item counts scale with the clock. Fixed counts meant an hour-long sitting tested
 * the same six items as a fifteen-minute one, which wasted the time it just asked
 * for. `newFor` is a ceiling — a chapter with fewer items simply offers fewer.
 */
const warmupFor = (m) => Math.max(3, Math.round(m / 8))
const newFor = (m) => Math.max(4, Math.round(m / 6))
const oldFor = (m) => Math.max(2, Math.round(m / 10))

export function nextLesson(progress) {
  const all = lessons()
  return all.find((l) => !progress.lessons[l.id]) ?? all[0]
}

/** Alternate the two lists so the closing test interleaves rather than blocks. */
function interleave(a, b) {
  const out = []
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i]) out.push(a[i])
    if (b[i]) out.push(b[i])
  }
  return out
}

export function buildSession(progress, lessonId, minutes = DEFAULT_MINUTES, now = Date.now()) {
  const b = budgets(minutes)
  const due = dueItems(progress, now)
  // A "review" is something already in the schedule; unseen items are new material.
  const reviews = due.filter((i) => progress.items[i.id])

  if (reviews.length > REVIEW_GATE) {
    return { mode: 'review-only', budgets: b, minutes, reviews: reviews.slice(0, SESSION_CAP) }
  }

  const lesson = lessons().find((l) => l.id === lessonId) ?? nextLesson(progress)
  const elsewhere = reviews.filter((i) => i.lesson.id !== lesson.id)

  const warmup = elsewhere.slice(0, warmupFor(minutes))
  const usedInWarmup = new Set(warmup.map((i) => i.id))

  const fresh = lessonItems(lesson)
    .slice(0, newFor(minutes))
    .map((item) => ({ item, origin: 'new' }))
  const older = elsewhere
    .filter((i) => !usedInWarmup.has(i.id))
    .slice(0, oldFor(minutes))
    .map((item) => ({ item, origin: 'old' }))

  return { mode: 'study', budgets: b, minutes, lesson, warmup, test: interleave(fresh, older) }
}
