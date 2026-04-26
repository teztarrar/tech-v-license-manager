'use client'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button, Input, useToast } from '@/components/ui'
import { Plus, Copy, CheckCheck, Key, Calendar, Package } from 'lucide-react'
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
                </div>
                <button onClick={() => copyTemplate(t)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-colors">{copiedId === t.id ? <CheckCheck size={13} className="text-green-400"/> : <Copy size={13}/>}</button>
              </div>
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-400"><Package size={11}/> {t.licenseType}</div>
                <div className="flex items-center gap-2 text-xs text-gray-400"><Calendar size={11}/> {t.renewalCycle}</div>
                <div className="flex items-center gap-2 text-xs text-gray-400"><Key size={11}/> ${t.price}/yr</div>
              </div>
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
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
