# Scaffold

A structure for teaching a course: chapters you read, demos you run on yourself, and a schedule that
brings each idea back before you forget it. A study sitting is an hour and covers one chapter; a
review sitting is ten minutes of recall on whatever is due. Last week's material is scored
separately from today's. No backend, no accounts; progress lives in the browser's localStorage,
namespaced per course.

The name is the pedagogical term for support that is withdrawn as competence grows.

## The shape of it

```
src/
  scaffold/          the framework — engine and UI, knows nothing about any subject
    store.js         progress, scheduling, stats
    course.js        the active course and its derived catalog
    session.js       session planning and phase budgets
    components/      every screen
    DesignContext.js the context a Cite marker uses to open a chapter
  courses/
    index.js         the registry
    hci/             reference implementation — 43 chapters, 314 items, 7 demos
      content/       modules and lessons
      demos/         interactive components
      figures/       encyclopedia plates
      designNotes.js chapter citations for the app's own design
  index.css          design tokens
```

Outside `courses/`, the framework contains no subject-specific code. **Adding a course means writing
a folder and listing it in the registry — see [AUTHORING.md](AUTHORING.md).**

## The course

One course is built so far: **Human–Computer Interaction** — 43 chapters, 314 scheduled items, 7
interactive demos, every claim checked against the source syllabus. It is the reference
implementation, and it uses the optional `designNotes` field to justify the app's own interface from
its own material, which is a thing only a course about interface design can do.

Every course must trace to a real source. Write the content from material you have, not from
recollection — see the item-writing section of [AUTHORING.md](AUTHORING.md).

## The visual direction

One direction, monochrome. Greyscale throughout, a soft grey ground rather than a flat page, an
oversized grotesk display, and hairlines instead of boxes. **No colour carries meaning anywhere:**
right and wrong are fill versus outline plus a word, emphasis is weight and rule, and the decorative
module swatches are gone.

That move was only available because the colour-only encodings had already been removed — the quiz
names its verdicts in text, so taking the hue away cost nothing. A design leaning on red and green
could not have done it without breaking for the 8% of men with a colour vision deficiency.

Tokens live in `src/index.css`. The old semantic names (`--color-teal`, `--color-red`) are kept so
component classes did not all have to change, but every one now resolves to a grey.

## Run it

```bash
npm run dev
```

## Authoring

Course structure, the reading block types, item-writing guidance and the demo contract all live in
[AUTHORING.md](AUTHORING.md). Nothing in `src/scaffold/` needs to change to add a course.

The `claim` block's levels reproduce the HCI book's epistemic labelling convention (established /
current consensus / emerging / contested) as text badges rather than coloured squares. Courses whose
material does not vary in evidential strength should skip them.

## The study session

Two modes, because comprehension and retrieval want opposite shapes. A **study session** is an hour
on one chapter; a **review** is ten minutes of pure retrieval on whatever is due. Three short review
sittings across three days beat one long one for retention, which is why the short mode exists.

The study session splits into four phases (`SPLIT` in `src/scaffold/session.js`), and item counts
scale with the clock:

| Phase | 45 min | 60 min | 90 min |
| --- | --- | --- | --- |
| Warm-up — recall from *earlier* chapters, before reading | 5 min · 6 items | 6 min · 8 items | 9 min · 11 items |
| Study — the chapter, its demo, its exercise | 25 min | 33 min | 50 min |
| Closing test — this chapter plus older ones, **scored separately** | 11 min · 13 items | 15 min · 16 items | 23 min · 24 items |
| Summary — a paragraph in your own words, saved to the lesson | 5 min | 6 min | 9 min |

Three deliberate choices:

- **Warm-up runs before reading.** Attempting retrieval before study improves later encoding even
  when the attempt fails.
- **The two scores never merge.** The just-studied score is taken minutes after reading and mostly
  measures fluency; the older-material score is the one carrying information.
- **The clock never cuts an item short.** When a phase's time is up it says so and waits for the
  current item to finish. Soft stop, not hard.

All items use free recall: you type the answer from nothing, commit a confidence level, and only
then see the real one. Quiz items hide their options until the reveal, which turns a recognition
question into a recall question. Grading is your own call.

**Confidence wager.** Each answer is marked `sure` / `think so` / `guessing` before the reveal.
Items missed while marked *sure* are tracked separately as blind spots — those are the real gaps.

