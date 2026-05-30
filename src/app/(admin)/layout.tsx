'use client'

import AdminSidebar from '@/components/admin/layout/AdminSidebar'
import AdminTopbar from '@/components/admin/layout/AdminTopbar'
import { AuthGuard } from '@/components/guards/AuthGuard'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-bg">
        <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <div
          className={`
            transition-all
            duration-300
            ${sidebarCollapsed ? 'ml-20' : 'ml-72'}
          `}
        >
          <div className="px-6 pt-4">
            <AdminTopbar />
          </div>
          <AnimatePresence mode="wait">
            <motion.main
              key={typeof window !== 'undefined' ? window.location.pathname : ''}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="px-8 pt-8 pb-10 xl:px-10 2xl:px-12 max-w-[1700px] mx-auto w-full space-y-8"
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </AuthGuard>
  )
}