'use client'

import { FileText, FolderOpen } from 'lucide-react'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  title: string
  description: string
  icon?: 'FileText' | 'FolderOpen'
}

export default function EmptyState({ title, description, icon = 'FileText' }: EmptyStateProps) {
  const Icon = icon === 'FileText' ? FileText : FolderOpen
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-muted">
        <Icon size={28} />
      </div>
      <h3 className="font-bold text-text">{title}</h3>
      <p className="text-sm text-muted">{description}</p>
    </motion.div>
  )
}