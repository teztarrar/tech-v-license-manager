'use client'
import { useEffect, useState } from 'react'
import { Command, X } from 'lucide-react'

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement)?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [])

  if (!open) return null

  const shortcuts = [
    { keys: ['?'], desc: 'Toggle this help' },
    { keys: ['Cmd', 'K'], desc: 'Open command palette' },
    { keys: ['Esc'], desc: 'Close modals / dropdowns' },
    { keys: ['G', 'D'], desc: 'Go to Dashboard' },
    { keys: ['G', 'L'], desc: 'Go to Licenses' },
    { keys: ['G', 'C'], desc: 'Go to Companies' },
    { keys: ['G', 'P'], desc: 'Go to Products' },
    { keys: ['G', 'R'], desc: 'Go to Reports' },
    { keys: ['G', 'S'], desc: 'Go to Settings' },
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop" onClick={() => setOpen(false)}>
      <div className="relative w-full max-w-md bg-[var(--bg-modal)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
          <h2 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2"><Command size={16}/> Keyboard Shortcuts</h2>
          <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors"><X size={14}/></button>
        </div>
        <div className="p-4 space-y-1">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
              <span className="text-sm text-[var(--text-secondary)]">{s.desc}</span>
              <div className="flex gap-1">
                {s.keys.map((k, j) => (
                  <kbd key={j} className="px-2 py-0.5 rounded text-[11px] font-mono bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-primary)]">{k}</kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
