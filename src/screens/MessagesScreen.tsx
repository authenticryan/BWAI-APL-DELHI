import { useState } from 'react'
import { useStadium } from '../context/StadiumContext'
import { getTeam, LIVE_MATCH } from '../data/mockData'

interface Message {
  id: string
  sender: string
  text: string
  time: string
  isMe?: boolean
  isOrg?: boolean
}

const MATCH_CHAT_MSGS: Message[] = [
  { id: '1', sender: 'Vikas M.',    text: 'Gate G is empty right now, just walked in 🔥', time: '7:28 PM' },
  { id: '2', sender: 'Priya S.',    text: 'MI batting first!! Rohit on 34 already 💙', time: '7:31 PM' },
  { id: '3', sender: 'Rahul K.',    text: 'Avoid Gate E – huge queue from the North side', time: '7:35 PM' },
  { id: '4', sender: 'You',         text: 'On my way to section W, Gate G is smooth!', time: '7:38 PM', isMe: true },
  { id: '5', sender: 'Ananya T.',   text: 'Anyone know if the West Stand food stall is open?', time: '7:41 PM' },
  { id: '6', sender: 'Siddharth B.', text: 'Yes! Vada pav there is 🔥🔥', time: '7:42 PM' },
]

const ORGANIZER_MSGS: Message[] = [
  { id: '1', sender: 'Wankhede Stadium', text: 'Welcome to tonight\'s TATA IPL 2026 match! Gates open from 5:30 PM. Please carry a valid photo ID.', time: '5:30 PM', isOrg: true },
  { id: '2', sender: 'Wankhede Stadium', text: '🟡 Gate A & E experiencing moderate congestion. Fans in North Stand blocks are advised to use Gate B or H instead.', time: '7:15 PM', isOrg: true },
  { id: '3', sender: 'Wankhede Stadium', text: 'Food counters on Level 2 (West) are now fully operational. Serving till end of 15th over.', time: '7:22 PM', isOrg: true },
  { id: '4', sender: 'Wankhede Stadium', text: '🔴 Gate E is now CLOSED for entry. Please redirect to Gate D or F. Apologies for the inconvenience.', time: '7:44 PM', isOrg: true },
]

function getMiMsgs(teamId: string): Message[] {
  const team = getTeam(teamId)
  return [
    { id: '1', sender: `${team.name} Official`, text: `💙 Match day! We know you're in the stands and we're playing for you tonight. Make some noise!`, time: '6:00 PM', isOrg: true },
    { id: '2', sender: 'Deepak R.',   text: `This is our season. I can feel it. Let's go ${team.short}!! 🔥`, time: '6:45 PM' },
    { id: '3', sender: `${team.name} Official`, text: '🎁 Tonight only: Show this message at any merchandise counter for 15% off exclusive match-day jerseys!', time: '7:00 PM', isOrg: true },
    { id: '4', sender: 'Meera P.',    text: 'Who else is in the West Stand? Section W gang where you at 🙋', time: '7:20 PM' },
    { id: '5', sender: 'You',         text: 'Row 12 here! This atmosphere is unreal 🏏', time: '7:25 PM', isMe: true },
    { id: '6', sender: `${team.name} Official`, text: '📊 Poll: If we win tonight, should we celebrate at the Wankhede square? Vote 👍 YES or 👎 NO', time: '7:50 PM', isOrg: true },
  ]
}

type Room = 'match' | 'organizer' | 'home'

