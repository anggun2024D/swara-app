'use client'

import { useState, useEffect } from 'react'
import { Menu, X, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const navLinks = [
  { name: 'Beranda', href: '#hero' },
  { name: 'Layanan', href: '#categories' },
  { name: 'Peta', href: '#map' },
  { name: 'Statistik', href: '#analytics' },
  { name: 'Fitur', href: '#features' },
]

function getDashboardPath(): string {
  try {
    const raw = localStorage.getItem('swara_user')
    if (!raw) return '/dashboard'
    const user = JSON.parse(raw)
    return user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'
  } catch {
    return '/dashboard'
  }
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dashboardPath, setDashboardPath] = useState('/dashboard')

  useEffect(() => {
    // Cek status login dari localStorage
    const checkAuth = () => {
      const token = localStorage.getItem('swara_token')
      const hasToken = !!token
      setIsLoggedIn(hasToken)
      if (hasToken) setDashboardPath(getDashboardPath())
    }

    checkAuth()

    // Dengarkan perubahan localStorage (login/logout di tab lain)
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const linkClass = isScrolled
    ? 'text-text hover:text-primary'
    : 'text-white hover:text-gold'

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-xl shadow-lg border-b border-white/20'
          : 'bg-black/20 backdrop-blur-md border-b border-white/10'
      }`}
    >
      <div className="container-premium py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-xl text-primary">SWARA</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors ${linkClass}`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            // ✅ Sudah login — hanya tampilkan tombol Dashboard
            <Link href={dashboardPath}>
              <button className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-hover transition-all shadow-md hover:shadow-lg">
                Dashboard
              </button>
            </Link>
          ) : (
            // Belum login — tampilkan Login + Dashboard
            <>
              <Link href="/login">
                <button className={`px-4 py-2 text-sm font-semibold transition-colors ${linkClass}`}>
                  Login
                </button>
              </Link>
              <Link href="/login">
                <button className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-hover transition-all shadow-md hover:shadow-lg">
                  Mulai Sekarang
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-border"
          >
            <div className="container-premium py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 text-text font-medium hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                {isLoggedIn ? (
                  <Link href={dashboardPath} onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full py-2 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-colors">
                      Dashboard
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full py-2 text-center text-text font-semibold hover:text-primary transition-colors">
                        Login
                      </button>
                    </Link>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full py-2 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-colors">
                        Mulai Sekarang
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}