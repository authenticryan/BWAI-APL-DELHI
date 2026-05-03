import { Route, Routes, useLocation } from 'react-router-dom'
import { useStadium } from './context/StadiumContext'
import { getTeam } from './data/mockData'
import BottomNav from './components/BottomNav'
import AuthScreen from './screens/AuthScreen'
import GatesScreen from './screens/GatesScreen'
import MatchSelectorScreen from './screens/MatchSelectorScreen'
import MapScreen from './screens/MapScreen'
import TicketsScreen from './screens/TicketsScreen'
import FoodScreen from './screens/FoodScreen'
import MessagesScreen from './screens/MessagesScreen'
import OrganizerDashboard from './screens/OrganizerDashboard'

const PAGE_TITLES: Record<string, string> = {
  '/tickets':  'Tickets',
  '/gates':    'Gates',
  '/map':      'Map',
  '/food':     'Food & Drinks',
  '/messages': 'Messages',
}

function AppHeader() {
  const { user } = useStadium()
  const location = useLocation()
  const homeTeam = user ? getTeam(user.homeTeamId) : null
  const pageTitle = PAGE_TITLES[location.pathname]

  return (
    <div className="shrink-0 border-b border-white/8">
      <div className="flex items-center justify-between px-4 pt-safe-top">
        <div className="pt-3 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-tight text-white">🏏 StadiumPass</span>
            <div className="flex items-center gap-1 rounded-full border border-[#4F91CD]/25 bg-[#19388A]/20 px-2 py-0.5">
              <span className="text-[9px] font-black tracking-widest text-[#4F91CD] uppercase">TATA IPL</span>
              <span className="text-[9px] font-bold text-[#FFD141]">2026</span>
            </div>
          </div>
        </div>
        {homeTeam && (
          <div
            className="flex items-center gap-1.5 rounded-full border px-2.5 py-1"
            style={{ borderColor: homeTeam.secondary + '44', backgroundColor: homeTeam.primary + '22' }}
          >
            <span className="text-xs">{homeTeam.emoji}</span>
            <span className="text-[10px] font-bold text-white/80">{homeTeam.short}</span>
          </div>
        )}
      </div>
      {pageTitle && (
        <div className="px-4 pb-2.5">
          <span className="text-xs text-white/30 font-medium">{pageTitle}</span>
        </div>
      )}
    </div>
  )
}

function GatesTab() {
  const { selectedMatchId } = useStadium()
  if (!selectedMatchId) return <MatchSelectorScreen />
  return <GatesScreen matchId={selectedMatchId} />
}

function AudienceLayout() {
  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <AppHeader />
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/tickets"  element={<TicketsScreen />} />
          <Route path="/gates"    element={<GatesTab />} />
          <Route path="/map"      element={<MapScreen />} />
          <Route path="/food"     element={<FoodScreen />} />
          <Route path="/messages" element={<MessagesScreen />} />
          <Route path="*"         element={<TicketsScreen />} />
        </Routes>
      </div>
      <div className="shrink-0 h-[60px]" />
      <BottomNav />
    </div>
  )
}

export default function App() {
  const { user } = useStadium()

  return (
    <Routes>
      <Route path="/organizer" element={<OrganizerDashboard />} />
      {!user ? (
        <Route path="*" element={<AuthScreen />} />
      ) : (
        <Route path="*" element={<AudienceLayout />} />
      )}
    </Routes>
  )
}
