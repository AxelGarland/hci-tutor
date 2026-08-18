import { useId, useState } from 'react'
import { course, lessonMastery, SESSION_CAP } from '../store'
import Cite from './Cite'

/**
 * Length against a fixed baseline — the most accurately decoded encoding available
 * (Ch. 18). Fixed width rather than full-bleed: a full-width track reads as a rule
 * separating rows, which is a divider's job, not a meter's.
 */
function Mastery({ value, onDark }) {
  const pct = Math.round(value * 100)
  return (
    <span className="mt-1.5 flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`block h-1.5 w-20 shrink-0 ${onDark ? 'bg-white/30' : 'bg-rule'}`}
      >
        <span
          className={`block h-full ${onDark ? 'bg-paper' : 'bg-ink'}`}
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className={`text-[10px] tabular-nums ${onDark ? 'opacity-70' : 'muted'}`}>
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
          <span className="block text-2xl font-bold leading-none tracking-tight">Scaffold</span>
          <span className="mt-1 block text-[11px] uppercase tracking-widest muted">
            {course().title}
          </span>
        </button>
      </div>

      {/* One filled element in this view — the primary action. Everything else is
          outlined, so the single pop-out actually points somewhere (Ch. 2). */}
      <div className="space-y-2">
        <button
          onClick={() => { onNavigate(); onSession() }}
          aria-current={activeView === 'session' ? 'page' : undefined}
          className="block w-full bg-ink px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-paper"
        >
          Study session
          <span className="ml-2 font-normal normal-case opacity-90">60 min · one chapter</span>
        </button>
        {/* The citation marker is itself a button, so it sits beside the control
            rather than inside it — a nested button is invalid HTML and gives
            assistive tech two overlapping targets. */}
        <p className="text-[11px] leading-relaxed muted">
          One filled action, everything else outlined.
          <Cite id="popOut" />
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => { onNavigate(); onReview() }}
            aria-current={activeView === 'review' ? 'page' : undefined}
            className="pale px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wide"
          >
            <span className="underline underline-offset-4">Review</span>
            <span className="mt-0.5 block font-normal normal-case muted">
              {dueCount > 0 ? `${Math.min(dueCount, SESSION_CAP)} of ${dueCount} due` : 'nothing due'}
            </span>
          </button>

          <button
            onClick={() => { onNavigate(); onExam() }}
            aria-current={activeView === 'exam' ? 'page' : undefined}
            className="pale px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wide"
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
                  className={`flex-1 text-[11px] font-bold uppercase leading-snug tracking-widest ${
                    holdsCurrent ? '' : 'muted'
                  }`}
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
                            active ? 'bg-ink text-paper' : 'hover:bg-black/5'
                          }`}
                        >
                          <span className="block font-bold leading-snug">
                            <span className={active ? 'opacity-70' : 'muted'}>{l.number}.</span>{' '}
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
        <p className="text-[11px] leading-relaxed muted">
          No streaks, no daily goal, nothing here punishes a missed day.
          <Cite id="noStreak" />
        </p>
        <p className="text-[11px] leading-relaxed muted">
          Contrast, target sizes and colour coding are checked against WCAG 2.2.
          <Cite id="contrast" />
        </p>
        <button
          onClick={onReset}
          className="py-1 text-[11px] font-bold uppercase tracking-wide underline muted"
        >
          Reset progress
        </button>
      </div>
    </aside>
  )
}
