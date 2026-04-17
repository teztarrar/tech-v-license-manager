'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, FileKey2, RefreshCw, Building2, Package, Bell, BarChart3, Settings, LogOut, ChevronRight } from 'lucide-react'
import { Logo } from './Logo'
import { useTheme } from './ThemeProvider'

const nav = [
  { label: 'Main', items: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/licenses', label: 'Licenses', icon: FileKey2 },
    { href: '/renewals', label: 'Renewals', icon: RefreshCw, badge: 4 },
  ]},
  { label: 'Manage', items: [
    { href: '/companies', label: 'Companies', icon: Building2 },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/notifications', label: 'Notifications', icon: Bell, badge: 3 },
  ]},
  { label: 'System', items: [
    { href: '/reports', label: 'Reports', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]},
]

export function Sidebar() {
  const path = usePathname()
  const { theme } = useTheme()
  const bg = theme === 'neon' ? 'bg-[#0a0a15] border-[#1e1e3f]' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
  return (
    <motion.aside className={`sidebar-bg fixed left-0 top-0 h-screen w-[220px] border-r flex flex-col z-30 ${bg}`}
      initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="p-4 border-b border-inherit">
        <Logo />
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-4">
        {nav.map(section => (
          <div key={section.label}>
            <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">{section.label}</p>
            {section.items.map(item => {
              const active = path === item.href || path.startsWith(item.href + '/')
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div whileHover={{ x: 2 }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 cursor-pointer transition-colors
                      ${active
                        ? theme === 'neon' ? 'bg-purple-900/40 text-purple-300 font-medium' : 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}>
                    <item.icon size={15} />
                    <span className="flex-1">{item.label}</span>
                    {(item as {badge?:number}).badge && (
                      <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-medium">{(item as {badge?:number}).badge}</span>
                    )}
                    {active && <ChevronRight size={12} className="opacity-50" />}
                  </motion.div>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-inherit">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group">
          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[11px] font-semibold text-blue-600 dark:text-blue-300">AS</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">Admin Shah</div>
            <div className="text-[10px] text-gray-400 truncate">Super Admin</div>
          </div>
          <LogOut size={13} className="opacity-0 group-hover:opacity-50 text-red-400" />
        </div>
      </div>
    </motion.aside>
  )
}
