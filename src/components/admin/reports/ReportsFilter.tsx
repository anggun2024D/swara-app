'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import type { ReportFilters } from '@/types'

interface Category {
  id: number
  nama: string
}

interface ReportsFilterProps {
  filters: ReportFilters
  setFilters: (filters: ReportFilters) => void
}

const statusOptions = [
  { value: '',             label: 'Semua Status'  },
  { value: 'tersubmit',    label: 'Tersubmit'     },
  { value: 'diverifikasi', label: 'Diverifikasi'  },
  { value: 'diproses',     label: 'Diproses'      },
  { value: 'selesai',      label: 'Selesai'       },
  { value: 'ditolak',      label: 'Ditolak'       },
]

export default function ReportsFilter({ filters, setFilters }: ReportsFilterProps) {
  const [categories, setCategories] = useState<Category[]>([])

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // ✅ Sinkronisasi URL query params → filters saat komponen mount atau URL berubah
  // Dipicu saat AdminTopbar search redirect ke /admin/reports?search=... atau ?daerah=...
  useEffect(() => {
    const search  = searchParams.get('search')  ?? undefined
    const daerah  = searchParams.get('daerah')  ?? undefined
    const status  = searchParams.get('status')  ?? undefined
    const catId   = searchParams.get('category_id')

    setFilters({
      ...filters,
      ...(search    !== undefined && { search }),
      ...(daerah    !== undefined && { daerah }),
      ...(status    !== undefined && { status }),
      ...(catId                   && { category_id: Number(catId) }),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]) // hanya re-run saat URL berubah

  // ✅ Sinkronisasi filters → URL (agar URL selalu mencerminkan state filter aktif)
  function updateFilter(newFilters: ReportFilters) {
    setFilters(newFilters)

    const params = new URLSearchParams()
    if (newFilters.search)      params.set('search',      newFilters.search)
    if (newFilters.daerah)      params.set('daerah',      newFilters.daerah)
    if (newFilters.status)      params.set('status',      newFilters.status)
    if (newFilters.category_id) params.set('category_id', String(newFilters.category_id))

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.replace(newUrl, { scroll: false })
  }

  // Fetch kategori dari public endpoint
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/kategori`)
      .then(r => r.json())
      .then(res => { if (res.success) setCategories(res.data) })
      .catch(() => {})
  }, [])

  return (
    <div className="flex gap-2 flex-wrap">
      <select
        value={filters.status ?? ''}
        onChange={e => updateFilter({ ...filters, status: e.target.value })}
        className="px-3 py-2 border border-border rounded-xl text-sm bg-white"
      >
        {statusOptions.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select
        value={filters.category_id ?? ''}
        onChange={e => updateFilter({
          ...filters,
          category_id: e.target.value ? Number(e.target.value) : undefined,
        })}
        className="px-3 py-2 border border-border rounded-xl text-sm bg-white"
      >
        <option value="">Semua Kategori</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.nama}</option>
        ))}
      </select>

      {/* Tampilkan badge filter aktif dari URL search */}
      {(filters.search || filters.daerah) && (
        <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-xl text-sm text-primary">
          <span>
            {filters.search  && <>Kata kunci: <strong>"{filters.search}"</strong></>}
            {filters.daerah  && <>Wilayah: <strong>"{filters.daerah}"</strong></>}
          </span>
          <button
            onClick={() => updateFilter({ ...filters, search: undefined, daerah: undefined })}
            className="ml-1 text-primary/60 hover:text-primary font-bold leading-none"
            title="Hapus filter"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}