function ChatRoom({ messages, placeholder }: { messages: Message[]; placeholder?: string }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[78%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
              {!msg.isMe && (
                <span className={`text-[10px] font-semibold px-1 ${msg.isOrg ? 'text-[#4F91CD]' : 'text-white/40'}`}>
                  {msg.isOrg && '🔔 '}{msg.sender}
                </span>
              )}
              <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.isMe
                  ? 'bg-[#19388A] text-white rounded-br-sm'
                  : msg.isOrg
                    ? 'bg-[#4F91CD]/15 border border-[#4F91CD]/20 text-white rounded-bl-sm'
                    : 'bg-white/8 text-white/90 rounded-bl-sm border border-white/8'
              }`}>
                {msg.text}
              </div>
              <span className="text-[9px] text-white/25 px-1">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Input placeholder */}
      <div className="shrink-0 px-4 pb-4 pt-2 border-t border-white/8">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5">
          <span className="flex-1 text-sm text-white/25">{placeholder ?? 'Message...'}</span>
          <div className="rounded-full bg-[#19388A]/60 h-7 w-7 flex items-center justify-center">
            <span className="text-xs">↑</span>
          </div>
        </div>
        <p className="text-center text-[10px] text-white/20 mt-2">Two-way messaging coming soon</p>
      </div>
    </div>
  )
}

export default function MessagesScreen() {
  const { user } = useStadium()
  const [activeRoom, setActiveRoom] = useState<Room | null>(null)
  const homeTeam = user ? getTeam(user.homeTeamId) : null
  const homeMsgs = homeTeam ? getMiMsgs(homeTeam.id) : []

  const rooms = [
    {
      id: 'match' as Room,
      icon: '🏏',
      title: `${LIVE_MATCH.homeTeam.short} vs ${LIVE_MATCH.awayTeam.short} · Match Chat`,
      subtitle: 'Fans at Wankhede tonight',
      badge: 'LIVE',
      badgeColor: 'bg-red-500/20 border-red-500/30 text-red-400',
      preview: MATCH_CHAT_MSGS[MATCH_CHAT_MSGS.length - 1].text,
      unread: 2,
      messages: MATCH_CHAT_MSGS,
    },
    {
      id: 'organizer' as Room,
      icon: '📢',
      title: 'Wankhede Stadium · Organizer',
      subtitle: 'Official match-day updates',
      badge: 'Official',
      badgeColor: 'bg-[#19388A]/40 border-[#4F91CD]/30 text-[#4F91CD]',
      preview: ORGANIZER_MSGS[ORGANIZER_MSGS.length - 1].text,
      unread: 1,
      messages: ORGANIZER_MSGS,
    },
    {
      id: 'home' as Room,
      icon: homeTeam?.emoji ?? '⭐',
      title: homeTeam ? `${homeTeam.name} · Fan Club` : 'Home Team',
      subtitle: homeTeam ? `Your ${homeTeam.short} community` : 'Select your home team first',
      badge: homeTeam?.short ?? '',
      badgeColor: 'bg-white/10 border-white/20 text-white/60',
      preview: homeMsgs[homeMsgs.length - 1]?.text ?? '',
      unread: 3,
      messages: homeMsgs,
    },
  ]

  if (activeRoom) {
    const room = rooms.find(r => r.id === activeRoom)!
    return (
      <div className="flex flex-col h-full">
        <div className="shrink-0 px-4 pt-3 pb-3 border-b border-white/8 flex items-center gap-3">
          <button
            onClick={() => setActiveRoom(null)}
            className="text-[#4F91CD] text-sm active:opacity-60 transition-opacity"
          >
            ← Back
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{room.title}</p>
            <p className="text-xs text-white/40">{room.subtitle}</p>
          </div>
          <span className="text-xl">{room.icon}</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatRoom messages={room.messages} placeholder={`Message ${room.title.split('·')[0].trim()}...`} />
        </div>
      </div>
    )
  }

  const homeRoom = rooms.find(r => r.id === 'home')!
  const venueRooms = rooms.filter(r => r.id !== 'home')

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      <div className="px-4 pt-4 pb-3">
        <h2 className="text-base font-bold text-white">Messages</h2>
        <p className="text-xs text-white/40">Your team, match chat, and stadium updates</p>
      </div>

      {/* Home team — featured */}
      <div className="px-4 mb-5">
        <p className="text-[10px] font-semibold text-white/35 uppercase tracking-widest mb-2">Your Team</p>
        <button
          onClick={() => setActiveRoom('home')}
          className="w-full text-left rounded-2xl overflow-hidden active:scale-[0.98] transition-transform"
          style={{ background: `linear-gradient(135deg, ${homeTeam?.primary ?? '#19388A'}44, ${homeTeam?.primary ?? '#19388A'}22)`, border: `1px solid ${homeTeam?.primary ?? '#4F91CD'}33` }}
        >
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-start gap-3">
              <div
                className="h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: `${homeTeam?.primary ?? '#19388A'}55`, border: `1px solid ${homeTeam?.primary ?? '#4F91CD'}44` }}
              >
                {homeRoom.icon}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-white truncate">{homeTeam?.name} Fan Club</span>
                  {homeRoom.unread > 0 && (
                    <div className="shrink-0 h-5 min-w-5 rounded-full flex items-center justify-center px-1" style={{ background: homeTeam?.primary ?? '#19388A' }}>
                      <span className="text-[10px] font-bold text-white">{homeRoom.unread}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-white/50 truncate">{homeRoom.preview}</p>
              </div>
            </div>
          </div>
          <div className="px-4 pb-3 flex items-center justify-between">
            <span className="text-[10px] text-white/35">All season · exclusive drops & polls</span>
            <span className="text-[10px] font-semibold" style={{ color: homeTeam?.primary ?? '#4F91CD' }}>Open →</span>
          </div>
        </button>
      </div>

      {/* Venue / match-day channels */}
      <div className="px-4">
        <p className="text-[10px] font-semibold text-white/35 uppercase tracking-widest mb-2">Tonight · Wankhede Stadium</p>
        <div className="space-y-2">
          {venueRooms.map(room => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              className="w-full text-left rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 flex items-center gap-3 active:bg-white/10 transition-colors"
            >
              <div className="h-11 w-11 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                {room.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-white truncate">{room.title}</span>
                  {room.badge && (
                    <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${room.badgeColor}`}>
                      {room.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/40 truncate">{room.preview}</p>
              </div>
              {room.unread > 0 && (
                <div className="shrink-0 h-5 min-w-5 rounded-full bg-[#19388A] flex items-center justify-center px-1">
                  <span className="text-[10px] font-bold text-white">{room.unread}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
