import { crowdColor } from '../context/StadiumContext'
import type { Gate } from '../data/mockData'

// Gate positions around the stadium oval (cx, cy as % of 400x360 viewBox)
const GATE_POSITIONS: Record<string, { x: number; y: number; labelX: number; labelY: number }> = {
  A: { x: 200, y: 18,  labelX: 200, labelY: 8  }, // North
  B: { x: 310, y: 60,  labelX: 326, labelY: 55 }, // North-East
  C: { x: 370, y: 165, labelX: 390, labelY: 165}, // East
  D: { x: 330, y: 275, labelX: 350, labelY: 285}, // South-East
  E: { x: 200, y: 328, labelX: 200, labelY: 344}, // South
  F: { x: 70,  y: 275, labelX: 44,  labelY: 285}, // South-West
  G: { x: 28,  y: 165, labelX: 2,   labelY: 165}, // West
  H: { x: 90,  y: 60,  labelX: 66,  labelY: 55 }, // North-West
}

// User's seat is in West Stand (Gate G area)
// Path from Gate G to seat: gate → concourse → section W
const PATH_D = 'M 28 165 L 80 165 L 120 165 L 155 175'
const SEAT_POS = { x: 155, y: 175 }
const BATHROOM_POS = { x: 100, y: 220 }

interface Props {
  gates: Gate[]
  userGate: string
}

export default function StadiumSVG({ gates, userGate }: Props) {
  const gateMap = Object.fromEntries(gates.map(g => [g.id, g]))

  return (
    <svg
      viewBox="0 0 400 360"
      className="w-full"
      style={{ maxHeight: '60vh' }}
      aria-label="Wankhede Stadium map"
    >
      {/* Background */}
      <rect width="400" height="360" fill="#0a0a0a" />

      {/* Outer stadium oval */}
      <ellipse cx="200" cy="183" rx="185" ry="160" fill="none" stroke="#ffffff18" strokeWidth="1.5" />

      {/* Playing field */}
      <ellipse cx="200" cy="183" rx="105" ry="88" fill="#1a3a1a" stroke="#2d5a2d" strokeWidth="1" />

      {/* Pitch */}
      <rect x="186" y="148" width="28" height="70" rx="3" fill="#5a4a2a" stroke="#7a6a3a" strokeWidth="0.5" />

      {/* Crease lines */}
      <line x1="186" y1="160" x2="214" y2="160" stroke="#ffffff60" strokeWidth="0.5" />
      <line x1="186" y1="206" x2="214" y2="206" stroke="#ffffff60" strokeWidth="0.5" />

      {/* Outfield circle */}
      <circle cx="200" cy="183" r="62" fill="none" stroke="#2d5a2d" strokeWidth="0.5" strokeDasharray="3 4" />

      {/* Seating sections — subtle arcs */}
      {['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].map((_, i) => {
        const angle = (i * 45 - 90) * (Math.PI / 180)
        const r = 148
        const x = 200 + r * Math.cos(angle)
        const y = 183 + r * (0.87) * Math.sin(angle)
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            className="text-[8px]" style={{ fontSize: 7 }} fill="#ffffff20" fontFamily="sans-serif">
          </text>
        )
      })}

      {/* Walking path from Gate G to seat — animated dashes */}
      <path
        d={PATH_D}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        strokeDasharray="5 3"
        strokeLinecap="round"
        opacity={0.8}
      >
        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
      </path>

      {/* Gate markers */}
      {gates.map(gate => {
        const pos = GATE_POSITIONS[gate.id]
        if (!pos) return null
        const c = crowdColor(gate.capacity)
        const isUser = gate.id === userGate
        const dotColor = gate.capacity < 40 ? '#34d399' : gate.capacity < 70 ? '#fbbf24' : '#f87171'
        return (
          <g key={gate.id}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isUser ? 9 : 7}
              fill={dotColor}
              fillOpacity={isUser ? 0.9 : 0.7}
              stroke={isUser ? '#3b82f6' : 'transparent'}
              strokeWidth={isUser ? 2.5 : 0}
            />
            {isUser && (
              <circle cx={pos.x} cy={pos.y} r={13} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 2" opacity={0.5}>
                <animate attributeName="r" values="9;14;9" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            <text
              x={pos.labelX}
              y={pos.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: 7, fontWeight: 700, fontFamily: 'sans-serif' }}
              fill="#ffffffcc"
            >
              {gate.id}
            </text>
          </g>
        )
      })}

      {/* User seat marker */}
      <g>
        <circle cx={SEAT_POS.x} cy={SEAT_POS.y} r={6} fill="#3b82f6" />
        <text x={SEAT_POS.x} y={SEAT_POS.y} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 7, fontWeight: 700, fontFamily: 'sans-serif' }} fill="white">
          YOU
        </text>
      </g>

      {/* Bathroom marker */}
      <g opacity={0.7}>
        <circle cx={BATHROOM_POS.x} cy={BATHROOM_POS.y} r={5} fill="#8b5cf6" />
        <text x={BATHROOM_POS.x} y={BATHROOM_POS.y} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 6, fontFamily: 'sans-serif' }} fill="white">
          WC
        </text>
      </g>

      {/* Center field label */}
      <text x="200" y="183" textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: 9, fontFamily: 'sans-serif' }} fill="#ffffff30">
        PITCH
      </text>
    </svg>
  )
}
