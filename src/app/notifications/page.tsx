'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button, Card, EmptyState, PageSpinner } from '@/components/ui'
import { Bell, CheckCheck, Trash2, AlertTriangle, XCircle, RefreshCw, Info } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Notification { id:string; type:string; message:string; read:boolean; createdAt:string; license?:{licenseKey:string;company?:{name:string}|null}|null }

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  async function load() {
    setLoading(true)
    const res = await fetch('/api/notifications')
    const data = await res.json()
    setNotifications(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function markAllRead() {
    await fetch('/api/notifications', { method: 'PUT' })
    setNotifications(n => n.map(x => ({ ...x, read: true })))
  }

  async function deleteNotif(id: string) {
    await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
    setNotifications(n => n.filter(x => x.id !== id))
  }

  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}`, { method: 'PUT' })
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x))
  }

  const typeIcon: Record<string, React.ReactNode> = {
    EXPIRING: <AlertTriangle size={16} className="text-yellow-400"/>,
    EXPIRED: <XCircle size={16} className="text-red-400"/>,
    RENEWED: <RefreshCw size={16} className="text-green-400"/>,
    DEFAULT: <Info size={16} className="text-blue-400"/>,
  }

  const typeBg: Record<string, string> = {
    EXPIRING: 'bg-yellow-500/10 border-yellow-500/20',
    EXPIRED: 'bg-red-500/10 border-red-500/20',
    RENEWED: 'bg-green-500/10 border-green-500/20',
    DEFAULT: 'bg-blue-500/10 border-blue-500/20',
  }

  const types = ['ALL', 'EXPIRING', 'EXPIRED', 'RENEWED']
  const filtered = filter === 'ALL' ? notifications : notifications.filter(n => n.type === filter)
  const unread = notifications.filter(n => !n.read).length

  return (
    <DashboardLayout title="Notifications">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-input border border-input-border rounded-xl p-1">
              {types.map(t => (
                <button key={t} onClick={() => setFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter===t?'bg-brand-600 text-white':'text-gray-400 hover:text-gray-200'}`}>
                  {t === 'ALL' ? `All (${notifications.length})` : t}
                </button>
              ))}
            </div>
          </div>
          {unread > 0 && (
            <Button variant="secondary" size="sm" icon={<CheckCheck size={13}/>} onClick={markAllRead}>
              Mark all read ({unread})
            </Button>
          )}
        </div>

        {loading ? (
          <PageSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Bell size={28}/>} title="No notifications"
            description="You're all caught up! Notifications will appear here when licenses expire or need renewal."/>
        ) : (
          <div className="space-y-2">
            {filtered.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => !n.read && markRead(n.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${
                  typeBg[n.type] || typeBg.DEFAULT
                } ${!n.read ? 'opacity-100' : 'opacity-60'}`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {typeIcon[n.type] || typeIcon.DEFAULT}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.read ? 'text-white font-medium' : 'text-gray-300'}`}>{n.message}</p>
                  {n.license && (
                    <p className="text-xs text-gray-500 mt-0.5 font-mono">{n.license.licenseKey}{n.license.company ? ` · ${n.license.company.name}` : ''}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-1">{new Date(n.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!n.read && (
                    <button onClick={e=>{e.stopPropagation();markRead(n.id)}} className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-green-400 transition-colors">
                      <CheckCheck size={13}/>
                    </button>
                  )}
                  <button onClick={e=>{e.stopPropagation();deleteNotif(n.id)}} className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors">
                    <Trash2 size={13}/>
                  </button>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0"/>}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
