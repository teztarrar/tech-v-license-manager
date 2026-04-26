'use client'
import { useEffect, useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, PageSpinner } from '@/components/ui'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface License { id: string; licenseKey: string; expiryDate: string; status: string; company?: {name:string}|null; product?: {name:string}|null }

export default function CalendarPage() {
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    fetch('/api/licenses').then(r => r.ok ? r.json() : []).then(d => {
      setLicenses(Array.isArray(d) ? d.filter((l: any) => l.expiryDate) : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const dayLicenses = useMemo(() => {
    const map: Record<number, License[]> = {}
    licenses.forEach(l => {
      const d = new Date(l.expiryDate)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate()
        if (!map[day]) map[day] = []
        map[day].push(l)
      }
    })
    return map
  }, [licenses, year, month])

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  return (
    <DashboardLayout title="Expiry Calendar">
      <div className="space-y-5 page-enter">
        <div className="flex items-center justify-between slide-up">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">{monthName}</h2>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="p-2 rounded-lg bg-input border border-input-border text-gray-400 hover:text-white transition-colors btn-press"><ChevronLeft size={16}/></button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-2 rounded-lg bg-input border border-input-border text-xs font-medium text-gray-300 hover:text-white transition-colors btn-press">Today</button>
            <button onClick={nextMonth} className="p-2 rounded-lg bg-input border border-input-border text-gray-400 hover:text-white transition-colors btn-press"><ChevronRight size={16}/></button>
          </div>
        </div>

        {loading ? <PageSpinner /> : (
          <Card>
            <div className="p-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider py-2">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="min-h-[80px] rounded-lg" />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const items = dayLicenses[day] || []
                  const hasExpired = items.some(l => l.status === 'EXPIRED')
                  const hasExpiring = items.some(l => l.status === 'EXPIRING')
                  return (
                    <div key={day} className={`min-h-[80px] rounded-lg border p-1.5 transition-colors ${items.length ? 'bg-[var(--bg-input)] border-[var(--border-subtle)]' : 'border-transparent hover:bg-[var(--bg-hover)]'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${items.length ? 'text-[var(--text-primary)]' : 'text-gray-600'}`}>{day}</span>
                        {items.length > 0 && <span className={`w-1.5 h-1.5 rounded-full ${hasExpired ? 'bg-red-400' : hasExpiring ? 'bg-yellow-400' : 'bg-green-400'}`} />}
                      </div>
                      <div className="space-y-1">
                        {items.slice(0, 3).map(l => (
                          <div key={l.id} className="text-[9px] truncate px-1 py-0.5 rounded bg-[var(--bg-card)] text-gray-300 border border-[var(--border-subtle)]">{l.company?.name || l.licenseKey.slice(0,8)}</div>
                        ))}
                        {items.length > 3 && <div className="text-[9px] text-gray-500 px-1">+{items.length - 3} more</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
