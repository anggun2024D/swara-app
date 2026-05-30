// src/hooks/useBroadcast.ts
import { useState } from 'react'
import { broadcastService, BroadcastPayload } from '@/services/broadcast.service'
import toast from 'react-hot-toast'

export function useBroadcast() {
  const [isLoading, setIsLoading] = useState(false)

  const send = async (payload: BroadcastPayload) => {
    if (!payload.title.trim() || !payload.message.trim()) return null

    setIsLoading(true)
    try {
      const result = await broadcastService.send(payload)
      toast.success(`Broadcast dikirim ke ${result.data.total_penerima} pengguna`)
      return result
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Gagal mengirim broadcast'
      toast.error(msg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { send, isLoading }
}