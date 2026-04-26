'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

const LABELS: Record<string, string> = {
  dashboard: 'Dashboard', licenses: 'Licenses', products: 'Products',
  companies: 'Companies', renewals: 'Renewals', calendar: 'Calendar',
  notifications: 'Notifications', reports: 'Reports', activity: 'Activity',
  templates: 'Templates', users: 'Users', settings: 'Settings',
}

export function Breadcrumb() {
  const pathname = usePathname()
  if (!pathname || pathname === '/dashboard') return null
  const segments = pathname.split('/').filter(Boolean)

  return (
    <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-4 slide-up">
      <Link href="/dashboard" className="flex items-center gap-1 hover:text-[var(--text-secondary)] transition-colors">
        <Home size={12}/> Home
      </Link>
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1
        const href = '/' + segments.slice(0, i + 1).join('/')
        return (
          <span key={seg} className="flex items-center gap-1.5">
            <ChevronRight size={11} className="text-gray-600" />
            {isLast ? (
              <span className="text-[var(--text-secondary)] font-medium">{LABELS[seg] || seg}</span>
            ) : (
              <Link href={href} className="hover:text-[var(--text-secondary)] transition-colors">{LABELS[seg] || seg}</Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}

