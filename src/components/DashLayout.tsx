'use client'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function DashLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 ml-[220px] flex flex-col min-h-screen">
        <Topbar title={title} />
        <main className="flex-1 p-5 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
