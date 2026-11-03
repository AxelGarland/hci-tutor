# Figma in Practice
## From layout mechanics to the code boundary

A syllabus for a second Scaffold course.

---

## What changed, and why this is version two

The first draft of this syllabus was built only from ten Figma videos. It had **six chapters on
motion and none at all on auto layout**. That was not a judgement about what matters — it was an
accident of which ten videos happened to be in the list.

Three sources now disagree with that shape, and they agree with each other:

- **Your own Learning Path doc** puts auto layout, components, variables and prototyping in "Stage 2
  — Core pro skills", and files Figma Motion under **"Optional extras."**
- **The ChatGPT plan** marks auto layout, components/variants, variables, prototyping, responsive/
  accessibility as **Essential**, handoff and AI-assisted work as **Important**, and advanced
  animation as **Later**.
- **Figma's own Components collection** is tagged *Beginner friendly* and leads with components and
  instances, which means Figma treats it as foundation, not advanced craft.

So the syllabus is reordered by what makes someone employable, not by what was easiest to source.
Motion keeps its depth — the material is genuinely good — but it moves from Part II to Part VI.

The ChatGPT input's framing of the goal is the sharpest thing in any of these sources, and the
course is built to deliver it:

> "The biggest difference between someone who knows Figma and someone who can work professionally in
> Figma is that the professional builds systems instead of isolated screens."

Its success test is the one every Part is written against: change the spacing tokens, resize the
frame, swap component states and update the colour theme — **without manually rebuilding anything.**

---

## Sources, and what each can carry

Three kinds, with different reliability. Every chapter cites which one it came from.

**1. Figma Help Center articles** — authoritative and current. Fetched 2026-11-03, all HTTP 200.
These are the backbone for anything mechanical, because they state exact behaviour, limits and plan
restrictions. Preferred over video for anything UI-specific.

| Article | What it carries |
| --- | --- |
| Guide to auto layout in Figma | Flows, padding/gap, hug/fill/fixed, min/max, ignore, nesting, constraint interactions, shortcuts |
| Components collection | 5 units · **14 chapters · 105 minutes** · *Beginner friendly* |
| Guide to variables in Figma | Three uses, plan restrictions, the sub-article tree |
| Create an onboarding flow with advanced prototyping | **Advanced · 30 minutes** — a complete worked conditional prototype |

**MDN Web Docs**, for the CSS side of the vocabulary. Figma's own auto layout guide only makes one
cross-reference — that ignore auto layout works "much like absolute position in CSS" — so the rest of
the mapping is quoted from MDN rather than asserted: `justify-content` (space-between / around /
evenly), *Basic concepts of flexbox* (main and cross axis, flex container and items, flex line,
`flex-direction`, `flex-wrap`), `width` (`fit-content`, `max-content`, `min-content`) and `position`
(`absolute`, containing block, normal document flow). Fetched 2026-11-03, all HTTP 200.

**W3C / WCAG 2.2 Understanding documents**, for the only normative numbers in the course: SC 2.5.8
Target Size (Minimum, AA, 24×24 CSS px), SC 2.5.5 Target Size (Enhanced, AAA, 44×44), SC 1.4.3
Contrast (Minimum, AA, 4.5:1 and 3:1) and SC 1.4.11 Non-text Contrast (AA, 3:1). Fetched 2026-11-03,
all HTTP 200.

**Apple HIG and Material Design**, for tier-two platform guidance, both read through the browser
because their pages render via JavaScript and returned empty bodies to a plain fetch. Two findings
are themselves course content:

- **Material's wording is advisory**: "For most platforms, consider making touch targets at least
  48 x 48dp." It also supplies the line "Note: iOS recommends 44 x 44dp targets."
- **Apple's own 44 could not be found.** Searching the current HIG pages for Layout, Accessibility
  and Buttons, the only 44 is a visionOS button size token, "Regular (44 pt)", one of five sizes. No
  minimum tap target is stated on any of those three pages. The most-repeated number in mobile design
  reaches this course through *Google's* documentation. It may be stated elsewhere in Apple's
  materials; the chapter says exactly that rather than asserting either way.
- **Material's Grids & spacing page states no spacing value at all**, describing spacing instead as
  shaping "the personality of a product" — which is the strongest available evidence that the 8-point
  grid is a convention rather than a standard.

