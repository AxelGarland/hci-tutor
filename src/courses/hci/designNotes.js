/**
 * Why this interface is shaped the way it is, chapter by chapter.
 *
 * These used to be small numbered markers scattered through the working screens.
 * They are collected on one page now — an app that annotates itself in the margin
 * of every view is harder to use than one that keeps its reasoning in a colophon.
 *
 * Every entry has to be an honest citation — the chapter must actually justify the
 * decision. Where the research sits slightly outside the book, the note says so
 * rather than borrowing authority the chapter does not give.
 */
export const NOTES = {
  timer: {
    title: 'The clock',
    lesson: 'ch25',
    note: 'The clock is a thin rule you can glance at, not a countdown that pulses and turns red. Calm technology puts information in the periphery until it needs the centre. Chapter 2 reaches the same conclusion from the other direction: motion is reserved for genuinely urgent events, and the pop-out budget belongs to the material, not the furniture. On a narrow screen the rule pins to the top of the column, because a chapter is a dozen screens on a phone and a clock you have to scroll back to find is not in the periphery at all — it is absent, and so is the notice that the phase has run out.',
  },
  softStop: {
    title: 'Soft stop, not hard',
    lesson: 'ch12',
    note: 'Time runs out but nothing is snatched away mid-item. Shneiderman\'s golden rules ask for an internal locus of control — the user initiates, the system responds. A timer that interrupts you mid-answer inverts that for no learning benefit.',
  },
  recall: {
    title: 'Commit before the reveal',
    lesson: 'ch29',
    note: 'You commit to an answer before seeing the real one. This is Buçinca\'s cognitive forcing function, which the trust chapter presents as a way to stop people rubber-stamping AI output — and the same mechanism produces the generation effect in memory. It works, and users dislike it. Both halves are the point.',
  },
  confidence: {
    title: 'The confidence wager',
    lesson: 'ch29',
    note: 'Marking certainty before the reveal turns the session into a calibration exercise. The chapter\'s argument is that raw acceptance cannot distinguish trusting-when-right from trusting-when-wrong. The same holds for you: an item missed while you were sure is a real gap, and an item missed on a guess is not.',
  },
  splitScore: {
    title: 'Two scores that never merge',
    lesson: 'ch36',
    note: 'The just-studied score and the older-material score never get merged. A test taken immediately after reading measures fluency and will always look good — a metric that cannot fail. The delayed score is the one carrying information about whether anything stuck.',
  },
  warmup: {
    title: 'Warm-up before reading',
    lesson: 'ch03',
    note: 'Retrieval comes before reading, not only after it. Attempting to recall something before you study it improves later encoding even when the attempt fails. The pretesting effect is not named in this chapter, but the memory constraints that make it work are exactly the ones described here.',
  },
  reviewGate: {
    title: 'The review gate',
    lesson: 'ch10',
    note: 'Past a threshold of overdue reviews the session stops introducing new material. An unbounded backlog is pure extraneous load: it makes every session worse without making any of them more informative, and it is the specific failure that ends most spaced-repetition habits.',
  },
  expectations: {
    title: 'The session, stated up front',
    lesson: 'ch39',
    note: 'The session tells you its shape before it starts rather than advertising how effective it is. Expectation calibration beats capability advertising — Kocielnik\'s finding for AI features applies just as well to a study tool asking for twenty minutes of your attention.',
  },
  coursePackages: {
    title: 'Courses as packages',
    lesson: 'ch15',
    note: 'A course is a folder, not a config file: content, demos and these notes ship together under courses/<id>/. That is an information-architecture decision as much as an engineering one — the boundary an author has to understand is "one course, one directory", and the framework only knows the shape of the manifest. Chunking decisions that users never see still determine what can be found and changed, which is this chapter\'s point applied to a repository.',
  },
  homeEntry: {
    title: 'The chapter index',
    lesson: 'ch09',
    note: 'A blank entry point emits no information scent — nothing on it predicts what following a path will pay off. So the home screen leads with what the thing contains (43 chapters, 314 items, 7 demos) and puts the index one click away rather than behind navigation you have to learn. The chapter rows carry item counts and mastery inline for the same reason: scent on the label, not just a title.',
  },
  accent: {
    title: 'The palette',
    lesson: 'ch17',
    note: 'Three primaries, each with a rule attached. Cobalt is the workhorse: paper on it measures 8.27:1, so it can carry a full field, an active state or a heading. Yellow is a ground for black marks only — ink on it is 12.0:1, white on it is 1.57:1 and appears nowhere. Signal red is reserved for the wrong-while-certain rail and the contested badge. None of the three ever carries a state on its own: every badge spells out its level, every verdict is named in words, and the mastery meter states its percentage beside the bar. The design earlier removed colour entirely and justified it here, which was a misreading of this chapter — the criterion forbids colour as the only channel, not colour. With the words already doing the work, the hue is free.',
  },
  mobileSurface: {
    title: 'What the phone is for',
    lesson: 'ch39',
    note: 'Mobile is a review-and-reading surface, not a full study surface, and it says so instead of pretending parity. The study session\'s core mechanic is free recall — type the answer from nothing, then write a paragraph — which is the one thing a phone is worst at. Reviews are the opposite: short, tappable, and dependent on frequency, which is exactly what a phone supplies. Nothing is blocked; the session is one tap away on any device. Expectation calibration beats capability advertising, so the screen states what it is good for rather than letting you discover it mid-session.',
  },
  popOut: {
    title: 'One filled element',
    lesson: 'ch02',
    note: 'Exactly one element in this sidebar is filled solid: the primary action. Preattentive pop-out works on uniqueness, so three heavy blocks stacked together produce no pop-out at all — the search goes serial and the emphasis buys nothing. Everything secondary is a hairline outline, which keeps the budget of one spendable. In a greyscale design the singleton is carried by fill rather than hue.',
  },
  contrast: {
    title: 'Contrast and target size',
    lesson: 'ch17',
    note: 'Secondary text used to be the main text faded with opacity, which measured about 3.7:1 against this background and failed the 4.5:1 minimum at the small sizes it was used. It is now a measured token at 7.34:1. Every text node in every view is checked against its composited background, which is how the one real failure in the colour revamp was caught: the wordmark asterisk had been set in yellow on paper at 1.51:1, and it now inverts with its ground. Verdicts are named in words rather than signalled by hue, the two grading buttons are red and blue rather than red and green because that pair survives the common colour vision deficiency, and controls smaller than 24 by 24 pixels carry an invisible hit area that meets the target-size rule without changing how they are drawn.',
  },
  demoTargets: {
    title: 'The Fitts demo exception',
    lesson: 'ch04',
    note: 'A named conflict. The accessibility chapter sets a 24 by 24 pixel minimum for targets; this demo deliberately draws them as small as 18 pixels, because a Fitts\'s law demonstration that never presents a difficult target cannot demonstrate anything — the index of difficulty would barely move. The exception is confined to the demo surface, the targets are keyboard-reachable, and no task in the app depends on hitting one. Every other control in the app meets the minimum.',
  },
  noStreak: {
    title: 'No streaks',
    lesson: 'ch21',
    note: 'There is deliberately no streak counter here, and nothing says "don\'t break your run". That is loss aversion deployed as a retention mechanic, and it fails the endorsement test in this chapter: you would not agree to it if the mechanism were explained to you. Missing a day is information, not a failure to be punished.',
  },
}
