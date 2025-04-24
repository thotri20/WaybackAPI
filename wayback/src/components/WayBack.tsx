'use client'

import { useState } from 'react'

export default function WayBack() {
  const [url, setUrl] = useState('')
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null)
  const [timestamp, setTimestamp] = useState({
    year: '2020',
    month: '01',
    day: '01',
    hour: '00',
  })

  const pad = (num: string, size = 2) => num.padStart(size, '0')

  const buildTimestamp = () => {
    const { year, month, day } = timestamp
    return `${year}${pad(month)}${pad(day)}010000`
  }

  const fetchSnapshot = async () => {
    const ts = buildTimestamp()
    const res = await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}&timestamp=${ts}`)
    const data = await res.json()

    const snap = data.archived_snapshots?.closest?.url
    setSnapshotUrl(snap || null)
  }

  return (
    <div className="space-y-6">
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

      {/* <div>
        <label className="block text-sm font-medium mb-1">Time (00–23)</label>
        <input
          type="number"
          min="0"
          max="23"
          value={timestamp.hour}
          onChange={(e) => setTimestamp({ ...timestamp, hour: e.target.value })}
          className="border p-2 w-24"
        />
      </div> */}

      <button onClick={fetchSnapshot} className="bg-blue-600 text-white px-4 py-2 rounded">
        Finn arkivert side
      </button>

      {snapshotUrl ? (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Arkivert versjon</h2>
          <iframe
            src={snapshotUrl}
            title="Wayback Snapshot"
            className="w-screen h-[600px] border"
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
        <div className="mt-6 text-red-500">
          Beklager, ingen arkivert versjon funnet for denne datoen.
        </div>
      )}
    </div>
  )
}
