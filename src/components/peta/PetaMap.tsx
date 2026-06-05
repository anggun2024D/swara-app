'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { UserReport } from '@/hooks/useUserReports'

// Icon per kategori — pakai emoji + warna status
const statusColor: Record<string, string> = {
  tersubmit:    '#3b82f6',
  diverifikasi: '#6366f1',
  diproses:     '#f59e0b',
  selesai:      '#22c55e',
  ditolak:      '#ef4444',
}

// Icon kategori (emoji)
const kategoriIcon: Record<string, string> = {
  'jalan':      '',
  'lampu':      '',
  'drainase':   '',
  'sampah':     '',
  'taman':      '',
  'default':    '',
}

function getKategoriEmoji(nama: string): string {
  const key = nama.toLowerCase()
  for (const k of Object.keys(kategoriIcon)) {
    if (key.includes(k)) return kategoriIcon[k]
  }
  return kategoriIcon.default
}

function createReportIcon(report: UserReport, isSelected: boolean) {
  const color = statusColor[report.status] ?? '#6b7280'
  const emoji = getKategoriEmoji(report.kategori.nama)
  const size  = isSelected ? 44 : 36
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background:${color};
        width:${size}px; height:${size}px;
        border-radius:50%;
        border:${isSelected ? '3px' : '2px'} solid white;
        box-shadow:${isSelected
          ? `0 0 0 3px ${color}55, 0 4px 12px rgba(0,0,0,0.25)`
          : '0 2px 8px rgba(0,0,0,0.2)'};
        display:flex; align-items:center; justify-content:center;
        font-size:${isSelected ? '18px' : '15px'};
        transition: all 0.2s;
      ">${emoji}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

function MapCenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], 14, { animate: true })
  }, [lat, lng, map])
  return null
}

function MapClickClose({ onClose }: { onClose: () => void }) {
  useMapEvents({ click: onClose })
  return null
}

interface Props {
  reports:    UserReport[]
  selected:   UserReport | null
  onSelect:   (r: UserReport) => void
  onClose:    () => void
}

export default function PetaMap({ reports, selected, onSelect, onClose }: Props) {
  return (
    <MapContainer
      center={[-7.1195, 112.4153]}
      zoom={12}
      className="h-full w-full z-0"
      style={{ background: '#e8f0eb' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap'
      />
      <MapClickClose onClose={onClose} />
      {selected && (
        <MapCenter
          lat={selected.lokasi.latitude}
          lng={selected.lokasi.longitude}
        />
      )}
      {reports.map(r => (
        <Marker
          key={r.id}
          position={[r.lokasi.latitude, r.lokasi.longitude]}
          icon={createReportIcon(r, selected?.id === r.id)}
          eventHandlers={{ click: (e) => { e.originalEvent.stopPropagation(); onSelect(r) } }}
        />
      ))}
    </MapContainer>
  )
}