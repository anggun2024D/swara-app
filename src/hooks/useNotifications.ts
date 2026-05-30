// hooks/useNotifications.ts
import { useState, useEffect, useCallback } from 'react'
import { notifikasiService, type Notifikasi } from '@/services/notifications.service'
import { getErrorMessage } from '@/services/api'

export function useNotifications() {
  const [notifikasi, setNotifikasi]   = useState<Notifikasi[]>([])
  const [belumDibaca, setBelumDibaca] = useState(0)
  const [isLoading, setIsLoading]     = useState(true)
  const [error, setError]             = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await notifikasiService.getAll()
      setNotifikasi(res.notifikasi)
      setBelumDibaca(res.belum_dibaca)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ← Gabung jadi satu useEffect: fetch langsung + polling 30 detik
  useEffect(() => {
    fetch()
    const interval = setInterval(fetch, 30_000)
    return () => clearInterval(interval)
  }, [fetch])

  const markAsRead = async (id: string) => {
    setNotifikasi(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    setBelumDibaca(prev => Math.max(0, prev - 1))
    try {
      await notifikasiService.markAsRead(id)
    } catch {
      fetch()
    }
  }

  const markAllAsRead = async () => {
    setNotifikasi(prev => prev.map(n => ({ ...n, is_read: true })))
    setBelumDibaca(0)
    try {
      await notifikasiService.markAllAsRead()
    } catch {
      fetch()
    }
  }

  const remove = async (id: string) => {
    setNotifikasi(prev => prev.filter(n => n.id !== id))
    try {
      await notifikasiService.destroy(id)
    } catch {
      fetch()
    }
  }

  return { notifikasi, belumDibaca, isLoading, error, markAsRead, markAllAsRead, remove, refetch: fetch }
}