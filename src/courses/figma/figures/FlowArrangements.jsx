/**
 * Fig. 1.1 — grid, vertical wrap and masonry, with numbered items so the
 * placement rule is visible rather than asserted.
 *
 * Drawn because the distinction is spatial and because the confusion the plate
 * exists to settle is itself visual: wrap and masonry both make columns, so a
 * description of the difference is far weaker than seeing where item 2 lands in
 * each. Item heights vary deliberately — with equal heights wrap and masonry
 * render identically, which is how the misconception survives.
 */

/* Heights chosen so the shortest column genuinely changes between placements. */
const H = [58, 34, 46, 30, 68, 38]

function Panel({ x, title, rule, placements }) {
  return (
    <g>
      <text
        x={x}
        y="18"
        fontSize="13"
        fontWeight="800"
        fill="currentColor"
        stroke="none"
      >
        {title}
      </text>
      <text x={x} y="36" fontSize="11" fill="var(--color-muted)" stroke="none">
        {rule}
      </text>

      {placements.map(({ col, top, i }) => {
        const w = 76
        const cx = x + col * (w + 8)
        return (
          <g key={i}>
            <rect
              x={cx}
              y={48 + top}
              width={w}
              height={H[i]}
              fill={i === 1 ? 'var(--color-accent)' : 'none'}
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <text
              x={cx + w / 2}
              y={48 + top + H[i] / 2 + 5}
              fontSize="13"
              fontWeight="700"
              textAnchor="middle"
              fill="currentColor"
              stroke="none"
            >
              {i + 1}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export default function FlowArrangements() {
  // Grid: cells. Row height is set by the tallest item in the row, so short
  // items leave space beneath them.
  const rowH = [Math.max(H[0], H[1]) + 8, Math.max(H[2], H[3]) + 8]
  const grid = [
    { i: 0, col: 0, top: 0 },
    { i: 1, col: 1, top: 0 },
    { i: 2, col: 0, top: rowH[0] },
    { i: 3, col: 1, top: rowH[0] },
    { i: 4, col: 0, top: rowH[0] + rowH[1] },
    { i: 5, col: 1, top: rowH[0] + rowH[1] },
  ]

  // Vertical wrap: fill column one completely, then start column two.
  const wrap = [
    { i: 0, col: 0, top: 0 },
    { i: 1, col: 0, top: H[0] + 8 },
    { i: 2, col: 0, top: H[0] + H[1] + 16 },
    { i: 3, col: 1, top: 0 },
    { i: 4, col: 1, top: H[3] + 8 },
    { i: 5, col: 1, top: H[3] + H[4] + 16 },
  ]

  // Masonry: each item goes to whichever column is shortest at that moment.
  const masonry = (() => {
    const h = [0, 0]
    return H.map((_, i) => {
      const col = h[0] <= h[1] ? 0 : 1
      const top = h[col]
      h[col] += H[i] + 8
      return { i, col, top }
    })
  })()

  return (
    <svg
      viewBox="0 0 640 260"
      role="img"
      aria-label="Three arrangements of the same six items of differing heights. Grid places them into cells in rows, so short items leave empty space below them. Vertical wrap fills the first column completely before starting the second, so item two sits directly below item one. Masonry sends each item to whichever column is shortest at that moment, so item two starts the second column and no rows form."
      className="w-full"
      fill="none"
      stroke="currentColor"
    >
      <Panel x={8} title="Grid" rule="Into cells — rows align" placements={grid} />
      <Panel x={232} title="Vertical wrap" rule="Fill a column, then the next" placements={wrap} />
      <Panel x={456} title="Masonry" rule="Into the shortest column" placements={masonry} />
    </svg>
  )
}
