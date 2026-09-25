import { designNotes, lessons } from '../store'

/**
 * Where the design reasoning lives.
 *
 * These notes used to be numbered markers sitting in the working screens, one
 * beside almost every control. Collected here they are worth reading; scattered
 * through the interface they were something to look past on the way to the
 * material. A course package without a `designNotes` export simply has no entry
 * in the sidebar, and this screen is never reached.
 */
export default function Colophon({ onSelect }) {
  const notes = designNotes()
  const byId = lessons()
  const rows = Object.entries(notes)
    .map(([key, note]) => ({ key, ...note, lesson: byId.find((l) => l.id === note.lesson) }))
    .filter((r) => r.lesson)

  return (
    <div className="max-w-[62ch] space-y-5">
      <header>
        <h2 className="text-4xl font-black tracking-[-0.03em] sm:text-5xl">Why it is built this way</h2>
        <p className="reading mt-3 muted">
          This app teaches interface design, so it can justify its own decisions out of its own
          syllabus. Each note names the chapter it comes from, and where the research sits outside
          the book the note says so rather than borrowing authority the chapter does not give.
        </p>
      </header>

      <dl className="space-y-0">
        {rows.map((r) => (
          <div key={r.key} className="border-t border-rule py-6 first:border-t-0">
            <dt className="flex items-baseline gap-3">
              <span className="numeral shrink-0 text-2xl text-cobalt">{r.lesson.number}</span>
              <span className="text-lg font-extrabold tracking-[-0.015em]">{r.title}</span>
            </dt>
            <dd className="mt-2.5 pl-9">
              <p className="reading text-[15px]">{r.note}</p>
              <button
                onClick={() => onSelect(r.lesson.id)}
                className="mt-3 text-left text-[13px] font-bold text-cobalt underline underline-offset-4"
              >
                Chapter {r.lesson.number} · {r.lesson.title}
              </button>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
