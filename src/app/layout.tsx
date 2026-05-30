import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'   // ← tambah ini

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SWARA - Suara Warga untuk Ruang dan Aset',
  description: 'Platform pelaporan infrastruktur berbasis GIS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={jakarta.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />  {/* ← tambah ini */}
        </AuthProvider>
      </body>
    </html>
  )
}