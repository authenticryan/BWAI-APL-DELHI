import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/tickets',  label: 'Tickets',  icon: '🎟️' },
  { to: '/gates',    label: 'Gates',    icon: '🚪' },
  { to: '/map',      label: 'Map',      icon: '🗺️' },
  { to: '/food',     label: 'Food',     icon: '🍽️' },
  { to: '/messages', label: 'Messages', icon: '💬' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-lg">
      <div className="flex safe-area-bottom">
        {TABS.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 transition-colors ${
                isActive ? 'text-[#4F91CD]' : 'text-white/30'
              }`
            }
          >
            <span className="text-[18px] leading-none">{tab.icon}</span>
            <span className="text-[9px] font-semibold tracking-wide">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
