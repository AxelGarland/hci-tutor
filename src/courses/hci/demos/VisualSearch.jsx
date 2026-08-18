import { useRef, useState } from 'react'

const SET_SIZES = [6, 12, 24, 40]
const CONDITIONS = {
  feature: { label: 'Single feature', note: 'target differs by colour alone' },
  conjunction: { label: 'Conjunction', note: 'target shares colour with some, shape with others' },
}

/**
 * Target is always a red circle.
 * Feature condition: distractors are blue circles — one unique feature isolates the target.
 * Conjunction condition: distractors are red squares and blue circles — no single feature works.
 */
function buildTrial(condition, n) {
  const items = [{ shape: 'circle', color: 'red', target: true }]
  for (let i = 1; i < n; i++) {
    if (condition === 'feature') {
      items.push({ shape: 'circle', color: 'blue' })
    } else {
      items.push(i % 2 ? { shape: 'square', color: 'red' } : { shape: 'circle', color: 'blue' })
    }
  }
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
  return items
}

export default function VisualSearch() {
  const startedAt = useRef(0)
  const [trial, setTrial] = useState(null)
  const [results, setResults] = useState([])
  const [miss, setMiss] = useState(false)

  const start = () => {
    const condition = Math.random() < 0.5 ? 'feature' : 'conjunction'
    const n = SET_SIZES[Math.floor(Math.random() * SET_SIZES.length)]
    setMiss(false)
    setTrial({ condition, n, items: buildTrial(condition, n) })
    startedAt.current = performance.now()
  }

  const click = (item) => {
    if (!item.target) {
      setMiss(true)
      return
    }
    const rt = performance.now() - startedAt.current
    setResults((r) => [...r, { condition: trial.condition, n: trial.n, rt }].slice(-80))
    setTrial(null)
  }

  const cell = (cond, n) => {
    const hits = results.filter((r) => r.condition === cond && r.n === n)
    if (!hits.length) return null
    return hits.reduce((s, r) => s + r.rt, 0) / hits.length
  }

  return (
    <div className="space-y-4">
      <div className="slab-flat bg-white p-4">
        {!trial ? (
          <button
            onClick={start}
            className="slab-flat w-full bg-yellow px-4 py-3 text-sm font-bold uppercase tracking-wide"
          >
            Start a trial — find the red circle
          </button>
        ) : (
          <>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide">
              Click the red circle{miss && <span className="ml-2 bg-red px-1.5 py-0.5 text-white">wrong item</span>}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {trial.items.map((it, i) => (
                <button
                  key={i}
                  onClick={() => click(it)}
                  aria-label={`${it.color} ${it.shape}`}
                  className={`raw h-7 w-7 coarse:h-10 coarse:w-10 ${it.color === 'red' ? 'bg-red' : 'bg-blue'} ${
                    it.shape === 'circle' ? 'rounded-full' : ''
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="slab-flat overflow-x-auto bg-white p-3">
        <div className="mb-3 text-xs font-bold uppercase tracking-wide">
          Mean search time by set size
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-ink">
              <th className="py-1.5 pr-3 text-xs font-bold uppercase tracking-wide">Condition</th>
              {SET_SIZES.map((n) => (
                <th key={n} className="py-1.5 pr-3 text-xs font-bold tabular-nums">
                  n={n}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(CONDITIONS).map(([key, c]) => (
              <tr key={key} className="border-b border-black/10">
                <td className="py-2 pr-3">
                  <span className="block font-bold">{c.label}</span>
                  <span className="block text-[11px] opacity-60">{c.note}</span>
                </td>
                {SET_SIZES.map((n) => {
                  const v = cell(key, n)
                  return (
                    <td key={n} className="py-2 pr-3 tabular-nums">
                      {v ? `${v.toFixed(0)}ms` : <span className="muted">—</span>}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs leading-relaxed opacity-80">
          Run a dozen trials of each. The single-feature row should stay roughly flat as the set
          grows — that search is parallel. The conjunction row should climb, because nothing pops
          out and you are checking items one at a time.
        </p>
        {results.length > 0 && (
          <button
            onClick={() => setResults([])}
            className="mt-2 text-xs font-bold uppercase tracking-wide underline"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
