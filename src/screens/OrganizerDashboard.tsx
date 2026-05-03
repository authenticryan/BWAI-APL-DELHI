import { useState } from 'react'
import { useStadium, crowdColor, crowdStatus } from '../context/StadiumContext'

const statusLabel = { open: 'Open', moderate: 'Moderate', crowded: 'Crowded' }

export default function OrganizerDashboard() {
  const { gates, announcement, updateGate, postAnnouncement, dismissAnnouncement } = useStadium()
  const [announcementInput, setAnnouncementInput] = useState('')

  const handlePost = () => {
    const text = announcementInput.trim()
    if (!text) return
    postAnnouncement(text)
    setAnnouncementInput('')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur px-4 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/20">
            <span className="text-lg">🎛</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">Organizer View</h1>
            <p className="text-xs text-white/40">Wankhede Stadium — Live Control</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-[10px] text-orange-300 font-medium">Broadcasting</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-10 pt-4 space-y-6">
        {/* Announcement composer */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span>📢</span> Push Announcement
          </h2>
          {announcement && (
            <div className="mb-3 flex items-start gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2.5">
              <span className="text-xs text-blue-300 flex-1 leading-relaxed">{announcement}</span>
              <button
                onClick={dismissAnnouncement}
                className="shrink-0 text-blue-400/60 hover:text-blue-300 text-base leading-none ml-1"
              >
                ×
              </button>
            </div>
          )}
          <textarea
            value={announcementInput}
            onChange={e => setAnnouncementInput(e.target.value)}
            placeholder="e.g. Gate A reopened — crowd has cleared"
            rows={2}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-blue-500/50 transition-colors"
          />
          <button
            onClick={handlePost}
            disabled={!announcementInput.trim()}
            className="mt-2 w-full rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white disabled:opacity-40 active:scale-95 transition-all"
          >
            Push Live to All Screens
          </button>
        </div>

        {/* Gate controls */}
        <div>
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2"><span>🚪</span> Gate Controls</span>
            <span className="text-xs text-white/40 font-normal">{gates.length} gates</span>
          </h2>
          <div className="space-y-3">
            {gates.map(gate => {
              const c = crowdColor(gate.capacity)
              const status = crowdStatus(gate.capacity)
              return (
                <div key={gate.id} className={`rounded-2xl border p-4 ${c.bg} ${c.border}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                        <span className="text-sm font-semibold text-white">{gate.label}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.badge}`}>
                          {statusLabel[status]}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-white/40 pl-4">{gate.stand}</p>
                    </div>
                    <span className={`text-xl font-bold tabular-nums ${c.text}`}>{gate.capacity}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={gate.capacity}
                    onChange={e => updateGate(gate.id, Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="mt-2 flex gap-2">
                    {[['Low', 20], ['Med', 55], ['High', 85]].map(([label, val]) => (
                      <button
                        key={label}
                        onClick={() => updateGate(gate.id, val as number)}
                        className="flex-1 rounded-lg border border-white/10 bg-white/5 py-1 text-xs font-medium text-white/70 active:bg-white/15 transition-colors"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
