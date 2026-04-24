'use client'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Modal, Button, Input, Select, Card, EmptyState, useToast, SkeletonTable } from '@/components/ui'
import { Plus, Search, Download, Upload, RefreshCw, Edit2, Trash2, Key, Copy, CheckCheck } from 'lucide-react'
import { formatDate, getDaysUntilExpiry, generateLicenseKey } from '@/lib/utils'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

interface License {
  id: string; licenseKey: string; serialNumber?: string|null; status: string
  location?: string|null; purchaseDate?: string|null; expiryDate?: string|null
  notes?: string|null; companyId?: string|null; productId?: string|null
  company?: {id:string;name:string}|null; product?: {id:string;name:string;price?:number|null}|null
}
interface Company { id: string; name: string }
interface Product { id: string; name: string }

const emptyForm = { licenseKey:'', serialNumber:'', location:'', purchaseDate:'', expiryDate:'', notes:'', companyId:'', productId:'' }

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCompany, setFilterCompany] = useState('')
  const [filterProduct, setFilterProduct] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState<License|null>(null)
  const [showRenew, setShowRenew] = useState<License|null>(null)
  const [showDelete, setShowDelete] = useState<License|null>(null)
  const [form, setForm] = useState(emptyForm)
  const [renewMonths, setRenewMonths] = useState('12')
  const [saving, setSaving] = useState(false)
  const [copiedId, setCopiedId] = useState<string|null>(null)
  const [showImport, setShowImport] = useState(false)
  const [importResult, setImportResult] = useState<{created:number;errors:string[]}|null>(null)
  const { addToast } = useToast()

  const [debouncedSearch, setDebouncedSearch] = useState(search)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250)
    return () => clearTimeout(t)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (filterStatus) params.set('status', filterStatus)
    if (filterCompany) params.set('companyId', filterCompany)
    if (filterProduct) params.set('productId', filterProduct)
    const [lics, comps, prods] = await Promise.all([
      fetch(`/api/licenses?${params}`).then(r => r.json()),
      fetch('/api/companies').then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
    ])
    setLicenses(Array.isArray(lics) ? lics : [])
    setCompanies(Array.isArray(comps) ? comps : [])
    setProducts(Array.isArray(prods) ? prods : [])
    setLoading(false)
  }, [debouncedSearch, filterStatus, filterCompany, filterProduct])

  useEffect(() => { load() }, [load])

  function openAdd() { setForm(emptyForm); setShowAdd(true) }
  function openEdit(lic: License) {
    setForm({
      licenseKey: lic.licenseKey, serialNumber: lic.serialNumber || '',
      location: lic.location || '', notes: lic.notes || '',
      purchaseDate: lic.purchaseDate ? lic.purchaseDate.split('T')[0] : '',
      expiryDate: lic.expiryDate ? lic.expiryDate.split('T')[0] : '',
      companyId: lic.companyId || '', productId: lic.productId || '',
    })
    setShowEdit(lic)
  }
  function closeModal() { setShowAdd(false); setShowEdit(null); setForm(emptyForm) }

  async function handleSave() {
    setSaving(true)
    try {
      const url = showEdit ? `/api/licenses/${showEdit.id}` : '/api/licenses'
      const method = showEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(form),
      })
      if (res.ok) {
        closeModal(); load()
        addToast(showEdit ? 'License updated' : 'License added', 'success')
      } else {
        const e = await res.json()
        addToast(e.error || 'Error saving license', 'error')
      }
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!showDelete) return
    setSaving(true)
    const res = await fetch(`/api/licenses/${showDelete.id}`, { method: 'DELETE' })
    if (res.ok) {
      setShowDelete(null); load()
      addToast('License deleted', 'success')
    } else {
      addToast('Failed to delete license', 'error')
    }
    setSaving(false)
  }

  async function handleRenew() {
    if (!showRenew) return
    setSaving(true)
    const res = await fetch('/api/licenses/renew', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ id: showRenew.id, months: renewMonths }),
    })
    if (res.ok) {
      setShowRenew(null); load()
      addToast('License renewed successfully', 'success')
    } else {
      addToast('Failed to renew license', 'error')
    }
    setSaving(false)
  }

  function copyKey(key: string, id: string) {
    navigator.clipboard.writeText(key)
    setCopiedId(id)
    addToast('License key copied', 'success')
    setTimeout(() => setCopiedId(null), 2000)
  }

  function exportExcel() {
    const rows = licenses.map(l => ({
      'License Key': l.licenseKey, 'Serial Number': l.serialNumber || '',
      'Status': l.status, 'Company': l.company?.name || '',
      'Product': l.product?.name || '', 'Location': l.location || '',
      'Purchase Date': l.purchaseDate ? formatDate(l.purchaseDate) : '',
      'Expiry Date': l.expiryDate ? formatDate(l.expiryDate) : '',
      'Notes': l.notes || '',
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Licenses')
    XLSX.writeFile(wb, `techv-licenses-${new Date().toISOString().split('T')[0]}.xlsx`)
    addToast('Licenses exported', 'success')
  }

  async function handleImportCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: async (results) => {
        const res = await fetch('/api/licenses/import', {
          method: 'POST', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ licenses: results.data }),
        })
        const data = await res.json()
        setImportResult(data); setShowImport(true); load()
        addToast(`${data.created} licenses imported`, data.errors.length ? 'info' : 'success')
        e.target.value = ''
      },
    })
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      ACTIVE:   'bg-[var(--status-active-bg)] text-[var(--status-active-text)] border border-[var(--status-active-border)]',
      EXPIRING: 'bg-[var(--status-expiring-bg)] text-[var(--status-expiring-text)] border border-[var(--status-expiring-border)]',
      EXPIRED:  'bg-[var(--status-expired-bg)] text-[var(--status-expired-text)] border border-[var(--status-expired-border)]',
    }
    return map[status] || map.ACTIVE
  }

  return (
    <DashboardLayout title="License Manager">
      <div className="space-y-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by key, serial, location…"
              className="w-full pl-9 pr-4 py-2.5 bg-input border border-input-border rounded-lg text-sm text-input-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/40"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-input border border-input-border rounded-lg text-sm text-input-text focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/40">
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRING">Expiring</option>
              <option value="EXPIRED">Expired</option>
            </select>
            <select value={filterCompany} onChange={e => setFilterCompany(e.target.value)}
              className="px-3 py-2 bg-input border border-input-border rounded-lg text-sm text-input-text focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/40">
              <option value="">All Companies</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={filterProduct} onChange={e => setFilterProduct(e.target.value)}
              className="px-3 py-2 bg-input border border-input-border rounded-lg text-sm text-input-text focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/40">
              <option value="">All Products</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <Button variant="secondary" icon={<Download size={14} />} onClick={exportExcel}>Export</Button>
            <label className="flex items-center gap-2 px-4 py-2 bg-secondary border border-input-border rounded-lg text-secondary-text text-sm font-medium cursor-pointer hover:bg-secondary-hover transition-colors">
              <Upload size={14} /> Import CSV
              <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
            </label>
            <Button icon={<Plus size={14} />} onClick={openAdd}>Add License</Button>
          </div>
        </div>

        {/* Table */}
        <Card>
          {loading ? (
            <SkeletonTable rows={6} cols={7} />
          ) : licenses.length === 0 ? (
            <EmptyState
              icon={<Key size={28} />} title="No licenses found"
              description="Add your first license or adjust filters"
              action={<Button icon={<Plus size={14} />} onClick={openAdd}>Add License</Button>}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th>License Key</th><th>Company</th><th>Product</th>
                    <th>Status</th><th>Expiry Date</th><th>Location</th><th className="text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {licenses.map((lic, i) => {
                    const days = getDaysUntilExpiry(lic.expiryDate)
                    return (
                      <motion.tr
                        key={lic.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.02, 0.4) }}
                      >
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-card-text truncate max-w-[180px]">{lic.licenseKey}</span>
                            <button
                              onClick={() => copyKey(lic.licenseKey, lic.id)}
                              className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
                              title="Copy key"
                            >
                              {copiedId === lic.id
                                ? <CheckCheck size={12} className="text-green-400" />
                                : <Copy size={12} />}
                            </button>
                          </div>
                          {lic.serialNumber && (
                            <p className="text-[10px] text-gray-500 mt-0.5 font-mono">{lic.serialNumber}</p>
                          )}
                        </td>
                        <td className="text-gray-300 text-sm">
                          {lic.company?.name || <span className="text-gray-600">—</span>}
                        </td>
                        <td className="text-gray-300 text-sm">
                          {lic.product?.name || <span className="text-gray-600">—</span>}
                        </td>
                        <td>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusBadge(lic.status)}`}>
                            {lic.status}
                          </span>
                        </td>
                        <td>
                          <div>
                            <span className="text-gray-300 text-xs">
                              {lic.expiryDate ? formatDate(lic.expiryDate) : <span className="text-gray-600">—</span>}
                            </span>
                            {days !== null && days >= 0 && days <= 60 && (
                              <p className={`text-[10px] mt-0.5 font-medium ${days <= 7 ? 'text-red-400' : days <= 30 ? 'text-yellow-400' : 'text-gray-500'}`}>
                                {days === 0 ? 'Expires today' : days === 1 ? '1 day left' : `${days}d left`}
                              </p>
                            )}
                            {days !== null && days < 0 && (
                              <p className="text-[10px] text-red-400 mt-0.5">{Math.abs(days)}d ago</p>
                            )}
                          </div>
                        </td>
                        <td className="text-gray-400 text-xs">
                          {lic.location || <span className="text-gray-600">—</span>}
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-1 pr-2">
                            <button onClick={() => openEdit(lic)} title="Edit" className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-colors"><Edit2 size={13} /></button>
                            <button onClick={() => { setShowRenew(lic); setRenewMonths('12') }} title="Renew" className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-green-400 transition-colors"><RefreshCw size={13} /></button>
                            <button onClick={() => setShowDelete(lic)} title="Delete" className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <p className="text-xs text-gray-500 pl-1">
          {licenses.length} license{licenses.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Add / Edit Modal */}
      <Modal open={showAdd || !!showEdit} onClose={closeModal} title={showEdit ? 'Edit License' : 'Add New License'} size="lg">
        <div className="space-y-4">
          <div className="form-grid">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">License Key <span className="text-red-400">*</span></label>
              <div className="flex gap-2">
                <input value={form.licenseKey} onChange={e => setForm({ ...form, licenseKey: e.target.value })} placeholder="XXXX-XXXX-XXXX-XXXX-XXXX" className="flex-1 px-3 py-2.5 bg-input border border-input-border rounded-lg text-sm text-input-text font-mono placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/50" />
                <button type="button" onClick={() => setForm({ ...form, licenseKey: generateLicenseKey() })} className="px-3 py-2 bg-brand-600/20 text-brand-400 rounded-lg hover:bg-brand-600/30 transition-colors text-xs font-medium whitespace-nowrap">Generate</button>
              </div>
            </div>
            <Input label="Serial Number" value={form.serialNumber} onChange={v => setForm({ ...form, serialNumber: v })} placeholder="SN-XXX-2024" />
          </div>
          <div className="form-grid">
            <Select label="Company" value={form.companyId} onChange={v => setForm({ ...form, companyId: v })} options={companies.map(c => ({ value: c.id, label: c.name }))} placeholder="Select company" />
            <Select label="Product" value={form.productId} onChange={v => setForm({ ...form, productId: v })} options={products.map(p => ({ value: p.id, label: p.name }))} placeholder="Select product" />
          </div>
          <div className="form-grid">
            <Input label="Purchase Date" value={form.purchaseDate} onChange={v => setForm({ ...form, purchaseDate: v })} type="date" />
            <Input label="Expiry Date" value={form.expiryDate} onChange={v => setForm({ ...form, expiryDate: v })} type="date" />
          </div>
          <Input label="Location" value={form.location} onChange={v => setForm({ ...form, location: v })} placeholder="Server Room / Dept / Remote" />
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Additional notes…" className="w-full px-3 py-2.5 bg-input border border-input-border rounded-lg text-sm text-input-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/50 resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-modal-border">
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{showEdit ? 'Save Changes' : 'Add License'}</Button>
          </div>
        </div>
      </Modal>

      {/* Renew Modal */}
      <Modal open={!!showRenew} onClose={() => setShowRenew(null)} title="Renew License" size="sm">
        <div className="space-y-4">
          <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">License Key</p>
            <p className="font-mono text-sm text-brand-400 break-all">{showRenew?.licenseKey}</p>
            {showRenew?.expiryDate && <p className="text-xs text-gray-500 mt-1">Current expiry: {formatDate(showRenew.expiryDate)}</p>}
          </div>
          <Select label="Renewal Period" value={renewMonths} onChange={setRenewMonths} options={[{value:'1',label:'1 Month'},{value:'3',label:'3 Months'},{value:'6',label:'6 Months'},{value:'12',label:'1 Year'},{value:'24',label:'2 Years'},{value:'36',label:'3 Years'}]} />
          <div className="flex justify-end gap-3 pt-2 border-t border-modal-border">
            <Button variant="secondary" onClick={() => setShowRenew(null)}>Cancel</Button>
            <Button variant="success" onClick={handleRenew} loading={saving} icon={<RefreshCw size={13} />}>Renew License</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!showDelete} onClose={() => setShowDelete(null)} title="Delete License" size="sm">
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">Are you sure you want to delete this license? This action <strong className="text-white">cannot be undone</strong>.</p>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 font-mono text-xs text-red-400 break-all">{showDelete?.licenseKey}</div>
          <div className="flex justify-end gap-3 pt-2 border-t border-modal-border">
            <Button variant="secondary" onClick={() => setShowDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={saving} icon={<Trash2 size={13} />}>Delete License</Button>
          </div>
        </div>
      </Modal>

      {/* Import Results Modal */}
      <Modal open={showImport} onClose={() => setShowImport(false)} title="CSV Import Results" size="sm">
        <div className="space-y-3">
          {importResult && (
            <>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm text-green-400">✅ {importResult.created} license{importResult.created !== 1 ? 's' : ''} imported successfully</div>
              {importResult.errors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-xs text-red-400 font-medium mb-2">{importResult.errors.length} error{importResult.errors.length !== 1 ? 's' : ''}:</p>
                  <ul className="text-xs text-red-300 space-y-1 max-h-32 overflow-y-auto">{importResult.errors.map((e, i) => <li key={i}>• {e}</li>)}</ul>
                </div>
              )}
            </>
          )}
          <div className="flex justify-end"><Button onClick={() => setShowImport(false)}>Close</Button></div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

