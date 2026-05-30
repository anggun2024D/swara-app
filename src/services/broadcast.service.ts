// src/services/broadcast.service.ts
import api from './api'

export interface BroadcastPayload {
  title: string
  message: string
  target_role?: 'user' | 'admin' | null
}

export interface BroadcastResponse {
  success: boolean
  message: string
  data: {
    total_penerima: number
    target_role: string
  }
}

export const broadcastService = {
  send: async (payload: BroadcastPayload): Promise<BroadcastResponse> => {
    const { data } = await api.post('/admin/broadcast', payload)
    return data
  },
}