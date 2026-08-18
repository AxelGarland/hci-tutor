import { useState } from 'react'

const AI_ACCURACY = 0.75
const OFFSETS = [-90, -70, -60, -40, -30, 30, 40, 60, 70, 90]

const MODES = {
  assist: {
    label: 'Plain assist',
    note: 'the answer appears immediately',
  },
  forcing: {
    label: 'Cognitive forcing',
    note: 'you must commit your own answer first',
  },
}

function newTrial() {
  const a = 12 + Math.floor(Math.random() * 18)
  const b = 12 + Math.floor(Math.random() * 18)
  const truth = a * b
  const correct = Math.random() < AI_ACCURACY
  const offset = OFFSETS[Math.floor(Math.random() * OFFSETS.length)]
  return { a, b, truth, aiRight: correct, ai: correct ? truth : truth + offset }
}

const emptyTally = () => ({
  assist: { rightSeen: 0, rightAccepted: 0, wrongSeen: 0, wrongAccepted: 0 },
  forcing: { rightSeen: 0, rightAccepted: 0, wrongSeen: 0, wrongAccepted: 0 },
})

export default function RelianceGame() {
  const [mode, setMode] = useState('assist')
  const [trial, setTrial] = useState(newTrial)
  const [own, setOwn] = useState('')
  const [committed, setCommitted] = useState(false)
  const [outcome, setOutcome] = useState(null)
  const [tally, setTally] = useState(emptyTally)

  const revealed = mode === 'assist' || committed

  const decide = (accepted) => {
    const key = trial.aiRight ? 'right' : 'wrong'
    setTally((t) => ({
      ...t,
      [mode]: {
        ...t[mode],
        [`${key}Seen`]: t[mode][`${key}Seen`] + 1,
        [`${key}Accepted`]: t[mode][`${key}Accepted`] + (accepted ? 1 : 0),
      },
    }))
    setOutcome({ accepted, aiRight: trial.aiRight })
  }

  const next = () => {
    setTrial(newTrial())
    setOwn('')
    setCommitted(false)
    setOutcome(null)
  }

  const switchMode = (m) => {
    setMode(m)
    next()
  }

  const stats = (m) => {
    const t = tally[m]
    const accRight = t.rightSeen ? t.rightAccepted / t.rightSeen : null
    const accWrong = t.wrongSeen ? t.wrongAccepted / t.wrongSeen : null
    const appropriate = accRight !== null && accWrong !== null ? accRight - accWrong : null
    return { ...t, accRight, accWrong, appropriate }
  }

  const pct = (v) => (v === null ? '—' : `${Math.round(v * 100)}%`)

  return (
    <div className="space-y-4">
      <div className="slab-flat flex flex-wrap gap-2 bg-white p-3">
        {Object.entries(MODES).map(([key, m]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`slab-flat px-3 py-2 text-left text-xs font-bold ${
              mode === key ? 'bg-ink text-paper' : 'bg-paper'
            }`}
          >
            <span className="block uppercase tracking-wide">{m.label}</span>
            <span className="mt-0.5 block font-normal normal-case opacity-70">{m.note}</span>
          </button>
        ))}
      </div>

      <div className="slab flex flex-col items-center gap-4 bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-widest opacity-60">
          The assistant is right about {Math.round(AI_ACCURACY * 100)}% of the time
        </p>
        <p className="font-mono text-3xl tabular-nums">
          {trial.a} × {trial.b}
        </p>

        {mode === 'forcing' && !committed && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (own.trim()) setCommitted(true)
            }}
            className="flex w-full max-w-xs flex-col items-center gap-2"
          >
            <label className="text-xs font-bold uppercase tracking-wide">Your answer first</label>
            <input
              autoFocus
              value={own}
              onChange={(e) => setOwn(e.target.value)}
              inputMode="numeric"
              className="slab-flat w-full bg-paper px-3 py-2 text-center font-mono text-xl tabular-nums"
            />
            <button className="slab-flat bg-blue px-6 py-2 text-xs font-bold uppercase tracking-wide text-white">
              Commit
            </button>
          </form>
        )}

        {revealed && (
          <>
            <div className="slab-flat bg-paper px-6 py-4 text-center">
              <p className="text-[11px] font-bold uppercase tracking-widest opacity-60">
                Assistant says
              </p>
              <p className="mt-1 font-mono text-2xl tabular-nums">{trial.ai}</p>
              {mode === 'forcing' && (
                <p className="mt-1 text-xs opacity-70">you said {own}</p>
              )}
            </div>

            {!outcome ? (
              <div className="flex gap-3">
                <button
                  onClick={() => decide(false)}
                  className="slab-flat bg-paper px-5 py-2.5 text-xs font-bold uppercase tracking-wide"
                >
                  Reject
                </button>
                <button
                  onClick={() => decide(true)}
                  className="slab-flat bg-teal px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white"
                >
                  Accept
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm">
                  Truth is <span className="font-bold tabular-nums">{trial.truth}</span> — the
                  assistant was{' '}
                  <span className="font-bold">{outcome.aiRight ? 'right' : 'wrong'}</span>, you{' '}
                  <span className="font-bold">{outcome.accepted ? 'accepted' : 'rejected'}</span>.
                </p>
                <button
                  onClick={next}
                  className="slab-flat bg-yellow px-6 py-2 text-xs font-bold uppercase tracking-wide"
                >
                  Next
                </button>
              </>
            )}
          </>
        )}
      </div>

      <div className="slab-flat overflow-x-auto bg-white p-3">
        <div className="mb-3 text-xs font-bold uppercase tracking-wide">Your reliance profile</div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-ink">
              <th className="py-1.5 pr-3 text-xs font-bold uppercase tracking-wide">Mode</th>
              <th className="py-1.5 pr-3 text-xs font-bold uppercase tracking-wide">Accept when right</th>
              <th className="py-1.5 pr-3 text-xs font-bold uppercase tracking-wide">Accept when wrong</th>
              <th className="py-1.5 text-xs font-bold uppercase tracking-wide">Appropriate reliance</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(MODES).map(([key, m]) => {
              const s = stats(key)
              return (
                <tr key={key} className="border-b border-black/10">
                  <td className="py-2 pr-3 font-bold">{m.label}</td>
                  <td className="py-2 pr-3 tabular-nums">
                    {pct(s.accRight)} <span className="muted">({s.rightSeen})</span>
                  </td>
                  <td className="py-2 pr-3 tabular-nums">
                    {pct(s.accWrong)} <span className="muted">({s.wrongSeen})</span>
                  </td>
                  <td className="py-2 font-bold tabular-nums">{pct(s.appropriate)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="mt-3 text-xs leading-relaxed opacity-80">
          Appropriate reliance is accept-when-right minus accept-when-wrong. Raw acceptance rate
          cannot tell those apart, which is why the chapter rejects it as a KPI. Run fifteen trials
          in each mode: committing to your own answer first usually costs you time and lowers
          accept-when-wrong — Buçinca's cognitive forcing effect, and the reason users dislike it.
        </p>
        {(tally.assist.rightSeen > 0 || tally.forcing.rightSeen > 0) && (
          <button
            onClick={() => setTally(emptyTally())}
            className="mt-2 text-xs font-bold uppercase tracking-wide underline"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
