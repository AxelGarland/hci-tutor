import { useRef, useState } from 'react'
import { backupFilename, exportProgress, overallStats, readBackup } from '../store'

function when(iso) {
  if (!iso) return 'an unknown date'
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? 'an unknown date'
    : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * Taking a schedule out of the browser and putting it back.
 *
 * A restore replaces months of work, so it is a two-step: the file is read and
 * described first, and nothing is written until that description is confirmed.
 * The summary is the point — "312 items, 47 mastered" is checkable against what
 * you expect, where "Restore?" is not.
 */
export default function BackupControls({ progress, onRestore }) {
  const fileInput = useRef(null)
  const [pending, setPending] = useState(null)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(null)
  const stats = overallStats(progress)

  const download = () => {
    const blob = new Blob([JSON.stringify(exportProgress(progress), null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = backupFilename()
    a.click()
    URL.revokeObjectURL(url)
    setSaved(backupFilename())
    setError(null)
  }

  const pick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // so choosing the same file twice still fires
    if (!file) return
    setError(null)
    setSaved(null)
    try {
      setPending(readBackup(await file.text()))
    } catch (err) {
      setPending(null)
      setError(err.message)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="micro muted">Progress</span>
        <button
          onClick={download}
          className="slab-flat px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide"
        >
          Back up
        </button>
        <button
          onClick={() => fileInput.current?.click()}
          className="slab-flat px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide"
        >
          Restore
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          onChange={pick}
          className="hidden"
        />
      </div>

      {saved && (
        <p className="text-[11px] leading-relaxed muted">
          Saved <span className="font-bold">{saved}</span> to your downloads.
        </p>
      )}

      {error && (
        <p className="slab-flat border-l-4 bg-paper p-2 text-[11px] leading-relaxed">{error}</p>
      )}

      {pending && (
        <div className="slab-flat bg-paper p-2.5">
          <p className="text-[11px] font-bold uppercase tracking-widest">Restore this backup?</p>
          <p className="mt-1.5 text-[11px] leading-relaxed">
            Written {when(pending.exportedAt)}: {pending.counts.items} items,{' '}
            {pending.counts.mastered} mastered, {pending.counts.lessons} chapters read.
          </p>
          {pending.counts.dropped > 0 && (
            <p className="mt-1.5 text-[11px] leading-relaxed muted">
              {pending.counts.dropped} entries in the file no longer match anything in this course
              and will be dropped — that happens when the content has been edited since the backup.
            </p>
          )}
          <p className="mt-1.5 text-[11px] leading-relaxed muted">
            This replaces what is on this device now: {stats.started} items started,{' '}
            {stats.mastered} mastered.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => {
                onRestore(pending.progress)
                setPending(null)
                setError(null)
              }}
              className="slab-flat bg-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-paper"
            >
              Replace
            </button>
            <button
              onClick={() => setPending(null)}
              className="slab-flat px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
