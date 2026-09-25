import { examPlan, MIN_DAYS_TO_MASTER, MASTERED_BOX, overallStats } from '../store'

export default function ExamPlanner({ progress, onSetExam }) {
  const plan = examPlan(progress)
  const stats = overallStats(progress)

  return (
    <div className="max-w-2xl space-y-5">
      <header>
        <h2 className="text-4xl font-black tracking-[-0.03em] sm:text-5xl">Exam plan</h2>
        <p className="reading mt-2 text-[15px] muted">
          Back-planned from your date. It reports what the schedule can actually deliver, not a
          number that sounds encouraging.
        </p>
      </header>

      <label className="block">
        <span className="block text-[11px] font-bold uppercase tracking-widest opacity-60">
          Exam date
        </span>
        <input
          type="date"
          value={progress.exam ?? ''}
          onChange={(e) => onSetExam(e.target.value)}
          className="slab-flat mt-1.5 bg-paper px-3 py-2 text-[15px]"
        />
      </label>

      {!plan ? (
        <p className="text-sm opacity-70">Set a date and the daily load appears here.</p>
      ) : plan.passed ? (
        <div className="slab bg-paper p-4">
          <p className="text-[15px] leading-relaxed">
            That date has passed. Clear it or set a new one.
          </p>
          <button
            onClick={() => onSetExam('')}
            className="slab-flat mt-3 bg-paper px-4 py-2 micro"
          >
            Clear
          </button>
        </div>
      ) : (
        <>
          {/* Three numbers, three tall stacked cards on a phone — most of that
              scroll was empty. They fold into label-left/number-right rows at
              narrow widths and return to the three-up grid at sm. */}
          <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
            {[
              { label: 'Days left', value: plan.days },
              { label: 'Reps remaining', value: plan.reps },
              { label: 'Reps per day', value: plan.perDay },
            ].map((s) => (
              <div
                key={s.label}
                className="slab flex items-baseline justify-between gap-3 bg-paper px-4 py-2.5 sm:block sm:p-4"
              >
                <p className="micro muted">{s.label}</p>
                <p className="numeral text-3xl text-cobalt sm:mt-1 sm:text-4xl">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="slab-flat bg-paper p-4">
            <p className="reading">
              At {plan.perDay} repetitions a day that is{' '}
              <span className="font-bold">
                {plan.sessionsPerDay} session{plan.sessionsPerDay > 1 ? 's' : ''}
              </span>{' '}
              a day. You currently have {stats.mastered} of {stats.total} items mastered.
            </p>
          </div>

          {!plan.masteryReachable && (
            <div className="slab bg-accent p-4">
              <p className="text-[11px] font-bold uppercase tracking-widest">
                Full mastery is not reachable in {plan.days} days
              </p>
              <p className="mt-2 text-[15px] leading-relaxed">
                Reaching the final box takes {MASTERED_BOX} correct answers spread across at least{' '}
                {MIN_DAYS_TO_MASTER} days, because the intervals are the point — cramming the same
                item five times today promotes it five times and teaches you almost nothing. With{' '}
                {plan.days} days you can get most material to the middle boxes, which is a real and
                useful state. Prioritise breadth over perfect mastery, and let the wrong-while-certain
                list decide what gets the extra passes.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
