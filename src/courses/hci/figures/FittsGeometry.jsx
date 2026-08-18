/**
 * Fig. 4.1 — the two quantities in the index of difficulty. Drawn rather than
 * described because the ratio is the point, and a ratio is spatial.
 */
export default function FittsGeometry() {
  return (
    <svg
      viewBox="0 0 640 200"
      role="img"
      aria-label="A start point on the left, a horizontal distance D running right to a target of width W, with the index of difficulty given as log base two of two D over W."
      className="w-full"
      fill="none"
      stroke="currentColor"
    >
      {/* baseline */}
      <line x1="40" y1="140" x2="600" y2="140" strokeWidth="1" strokeDasharray="3 4" opacity="0.45" />

      {/* start point */}
      <circle cx="70" cy="140" r="7" fill="currentColor" stroke="none" />
      <text x="70" y="170" textAnchor="middle" fontSize="13" fill="currentColor" stroke="none">
        start
      </text>

      {/* target — the one green element on the plate */}
      <rect x="450" y="96" width="112" height="88" fill="var(--color-accent)" stroke="none" />
      <rect x="450" y="96" width="112" height="88" strokeWidth="1.5" />

      {/* distance D, measured to the target centre */}
      <line x1="70" y1="60" x2="506" y2="60" strokeWidth="1.5" />
      <line x1="70" y1="52" x2="70" y2="68" strokeWidth="1.5" />
      <line x1="506" y1="52" x2="506" y2="68" strokeWidth="1.5" />
      <line x1="506" y1="60" x2="506" y2="96" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
      <text x="288" y="46" textAnchor="middle" fontSize="18" fontWeight="700" fill="currentColor" stroke="none">
        D
      </text>

      {/* width W, along the axis of motion */}
      <line x1="450" y1="196" x2="562" y2="196" strokeWidth="1.5" />
      <line x1="450" y1="188" x2="450" y2="200" strokeWidth="1.5" />
      <line x1="562" y1="188" x2="562" y2="200" strokeWidth="1.5" />
      <text x="596" y="192" fontSize="18" fontWeight="700" fill="currentColor" stroke="none">
        W
      </text>
    </svg>
  )
}
