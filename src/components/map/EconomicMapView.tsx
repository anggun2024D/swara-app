'use client'

import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MapMarker } from '@/types/resource'

interface EconomicMapViewProps {
  markers: MapMarker[]
  selectedMarker: MapMarker | null
  onMarkerClick: (marker: MapMarker) => void
}

// Custom marker icons per kategori
const createCategoryIcon = (color: string, icon: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px ${color}60;
        border: 2px solid white;
      ">
        <span style="transform: rotate(45deg); font-size: 16px;">${icon}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  })
}

const CATEGORY_ICONS: Record<number, { color: string; icon: string }> = {
  1: { color: '#F59E0B', icon: '🏭' },
  2: { color: '#10B981', icon: '🌾' },
  3: { color: '#3B82F6', icon: '🐟' },
  4: { color: '#8B5CF6', icon: '🏝️' },
}

const EconomicMapView: React.FC<EconomicMapViewProps> = ({
  markers,
  selectedMarker,
  onMarkerClick,
}) => {
  // Indonesia center
  const center: [number, number] = [-2.5, 118.0]

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {markers.map((marker) => {
        if (!marker.lokasi.latitude || !marker.lokasi.longitude) return null

        const catConfig = CATEGORY_ICONS[marker.category?.id] || { color: '#6366F1', icon: '📍' }
        const icon = createCategoryIcon(catConfig.color, catConfig.icon)

        return (
          <Marker
            key={marker.id}
            position={[marker.lokasi.latitude, marker.lokasi.longitude]}
            icon={icon}
            eventHandlers={{
              click: () => onMarkerClick(marker),
            }}
          >
            <Popup>
              <div className="p-1 min-w-[200px]">
                <h3 className="font-bold text-sm mb-1">{marker.resource_name}</h3>
                <p className="text-xs text-gray-600 mb-1">{marker.category?.name}</p>
                <p className="text-xs text-gray-500">{marker.lokasi.address}</p>
                {marker.investment_needed && (
                  <p className="text-xs text-emerald-600 mt-1 font-medium">
                    💰 Rp {Number(marker.investment_needed).toLocaleString('id-ID')}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs capitalize bg-gray-100 px-1.5 py-0.5 rounded">{marker.business_scale}</span>
                  <span className="text-xs text-indigo-600">Score: {marker.verification_score}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

export default EconomicMapView
