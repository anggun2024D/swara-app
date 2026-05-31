'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary via-primary-mid to-primary-dark overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <div className="relative w-14 h-14 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="SWARA Logo"
                fill
                priority
                className="object-contain"
              />
            </div>

            <span className="text-4xl font-extrabold text-white tracking-tight">
              WARA
            </span>
          </Link>

          {/* Main Content */}
          <div className="max-w-md">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-extrabold text-white leading-tight"
            >
              Saatnya Suarakan <span className="text-gold">Perubahan</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/70 mt-4"
            >
              Sampaikan aspirasi dan keluhan Anda langsung ke pemerintah daerah melalui platform digital yang transparan.
            </motion.p>
          </div>

          <div className="text-white/40 text-xs">
            <p>Platform Smart Governance • Kabupaten Lamongan</p>
          </div>
        </div>
      </div>

      {/* Right Section - Auth Card */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}