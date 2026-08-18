import { useId, useState } from 'react'
import Cite from './Cite'
import ChaptersMenu from './ChaptersMenu'
import { course, lessons, lessonMastery, courseList, courseStats } from '../store'

export default function Home({ progress, courseId, onCourse, onSelect, onSession }) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(() => new Set())
  const panelId = useId()
  const active = course()
  const stats = courseStats(active)

  const toggle = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="min-h-full" style={{ background: 'var(--color-home)' }}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <div className="relative flex justify-end p-5 md:p-8">
          <ChaptersMenu onSelect={onSelect} />
        </div>

        <div className="relative mt-auto px-5 pb-[14vh] md:px-10">
          <h1 className="display">
            Scaffold
            <span style={{ color: 'var(--color-accent)' }}>*</span>
          </h1>

          <div className="mt-6 inline-block">
            <button onClick={onSession} className="micro px-1 py-4 underline underline-offset-4">
              Start a session
            </button>
          </div>
        </div>
      </section>

      {/* ── Below the fold ───────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-5 pb-24 md:px-10">
        <section className="border-t border-rule pt-8">
          <p className="max-w-[52ch] text-base leading-relaxed">
            A structure for teaching a course: chapters you read, demos you run on yourself, and a
            schedule that brings each idea back before you forget it.
          </p>
          <p className="mt-3 max-w-[52ch] text-sm leading-relaxed muted">
            A study sitting is an hour and covers one chapter properly. A review sitting is ten
            minutes of recall on whatever is due — short and frequent is what retention wants,
            which is the opposite of what comprehension wants.
          </p>
        </section>

        {courseList.map((c) => {
          const s = courseStats(c)
          const isActive = c.id === courseId
          return (
            <section key={c.id} className="mt-16 border-t border-rule pt-8">
              <h2 className="micro muted">
                Course
                <Cite id="coursePackages" />
              </h2>

              <div className="mt-4 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
                <div>
                  <button
                    onClick={() => (isActive ? setOpen(true) : onCourse(c.id))}
                    className="text-left"
                  >
                    <span className="block text-3xl font-bold leading-none tracking-tight md:text-4xl">
                      {c.title}
                    </span>
                  </button>
                  <p className="mt-3 max-w-[52ch] text-sm leading-relaxed muted">{c.blurb}</p>
                </div>
                <p className="micro muted tabular-nums">
                  {s.chapters} ch · {s.items} items · {s.demos} demos
                </p>
              </div>
            </section>
          )
        })}

        {/* Control row ---------------------------------------------------- */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
          {/* One control, not two: the accent square is the disclosure indicator
              inside the button, so there is a single target and a single label. */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={panelId}
            className="slab-flat flex flex-1 items-stretch overflow-hidden text-left"
          >
            <span className="micro flex flex-1 items-center bg-ink px-6 py-5 text-paper">
              Browse all {stats.chapters} chapters
            </span>
            <span
              aria-hidden="true"
              className="flex w-16 shrink-0 items-center justify-center text-2xl leading-none"
              style={{ background: 'var(--color-accent)' }}
            >
              {open ? '−' : '+'}
            </span>
          </button>

          <button onClick={onSession} className="slab-flat px-6 py-5 text-left">
            <span className="micro">Start a 60-minute session</span>
          </button>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed muted">
          Chapter rows carry item counts and mastery, so the label predicts what is behind it.
          <Cite id="homeEntry" />
        </p>

        {/* Chapter index --------------------------------------------------- */}
        {open && (
          <nav id={panelId} className="reveal mt-10">
            {active.modules.map((m) => {
              const isOpen = expanded.has(m.id)
              const modId = `${panelId}-${m.id}`
              return (
                <div key={m.id} className="border-t border-rule">
                  <button
                    onClick={() => toggle(m.id)}
                    aria-expanded={isOpen}
                    aria-controls={modId}
                    className="flex w-full items-baseline gap-4 py-4 text-left"
                  >
                    <span className="micro flex-1 leading-snug">{m.title}</span>
                    <span className="micro muted tabular-nums">{m.lessons.length}</span>
                    <span aria-hidden="true" className="tap w-4 text-right text-base leading-none">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <ul id={modId} className="reveal mb-5 grid gap-x-10 gap-y-1 sm:grid-cols-2">
                      {m.lessons.map((l) => {
                        const full = lessons().find((x) => x.id === l.id) ?? l
                        const pct = Math.round(lessonMastery(progress, full) * 100)
                        return (
                          <li key={l.id}>
                            <button
                              onClick={() => onSelect(l.id)}
                              className="w-full py-2 text-left hover:bg-black/5"
                            >
                              <span className="block text-[15px] font-bold leading-snug">
                                <span className="muted">{l.number}.</span> {l.title}
                              </span>
                              <span className="mt-0.5 block text-[11px] muted">
                                {(l.cards?.length ?? 0) + (l.quiz?.length ?? 0)} items
                                {l.demos?.length ? ` · ${l.demos.length} demo` : ''}
                                {pct > 0 ? ` · ${pct}% mastered` : ''}
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

        <footer className="mt-20 border-t border-rule pt-5">
          <p className="max-w-[62ch] text-[11px] leading-relaxed muted">
            Greyscale, with one accent used as a ground for black marks. Nothing is signalled by
            colour alone.
            <Cite id="accent" />
          </p>
        </footer>
      </div>
    </div>
  )
}
