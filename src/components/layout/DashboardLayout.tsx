'use client'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

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
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
