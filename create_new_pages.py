import os

os.makedirs('src/app/activity', exist_ok=True)
os.makedirs('src/app/calendar', exist_ok=True)
os.makedirs('src/app/templates', exist_ok=True)

# Activity page
activity = r"""'use client'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, PageSpinner, EmptyState } from '@/components/ui'
import { ClipboardList, Plus, Edit2, Trash2, RefreshCw, Download, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Activity { id: string; action: string; entityType: string; entityName: string; userName: string; createdAt: string }

const actionIcons: Record<string, any> = { CREATE: Plus, UPDATE: Edit2, DELETE: Trash2, RENEW: RefreshCw, EXPORT: Download }
const actionColors: Record<string, string> = {
  CREATE: 'text-green-400 bg-green-500/10 border-green-500/20',
  UPDATE: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  DELETE: 'text-red-400 bg-red-500/10 border-red-500/20',
  RENEW: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  EXPORT: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    fetch('/api/activity').then(r => r.ok ? r.json() : []).then(d => { setActivities(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const types = ['ALL', 'CREATE', 'UPDATE', 'DELETE', 'RENEW']
  const filtered = filter === 'ALL' ? activities : activities.filter(a => a.action === filter)

  return (
    <DashboardLayout title="Activity Log">
      <div className="space-y-5 page-enter">
        <div className="flex items-center justify-between slide-up">
          <div className="flex gap-1 bg-input border border-input-border rounded-xl p-1">
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter===t?'bg-brand-600 text-white':'text-gray-400 hover:text-gray-200'}`}>
                {t === 'ALL' ? `All (${activities.length})` : t}
              </button>
            ))}
          </div>
        {loading ? <PageSpinner /> : filtered.length === 0 ? (
          <EmptyState icon={<ClipboardList size={28}/>} title="No activity yet" description="Actions performed in Tech V will appear here." />
        ) : (
          <Card>
            <div className="overflow-x-auto table-scroll">
              <table className="w-full data-table row-fade">
                <thead><tr><th>Action</th><th>Entity</th><th>Name</th><th>User</th><th>Time</th></tr></thead>
                <tbody>
                  {filtered.map((a) => { const Icon = actionIcons[a.action] || ClipboardList; return (
                    <tr key={a.id}>
                      <td><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${actionColors[a.action] || 'text-gray-400 bg-gray-500/10 border-gray-500/20'}`}><Icon size={12}/>{a.action}</span></td>
                      <td className="text-gray-400 text-xs">{a.entityType}</td>
                      <td className="text-sm text-card-text font-medium">{a.entityName}</td>
                      <td><div className="flex items-center gap-2"><User size={12} className="text-gray-500"/><span className="text-xs text-gray-300">{a.userName}</span></div></td>
                      <td className="text-gray-500 text-xs">{formatDate(a.createdAt)}</td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
"""

with open('src/app/activity/page.tsx', 'wb') as f:
    f.write(activity.encode('utf-8'))
print('activity/page.tsx created')

# Calendar page
calendar = r"""'use client'
import { useEffect, useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, PageSpinner } from '@/components/ui'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

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
                  )
                })}
              </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
"""

with open('src/app/calendar/page.tsx', 'wb') as f:
    f.write(calendar.encode('utf-8'))
print('calendar/page.tsx created')

