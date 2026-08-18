import { useRef, useState } from 'react'
import Cite from '../../../scaffold/components/Cite'

const AREA_H = 300
const SIZES = [18, 28, 44, 70]

function randomTarget(width) {
  const w = SIZES[Math.floor(Math.random() * SIZES.length)]
  const pad = w / 2 + 8
  return {
    w,
    x: pad + Math.random() * (width - pad * 2),
    y: pad + Math.random() * (AREA_H - pad * 2 - 60),
  }
}

/** Least-squares fit of MT = a + b·ID. */
function fit(trials) {
  const n = trials.length
  if (n < 3) return null
  const sx = trials.reduce((s, t) => s + t.id, 0)
  const sy = trials.reduce((s, t) => s + t.mt, 0)
  const sxy = trials.reduce((s, t) => s + t.id * t.mt, 0)
  const sxx = trials.reduce((s, t) => s + t.id * t.id, 0)
  const denom = n * sxx - sx * sx
  if (Math.abs(denom) < 1e-9) return null
  const b = (n * sxy - sx * sy) / denom
  const a = (sy - b * sx) / n
  return { a, b }
}

export default function FittsLaw() {
  const areaRef = useRef(null)
  const startedAt = useRef(0)
  const homeAt = useRef({ x: 0, y: 0 })
  const [target, setTarget] = useState(null)
  const [trials, setTrials] = useState([])

  const begin = (e) => {
    const box = areaRef.current.getBoundingClientRect()
    homeAt.current = { x: e.clientX - box.left, y: e.clientY - box.top }
    setTarget(randomTarget(box.width))
    startedAt.current = performance.now()
  }

  const hit = () => {
    const mt = performance.now() - startedAt.current
    const dx = target.x - homeAt.current.x
    const dy = target.y - homeAt.current.y
    const d = Math.hypot(dx, dy)
    const id = Math.log2((2 * d) / target.w)
    setTrials((t) => [...t, { mt, d, w: target.w, id }].slice(-40))
    setTarget(null)
  }

  const line = fit(trials)
  const maxId = Math.max(5, ...trials.map((t) => t.id))
  const maxMt = Math.max(800, ...trials.map((t) => t.mt))

  return (
    <div className="space-y-4">
      <div
        ref={areaRef}
        className="slab-flat relative overflow-hidden bg-white"
        style={{ height: AREA_H }}
      >
        {!target && (
          <button
            onClick={begin}
            className="absolute inset-0 flex items-center justify-center text-sm font-bold tracking-wide uppercase"
          >
            Click anywhere to start a trial
          </button>
        )}
        {target && (
          <button
            onClick={hit}
            aria-label="Target"
            className="raw absolute rounded-full bg-red transition-transform hover:scale-105"
            style={{
              width: target.w,
              height: target.w,
              left: target.x - target.w / 2,
              top: target.y - target.w / 2,
            }}
          />
        )}
        {target && (
          <div className="pointer-events-none absolute bottom-2 left-3 text-xs font-bold uppercase tracking-wide">
            Hit the red target
          </div>
        )}
      </div>

      <p className="text-[11px] leading-relaxed muted">
        Targets here go below the 24px accessibility minimum on purpose — a Fitts demo needs hard
        targets to have anything to show.
        <Cite id="demoTargets" />
      </p>

      <p className="hidden text-[11px] leading-relaxed muted coarse:block">
        On a touchscreen this measures finger acquisition rather than cursor movement, which the
        chapter treats as a different model — occlusion and landing ambiguity are what FFitts adds
        to Fitts. The fit still forms; read it as your touch performance, not your pointing.
      </p>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="slab-flat bg-white p-3">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide">
            Movement time vs. index of difficulty
          </div>
          <svg viewBox="0 0 300 160" className="w-full">
            <line x1="34" y1="140" x2="292" y2="140" stroke="currentColor" strokeWidth="1.5" />
            <line x1="34" y1="10" x2="34" y2="140" stroke="currentColor" strokeWidth="1.5" />
            {line && (
              <line
                x1="34"
                y1={140 - (line.a / maxMt) * 130}
                x2="292"
                y2={140 - ((line.a + line.b * maxId) / maxMt) * 130}
                stroke="var(--color-teal)"
                strokeWidth="2.5"
              />
            )}
            {trials.map((t, i) => (
              <circle
                key={i}
                cx={34 + (t.id / maxId) * 258}
                cy={140 - (t.mt / maxMt) * 130}
                r="3.5"
                fill="var(--color-blue)"
              />
            ))}
            <text x="163" y="156" textAnchor="middle" fontSize="9" fill="currentColor">
              index of difficulty
            </text>
            <text x="10" y="76" fontSize="9" fill="currentColor" transform="rotate(-90 10 76)" textAnchor="middle">
              ms
            </text>
          </svg>
        </div>

        <div className="slab-flat min-w-44 bg-white p-3 text-sm">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide">Your fit</div>
          {line ? (
            <>
              <p className="font-mono text-xs">MT = {line.a.toFixed(0)} + {line.b.toFixed(0)}·ID</p>
              <p className="mt-2 text-xs opacity-70">{trials.length} trials</p>
              <p className="mt-3 text-xs leading-relaxed">
                If the points cluster around the line, you have just measured Fitts's Law on
                yourself.
              </p>
            </>
          ) : (
            <p className="text-xs opacity-70">Run at least 3 trials to fit a line.</p>
          )}
          {trials.length > 0 && (
            <button
              onClick={() => setTrials([])}
              className="mt-3 text-xs font-bold uppercase tracking-wide underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
