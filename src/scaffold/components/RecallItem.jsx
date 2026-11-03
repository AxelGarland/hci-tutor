import { useEffect, useRef, useState } from 'react'
import GradeButtons from './GradeButtons'
import { matchExact } from '../exact'

const LEVELS = [
  { key: 'sure', label: 'Sure' },
  { key: 'think', label: 'Think so' },
  { key: 'guess', label: 'Guessing' },
]

/**
 * Free recall: you type the answer from nothing, commit a confidence, and only then
 * see the real one.
 *
 * Three things make the verdict checkable rather than a feeling:
 *
 * 1. An `exact` item has one canonical answer, so the app checks the typed string
 *    and grades itself. No self-assessment at all.
 * 2. A quiz item reveals its full option list with the right one marked, so a
 *    written answer is checked against a precise target instead of a remembered
 *    approximation of one. The options stay hidden until then, which is what keeps
 *    a recognition question a recall question (Ch. 3: recognition "puts the
 *    candidates on the display and asks only for identification" — true of
 *    interfaces, and exactly why studying wants the opposite).
 * 3. An item carrying a `key` states the one thing the answer had to contain, so
 *    the judgement narrows from "was I close enough?" to "did I say that?".
 */
export default function RecallItem({ item, onGraded, footer }) {
  const [typed, setTyped] = useState('')
  const [confidence, setConfidence] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    setTyped('')
    setConfidence(null)
    setRevealed(false)
    inputRef.current?.focus()
  }, [item.id])

  const prompt = item.kind === 'card' ? item.front : item.kind === 'exact' ? item.prompt : item.question
  const answer =
    item.kind === 'card' ? item.back : item.kind === 'exact' ? item.accept[0] : item.options[item.answer]

  const checked = item.kind === 'exact'
  const isRight = checked ? matchExact(typed, item.accept) : null

  const reveal = (level) => {
    setConfidence(level ?? confidence ?? 'guess')
    setRevealed(true)
  }

  return (
    <div className="max-w-2xl space-y-4">
      {footer}

      <div className="slab bg-paper p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest muted">
          {item.lesson.number}. {item.lesson.title}
        </p>
        <p className="mt-2 text-lg font-bold leading-snug">{prompt}</p>
      </div>

      {!revealed ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (typed.trim() && confidence) reveal()
          }}
          className="space-y-3"
        >
          <label className="block text-[11px] font-bold uppercase tracking-widest opacity-60">
            Answer from memory
          </label>
          <textarea
            ref={inputRef}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            rows={checked ? 1 : 3}
            className="slab-flat w-full resize-none bg-paper px-3 py-2 text-[15px] leading-relaxed"
            placeholder={
              checked
                ? 'One answer — this one is checked for you.'
                : 'Write it out — the writing is what does the work.'
            }
          />

          {/* The wager is one choice among three, so the three have to read as one
              row. Wrapping them after the label split them 2 + 1 on a phone,
              where the orphan looked like a separate control. Label above,
              three equal columns below; the inline row returns at sm. */}
          <div className="space-y-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2 sm:space-y-0">
            <span className="micro block muted">How sure are you?</span>
            <div className="grid grid-cols-3 gap-2 sm:contents">
              {LEVELS.map((l) => (
                <button
                  key={l.key}
                  type="button"
                  onClick={() => setConfidence(l.key)}
                  className={`slab-flat whitespace-nowrap px-1.5 py-1.5 text-[11px] font-bold uppercase tracking-wide sm:px-3 sm:text-xs ${
                    confidence === l.key ? 'bg-ink text-paper' : 'bg-paper'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!typed.trim() || !confidence}
              className="slab-flat flex-1 bg-cobalt px-5 py-2.5 micro text-white disabled:opacity-40 sm:flex-none"
            >
              {checked ? 'Check' : 'Reveal'}
            </button>
            <button
              type="button"
              onClick={() => { setTyped(''); reveal('guess') }}
              className="slab-flat flex-1 bg-paper px-5 py-2.5 micro sm:flex-none"
            >
              No idea
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {/* A checked item states its verdict in words and in fill, and grades
              itself — there is nothing here for the reader to decide. */}
          {checked && (
            <div
              className={`slab-flat p-4 ${isRight ? 'border-verdant bg-paper' : 'border-signal bg-paper'}`}
            >
              <p className={`micro ${isRight ? 'text-verdant' : 'text-signal'}`}>
                {isRight ? 'Correct' : typed.trim() ? 'Not correct' : 'No answer given'}
              </p>
              {!isRight && (
                <p className="mt-1.5 text-[15px] font-bold leading-relaxed">{answer}</p>
              )}
              {item.note && (
                <p className="mt-2 border-t-2 border-ink pt-2 text-[14px] leading-relaxed">{item.note}</p>
              )}
            </div>
          )}

          {!checked && typed.trim() && (
            <div className="slab-flat bg-paper p-4">
              <p className="text-[11px] font-bold uppercase tracking-widest muted">You wrote</p>
              <p className="mt-1.5 text-[15px] leading-relaxed">{typed}</p>
            </div>
          )}

          {!checked && (
            <div className="slab-flat border-cobalt bg-paper p-4">
              <p className="text-[11px] font-bold uppercase tracking-widest muted">Answer</p>
              <p className="mt-1.5 text-[15px] font-bold leading-relaxed">{answer}</p>

              {/* The option list is the check: a precise target to compare the
                  written answer against. Hidden until now on purpose. */}
              {item.kind === 'quiz' && (
                <ul className="mt-3 space-y-1.5 border-t-2 border-ink pt-3">
                  {item.options.map((o, i) => (
                    <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed">
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 micro shrink-0 ${i === item.answer ? 'text-verdant' : 'muted'}`}
                      >
                        {i === item.answer ? '✓' : '—'}
                      </span>
                      <span className={i === item.answer ? 'font-bold' : 'muted'}>
                        {o}
                        {i === item.answer && <span className="sr-only"> (correct)</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {item.kind === 'quiz' && item.why && (
                <p className="mt-3 border-t-2 border-ink pt-3 text-[14px] leading-relaxed">{item.why}</p>
              )}
            </div>
          )}

          {/* Narrows the self-grade from "close enough?" to one checkable thing. */}
          {!checked && item.key && (
            <p className="reading border-l-[5px] border-cobalt py-0.5 pl-4 text-[14px]">
              Your answer had to contain: <span className="font-bold">{item.key}</span>
            </p>
          )}

          {checked ? (
            <button
              onClick={() => onGraded(isRight, confidence)}
              className="micro slab-flat w-full bg-cobalt px-4 py-3 text-white sm:w-auto sm:px-8"
            >
              Continue
            </button>
          ) : (
            <GradeButtons onGrade={(correct) => onGraded(correct, confidence)} />
          )}
        </div>
      )}
    </div>
  )
}
