import { crowdColor, crowdStatus } from '../context/StadiumContext'
import type { Gate } from '../data/mockData'

interface Props {
  gate: Gate
  recommended?: boolean
  onDirections?: () => void
}

const statusLabel = { open: 'Open', moderate: 'Moderate', crowded: 'Crowded' }

export default function GateCard({ gate, recommended, onDirections }: Props) {
  const c = crowdColor(gate.capacity)
  const status = crowdStatus(gate.capacity)

  return (
    <div className={`relative rounded-2xl border p-4 transition-all duration-700 ${c.bg} ${c.border}`}>
      {recommended && (
        <div className="absolute -top-2.5 left-4 rounded-full bg-blue-500 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
          Recommended
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${c.dot} animate-pulse`} />
            <span className="text-sm font-semibold text-white truncate">{gate.label}</span>
          </div>
          <p className="mt-0.5 text-xs text-white/50 truncate">{gate.stand}</p>
          <p className="text-xs text-white/40 mt-0.5">Sections {gate.section}</p>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-xl font-bold tabular-nums ${c.text}`}>{gate.capacity}%</div>
          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.badge}`}>
            {statusLabel[status]}
          </span>
        </div>
      </div>
      <div className="mt-3">
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${c.dot}`}
            style={{ width: `${gate.capacity}%` }}
          />
        </div>
      </div>
      {recommended && onDirections && (
        <button
          onClick={onDirections}
          className="mt-3 w-full rounded-xl bg-blue-500 py-2 text-sm font-semibold text-white active:scale-95 transition-transform"
        >
          Get Directions →
        </button>
      )}
    </div>
  )
}