**Why the mapping is in the course at all.** A product designer is judged on naming in three rooms —
the tool's own panel, the design review, and the conversation with a developer — and the three rooms
use different words for one idea. Teaching only Figma's word produces someone fluent in Figma and mute
everywhere else. The `terms` reading block carries both names; see `AUTHORING.md`.

**One honest gap:** MDN's *Basic concepts of flexbox* article does not mention `gap`, `row-gap` or
`column-gap` at all — they live in a separate Gaps guide that has not been fetched. The course states
that Figma and CSS use the same word, which is observable, and claims nothing further.

**2. YouTube captions** — nine transcripts saved under `sources/figma-videos/`, captured from
YouTube's own transcript panel. I cannot watch video, so these are the spoken audio of screen
recordings: concepts, rationale and numbers are in them; click paths are not. Usable word counts,
measured:

| Video | Words | Role |
| --- | --- | --- |
| Figma for Edu: Working with typography systems | 9,996 | Backbone of Part IV |
| Figma for Edu: Prototyping with animations | 12,149 | Backbone of Part VI |
| Source Material — Aitana Picó | 1,508 | Appendix |
| Code to Canvas: Claude Code | 1,412 | Part VII |
| How to make the most of the Figma agent | 1,083 | Part VIII |
| Figma Motion basics: Custom animation styles | 279 | One chapter |
| Setup the Figma GitHub app | 154 — only 35% captioned | One note |
| Source Material — Ben Ganz | 193 — only 12% captioned | Reading list entry |
| lo-fi beats and shader animations | 12 — 1% captioned | **Unusable: a music video** |
| Figma Make, now on your local code | 0 — no captions published | **Unusable** |

**3. Curriculum opinion** — your Learning Path doc and the ChatGPT plan. These set *order and
emphasis*, not facts. Where they make factual claims I checked them:

- *"14 chapters, approximately 105 minutes"* for the Components collection — **confirmed.** The page
  states exactly that, plus "Beginner friendly."
- *"A 30-minute guided project"* for advanced prototyping — **confirmed**, though the page's word is
  "Length", beside "Difficulty: Advanced."
- The Learning Path's per-video durations for the beginners course were taken as given; I did not
  re-time fifteen videos.

**One flag.** The auto layout article lists the ignore-auto-layout drag modifier as `Control` on Mac
and **`S` on Windows**. That is what the page says and it looks wrong. Verify in the app before it
goes in a chapter.

**Standing caveat.** Figma ships constantly. Motion is beta; library easing variables were not yet
applicable to prototype transitions; Lottie export is "coming." Concepts will hold, specific panels
will not.

---

## Shape

Eight modules, 31 chapters, one appendix.

```
I     Layout that holds              6 chapters   auto layout + which numbers are real
II    Components                     5 chapters   instances, variants, properties, slots, libraries
III   Variables and design tokens    4 chapters   collections, modes, aliases, scoping
IV    Type as a system               5 chapters   the typography workshop
V     Prototyping                    4 chapters   flows, conditionals, expressions
VI    Motion                         5 chapters   the motion workshop
VII   Handoff and the code boundary  3 chapters   dev mode, MCP, Make
VIII  Working with the agent         3 chapters   credits, skills, plugins
A     Source Material                1 deck
```

---

## Part I — Layout that holds
*Source: Guide to auto layout in Figma. Entirely absent from version one.*

### 1. Flows, and picking the right one
Vertical, horizontal and **grid**. Figma guesses a flow on application and it can be switched at any
time. Horizontal and vertical support **wrap** — horizontal wraps to a new row, vertical to a new
column, and the article is explicit that **"Vertical wrap is not a masonry layout."** Grid behaves
differently: *"objects in a grid don't wrap to the next line"*, and grid children can span rows or
columns.
*Available on all plans; requires edit access. In Slides and Buzz it needs a Full seat.*

### 2. Padding and gap
Padding is the space between a parent frame's edge and its contents — uniform, per-axis, or per side.
Gap takes a number, or **Auto** with the distribution options *Between*, *Around* and *Evenly*. Both
accept number variables, which is the hinge connecting this Part to Part III.

### 3. Hug, fill, fixed — and min/max
The resizing property applied independently on each axis:

| Setting | Applies to | Behaviour |
| --- | --- | --- |
| Hug contents | Auto layout frames | Resizes to its children |
| Fill container | Children of auto layout frames | Fills available space |
| Fixed | Both | Stays put |
| Min width/height | Both | At least this |
| Max width/height | Both | At most this |