## Scheduling

Leitner boxes at 0, 1, 3, 7, 16 and 35 days. A correct answer promotes one box; a wrong one drops
to zero. Cards and quiz questions share one schedule, and **Review** interleaves whatever is due
across the whole book.

A sitting is capped at 30 items (`SESSION_CAP` in `src/scaffold/store.js`). Lapsed reviews are served before
new material, so the backlog never buries the schedule. Past `REVIEW_GATE` (25) overdue items a
session stops introducing new chapters entirely until the backlog clears — an unbounded backlog is
what ends most spaced-repetition habits.

Items missed `LEECH_THRESHOLD` (5) times are flagged after a session. Repeated misses usually mean
the card is badly written; rewrite it in that course's `content/` rather than grinding it.

## Exam plan

Set a date and it back-plans: repetitions remaining, per day, and sessions per day. If the date is
closer than 27 days it says so — reaching the final box needs 5 correct answers spread across at
least `0+1+3+7+16` days, and no amount of daily effort compresses that. It reports the floor rather
than a comfortable number.

## Design citation layer

Interface elements carry a small chapter marker. Clicking it explains why that element is built the
way it is and links to the chapter that justifies it — the calm timer to 25, the confidence wager
to 29, the separated scores to 36, the deliberately absent streak counter to 21. The notes live in
`courses/hci/designNotes.js`; each one has to be an honest citation, and where the research sits outside the
book the note says so rather than borrowing authority the chapter doesn't give.

**There is no streak counter, no daily goal, and no loss-framed language.** That is a design
position, not an oversight: it is Chapter 21's endorsement test applied to this app.

## Design constraints this app holds itself to

Checked programmatically across every view — lesson, session setup, warm-up, study, closing test,
summary, results, exam plan:

- **Contrast** — every text node meets WCAG 2.2 AA (4.5:1, or 3:1 for large text) against its
  composited background. Secondary text is the `--color-muted` token (~6:1), never the body colour
  faded with opacity, which measured about 3.7:1 at the sizes it was used.
- **Target size** — every control meets 24×24 CSS px. Controls drawn smaller than that (the chapter
  citation markers) carry an invisible hit area via the `.tap` utility.
- **No colour-only encoding** — nothing signals with hue at all; verdicts are named in text and
  distinguished by fill versus outline.
- **Motion** — `prefers-reduced-motion` is honoured globally.
- **Keyboard** — every interactive element is a native control; focus is visible at 3px.
- **Measure** — reading columns run ~69 characters, inside the 45–75 the typography chapter asks for.

### The one deliberate exception

The Fitts's law demo draws targets as small as 18px, below the 24px minimum. A Fitts demo that never
presents a difficult target cannot demonstrate anything — the index of difficulty would barely move.
The exception is confined to that demo surface, and no task in the app depends on hitting one. It is
documented in the citation layer under `demoTargets` rather than left silent.

## Demos

Seven, each on the chapter it belongs to:

| key | chapter | what it does |
| --- | --- | --- |
| `search` | 2 | single-feature vs conjunction search; watch the conjunction row climb with set size |
| `span` | 3 | digit span, chunked vs unchunked — find your own 3–4 chunk limit |
| `fitts` | 4 | click targets, fits `MT = a + b·ID` to your own trials |
| `hicks` | 4 | timed choice among 2/4/8/16 options |
| `feedback` | 7 | latency × feedback sandbox; counts the duplicate orders you place |
| `encoding` | 18 | Cleveland & McGill — judge ratios by position, angle and area, and rank your own error |
| `reliance` | 29 | a 75%-accurate assistant; measures accept-when-right minus accept-when-wrong, with a cognitive-forcing mode |

To add one: write the component in the course's `demos/`, register it in its `demos/index.js` with a `tab`
label and a `title`, then list its key in a lesson's `demos` array.

## Deploying

```bash
npm run build
```

`dist/` is a static folder with no backend. Drop it on Netlify, or connect the repo to Vercel for
push-to-deploy.

**For GitHub Pages**, the site is served from a subpath, so Vite needs to know about it — add
`base: '/<repo-name>/'` to `vite.config.js` before building, or the CSS and JS will 404. Netlify and
Vercel serve from the root and need no change.

Progress is per-browser and per-course, so it does not follow a reader between devices.
