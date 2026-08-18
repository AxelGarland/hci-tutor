import { useEffect, useRef } from 'react'
import { course } from '../store'

/**
 * Narrow-screen navigation. The sidebar used to stack above the content, so
 * reaching a chapter meant scrolling past all 43 of them — the index became a
 * wall in front of the material rather than a way into it. Here the index lives
 * in a sheet and the bar keeps only what you need to see: where you are, and the
 * way back out.
 */
export default function MobileBar({ title, open, onToggle, onHome }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onToggle(false)
    document.addEventListener('keydown', onKey)
    // The sheet covers the page; the page behind it should not scroll with it.
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onToggle])

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-rule bg-paper px-4 py-2 md:hidden">
        <button onClick={onHome} className="micro shrink-0 px-1 coarse:min-w-11 underline underline-offset-4">
          Scaffold
        </button>
        <span className="micro muted min-w-0 flex-1 truncate" title={title}>
          {title ?? course().title}
        </span>
        <button
          onClick={() => onToggle(!open)}
          aria-expanded={open}
          aria-controls="scaffold-nav"
          className="micro shrink-0 px-1 coarse:min-w-11 underline underline-offset-4"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <button
          aria-label="Close navigation"
          onClick={() => onToggle(false)}
          className="fixed inset-0 z-40 bg-ink/30 md:hidden"
        />
      )}
    </>
  )
}

export { }
