'use client'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { GlowCursor } from '@/components/animations/GlowCursor'

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.992 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.992 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function DashboardLayout({
  children, title,
}: {
  children: React.ReactNode
  title?: string
}) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-main)' }}>
      <GlowCursor />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-[1600px] mx-auto">
            <AnimatePresence mode="wait">
              <PageTransition key={pathname}>
                {children}
              </PageTransition>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}

