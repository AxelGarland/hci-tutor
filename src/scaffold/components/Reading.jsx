import { figures } from '../store'

const CLAIM = {
  established: { label: 'Established', cls: 'bg-ink text-paper' },
  consensus: { label: 'Current consensus', cls: 'bg-blue text-white' },
  emerging: { label: 'Emerging', cls: 'bg-yellow text-ink' },
  contested: { label: 'Contested', cls: 'bg-red text-white' },
}

export default function Reading({ blocks = [] }) {
  // Measure, not container width: max-w-2xl ran to ~90 characters at this size,
  // well past the 45–75 the typography chapter asks for (Ch. 16).
  return (
    <div className="max-w-[62ch] space-y-4">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'plate': {
            // Encyclopedia convention: the plate, a rule, then a numbered caption
            // in small type. The figure carries its own description for screen
            // readers; the caption is what a sighted reader reads.
            const Fig = figures()[b.figure]
            if (!Fig) return null
            return (
              <figure key={i} className="my-7">
                <div className="plate-scroll px-1 py-3 text-ink">
                  <Fig />
                </div>
                <figcaption className="border-t border-rule pt-2 text-[11px] leading-relaxed muted">
                  {/* An overflow container with no sign that it scrolls is a hidden
                      affordance (Ch. 7). Only shown where the plate actually clips. */}
                  <span className="mb-1 block font-bold [@media(min-width:640px)]:hidden">
                    Scroll the figure sideways →
                  </span>
                  {b.number && <span className="font-bold">Fig. {b.number} — </span>}
                  {b.caption}
                </figcaption>
              </figure>
            )
          }
          case 'objectives':
            return (
              <div key={i} className="slab-flat bg-white p-4">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest">
                  Learning objectives
                </p>
                <ul className="space-y-1">
                  {b.items.map((it, j) => (
                    <li key={j} className="flex gap-2.5 text-sm leading-relaxed">
                      <span className="font-bold tabular-nums muted">{j + 1}</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          case 'h':
            return (
              <h3 key={i} className="pt-3 text-lg font-bold tracking-tight">
                {b.text}
              </h3>
            )
          case 'claim': {
            const c = CLAIM[b.level] ?? CLAIM.consensus
            return (
              <div key={i} className="slab-flat bg-white p-4">
                <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${c.cls}`}>
                  {c.label}
                </span>
                <p className="mt-2.5 text-[15px] leading-relaxed">{b.text}</p>
              </div>
            )
          }
          case 'list':
            return (
              <ul key={i} className="space-y-1.5 pl-1">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3 text-[15px] leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-teal" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            )
          case 'formula':
            return (
              <p key={i} className="slab-flat bg-white px-4 py-3 text-center font-mono text-base">
                {b.text}
              </p>
            )
          case 'callout':
            return (
              <p key={i} className="border-l-4 border-teal bg-white px-4 py-3 text-[15px] leading-relaxed">
                {b.text}
              </p>
            )
          case 'papers':
            return (
              <div key={i} className="border-t-2 border-ink pt-3">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest opacity-60">
                  Key papers
                </p>
                <ul className="space-y-1">
                  {b.items.map((it, j) => (
                    <li key={j} className="text-[13px] leading-relaxed opacity-80">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            )
          case 'exercise':
            return (
              <div key={i} className="slab bg-yellow p-4">
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest">Exercise</p>
                <p className="text-[15px] leading-relaxed">{b.text}</p>
              </div>
            )
          default:
            return (
              <p key={i} className="text-[15px] leading-relaxed">
                {b.text}
              </p>
            )
        }
      })}
    </div>
  )
}
