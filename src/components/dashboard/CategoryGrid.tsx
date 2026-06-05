'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import {
  Trash2, Route, Building2, Leaf, Users, Shield, Folder
} from 'lucide-react'
import { KategoriItem } from '@/hooks/useUserDashboard'

// ============================================================
// KONFIGURASI IKON
// ============================================================
const ICON_MAP: Record<string, React.ElementType> = {
  'sampah':           Trash2,
  'jalan':            Route,
  'fasilitas umum':   Building2,
  'lingkungan':       Leaf,
  'pelayanan publik': Users,
  'keamanan':         Shield,
}

// ============================================================
// KONFIGURASI WARNA IKON per kategori
// ============================================================
const COLOR_MAP: Record<string, string> = {
  'sampah':           'bg-green-400',
  'lingkungan':       'bg-green-400',
  'jalan':            'bg-blue-400',
  'fasilitas umum':   'bg-blue-400',
  'pelayanan publik': 'bg-amber-400',
  'keamanan':         'bg-red-400',
}

// ============================================================
// KONFIGURASI POSISI (left%, top%) tiap kategori di dalam container
// Sesuaikan nilai ini jika ingin menggeser posisi chip
// ============================================================
const POSITION_MAP: Record<string, { left: string; top: string }> = {
  'sampah':           { left: '6%',  top: '58%' },
  'lingkungan':       { left: '8%',  top: '10%' },
  'jalan':            { left: '36%', top: '50%' },
  'fasilitas umum':   { left: '38%', top: '5%'  },
  'pelayanan publik': { left: '75%', top: '8%' },
  'keamanan':         { left: '69%', top: '58%' },
}

// ============================================================
// KONFIGURASI GARIS PENGHUBUNG antar kategori
// ============================================================
const CONNECTIONS: [string, string][] = [
  ['sampah',         'lingkungan'],
  ['lingkungan',     'fasilitas umum'],
  ['fasilitas umum', 'jalan'],
  ['jalan',          'pelayanan publik'],
  ['jalan',          'keamanan'],
  ['pelayanan publik','keamanan'],
]

// ============================================================
// BACKGROUND IMAGE
// Ganti nilai BG_IMAGE dengan path gambar kamu, contoh:
//   '/images/kota-lamongan.png'
//   '/lamongan.png'
// Atau kosongkan string untuk tanpa gambar: ''
// ============================================================
const BG_IMAGE = ''

// ============================================================
// HELPER
// ============================================================
function getIcon(nama: string): React.ElementType {
  return ICON_MAP[nama.toLowerCase().trim()] ?? Folder
}

function getColor(nama: string): string {
  return COLOR_MAP[nama.toLowerCase().trim()] ?? 'bg-gray-400'
}

function getPosition(nama: string) {
  return POSITION_MAP[nama.toLowerCase().trim()] ?? { left: '50%', top: '50%' }
}

function getDotColor(nama: string): string {
  const colorMap: Record<string, string> = {
    'sampah':           '#22c55e',
    'lingkungan':       '#22c55e',
    'jalan':            '#2563eb',
    'fasilitas umum':   '#2563eb',
    'pelayanan publik': '#f59e0b',
    'keamanan':         '#ef4444',
  }
  return colorMap[nama.toLowerCase().trim()] ?? '#888'
}

// ============================================================
// SKELETON LOADING
// ============================================================
function Skeleton() {
  return (
    <div className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 animate-pulse w-36">
      <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0" />
      <div className="h-3 bg-gray-200 rounded w-full" />
    </div>
  )
}

// ============================================================
// KOMPONEN UTAMA
// ============================================================
interface Props {
  kategori: KategoriItem[]
  isLoading: boolean
}

