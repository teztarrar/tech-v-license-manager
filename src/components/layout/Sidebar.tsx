'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Key, Package, Building2, RefreshCw,
  Bell, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight, Users,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { TechVLogo } from '../TechVLogo'
import { useState } from 'react'

const NAV = [
  { href: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard'     },
  { href: '/licenses',      icon: Key,             label: 'Licenses'      },
  { href: '/products',      icon: Package,         label: 'Products'      },
  { href: '/companies',     icon: Building2,       label: 'Companies'     },
  { href: '/renewals',      icon: RefreshCw,       label: 'Renewals'      },
  { href: '/notifications', icon: Bell,            label: 'Notifications' },
  { href: '/reports',       icon: BarChart3,       label: 'Reports'       },
  { href: '/users',         icon: Users,           label: 'Users'         },
  { href: '/settings',      icon: Settings,        label: 'Settings'      },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.div
      animate={{ width: collapsed ? 60 : 220 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative h-screen flex flex-col overflow-hidden flex-shrink-0"
      style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-subtle)' }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-3.5 flex-shrink-0"
           style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <TechVLogo size={28} showText={!collapsed} />
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {NAV.map(item => {
          const active = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.97 }}
                title={collapsed ? item.label : undefined}
                className={[
                  'flex items-center gap-3 px-2.5 py-2.5 rounded-xl cursor-pointer transition-all relative group',
                  active
                    ? 'text-[var(--sidebar-active-text)]'
                    : 'text-[var(--sidebar-text)] hover:text-[var(--text-primary)]',
                ].join(' ')}
                style={active
                  ? { background: 'var(--sidebar-active-bg)' }
                  : undefined
                }
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-hover)'
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = ''
                }}
              >
                <item.icon size={17} className="flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip for collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                                  bg-gray-900 text-white whitespace-nowrap shadow-xl border border-white/10
                                  pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    {item.label}
                  </div>
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-2 py-3 flex-shrink-0"
           style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl
                     transition-colors group"
          style={{ color: 'var(--sidebar-text)' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.cssText +=
            ';background:rgba(239,68,68,0.1);color:#f87171'}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = ''
            ;(e.currentTarget as HTMLElement).style.color = 'var(--sidebar-text)'
          }}
        >
          <LogOut size={17} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full flex items-center justify-center
                   bg-[var(--brand-600)] text-white shadow-lg hover:bg-[var(--brand-500)]
                   transition-colors z-10 border-2 border-[var(--bg-main)]"
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>
    </motion.div>
  )
}
