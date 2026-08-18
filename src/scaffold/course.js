import { COURSES, DEFAULT_COURSE } from '../courses'

const KEY = 'scaffold:course'

function loadId() {
  try {
    const v = localStorage.getItem(KEY)
    return v && COURSES[v] ? v : DEFAULT_COURSE
  } catch {
    return DEFAULT_COURSE
  }
}

let activeId = loadId()

export const courseList = Object.values(COURSES)

export function activeCourseId() {
  return activeId
}

export function setActiveCourseId(id) {
  if (!COURSES[id]) return
  activeId = id
  try {
    localStorage.setItem(KEY, id)
  } catch {
    // Non-persisting is fine.
  }
}

export function course() {
  return COURSES[activeId]
}

/** Derived views, memoised per course so switching does not leak the old catalog. */
const cache = new Map()

function derived() {
  if (cache.has(activeId)) return cache.get(activeId)
  const c = course()
  const lessons = c.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title, color: m.color })),
  )
  const value = { lessons, allItems: lessons.flatMap(lessonItems) }
  cache.set(activeId, value)
  return value
}

export function lessonItems(lesson) {
  const cards = (lesson.cards ?? []).map((c) => ({ ...c, kind: 'card', lesson }))
  const quiz = (lesson.quiz ?? []).map((q) => ({ ...q, kind: 'quiz', lesson }))
  return [...cards, ...quiz]
}

export function lessons() {
  return derived().lessons
}

export function allItems() {
  return derived().allItems
}

export function demos() {
  return course().demos ?? {}
}

export function figures() {
  return course().figures ?? {}
}

export function designNotes() {
  return course().designNotes ?? {}
}

/** Course stats for the home screen. */
export function courseStats(c) {
  const ls = c.modules.flatMap((m) => m.lessons)
  const items = ls.reduce((n, l) => n + (l.cards?.length ?? 0) + (l.quiz?.length ?? 0), 0)
  return {
    chapters: ls.length,
    modules: c.modules.length,
    items,
    demos: Object.keys(c.demos ?? {}).length,
  }
}
