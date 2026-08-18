import { useState } from 'react'

const ENCODINGS = [
  { key: 'position', label: 'Position / length', note: 'bars on a common baseline' },
  { key: 'angle', label: 'Angle', note: 'pie slices' },
  { key: 'area', label: 'Area', note: 'circles' },
]

function newTrial() {
  const enc = ENCODINGS[Math.floor(Math.random() * ENCODINGS.length)].key
  // Keep the ratio away from the extremes, where every encoding is easy.
  const ratio = 0.25 + Math.random() * 0.6
  return { enc, ratio }
}

function Mark({ enc, ratio }) {
  if (enc === 'position') {
    return (
      <div className="flex h-40 items-end gap-10">
        <div className="w-14 bg-blue" style={{ height: '100%' }} />
        <div className="w-14 bg-red" style={{ height: `${ratio * 100}%` }} />
      </div>
    )
  }
  if (enc === 'area') {
    const big = 120
    const small = big * Math.sqrt(ratio)
    return (
      <div className="flex h-40 items-center gap-10">
        <div className="rounded-full bg-blue" style={{ width: big, height: big }} />
        <div className="rounded-full bg-red" style={{ width: small, height: small }} />
      </div>
    )
  }
  // Angle: two pie slices drawn from the same centre, sized by the ratio.
  const arc = (frac, color) => {
    const a = frac * 2 * Math.PI - Math.PI / 2
    const large = frac > 0.5 ? 1 : 0
    return (
      <path
        d={`M 60 60 L 60 0 A 60 60 0 ${large} 1 ${60 + 60 * Math.cos(a)} ${60 + 60 * Math.sin(a)} Z`}
        fill={color}
      />
    )
  }
  return (
    <div className="flex h-40 items-center gap-10">
      <svg viewBox="0 0 120 120" width="120" height="120">
        <circle cx="60" cy="60" r="60" fill="#e8e6e0" />
        {arc(0.4, 'var(--color-blue)')}
      </svg>
      <svg viewBox="0 0 120 120" width="120" height="120">
        <circle cx="60" cy="60" r="60" fill="#e8e6e0" />
        {arc(0.4 * ratio, 'var(--color-red)')}
      </svg>
    </div>
  )
}

export default function EncodingAccuracy() {
  const [trial, setTrial] = useState(newTrial)
  const [guess, setGuess] = useState(50)
  const [answered, setAnswered] = useState(false)
  const [errors, setErrors] = useState([])

  const submit = () => {
    setErrors((e) => [...e, { enc: trial.enc, err: Math.abs(guess - trial.ratio * 100) }])
    setAnswered(true)
  }

  const next = () => {
    setTrial(newTrial())
    setGuess(50)
    setAnswered(false)
  }

  const meanErr = (key) => {
    const hits = errors.filter((e) => e.enc === key)
    return hits.length ? hits.reduce((s, e) => s + e.err, 0) / hits.length : null
  }
  const worst = Math.max(6, ...ENCODINGS.map((e) => meanErr(e.key) ?? 0))

  return (
    <div className="space-y-4">
      <div className="slab-flat flex flex-col items-center gap-4 bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-wide">
          The red mark is what percentage of the blue one?
        </p>
        <Mark enc={trial.enc} ratio={trial.ratio} />

        <div className="flex w-full max-w-sm items-center gap-3">
          <input
            type="range"
            min="5"
            max="100"
            value={guess}
            disabled={answered}
            onChange={(e) => setGuess(Number(e.target.value))}
            className="flex-1 accent-teal"
          />
          <span className="w-14 text-right font-mono text-lg tabular-nums">{guess}%</span>
        </div>

        {!answered ? (
          <button
            onClick={submit}
            className="slab-flat bg-blue px-6 py-2 text-xs font-bold uppercase tracking-wide text-white"
          >
            Lock it in
          </button>
        ) : (
          <>
            <p className="text-sm">
              Actual <span className="font-bold tabular-nums">{(trial.ratio * 100).toFixed(0)}%</span>
              {' · '}off by{' '}
              <span className="font-bold tabular-nums">
                {Math.abs(guess - trial.ratio * 100).toFixed(0)}
              </span>
            </p>
            <button
              onClick={next}
              className="slab-flat bg-yellow px-6 py-2 text-xs font-bold uppercase tracking-wide"
            >
              Next
            </button>
          </>
        )}
      </div>

      <div className="slab-flat bg-white p-3">
        <div className="mb-3 text-xs font-bold uppercase tracking-wide">
          Mean absolute error by encoding
        </div>
        <div className="space-y-2">
          {ENCODINGS.map((e) => {
            const m = meanErr(e.key)
            const n = errors.filter((x) => x.enc === e.key).length
            return (
              <div key={e.key} className="flex items-center gap-3">
                <span className="w-36 shrink-0 text-xs">
                  <span className="block font-bold">{e.label}</span>
                  <span className="block opacity-60">{e.note}</span>
                </span>
                <span className="h-4 flex-1 bg-black/5">
                  <span
                    className="block h-full bg-red"
                    style={{ width: m ? `${(m / worst) * 100}%` : 0 }}
                  />
                </span>
                <span className="w-20 text-right text-xs tabular-nums">
                  {m ? `${m.toFixed(1)} pts` : '—'} <span className="muted">({n})</span>
                </span>
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-xs leading-relaxed opacity-80">
          Cleveland & McGill's ranking predicts the order you should see: position and length most
          accurate, angle worse, area worst. This is the entire argument against pie charts, and you
          can reproduce it on yourself in about twenty trials.
        </p>
        {errors.length > 0 && (
          <button
            onClick={() => setErrors([])}
            className="mt-2 text-xs font-bold uppercase tracking-wide underline"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
