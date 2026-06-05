'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Globe, Bell, Map, Shield, Layers } from 'lucide-react'

export default function SettingsPage() {
  const [general, setGeneral] = useState({ name: 'SWARA', logo: '', desc: 'Platform Geospasial Ekonomi Daerah' })
  const [notif, setNotif] = useState({ email: true, wa: false, push: true })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5"><div className="flex items-center gap-2 pb-3 border-b"><Globe size={18} className="text-primary" /><h3 className="font-bold">General Settings</h3></div><div><label className="text-sm font-medium">Nama Sistem</label><input type="text" value={general.name} onChange={e => setGeneral({...general, name: e.target.value})} className="w-full mt-1 px-4 py-2 border border-border rounded-xl" /></div><div><label className="text-sm font-medium">Deskripsi</label><textarea rows={2} value={general.desc} onChange={e => setGeneral({...general, desc: e.target.value})} className="w-full mt-1 px-4 py-2 border border-border rounded-xl" /></div></div>
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5"><div className="flex items-center gap-2 pb-3 border-b"><Bell size={18} className="text-primary" /><h3 className="font-bold">Notification Settings</h3></div><div className="space-y-2"><label className="flex items-center gap-2"><input type="checkbox" checked={notif.email} onChange={e => setNotif({...notif, email: e.target.checked})} /> Email Notification</label><label className="flex items-center gap-2"><input type="checkbox" checked={notif.wa} onChange={e => setNotif({...notif, wa: e.target.checked})} /> WhatsApp Notification</label><label className="flex items-center gap-2"><input type="checkbox" checked={notif.push} onChange={e => setNotif({...notif, push: e.target.checked})} /> Push Notification</label></div></div>
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5"><div className="flex items-center gap-2 pb-3 border-b"><Map size={18} className="text-primary" /><h3 className="font-bold">GIS Settings</h3></div><div><label className="text-sm font-medium">Default Map Center</label><input type="text" placeholder="-7.1195, 112.4316" className="w-full mt-1 px-4 py-2 border border-border rounded-xl" /></div><div><label className="text-sm font-medium">Zoom Level</label><select className="w-full mt-1 px-4 py-2 border border-border rounded-xl"><option>12</option><option>13</option></select></div></div>
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5"><div className="flex items-center gap-2 pb-3 border-b"><Shield size={18} className="text-primary" /><h3 className="font-bold">Security & System</h3></div><div className="space-y-2"><div className="flex justify-between"><span>API Status</span><span className="text-green-600">● Online</span></div><div className="flex justify-between"><span>Database Status</span><span className="text-green-600">● Connected</span></div><div className="flex justify-between"><span>System Version</span><span>v2.0.0</span></div></div><button className="w-full mt-4 bg-primary text-white py-2 rounded-xl flex items-center justify-center gap-2"><Save size={16} /> Save Changes</button></div>
    </div>
  )
}