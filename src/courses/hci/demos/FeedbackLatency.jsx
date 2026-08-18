import { useEffect, useRef, useState } from 'react'

const DELAYS = [
  { ms: 80, label: '80 ms', note: 'feels instantaneous' },
  { ms: 900, label: '900 ms', note: 'noticed, but thought is unbroken' },
  { ms: 4000, label: '4 s', note: 'attention starts to wander' },
]

export default function FeedbackLatency() {
  const [delay, setDelay] = useState(900)
  const [feedback, setFeedback] = useState(false)
  const [pending, setPending] = useState(false)
  const [submits, setSubmits] = useState(0)
  const [done, setDone] = useState(0)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const submit = () => {
    setSubmits((s) => s + 1)
    if (pending) return // A duplicate press: the click still counted as an order.
    setPending(true)
    timer.current = setTimeout(() => {
      setPending(false)
      setDone((d) => d + 1)
    }, delay)
  }

  const reset = () => {
    clearTimeout(timer.current)
    setPending(false)
    setSubmits(0)
    setDone(0)
  }

  const duplicates = Math.max(0, submits - done - (pending ? 1 : 0))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="slab-flat bg-white p-3">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide">Server delay</div>
          <div className="flex gap-2">
            {DELAYS.map((d) => (
              <button
                key={d.ms}
                onClick={() => { reset(); setDelay(d.ms) }}
                className={`slab-flat px-3 py-1.5 text-xs font-bold ${
                  delay === d.ms ? 'bg-blue text-white' : 'bg-paper'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] opacity-70">
            {DELAYS.find((d) => d.ms === delay).note}
          </p>
        </div>

        <div className="slab-flat bg-white p-3">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide">Feedback</div>
          <button
            onClick={() => { reset(); setFeedback((f) => !f) }}
            className={`slab-flat px-3 py-1.5 text-xs font-bold ${
              feedback ? 'bg-teal text-white' : 'bg-paper'
            }`}
          >
            {feedback ? 'Acknowledged' : 'None'}
          </button>
          <p className="mt-2 text-[11px] opacity-70">
            {feedback ? 'The press is confirmed at once' : 'The button says nothing until it finishes'}
          </p>
        </div>
      </div>

      <div className="slab-flat flex flex-col items-center gap-3 bg-white p-6">
        <button
          onClick={submit}
          className={`slab px-8 py-4 text-base font-bold uppercase tracking-wide ${
            feedback && pending ? 'bg-paper opacity-60' : 'bg-red text-white'
          }`}
        >
          {feedback && pending ? 'Placing order…' : 'Place order'}
        </button>
        <p className="text-sm">
          Orders placed: <span className="font-bold">{submits}</span>
          {duplicates > 0 && (
            <span className="ml-2 bg-yellow px-1.5 py-0.5 text-xs font-bold">
              {duplicates} duplicate{duplicates > 1 ? 's' : ''}
            </span>
          )}
        </p>
        <button onClick={reset} className="text-xs font-bold uppercase tracking-wide underline">
          Reset
        </button>
      </div>

      <p className="text-xs leading-relaxed opacity-80">
        Set the delay to 4 s with feedback off, then press the button the way an impatient person
        would. Every one of those presses is a real order. Turn feedback on and try again — the
        latency has not changed at all, but the failure has.
      </p>
    </div>
  )
}
