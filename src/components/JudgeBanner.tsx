import { useState } from 'react'

export default function JudgeBanner() {
  const [open, setOpen] = useState(false)

  return (
    <div className="shrink-0 bg-white text-[#111] w-full z-50">
      {/* Thin strip — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-1.5 text-left"
      >
        <span className="text-[11px] font-semibold tracking-tight">
          👋 Hey Judges — Deployment Log &amp; Design Rationale
        </span>
        <span className="text-[11px] font-bold ml-2 shrink-0">{open ? '▲ close' : '▼ read'}</span>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-4 pb-4 pt-1 text-[11px] leading-relaxed border-t border-black/10 space-y-2">
          <p>
            Selection is based on 3 criteria, so here's how this app maps to each:
          </p>

          <div>
            <p className="font-bold">Innovation</p>
            <p>
              I always bet on full vertical integration. To analyse gate density, two options to count
              people in the queue:
            </p>
            <p className="mt-1">
              (1) VOIP cameras per gate, shipped &amp; installed 2–5 days pre-match, 3 cameras per gate,
              each capturing ~100 people in queue.
            </p>
            <p>
              (2) Laser scanners — one at queue start, one at entry.
            </p>
            <p className="mt-1">
              Laser scanners win. Cameras fail in rain or low light, making them unreliable. Scanners
              work in all conditions.
            </p>
          </div>

          <div>
            <p className="font-bold">Impact</p>
            <p>
              People lose sleep over these matches. This app owns the full experience — from leaving
              home → finding your gate → getting to your seat → ordering food → staying connected with
              your fan base. One app, end to end.
            </p>
          </div>

          <div>
            <p className="font-bold">Execution</p>
            <p>
              Vibe-coded in 3 hours. Covers authentication, ticket booking, gate navigation, seat
              mapping, nearest washroom, food ordering, and live tournament chat. Next step: plug in
              laser sensors or camera feed for real-time density count.
            </p>
          </div>

          <p className="font-semibold">Good hackathon. 🏏</p>
        </div>
      )}
    </div>
  )
}
