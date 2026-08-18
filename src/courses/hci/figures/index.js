import FittsGeometry from './FittsGeometry'
import ActionCycle from './ActionCycle'

/**
 * Encyclopedia plates. A lesson opts in with a reading block:
 *   { "type": "plate", "figure": "fitts", "number": "4.1", "caption": "…" }
 * Drawn rather than photographed: the historical images you would want are not
 * freely licensed, and a drawing inherits the design's own tokens.
 */
export const figures = {
  fitts: FittsGeometry,
  actionCycle: ActionCycle,
}
