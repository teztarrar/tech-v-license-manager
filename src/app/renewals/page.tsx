'use client'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Modal, Button, Select, Card, Badge, EmptyState, PageSpinner } from '@/components/ui'
import { RefreshCw, AlertTriangle, XCircle, Clock, CheckCircle } from 'lucide-react'
import { formatDate, getDaysUntilExpiry } from '@/lib/utils'

interface License { id:string; licenseKey:string; serialNumber?:string|null; status:string; expiryDate?:string|null; company?:{name:string}|null; product?:{name:string;price?:number|null}|null }

export default function RenewalsPage() {
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [showRenew, setShowRenew] = useState<License|null>(null)
  const [renewMonths, setRenewMonths] = useState('12')
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'expiring'|'expired'>('expiring')

  async function load() {
    setLoading(true)
    const [exp, expd] = await Promise.all([
      fetch('/api/licenses?status=EXPIRING').then(r=>r.json()),
      fetch('/api/licenses?status=EXPIRED').then(r=>r.json()),
    ])
    setLicenses([...(Array.isArray(exp)?exp:[]), ...(Array.isArray(expd)?expd:[])])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const expiring = licenses.filter(l => l.status === 'EXPIRING')
  const expired = licenses.filter(l => l.status === 'EXPIRED')
  const shown = tab === 'expiring' ? expiring : expired

  async function handleRenew() {
    if (!showRenew) return
    setSaving(true)
    await fetch('/api/licenses/renew', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id:showRenew.id, months:renewMonths}) })
    setShowRenew(null); setSaving(false); load()
  }

  return (
    <DashboardLayout title="Renewals">
      <div className="space-y-5">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="slide-up bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-yellow-400" size={20}/>
              <div>
                <p className="text-2xl font-bold text-white">{expiring.length}</p>
                <p className="text-xs text-yellow-400">Expiring Soon</p>
              </div>
            </div>
          </div>
          <div className="slide-up stagger-1 bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <XCircle className="text-red-400" size={20}/>
              <div>
                <p className="text-2xl font-bold text-white">{expired.length}</p>
                <p className="text-xs text-red-400">Expired</p>
              </div>
            </div>
          </div>
          <div className="slide-up stagger-2 bg-brand-500/10 border border-brand-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <Clock className="text-brand-400" size={20}/>
              <div>
                <p className="text-2xl font-bold text-white">{expiring.length + expired.length}</p>
                <p className="text-xs text-brand-400">Need Attention</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-input border border-input-border rounded-xl p-1 w-fit">
          {[{k:'expiring',label:`Expiring (${expiring.length})`,icon:AlertTriangle},{k:'expired',label:`Expired (${expired.length})`,icon:XCircle}].map(t => (
            <button key={t.k} onClick={()=>setTab(t.k as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab===t.k?'bg-brand-600 text-white':'text-gray-400 hover:text-gray-200'}`}>
              <t.icon size={14}/> {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <PageSpinner />
        ) : shown.length === 0 ? (
          <EmptyState icon={<CheckCircle size={28}/>}
            title={tab==='expiring'?'No expiring licenses':'No expired licenses'}
            description={tab==='expiring'?'All licenses are in good standing.':'No expired licenses found.'}/>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead><tr>
                  <th>License Key</th><th>Company</th><th>Product</th>
                  <th>Expiry Date</th><th>Days</th><th>Est. Cost</th><th className="text-right">Action</th>
                </tr></thead>
                <tbody>
                  {shown.map((lic, i) => {
                    const days = getDaysUntilExpiry(lic.expiryDate)
                    const urgency = days === null ? 'gray' : days < 0 ? 'red' : days <= 7 ? 'red' : days <= 30 ? 'yellow' : 'green'
                    return (
                      <tr key={lic.id}>
                        <td><span className="font-mono text-xs text-card-text">{lic.licenseKey}</span></td>
                        <td className="text-gray-300">{lic.company?.name||'—'}</td>
                        <td className="text-gray-300">{lic.product?.name||'—'}</td>
                        <td className="text-gray-300 text-xs">{lic.expiryDate?formatDate(lic.expiryDate):'—'}</td>
                        <td>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            urgency==='red'?'bg-red-500/10 text-red-400':
                            urgency==='yellow'?'bg-yellow-500/10 text-yellow-400':
                            'bg-green-500/10 text-green-400'
                          }`}>
                            {days===null?'—':days<0?`${Math.abs(days)}d ago`:days===0?'Today':`${days}d`}
                          </span>
                        </td>
                        <td className="text-green-400 text-sm">
                          {lic.product?.price?`$${lic.product.price.toLocaleString('en-US',{minimumFractionDigits:2})}`:'—'}
                        </td>
                        <td>
                          <div className="flex justify-end">
                            <Button size="sm" variant="success" icon={<RefreshCw size={12}/>}
                              onClick={()=>{setShowRenew(lic);setRenewMonths('12')}}>
                              Renew
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      <Modal open={!!showRenew} onClose={()=>setShowRenew(null)} title="Renew License" size="sm">
        <div className="space-y-4">
          <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">License Key</p>
            <p className="font-mono text-sm text-brand-400">{showRenew?.licenseKey}</p>
            {showRenew?.expiryDate && <p className="text-xs text-gray-500 mt-1">Current expiry: {formatDate(showRenew.expiryDate)}</p>}
          </div>
          <Select label="Renewal Period" value={renewMonths} onChange={setRenewMonths}
            options={[{value:'1',label:'1 Month'},{value:'3',label:'3 Months'},{value:'6',label:'6 Months'},{value:'12',label:'1 Year'},{value:'24',label:'2 Years'},{value:'36',label:'3 Years'}]}/>
          {showRenew?.product?.price && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm text-green-400">
              Estimated cost: ${((showRenew.product.price / 12) * parseInt(renewMonths)).toLocaleString('en-US', {minimumFractionDigits:2})}
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={()=>setShowRenew(null)}>Cancel</Button>
            <Button variant="success" onClick={handleRenew} loading={saving} icon={<RefreshCw size={13}/>}>Renew License</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
