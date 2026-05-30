// utils/date.ts — buat file ini
import { formatDistanceToNow, parse } from 'date-fns'
import { id } from 'date-fns/locale'

const BULAN: Record<string, string> = {
  'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
  'Mei': '05', 'Jun': '06', 'Jul': '07', 'Ags': '08',
  'Sep': '09', 'Okt': '10', 'Nov': '11', 'Des': '12',
}

export function parseBackendDate(str: string): Date {
  // Format: "10 Mei 2025 14:30"
  const [day, mon, year, time] = str.split(' ')
  const month = BULAN[mon] ?? '01'
  return new Date(`${year}-${month}-${day.padStart(2,'0')}T${time ?? '00:00'}:00+07:00`)
}

export function timeAgo(str: string): string {
  try {
    return formatDistanceToNow(parseBackendDate(str), {
      addSuffix: true,
      locale: id,
    })
  } catch {
    return str
  }
}

export function formatDate(str: string): string {
  try {
    return parseBackendDate(str).toLocaleDateString('id-ID', {
      day:   'numeric',
      month: 'long',
      year:  'numeric',
      timeZone: 'Asia/Jakarta',
    })
  } catch {
    return str
  }
}