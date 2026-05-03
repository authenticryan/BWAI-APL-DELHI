import StadiumSVG from '../components/StadiumSVG'
import { useStadium, crowdColor, crowdStatus } from '../context/StadiumContext'

const statusLabel = { open: 'Open', moderate: 'Moderate', crowded: 'Crowded' }

export default function MapScreen() {
  const { gates, seat } = useStadium()
  const myGate = gates.find(g => g.id === seat.gate)

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-base font-bold text-white">Stadium Map</h2>
        <p className="text-xs text-white/40">Wankhede Stadium · Gate colour = crowd level</p>
      </div>

      {/* SVG Map */}
      <div className="px-4 pb-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden p-2">
          <StadiumSVG gates={gates} userGate={seat.gate} />
        </div>
      </div>

      {/* Legend row */}
      <div className="px-4 mb-3 flex gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          <span className="text-xs text-white/50">Your seat</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1 w-5 rounded bg-blue-500 opacity-70" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #3b82f6 0 5px, transparent 5px 8px)' }} />
          <span className="text-xs text-white/50">Walking path</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
          <span className="text-xs text-white/50">Bathroom</span>
        </div>
      </div>

      {/* My seat card */}
      <div className="px-4 mb-3">
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-3">
          <p className="text-xs text-blue-400/70 uppercase tracking-wide font-semibold mb-1">Your Seat</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-bold">Section {seat.section} · Row {seat.row} · Seat {seat.seat}</p>
              <p className="text-xs text-white/50 mt-0.5">{myGate?.stand}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-300 font-bold">Enter via</p>
              <p className="text-2xl font-black text-blue-400">Gate {seat.gate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gate I should use */}
      {myGate && (() => {
        const c = crowdColor(myGate.capacity)
        const status = crowdStatus(myGate.capacity)
        return (
          <div className="px-4 mb-3">
            <div className={`rounded-2xl border p-4 ${c.bg} ${c.border}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wide font-semibold mb-1">Your Assigned Gate</p>
                  <p className="text-white font-bold">{myGate.label} · {myGate.stand}</p>
                  <p className="text-xs text-white/40 mt-0.5">Sections {myGate.section}</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black ${c.text}`}>{myGate.capacity}%</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.badge}`}>
                    {statusLabel[status]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Walk instructions */}
      <div className="px-4 pb-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/50 uppercase tracking-wide font-semibold mb-3">Walking Directions</p>
          <div className="space-y-3">
            {[
              { icon: '🚶', text: `Enter through Gate ${seat.gate}` },
              { icon: '↗', text: 'Follow the blue path on the map' },
              { icon: '🪑', text: `Section ${seat.section}, Row ${seat.row}, Seat ${seat.seat}` },
              { icon: '🚻', text: 'Nearest bathroom — 30m from your seat (purple marker)' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm">
                  {step.icon}
                </div>
                <p className="text-sm text-white/70 pt-0.5">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
