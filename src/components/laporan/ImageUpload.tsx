'use client'

import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageUploadProps {
  files: File[]
  setFiles: (files: File[]) => void
}

export default function ImageUpload({ files, setFiles }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return
    const valid = Array.from(incoming).filter(f => f.type.startsWith('image/'))
    setFiles([...files, ...valid])
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files) }}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragging ? 'border-primary bg-primary-light' : 'border-gray-300 hover:border-primary'
        }`}
      >
        <Upload className="w-10 h-10 text-muted mx-auto mb-2" />
        <p className="text-sm font-medium">Drop foto di sini atau klik untuk pilih</p>
        <p className="text-xs text-muted">JPG, PNG — maks 5MB per foto</p>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          <AnimatePresence>
            {files.map((file, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative w-16 h-16 rounded-lg overflow-hidden border border-border"
              >
                {/* Preview via object URL */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-muted hover:border-primary transition-colors"
          >
            <Upload size={18} />
          </button>
        </div>
      )}
    </div>
  )
}