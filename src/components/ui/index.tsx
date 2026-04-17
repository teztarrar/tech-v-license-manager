'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, Check } from 'lucide-react'
import React from 'react'

/* ══════════════════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════════════════ */
export function Modal({
  open, onClose, title, children, size = 'md',
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' }

  React.useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            className={`relative w-full ${widths[size]} bg-[var(--bg-modal)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/* ══════════════════════════════════════════════════════════════
   BUTTON
══════════════════════════════════════════════════════════════ */
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
type ButtonSize    = 'sm' | 'md' | 'lg'

export function Button({
  children, onClick, variant = 'primary', size = 'md',
  disabled = false, loading = false, type = 'button', className = '', icon,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit'
  className?: string
  icon?: React.ReactNode
}) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const variants: Record<ButtonVariant, string> = {
    primary:   'bg-[var(--brand-600)] hover:bg-[var(--brand-500)] text-white focus-visible:ring-indigo-500',
    secondary: 'bg-[var(--bg-input)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border-medium)] focus-visible:ring-indigo-500',
    danger:    'bg-red-600 hover:bg-red-500 text-white focus-visible:ring-red-500',
    ghost:     'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:ring-indigo-500',
    success:   'bg-green-600 hover:bg-green-500 text-white focus-visible:ring-green-500',
  }
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-sm',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading
        ? <Loader2 size={14} className="animate-spin flex-shrink-0" />
        : icon && <span className="flex-shrink-0">{icon}</span>
      }
      {children}
    </motion.button>
  )
}

/* ══════════════════════════════════════════════════════════════
   INPUT
══════════════════════════════════════════════════════════════ */
export function Input({
  label, value, onChange, placeholder, type = 'text',
  required = false, disabled = false, className = '',
}: {
  label?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  disabled?: boolean
  className?: string
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={[
          'w-full px-3 py-2.5 rounded-xl text-sm',
          'bg-[var(--bg-input)] border border-[var(--border-medium)]',
          'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/40 focus:border-[var(--brand-500)]/60',
          'disabled:opacity-50 transition-all',
        ].join(' ')}
      />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   SELECT
══════════════════════════════════════════════════════════════ */
export function Select({
  label, value, onChange, options, placeholder, required = false, className = '',
}: {
  label?: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
  className?: string
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className={[
          'w-full px-3 py-2.5 rounded-xl text-sm appearance-none',
          'bg-[var(--bg-input)] border border-[var(--border-medium)]',
          'text-[var(--text-primary)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/40 focus:border-[var(--brand-500)]/60',
          'transition-all',
        ].join(' ')}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   BADGE — license status
══════════════════════════════════════════════════════════════ */
export function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE:   'bg-[var(--status-active-bg)]   text-[var(--status-active-text)]   border border-[var(--status-active-border)]',
    EXPIRING: 'bg-[var(--status-expiring-bg)] text-[var(--status-expiring-text)] border border-[var(--status-expiring-border)]',
    EXPIRED:  'bg-[var(--status-expired-bg)]  text-[var(--status-expired-text)]  border border-[var(--status-expired-border)]',
    RENEWED:  'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    ADMIN:    'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    MANAGER:  'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    VIEWER:   'bg-gray-500/10 text-gray-400 border border-gray-500/20',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[status] ?? map.ACTIVE}`}>
      {status}
    </span>
  )
}

/* ══════════════════════════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════════════════════════ */
type StatColor = 'brand' | 'green' | 'yellow' | 'red' | 'blue'

export function StatCard({
  title, value, icon, color = 'brand', subtitle,
}: {
  title: string
  value: number | string
  icon: React.ReactNode
  color?: StatColor
  subtitle?: string
}) {
  const ring: Record<StatColor, string> = {
    brand:  'border-indigo-500/20  bg-indigo-500/5',
    green:  'border-green-500/20   bg-green-500/5',
    yellow: 'border-yellow-500/20  bg-yellow-500/5',
    red:    'border-red-500/20     bg-red-500/5',
    blue:   'border-blue-500/20    bg-blue-500/5',
  }
  const iconRing: Record<StatColor, string> = {
    brand:  'bg-indigo-500/15 text-indigo-400',
    green:  'bg-green-500/15  text-green-400',
    yellow: 'bg-yellow-500/15 text-yellow-400',
    red:    'bg-red-500/15    text-red-400',
    blue:   'bg-blue-500/15   text-blue-400',
  }
  const valColor: Record<StatColor, string> = {
    brand:  'text-indigo-400',
    green:  'text-green-400',
    yellow: 'text-yellow-400',
    red:    'text-red-400',
    blue:   'text-blue-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`bg-[var(--bg-card)] border ${ring[color]} rounded-2xl p-5 flex flex-col gap-3`}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{title}</p>
        <div className={`p-2 rounded-xl ${iconRing[color]}`}>{icon}</div>
      </div>
      <div>
        <p className={`text-3xl font-bold tabular-nums ${valColor[color]}`}>{value}</p>
        {subtitle && <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════
   CARD
══════════════════════════════════════════════════════════════ */
export function Card({
  children, className = '', title, action,
}: {
  children: React.ReactNode
  className?: string
  title?: string
  action?: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════
   EMPTY STATE
══════════════════════════════════════════════════════════════ */
export function EmptyState({
  icon, title, description, action,
}: {
  icon: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="p-4 rounded-2xl bg-[var(--bg-input)] text-[var(--text-muted)] mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
      {description && <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════
   PAGE SPINNER
══════════════════════════════════════════════════════════════ */
export function PageSpinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-24">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-3"
      >
        <Loader2 size={28} className="animate-spin text-[var(--brand-500)]" />
        <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      </motion.div>
    </div>
  )
}
