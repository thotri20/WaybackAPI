'use client'

import { useState } from 'react'

export default function WaybackByDate() {
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
    const { year, month, day, hour } = timestamp
    return `${year}${pad(month)}${pad(day)}${pad(hour)}0000` 
  }

  const fetchSnapshot = async () => {
    const ts = buildTimestamp()
    const res = await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}&timestamp=${ts}`)
    const data = await res.json()

    const snap = data.archived_snapshots?.closest?.url
    setSnapshotUrl(snap || 'No snapshot found')
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Enter URL (e.g. cnn.com)"
        className="border p-2 w-full"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Day"
          min="1"
          max="31"
          value={timestamp.day}
          onChange={(e) => setTimestamp({ ...timestamp, day: e.target.value })}
          className="border p-2 w-20"
        />
        <input
          type="number"
          placeholder="Month"
          min="1"
          max="12"
          value={timestamp.month}
          onChange={(e) => setTimestamp({ ...timestamp, month: e.target.value })}
          className="border p-2 w-20"
        />
        <input
          type="number"
          placeholder="Year"
          value={timestamp.year}
          onChange={(e) => setTimestamp({ ...timestamp, year: e.target.value })}
          className="border p-2 w-24"
        />
        <input
          type="number"
          placeholder="Hour"
          min="0"
          max="23"
          value={timestamp.hour}
          onChange={(e) => setTimestamp({ ...timestamp, hour: e.target.value })}
          className="border p-2 w-20"
        />
      </div>

      <button onClick={fetchSnapshot} className="bg-blue-600 text-white px-4 py-2 rounded">
        Find Snapshot
      </button>

      {snapshotUrl && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Archived Snapshot</h2>
          <iframe
            src={snapshotUrl}
            title="Wayback Snapshot"
            className="w-full h-[600px] border"
          />
        </div>
      )}  
    </div>
  )
}
