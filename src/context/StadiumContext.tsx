import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { Gate, INITIAL_GATES, MOCK_SEAT } from '../data/mockData'

interface User {
  name: string
  email: string
  homeTeamId: string
}

interface StadiumContextValue {
  gates: Gate[]
  announcement: string | null
  user: User | null
  seat: typeof MOCK_SEAT
  selectedMatchId: string | null
  lastGateUpdate: Date
  setUser: (u: User) => void
  selectMatch: (id: string) => void
  clearSelectedMatch: () => void
  updateGate: (id: string, capacity: number) => void
  postAnnouncement: (text: string) => void
  dismissAnnouncement: () => void
}

type BroadcastMsg =
  | { type: 'GATE_UPDATE'; gateId: string; capacity: number }
  | { type: 'ANNOUNCEMENT'; text: string }
  | { type: 'DISMISS_ANNOUNCEMENT' }

const StadiumContext = createContext<StadiumContextValue | null>(null)
const CHANNEL_NAME = 'stadium-sync'
export const GATE_REFRESH_INTERVAL = 8000

export function StadiumProvider({ children }: { children: React.ReactNode }) {
  const [gates, setGates] = useState<Gate[]>(INITIAL_GATES)
  const [announcement, setAnnouncement] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)
  const [lastGateUpdate, setLastGateUpdate] = useState<Date>(() => new Date())
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    const ch = new BroadcastChannel(CHANNEL_NAME)
    channelRef.current = ch
    ch.onmessage = (e: MessageEvent<BroadcastMsg>) => {
      const msg = e.data
      if (msg.type === 'GATE_UPDATE') {
        setGates(prev => prev.map(g => g.id === msg.gateId ? { ...g, capacity: msg.capacity } : g))
      } else if (msg.type === 'ANNOUNCEMENT') {
        setAnnouncement(msg.text)
      } else if (msg.type === 'DISMISS_ANNOUNCEMENT') {
        setAnnouncement(null)
      }
    }
    return () => ch.close()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setGates(prev => prev.map(g => {
        const delta = (Math.random() - 0.5) * 8
        const next = Math.min(100, Math.max(0, g.capacity + delta))
        return { ...g, capacity: Math.round(next) }
      }))
      setLastGateUpdate(new Date())
    }, GATE_REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  const broadcast = useCallback((msg: BroadcastMsg) => {
    channelRef.current?.postMessage(msg)
  }, [])

  const updateGate = useCallback((id: string, capacity: number) => {
    setGates(prev => prev.map(g => g.id === id ? { ...g, capacity } : g))
    broadcast({ type: 'GATE_UPDATE', gateId: id, capacity })
  }, [broadcast])

  const postAnnouncement = useCallback((text: string) => {
    setAnnouncement(text)
    broadcast({ type: 'ANNOUNCEMENT', text })
  }, [broadcast])

  const dismissAnnouncement = useCallback(() => {
    setAnnouncement(null)
    broadcast({ type: 'DISMISS_ANNOUNCEMENT' })
  }, [broadcast])

  const selectMatch = useCallback((id: string) => setSelectedMatchId(id), [])
  const clearSelectedMatch = useCallback(() => setSelectedMatchId(null), [])

  return (
    <StadiumContext.Provider value={{
      gates, announcement, user, seat: MOCK_SEAT,
      selectedMatchId, lastGateUpdate,
      setUser, selectMatch, clearSelectedMatch,
      updateGate, postAnnouncement, dismissAnnouncement,
    }}>
      {children}
    </StadiumContext.Provider>
  )
}

export function useStadium() {
  const ctx = useContext(StadiumContext)
  if (!ctx) throw new Error('useStadium must be used inside StadiumProvider')
  return ctx
}

export function crowdStatus(capacity: number): 'open' | 'moderate' | 'crowded' {
  if (capacity < 40) return 'open'
  if (capacity < 70) return 'moderate'
  return 'crowded'
}

export function crowdColor(capacity: number) {
  const s = crowdStatus(capacity)
  if (s === 'open')     return { bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-400', dot: 'bg-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' }
  if (s === 'moderate') return { bg: 'bg-amber-500/15',   border: 'border-amber-500/40',   text: 'text-amber-400',   dot: 'bg-amber-400',   badge: 'bg-amber-500/20 text-amber-300'   }
  return                       { bg: 'bg-red-500/15',     border: 'border-red-500/40',     text: 'text-red-400',     dot: 'bg-red-400',     badge: 'bg-red-500/20 text-red-300'       }
}
