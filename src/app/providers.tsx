'use client'

import { Suspense } from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ToastProvider } from '@/components/ui'

function ToastBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ToastProvider>
          <Suspense fallback={null}>
            <ToastBoundary>{children}</ToastBoundary>
          </Suspense>
        </ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

