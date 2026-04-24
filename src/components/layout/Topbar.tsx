'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ChevronDown, CheckCheck, Settings } from 'lucide-react'
import Link from 'next/link'
import { CommandPalette } from '@/components/CommandPalette'

interface Notif { id: string; type: string; message: string; read: boolean; createdAt: string }

const typeColor: Record<string, string> = {
  EXPIRING: '#fbbf24',
  EXPIRED:  '#f87171',
  RENEWED:  '#34d399',
}

export function Topbar({ title }: { title?: string }) {
  const { data: session } = useSession()
  const [notifs, setNotifs] = useState<Notif[]>([])
  const [showNotifs, setShowNotifs] = useState(false)
  const [showUser,   setShowUser]   = useState(false)

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.ok ? r.json() : [])
      .then(d => setNotifs(Array.isArray(d) ? d.slice(0, 12) : []))
      .catch(() => {})
  }, [])

  async function markAllRead() {
    await fetch('/api/notifications', { method: 'PUT' })
    setNotifs(n => n.map(x => ({ ...x, read: true })))
  }

  const unread = notifs.filter(n => !n.read).length

  const dropdownClass = [
    'absolute right-0 top-full mt-2 rounded-2xl shadow-2xl overflow-hidden z-50',
    'border border-[var(--border-subtle)]',
  ].join(' ')

  function closeAll() { setShowNotifs(false); setShowUser(false) }

  return (
    <div
      className="h-16 flex items-center px-6 gap-4 relative z-30 flex-shrink-0"
      style={{ background: 'var(--bg-topbar)', borderBottom: '1px solid var(--border-subtle)' }}
    >
      {title && (
        <h1 className="text-base font-semibold text-[var(--text-primary)] mr-2 hidden sm:block">{title}</h1>
      )}

      {/* Command Palette Search */}
      <div className="flex-1 max-w-sm">
        <CommandPalette />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => { setShowNotifs(s => !s); setShowUser(false) }}
            className="relative p-2 rounded-xl transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
          >
            <Bell size={19} />
            {unread > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full
                           text-[9px] text-white flex items-center justify-center font-bold"
              >
                {unread > 9 ? '9+' : unread}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.14 }}
                className={`${dropdownClass} w-80`}
                style={{ background: 'var(--bg-card)' }}
              >
                <div className="flex items-center justify-between px-4 py-3"
                     style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Notifications
                  </span>
                  <button onClick={markAllRead}
                    className="text-xs flex items-center gap-1"
                    style={{ color: 'var(--brand-500)' }}>
                    <CheckCheck size={11} /> All read
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifs.length === 0
                    ? <p className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No notifications</p>
                    : notifs.map(n => (
                      <div key={n.id}
                        className="px-4 py-3 flex items-start gap-2.5 transition-colors"
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          background: !n.read ? 'var(--bg-hover)' : undefined,
                        }}
                      >
                        <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{ background: typeColor[n.type] ?? '#94a3b8' }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-primary)' }}>{n.message}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {new Date(n.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))
                  }
                </div>
                <Link href="/notifications" onClick={closeAll}>
                  <div className="px-4 py-2.5 text-center text-xs cursor-pointer transition-colors hover:underline"
                       style={{ color: 'var(--brand-500)' }}>
                    View all notifications →
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { setShowUser(s => !s); setShowNotifs(false) }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-colors ml-1"
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600
                            flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <span className="text-sm font-medium hidden sm:block max-w-28 truncate"
                  style={{ color: 'var(--text-primary)' }}>
              {session?.user?.name ?? 'User'}
            </span>
            <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
          </motion.button>

          <AnimatePresence>
            {showUser && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.14 }}
                className={`${dropdownClass} w-52`}
                style={{ background: 'var(--bg-card)' }}
              >
                <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {session?.user?.name}
                  </p>
                  <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {session?.user?.email}
                  </p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full mt-1.5 inline-block font-semibold
                                   bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                    {(session?.user as any)?.role ?? 'USER'}
                  </span>
                </div>
                <Link href="/settings" onClick={closeAll}>
                  <div className="flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer transition-colors"
                       style={{ color: 'var(--text-secondary)' }}
                       onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
                       onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}>
                    <Settings size={13} />
                    Settings
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click-outside overlay */}
      {(showNotifs || showUser) && (
        <div className="fixed inset-0 z-[-1]" onClick={closeAll} />
      )}
    </div>
  )
}
