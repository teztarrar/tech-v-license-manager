'use client'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts'
import { MobileFAB } from '@/components/MobileFAB'
import { Breadcrumb } from '@/components/Breadcrumb'

export function DashboardLayout({
  children, title,
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-main)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto page-enter">
          <div className="p-6 max-w-[1600px] mx-auto">
            <Breadcrumb />
            {children}
          </div>
        </main>
      </div>
      <KeyboardShortcuts />
      <MobileFAB />
    </div>
  )
}
