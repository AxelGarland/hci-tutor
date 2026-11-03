# Proposal: the product-designer path

Teaching a tool skill and a knowledge discipline in one app, without pretending the app can see your
Figma file.

---

## 1. The problem, stated precisely

Scaffold measures **recall**. Figma competence is **production**. The app cannot watch you work.

The tempting move is to write 300 Figma quiz items — "what does hug contents do?" — and call it a
course. That would measure vocabulary and produce a designer who can define `fill container` and
cannot build a card that reflows. The Figma syllabus already quotes the standard this course is
supposed to meet: the professional *"builds systems instead of isolated screens."* No quiz detects
that.

So the design question is not "how do we test Figma in a web app." It is **"what can be verified, by
whom, and how do we stop the rest from rotting into self-flattery."**

### The line, drawn

Self-report is unreliable and reliable in different places, and the difference is the whole design:

| Question the app asks | Answer type | Trustworthy? |
| --- | --- | --- |
| "Did you remember this well enough?" | Fuzzy, graded against a remembered standard | **No.** Inflatable, and the HCI course already concedes this — grading is "your own call" |
| "Did the frame break when you resized it — yes or no?" | Binary, physical, observable | **Yes.** There is nothing to inflate |
| "How many unnamed layers did the audit return?" | A number the tool produced | **Yes.** Not your opinion |
| "Is this layout good?" | Judgement | **Unscoreable.** Do not pretend otherwise |

Figma's own materials already hand us row two. *"Resize the frame and everything reflows
correctly." "Update one master component and see the changes propagate."* These are not assessment
rubrics someone invented — they are **experiments with binary outcomes that the learner runs on
themselves and cannot fudge.**

**So yes: the success test replaces the quiz item as the unit of assessment for Figma.** That is the
central decision in this proposal and everything below follows from it.

---

## 2. The learning modes, with verdicts

You asked for opinions, not a menu. Seven modes considered, four adopted as scored content, two as
unscored, one rejected.

### Adopt — scored

**Timed rebuild — the core mode.** A reference (screenshot, or a Figma Community file the sources
already name: *Auto layout playground*, *Grid playground*, *Variables playground*, *Advanced
prototyping playground*), a time box, and one to three binary success tests. You build it in Figma,
run the tests, report pass/fail per test. This is the mode that carries the 80% of the 20/80 split,
and it is the only one that makes "builds systems not screens" falsifiable.

**Build challenge.** The same structure on first encounter rather than repeat. Distinguished only
because the time box should be generous the first time and tight on repeats — the compression *is*
the fluency gain.

**File audit.** A checklist of structural properties, each a yes/no the learner can check
mechanically: every text layer uses a style; no detached instances; no fixed-width text boxes in a
fluid layout; no colour literal outside a variable. This is the mode that most directly tests systems
thinking, and the sources hand us the mechanism — the agent video names *"auditing a file for unused
variables, flagging unnamed layers, applying naming conventions"* as exactly the jobs a generative
plugin should do, where *"future runs cost zero credits."* So a late chapter has the learner build the
auditing plugin, and from then on the audit returns **a number, not a feeling.**

**Deliberate-error diagnosis.** A described broken file — "this card collapses at 320px, here is its
structure" — and the learner names the fault. This is the one place a quiz item genuinely measures
skill rather than vocabulary, because **diagnosis is knowledge even when building is not.** It also
maps onto material already in the sources: the agent critique that returned *"detail text is too small
at 14 pixels, body text is dense for a slide, there's a big hierarchy jump, low contrast on small
text."* Those five faults are five items.

### Adopt — unscored

**Teach-back.** Already exists as the session's summary phase. Extend it: after a build, explain in
your own words why the layout holds. Saved to the lesson, never graded.

**Before/after critique.** Rebuild something you made in week 1 during week 4 and write what you would
now do differently. High value, zero scoreability. A reflection prompt, not an item — and the app
should say so on the screen rather than implying a verdict.

### Reject

**Quiz items as a proxy for tool skill.** Keep quiz items for diagnosis and for genuinely declarative
facts the docs state — plan restrictions, the constraint rule, which resizing modes apply to parents
versus children. Do not write "which button adds auto layout" items. They test the manual, and the
manual is one keystroke away.

