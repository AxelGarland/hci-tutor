import { useEffect, useMemo, useRef, useState } from 'react'
import Reading from './Reading'
import RecallItem from './RecallItem'
import { demos } from '../store'
import { buildSession, DURATIONS, DEFAULT_MINUTES, REVIEW_GATE, nextLesson } from '../session'
import { activeCourseId, leeches, lessons, LEECH_THRESHOLD } from '../store'

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
        <h2 className="text-4xl font-black tracking-[-0.03em] sm:text-5xl">Study session</h2>

      </header>

      {/* Three equal columns rather than a wrapping row: at 320px the third
          button used to drop to its own line and read as a different control. */}
      <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
        {DURATIONS.map((m) => (
          <button
            key={m}
            onClick={() => setMinutes(m)}
            className={`slab-flat px-4 py-2 micro ${
              minutes === m ? 'bg-ink text-paper' : 'bg-paper'
            }`}
          >
            {m} min
          </button>
        ))}
      </div>

      {preview.mode === 'review-only' ? (
        <div className="slab bg-accent p-4">
          <p className="micro">Reviews only this session</p>
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
              className="slab-flat mt-1.5 w-full bg-paper px-3 py-2 text-[15px]"
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
                empty: preview.warmup.length === 0,
              },
              { k: 'study', t: `${fmt(preview.budgets.study)} — read the chapter and run its demo` },
              {
                k: 'test',
                t: `${fmt(preview.budgets.test)} — ${preview.test.filter((x) => x.origin === 'new').length} items from this chapter, ${preview.test.filter((x) => x.origin === 'old').length} from older ones, scored separately`,
              },
              { k: 'summary', t: `${fmt(preview.budgets.summary)} — write a short paragraph in your own words` },
            ].map((row) => (
              <li key={row.k} className="slab-flat flex flex-col gap-1 bg-paper p-3 sm:flex-row sm:gap-3">
                <span className="text-[11px] font-bold uppercase tracking-widest muted sm:w-28 sm:shrink-0">
                  {PHASE_LABEL[row.k]}
                </span>
                <span className="flex-1 text-sm leading-relaxed">
                  {row.empty ? 'skipped — nothing is due for review yet' : row.t}
                </span>
              </li>
            ))}
          </ol>
        </>
      )}

      <button
        onClick={() => onStart(preview)}
        className="micro slab w-full border-cobalt bg-cobalt px-8 py-4 text-paper sm:w-auto"
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
    const pct = ([r, t]) => (t ? `${Math.round((r / t) * 100)}%` : null)
    // Everything this sitting actually served. The previous version built this
    // list only for review-only sessions and then concatenated an empty array
    // either way, so after an ordinary study session it was always empty and the
    // panel below never appeared — a documented feature that never fired.
    const served = [...(plan.warmup ?? []), ...testItems.map((x) => x.item)]
    const missedRepeatedly = leeches(progress, served)

    return (
      <div className="max-w-2xl space-y-5">
        <h2 className="text-4xl font-black tracking-[-0.03em] sm:text-5xl">Session done</h2>

        {/* Two different kinds of number, so they are drawn as two different
            kinds of object. The fluency score is outlined on paper; the one that
            carries information is a solid cobalt field. */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="slab p-5">
            <p className="micro muted">This chapter</p>
            <p className="numeral mt-2 text-5xl sm:text-6xl">
              {pct(score.new) ?? <span className="text-xl font-bold tracking-normal muted">none served</span>}
            </p>
          </div>
          <div className="slab on-cobalt border-cobalt bg-cobalt p-5 text-paper">
            <p className="micro">Older material</p>
            <p className="numeral mt-2 text-5xl sm:text-6xl">
              {pct(score.old) ?? <span className="text-xl font-bold tracking-normal opacity-80">none due yet</span>}
            </p>
          </div>
        </div>

        {/* Emphasis by weight and a heavy left rule rather than a red field —
            nothing in this design signals with hue. */}
        {/* The only place signal red appears in a session, and the heading still
            counts them in words — the rail is reinforcement, not the message. */}
        {score.blind.length > 0 && (
          <div className="border-l-[6px] border-signal py-1 pl-4">
            <p className="micro">Wrong while certain — {score.blind.length}</p>
            <ul className="mt-2.5 space-y-1.5">
              {score.blind.map((i) => (
                <li key={i.id} className="reading text-[15px]">
                  {i.kind === 'card' ? i.front : i.question}
                </li>
              ))}
            </ul>
          </div>
        )}

        {missedRepeatedly.length > 0 && (
          <div className="slab-flat bg-accent p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest">
              Missed {LEECH_THRESHOLD}+ times
            </p>
            <ul className="mt-2 space-y-1">
              {missedRepeatedly.map((i) => (
                <li key={i.id} className="text-sm">
                  {i.kind === 'card' ? i.front : i.question}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs leading-relaxed">
              Repeated misses usually mean the card is badly written, not that you cannot learn it.
              Rewrite it in{' '}
              <span className="font-mono text-[11px]">src/courses/{activeCourseId()}/content/</span>{' '}
              rather than grinding it.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={restart}
            className="micro slab border-cobalt bg-cobalt px-6 py-4 text-paper"
          >
            Another session
          </button>
          <button
            onClick={onExit}
            className="micro slab-flat px-6 py-4"
          >
            Back to the book
          </button>
        </div>
      </div>
    )
  }

  const list = phase === 'warmup' ? plan.warmup : testItems
  const current = list[idx]

  // On a phone a 1,200-word chapter is a dozen screens, so an inline clock is a
  // clock you cannot see — and the soft-stop notice fires where nobody is
  // looking. It pins under the mobile bar instead, still a thin rule, still no
  // pulse. Desktop keeps the inline placement, where the whole phase is in view.
  // A session is the one place the chrome should be unmistakable: an ink bar with
  // the phase, the count and the clock, over a cobalt track. Still no pulse and
  // no colour change as it runs — the material keeps the attention. On a phone it
  // pins under the mobile bar, because a chapter is a dozen screens there.
  const clock = (
    <div className="sticky top-0 z-30 -mx-5 md:static md:mx-0">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-ink px-5 py-3 text-paper md:px-4">
        <span className="micro">
          {PHASE_LABEL[phase]}
          {list.length > 0 && (phase === 'warmup' || phase === 'test') && (
            <span className="ml-2.5 opacity-75">
              {Math.min(idx + 1, list.length)} of {list.length}
            </span>
          )}
        </span>
        <span className="num flex items-center text-[15px] font-black">
          {fmt(Math.max(0, budget - elapsed))}
        </span>
      </div>
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
          className="h-full bg-cobalt transition-[width] duration-1000 ease-linear"
          style={{ width: `${Math.min(100, (elapsed / budget) * 100)}%` }}
        />
      </div>
      {overdue && (
        <p className="reading bg-paper px-5 py-2 text-[13px] md:px-0">
          Time is up for this phase — finish the item you are on and it will move along.
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
          <p className="micro text-cobalt">{plan.lesson.moduleTitle}</p>
          <div className="mt-2.5 flex items-start gap-4">
            <span className="numeral shrink-0 text-5xl text-cobalt">{plan.lesson.number}</span>
            <h2 className="text-balance text-2xl font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-3xl">
              {plan.lesson.title}
            </h2>
          </div>
        </header>

        <nav className="flex flex-wrap gap-2 border-b-2 border-ink pb-3">
          <button
            onClick={() => setTab('read')}
            className={`slab-flat px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] ${
              tab === 'read' ? 'border-cobalt bg-cobalt text-paper' : 'bg-transparent'
            }`}
          >
            Read
          </button>
          {keys.map((k) => (
            <button
              key={k}
              onClick={() => setTab(`demo:${k}`)}
              className={`slab-flat px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] ${
                tab === `demo:${k}` ? 'border-cobalt bg-cobalt text-paper' : 'bg-transparent'
              }`}
            >
              {demos()[k].tab}
            </button>
          ))}
        </nav>

        {tab === 'read' ? <Reading blocks={plan.lesson.reading} /> : <activeDemo.Component />}

        <button
          onClick={advance}
          className={`slab w-full px-6 py-3 micro sm:w-auto ${
            overdue ? 'bg-ink text-paper' : 'bg-paper'
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
        <h2 className="text-3xl font-black tracking-[-0.03em]">In your own words</h2>
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
          className="slab-flat w-full resize-none bg-paper px-3 py-2 text-[15px] leading-relaxed"
          placeholder="In your own words…"
        />
        <div className="flex gap-3">
          <button
            onClick={advance}
            className="micro slab flex-1 border-cobalt bg-cobalt px-6 py-4 text-paper sm:flex-none"
          >
            Finish
          </button>
          <button
            onClick={advance}
            className="slab-flat bg-paper px-4 py-3 micro"
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
          className="slab-flat bg-paper px-5 py-2.5 micro"
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
          </p>
        </>
      }
      onGraded={(correct, confidence) => gradeAndNext(item, origin, correct, confidence)}
    />
  )
}