Worked example from the article: a 40px text layer with 10px left and right padding gives a 60px
frame; grow the text to 50px and the frame becomes 70px. Min and max combine with the other settings
and are added and removed explicitly.

**The chapter's success test is ChatGPT's:** change a button's label or resize the frame, and
everything reflows without manual repair.

### 4. Ignore, nest, and the constraint rule
**Ignore auto layout** "was formerly known as absolute position" and works *"much like absolute
position in CSS."* Nesting places auto layout frames inside one another, each keeping its own padding
and gap.

The rule worth memorising, quoted: **"You can't apply constraints to child objects in an auto layout
frame, unless the object ignores the auto layout flow."** An auto layout frame nested inside a plain
frame *can* take constraints.

### 5. Where auto layout meets everything else
The friction points the article documents, which is where real files break:

- **Components** — *"You will need to add auto layout to each component individually. There isn't
  currently a way to add auto layout in bulk."* Instances may adjust padding and gap but cannot
  reorder, add or truly delete layers — deleting only hides.
- **Prototypes** — smart animate *"do not take into account the background of a frame"*; scroll
  overflow needs content past the frame bounds.
- **Text** — *"Text layers cannot have both a max height and a set number of max lines."* Setting one
  clears the other. And the article *"advise[s] against using fixed size text boxes"* in fluid layouts.

Plus the shortcut set: `Shift A` to add, `Opt Shift A` to remove, `W/A/S/D` for edge alignment in the
alignment box, `X` to toggle gap-between, `Opt`-drag for opposite-side padding, double-click an edge
for hug and `Opt`-double-click for fill.

---

## Part II — Components
*Sources: Figma's Components collection (14 chapters · 105 min · Beginner friendly); your Learning Path Stage 1 and Stage 2.*

Figma's own unit order is good and this Part follows it rather than inventing one.

### 6. Components and instances
Components fundamentals and nesting instances. Figma's own pacing: 4m + 3m of concept, then a
**7-minute project building a simple button** — which your Learning Path also reaches via *Create the
button* (10:23) and *Components fundamentals* (5:07).

### 7. Properties and variants
Component property fundamentals and variants/component sets. The collection spends **20 minutes** on
building a tooltip component set, which signals where the difficulty actually is: not in knowing what
a variant is, but in modelling a set that stays coherent.

### 8. Slots
A newer feature, and the collection gives it 3 minutes of concept plus a **25-minute** project
building a reusable list component — its longest. Your Learning Path lists two videos on it,
*Getting started with Slots* and *Create flexible components with Slots*.

### 9. Interactive components
Fundamentals plus a 20-minute project designing an interactive button. This is the bridge into Part
V — interactive components are how a prototype stops needing one frame per state.

### 10. Libraries and component management
Library fundamentals, then **11 minutes of "Tips for component management"** — the longest non-project
chapter in the collection, which is itself the lesson: maintaining a component set is harder than
making one.

---

## Part III — Variables and design tokens
*Sources: Guide to variables in Figma; typography workshop (video 5).*