### The scheduling change this forces

**Spaced re-building, not spaced recall.** A Figma item resurfacing after seven days should not ask
*"what does fill container do."* It should ask you to **rebuild the card in eight minutes and report
whether it reflows.** The Leitner box is the right machine; the thing being scheduled changes from a
question to an experiment.

---

## 2a. Multiple choice: the answer is mostly no, and your own course says why

You asked whether swapping written answers for multiple choice would let you verify yourself, or
whether it would make you learn less. **It would make you learn less, and the app already made this
exact decision once, deliberately.** Chapter 3 of the HCI course states the mechanism:

> "Recognition over recall" is not a stylistic preference: recall requires holding candidate answers
> in a store with a capacity of three or four, while recognition puts the candidates on the display
> and asks only for identification.

That is a principle for **designing interfaces** — offload work from the user. Studying is the one
activity where you want the opposite, because the work *is* the product. The `recall` design note
names the other half: committing an answer before seeing it is what *"produces the generation effect
in memory."* Multiple choice removes precisely the step that generates the memory.

The README already records the resulting position: *"Quiz items hide their options until the reveal,
which turns a recognition question into a recall question."* The app converts multiple choice into
recall on purpose. Reversing that would undo a solved problem.

**But your underlying need is legitimate, and it is a different problem.** "I cannot verify whether I
was right" is not fixed by making the question easier. Three designs give you verification at full
recall effort:

### 1. Exact-answer items — a new kind, machine-checked

Both courses are full of facts with a single canonical answer: the 24px target minimum and 44px on a
coarse pointer, 3–4 chunks, 10 variable modes per collection, 400 as normal weight, `Shift A`,
`Opt Cmd A`, the minor-third ratio, `topicsSelected > 0`. You type it; **the app string-matches it.**

Full recall effort, zero self-grading, and a real verdict. This is the direct answer to what you
asked for, and it is the one genuinely new item kind this section adds:

```json
{ "id": "fg04e1",
  "prompt": "Minimum touch target on a coarse pointer, in CSS pixels",
  "accept": ["44", "44px"],
  "note": "24px is the WCAG floor; 44 is the coarse-pointer target this app enforces." }
```

Scope it to numbers, terms, shortcuts and property names. The moment an answer has two valid phrasings
it stops being an exact item and becomes a written one.

### 2. Reveal the options *as the check*, after you have written

Keep free recall, then on reveal show the four options with the correct one marked. You check your
typed answer against a **precise target** instead of a remembered approximation of one. This is nearly
free — quiz items already carry options and already hide them until reveal. The change is surfacing
them as the verification step rather than as a question.

### 3. Narrow self-grading to a binary

Instead of "was I close enough?", ask "**did your answer contain X?**" where X is the one thing that
had to be there. Same move as the build tests: convert a fuzzy judgement into a checkable one. The
HCI course concedes grading is "your own call"; this shrinks how much call there is.

### Where multiple choice genuinely earns its place

Two cases, and they are not recall:

- **Diagnosis.** *"This card collapses at 320px, here is its structure — which is the fault?"* Here the
  options **are** the content. Discriminating between four plausible explanations is the skill, and no
  amount of free recall tests it better.
- **When the distractors teach.** Sorting hug / fill / fixed by what they attach to — parent or child —
  is work the wrong options do for you. The auto layout article's own table is a four-option question
  waiting to happen.

**Decision: no multiple choice for recall. Exact-answer items for anything with one canonical answer,
reveal-as-check for everything written, and multiple choice confined to diagnosis and discrimination.**

## 3. Session shape

The HCI session is lecture-shaped: `SPLIT = { warmup: 0.1, study: 0.55, test: 0.25, summary: 0.1 }`,
which at 60 minutes is 6 / 33 / 15 / 6. A build session cannot be that — 33 minutes of reading about
auto layout is the failure mode this whole proposal exists to avoid.

**Proposal: a second session type, not a reshuffle of the first.**

