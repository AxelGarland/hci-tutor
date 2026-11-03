import { figures } from '../store'

/* The level is named in words on every badge. The hue is reinforcement, so a
   reader who cannot separate the fills loses nothing. */
const CLAIM = {
  established: { label: 'Established', cls: 'bg-ink text-paper' },
  consensus: { label: 'Current consensus', cls: 'bg-cobalt text-paper' },
  emerging: { label: 'Emerging', cls: 'bg-accent text-ink' },
  contested: { label: 'Contested', cls: 'bg-signal text-white' },
}

/**
 * The reading surface.
 *
 * This is the calm half of the design. The hairline rectangle used to be the
 * container for every block type here, which gave a chapter eleven identical
 * shapes and no hierarchy — a wireframe of a good page rather than the page. Now
 * each block earns its own device: a cobalt numbered list, a heavy ink rail, a
 * pair of rules, a field. Only the exercise is a solid colour, because it is the
 * one block asking the reader to do something rather than read something.
 */
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
              <figure key={i} className="my-8">
                <div className="plate-scroll px-1 py-3 text-ink">
                  <Fig />
                </div>
                <figcaption className="reading border-t border-rule pt-2 text-[13px] muted">
                  {/* An overflow container with no sign that it scrolls is a hidden
                      affordance (Ch. 7). Only shown where the plate actually clips. */}
                  <span className="micro mb-1.5 block text-ink [@media(min-width:640px)]:hidden">
                    Scroll the figure sideways →
                  </span>
                  {b.number && <span className="font-bold text-ink">Fig. {b.number} — </span>}
                  {b.caption}
                </figcaption>
              </figure>
            )
          }
          case 'objectives':
            return (
              <div key={i} className="mb-7">
                <p className="micro muted">Learning objectives</p>
                <ol className="mt-2.5 space-y-1.5">
                  {b.items.map((it, j) => (
                    <li key={j} className="reading flex gap-3 text-[15px]">
                      <span className="num font-black not-italic text-cobalt">{j + 1}</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )
          case 'h':
            return (
              <h3 key={i} className="pt-6 text-xl font-extrabold tracking-[-0.015em] text-cobalt">
                {b.text}
              </h3>
            )
          case 'claim': {
            const c = CLAIM[b.level] ?? CLAIM.consensus
            return (
              <div key={i} className="my-6 border-l-[5px] border-ink pl-4">
                <span
                  className={`inline-block px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${c.cls}`}
                >
                  {c.label}
                </span>
                <p className="reading mt-2.5 text-base">{b.text}</p>
              </div>
            )
          }
          case 'terms':
            // Vocabulary, as a definition list rather than prose. A designer is
            // judged on naming in three rooms — the tool's own panel, the design
            // review, and the conversation with a developer — and those rooms
            // frequently use different words for one idea. `as` carries the
            // equivalent name so the mapping is learnable, not just the term.
            return (
              <dl key={i} className="my-7">
                {b.items.map((t, j) => (
                  <div key={j} className="border-t border-rule py-3 first:border-t-0">
                    <dt className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-[15px] font-extrabold">{t.term}</span>
                      {t.as && (
                        <span className="font-mono text-[12px] text-cobalt">{t.as}</span>
                      )}
                    </dt>
                    <dd className="reading mt-1 text-[14px] muted">{t.def}</dd>
                  </div>
                ))}
              </dl>
            )
          case 'list':
            return (
              <ul key={i} className="space-y-2 pl-1">
                {b.items.map((it, j) => (
                  <li key={j} className="reading flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-cobalt" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            )
          case 'formula':
            // Two rules rather than a box: the formula is a held-apart line in
            // the argument, not a separate object sitting on the page.
            return (
              <p
                key={i}
                className="num my-7 border-y-2 border-ink py-4 text-center text-lg font-bold tracking-[0.04em] sm:text-xl"
              >
                {b.text}
              </p>
            )
          case 'callout':
            return (
              <p key={i} className="reading my-6 border-l-[5px] border-cobalt py-0.5 pl-4">
                {b.text}
              </p>
            )
          case 'papers':
            return (
              <div key={i} className="mt-7 border-t-2 border-ink pt-3">
                <p className="micro muted">Key papers</p>
                <ul className="mt-2 space-y-1.5">
                  {b.items.map((it, j) => (
                    <li key={j} className="reading text-[14px] muted">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            )
          case 'exercise':
            // The one solid field in the reading surface. Ink on accent is
            // 12.0:1; white on accent is 1.57:1 and is never used.
            return (
              <div key={i} className="my-8 bg-accent p-5 text-ink">
                <p className="micro">Exercise</p>
                <p className="reading mt-2">{b.text}</p>
              </div>
            )
          default:
            return (
              <p key={i} className="reading">
                {b.text}
              </p>
            )
        }
      })}
    </div>
  )
}
