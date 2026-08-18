/**
 * Why this interface is shaped the way it is, chapter by chapter.
 *
 * Every entry has to be an honest citation — the chapter must actually justify the
 * decision. Where the research sits slightly outside the book, the note says so
 * rather than borrowing authority the chapter does not give.
 */
export const NOTES = {
  timer: {
    lesson: 'ch25',
    note: 'The clock is a thin rule you can glance at, not a countdown that pulses and turns red. Calm technology puts information in the periphery until it needs the centre. Chapter 2 reaches the same conclusion from the other direction: motion is reserved for genuinely urgent events, and the pop-out budget belongs to the material, not the furniture.',
  },
  softStop: {
    lesson: 'ch12',
    note: 'Time runs out but nothing is snatched away mid-item. Shneiderman\'s golden rules ask for an internal locus of control — the user initiates, the system responds. A timer that interrupts you mid-answer inverts that for no learning benefit.',
  },
  recall: {
    lesson: 'ch29',
    note: 'You commit to an answer before seeing the real one. This is Buçinca\'s cognitive forcing function, which the trust chapter presents as a way to stop people rubber-stamping AI output — and the same mechanism produces the generation effect in memory. It works, and users dislike it. Both halves are the point.',
  },
  confidence: {
    lesson: 'ch29',
    note: 'Marking certainty before the reveal turns the session into a calibration exercise. The chapter\'s argument is that raw acceptance cannot distinguish trusting-when-right from trusting-when-wrong. The same holds for you: an item missed while you were sure is a real gap, and an item missed on a guess is not.',
  },
  splitScore: {
    lesson: 'ch36',
    note: 'The just-studied score and the older-material score never get merged. A test taken immediately after reading measures fluency and will always look good — a metric that cannot fail. The delayed score is the one carrying information about whether anything stuck.',
  },
  warmup: {
    lesson: 'ch03',
    note: 'Retrieval comes before reading, not only after it. Attempting to recall something before you study it improves later encoding even when the attempt fails. The pretesting effect is not named in this chapter, but the memory constraints that make it work are exactly the ones described here.',
  },
  reviewGate: {
    lesson: 'ch10',
    note: 'Past a threshold of overdue reviews the session stops introducing new material. An unbounded backlog is pure extraneous load: it makes every session worse without making any of them more informative, and it is the specific failure that ends most spaced-repetition habits.',
  },
  expectations: {
    lesson: 'ch39',
    note: 'The session tells you its shape before it starts rather than advertising how effective it is. Expectation calibration beats capability advertising — Kocielnik\'s finding for AI features applies just as well to a study tool asking for twenty minutes of your attention.',
  },
  coursePackages: {
    lesson: 'ch15',
    note: 'A course is a folder, not a config file: content, demos and these notes ship together under courses/<id>/. That is an information-architecture decision as much as an engineering one — the boundary an author has to understand is "one course, one directory", and the framework only knows the shape of the manifest. Chunking decisions that users never see still determine what can be found and changed, which is this chapter\'s point applied to a repository.',
  },
  homeEntry: {
    lesson: 'ch09',
    note: 'A blank entry point emits no information scent — nothing on it predicts what following a path will pay off. So the home screen leads with what the thing contains (43 chapters, 314 items, 7 demos) and puts the index one click away rather than behind navigation you have to learn. The chapter rows carry item counts and mastery inline for the same reason: scent on the label, not just a title.',
  },
  accent: {
    lesson: 'ch17',
    note: 'One accent, and a rule attached to it: the green is a ground for black marks only. Ink on it measures 13.6:1; white on it measures 1.45:1 and is never used. It also never carries a state by itself — the square beside the wordmark is decoration, and the one on the browse control is a disclosure indicator sitting inside a button that already says what it does in words. Right and wrong are still fill versus outline plus a label, so nothing breaks for the 8% of men with a colour vision deficiency.',
  },
  mobileSurface: {
    lesson: 'ch39',
    note: 'Mobile is a review-and-reading surface, not a full study surface, and it says so instead of pretending parity. The study session\'s core mechanic is free recall — type the answer from nothing, then write a paragraph — which is the one thing a phone is worst at. Reviews are the opposite: short, tappable, and dependent on frequency, which is exactly what a phone supplies. Nothing is blocked; the session is one tap away on any device. Expectation calibration beats capability advertising, so the screen states what it is good for rather than letting you discover it mid-session.',
  },
  popOut: {
    lesson: 'ch02',
    note: 'Exactly one element in this sidebar is filled solid: the primary action. Preattentive pop-out works on uniqueness, so three heavy blocks stacked together produce no pop-out at all — the search goes serial and the emphasis buys nothing. Everything secondary is a hairline outline, which keeps the budget of one spendable. In a greyscale design the singleton is carried by fill rather than hue.',
  },
  contrast: {
    lesson: 'ch17',
    note: 'Secondary text used to be the main text faded with opacity, which measured about 3.7:1 against this background and failed the 4.5:1 minimum at the small sizes it was used. It is now a measured token at roughly 6:1. Verdicts in the quiz are also named in words, not signalled by red and green alone, and controls smaller than 24 by 24 pixels carry an invisible hit area that meets the target-size rule without changing how they are drawn.',
  },
  demoTargets: {
    lesson: 'ch04',
    note: 'A named conflict. The accessibility chapter sets a 24 by 24 pixel minimum for targets; this demo deliberately draws them as small as 18 pixels, because a Fitts\'s law demonstration that never presents a difficult target cannot demonstrate anything — the index of difficulty would barely move. The exception is confined to the demo surface, the targets are keyboard-reachable, and no task in the app depends on hitting one. Every other control in the app meets the minimum.',
  },
  noStreak: {
    lesson: 'ch21',
    note: 'There is deliberately no streak counter here, and nothing says "don\'t break your run". That is loss aversion deployed as a retention mechanic, and it fails the endorsement test in this chapter: you would not agree to it if the mechanism were explained to you. Missing a day is information, not a failure to be punished.',
  },
}
