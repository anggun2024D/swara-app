'use client'

import { FileText, FolderTree, MapPin, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useKategori } from '@/hooks/useKategori'

interface PreviewPanelProps {
  formData: {
    judul:       string
    deskripsi:   string
    category_id: string
    priority:    string
    address:     string
    latitude:    string
    longitude:   string
  }
  imageFiles: File[]
}

export default function PreviewPanel({ formData, imageFiles }: PreviewPanelProps) {
  const { kategori } = useKategori()
  const kategoriLabel = kategori.find(k => String(k.id) === formData.category_id)?.nama ?? ''

  const filledFields = [
    formData.judul,
    formData.deskripsi,
    formData.category_id,
    formData.priority,
    formData.address,
    formData.latitude,
  ].filter(Boolean).length
  const progress = Math.round((filledFields + (imageFiles.length > 0 ? 1 : 0)) / 8 * 100)

  const priorityLabel: Record<string, string> = {
    rendah: '🟢 Rendah', sedang: '🔵 Sedang',
    tinggi: '🟡 Tinggi', urgent: '🔴 Urgent',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="card p-5"
    >
      <h3 className="font-extrabold text-text mb-4">Preview Laporan</h3>

      <div className="mb-5">
        <div className="flex justify-between text-xs font-semibold text-muted mb-1">
          <span>Kelengkapan Data</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        <PreviewItem icon={FileText} label="Judul"    value={formData.judul    || 'Belum diisi'} />
        <PreviewItem icon={FolderTree} label="Kategori" value={kategoriLabel    || 'Belum dipilih'} />
        <PreviewItem icon={MapPin}    label="Alamat"  value={formData.address  || 'Belum diisi'} />
        <PreviewItem icon={AlertCircle} label="Prioritas" value={priorityLabel[formData.priority] || 'Tidak diset'} />
        {formData.latitude && formData.longitude && (
          <PreviewItem
            icon={MapPin}
            label="Koordinat GPS"
            value={`${parseFloat(formData.latitude).toFixed(4)}, ${parseFloat(formData.longitude).toFixed(4)}`}
          />
        )}
        <PreviewItem
          icon={AlertCircle}
          label="Foto"
          value={imageFiles.length > 0 ? `${imageFiles.length} foto dipilih` : 'Belum ada foto'}
        />
      </div>

      <div className="mt-5 p-3 bg-primary-light rounded-xl border border-primary/20">
        <div className="flex items-center gap-2 text-primary font-bold text-xs mb-1">
          <AlertCircle size={14} />
          <span>Tips Pelaporan</span>
        </div>
        <p className="text-xs text-text/70">
          Foto yang jelas dan koordinat GPS yang akurat memudahkan tim lapangan menemukan lokasi laporan kamu.
        </p>
      </div>
    </motion.div>
  )
}

function PreviewItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  const isEmpty = ['Belum diisi', 'Belum dipilih', 'Belum ada foto'].includes(value)
  return (
    <div className="flex items-start gap-3 pb-2 border-b border-gray-100">
      <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-muted flex-shrink-0">
        <Icon size={14} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted">{label}</p>
        <p className={`text-sm font-semibold ${isEmpty ? 'text-gray-400' : 'text-text'}`}>{value}</p>
      </div>
    </div>
  )
}