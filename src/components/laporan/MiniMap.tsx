'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const selectedIcon = L.divIcon({
  className: '',
  html: `<div style="
    background:#ef4444;width:20px;height:20px;
    border-radius:50%;border:3px solid white;
    box-shadow:0 2px 8px rgba(239,68,68,0.5);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

// Sync view saat koordinat berubah (dari geocode atau GPS)
function MapSync({ lat, lng, hasMarker }: { lat: number; lng: number; hasMarker: boolean }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], hasMarker ? 16 : 12, { animate: true })
  }, [lat, lng, hasMarker, map])
  return null
}

// Terima onMapClick via ref untuk hindari warning serializable props
function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) { onMapClick(e.latlng.lat, e.latlng.lng) },
  })
  return null
}

export interface MiniMapProps {
  lat:        number
  lng:        number
  hasMarker:  boolean
  onMapClick: (lat: number, lng: number) => void
}

export default function MiniMap({ lat, lng, hasMarker, onMapClick }: MiniMapProps) {
  return (
    <MapContainer
      center={[-7.1195, 112.4153]}
      zoom={12}
      className="h-48 w-full z-0"
      style={{ background: '#e8f0eb' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap'
      />
      <ClickHandler onMapClick={onMapClick} />
      {hasMarker && (
        <>
          <MapSync lat={lat} lng={lng} hasMarker={hasMarker} />
          <Marker position={[lat, lng]} icon={selectedIcon} />
        </>
      )}
    </MapContainer>
  )
}