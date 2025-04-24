'use client'

import { useState } from 'react'

export default function WayBack() {
  const [url, setUrl] = useState('')
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null)
  const [foundDate, setFoundDate] = useState<string | null>(null)
  const [timestamp, setTimestamp] = useState({
    year: '2020',
    month: '01',
    day: '01',
    hour: '00',
  })

  const pad = (num: string, size = 2) => num.padStart(size, '0')

  const buildDate = () => {
    const { year, month, day, hour } = timestamp
    return new Date(`${year}-${pad(month)}-${pad(day)}T${pad(hour)}:00:00Z`)
  }

  const buildTimestampFromDate = (date: Date) => {
    const y = date.getUTCFullYear()
    const m = pad((date.getUTCMonth() + 1).toString())
    const d = pad(date.getUTCDate().toString())
    const h = pad(date.getUTCHours().toString())
    return `${y}${m}${d}${h}0000`
  }

  const fetchClosestSnapshot = async () => {
    const baseDate = buildDate()
    const maxOffset = 14 

    for (let offset = 0; offset <= maxOffset; offset++) {
      for (const direction of [-1, 1]) {
        const attempt = new Date(baseDate)
        attempt.setUTCDate(baseDate.getUTCDate() + offset * direction)

        const ts = buildTimestampFromDate(attempt)
        const res = await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}&timestamp=${ts}`)
        const data = await res.json()

        const snap = data.archived_snapshots?.closest?.url
        const foundTs = data.archived_snapshots?.closest?.timestamp

        if (snap) {
          setSnapshotUrl(snap)
          if (foundTs) {
            const year = foundTs.slice(0, 4)
            const month = foundTs.slice(4, 6)
            const day = foundTs.slice(6, 8)
            const hour = foundTs.slice(8, 10)
            setFoundDate(`${day}.${month}.${year} kl. ${hour}`)
          }
          return
        }
      }
    }

    setSnapshotUrl(null)
    setFoundDate(null)
  }

  return (
    <div className="space-y-6 px-4">
      <div className='space-y-6 px-4 max-w-xl mx-auto'>
        <input
          type="text"
          placeholder="Skriv inn URL (f.eks. vg.no)"
          className="border p-2 w-full"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Dag</label>
            <input
              type="number"
              min="1"
              max="31"
              value={timestamp.day}
              onChange={(e) => setTimestamp({ ...timestamp, day: e.target.value })}
              className="border p-2 w-24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Måned</label>
            <input
              type="number"
              min="1"
              max="12"
              value={timestamp.month}
              onChange={(e) => setTimestamp({ ...timestamp, month: e.target.value })}
              className="border p-2 w-24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">År</label>
            <input
              type="number"
              value={timestamp.year}
              onChange={(e) => setTimestamp({ ...timestamp, year: e.target.value })}
              className="border p-2 w-28"
            />
          </div>
        </div>
        <button onClick={fetchClosestSnapshot} className="bg-blue-600 text-white px-4 py-2 rounded">
          Finn arkivert side
        </button>
      </div>

      {snapshotUrl ? (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">
            Arkivert versjon {foundDate && `(nærmest valgt: ${foundDate})`}
          </h2>
          <iframe
            src={snapshotUrl}
            title="Wayback Snapshot"
            className="w-screen max-w-none h-[600px] border-0"
          />
          <div className="mt-4">
            <a
              href={snapshotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Åpne i ny fane
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-6 text-center text-red-500">
          Beklager, ingen arkivert versjon funnet for denne datoen eller nærliggende dager.
        </div>
      )}
    </div>
  )
}
