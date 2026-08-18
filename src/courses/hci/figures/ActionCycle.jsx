/**
 * Fig. 6.1 — Norman's seven stages, with the two gulfs bracketed on the sides
 * they actually span. The asymmetry is the teaching point: execution runs down
 * one side, evaluation back up the other, and they fail for different reasons.
 */
const STAGES_L = ['Intention', 'Action specification', 'Execution']
const STAGES_R = ['Perception', 'Interpretation', 'Evaluation']

export default function ActionCycle() {
  const row = (i) => 92 + i * 46

  return (
    <svg
      viewBox="0 0 640 330"
      role="img"
      aria-label="Norman's action cycle. A goal at the top divides into an execution path down the left — intention, action specification, execution — and an evaluation path up the right — perception, interpretation, evaluation — meeting at the world along the bottom. The Gulf of Execution brackets the left path, the Gulf of Evaluation brackets the right."
      className="w-full"
      fill="none"
      stroke="currentColor"
    >
      {/* goal */}
      <rect x="245" y="14" width="150" height="40" strokeWidth="1.5" />
      <text x="320" y="39" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor" stroke="none">
        Goal
      </text>

      {/* the world — the one green element on the plate */}
      <rect x="245" y="272" width="150" height="42" fill="var(--color-accent)" stroke="none" />
      <rect x="245" y="272" width="150" height="42" strokeWidth="1.5" />
      <text x="320" y="298" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor" stroke="none">
        The world
      </text>

      {/* execution path, left */}
      {STAGES_L.map((s, i) => (
        <g key={s}>
          <rect x="60" y={row(i) - 15} width="190" height="30" strokeWidth="1" opacity="0.85" />
          <text x="155" y={row(i) + 4} textAnchor="middle" fontSize="12" fill="currentColor" stroke="none">
            {s}
          </text>
        </g>
      ))}

      {/* evaluation path, right */}
      {STAGES_R.map((s, i) => (
        <g key={s}>
          <rect x="390" y={row(2 - i) - 15} width="190" height="30" strokeWidth="1" opacity="0.85" />
          <text x="485" y={row(2 - i) + 4} textAnchor="middle" fontSize="12" fill="currentColor" stroke="none">
            {s}
          </text>
        </g>
      ))}

      {/* flow */}
      <path d="M245 34 H155 V77" strokeWidth="1.5" />
      <path d="M155 199 V293 H245" strokeWidth="1.5" />
      <path d="M395 293 H485 V199" strokeWidth="1.5" />
      <path d="M485 77 V34 H395" strokeWidth="1.5" />

      {/* gulf brackets */}
      <path d="M40 77 H26 V199 H40" strokeWidth="1.5" />
      <text x="20" y="146" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" stroke="none" transform="rotate(-90 20 146)">
        GULF OF EXECUTION
      </text>
      <path d="M600 77 H614 V199 H600" strokeWidth="1.5" />
      <text x="622" y="146" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" stroke="none" transform="rotate(90 622 146)">
        GULF OF EVALUATION
      </text>
    </svg>
  )
}
