'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'
import AuthLayout from '@/components/auth/AuthLayout'
import { motion } from 'framer-motion'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSubmitted(true)
  }

  return (
    <AuthLayout>
      <Link href="/login" className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary mb-6">
        <ArrowLeft size={14} /> Kembali ke Login
      </Link>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text">Lupa Password?</h2>
        <p className="text-muted text-sm mt-2">
          Masukkan email Anda dan kami akan mengirimkan link reset password
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-text mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="user@swara.com"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-hover transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Mail size={18} />
            Kirim Link Reset
          </button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center"
        >
          <p>Link reset password telah dikirim ke <strong>{email}</strong></p>
          <p className="text-sm mt-2">Silakan cek inbox atau folder spam Anda.</p>
        </motion.div>
      )}
    </AuthLayout>
  )
}