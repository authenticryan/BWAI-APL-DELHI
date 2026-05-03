import { useState, useRef, useEffect } from 'react'
import { useStadium } from '../context/StadiumContext'
import { IPL_TEAMS } from '../data/mockData'

type Step = 'auth' | 'otp' | 'team'

export default function AuthScreen() {
  const { setUser } = useStadium()
  const [step, setStep] = useState<Step>('auth')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [selected, setSelected] = useState<string | null>(null)
  const [otpCountdown, setOtpCountdown] = useState(5)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (step !== 'otp') return
    setOtpCountdown(5)
    const interval = setInterval(() => {
      setOtpCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setStep('team')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [step])

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) inputRefs.current[i + 1]?.focus()
  }

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus()
  }

  const handleFinish = () => {
    if (!selected) return
    setUser({ name: name.trim(), email: email.trim(), homeTeamId: selected })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col px-5 py-safe-top overflow-y-auto">
      {/* IPL Header badge */}
      <div className="flex items-center justify-center gap-2 pt-10 pb-2">
        <div className="flex items-center gap-1.5 rounded-full border border-[#4F91CD]/30 bg-[#19388A]/20 px-3 py-1">
          <span className="text-[10px] font-black tracking-widest text-[#4F91CD] uppercase">TATA IPL 2026</span>
        </div>
      </div>

      {/* Logo */}
      <div className="mb-6 text-center pt-2">
        <div className="text-5xl mb-3">🏏</div>
        <h1 className="text-2xl font-black text-white tracking-tight">StadiumPass</h1>
        <p className="text-sm text-white/40 mt-1">Your cricket match companion</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {(['auth', 'otp', 'team'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-2 rounded-full transition-all duration-300 ${
              step === s ? 'w-6 bg-[#4F91CD]' : s < step || (s === 'auth' && step !== 'auth') || (s === 'otp' && step === 'team') ? 'w-2 bg-[#4F91CD]/50' : 'w-2 bg-white/15'
            }`} />
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-sm">

          {/* STEP 1 — Auth */}
          {step === 'auth' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white mb-0.5">Welcome to the stands 🏟️</h2>
                <p className="text-sm text-white/40">Sign in to access your match companion</p>
              </div>
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wide">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Rohit Sharma"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-[#4F91CD]/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-[#4F91CD]/60 transition-colors"
                  />
                </div>
              </div>
              <button
                onClick={() => setStep('otp')}
                disabled={!name.trim() || !email.trim()}
                className="w-full rounded-xl bg-[#19388A] py-3.5 text-sm font-bold text-white disabled:opacity-40 active:scale-95 transition-all mt-2 border border-[#4F91CD]/30"
              >
                Send OTP →
              </button>
            </div>
          )}

          {/* STEP 2 — OTP */}
          {step === 'otp' && (
            <div className="space-y-6 text-center">
              {/* Animated lock icon */}
              <div className="flex flex-col items-center gap-3 pt-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-[#19388A]/30 border-2 border-[#4F91CD]/40 flex items-center justify-center">
                    <span className="text-4xl">🔐</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-green-500/90 border-2 border-[#0a0a0a] flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Simulating OTP Authentication</h2>
                  <p className="text-sm text-white/40">
                    A 6-digit code was sent to <span className="text-white/70">{email}</span>
                  </p>
                </div>
              </div>

              {/* Fake OTP digits filling in */}
              <div className="flex gap-2 justify-center">
                {['4', '2', '7', '8', '3', '1'].map((digit, i) => (
                  <div
                    key={i}
                    className="h-12 w-10 rounded-xl border border-[#4F91CD]/40 bg-[#19388A]/20 text-center text-lg font-bold text-[#4F91CD] flex items-center justify-center transition-all"
                    style={{ opacity: i < (5 - otpCountdown) + 1 ? 1 : 0.15 }}
                  >
                    {i < (5 - otpCountdown) + 1 ? digit : '•'}
                  </div>
                ))}
              </div>

              {/* Simulation notice */}
              <div className="rounded-2xl border border-[#4F91CD]/20 bg-[#19388A]/15 px-4 py-3.5 text-left">
                <div className="flex items-start gap-3">
                  <span className="text-base mt-0.5">💡</span>
                  <div>
                    <p className="text-xs font-semibold text-[#4F91CD] mb-0.5">Simulation mode</p>
                    <p className="text-xs text-white/50 leading-relaxed">
                      This is a demo — OTP auth via Auth0 or Firebase would be integrated at launch. Redirecting in{' '}
                      <span className="text-white/80 font-semibold">{otpCountdown}s</span>…
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-[#4F91CD] rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((5 - otpCountdown) / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* STEP 3 — Team selection */}
          {step === 'team' && (
            <div className="space-y-4 pb-28">
              <div>
                <h2 className="text-xl font-black text-white leading-tight">
                  Which team would you<br />
                  <span className="text-[#FFD141]">die for? 🔥</span>
                </h2>
                <p className="text-sm text-white/40 mt-1.5">
                  Your home team — you'll get exclusive updates, fan chat, and match-day perks from them all season.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {IPL_TEAMS.map(team => {
                  const isSelected = selected === team.id
                  const isLight = team.id === 'CSK'
                  return (
                    <button
                      key={team.id}
                      onClick={() => setSelected(team.id)}
                      style={isSelected ? { backgroundColor: team.primary, borderColor: team.secondary } : {}}
                      className={`relative rounded-2xl border-2 p-3.5 text-left transition-all duration-200 active:scale-95 ${
                        isSelected ? 'ring-2 ring-offset-2 ring-offset-[#0a0a0a]' : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <div className="text-2xl mb-1">{team.emoji}</div>
                      <div className={`text-base font-black ${isSelected && isLight ? 'text-black' : 'text-white'}`}>{team.short}</div>
                      <div className={`text-[10px] leading-tight mt-0.5 ${isSelected && isLight ? 'text-black/60' : 'text-white/45'}`}>{team.name}</div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-white/30 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white">✓</span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky CTA for team step */}
      {step === 'team' && (
        <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4"
          style={{ background: 'linear-gradient(to top, #0a0a0a 60%, transparent)' }}
        >
          {selected && (() => {
            const team = IPL_TEAMS.find(t => t.id === selected)!
            return (
              <div
                className="rounded-2xl border px-4 py-2.5 text-sm mb-3"
                style={{ backgroundColor: team.primary + '22', borderColor: team.secondary + '44' }}
              >
                <span className="font-semibold text-white">"{team.tagline}"</span>
                <span className="text-white/40 ml-2">— {team.name}</span>
              </div>
            )
          })()}
          <button
            onClick={handleFinish}
            disabled={!selected}
            className="w-full rounded-xl py-3.5 text-sm font-bold text-white disabled:opacity-40 active:scale-95 transition-all"
            style={selected ? { backgroundColor: IPL_TEAMS.find(t => t.id === selected)!.primary } : { backgroundColor: '#19388A' }}
          >
            Enter the Stadium 🏟️
          </button>
        </div>
      )}
    </div>
  )
}