### 11. What variables are for
Variables *"store reusable values that can be applied to all kinds of design properties and prototyping
actions."* Three uses, in Figma's own order: **designs and design systems**, **advanced prototyping**,
and the **APIs** (REST, plugin, widget — with the limitation that *"widget properties cannot be bound
to variables"*).

**Plan restrictions matter here and should be stated plainly:** the feature is on all plans, but
*publishing variables to team libraries* and *using variables in prototypes* both require
Professional, Education, Organization, Government or Enterprise.

### 12. Collections, groups and the five types
Colour, number, string, boolean, timing. A font family is a string, a size or line height a number, a
weight either — and expressed numerically it gives, in the workshop's phrase, "a little bit extra
parity." Binding is what makes a value live: change the variable, every bound node updates.
*→ video 5, 11:01–19:06*

### 13. Modes and inheritance
Modes drive brand switching, light/dark, responsive sizing and font-pairing trials. **Up to 10 modes
per collection**; the starter plan allows one. Inheritance runs **canvas → frame → object**, and an
object reading "auto" is inheriting — overridable locally. This is what makes a system *testable*:
swap the mode and see whether the layout survives.
*→ video 5, 6:22–7:09, 19:06–19:20, 33:40–34:43*

### 14. Aliases
A variable pointing at another variable. One base font variable referenced by every size group turns
a brand change into a single edit. The workshop's own framing: *"the skill here is understanding the
value of the inheritance."* Pairs with the article *The difference between variables and styles*.
*→ video 5, 37:06–39:55*

---

## Part IV — Type as a system
*Source: typography workshop (video 5, 58 min, fully captioned). The deepest single source.*

### 15. A scale is a constraint, not a palette
A scale exists to **remove** options, so nobody decides between 64pt and 65pt. Introduces **design
system consumer vs author**. The scale already in the font picker is curated: 10, 11, 12, 13, 14, 15,
16, 20, 24, 32, 36, 40, 48, 64, 96, 128 — +1 steps to 16, then +4, then +8, then larger. Fine steps
where the eye is sensitive.
*→ 0:48–2:30, 11:46–12:46*

### 16. What a text style is made of
Family, size, line height, weight, letter spacing, and **purpose of use** treated as a property like
the rest. Then the details most courses skip: **vertical trim** (a CSS trait collapsing the line box
so text sits predictably in buttons and auto layout), **hanging punctuation** (quotes in the margin so
multi-line text aligns — on by default, per the presenter), paragraph spacing and indent, wrap style,
stylistic alternates.

**Measure** is named as the width of the body of type. *The workshop promises a formula for it and
never gives one.* The chapter says so rather than inventing one.
*→ 1:39–2:08, 4:39–4:53, 22:17–25:51*

### 17. Weight, cascade and variable fonts
100 thin, 400 normal, ~500 semi-bold, 600 bold, 900 black. Weights **cascade** — ask for one the family
lacks and Figma picks the nearest. Variable fonts expose in-between values through their axes, which
is why the workshop reaches for them when a weight is missing.
*→ 17:31–18:30, 31:49–32:20*

### 18. Composite styles
A style bundles bound variables into one applicable thing. **Four dots always mean a style.** Editable
from the file that created them, publishable, usable in Slides decks. Front-loaded cost, repaid on
every application.
*→ 7:09–8:33, 25:51–27:22*

### 19. How text boxes behave
**Auto width** for single lines, **auto height** for paragraphs, **fixed** for truncation. The rule of
thumb: auto height 99% of the time — which lines up with the auto layout article advising against
fixed-size text boxes in fluid layouts.
*→ 28:47–29:15*

---

## Part V — Prototyping
*Sources: Create an onboarding flow with advanced prototyping (Advanced · 30 min); prototyping workshop (video 7).*

### 20. Triggers and flows
On click, on drag, while hovering, while pressing, mouse enter, mouse leave, after delay. A noodle
between frames is an interaction.

The argument the Part rests on, from the workshop: people say prototypes are obsolete now you can
build the real thing, but **"everything you produce in Figma is context"** — and explaining a
multi-part transition in prose means *"I'm gonna be there all day."*
*→ video 7, 18:52–19:53*

### 21. State without frames
The core of the help article's worked example, and the chapter that earns the whole Part. Four
booleans (`hasMusic`, `hasFood`, `hasDesign`, `hasNews`, default `False`) bound to topic instances and
to the podcast cards' visibility. A number variable `topicsSelected` incremented by `topicsSelected +
1`. The payoff Figma states: *high-fidelity prototypes using **fewer frames***.

### 22. Conditionals and expressions
A string variable `buttonState` (default `disabled`) assigned to a `state` variant property, with the
constraint the article warns about in bold: **"Your string variable value needs to match the variant
property value for the prototype interactions to work."**

Enable on `topicsSelected > 0` → set `buttonState` to `"enabled"`; disable on `topicsSelected < 1`.
Test with `Shift Space` for inline preview.

### 23. Smart animate
Diffs properties between two frames and animates all of them at once, which makes **naming
consistency load-bearing**. Field notes from the workshop: turn **off** "play motion animations" on the
transition or it will not hand over cleanly; tune the delay to just past the intro; if preview
misbehaves use Present mode, and sometimes it just needs a refresh.
*→ video 7, 30:48–34:01, 44:08–45:02*

---

## Part VI — Motion
*Sources: prototyping workshop (video 7); custom animation styles (video 6). **Demoted from Part II** — both advisors rank this later.*

### 24. Keyframes and interpolation
All motion begins with a single frame; animation is *"just an expression of properties over time"* —
X, Y, size, opacity, fill. Stamp, move the playhead, stamp again, Figma interpolates. Typed values in
milliseconds or seconds.
*→ 2:25–6:03*

### 25. Easing
Linear is for constant motion only — something continuously spinning. Everything else wants a curve.
Easing stores as a **timing variable** (the workshop builds roughly `0.8, 0, 0.2, 1`) and
ease-in-out-**back** overshoots for a build-in.
*→ 6:29–8:10, 25:26–25:41*

### 26. Timeline craft
Copy keyframes between objects; **stagger** them (*overlapping animation*); drag the track endpoint to
extend everything beneath; **loop track** to proliferate ghost keyframes; loop / once / **ping-pong**;
`J` and `K` between visible keyframes. Stated limit: no "three loops max" setting — loop track is the
workaround.
*→ 10:07–14:37, 26:03–28:42*

### 27. Custom animation styles
A reusable motion language built from preset animations, able to use timing and easing variables so
motion matches the design system. Named, described, individual animations hideable or removable,
publishable to a library on paid plans like text and effect styles — and referenceable in agent
prompts and skills.
*→ video 6, 0:00–1:39*

### 28. Getting motion out
**MP4** for video. **WebM** honours transparency — the workshop's deep cut is hiding a frame's fill,
exporting WebM, and re-importing a transparent video into Figma. **Animated GIF** is heavy, a format
that *"hasn't been updated since 1986."* **Animated SVG** is supported but complexity may alter
visuals. Dev mode opens a frame in **timeline view** and hands over CSS or React per layer.
**Lottie is named as coming, not shipped.**
*→ 15:42–18:37, 55:47–56:28*

---

## Part VII — Handoff and the code boundary
*Sources: Code to Canvas (video 10); prototyping workshop; GitHub app (video 1); Learning Path Stage 3.*

### 29. Dev mode and annotations
Dev mode, specs, and the `Y` key for annotations with a category of interaction. The reason
annotations matter: **they travel with the frame** to Make or an LLM. Figma has no declarative
scroll-driven animation, but an annotation saying "when scrolling to this section, perform the
embedded animation" carries the intent across.
*→ video 7, 56:28–58:07*

### 30. MCP and the round trip
Enabling Figma MCP in Claude Code via `/plugin` or the documented command, then authenticating in the
browser. The round trip: run the app locally, ask the agent to send it to a named Figma file, and
**real Figma layers arrive — frames, with auto layout applied.** Back the other way, `Cmd L` copies a
link to a selection and the agent updates the code to match.
*→ video 10, 0:49–7:50*

### 31. Prototype to Figma Make
Send to Make from prototype mode (it spends credits). Interactions and transitions travel because the
frames were wired rather than static. The working method, stated plainly: **section by section.**
*"I don't give it a massive prototype and say, 'Just build this.'"*
*→ video 7, 45:02–47:09, 52:05–53:42*

**Admin note, not a chapter.** Video 1 is captioned for one minute: connect a Figma org to a GitHub
org, authorise all or selected repositories, audit via the activity log, and note that non-GitHub-
admins take different final steps. Enough for a sidebar; not enough for the version-control Part it
looks like it should anchor.

---

## Part VIII — Working with the agent
*Source: agent best practices (video 3); typography workshop.*

### 32. Prompting and credits
Scope, requirements and expectations up front. *"Design a settings page"* versus *"Design a
mobile-first settings page with sections for account, notifications and billing, and use our existing
sidebar navigation pattern."* Open-ended tasks cost more because the agent must reason and explore.
Context hygiene: only what the task needs, and **watch for redundancy** — information in a skill, a
connected file and the prompt is processed three times. Long chats carry their whole history.

The honest part: *"even the same prompt can vary in cost from one run to the next. There's no way to
guarantee the cost of a prompt ahead of time."*
*→ video 3, 0:02–5:20*

### 33. Skills versus plugins
**Skills** supply reusable context so standards need not be re-explained — for work that needs
reasoning within guidelines. **Generative plugins** define repeatable logic up front: building one
costs credits, **every run afterwards costs zero**. For deterministic jobs — auditing unused
variables, flagging unnamed layers, applying naming conventions. And ask **Fig** product questions
free rather than spending agent credits.
*→ video 3, 2:32–4:28*

### 34. The agent against a design system
What the workshop asked for and got: eight sizes from a base font, variables per size, a scale ratio
(it offered minor third — *"balanced, versatile for most projects"*), composite styles, and a specimen
generated on canvas with variables bound. Plus **critique** — on a slide it returned 14px detail text
too small, dense body text, a hierarchy jump, a weak subheadline, low contrast.

Two things that must survive into the chapter. Output is **indeterminate** — *"it gives you something
that you can then build off of."* And it gets things wrong: the font family and weight were not bound
until the presenter noticed and asked again.

> "Sometimes you need to correct it on its work. That's gonna be a thing that you need to do,
> unfortunately. But you need to be mindful, you need to be thinking about it, you need to engage
> with it, you need to critique it."

*→ 40:02–47:52, 51:05–51:49, 55:44–57:50*

---

## Appendix A — Source Material
*Source: Aitana Picó (video 8, fully captioned, 1,508 words).*

Where a visual identity comes from. Inspiration, not technique, and the appendix should say so.
Ben Ganz (video 4) is captioned for one minute — Warhol's *Index* pop-up book, a David Byrne title —
which is a reading-list entry, not a chapter.

---

## The 30-day plan, mapped

The ChatGPT schedule is sound and maps cleanly onto the Parts. Its own caveat is worth keeping
visible: *"This is an aggressive plan. It should get you to practical fluency, not make you an expert."*

| Week | Focus | Parts | Figma's own time | Success test |
| --- | --- | --- | --- | --- |
| 1 | Auto layout | I | Auto layout guide + *Create a responsive card* project | Resize a frame or retitle a button; nothing breaks |
| 2 | Design system | II, III, IV | Components collection — **105 min across 14 chapters** | Edit one main component; changes propagate |
| 3 | Flows and prototyping | V | Onboarding flow — **Advanced · 30 min** | A stranger completes the task unaided |
| 4 | Work like a product designer | VII, and Part VI if time | — | Another designer or developer can pick up the file |

Note the asymmetry: **weeks 1–3 are mechanics with objective success tests; week 4 is judgement and
has none.** The plan admits this — *"actual professional competence also requires feedback,
collaboration and repeated projects"* — and a course cannot supply those. Worth stating in the course
rather than implying otherwise.

Two things the 20/80 split implies for Scaffold's own format: a course where 80% is meant to be
*building* needs exercises as first-class content, not reading with a quiz bolted on. The HCI
course's `exercise` block already exists; this course should lean on it much harder.

---

## What this syllabus still cannot contain

Naming holes is the rule that went into `AUTHORING.md` after a previous course was deleted for having
untraceable content.

- **Shader animations.** Video 2 is a design-along with 12 words of caption. Figma shaders may deserve
  a module; nothing here sources one.
- **Figma Make in depth.** Video 9 publishes no captions, and *Intro to Figma Make* from your Learning
  Path has not been transcribed. Make appears only where the prototyping workshop demonstrates it.
- **Responsive and accessibility as its own Part.** ChatGPT marks it Essential and it deserves to be
  one. What exists here is scattered — contrast checking and AA/AAA from the typography workshop,
  modes for high-contrast, motion variables for reduced motion, Figma's own accessibility settings.
  Enough for a chapter, not a Part. Figma's accessibility docs would close it.
- **Grid in depth.** Named in the auto layout article and in two Learning Path videos; not yet sourced
  beyond the article's summary.
- **Anything visual the narration never names.** Panel locations and click paths are not in captions
  and are not invented here.

## Closing the gaps

Everything above is one fetch away. The Figma Help Center answered cleanly today, and the sub-article
trees are already mapped: *Overview of variables, collections, and modes*, *Modes for variables*,
*The difference between variables and styles*, *Use expressions in prototypes*, *Multiple actions and
conditionals*, *Variables in Dev Mode*, plus the auto layout projects and the two mini-projects
(*Create a responsive card*, *Create a loading animation*). Say which gaps matter and I will pull them
and extend the affected Parts, citing pages the way this cites timestamps.

## Next step

This is the structure, not the course. Building it as a Scaffold package means `src/courses/figma/`
with modules, reading, flashcards, quiz items, exercises and any demos. Worth your sign-off on the
eight-module split and the reordering — especially moving motion from second to sixth — before I write
the reading against it.
