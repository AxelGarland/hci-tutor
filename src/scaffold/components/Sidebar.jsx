import { useId, useState } from 'react'
import { course, designNotes, lessonMastery, SESSION_CAP } from '../store'
import BackupControls from './BackupControls'

/**
 * Length against a fixed baseline — the most accurately decoded encoding available
 * (Ch. 18). Fixed width rather than full-bleed: a full-width track reads as a rule
 * separating rows, which is a divider's job, not a meter's.
 */
function Mastery({ value, onDark }) {
  const pct = Math.round(value * 100)
  // Verdant only at the top of the scale, and only ever beside the number that
  // already says the same thing — the colour is never the claim.
  const fill = onDark ? 'bg-paper' : pct >= 100 ? 'bg-verdant' : 'bg-cobalt'
  return (
    <span className="mt-1.5 flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`block h-1.5 w-20 shrink-0 ${onDark ? 'bg-paper/30' : 'bg-rule'}`}
      >
        <span className={`block h-full ${fill}`} style={{ width: `${pct}%` }} />
      </span>
      <span className={`num text-[10px] ${onDark ? 'opacity-80' : 'muted'}`}>
        {pct > 0 ? `${pct}% mastered` : 'not started'}
      </span>
    </span>
  )
}

export default function Sidebar({
  progress,
  onNavigate = () => {},
  current,
  activeView,
  dueCount,
  examPlan,
  onSelect,
  onHome,
  onSession,
  onExam,
  onReview,
  onReset,
  onRestore,
  onColophon,
}) {
  const openModule = course().modules.find((m) => m.lessons.some((l) => l.id === current))
  const [expanded, setExpanded] = useState(() => new Set([openModule?.id]))
  const navId = useId()

  const toggle = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <aside className="flex h-full flex-col gap-6 overflow-y-auto p-5">
      <div>
        <button onClick={() => { onNavigate(); onHome() }} className="block text-left">
          <span className="block text-3xl font-black leading-none tracking-[-0.035em]">
            Scaffold<span className="text-cobalt">*</span>
          </span>
          <span className="micro mt-1.5 block text-cobalt">{course().title}</span>
        </button>
      </div>

      {/* One filled element in this view — the primary action. Everything else is
          outlined, so the single pop-out actually points somewhere (Ch. 2). */}
      <div className="space-y-2">
        <button
          onClick={() => { onNavigate(); onSession() }}
          aria-current={activeView === 'session' ? 'page' : undefined}
          className="micro block w-full bg-cobalt px-4 py-4 text-left text-paper"
        >
          Study session
          <span className="ml-2 font-medium normal-case tracking-normal opacity-90">
            60 min · one chapter
          </span>
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => { onNavigate(); onReview() }}
            aria-current={activeView === 'review' ? 'page' : undefined}
            className="pale px-3 py-2.5 text-left micro"
          >
            <span className="underline underline-offset-4">Review</span>
            <span className="mt-0.5 block font-normal normal-case muted">
              {dueCount > 0 ? `${Math.min(dueCount, SESSION_CAP)} of ${dueCount} due` : 'nothing due'}
            </span>
          </button>

          <button
            onClick={() => { onNavigate(); onExam() }}
            aria-current={activeView === 'exam' ? 'page' : undefined}
            className="pale px-3 py-2.5 text-left micro"
          >
            <span className="underline underline-offset-4">Exam plan</span>
            <span className="mt-0.5 block font-normal normal-case muted">
              {examPlan && !examPlan.passed
                ? `${examPlan.days} days · ${examPlan.perDay}/day`
                : 'no date set'}
            </span>
          </button>
        </div>
      </div>

      {/* Grouped by whitespace and a hairline rather than a box per row — 43 boxes
          is 43 shapes to parse before you read a single label (Ch. 16, Ch. 10). */}
      <nav className="space-y-1">
        {course().modules.map((m) => {
          const open = expanded.has(m.id)
          const holdsCurrent = m.lessons.some((l) => l.id === current)
          const panelId = `${navId}-${m.id}`
          return (
            <div key={m.id} className="border-t border-rule pt-1 first:border-t-0">
              <button
                onClick={() => toggle(m.id)}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex w-full items-baseline gap-2 py-2 text-left"
              >
                <span
                  className={`micro flex-1 leading-snug ${holdsCurrent ? 'text-cobalt' : 'muted'}`}
                >
                  {m.title}
                </span>
                <span aria-hidden="true" className="tap text-[13px] font-bold leading-none muted">
                  {open ? '−' : '+'}
                </span>
              </button>

              {open && (
                <ul id={panelId} className="mb-2 space-y-0.5">
                  {m.lessons.map((l) => {
                    const active = current === l.id
                    return (
                      <li key={l.id}>
                        <button
                          onClick={() => { onNavigate(); onSelect(l.id) }}
                          aria-current={active ? 'page' : undefined}
                          className={`w-full px-3 py-2 text-left text-sm ${
                            active ? 'bg-cobalt text-paper' : 'hover:bg-cobalt/10'
                          }`}
                        >
                          <span className="block font-bold leading-snug">
                            <span className={`num ${active ? 'opacity-75' : 'text-cobalt'}`}>
                              {l.number}.
                            </span>{' '}
                            {l.title}
                          </span>
                          <Mastery value={lessonMastery(progress, l)} onDark={active} />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </nav>

      <div className="mt-auto space-y-3 border-t border-rule pt-4">
        <BackupControls progress={progress} onRestore={onRestore} />

        <div className="flex flex-wrap gap-x-5 gap-y-1">
          {Object.keys(designNotes()).length > 0 && (
            <button onClick={() => { onNavigate(); onColophon() }} className="micro py-1 underline underline-offset-4 muted">
              Why it is built this way
            </button>
          )}
          <button onClick={onReset} className="micro py-1 underline underline-offset-4 muted">
            Reset progress
          </button>
        </div>
      </div>
    </aside>
  )
}
