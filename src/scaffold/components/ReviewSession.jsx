import { useMemo, useState } from 'react'

/**
 * Mixed review across the whole course: whatever the schedule says is due today,
 * cards and quiz questions interleaved.
 */
export default function ReviewSession({ items, onGrade, onExit }) {
  const queue = useMemo(() => items, [items])
  const [i, setI] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [chosen, setChosen] = useState(null)

  if (queue.length === 0) {
    return (
      <div className="slab-flat max-w-md bg-white p-6">
        <h2 className="text-2xl font-bold tracking-tight">Nothing due</h2>
        <p className="mt-2 text-sm leading-relaxed opacity-80">
          Everything you have studied is still inside its interval. Open a lesson to add new
          material, or come back tomorrow.
        </p>
      </div>
    )
  }

  if (i >= queue.length) {
    return (
      <div className="slab-flat max-w-md bg-white p-6">
        <h2 className="text-2xl font-bold tracking-tight">Review cleared</h2>
        <p className="mt-2 text-sm opacity-80">{queue.length} items done.</p>
        <button
          onClick={onExit}
          className="slab-flat mt-4 bg-yellow px-4 py-2 text-xs font-bold uppercase tracking-wide"
        >
          Back to the course
        </button>
      </div>
    )
  }

  const item = queue[i]

  const next = (correct) => {
    onGrade(item.id, correct)
    setRevealed(false)
    setChosen(null)
    setI((n) => n + 1)
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-bold uppercase tracking-widest opacity-60">
          Review — {i + 1} of {queue.length}
        </p>
        <p className="text-xs opacity-60">{item.lesson.title}</p>
      </div>

      <div className="h-1.5 w-full bg-white slab-flat">
        <div className="h-full bg-teal" style={{ width: `${(i / queue.length) * 100}%` }} />
      </div>

      {item.kind === 'card' ? (
        <>
          <div className="slab flex min-h-52 flex-col justify-center gap-4 bg-white p-6">
            <p className="text-lg font-bold leading-snug">{item.front}</p>
            {revealed && (
              <p className="border-t-2 border-ink pt-4 text-[15px] leading-relaxed">{item.back}</p>
            )}
          </div>
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="slab-flat w-full bg-blue px-4 py-3 text-xs font-bold uppercase tracking-wide text-white"
            >
              Reveal
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => next(false)}
                className="slab-flat flex-1 bg-red px-4 py-3 text-xs font-bold uppercase tracking-wide text-white"
              >
                Missed it
              </button>
              <button
                onClick={() => next(true)}
                className="slab-flat flex-1 bg-teal px-4 py-3 text-xs font-bold uppercase tracking-wide text-white"
              >
                Knew it
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="text-lg font-bold leading-snug">{item.question}</p>
          <div className="space-y-2">
            {item.options.map((opt, idx) => {
              const answered = chosen !== null
              let tone = 'bg-white hover:bg-yellow'
              if (answered && idx === item.answer) tone = 'bg-ink text-paper'
              else if (answered && idx === chosen) tone = 'bg-white'
              else if (answered) tone = 'bg-white muted'
              const mark =
                answered && idx === item.answer
                  ? 'Correct'
                  : answered && idx === chosen
                    ? 'Your answer'
                    : null
              return (
                <button
                  key={idx}
                  onClick={() => chosen === null && setChosen(idx)}
                  disabled={answered}
                  className={`slab-flat flex w-full items-baseline gap-3 px-4 py-3 text-left text-[15px] ${tone}`}
                >
                  <span className="flex-1">{opt}</span>
                  {mark && (
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest">
                      {mark}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          {chosen !== null && (
            <div className="space-y-3">
              <p className="border-l-4 border-ink bg-white px-4 py-3 text-sm leading-relaxed">
                {item.why}
              </p>
              <button
                onClick={() => next(chosen === item.answer)}
                className="slab-flat bg-blue px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
