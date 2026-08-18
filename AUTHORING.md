# Authoring a Scaffold course

A course is a folder. The framework knows the shape of one manifest and nothing else about your
subject — no engine code changes when you add a course.

```
src/courses/<id>/
  index.js          the manifest (required)
  content/*.json    modules, each holding lessons (required)
  demos/            interactive components, if the subject has any (optional)
  designNotes.js    chapter citations for the app's own design (optional, rare)
```

## 1. The manifest

```js
// src/courses/pottery/index.js
import part01 from './content/part01.json'
import { demos } from './demos'

export default {
  id: 'pottery',                    // must match the folder name
  title: 'Throwing and Firing',
  subtitle: 'Wheel work from centring to glaze',
  blurb: 'Two sentences at most. Shown on the course card.',
  modules: [part01],
  demos,                            // omit if there are none
}
```

Then register it:

```js
// src/courses/index.js
import pottery from './pottery'
export const COURSES = { [hci.id]: hci, [pottery.id]: pottery }
```

That is the whole integration. Progress, scheduling, sessions, the exam planner and both visual
directions come for free.

## 2. A module file

```json
{
  "id": "p01",
  "title": "I — Centring",
  "color": "blue",
  "lessons": [{
    "id": "p01ch01",
    "number": 1,
    "title": "Wedging",
    "demos": ["timer"],
    "reading": [ /* blocks — see below */ ],
    "cards": [{ "id": "p01ch01c1", "front": "Term", "back": "Definition" }],
    "quiz": [{
      "id": "p01ch01q1",
      "question": "…",
      "options": ["A", "B", "C", "D"],
      "answer": 0,
      "why": "Why that answer is right — shown after answering."
    }]
  }]
}
```

`color` is one of `blue`, `red`, `teal`, `yellow`, `ink`.

**Every `id` must be unique across the whole course.** The scheduler keys progress on it, so
changing an existing id resets that item's history. Ids do not need to be unique across courses —
progress is namespaced per course.

### Reading block types

| type | fields | renders as |
| --- | --- | --- |
| `objectives` | `items[]` | numbered learning-objectives panel |
| `p` | `text` | paragraph |
| `h` | `text` | subheading |
| `list` | `items[]` | bulleted list |
| `formula` | `text` | centred monospace panel |
| `callout` | `text` | ruled emphasis block |
| `claim` | `level`, `text` | badged claim — `established` / `consensus` / `emerging` / `contested` |
| `papers` | `items[]` | source list |
| `exercise` | `text` | exercise card |

`claim` levels are for subjects where the strength of evidence varies and the learner should know
which is which. Skip them if that distinction doesn't apply to your material.

## 3. Writing items that actually work

**Write from a source you have in front of you.** Not from recollection, and not from a model's
general knowledge — a course full of fluent, unattributed, plausible-sounding claims is worse than
no course, because the learner has no way to tell which items are wrong. Keep the source to hand and
check each item against it. If a claim cannot be traced back, cut it rather than shipping it.

The scheduler and the session engine are only as good as the items.

- **Cards should ask for one thing.** If the back has three facts, it is three cards.
- **Front should be answerable from nothing.** Sessions use free recall — the learner types the
  answer before seeing it, so "Fitts's law" is a worse prompt than "Fitts's law — what does it
  predict?"
- **Quiz distractors must be plausible and wrong.** An obviously silly option turns a four-option
  question into a two-option one.
- **`why` should justify, not restate.** It is the only teaching that happens after an answer.

## 4. Demos

A demo is a React component plus a registry entry:

```js
// src/courses/pottery/demos/index.js
import Timer from './Timer'
export const demos = {
  timer: { tab: 'Timer', title: 'Feel the drying window', Component: Timer },
}
```

Then list the key in a lesson's `demos` array. `tab` is the tab label, `title` the heading above it.

Demos are where a course earns its keep — they teach by letting the learner produce the effect
rather than read about it. They are also the most expensive thing to write, and a course with none
still works.

**A demo must meet the same floors as the rest of the app:** 4.5:1 text contrast, 24×24px targets,
no colour-only encoding, and no motion that ignores `prefers-reduced-motion`. If your subject
genuinely requires breaking one — as the Fitts demo does, drawing sub-minimum targets because the
law needs hard targets to be visible — confine it to the demo surface, make sure no task depends on
it, and document it in `designNotes.js` rather than leaving it silent.

## 5. Design notes (optional)

`designNotes.js` maps a key to a chapter that justifies one of the app's own design decisions:

```js
export const NOTES = {
  timer: { lesson: 'ch25', note: 'Why the clock is a thin rule rather than a countdown…' },
}
```

Rendered by `<Cite id="timer" />` inside framework components. This only makes sense when the course
is *about* interface design — the HCI course uses it to justify the app from its own syllabus. Most
courses should leave the field out entirely, and the citation markers simply won't render.
