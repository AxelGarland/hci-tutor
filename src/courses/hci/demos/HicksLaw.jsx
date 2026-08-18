import { useRef, useState } from 'react'

const WORDS = [
  'anchor', 'bramble', 'cinder', 'dovetail', 'ember', 'fathom', 'gable', 'harbour',
  'inlet', 'jetty', 'kestrel', 'lantern', 'marlin', 'nimbus', 'oriel', 'plinth',
]
const SET_SIZES = [2, 4, 8, 16]

function shuffle(arr) {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function newRound() {
  const n = SET_SIZES[Math.floor(Math.random() * SET_SIZES.length)]
  const options = shuffle(WORDS).slice(0, n)
  return { n, options, goal: options[Math.floor(Math.random() * n)] }
}

export default function HicksLaw() {
  const startedAt = useRef(0)
  const [round, setRound] = useState(null)
  const [trials, setTrials] = useState([])

  const start = () => {
    setRound(newRound())
    startedAt.current = performance.now()
  }

  const pick = (word) => {
    const rt = performance.now() - startedAt.current
    if (word === round.goal) {
      setTrials((t) => [...t, { n: round.n, rt }].slice(-40))
    }
    setRound(null)
  }

  // Mean reaction time per set size — the shape of the curve is the point.
  const byN = SET_SIZES.map((n) => {
    const hits = trials.filter((t) => t.n === n)
    return {
      n,
      mean: hits.length ? hits.reduce((s, t) => s + t.rt, 0) / hits.length : null,
      count: hits.length,
    }
  })
  const maxMean = Math.max(600, ...byN.map((b) => b.mean ?? 0))

  return (
    <div className="space-y-4">
      <div className="slab-flat bg-white p-4">
        {!round ? (
          <button
            onClick={start}
            className="slab-flat w-full bg-yellow px-4 py-3 text-sm font-bold uppercase tracking-wide"
          >
            Start a round
          </button>
        ) : (
          <>
            <p className="mb-3 text-sm">
              Find and click <span className="bg-yellow px-1.5 py-0.5 font-bold">{round.goal}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {round.options.map((w) => (
                <button
                  key={w}
                  onClick={() => pick(w)}
                  className="slab-flat bg-paper px-3 py-2 text-sm hover:bg-yellow"
                >
                  {w}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="slab-flat bg-white p-3">
        <div className="mb-3 text-xs font-bold uppercase tracking-wide">
          Mean decision time by number of options
        </div>
        <div className="flex items-end gap-4" style={{ height: 130 }}>
          {byN.map((b) => (
            <div key={b.n} className="flex flex-1 flex-col items-center justify-end gap-1">
              {b.mean !== null && (
                <span className="text-[10px] font-bold">{b.mean.toFixed(0)}ms</span>
              )}
              <div
                className="w-full bg-blue"
                style={{ height: b.mean ? `${(b.mean / maxMean) * 92}px` : '2px' }}
              />
              <span className="text-xs font-bold">n={b.n}</span>
              <span className="text-[10px] opacity-60">{b.count} trials</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed opacity-80">
          Going from 2 to 4 options costs about as much as going from 8 to 16. That equal cost for a
          doubling is what makes the relationship logarithmic rather than linear.
        </p>
        {trials.length > 0 && (
          <button
            onClick={() => setTrials([])}
            className="mt-2 text-xs font-bold uppercase tracking-wide underline"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
