import { useContext, useEffect, useRef, useState } from 'react'
import { designNotes } from '../store'
import { lessons } from '../store'
import { DesignContext } from '../DesignContext'

/**
 * A marker on an interface element that opens the chapter justifying it.
 * The app is a worked example of its own syllabus, so it should be able to say why.
 */
export default function Cite({ id }) {
  const note = designNotes()[id]
  const { onOpenChapter } = useContext(DesignContext)
  const [open, setOpen] = useState(false)
  const wrap = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onClick = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  if (!note) return null
  const lesson = lessons().find((l) => l.id === note.lesson)
  if (!lesson) return null

  return (
    <span ref={wrap} className="relative inline-block align-super">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Why this is designed this way — chapter ${lesson.number}, ${lesson.title}`}
        className={`chip tap ml-1 inline-block min-w-[18px] px-1 py-0.5 text-[10px] font-bold leading-none tracking-wide ${
          open ? 'bg-ink text-paper' : 'bg-rule text-ink hover:bg-blue hover:text-white'
        }`}
      >
        {lesson.number}
      </button>

      {open && (
        <span className="slab absolute left-0 top-7 z-20 block w-72 bg-paper p-3 text-left align-baseline sm:w-80">
          <span className="block text-[10px] font-bold uppercase tracking-widest muted">
            Chapter {lesson.number} · {lesson.title}
          </span>
          <span className="mt-2 block text-[13px] font-normal normal-case leading-relaxed">
            {note.note}
          </span>
          <span className="mt-3 flex gap-2">
            <button
              onClick={() => { setOpen(false); onOpenChapter(lesson.id) }}
              className="slab-flat bg-blue px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white"
            >
              Open chapter
            </button>
            <button
              onClick={() => setOpen(false)}
              className="slab-flat bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide"
            >
              Close
            </button>
          </span>
        </span>
      )}
    </span>
  )
}
