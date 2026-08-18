import { useEffect, useRef, useState } from 'react'

const SHOW_MS = 2000

const randomDigits = (n) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('')

const chunk = (s) => s.match(/.{1,3}/g).join(' ')

export default function MemorySpan() {
  const [chunked, setChunked] = useState(false)
  const [len, setLen] = useState(4)
  const [phase, setPhase] = useState('idle') // idle | show | recall | result
  const [target, setTarget] = useState('')
  const [entry, setEntry] = useState('')
  const [best, setBest] = useState({ plain: 0, chunked: 0 })
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const start = () => {
    const t = randomDigits(len)
    setTarget(t)
    setEntry('')
    setPhase('show')
    timer.current = setTimeout(() => setPhase('recall'), SHOW_MS)
  }

  const submit = (e) => {
    e.preventDefault()
    const correct = entry.replace(/\s/g, '') === target
    const key = chunked ? 'chunked' : 'plain'
    if (correct) setBest((b) => ({ ...b, [key]: Math.max(b[key], len) }))
    setPhase('result')
    if (correct) setLen((n) => Math.min(n + 1, 14))
    else setLen((n) => Math.max(4, n - 1))
  }

  return (
    <div className="space-y-4">
      <div className="slab-flat flex flex-wrap items-center gap-3 bg-white p-3">
        <button
          onClick={() => { setPhase('idle'); setChunked((c) => !c); setLen(4) }}
          className={`slab-flat px-3 py-1.5 text-xs font-bold ${
            chunked ? 'bg-teal text-white' : 'bg-paper'
          }`}
        >
          {chunked ? 'Chunked (groups of 3)' : 'Unchunked'}
        </button>
        <span className="text-xs opacity-70">
          Current length: <span className="font-bold tabular-nums">{len}</span>
        </span>
      </div>

      <div className="slab flex min-h-40 flex-col items-center justify-center gap-4 bg-white p-6">
        {phase === 'idle' && (
          <button
            onClick={start}
            className="slab-flat bg-yellow px-6 py-3 text-xs font-bold uppercase tracking-wide"
          >
            Show the sequence
          </button>
        )}

        {phase === 'show' && (
          <p className="font-mono text-3xl tracking-[0.3em] tabular-nums">
            {chunked ? chunk(target) : target}
          </p>
        )}

        {phase === 'recall' && (
          <form onSubmit={submit} className="flex w-full max-w-sm flex-col items-center gap-3">
            <p className="text-xs font-bold uppercase tracking-wide">Type it back</p>
            <input
              autoFocus
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              inputMode="numeric"
              className="slab-flat w-full bg-paper px-3 py-2 text-center font-mono text-xl tracking-widest"
            />
            <button className="slab-flat bg-blue px-6 py-2 text-xs font-bold uppercase tracking-wide text-white">
              Check
            </button>
          </form>
        )}

        {phase === 'result' && (
          <>
            <p className="font-mono text-2xl tracking-[0.2em] tabular-nums">
              {chunked ? chunk(target) : target}
            </p>
            <p className="text-sm">
              You typed <span className="font-mono">{entry || '—'}</span> —{' '}
              <span className="font-bold">
                {entry.replace(/\s/g, '') === target ? 'correct' : 'wrong'}
              </span>
            </p>
            <button
              onClick={start}
              className="slab-flat bg-yellow px-6 py-2 text-xs font-bold uppercase tracking-wide"
            >
              Next
            </button>
          </>
        )}
      </div>

      <div className="slab-flat bg-white p-3 text-sm">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide">Longest correct</div>
        <p className="tabular-nums">
          Unchunked <span className="font-bold">{best.plain || '—'}</span> · Chunked{' '}
          <span className="font-bold">{best.chunked || '—'}</span>
        </p>
        <p className="mt-3 text-xs leading-relaxed opacity-80">
          Raw capacity is 3–4 chunks, not 3–4 digits. Grouping the same digits into threes usually
          lifts your span by several digits without any change in what you are holding — the chunk
          is the unit, and you control how big a chunk is.
        </p>
      </div>
    </div>
  )
}