export default function CategoryGrid({ kategori, isLoading }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef  = useRef<SVGSVGElement>(null)

  // Gambar ulang garis SVG setiap kali data/ukuran berubah
  useEffect(() => {
    const draw = () => {
      const wrap = wrapRef.current
      const svg  = svgRef.current
      if (!wrap || !svg) return

      svg.innerHTML = ''
      const pr = wrap.getBoundingClientRect()

      CONNECTIONS.forEach(([a, b]) => {
        const elA = wrap.querySelector(`[data-cat="${a}"]`) as HTMLElement | null
        const elB = wrap.querySelector(`[data-cat="${b}"]`) as HTMLElement | null
        if (!elA || !elB) return

        const ra = elA.getBoundingClientRect()
        const rb = elB.getBoundingClientRect()
        const ax = ra.left - pr.left + ra.width  / 2
        const ay = ra.top  - pr.top  + ra.height / 2
        const bx = rb.left - pr.left + rb.width  / 2
        const by = rb.top  - pr.top  + rb.height / 2

        // Garis putus-putus
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', String(ax))
        line.setAttribute('y1', String(ay))
        line.setAttribute('x2', String(bx))
        line.setAttribute('y2', String(by))
        line.setAttribute('stroke', 'rgb(255, 204, 0)')
        line.setAttribute('stroke-width', '1.5')
        line.setAttribute('stroke-dasharray', '5 4')
        svg.appendChild(line)

        // Titik di ujung garis
        ;[{ x: ax, y: ay, id: a }, { x: bx, y: by, id: b }].forEach(({ x, y, id }) => {
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
          circle.setAttribute('cx', String(x))
          circle.setAttribute('cy', String(y))
          circle.setAttribute('r', '4')
          circle.setAttribute('fill', getDotColor(id))
          circle.setAttribute('stroke', 'white')
          circle.setAttribute('stroke-width', '2')
          svg.appendChild(circle)
        })
      })
    }

    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [kategori])

  return (
    <div className="mb-10">
      <h2 className="text-lg font-bold text-text mb-1">Kategori Laporan</h2>
      <p className="text-sm text-muted mb-5">
        Klik pada kategori untuk mulai melaporkan isu spesifik
      </p>

      {/* ── Container Utama ─────────────────────────────────────
          Ganti BG_IMAGE di atas untuk mengatur gambar background.
          Tinggi container bisa disesuaikan dengan min-h-[...].
      ──────────────────────────────────────────────────────── */}
      <div
        ref={wrapRef}
        className="relative w-full min-h-[300px] rounded-2xl overflow-hidden"
        style={{}}
      >
       

        {/* Layer SVG untuk garis penghubung */}
        <svg
  ref={svgRef}
  className="absolute inset-0 w-full h-full pointer-events-none z-10"
  overflow="visible"
/>

{/* Siluet Kota */}
<div className="absolute bottom-0 left-0 w-full h-32 opacity-[0.04] pointer-events-none z-0">
  <svg
    viewBox="0 0 1200 200"
    className="w-full h-full"
    preserveAspectRatio="none"
  >
    <path
      fill="#64748b"
      d="
      M0 200
      L0 130
      L40 130
      L40 70
      L90 70
      L90 150
      L140 150
      L140 40
      L200 40
      L200 130
      L250 130
      L250 90
      L310 90
      L310 160
      L370 160
      L370 50
      L440 50
      L440 120
      L500 120
      L500 30
      L580 30
      L580 170
      L650 170
      L650 60
      L720 60
      L720 140
      L800 140
      L800 20
      L880 20
      L880 120
      L940 120
      L940 70
      L1020 70
      L1020 160
      L1080 160
      L1080 100
      L1150 100
      L1150 200
      Z
      "
    />
  </svg>
</div>

        {/* Chip Kategori */}
        {isLoading
          ? (
            <div className="absolute inset-0 flex items-center justify-center gap-4 flex-wrap p-6">
              {[...Array(6)].map((_, i) => <Skeleton key={i} />)}
            </div>
          )
          : kategori.map((cat) => {
              const Icon     = getIcon(cat.nama)
              const color    = getColor(cat.nama)
              const { left, top } = getPosition(cat.nama)

              return (
                <Link href={`/kategori/${cat.id}`} key={cat.id}>
                  <motion.div
                    data-cat={cat.nama.toLowerCase().trim()}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.07, transition: { duration: 0.15 } }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute z-20 flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md cursor-pointer border border-white/60"
                    style={{ left, top, transform: 'translate(-50%, -50%)' }}
                  >
                    {/* Ikon bulat berwarna */}
                    <div
                      className={`w-9 h-8 ${color} rounded-full flex items-center justify-center text-white flex-shrink-0`}
                    >
                      <Icon size={18} />
                    </div>

                    {/* Label */}
                    <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                      {cat.nama}
                    </span>
                  </motion.div>
                </Link>
              )
            })}
      </div>
    </div>
  )
}