# Templates page
templates = r"""'use client'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button, Input, useToast, EmptyState } from '@/components/ui'
import { Layers, Plus, Copy, CheckCheck, Key, Calendar, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'

const DEFAULT_TEMPLATES = [
  { id: 'ms365', name: 'Microsoft 365', vendor: 'Microsoft', licenseType: 'Subscription', renewalCycle: 'Annual', price: '120', icon: 'M' },
  { id: 'adobe', name: 'Adobe Creative Cloud', vendor: 'Adobe', licenseType: 'Subscription', renewalCycle: 'Annual', price: '599', icon: 'A' },
  { id: 'aws', name: 'AWS Enterprise', vendor: 'Amazon', licenseType: 'Subscription', renewalCycle: 'Monthly', price: '5000', icon: 'W' },
  { id: 'jetbrains', name: 'JetBrains All Products', vendor: 'JetBrains', licenseType: 'Subscription', renewalCycle: 'Annual', price: '249', icon: 'J' },
  { id: 'github', name: 'GitHub Enterprise', vendor: 'GitHub', licenseType: 'Subscription', renewalCycle: 'Annual', price: '231', icon: 'G' },
  { id: 'figma', name: 'Figma Professional', vendor: 'Figma', licenseType: 'Subscription', renewalCycle: 'Annual', price: '144', icon: 'F' },
]

export default function TemplatesPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [custom, setCustom] = useState<{name:string;vendor:string;licenseType:string;renewalCycle:string;price:string}[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name:'', vendor:'', licenseType:'Subscription', renewalCycle:'Annual', price:'' })
  const [copiedId, setCopiedId] = useState<string|null>(null)

  const allTemplates = [...DEFAULT_TEMPLATES, ...custom.map((c, i) => ({ ...c, id: `custom-${i}`, icon: c.name[0].toUpperCase() }))]

  function useTemplate(t: any) {
    const query = new URLSearchParams({ template: JSON.stringify({ name: t.name, vendor: t.vendor, licenseType: t.licenseType, renewalCycle: t.renewalCycle, price: t.price }) }).toString()
    router.push(`/licenses?${query}`)
    addToast(`Template "${t.name}" loaded`, 'success')
  }

  function addCustom() {
    if (!form.name) return
    setCustom(prev => [...prev, { ...form }])
    setForm({ name:'', vendor:'', licenseType:'Subscription', renewalCycle:'Annual', price:'' })
    setShowAdd(false)
    addToast('Custom template added', 'success')
  }

  function copyTemplate(t: any) {
    navigator.clipboard.writeText(JSON.stringify(t, null, 2))
    setCopiedId(t.id)
    addToast('Template copied to clipboard', 'success')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <DashboardLayout title="License Templates">
      <div className="space-y-5 page-enter">
        <div className="flex justify-between items-center slide-up">
          <p className="text-sm text-gray-500">{allTemplates.length} templates available</p>
          <Button icon={<Plus size={14}/>} onClick={() => setShowAdd(true)}>Add Custom</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 card-stagger">
          {allTemplates.map((t) => (
            <div key={t.id} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-5 card-hover slide-up">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600/20 to-brand-800/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-lg">{t.icon}</div>
                  <div><h3 className="font-semibold text-card-text text-sm">{t.name}</h3><p className="text-xs text-gray-500">{t.vendor}</p></div>
                <button onClick={() => copyTemplate(t)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-colors">{copiedId === t.id ? <CheckCheck size={13} className="text-green-400"/> : <Copy size={13}/>}</button>
              </div>
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-400"><Package size={11}/> {t.licenseType}</div>
                <div className="flex items-center gap-2 text-xs text-gray-400"><Calendar size={11}/> {t.renewalCycle}</div>
                <div className="flex items-center gap-2 text-xs text-gray-400"><Key size={11}/> ${t.price}/yr</div>
              <Button size="sm" className="w-full justify-center" onClick={() => useTemplate(t)} icon={<Plus size={12}/>}>Use Template</Button>
            </div>
          ))}
        </div>

        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={() => setShowAdd(false)}>
            <div className="relative w-full max-w-md bg-[var(--bg-modal)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden modal-content p-6 space-y-4" onClick={e => e.stopPropagation()}>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Add Custom Template</h2>
              <Input label="Product Name" value={form.name} onChange={v => setForm({...form,name:v})} placeholder="My Product" required />
              <Input label="Vendor" value={form.vendor} onChange={v => setForm({...form,vendor:v})} placeholder="Vendor Inc." />
              <div className="form-grid">
                <Input label="License Type" value={form.licenseType} onChange={v => setForm({...form,licenseType:v})} />
                <Input label="Renewal Cycle" value={form.renewalCycle} onChange={v => setForm({...form,renewalCycle:v})} />
              </div>
              <Input label="Price (USD)" value={form.price} onChange={v => setForm({...form,price:v})} type="number" placeholder="99.99" />
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
                <Button onClick={addCustom}>Add Template</Button>
              </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
"""

with open('src/app/templates/page.tsx', 'wb') as f:
    f.write(templates.encode('utf-8'))
print('templates/page.tsx created')
print('All new pages created successfully!')