| Phase | Knowledge session (today) | Build session (new) |
| --- | --- | --- |
| Warm-up — recall from earlier chapters | 6 min · 8 items | 5 min · 4 items |
| Brief — what you are about to build and why | — | 8 min |
| Study — read the chapter, run the demo | 33 min | — |
| **Build — in Figma, outside the app** | — | **35 min** |
| Closing test | 15 min · 16 items | — |
| Report — pass/fail per test, then teach-back | 6 min (summary only) | 12 min |

At 60 minutes the build split is roughly `{ warmup: 0.08, brief: 0.13, build: 0.59, report: 0.20 }`.

**The app's role inverts.** In a knowledge session Scaffold is where the learning happens. In a build
session Scaffold is a **lab notebook**: it sets the task, runs the clock, and records what happened.
The reading becomes reference you consult mid-build, not a lecture you sit through first. That is a
real change in what the screen is for, and the interface should look like it — the build phase wants
the brief and the test checklist visible and almost nothing else.

The existing **soft stop** survives unchanged and matters more here: a clock that cuts you off
mid-build would be worse than useless.

---

## 4. Intervals, caps, and scoring

### Separate interval ladders

`INTERVALS = [0, 1, 3, 7, 16, 35]` with `MASTERED_BOX = 5` means five correct answers across at least
27 days. That is right for a flashcard and wrong for a rebuild: five timed rebuilds of the same card
inside a month is busywork, and at 8–10 minutes each it crowds out new material.

Proposed, per item kind:

```js
INTERVALS       = [0, 1, 3, 7, 16, 35]   // knowledge — unchanged
BUILD_INTERVALS = [0, 2, 9, 30]          // builds — fewer reps, wider gaps
MASTERED_BOX       = 5
BUILD_MASTERED_BOX = 3                   // three clean rebuilds over ~41 days
```

**Flagging this honestly: that ladder is my reasoning, not a sourced finding.** Nothing in the Figma
docs or the transcripts says anything about how tool skill decays, and `AUTHORING.md`'s rule forbids
dressing up a guess as a result. It is a defensible starting shape — fewer repetitions because each
one costs 10× a flashcard, wider gaps because a rebuild re-encodes more than a recall does — and it
should be tuned against your own data rather than trusted.

### Caps

`SESSION_CAP = 30` cannot apply to builds; thirty rebuilds is four hours. Needs
`BUILD_SESSION_CAP = 2`, and `REVIEW_GATE = 25` needs a build-aware sibling — two overdue rebuilds is
already a full sitting's backlog.

### Scoring

`grade(progress, id, correct, confidence)` takes one boolean. A build has *n* tests, and "reflowed but
the component did not propagate" is real information that one boolean destroys. So `correct` becomes a
vector for build items, with the box advancing only on a clean sweep.

**The confidence wager gets more valuable here, not less.** In the knowledge course, wrong-while-sure
marks a fact you believe incorrectly. In a build course it marks something sharper: **your model of
how the tool behaves is wrong in a specific, locatable way.** That is the single highest-information
event the system can record, and the results screen should treat it as the headline rather than a
footnote.

---

## 5. Architecture: two packages, one path

**Two course packages. One thin path layer. Not a merge.**

Reasons, in order of weight:

1. **Different item kinds and different ladders.** Merging forces one schedule over two materials
   whose repetitions differ by an order of magnitude in cost.
2. **The HCI course is built and published.** A merge means editing 314 working items to carry a new
   course id. The seam is already correct — progress is namespaced `scaffold:progress:v1:<courseId>`
   and `designNotes` degrades to nothing when absent. Don't break a working seam to save a layer.
3. **The path is the cheap part.** A sequence of `(courseId, lessonId)` pairs with a gate condition is
   a data file, not an engine change.

**What it costs, stated plainly:** the path has to read progress across two namespaces, and `store.js`
currently assumes exactly one active course — `load()`, `dueItems()` and `overallStats()` all resolve
through `activeCourseId()`. A path-aware read is new work, and it is the one place this proposal adds
real complexity rather than reusing what exists.

**What doesn't change:** the framework/course separation, the Leitner engine itself, the backup/restore
format, the colophon, the design system.

---

## 6. The HCI cut list

43 chapters is a degree. **Keep 14 as core, 4 as an AI elective, drop 25, and promote the capstone out
of the chapter list.** Reason per cut, as asked.

