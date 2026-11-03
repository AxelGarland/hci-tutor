import { useEffect, useId, useRef, useState } from 'react'
import { activeCourseId, course } from '../store'

/**
 * The top-right disclosure. 43 chapters is too many for a flat list, so the panel
 * keeps the part groupings and scrolls inside itself rather than the page.
 */
export default function ChaptersMenu({ onSelect, align = 'right' }) {
  const [open, setOpen] = useState(false)
  const wrap = useRef(null)
  const trigger = useRef(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      trigger.current?.focus() // focus goes back where it came from
    }
    const onDown = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [open])

  // This menu lists the open course, so it names it explicitly: the callback
  // takes a course id because selecting a chapter may have to switch course,
  // and a one-argument call would read the lesson id as the course.
  const pick = (id) => {
    setOpen(false)
    onSelect(activeCourseId(), id)
  }

  return (
    <div ref={wrap} className="relative">
      <button
        ref={trigger}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="micro px-1 py-3 underline underline-offset-4"
      >
        Chapters
      </button>

      {open && (
        <div
          id={panelId}
          /* text-ink is not decoration: this panel opens over the cobalt hero,
             which sets text-paper on everything inside it. Inheriting that put
             paper text on a paper panel and made all 43 chapter titles
             invisible. A popover sets its own colours and never trusts the
             surface it happens to open over. */
          className="reveal absolute z-30 mt-2 max-h-[70vh] w-[min(92vw,26rem)] overflow-y-auto bg-paper p-1 text-ink shadow-[0_18px_40px_-18px_rgba(10,10,10,0.35)]"
          style={{ [align]: 0, border: '1px solid var(--color-edge)' }}
        >
          {course().modules.map((m) => (
            <div key={m.id} className="border-t border-rule first:border-t-0">
              <p className="micro muted px-3 pb-1.5 pt-3 leading-snug">{m.title}</p>
              <ul>
                {m.lessons.map((l) => (
                  <li key={l.id}>
                    <button
                      onClick={() => pick(l.id)}
                      className="flex w-full items-baseline gap-3 px-3 py-2 text-left hover:bg-black/5"
                    >
                      <span className="w-6 shrink-0 text-[11px] tabular-nums muted">{l.number}</span>
                      <span className="flex-1 text-[13px] font-bold leading-snug">{l.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
