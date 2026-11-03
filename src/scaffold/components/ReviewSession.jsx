import { useMemo, useState } from 'react'
import GradeButtons from './GradeButtons'
import { matchExact } from '../exact'

/**
 * Mixed review across the whole course: whatever the schedule says is due today,
 * cards and quiz questions interleaved.
 */
export default function ReviewSession({ items, onGrade, onExit }) {
  const queue = useMemo(() => items, [items])
  const [i, setI] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [chosen, setChosen] = useState(null)
  const [typed, setTyped] = useState('')
  const [checked, setChecked] = useState(false)

  if (queue.length === 0) {
    return (
      <div className="slab-flat max-w-md bg-paper p-6">
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
      <div className="slab-flat max-w-md bg-paper p-6">
        <h2 className="text-2xl font-bold tracking-tight">Review cleared</h2>
        <p className="mt-2 text-sm opacity-80">{queue.length} items done.</p>
        <button
          onClick={onExit}
          className="slab-flat mt-4 bg-accent px-4 py-2 micro"
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
    setTyped('')
    setChecked(false)
    setI((n) => n + 1)
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-baseline justify-between">
        <p className="microst opacity-60">
          Review — {i + 1} of {queue.length}
        </p>
        <p className="text-xs opacity-60">{item.lesson.title}</p>
      </div>

      <div className="h-1.5 w-full bg-paper slab-flat">
        <div className="h-full bg-cobalt" style={{ width: `${(i / queue.length) * 100}%` }} />
      </div>

      {item.kind === 'exact' ? (
        /* The one kind the app grades itself. Short answers only, so typing it is
           light even on a phone — and the verdict is a fact rather than a feeling. */
        <>
          <div className="slab flex min-h-52 flex-col justify-center gap-4 bg-paper p-6">
            <p className="text-lg font-bold leading-snug">{item.prompt}</p>
            {checked && (
              <div className="border-t-2 border-ink pt-4">
                <p className={`micro ${matchExact(typed, item.accept) ? 'text-verdant' : 'text-signal'}`}>
                  {matchExact(typed, item.accept)
                    ? 'Correct'
                    : typed.trim()
                      ? 'Not correct'
                      : 'No answer given'}
                </p>
                {!matchExact(typed, item.accept) && (
                  <p className="mt-1.5 text-[15px] font-bold leading-relaxed">{item.accept[0]}</p>
                )}
                {item.note && (
                  <p className="reading mt-2 text-[14px]">{item.note}</p>
                )}
              </div>
            )}
          </div>

          {!checked ? (
            <form
              onSubmit={(e) => { e.preventDefault(); if (typed.trim()) setChecked(true) }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                autoFocus
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Type the answer"
                className="slab-flat flex-1 bg-paper px-3 py-2.5 text-[15px]"
              />
              <button type="submit" disabled={!typed.trim()} className="slab-flat bg-cobalt px-5 py-2.5 micro text-white disabled:opacity-40">
                Check
              </button>
            </form>
          ) : (
            <button
              onClick={() => next(matchExact(typed, item.accept))}
              className="slab-flat w-full bg-cobalt px-4 py-3 micro text-white"
            >
              Next
            </button>
          )}
        </>
      ) : item.kind === 'card' ? (
        <>
          <div className="slab flex min-h-52 flex-col justify-center gap-4 bg-paper p-6">
            <p className="text-lg font-bold leading-snug">{item.front}</p>
            {revealed && (
              <p className="border-t-2 border-ink pt-4 text-[15px] leading-relaxed">{item.back}</p>
            )}
          </div>
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="slab-flat w-full bg-cobalt px-4 py-3 micro text-white"
            >
              Reveal
            </button>
          ) : (
            <GradeButtons onGrade={next} />
          )}
        </>
      ) : (
        <>
          <p className="text-lg font-bold leading-snug">{item.question}</p>
          <div className="space-y-2">
            {item.options.map((opt, idx) => {
              const answered = chosen !== null
              let tone = 'bg-paper hover:bg-accent'
              if (answered && idx === item.answer) tone = 'bg-ink text-paper'
              else if (answered && idx === chosen) tone = 'bg-paper'
              else if (answered) tone = 'bg-paper muted'
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
              <p className="border-l-4 border-ink bg-paper px-4 py-3 text-sm leading-relaxed">
                {item.why}
              </p>
              <button
                onClick={() => next(chosen === item.answer)}
                className="slab-flat bg-cobalt px-5 py-2.5 micro text-white"
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