### Core — 14 chapters

These are the ones you cite out loud in a design review.

| # | Chapter | Why it stays |
| --- | --- | --- |
| 2 | Perception and Attention | Pop-out and preattentive processing *are* visual hierarchy. Has a demo. |
| 3 | Memory, Mental Models, MHP | The 3–4 chunk limit decides nav depth and form length. Has a demo. |
| 4 | Motor Control: Fitts, Hick | Target size and choice time; every button you ever place. Two demos. |
| 6 | Frameworks: Action Cycle and the Gulfs | The most useful analytic frame in the course — it turns "feels confusing" into a located fault. |
| 7 | Affordances, Signifiers, Constraints, Mapping, Feedback | The working vocabulary of the job. Has a demo. |
| 9 | Discoverability, Information Scent, Progressive Disclosure | Directly drives IA and navigation decisions. |
| 10 | Cognitive Load in Interface Design | The justification you give for removing things. |
| 12 | Inspection Methods: Heuristics, Walkthroughs | You will be asked to run a heuristic review. |
| 13 | Empirical Evaluation: User Testing | Week 4's "design reviews, stakeholder requirements" needs this to be more than opinion. |
| 15 | Information Architecture | Pairs with components and slots — structure before surface. |
| 16 | Visual Design: Gestalt, Typography, Hierarchy | Direct partner to Figma Part IV. |
| 17 | Accessibility and Inclusive Design | Marked Essential by the plan; the Figma syllabus flagged it as a hole. |
| 21 | Behavioural Economics, Dark Patterns, Ethics | What separates a product designer from a conversion optimiser. Scaffold's own no-streak position cites it. |
| 24 | Mobile and Touch Interaction | Every product is mobile; pairs with the 44px coarse-pointer rule. |

### AI elective — 4 chapters, switchable

Not core to "product designer," core to *you* — you are Recruitment's AI referent, and Figma Part VIII
is literally about working with an agent.

| # | Chapter | Why |
| --- | --- | --- |
| 28 | Mixed-Initiative Interaction and Human Oversight | The frame for any feature where the system acts. |
| 29 | Trust, Reliance, Automation Bias, Explanation | The bridge chapter — its reliance demo and the Figma agent material are the same problem. |
| 38 | Patterns for AI-First Products | The pattern library. |
| 39 | Error Recovery, Confidence, Onboarding | What you ship when the model is wrong. |

### Cut — 25 chapters, and why

- **1 History of HCI, 27 History of Intelligent Interfaces** — context, not capability. Being chapter
  one is not the same as being load-bearing.
- **5 Human Error / Cognition in the Wild** — valuable, but its actionable half is already inside 6 and
  21. Distributed cognition is a research frame, not a design move.
- **8 Direct Manipulation and Interaction Paradigms** — historical framing; the usable part lives in 7.
- **11 Usability: Definitions, Standards, Metrics** — needed to *run* a usability programme; 12 and 13
  give you the practice.
- **14 Qualitative and Field Methods** — research craft. You will partner with researchers, not run
  ethnography.
- **18 Data Visualization** — genuinely excellent, and its encoding demo is the best in the course, but
  dataviz is a specialism. **Second elective if you want it, not core.**
- **19 Physical Ergonomics, 20 Safety-Critical Interfaces** — hardware and aviation/medical. Not your
  domain.
- **22 CSCW, 23 Social Computing** — relevant only when the product is collaborative or social.
- **25 Wearables, 26 Voice/AR/VR/Tangible** — emerging-platform survey; read when a brief demands one.
- **30 Personalization, 31 AI-Assisted Creativity** — narrower than 38/39 for the same effort.
- **32–36 Human–LLM Interaction** (5 chapters) — a specialism, and a good one, but it is a second
  course rather than a prerequisite for using Figma well.
- **37 Why Designing With AI Is Different** — its argument is carried by 38 and 39 in applied form.
- **A1, A2, B appendices** — reference, not curriculum. **Keep them in the course, unscheduled** — they
  should be readable without entering the Leitner queue, which the engine does not currently support.

### Promoted out

