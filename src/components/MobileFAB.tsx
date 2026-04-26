'use client'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export function MobileFAB() {
  return (
    <Link href="/licenses" className="fixed bottom-5 right-5 z-40 sm:hidden fab-enter">
      <div className="w-14 h-14 rounded-full bg-[var(--brand-600)] text-white shadow-lg flex items-center justify-center hover:bg-[var(--brand-500)] transition-colors btn-press">
        <Plus size={24} />
      </div>
    </Link>
  )
}
