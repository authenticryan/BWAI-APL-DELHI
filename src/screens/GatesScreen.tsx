import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AnnouncementBanner from '../components/AnnouncementBanner'
import GateCard from '../components/GateCard'
import { useStadium, GATE_REFRESH_INTERVAL } from '../context/StadiumContext'
import { MOCK_MATCHES } from '../data/mockData'

interface Props {
  matchId: string
}

function RefreshCountdown({ lastUpdate }: { lastUpdate: Date }) {
  const intervalSec = GATE_REFRESH_INTERVAL / 1000
  const [secsLeft, setSecsLeft] = useState(intervalSec)

  useEffect(() => {
    setSecsLeft(intervalSec)
  }, [lastUpdate, intervalSec])

  useEffect(() => {
    const t = setInterval(() => {
      setSecsLeft(s => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(t)
  }, [lastUpdate])

  const progress = secsLeft / intervalSec

  return (
    <div className="flex items-center gap-2">
      {/* Arc progress ring */}
      <svg width="22" height="22" viewBox="0 0 22 22" className="-rotate-90">
        <circle cx="11" cy="11" r="8" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
        <circle
          cx="11" cy="11" r="8"
          fill="none"
          stroke="#4ade80"
          strokeWidth="2.5"
          strokeDasharray={`${2 * Math.PI * 8}`}
          strokeDashoffset={`${2 * Math.PI * 8 * (1 - progress)}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.9s linear' }}
        />
      </svg>
      <span className="text-[10px] text-white/50 font-medium tabular-nums">
        {secsLeft > 0 ? `Refreshes in ${secsLeft}s` : 'Refreshing…'}
      </span>
    </div>
  )
}

export default function GatesScreen({ matchId }: Props) {
  const { gates, clearSelectedMatch, lastGateUpdate } = useStadium()
  const navigate = useNavigate()
  const match = MOCK_MATCHES.find(m => m.id === matchId) ?? MOCK_MATCHES[0]

  const sorted = [...gates].sort((a, b) => a.capacity - b.capacity)
  const recommended = sorted[0]
  const isLive = match.status === 'LIVE'

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      {/* Match header with back button */}
      <div className="px-4 pt-3 pb-3">
        <button
          onClick={clearSelectedMatch}
          className="flex items-center gap-1.5 text-xs text-[#4F91CD] mb-3 active:opacity-60 transition-opacity"
        >
          <span>←</span>
          <span>All Matches</span>
        </button>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <div className="text-xs text-white/40 uppercase tracking-wide mb-1.5">{match.venue}</div>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div
                    className="text-xl font-black"
                    style={{ color: match.homeTeam.primary === '#1B2133' ? '#DBBE6E' : match.homeTeam.primary }}
                  >
                    {match.homeTeam.short}
                  </div>
                  <div className="text-[10px] text-white/40 mt-0.5">{match.homeTeam.name.split(' ').slice(-1)[0]}</div>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  {isLive ? (
                    <>
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Live</span>
                      </div>
                      {match.score && (
                        <div className="text-[11px] font-mono text-white/60">{match.score.home}</div>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-white/40">{match.date}</span>
                  )}
                </div>
                <div className="text-center">
                  <div
                    className="text-xl font-black"
                    style={{ color: match.awayTeam.primary === '#1B2133' ? '#DBBE6E' : match.awayTeam.primary }}
                  >
                    {match.awayTeam.short}
                  </div>
                  <div className="text-[10px] text-white/40 mt-0.5">{match.awayTeam.name.split(' ').slice(-1)[0]}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLive && <AnnouncementBanner />}

      {/* Pre-match info banner */}
      {!isLive && (
        <div className="mx-4 mb-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 flex items-center gap-3">
          <span className="text-base">📅</span>
          <div>
            <p className="text-xs font-semibold text-amber-300">Pre-match · {match.date} at {match.time}</p>
            <p className="text-[10px] text-white/40 mt-0.5">Gate data is live now — arrive early to beat the crowd</p>
          </div>
        </div>
      )}

      {/* Section header */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Gate Status</h2>
          <p className="text-xs text-white/40">Sorted by crowd level</p>
        </div>
        <RefreshCountdown lastUpdate={lastGateUpdate} />
      </div>

      {/* Legend */}
      <div className="px-4 mb-3 flex gap-4">
        {[['bg-emerald-400', 'Open <40%'], ['bg-amber-400', 'Moderate'], ['bg-red-400', 'Crowded >70%']].map(([color, label]) => (
          <div key={label} className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${color}`} />
            <span className="text-[10px] text-white/40">{label}</span>
          </div>
        ))}
      </div>

      {/* Gate cards */}
      <div className="px-4 flex flex-col gap-3">
        {sorted.map(gate => (
          <GateCard
            key={gate.id}
            gate={gate}
            recommended={gate.id === recommended.id}
            onDirections={() => navigate('/map')}
          />
        ))}
      </div>
    </div>
  )
}