- **40 Capstone — Design an AI-Native Product End-to-End** becomes the **path's final project**, not a
  chapter. It is week 4 of the 30-day plan: an organised file, a design system, a prototype and a
  short case study, judged by whether another designer could pick it up. Which, as below, nothing can
  score.

**Net: 18 chapters of HCI (14 + 4) against 34 of Figma.** The ratio is deliberate — Figma is the thing
you are short of, HCI is the thing that makes your Figma decisions defensible.

---

## 7. What changes in `src/scaffold/`

Honest about where the engine generalises and where it resists.

**Generalises cleanly:**
- `store.js` — the Leitner machinery is kind-agnostic. Adding `BUILD_INTERVALS` and a per-kind lookup
  in `grade()` is additive.
- `course.js` — the derived catalog already reads whatever a course package exports; a `builds` array
  needs no framework knowledge.
- `BackupControls` / `readBackup` — the validator already coerces per-field; new fields extend it.

**Needs real work:**
- `grade(progress, id, correct, confidence)` → accept a test vector for build items, advance the box
  only on a clean sweep, and record which test failed. **Cheaper than it looks:** there is exactly one
  call site (`App.jsx:37`), threaded downward as the `onGrade` / `onGraded` prop. The signature change
  is one function plus the components that pass it.
- `session.js` — a second session type with its own `SPLIT`, counts and caps. `buildSession()` currently
  assumes one shape; this becomes a branch, not a parameter.
- `components/` — a new `BuildItem` (brief, clock, test checklist, report) and a `build` tab in
  `LessonView`. `RecallItem` is not the right component and should not be bent into one.
- Content schema — a `builds: [...]` array beside `cards` and `quiz`, with `prompt`, `minutes`,
  `reference` and `tests: [{ id, claim }]`; plus an `exact: [...]` array per §2a with `prompt`,
  `accept: [...]` and `note`. Both documented in `AUTHORING.md`.
- `RecallItem` — add the reveal-as-check step (§2a.2) and the binary confirm (§2a.3). This is the
  cheapest real improvement in the whole proposal and it benefits the **existing** HCI course too, not
  just the new one.

**Resists, and should be said out loud:**
- **Cross-course progress — and it is deeper than the storage layer.** `load()`, `save()` and
  `reset()` resolve the storage key through `activeCourseId()`. But `dueItems()` and `overallStats()`
  reach it *indirectly*, through `allItems()` in `course.js` — so the single-course assumption lives
  in the **catalog**, not just in storage. A path spanning two courses means `course.js` has to be
  able to answer "all items across these course ids," which it currently cannot. This is the one
  genuine architectural addition, and it is a layer lower than I first estimated.
- **Unscheduled reference chapters.** The appendices should be readable without entering the queue.
  Every lesson's items currently enter it. Needs a `reference: true` flag the scheduler respects.

---

## 8. Three things this proposal refuses to fake

1. **The app still cannot verify anything.** Nothing here changes that. What changes is that it stops
   asking questions whose honest answer is unknowable and starts asking questions whose honest answer
   is cheap — *did it break, yes or no.* That is a smaller claim than "assessment" and it is the true
   one.

2. **Week 4 has no objective test.** Judgement, stakeholder negotiation and design critique are the
   difference between a competent Figma operator and a product designer, and the 30-day plan concedes
   it: *"actual professional competence also requires feedback, collaboration and repeated projects."*
   A single-player app supplies none of those. The course should say so on the screen rather than
   award a percentage for it — which is the same position Scaffold already takes on streaks.

3. **The interval ladder is a guess.** Marked as such in §4 and worth re-deriving from your own
   pass/fail data after a month, rather than inheriting from me.

---

## 9. What I need from you before writing anything

1. **The cut list** — 14 core + 4 AI elective, or do you want 18 and 32–36 back?
2. **Two packages, one path** — agreed, or do you want one merged course?
3. **`BUILD_INTERVALS = [0, 2, 9, 30]` and three repetitions to mastery** — sane starting point?
4. ~~**The build session's 59% out-of-app block**~~ — **answered: yes.** You are willing to work with
   the app open, so the build session type stands as specified in §3 and the weaker
   fill-in-afterwards fallback is dropped.

Questions 1–3 remain open. §2a is decided unless you disagree with it.
