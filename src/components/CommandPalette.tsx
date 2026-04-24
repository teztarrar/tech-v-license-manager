'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Search, X, LayoutDashboard, Key, Package, Building2,
  RefreshCw, Bell, BarChart3, Settings, Users, LogOut,
  Command,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

interface CommandItem {
  id: string
  label: string
  icon: React.ReactNode
  shortcut?: string
  action: () => void
  category: string
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: CommandItem[] = [
    // Navigation
    { id: 'dash', label: 'Dashboard', icon: <LayoutDashboard size={16} />, shortcut: 'G D', action: () => { router.push('/dashboard'); setOpen(false) }, category: 'Navigation' },
    { id: 'lic', label: 'Licenses', icon: <Key size={16} />, shortcut: 'G L', action: () => { router.push('/licenses'); setOpen(false) }, category: 'Navigation' },
    { id: 'prod', label: 'Products', icon: <Package size={16} />, shortcut: 'G P', action: () => { router.push('/products'); setOpen(false) }, category: 'Navigation' },
    { id: 'comp', label: 'Companies', icon: <Building2 size={16} />, shortcut: 'G C', action: () => { router.push('/companies'); setOpen(false) }, category: 'Navigation' },
    { id: 'ren', label: 'Renewals', icon: <RefreshCw size={16} />, action: () => { router.push('/renewals'); setOpen(false) }, category: 'Navigation' },
    { id: 'notif', label: 'Notifications', icon: <Bell size={16} />, action: () => { router.push('/notifications'); setOpen(false) }, category: 'Navigation' },
    { id: 'rep', label: 'Reports', icon: <BarChart3 size={16} />, action: () => { router.push('/reports'); setOpen(false) }, category: 'Navigation' },
    { id: 'usr', label: 'Users', icon: <Users size={16} />, action: () => { router.push('/users'); setOpen(false) }, category: 'Navigation' },
    { id: 'set', label: 'Settings', icon: <Settings size={16} />, action: () => { router.push('/settings'); setOpen(false) }, category: 'Navigation' },
    // Actions
    { id: 'logout', label: 'Sign Out', icon: <LogOut size={16} />, action: () => { signOut({ callbackUrl: '/login' }); setOpen(false) }, category: 'Actions' },
  ]

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => (i + 1) % filtered.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => (i - 1 + filtered.length) % filtered.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      filtered[selectedIndex]?.action()
    }
  }, [filtered, selectedIndex])

  return (
    <>
      {/* Trigger button in topbar style */}
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
                   bg-[var(--bg-input)] border border-[var(--border-subtle)]
                   text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                   hover:border-[var(--border-medium)] transition-all"
      >
        <Search size={13} />
        <span>Search...</span>
        <kbd className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-mono
                        bg-[var(--bg-hover)] border border-[var(--border-subtle)]">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="relative w-full max-w-xl mx-4 rounded-2xl overflow-hidden shadow-2xl border"
              style={{
                background: 'var(--bg-modal)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <Search size={18} style={{ color: 'var(--text-muted)' }} />
                <input
                  ref={inputRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search pages, actions..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
                  style={{ color: 'var(--text-primary)' }}
                />
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded hover:bg-[var(--bg-hover)] transition-colors"
                >
                  <X size={14} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[50vh] overflow-y-auto py-2">
                {filtered.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No results found</p>
                  </div>
                ) : (
                  (() => {
                    const categories = [...new Set(filtered.map(c => c.category))]
                    return categories.map(cat => (
                      <div key={cat}>
                        <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                          {cat}
                        </div>
                        {filtered.filter(c => c.category === cat).map((cmd, idx) => {
                          const globalIdx = filtered.findIndex(c => c.id === cmd.id)
                          const isSelected = globalIdx === selectedIndex
                          return (
                            <motion.button
                              key={cmd.id}
                              onClick={cmd.action}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                              style={{
                                background: isSelected ? 'var(--bg-hover)' : 'transparent',
                              }}
                              onMouseEnter={() => setSelectedIndex(globalIdx)}
                            >
                              <span style={{ color: isSelected ? 'var(--brand-500)' : 'var(--text-secondary)' }}>
                                {cmd.icon}
                              </span>
                              <span className="text-sm flex-1" style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                {cmd.label}
                              </span>
                              {cmd.shortcut && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded
                                                bg-[var(--bg-input)] border border-[var(--border-subtle)]"
                                      style={{ color: 'var(--text-muted)' }}>
                                  {cmd.shortcut}
                                </span>
                              )}
                            </motion.button>
                          )
                        })}
                      </div>
                    ))
                  })()
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 px-4 py-2 text-[10px] border-t" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1"><kbd className="px-1 rounded bg-[var(--bg-input)] border border-[var(--border-subtle)]">↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1 rounded bg-[var(--bg-input)] border border-[var(--border-subtle)]">↵</kbd> Select</span>
                <span className="flex items-center gap-1"><kbd className="px-1 rounded bg-[var(--bg-input)] border border-[var(--border-subtle)]">Esc</kbd> Close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

