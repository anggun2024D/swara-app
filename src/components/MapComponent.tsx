'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapReport } from '@/hooks/useMapReports'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const statusColor: Record<string, string> = {
  tersubmit:   '#6b7280',
  diproses:    '#f59e0b',
  selesai:     '#22c55e',
  ditolak:     '#ef4444',
  diverifikasi:'#3b82f6',
}

const statusLabel: Record<string, string> = {
  tersubmit:    'Tersubmit',
  diproses:     'Diproses',
  selesai:      'Selesai',
  ditolak:      'Ditolak',
  diverifikasi: 'Diverifikasi',
}

function createMarkerIcon(color: string, isUrgent: boolean) {
  const ring = isUrgent
    ? `box-shadow:0 0 0 3px #ef4444,0 2px 8px rgba(0,0,0,0.3);`
    : `box-shadow:0 2px 8px rgba(0,0,0,0.25);`
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${color};
      width:22px;height:22px;
      border-radius:50%;
      border:2.5px solid white;
      ${ring}
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => { map.setView(center, 12) }, [map, center])
  return null
}

interface Props {
  markers?: MapReport[]   // optional — kalau tidak dipass, tidak tampil marker
  filter?: string         // optional — filter by status
  height?: string         // optional — default h-80
}

export default function MapComponent({
  markers = [],
  filter = 'all',
  height = 'h-80',
}: Props) {
  const filtered = filter === 'all'
    ? markers
    : markers.filter(m => m.status === filter)

  return (
    <MapContainer
      center={[-7.1195, 112.4316]}
      zoom={12}
      className={`${height} w-full z-0`}
      style={{ background: '#e8f0eb' }}
    >
      <MapController center={[-7.1195, 112.4316]} />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {filtered.map(m => (
        <Marker
          key={m.id}
          position={[m.lat, m.lng]}
          icon={createMarkerIcon(statusColor[m.status] ?? '#6b7280', m.is_urgent)}
        >
          <Popup>
            <div className="text-sm space-y-1 min-w-[160px]">
              <p className="font-bold leading-snug">{m.title}</p>
              {m.is_urgent && (
                <span className="inline-block text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                  🚨 Urgent
                </span>
              )}
              <p className="text-gray-500 text-xs">{m.kategori}</p>
              {m.address && <p className="text-gray-500 text-xs">{m.address}</p>}
              <p className="text-gray-600 text-xs">Pelapor: {m.pelapor}</p>
              <span
                className="inline-block text-xs text-white px-2 py-0.5 rounded-full mt-1"
                style={{ background: statusColor[m.status] ?? '#6b7280' }}
              >
                {statusLabel[m.status] ?? m.status}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}