import { useState } from 'react'
import { FOOD_ITEMS } from '../data/mockData'
import { MOCK_SEAT } from '../data/mockData'

const CATEGORIES = ['All', 'Snacks', 'Meals', 'Beverages', 'Desserts']

export default function FoodScreen() {
  const [cat, setCat] = useState('All')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [ordered, setOrdered] = useState(false)

  const visible = cat === 'All' ? FOOD_ITEMS : FOOD_ITEMS.filter(f => f.category === cat)
  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = FOOD_ITEMS.find(f => f.id === id)
    return sum + (item?.price ?? 0) * qty
  }, 0)
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)

  const add = (id: string) => setCart(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
  const remove = (id: string) => setCart(prev => {
    const next = { ...prev }
    if ((next[id] ?? 0) <= 1) delete next[id]
    else next[id]--
    return next
  })

  if (ordered) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-4">
        <div className="text-5xl">🛵</div>
        <h2 className="text-xl font-black text-white">Order Placed!</h2>
        <p className="text-sm text-white/50">Delivering to Section {MOCK_SEAT.section}, Row {MOCK_SEAT.row}, Seat {MOCK_SEAT.seat}</p>
        <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 mt-2">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-white/40">Status</span>
            <span className="text-xs font-semibold text-amber-400">Preparing ⏳</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-xs text-white/40">ETA</span>
            <span className="text-xs font-semibold text-white">~12 minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-white/40">Order ID</span>
            <span className="text-xs font-mono text-white/60">#WK-{Math.floor(Math.random() * 9000) + 1000}</span>
          </div>
        </div>
        <button
          onClick={() => { setOrdered(false); setCart({}) }}
          className="mt-2 text-xs text-blue-400 underline"
        >
          Place another order
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Fixed header — never scrolls */}
      <div className="shrink-0">
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-base font-bold text-white">Food & Drinks</h2>
          <p className="text-xs text-white/40">Delivered to your seat · Section {MOCK_SEAT.section}, Row {MOCK_SEAT.row}</p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                cat === c
                  ? 'bg-blue-500 text-white'
                  : 'border border-white/10 bg-white/5 text-white/50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable food grid */}
      <div className="flex-1 overflow-y-auto pb-28">
      <div className="px-4 grid grid-cols-2 gap-3">
        {visible.map(item => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-3 flex flex-col">
            <div className="text-3xl mb-2 text-center">{item.emoji}</div>
            <p className="text-sm font-semibold text-white leading-snug">{item.name}</p>
            <p className="text-xs text-white/40 mt-0.5 mb-3">₹{item.price}</p>
            <div className="mt-auto">
              {cart[item.id] ? (
                <div className="flex items-center justify-between rounded-xl bg-blue-500/20 border border-blue-500/30 px-2 py-1">
                  <button onClick={() => remove(item.id)} className="text-white font-bold w-6 text-center">−</button>
                  <span className="text-sm font-bold text-white">{cart[item.id]}</span>
                  <button onClick={() => add(item.id)} className="text-white font-bold w-6 text-center">+</button>
                </div>
              ) : (
                <button
                  onClick={() => add(item.id)}
                  className="w-full rounded-xl bg-white/10 border border-white/10 py-1.5 text-xs font-semibold text-white active:bg-white/20 transition-colors"
                >
                  Add
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      </div>

      {/* Cart bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-4 z-20">
          <button
            onClick={() => setOrdered(true)}
            className="w-full rounded-2xl bg-blue-500 px-5 py-3.5 flex items-center justify-between shadow-2xl shadow-blue-500/30 active:scale-95 transition-transform"
          >
            <span className="text-sm font-bold text-white">{cartCount} item{cartCount > 1 ? 's' : ''}</span>
            <span className="text-sm font-bold text-white">Order · ₹{total}</span>
          </button>
        </div>
      )}
    </div>
  )
}
