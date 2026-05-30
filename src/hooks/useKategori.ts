'use client'

import { useState, useEffect } from 'react'
import api from '@/services/api'

export interface Kategori {
  id: number
  nama: string      // ← backend kirim "nama", bukan "name"
  icon_url?: string
}

export function useKategori() {
  const [kategori, setKategori]   = useState<Kategori[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api.get('/kategori')
      .then(res => {
        // response.data.data adalah array langsung
        const data = res.data.data ?? []
        setKategori(Array.isArray(data) ? data : [])
      })
      .catch(() => setKategori([]))
      .finally(() => setIsLoading(false))
  }, [])

  return { kategori, isLoading }
}