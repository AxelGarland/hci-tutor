import { useEffect, useRef, useState } from 'react'
import Cite from './Cite'

const LEVELS = [
  { key: 'sure', label: 'Sure' },
  { key: 'think', label: 'Think so' },
  { key: 'guess', label: 'Guessing' },
]

/**
 * Free recall: you type the answer from nothing, commit a confidence, and only then
 * see the real one. Quiz items hide their options until the reveal, which turns a
 * recognition question into a recall question.
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

  const prompt = item.kind === 'card' ? item.front : item.question
  const answer = item.kind === 'card' ? item.back : item.options[item.answer]

  const reveal = (level) => {
    setConfidence(level ?? confidence ?? 'guess')
    setRevealed(true)
  }

  return (
    <div className="max-w-2xl space-y-4">
      {footer}

      <div className="slab bg-white p-5">
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
            rows={3}
            className="slab-flat w-full resize-none bg-white px-3 py-2 text-[15px] leading-relaxed"
            placeholder="Write it out — the writing is what does the work."
          />

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest opacity-60">
              How sure are you?
              <Cite id="confidence" />
            </span>
            {LEVELS.map((l) => (
              <button
                key={l.key}
                type="button"
                onClick={() => setConfidence(l.key)}
                className={`slab-flat px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
                  confidence === l.key ? 'bg-ink text-paper' : 'bg-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={!typed.trim() || !confidence}
              className="slab-flat bg-blue px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white disabled:opacity-40"
            >
              Reveal
            </button>
            <button
              type="button"
              onClick={() => { setTyped(''); reveal('guess') }}
              className="slab-flat bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide"
            >
              No idea
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {typed.trim() && (
            <div className="slab-flat bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-widest muted">You wrote</p>
              <p className="mt-1.5 text-[15px] leading-relaxed">{typed}</p>
            </div>
          )}

          <div className="slab-flat border-teal bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest muted">Answer</p>
            <p className="mt-1.5 text-[15px] font-bold leading-relaxed">{answer}</p>
            {item.kind === 'quiz' && item.why && (
              <p className="mt-2 border-t-2 border-ink pt-2 text-[14px] leading-relaxed">{item.why}</p>
            )}
          </div>

          <div className="flex gap-3">
            {/* Fill versus outline, not two hues — the pair has to stay separable
                with no colour in the design at all. */}
            <button
              onClick={() => onGraded(false, confidence)}
              className="slab-flat flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wide"
            >
              Missed it
            </button>
            <button
              onClick={() => onGraded(true, confidence)}
              className="slab-flat flex-1 bg-ink px-4 py-3 text-xs font-bold uppercase tracking-wide text-paper"
            >
              Got it
            </button>
          </div>
          <p className="text-[11px] leading-relaxed opacity-60">
            Grade yourself honestly — close enough in your own words counts, and inflating it only
            moves the item further out of the schedule.
          </p>
        </div>
      )}
    </div>
  )
}
