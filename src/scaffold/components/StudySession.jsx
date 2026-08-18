import { useEffect, useMemo, useRef, useState } from 'react'
import Reading from './Reading'
import RecallItem from './RecallItem'
import Cite from './Cite'
import { demos } from '../store'
import { buildSession, DURATIONS, DEFAULT_MINUTES, REVIEW_GATE, nextLesson } from '../session'
import { lessons, LEECH_THRESHOLD } from '../store'

const PHASE_LABEL = {
  warmup: 'Warm-up',
  study: 'Study',
  test: 'Closing test',
  summary: 'Summary',
}

function fmt(ms) {
  const s = Math.max(0, Math.round(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

// ---- Setup ----------------------------------------------------------------

function Setup({ progress, onStart }) {
  const suggested = nextLesson(progress)
  const [lessonId, setLessonId] = useState(suggested.id)
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES)
  const preview = useMemo(
    () => buildSession(progress, lessonId, minutes),
    [progress, lessonId, minutes],
  )

  return (
    <div className="max-w-2xl space-y-5">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Study session</h2>
        <p className="mt-1 text-sm opacity-70">
          Here is what the next {minutes} minutes will actually consist of.
          <Cite id="expectations" />
        </p>
      </header>

      <p className="slab-flat p-3 text-[13px] leading-relaxed md:hidden">
        <span className="micro block">Better on a larger screen</span>
        <span className="mt-1 block muted">
          A session is mostly typing — you answer from memory, then write a paragraph. Reviews and
          reading are built for this screen; a full sitting wants a keyboard.
          <Cite id="mobileSurface" />
        </span>
      </p>

      <div className="flex flex-wrap gap-2">
        {DURATIONS.map((m) => (
          <button
            key={m}
            onClick={() => setMinutes(m)}
            className={`slab-flat px-4 py-2 text-xs font-bold uppercase tracking-wide ${
              minutes === m ? 'bg-ink text-paper' : 'bg-white'
            }`}
          >
            {m} min
          </button>
        ))}
      </div>

      {preview.mode === 'review-only' ? (
        <div className="slab bg-yellow p-4">
          <p className="text-xs font-bold uppercase tracking-widest">
            Reviews only this session
            <Cite id="reviewGate" />
          </p>
          <p className="mt-2 text-[15px] leading-relaxed">
            You have more than {REVIEW_GATE} items overdue, so this session serves{' '}
            {preview.reviews.length} of them and introduces nothing new. Clearing the backlog is
            worth more than another chapter you will not retain.
          </p>
        </div>
      ) : (
        <>
          <label className="block">
            <span className="block text-[11px] font-bold uppercase tracking-widest opacity-60">
              Chapter to study
            </span>
            <select
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              className="slab-flat mt-1.5 w-full bg-white px-3 py-2 text-[15px]"
            >
              {lessons().map((l) => (
                <option key={l.id} value={l.id}>
                  {l.number}. {l.title}
                  {progress.lessons[l.id] ? ' — read' : ''}
                </option>
              ))}
            </select>
          </label>

          <ol className="space-y-2">
            {[
              {
                k: 'warmup',
                t: `${fmt(preview.budgets.warmup)} — recall ${preview.warmup.length} items from earlier chapters, before you read anything`,
                cite: 'warmup',
                empty: preview.warmup.length === 0,
              },
              { k: 'study', t: `${fmt(preview.budgets.study)} — read the chapter and run its demo` },
              {
                k: 'test',
                t: `${fmt(preview.budgets.test)} — ${preview.test.filter((x) => x.origin === 'new').length} items from this chapter, ${preview.test.filter((x) => x.origin === 'old').length} from older ones, scored separately`,
                cite: 'splitScore',
              },
              { k: 'summary', t: `${fmt(preview.budgets.summary)} — write a short paragraph in your own words` },
            ].map((row) => (
              <li key={row.k} className="slab-flat flex gap-3 bg-white p-3">
                <span className="text-[11px] font-bold uppercase tracking-widest muted">
                  {PHASE_LABEL[row.k]}
                </span>
                <span className="flex-1 text-sm leading-relaxed">
                  {row.empty ? 'skipped — nothing is due for review yet' : row.t}
                  {row.cite && <Cite id={row.cite} />}
                </span>
              </li>
            ))}
          </ol>
        </>
      )}

      <button
        onClick={() => onStart(preview)}
        className="slab bg-ink px-6 py-3 text-sm font-bold uppercase tracking-wide text-paper"
      >
        Start
      </button>
    </div>
  )
}

// ---- Running session ------------------------------------------------------

export default function StudySession({ progress, onGrade, onFinish, onExit }) {
  const [plan, setPlan] = useState(null)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [idx, setIdx] = useState(0)
  const [tab, setTab] = useState('read')
  const [summary, setSummary] = useState('')
  const [score, setScore] = useState({ new: [0, 0], old: [0, 0], blind: [] })
  const [now, setNow] = useState(Date.now())
  const phaseStart = useRef(Date.now())

  const phases = useMemo(() => {
    if (!plan) return []
    if (plan.mode === 'review-only') return ['test']
    return [...(plan.warmup.length ? ['warmup'] : []), 'study', 'test', 'summary']
  }, [plan])

  const phase = phases[phaseIdx]
  const done = plan && phaseIdx >= phases.length

  useEffect(() => {
    if (!plan || done) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [plan, done])

  useEffect(() => {
    phaseStart.current = Date.now()
    setNow(Date.now())
    setIdx(0)
    setTab('read')
  }, [phaseIdx])

  // Commit the moment the session completes, not when the user clicks away from the
  // results — otherwise closing the tab here silently discards the summary.
  const saved = useRef(false)
  useEffect(() => {
    if (!done || saved.current) return
    saved.current = true
    onFinish({
      at: Date.now(),
      minutes: plan.minutes,
      lesson: plan.lesson?.id ?? null,
      summary,
      score,
    })
  }, [done, plan, summary, score, onFinish])

  const restart = () => {
    saved.current = false
    setPlan(null)
    setSummary('')
    setScore({ new: [0, 0], old: [0, 0], blind: [] })
    setPhaseIdx(0)
  }

  const budget = plan && phase ? plan.budgets[phase] : 0
  const elapsed = now - phaseStart.current
  const overdue = budget > 0 && elapsed > budget

  const testItems =
    plan?.mode === 'review-only'
      ? plan.reviews.map((item) => ({ item, origin: 'old' }))
      : (plan?.test ?? [])

  const advance = () => setPhaseIdx((p) => p + 1)

  const gradeAndNext = (item, origin, correct, confidence) => {
    onGrade(item.id, correct, confidence)
    if (origin) {
      setScore((s) => ({
        ...s,
        [origin]: [s[origin][0] + (correct ? 1 : 0), s[origin][1] + 1],
        blind: !correct && confidence === 'sure' ? [...s.blind, item] : s.blind,
      }))
    }
    const list = phase === 'warmup' ? plan.warmup : testItems
    const last = idx + 1 >= list.length
    // Soft stop: the clock never cuts an item short, it waits for this boundary.
    if (last || overdue) advance()
    else setIdx((i) => i + 1)
  }

  if (!plan) {
    return (
      <Setup
        progress={progress}
        onStart={(p) => {
          setPlan(p)
          setPhaseIdx(0)
          phaseStart.current = Date.now()
        }}
      />
    )
  }

  if (done) {
    const pct = ([r, t]) => (t ? `${Math.round((r / t) * 100)}%` : '—')
    const leeches = [...(plan.mode === 'review-only' ? testItems.map((x) => x.item) : [])]
      .concat(plan.lesson ? [] : [])
      .filter((i) => (progress.items[i.id]?.wrong ?? 0) >= LEECH_THRESHOLD)

    return (
      <div className="max-w-2xl space-y-5">
        <h2 className="text-3xl font-bold tracking-tight">Session done</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="slab bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-60">
              This chapter
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums">{pct(score.new)}</p>
            <p className="mt-1 text-xs leading-relaxed opacity-70">
              Taken minutes after reading, so this mostly measures fluency.
            </p>
          </div>
          <div className="slab bg-ink p-4 text-paper">
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-80">
              Older material
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums">{pct(score.old)}</p>
            <p className="mt-1 text-xs leading-relaxed opacity-90">
              This is the number that means something.
              <Cite id="splitScore" />
            </p>
          </div>
        </div>

        {/* Emphasis by weight and a heavy left rule rather than a red field —
            nothing in this design signals with hue. */}
        {score.blind.length > 0 && (
          <div className="slab-flat border-l-8 bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest">
              Wrong while certain — {score.blind.length}
            </p>
            <ul className="mt-2 space-y-1">
              {score.blind.map((i) => (
                <li key={i.id} className="text-sm leading-relaxed">
                  {i.kind === 'card' ? i.front : i.question}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs leading-relaxed muted">
              These are your actual gaps. An item you missed while guessing is harmless; one you
              missed while sure is a belief you are carrying around.
            </p>
          </div>
        )}

        {leeches.length > 0 && (
          <div className="slab-flat bg-yellow p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest">
              Missed {LEECH_THRESHOLD}+ times
            </p>
            <ul className="mt-2 space-y-1">
              {leeches.map((i) => (
                <li key={i.id} className="text-sm">
                  {i.kind === 'card' ? i.front : i.question}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs leading-relaxed">
              Repeated misses usually mean the card is badly written, not that you cannot learn it.
              Rewrite it in <span className="font-mono text-[11px]">src/content/</span> rather than
              grinding it.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={restart}
            className="slab bg-ink px-6 py-3 text-xs font-bold uppercase tracking-wide text-paper"
          >
            Another session
          </button>
          <button
            onClick={onExit}
            className="slab-flat bg-white px-6 py-3 text-xs font-bold uppercase tracking-wide"
          >
            Back to the book
          </button>
        </div>
        <p className="text-[11px] muted">Saved. Closing the tab here loses nothing.</p>
      </div>
    )
  }

  const list = phase === 'warmup' ? plan.warmup : testItems
  const current = list[idx]

  const clock = (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between text-[11px] font-bold uppercase tracking-widest">
        <span>
          {PHASE_LABEL[phase]}
          {list.length > 0 && (phase === 'warmup' || phase === 'test') && (
            <span className="ml-2 muted">
              {Math.min(idx + 1, list.length)} of {list.length}
            </span>
          )}
        </span>
        <span className="tabular-nums opacity-60">
          {fmt(Math.max(0, budget - elapsed))}
          <Cite id="timer" />
        </span>
      </div>
      {/* A thin rule, no colour change and no pulse — the material keeps the attention. */}
      <div
        role="progressbar"
        aria-label={`${PHASE_LABEL[phase]} time`}
        aria-valuemin={0}
        aria-valuemax={Math.round(budget / 1000)}
        aria-valuenow={Math.min(Math.round(elapsed / 1000), Math.round(budget / 1000))}
        aria-valuetext={`${fmt(Math.max(0, budget - elapsed))} remaining`}
        className="h-1.5 w-full bg-rule"
      >
        <div
          className="h-full bg-ink transition-[width] duration-1000 ease-linear"
          style={{ width: `${Math.min(100, (elapsed / budget) * 100)}%` }}
        />
      </div>
      {overdue && (
        <p className="text-[11px] leading-relaxed opacity-70">
          Time is up for this phase — finish the item you are on and it will move along.
          <Cite id="softStop" />
        </p>
      )}
    </div>
  )

  if (phase === 'study') {
    const keys = (plan.lesson.demos ?? []).filter((k) => demos()[k])
    const activeDemo = tab.startsWith('demo:') ? demos()[tab.slice(5)] : null
    return (
      <div className="max-w-3xl space-y-5">
        {clock}
        <header>
          <p className="text-xs font-bold uppercase tracking-widest opacity-60">
            {plan.lesson.moduleTitle}
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">
            <span className="muted">{plan.lesson.number}.</span> {plan.lesson.title}
          </h2>
        </header>

        <nav className="flex flex-wrap gap-2 border-b-2 border-ink pb-3">
          <button
            onClick={() => setTab('read')}
            className={`slab-flat px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide ${
              tab === 'read' ? 'bg-ink text-paper' : 'bg-white'
            }`}
          >
            Read
          </button>
          {keys.map((k) => (
            <button
              key={k}
              onClick={() => setTab(`demo:${k}`)}
              className={`slab-flat px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide ${
                tab === `demo:${k}` ? 'bg-ink text-paper' : 'bg-white'
              }`}
            >
              {demos()[k].tab}
            </button>
          ))}
        </nav>

        {tab === 'read' ? <Reading blocks={plan.lesson.reading} /> : <activeDemo.Component />}

        <button
          onClick={advance}
          className={`slab px-6 py-3 text-xs font-bold uppercase tracking-wide ${
            overdue ? 'bg-ink text-paper' : 'bg-white'
          }`}
        >
          Done reading — test me
        </button>
      </div>
    )
  }

  if (phase === 'summary') {
    return (
      <div className="max-w-2xl space-y-5">
        {clock}
        <h2 className="text-2xl font-bold tracking-tight">In your own words</h2>
        <p className="text-[15px] leading-relaxed">
          Without looking back: what was {plan.lesson.number}. {plan.lesson.title} actually about?
          Write a short paragraph — the claim that mattered, and one thing you would tell someone
          who has not read it. This is the last piece of retrieval in the session, and it is the
          part you will reread later.
        </p>
        <textarea
          autoFocus
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={7}
          className="slab-flat w-full resize-none bg-white px-3 py-2 text-[15px] leading-relaxed"
          placeholder="In your own words…"
        />
        <div className="flex gap-3">
          <button
            onClick={advance}
            className="slab bg-ink px-6 py-3 text-xs font-bold uppercase tracking-wide text-paper"
          >
            Finish
          </button>
          <button
            onClick={advance}
            className="slab-flat bg-white px-4 py-3 text-xs font-bold uppercase tracking-wide"
          >
            Skip
          </button>
        </div>
      </div>
    )
  }

  if (!current) {
    return (
      <div className="max-w-2xl space-y-4">
        {clock}
        <p className="text-sm opacity-70">Nothing queued for this phase.</p>
        <button
          onClick={advance}
          className="slab-flat bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide"
        >
          Continue
        </button>
      </div>
    )
  }

  const item = phase === 'warmup' ? current : current.item
  const origin = phase === 'warmup' ? null : current.origin

  return (
    <RecallItem
      key={item.id}
      item={item}
      footer={
        <>
          {clock}
          <p className="mt-3 text-[11px] font-bold uppercase tracking-widest muted">
            {phase === 'warmup'
              ? 'Before you read anything'
              : origin === 'old'
                ? 'From an earlier chapter'
                : 'From what you just read'}
            <Cite id={phase === 'warmup' ? 'warmup' : 'recall'} />
          </p>
        </>
      }
      onGraded={(correct, confidence) => gradeAndNext(item, origin, correct, confidence)}
    />
  )
}
