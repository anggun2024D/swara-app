'use client'

export default function KategoriHero() {
  return (
    <div className="relative bg-gradient-to-r from-primary to-primary-mid overflow-hidden rounded-2xl p-6 text-white shadow-lg">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">Kategori Laporan</h1>
        <p className="text-white/70 text-sm md:text-base max-w-lg mt-2">
          Pilih kategori yang sesuai untuk memastikan laporan Anda ditangani oleh tim yang tepat secepat mungkin.
        </p>
      </div>
      {/* Decorative */}
      <svg className="absolute bottom-0 right-0 w-48 h-48 text-white/5" viewBox="0 0 200 200">
        <path fill="currentColor" d="M100,20 L120,80 L180,80 L130,120 L150,180 L100,140 L50,180 L70,120 L20,80 L80,80 Z" />
      </svg>
    </div>
  )
}