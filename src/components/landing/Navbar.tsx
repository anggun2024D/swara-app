'use client'
 
import { useState, useEffect } from 'react'
import { Menu, X, } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
 
// ✅ SEMUA LOGIC AUTH TIDAK BERUBAH — hanya tampilan
const navLinks = [
  { name: 'Beranda', href: '#hero' },
  { name: 'Layanan', href: '#categories' },
  { name: 'Peta', href: '#map' },
  { name: 'Statistik', href: '#analytics' },
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
    const checkAuth = () => {
      const token = localStorage.getItem('swara_token')
      const hasToken = !!token
      setIsLoggedIn(hasToken)
      if (hasToken) setDashboardPath(getDashboardPath())
    }
    checkAuth()
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])
 
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
 
  return (
    // BARU: floating navbar dengan margin top, rounded-full, glassmorphism
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
    >
      <div className={`max-w-6xl mx-auto transition-all duration-500 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-card border border-white/80 rounded-2xl'
          : 'bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl'
      }`}>
        <div className="px-6 py-3 flex items-center justify-between">
 
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="SWARA Logo"
                fill
                priority
                className="object-contain"
              />
            </div>

            <div>
              <span
                className="font-extrabold text-3xl text-white leading-none block tracking-tight"
              >
                WARA
              </span>

              <span
                className={`text-[9px] font-medium tracking-[0.25em] uppercase leading-none block transition-colors ${
                  isScrolled ? 'text-muted' : 'text-white/70'
                }`}
              >
                Kabupaten Lamongan
              </span>
            </div>
          </Link>
 
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-primary/10 hover:text-primary ${
                  isScrolled ? 'text-text' : 'text-white/90 hover:text-white hover:bg-white/15'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
 
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <Link href={dashboardPath}>
                <button className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  Dashboard 
                </button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <button className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                    Mulai Sekarang 
                  </button>
                </Link>
              </>
            )}
          </div>
 
          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${isScrolled ? 'text-text hover:bg-gray-100' : 'text-white hover:bg-white/20'}`}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
 
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/50 bg-white rounded-b-2xl overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-text font-medium hover:bg-primary/10 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-3 border-t border-border flex flex-col gap-2 mt-1">
                  {isLoggedIn ? (
                    <Link href={dashboardPath} onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors text-sm">
                        Dashboard
                      </button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <button className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors text-sm">
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
      </div>
    </motion.nav>
  )
}