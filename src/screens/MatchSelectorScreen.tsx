import { useState } from 'react'
import { useStadium } from '../context/StadiumContext'
import { MOCK_MATCHES } from '../data/mockData'

export default function MatchSelectorScreen() {
  const { selectMatch } = useStadium()
  const [ticketCode, setTicketCode] = useState('')
  const [codeError, setCodeError] = useState(false)
  const [showCodeInput, setShowCodeInput] = useState(false)

  const handleCodeSubmit = () => {
    const match = MOCK_MATCHES.find(m => m.ticketCode === ticketCode.trim().toUpperCase())
    if (match) {
      selectMatch(match.id)
    } else {
      setCodeError(true)
      setTimeout(() => setCodeError(false), 2000)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6">
      <div className="px-4 pt-4 pb-3">
        <h2 className="text-base font-bold text-white">Select a Match</h2>
        <p className="text-xs text-white/40">Choose your ticket to see live gate status</p>
      </div>

      {/* My tickets */}
      <div className="px-4 mb-4">
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2">My Tickets</p>
        <div className="space-y-2.5">
          {MOCK_MATCHES.map(match => {
            const isLive = match.status === 'LIVE'
            return (
              <button
                key={match.id}
                onClick={() => selectMatch(match.id)}
                className="w-full text-left rounded-2xl border border-white/10 bg-white/5 overflow-hidden active:scale-[0.98] transition-transform"
              >
                <div
                  className="px-4 py-3"
                  style={{
                    background: isLive
                      ? `linear-gradient(135deg, ${match.homeTeam.primary}33, ${match.awayTeam.primary}22)`
                      : undefined,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      {isLive ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                          <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Live Now</span>
                        </>
                      ) : (
                        <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wide">{match.date}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-white/30">{match.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div
                          className="text-lg font-black"
                          style={{ color: match.homeTeam.primary === '#1B2133' ? '#DBBE6E' : match.homeTeam.primary }}
                        >
                          {match.homeTeam.short}
                        </div>
                      </div>
                      <div className="text-xs text-white/30 font-semibold">vs</div>
                      <div className="text-center">
                        <div
                          className="text-lg font-black"
                          style={{ color: match.awayTeam.primary === '#1B2133' ? '#DBBE6E' : match.awayTeam.primary }}
                        >
                          {match.awayTeam.short}
                        </div>
                      </div>
                    </div>
                    {isLive && match.score && (
                      <div className="text-right">
                        <div className="text-xs font-mono text-white/70">{match.score.home}</div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-1.5">{match.venue}</p>
                </div>
                <div className="border-t border-white/5 px-4 py-2 flex items-center justify-between">
                  <span className="text-[10px] text-white/30 font-mono">{match.ticketCode ?? 'Booked externally'}</span>
                  <span className="text-[10px] font-semibold text-[#4F91CD]">View Gates →</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Enter ticket code */}
      <div className="px-4">
        <button
          onClick={() => setShowCodeInput(v => !v)}
          className="w-full text-left rounded-2xl border border-dashed border-white/15 bg-transparent px-4 py-3.5 flex items-center gap-3 active:bg-white/5 transition-colors"
        >
          <span className="text-lg">🎟️</span>
          <div>
            <p className="text-sm font-semibold text-white">Enter a ticket code</p>
            <p className="text-xs text-white/40">Booked from BookMyShow or external source</p>
          </div>
          <span className="ml-auto text-white/30 text-lg">{showCodeInput ? '↑' : '+'}</span>
        </button>

        {showCodeInput && (
          <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <p className="text-xs text-white/40">Try: <span className="font-mono text-white/60">WK2026-MI01</span> or <span className="font-mono text-white/60">MA2026-CSK05</span></p>
            <input
              type="text"
              value={ticketCode}
              onChange={e => setTicketCode(e.target.value)}
              placeholder="e.g. WK2026-MI01"
              className={`w-full rounded-xl border bg-white/5 px-4 py-2.5 text-sm font-mono text-white placeholder:text-white/20 outline-none transition-colors ${
                codeError ? 'border-red-500/60' : 'border-white/10 focus:border-[#4F91CD]/60'
              }`}
            />
            {codeError && <p className="text-xs text-red-400">Invalid ticket code. Please check and try again.</p>}
            <button
              onClick={handleCodeSubmit}
              disabled={!ticketCode.trim()}
              className="w-full rounded-xl bg-[#19388A] border border-[#4F91CD]/30 py-2.5 text-sm font-bold text-white disabled:opacity-40 active:scale-95 transition-all"
            >
              Look Up Match
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
