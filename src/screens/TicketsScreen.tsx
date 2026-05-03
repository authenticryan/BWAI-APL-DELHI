import { useState } from 'react'
import { LIVE_MATCH as MOCK_MATCH, MOCK_SEAT } from '../data/mockData'
import { useStadium } from '../context/StadiumContext'

const UPCOMING = [
  { id: '2',  teams: 'RCB vs RR',   date: 'May 4',  venue: 'M. Chinnaswamy Stadium',    available: true  },
  { id: '3',  teams: 'PBKS vs GT',  date: 'May 5',  venue: 'PCA Stadium, Mullanpur',     available: true  },
  { id: '4',  teams: 'LSG vs DC',   date: 'May 7',  venue: 'BRSABV Ekana Stadium',       available: true  },
  { id: '5',  teams: 'SRH vs KKR',  date: 'May 8',  venue: 'Rajiv Gandhi Int. Stadium',  available: true  },
  { id: '6',  teams: 'CSK vs MI',   date: 'May 10', venue: 'MA Chidambaram Stadium',     available: true  },
  { id: '7',  teams: 'KKR vs DC',   date: 'May 12', venue: 'Eden Gardens',               available: true  },
  { id: '8',  teams: 'GT vs PBKS',  date: 'May 14', venue: 'Narendra Modi Stadium',      available: true  },
  { id: '9',  teams: 'RR vs LSG',   date: 'May 15', venue: 'Sawai Mansingh Stadium',     available: true  },
  { id: '10', teams: 'MI vs SRH',   date: 'May 17', venue: 'Wankhede Stadium',           available: false },
]

const SECTIONS = [
  { id: 'N', label: 'North Stand',      gate: 'A', price: '₹800'  },
  { id: 'E', label: 'East Stand',       gate: 'C', price: '₹1,200' },
  { id: 'S', label: 'South Stand',      gate: 'E', price: '₹600'  },
  { id: 'W', label: 'West Stand',       gate: 'G', price: '₹1,500' },
  { id: 'NE', label: 'North-East Stand', gate: 'B', price: '₹1,000' },
  { id: 'SW', label: 'South-West Stand', gate: 'F', price: '₹900'  },
]

type BookingStep = 'select' | 'confirm' | 'processing' | 'done'

interface BookingMatch {
  id: string
  teams: string
  date: string
  venue: string
}

