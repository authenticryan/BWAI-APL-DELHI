import { useStadium } from '../context/StadiumContext'

export default function AnnouncementBanner() {
  const { announcement, dismissAnnouncement } = useStadium()
  if (!announcement) return null

  return (
    <div className="mx-4 mb-3 flex items-start gap-3 rounded-2xl border border-blue-500/40 bg-blue-500/15 px-4 py-3">
      <span className="text-lg">📢</span>
      <p className="flex-1 text-sm text-blue-200 leading-snug">{announcement}</p>
      <button
        onClick={dismissAnnouncement}
        className="shrink-0 text-blue-400/60 hover:text-blue-300 text-lg leading-none"
      >
        ×
      </button>
    </div>
  )
}
