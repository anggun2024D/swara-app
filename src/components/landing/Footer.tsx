'use client'

import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Github } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white/70 pt-16 pb-8">
      <div className="container-premium">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white">SWARA</span>
            </div>
            <p className="text-sm">Platform pelaporan infrastruktur berbasis GIS untuk Kabupaten Lamongan.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/laporan" className="hover:text-white transition-colors">Buat Laporan</Link></li>
              <li><Link href="/riwayat" className="hover:text-white transition-colors">Riwayat</Link></li>
              <li><Link href="/kategori" className="hover:text-white transition-colors">Kategori</Link></li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-bold text-white mb-4">Kontak</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail size={14} /> info@swara.lamongan.go.id</li>
              <li className="flex items-center gap-2"><Phone size={14} /> (0322) 123456</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Jl. Pemuda No. 1, Lamongan</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-white mb-4">Ikuti Kami</h4>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook size={16} className="text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter size={16} className="text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram size={16} className="text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Github size={16} className="text-white" />
              </a>
            </div>
            <div className="mt-4 flex gap-2">
              <img src="https://tse4.mm.bing.net/th/id/OIP.7LHnjQpbSjFezcfDkCIDnAHaFO?pid=Api&h=220&P=0" alt="SDGs" className="h-8 opacity-70" />
            </div>
          </div>
        </div>

        <div className="pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} SWARA - Suara Warga untuk Ruang dan Aset. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}