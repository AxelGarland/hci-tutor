/**
 * The matcher for `exact` items — the one item kind the app checks itself.
 *
 * Deliberately minimal: case, surrounding whitespace and trailing punctuation
 * only. A matcher that tries to be clever about synonyms, units or word order is
 * guessing, and a wrong verdict is worse than no verdict — the entire reason an
 * exact item exists is that its result can be trusted without self-assessment.
 * Anything else that should pass belongs in the item's own `accept` list, where
 * it is visible to whoever wrote the item.
 *
 * Lives in its own module because both the study session (`RecallItem`) and the
 * review runner (`ReviewSession`) need it, and a second copy would drift — three
 * copies of the grading pair already drifted once.
 */
const normalise = (s) =>
  String(s)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[.,;:!?]+$/, '')

export function matchExact(typed, accept = []) {
  const t = normalise(typed)
  return t.length > 0 && accept.some((a) => normalise(a) === t)
}
