/**
 * The self-grading pair, in one place.
 *
 * This markup used to be copied into the recall item, the flashcard deck and the
 * review runner, and the three copies had already drifted: the same action was
 * labelled "Got it" in one and "Knew it" in the others, and the positive button
 * was ink in one and cobalt in the others. Grading is the single most repeated
 * action in the app, so it has to look and read identically wherever it appears.
 *
 * Red and blue rather than red and green: that pair stays separable under the
 * common colour vision deficiency. Both outcomes are named in words regardless,
 * so the hue is reinforcement and never the message. White on signal measures
 * 4.83:1 and white on cobalt 8.63:1.
 */
export default function GradeButtons({ onGrade }) {
  return (
    <div className="flex gap-3">
      <button onClick={() => onGrade(false)} className="micro slab-flat flex-1 bg-signal px-4 py-3 text-white">
        Missed it
      </button>
      <button onClick={() => onGrade(true)} className="micro slab-flat flex-1 bg-cobalt px-4 py-3 text-white">
        Got it
      </button>
    </div>
  )
}
