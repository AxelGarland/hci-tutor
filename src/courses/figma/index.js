import part01 from './content/part01.json'
import { figures } from './figures'

/**
 * Figma in Practice — a Scaffold course package.
 *
 * Written from Figma's own Help Center articles and from transcripts of Figma's
 * YouTube workshops, both kept under `sources/` so any claim can be checked
 * against its origin. The syllabus and its provenance are in
 * `sources/figma-course-syllabus.md`.
 *
 * No `designNotes`: that field only makes sense for a course whose subject is
 * this app's own interface, and the sidebar link disappears when it is absent.
 */
export default {
  id: 'figma',
  title: 'Figma in Practice',
  subtitle: 'From layout mechanics to the code boundary',
  blurb:
    'Building systems rather than screens — auto layout, components, variables, type, prototyping and the boundary where a design becomes code.',
  modules: [part01],
  figures,
}
