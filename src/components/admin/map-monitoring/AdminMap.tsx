'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapReport } from '@/hooks/useMapReports'

const iconColors: Record<string, string> = {
  tersubmit: '#6b7280', // abu-abu
  diproses:  '#f5c400', // kuning
  selesai:   '#22c55e', // hijau
  ditolak:   '#ef4444', // merah
}

const getMarkerHtml = (m: MapReport) => {
  const color = iconColors[m.status] ?? '#6b7280'
  const ring = m.is_urgent
    ? `box-shadow:0 0 0 3px #ef4444, 0 2px 6px rgba(0,0,0,0.3);`
    : `box-shadow:0 2px 6px rgba(0,0,0,0.3);`
  return `<div style="background-color:${color};width:24px;height:24px;border-radius:50%;border:2px solid white;${ring}"></div>`
}

function MapController() {
  const map = useMap()
  useEffect(() => { map.setView([-7.1195, 112.4316], 12) }, [map])
  return null
}

interface AdminMapProps {
  reports: MapReport[]
  filter: string
}

export default function AdminMap({ reports, filter }: AdminMapProps) {
  const filtered = filter === 'all' ? reports : reports.filter(m => m.status === filter)

  return (
    <MapContainer
      center={[-7.1195, 112.4316]}
      zoom={12}
      className="h-[600px] w-full z-0"
      style={{ background: '#e8f0eb' }}
    >
      <MapController />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap'
      />
      {filtered.map(m => (
        <Marker
          key={m.id}
          position={[m.lat, m.lng]}
          icon={L.divIcon({
            className: `custom-marker-${m.status}`,
            html: getMarkerHtml(m),
            iconSize: [24, 24],
          })}
        >
          <Popup>
            <div className="text-sm space-y-1">
              <p className="font-bold">{m.title}</p>
              {m.is_urgent && (
                <span className="inline-block px-2 py-0.5 rounded-full text-xs text-white bg-red-500">
                  🚨 Urgent
                </span>
              )}
              <p className="text-gray-500">{m.kategori}</p>
              <p>Pelapor: {m.pelapor}</p>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs text-white`}
                style={{ backgroundColor: iconColors[m.status] ?? '#6b7280' }}>
                {m.status}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}