function BookingModal({ match, onClose }: { match: BookingMatch; onClose: () => void }) {
  const [step, setStep] = useState<BookingStep>('select')
  const [selectedSection, setSelectedSection] = useState<typeof SECTIONS[0] | null>(null)
  const [assignedSeat] = useState(() => ({
    row: Math.floor(Math.random() * 20) + 1,
    seat: Math.floor(Math.random() * 15) + 1,
  }))

  function handleConfirm() {
    setStep('processing')
    setTimeout(() => setStep('done'), 1800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={step !== 'processing' ? onClose : undefined} />
      <div className="relative w-full max-w-sm rounded-t-3xl bg-[#111] border border-white/10 p-5 pb-8">

        {/* Handle */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

        {step === 'select' && (
          <>
            <h3 className="text-base font-bold text-white mb-0.5">{match.teams}</h3>
            <p className="text-xs text-white/40 mb-4">{match.date} · {match.venue}</p>
            <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">Choose a Section</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSection(s)}
                  className={`rounded-xl border px-3 py-3 text-left transition-all ${
                    selectedSection?.id === s.id
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/10 bg-white/5 active:scale-95'
                  }`}
                >
                  <p className="text-xs font-bold text-white">{s.label}</p>
                  <p className="text-[10px] text-white/40">Gate {s.gate} · {s.price}</p>
                </button>
              ))}
            </div>
            <button
              disabled={!selectedSection}
              onClick={() => setStep('confirm')}
              className={`w-full rounded-xl py-3 text-sm font-bold transition-all ${
                selectedSection
                  ? 'bg-blue-600 text-white active:scale-95'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </>
        )}

        {step === 'confirm' && selectedSection && (
          <>
            <h3 className="text-base font-bold text-white mb-4">Confirm Booking</h3>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-4 space-y-2.5">
              <Row label="Match" value={match.teams} />
              <Row label="Date" value={`${match.date} · 7:30 PM IST`} />
              <Row label="Section" value={selectedSection.label} />
              <Row label="Gate" value={`Gate ${selectedSection.gate}`} />
              <Row label="Price" value={selectedSection.price} />
            </div>
            <button
              onClick={handleConfirm}
              className="w-full rounded-xl py-3 text-sm font-bold bg-blue-600 text-white active:scale-95 transition-all mb-2"
            >
              Book Now
            </button>
            <button
              onClick={() => setStep('select')}
              className="w-full rounded-xl py-2.5 text-sm text-white/50"
            >
              Back
            </button>
          </>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center py-8">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-semibold text-white">Processing booking…</p>
            <p className="text-xs text-white/40 mt-1">Securing your seat</p>
          </div>
        )}

        {step === 'done' && selectedSection && (
          <div className="flex flex-col items-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">Booking Confirmed!</h3>
            <p className="text-xs text-white/40 mb-5">{match.teams} · {match.date}</p>
            <div className="w-full rounded-xl border border-white/10 bg-white/5 p-4 space-y-2 mb-5">
              <Row label="Section" value={selectedSection.label} />
              <Row label="Gate" value={`Gate ${selectedSection.gate}`} />
              <Row label="Row" value={String(assignedSeat.row)} />
              <Row label="Seat" value={String(assignedSeat.seat)} />
            </div>
            <p className="text-[10px] text-white/30 mb-4">Ticket sent to authenticryanis@gmail.com</p>
            <button
              onClick={onClose}
              className="w-full rounded-xl py-3 text-sm font-bold bg-white/10 text-white active:scale-95 transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-xs text-white/40">{label}</span>
      <span className="text-xs font-semibold text-white">{value}</span>
    </div>
  )
}

export default function TicketsScreen() {
  const { user } = useStadium()
  const [bookingMatch, setBookingMatch] = useState<BookingMatch | null>(null)

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-base font-bold text-white">My Tickets</h2>
        <p className="text-xs text-white/40">IPL 2026 Season</p>
      </div>

      {/* Active ticket */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-900 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">Today · Live</span>
              </div>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white">IPL 2026</span>
            </div>
            <h3 className="text-xl font-black text-white">{MOCK_MATCH.homeTeam.name}</h3>
            <p className="text-sm text-blue-200">vs {MOCK_MATCH.awayTeam.name}</p>
            <p className="text-xs text-blue-300/70 mt-1">{MOCK_MATCH.venue}</p>
          </div>
          <div className="bg-white/10 border border-white/10 border-t-0 rounded-b-2xl px-4 py-3">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wide">Section</p>
                <p className="text-white font-bold">{MOCK_SEAT.section} – {MOCK_SEAT.stand}</p>
              </div>
              <div className="text-center">
                <p className="text-white/50 text-xs uppercase tracking-wide">Row</p>
                <p className="text-white font-bold">{MOCK_SEAT.row}</p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-xs uppercase tracking-wide">Seat</p>
                <p className="text-white font-bold">{MOCK_SEAT.seat}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-white/40">Gate {MOCK_SEAT.gate} · {user?.name ?? 'You'}</p>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                ✓ Checked In
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming */}
      <div className="px-4">
        <h3 className="text-sm font-semibold text-white mb-3">Upcoming Matches</h3>
        <div className="space-y-2">
          {UPCOMING.map(m => (
            <div key={m.id} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{m.teams}</p>
                <p className="text-xs text-white/40">{m.date} · {m.venue}</p>
              </div>
              <button
                disabled={!m.available}
                onClick={() => m.available && setBookingMatch(m)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  m.available
                    ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300 active:scale-95 transition-transform'
                    : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
                }`}
              >
                {m.available ? 'Book' : 'Sold Out'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {bookingMatch && (
        <BookingModal match={bookingMatch} onClose={() => setBookingMatch(null)} />
      )}
    </div>
  )
}
