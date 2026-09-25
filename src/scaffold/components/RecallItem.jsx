import { useEffect, useRef, useState } from 'react'
import GradeButtons from './GradeButtons'

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
            rows={3}
            className="slab-flat w-full resize-none bg-paper px-3 py-2 text-[15px] leading-relaxed"
            placeholder="Write it out — the writing is what does the work."
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
              Reveal
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
          {typed.trim() && (
            <div className="slab-flat bg-paper p-4">
              <p className="text-[11px] font-bold uppercase tracking-widest muted">You wrote</p>
              <p className="mt-1.5 text-[15px] leading-relaxed">{typed}</p>
            </div>
          )}

          <div className="slab-flat border-cobalt bg-paper p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest muted">Answer</p>
            <p className="mt-1.5 text-[15px] font-bold leading-relaxed">{answer}</p>
            {item.kind === 'quiz' && item.why && (
              <p className="mt-2 border-t-2 border-ink pt-2 text-[14px] leading-relaxed">{item.why}</p>
            )}
          </div>

          <GradeButtons onGrade={(correct) => onGraded(correct, confidence)} />
        </div>
      )}
    </div>
  )
}
