import { activeCourseId, allItems, lessonItems } from './course'

// Progress is per course, so switching courses never mixes two schedules.
const keyFor = (id) => `scaffold:progress:v1:${id}`
const LEGACY_KEY = 'hci-tutor:progress:v1'
const DAY = 24 * 60 * 60 * 1000

// Leitner boxes. Box n is reviewed after INTERVALS[n] days.
// Answering correctly promotes one box; answering wrong drops back to zero.
const INTERVALS = [0, 1, 3, 7, 16, 35]
export const MASTERED_BOX = INTERVALS.length - 1

/** An item missed this many times is a badly written card, not a memory problem. */
export const LEECH_THRESHOLD = 5

const empty = () => ({ items: {}, lessons: {}, exam: null, sessions: [] })

export function load() {
  const key = keyFor(activeCourseId())
  try {
    let raw = localStorage.getItem(key)
    // One-time carry-over from before courses were separate packages.
    if (!raw && activeCourseId() === 'hci') {
      const legacy = localStorage.getItem(LEGACY_KEY)
      if (legacy) {
        localStorage.setItem(key, legacy)
        localStorage.removeItem(LEGACY_KEY)
        raw = legacy
      }
    }
    if (!raw) return empty()
    return { ...empty(), ...JSON.parse(raw) }
  } catch {
    return empty()
  }
}

export function save(progress) {
  try {
    localStorage.setItem(keyFor(activeCourseId()), JSON.stringify(progress))
  } catch {
    // Storage full or blocked — the session still works, it just will not persist.
  }
}

export function reset() {
  localStorage.removeItem(keyFor(activeCourseId()))
}

const blank = () => ({ box: 0, due: 0, seen: 0, wrong: 0, confWrong: 0 })

/**
 * `confidence` is 'sure' | 'think' | 'guess'. Missing an item you were sure of is
 * tracked separately: those are the real gaps, while a missed guess is harmless.
 */
export function grade(progress, id, correct, confidence = 'think', now = Date.now()) {
  const prev = { ...blank(), ...progress.items[id] }
  const box = correct ? Math.min(prev.box + 1, MASTERED_BOX) : 0
  return {
    ...progress,
    items: {
      ...progress.items,
      [id]: {
        box,
        due: now + INTERVALS[box] * DAY,
        seen: prev.seen + 1,
        wrong: prev.wrong + (correct ? 0 : 1),
        confWrong: prev.confWrong + (!correct && confidence === 'sure' ? 1 : 0),
      },
    },
  }
}

export function markRead(progress, lessonId, summary, now = Date.now()) {
  const prev = progress.lessons[lessonId] ?? {}
  return {
    ...progress,
    lessons: {
      ...progress.lessons,
      [lessonId]: { ...prev, readAt: now, summary: summary ?? prev.summary },
    },
  }
}

export function setExam(progress, iso) {
  return { ...progress, exam: iso || null }
}

/** Keep a short history; nothing here drives streaks or guilt, it is just a record. */
export function recordSession(progress, record) {
  return { ...progress, sessions: [...(progress.sessions ?? []), record].slice(-40) }
}

// ---- Derived views over the active course ----------------------------------

export function dueItems(progress, now = Date.now()) {
  return allItems().filter((item) => {
    const state = progress.items[item.id]
    return !state || state.due <= now
  })
}

export const SESSION_CAP = 30

/**
 * A single sitting's queue. Items already in the schedule come first — a lapsed
 * review is worth more than a new card — then new material fills the remainder.
 * Without the cap, a fresh install would present all 278 items at once.
 */
export function sessionQueue(progress, now = Date.now(), cap = SESSION_CAP) {
  const due = dueItems(progress, now)
  const reviews = due.filter((i) => progress.items[i.id])
  const fresh = due.filter((i) => !progress.items[i.id])
  return [...reviews, ...fresh].slice(0, cap)
}

/** Fraction of a lesson's items that have reached the final box. */
export function lessonMastery(progress, lesson) {
  const items = lessonItems(lesson)
  if (items.length === 0) return 0
  const mastered = items.filter((i) => (progress.items[i.id]?.box ?? 0) >= MASTERED_BOX).length
  return mastered / items.length
}

export function overallStats(progress) {
  const items = allItems()
  const total = items.length
  const started = items.filter((i) => progress.items[i.id]).length
  const mastered = items.filter((i) => (progress.items[i.id]?.box ?? 0) >= MASTERED_BOX).length
  return { total, started, mastered, due: dueItems(progress).length }
}

/** Items missed repeatedly. The fix is to rewrite the card, not to drill it harder. */
export function leeches(progress) {
  return allItems()
    .filter((i) => (progress.items[i.id]?.wrong ?? 0) >= LEECH_THRESHOLD)
    .sort((a, b) => progress.items[b.id].wrong - progress.items[a.id].wrong)
}

/** Items you got wrong while marking yourself certain — the gaps worth attention. */
export function blindSpots(progress) {
  return allItems()
    .filter((i) => (progress.items[i.id]?.confWrong ?? 0) > 0)
    .sort((a, b) => progress.items[b.id].confWrong - progress.items[a.id].confWrong)
}

/**
 * Back-plan from an exam date.
 *
 * Reaching the final box takes MASTERED_BOX correct answers spaced 0+1+3+7+16 = 27
 * days apart, so full mastery has a hard floor no amount of daily effort beats. The
 * plan reports that honestly rather than promising a load that cannot deliver.
 */
export const MIN_DAYS_TO_MASTER = INTERVALS.slice(0, MASTERED_BOX).reduce((a, b) => a + b, 0)

export function examPlan(progress, now = Date.now()) {
  if (!progress.exam) return null
  const days = Math.ceil((new Date(progress.exam + 'T23:59:59').getTime() - now) / DAY)
  const reps = allItems().reduce(
    (sum, i) => sum + Math.max(0, MASTERED_BOX - (progress.items[i.id]?.box ?? 0)),
    0,
  )
  const perDay = days > 0 ? Math.ceil(reps / days) : reps
  return {
    days,
    reps,
    perDay,
    sessionsPerDay: Math.max(1, Math.ceil(perDay / SESSION_CAP)),
    masteryReachable: days >= MIN_DAYS_TO_MASTER,
    passed: days <= 0,
  }
}

// Re-exported so components have a single import for course data plus progress.
export { course, lessons, allItems, lessonItems, activeCourseId, setActiveCourseId, courseList, courseStats, demos, figures, designNotes } from './course'
