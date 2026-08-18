import { examPlan, MIN_DAYS_TO_MASTER, MASTERED_BOX, overallStats } from '../store'

export default function ExamPlanner({ progress, onSetExam }) {
  const plan = examPlan(progress)
  const stats = overallStats(progress)

  return (
    <div className="max-w-2xl space-y-5">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Exam plan</h2>
        <p className="mt-1 text-sm opacity-70">
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
          className="slab-flat mt-1.5 bg-white px-3 py-2 text-[15px]"
        />
      </label>

      {!plan ? (
        <p className="text-sm opacity-70">Set a date and the daily load appears here.</p>
      ) : plan.passed ? (
        <div className="slab bg-white p-4">
          <p className="text-[15px] leading-relaxed">
            That date has passed. Clear it or set a new one.
          </p>
          <button
            onClick={() => onSetExam('')}
            className="slab-flat mt-3 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide"
          >
            Clear
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Days left', value: plan.days },
              { label: 'Reps remaining', value: plan.reps },
              { label: 'Reps per day', value: plan.perDay },
            ].map((s) => (
              <div key={s.label} className="slab bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-widest opacity-60">
                  {s.label}
                </p>
                <p className="mt-1 text-3xl font-bold tabular-nums">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="slab-flat bg-white p-4">
            <p className="text-[15px] leading-relaxed">
              At {plan.perDay} repetitions a day that is{' '}
              <span className="font-bold">
                {plan.sessionsPerDay} session{plan.sessionsPerDay > 1 ? 's' : ''}
              </span>{' '}
              a day. You currently have {stats.mastered} of {stats.total} items mastered.
            </p>
          </div>

          {!plan.masteryReachable && (
            <div className="slab bg-yellow p-4">
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
