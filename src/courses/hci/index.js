import part01 from './content/part01.json'
import part02 from './content/part02.json'
import part03 from './content/part03.json'
import part04 from './content/part04.json'
import part05 from './content/part05.json'
import part06 from './content/part06.json'
import part07 from './content/part07.json'
import part08 from './content/part08.json'
import part09 from './content/part09.json'
import part10 from './content/part10.json'
import part11 from './content/part11.json'
import { demos } from './demos'
import { figures } from './figures'
import { NOTES } from './designNotes'

/**
 * A Scaffold course package. Everything subject-specific lives in here; the
 * framework only knows this shape.
 */
export default {
  id: 'hci',
  title: 'Human–Computer Interaction',
  subtitle: 'From foundations to AI-native design',
  blurb:
    'Forty chapters from the scientific foundations through to designing AI-native products, with demos you run on yourself.',
  modules: [
    part01, part02, part03, part04, part05, part06,
    part07, part08, part09, part10, part11,
  ],
  demos,
  figures,
  // Optional. This course is about interface design, so it can justify the app's
  // own decisions from its own syllabus. Most courses will leave this empty.
  designNotes: NOTES,
}
