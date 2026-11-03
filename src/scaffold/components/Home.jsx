import { useId, useState } from 'react'
import ChaptersMenu from './ChaptersMenu'
import { lessonItems, lessonMastery, courseList, courseStats } from '../store'

export default function Home({ progress, courseId, onCourse, onSelect, onSession }) {
  // Keyed by course id. The browse control and the chapter index used to sit
  // after the course list and read from the *active* course, so with two courses
  // the control appeared to belong to the second block while listing the first —
  // "Browse all 43 chapters" under a six-chapter course. Each course now owns its
  // own control, its own index and its own open state.
  const [openCourses, setOpenCourses] = useState(() => new Set())
  const [expanded, setExpanded] = useState(() => new Set())
  const panelId = useId()

  const toggleCourse = (id) =>
    setOpenCourses((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const toggle = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="min-h-full bg-paper">
      {/* ── Hero ─────────────────────────────────────────────────────────────
          A poster, not a page with a logo on it. One field of cobalt, the
          wordmark at poster scale, and the single yellow object on the screen
          is the thing you are meant to press. Colour marks where the product
          ends and the course begins: everything below this fold is paper. */}
      <section className="on-cobalt relative flex min-h-[100svh] flex-col overflow-hidden bg-cobalt text-paper">
        <div className="relative flex items-center justify-between gap-4 p-5 md:p-8">
          <span className="micro">Scaffold</span>
          <ChaptersMenu onSelect={onSelect} />
        </div>

        <div className="relative mt-auto px-5 pb-[12vh] md:px-10">
          <h1 className="display">
            Scaffold
            <span className="text-accent">*</span>
          </h1>

          {/* Ink on yellow measures 12.0:1. White on yellow measures 1.57:1 and
              appears nowhere in this design. */}
          <button
            onClick={onSession}
            className="micro mt-8 bg-accent px-6 py-4 text-ink"
          >
            Start a session
          </button>
        </div>
      </section>

      {/* ── Below the fold ───────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-5 pb-24 pt-14 md:px-10">
        <section>
          <p className="reading max-w-[52ch] text-lg">
            A structure for teaching a course: chapters you read, demos you run on yourself, and a
            schedule that brings each idea back before you forget it.
          </p>
          <p className="reading mt-4 max-w-[52ch] text-[15px] muted">
            A study sitting is an hour and covers one chapter properly. A review sitting is ten
            minutes of recall on whatever is due — short and frequent is what retention wants,
            which is the opposite of what comprehension wants.
          </p>
        </section>

        {courseList.map((c) => {
          const s = courseStats(c)
          const isActive = c.id === courseId
          const isOpen = openCourses.has(c.id)
          return (
            <section key={c.id} className="mt-16 border-t-2 border-ink pt-6">
              <h2 className="micro muted">Course</h2>

              <div className="mt-4 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
                <div>
                  <button
                    onClick={() => (isActive ? toggleCourse(c.id) : onCourse(c.id))}
                    className="text-left"
                  >
                    <span className="block text-3xl font-black leading-[0.95] tracking-[-0.03em] md:text-5xl">
                      {c.title}
                    </span>
                  </button>
                  <p className="reading mt-4 max-w-[48ch] text-[15px] muted">{c.blurb}</p>
                </div>
                {/* The figures are the one place a number is the message, so they
                    take the accent colour rather than the body grey. */}
                <p className="micro num flex flex-wrap gap-x-4 gap-y-1 muted">
                  <span><span className="text-cobalt">{s.chapters}</span> ch</span>
                  <span><span className="text-cobalt">{s.items}</span> items</span>
                  <span><span className="text-cobalt">{s.demos}</span> demos</span>
                </p>
              </div>

              {/* Control row, scoped to this course ---------------------- */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                {/* One control, not two: the accent square is the disclosure
                    indicator inside the button, so there is a single target and
                    a single label. */}
                <button
                  onClick={() => toggleCourse(c.id)}
                  aria-expanded={isOpen}
                  aria-controls={`${panelId}-${c.id}`}
                  className="slab-flat flex flex-1 items-stretch overflow-hidden text-left"
                >
                  <span className="micro flex flex-1 items-center bg-ink px-6 py-5 text-paper">
                    Browse all {s.chapters} chapters
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex w-16 shrink-0 items-center justify-center text-2xl leading-none"
                    style={{ background: 'var(--color-accent)' }}
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                <button onClick={() => onSession(c.id)} className="slab-flat px-6 py-5 text-left">
                  <span className="micro">Start a 60-minute session</span>
                </button>
              </div>

              {/* Chapter index, scoped to this course -------------------- */}
              {isOpen && (
                <nav id={`${panelId}-${c.id}`} className="reveal mt-8">
                  {c.modules.map((m) => {
                    const modKey = `${c.id}:${m.id}`
                    const modOpen = expanded.has(modKey)
                    return (
                      <div key={m.id} className="border-t border-rule">
                        <button
                          onClick={() => toggle(modKey)}
                          aria-expanded={modOpen}
                          aria-controls={`${panelId}-${modKey}`}
                          className="flex w-full items-baseline gap-4 py-4 text-left"
                        >
                          <span className="micro flex-1 leading-snug">{m.title}</span>
                          <span className="micro muted tabular-nums">{m.lessons.length}</span>
                          <span aria-hidden="true" className="tap w-4 text-right text-base leading-none">
                            {modOpen ? '−' : '+'}
                          </span>
                        </button>

                        {modOpen && (
                          <ul id={`${panelId}-${modKey}`} className="reveal mb-5 grid gap-x-10 gap-y-1 sm:grid-cols-2">
                            {m.lessons.map((l) => {
                              // Counted through lessonItems so every item kind is
                              // included; hand-summing cards and quiz undercounted
                              // the moment a third kind existed.
                              const count = lessonItems(l).length
                              // Mastery is only knowable for the open course —
                              // progress is namespaced per course and only the
                              // active one is loaded. Showing 0% for the others
                              // would be a claim, not a blank.
                              const pct = isActive
                                ? Math.round(lessonMastery(progress, l) * 100)
                                : null
                              return (
                                <li key={l.id}>
                                  <button
                                    onClick={() => onSelect(c.id, l.id)}
                                    className="w-full py-2 text-left hover:bg-cobalt/10"
                                  >
                                    <span className="block text-[15px] font-bold leading-snug">
                                      <span className="num text-cobalt">{l.number}.</span> {l.title}
                                    </span>
                                    <span className="mt-0.5 block text-[11px] muted">
                                      {count} items
                                      {l.demos?.length ? ` · ${l.demos.length} demo` : ''}
                                      {pct ? ` · ${pct}% mastered` : ''}
                                    </span>
                                  </button>
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </div>
                    )
                  })}
                  <div className="border-t border-rule" />
                </nav>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
