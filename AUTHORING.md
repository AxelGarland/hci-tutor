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
      "why": "Why that answer is right — shown after answering.",
      "key": "Optional. The one thing the answer had to contain."
    }],
    "exact": [{
      "id": "p01ch01e1",
      "prompt": "A question with exactly one canonical answer",
      "accept": ["42", "forty-two"],
      "note": "Shown after checking — justify, don't restate."
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

### `terms` — vocabulary as a first-class block

```json
{ "type": "terms", "items": [
  { "term": "Hug contents",
    "as": "width: fit-content",
    "def": "The frame sizes itself from its children." }
]}
```

Renders as a definition list: the term in bold, the equivalent name beside it in mono, the one-line
meaning beneath. `as` is optional.

Use it because naming is part of the job. A designer is judged on vocabulary in three rooms — the
tool's own panel, the design review, and the conversation with a developer — and the three rooms
often use different words for one idea. Teaching only the tool's word leaves someone fluent in Figma
and mute everywhere else.

**`as` has to be sourced like anything else.** A cross-reference asserted from memory is the same
failure as an invented fact; the CSS equivalences in the Figma course are quoted from MDN, which is
cited in the syllabus. If you cannot source an equivalence, leave `as` out.

Pair each `terms` block with `exact` items for the terms themselves. A term has exactly one canonical
answer, which is the one case where the app can mark vocabulary for you.

### Exact items — the only kind the app grades

Cards and quiz items end in self-assessment: you read the answer and decide whether yours was close
enough. An `exact` item instead states a question with **one canonical answer**, and the app checks
the typed string against `accept` and grades itself. No judgement, no inflation.

Matching (`src/scaffold/exact.js`) normalises case, surrounding whitespace and trailing punctuation
and nothing else. It will not guess at synonyms, units or word order, because a wrong verdict is
worse than no verdict — the whole value of the kind is that its result can be trusted. **Everything
else that should pass goes in `accept`**, where whoever wrote the item can see it.

- **Use it for** numbers, years, named levels, terms, shortcuts, property names: `250`, `2023`, `AA`,
  `Shift A`, `hug contents`.
- **Don't use it for** anything with two valid phrasings, or any answer longer than a few words. The
  moment you find yourself adding a fifth `accept` entry, it is a card.
- **`accept[0]` is what gets shown** when the answer is wrong, so put the cleanest form first.

### `key` — narrowing a self-grade

Any card or quiz item may carry an optional `key`: the single thing the answer had to contain. The
reveal prints it, which turns "was I close enough?" into "did I say that?". Leave it out and the item
behaves as before.

### Quiz options are a check, not a question

Quiz items hide their options until the reveal, then show all of them with the correct one marked.
The options are the **verification step** — a precise target to compare a written answer against,
plus the near-misses that were ruled out. Which is why distractors have to be plausible and wrong:
they are read most carefully *after* answering.

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

Collected on the **Why it is built this way** screen, reached from the foot of the sidebar. Each
note takes a `title`, the `lesson` it cites, and the note itself. This only makes sense when the
course is about interface design and the app is a worked example of its own material; other courses
should leave the field out entirely, and the screen is never linked or reached.
