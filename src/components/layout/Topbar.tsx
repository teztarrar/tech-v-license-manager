'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
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
  const [bellShake, setBellShake] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.ok ? r.json() : [])
      .then(d => setNotifs(Array.isArray(d) ? d.slice(0, 12) : []))
      .catch(() => {})
  }, [])

  // Trigger bell shake when new unread notifications arrive
  useEffect(() => {
    const unread = notifs.filter(n => !n.read).length
    if (unread > 0) {
      setBellShake(true)
      const t = setTimeout(() => setBellShake(false), 700)
      return () => clearTimeout(t)
    }
  }, [notifs.length])

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      if (notifRef.current && !notifRef.current.contains(target)) setShowNotifs(false)
      if (userRef.current && !userRef.current.contains(target)) setShowUser(false)
    }
    if (showNotifs || showUser) {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [showNotifs, showUser])

  async function markAllRead() {
    await fetch('/api/notifications', { method: 'PUT' })
    setNotifs(n => n.map(x => ({ ...x, read: true })))
  }

  const unread = notifs.filter(n => !n.read).length

  const dropdownClass = [
    'absolute right-0 top-full mt-2 rounded-2xl shadow-2xl overflow-hidden z-50',
    'border border-[var(--border-subtle)] dropdown-enter',
  ].join(' ')

  function closeAll() { setShowNotifs(false); setShowUser(false) }

  const toggleNotifs = useCallback(() => {
    setShowNotifs(s => !s)
    setShowUser(false)
  }, [])

  const toggleUser = useCallback(() => {
    setShowUser(s => !s)
    setShowNotifs(false)
  }, [])

  return (
    <div
      className="h-16 flex items-center px-6 gap-4 relative z-30 flex-shrink-0"
      style={{ background: 'var(--bg-topbar)', borderBottom: '1px solid var(--border-subtle)' }}
    >
      {title && (
        <h1 className="text-base font-semibold text-[var(--text-primary)] mr-2 hidden sm:block">{title}</h1>
      )}

      {/* Breadcrumb spacer */}
      <div className="flex-1" />

      {/* Command Palette Search */}
      <div className="max-w-sm w-full hidden md:block">
        <CommandPalette />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={toggleNotifs}
            className={[
              'relative p-2 rounded-xl transition-colors btn-press',
              bellShake ? 'bell-shake' : '',
            ].join(' ')}
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
          >
            <Bell size={19} />
            {unread > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full
                           text-[9px] text-white flex items-center justify-center font-bold ping-ring"
              >
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <div
              className={`${dropdownClass} w-80`}
              style={{ background: 'var(--bg-card)' }}
            >
              <div className="flex items-center justify-between px-4 py-3"
                   style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Notifications
                </span>
                <button onClick={markAllRead}
                  className="text-xs flex items-center gap-1 hover:opacity-80 transition-opacity"
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
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={toggleUser}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-colors ml-1 btn-press"
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
            <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} className={`transition-transform duration-200 ${showUser ? 'rotate-180' : ''}`} />
          </button>

          {showUser && (
            <div
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

