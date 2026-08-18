import { useEffect, useId, useRef, useState } from 'react'
import { course } from '../store'

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

  const pick = (id) => {
    setOpen(false)
    onSelect(id)
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
          className="reveal absolute z-30 mt-2 max-h-[70vh] w-[min(92vw,26rem)] overflow-y-auto p-1 shadow-[0_18px_40px_-18px_rgba(10,10,10,0.35)]"
          style={{ [align]: 0, background: "var(--color-home)", border: '1px solid var(--color-edge)' }}
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
