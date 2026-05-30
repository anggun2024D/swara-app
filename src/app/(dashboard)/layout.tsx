'use client'

import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { AuthGuard } from '@/components/guards/AuthGuard'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <AuthGuard requiredRole="user">
      <div className="flex min-h-screen bg-bg">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-20'}`}>
          <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 p-6"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </AuthGuard>
  )
}