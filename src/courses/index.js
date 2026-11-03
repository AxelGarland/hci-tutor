import figma from './figma'
import hci from './hci'

/**
 * The course registry. Adding a course means writing a package under
 * `courses/<id>/` and listing it here — no framework code changes.
 */
export const COURSES = {
  [hci.id]: hci,
  [figma.id]: figma,
}

export const DEFAULT_COURSE = hci.id
