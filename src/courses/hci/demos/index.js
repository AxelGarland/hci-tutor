import FittsLaw from './FittsLaw'
import HicksLaw from './HicksLaw'
import FeedbackLatency from './FeedbackLatency'
import VisualSearch from './VisualSearch'
import MemorySpan from './MemorySpan'
import EncodingAccuracy from './EncodingAccuracy'
import RelianceGame from './RelianceGame'

// A lesson opts into demos with "demos": ["<key>", ...] in its content JSON.
// `tab` is the tab label; `title` is the heading shown above the demo.
export const demos = {
  fitts: { tab: "Fitts' law", title: 'Measure it on yourself', Component: FittsLaw },
  hicks: { tab: "Hick's law", title: 'Measure it on yourself', Component: HicksLaw },
  feedback: { tab: 'Latency', title: 'Break it on purpose', Component: FeedbackLatency },
  search: { tab: 'Search', title: 'Parallel versus serial search', Component: VisualSearch },
  span: { tab: 'Span', title: 'Find your own chunk limit', Component: MemorySpan },
  encoding: { tab: 'Encodings', title: 'Rank the channels yourself', Component: EncodingAccuracy },
  reliance: { tab: 'Reliance', title: 'Measure your own calibration', Component: RelianceGame },
}
