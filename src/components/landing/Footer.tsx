'use client'
 
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Github, ExternalLink } from 'lucide-react'
import Link from 'next/link'
 
const quickLinks = [
  { label: 'Peta Ekonomi', href: '/economic-map' },
  { label: 'Peluang', href: '/opportunities' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Insights', href: '/economic-insights' },
  { label: 'Fitur Platform', href: '#features' },
]
 
const legalLinks = [
  { label: 'Kebijakan Privasi', href: '#' },
  { label: 'Syarat Penggunaan', href: '#' },
  { label: 'FAQ', href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-[#f3f5f4] text-primary relative overflow-hidden border-t border-[#dbe4df]">
      {/* Wave top — curved */}
      <div className="relative">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full" preserveAspectRatio="none">
          <path d="M0,80 C480,0 960,0 1440,80 L1440,0 L0,0 Z" fill="#f3f5f4"/>
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-[#eef3f0] to-transparent" />
      </div>
 
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gold blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-emerald-300 blur-2xl" />
      </div>
 
      <div className="relative z-10 pt-2 pb-10">
        <div className="container-premium">
          {/* Main footer grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#d7e1dc]">
 
            {/* Brand column */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/10">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-extrabold text-xl text-primary leading-none" style={{fontFamily:'Plus Jakarta Sans,sans-serif'}}>SWARA</p>
                  <p className="text-primary/50 text-[10px] tracking-widest uppercase font-medium">Economic Geospatial Platform</p>
                </div>
              </div>
              <p className="text-primary/60 text-sm leading-relaxed mb-5">
                Platform pemetaan potensi ekonomi berbasis GIS — menghubungkan UMKM, pertanian, perikanan, dan pariwisata dengan investor dan mitra bisnis.
              </p>
              <div className="flex gap-2">
                {[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white border border-[#dbe4df] flex items-center justify-center hover:bg-primary hover:text-white hover:border-white/30 transition-all">
                    <Icon size={15} className="text-primary/70" />
                  </a>
                ))}
              </div>
            </div>
 
            {/* Quick Links */}
            <div>
              <p className="font-bold text-primary text-sm uppercase tracking-wider mb-5">Tautan Cepat</p>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-primary/60 hover:text-primary text-sm transition-colors flex items-center gap-1.5 group">
                      <span className="w-1 h-1 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
 
            {/* Legal */}
            <div>
              <p className="font-bold text-primary text-sm uppercase tracking-wider mb-5">Informasi</p>
              <ul className="space-y-2.5 mb-5">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-primary/60 hover:text-primary text-sm transition-colors flex items-center gap-1.5 group">
                      <span className="w-1 h-1 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              {/* Open Data badge */}
              <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3 py-2">
                <ExternalLink size={13} className="text-gold" />
                <span className="text-xs text-primary/70">Data terbuka publik</span>
              </div>
            </div>
 
            {/* Kontak */}
            <div>
              <p className="font-bold text-primary text-sm uppercase tracking-wider mb-5">Kontak</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <MapPin size={14} className="text-gold mt-0.5 flex-shrink-0" />
                  <span className="text-primary/60 text-sm">Jl. Mastrip No.61, Lamongan, Jawa Timur</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={14} className="text-gold flex-shrink-0" />
                  <a href="mailto:swara@lamongan.go.id" className="text-primary/60 hover:text-primary text-sm transition-colors">
                    swara@lamongan.go.id
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={14} className="text-gold flex-shrink-0" />
                  <a href="tel:+0322321170" className="text-primary/60 hover:text-primary text-sm transition-colors">
                    (0322)321170
                  </a>
                </li>
              </ul>
            </div>
          </div>
 
          {/* Bottom bar */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary/40 text-xs text-center md:text-left">
              © {new Date().getFullYear()} SWARA — Smart Wealth & Resource Alliance.
              <br className="md:hidden" /> Memetakan Potensi, Menghubungkan Peluang.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}