'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Modal, Button, Input, Select, Card, EmptyState } from '@/components/ui'
import { Plus, Edit2, Trash2, Package, DollarSign, Tag, RefreshCw } from 'lucide-react'
import { PageSpinner } from '@/components/ui'

interface Product { id:string; name:string; vendor?:string|null; licenseType?:string|null; renewalCycle?:string|null; price?:number|null; _count?:{licenses:number}; createdAt:string }
const emptyForm = { name:'', vendor:'', licenseType:'', renewalCycle:'', price:'' }
const licenseTypes = [{value:'Perpetual',label:'Perpetual'},{value:'Subscription',label:'Subscription'},{value:'Trial',label:'Trial'},{value:'Open Source',label:'Open Source'}]
const renewalCycles = [{value:'Monthly',label:'Monthly'},{value:'Quarterly',label:'Quarterly'},{value:'Annual',label:'Annual'},{value:'Biennial',label:'Biennial'},{value:'N/A',label:'N/A'}]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState<Product|null>(null)
  const [showDelete, setShowDelete] = useState<Product|null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/products')
    setProducts(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.vendor?.toLowerCase().includes(search.toLowerCase())
  )

  function openEdit(p: Product) {
    setForm({ name:p.name, vendor:p.vendor||'', licenseType:p.licenseType||'', renewalCycle:p.renewalCycle||'', price:p.price?.toString()||'' })
    setShowEdit(p)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const url = showEdit ? `/api/products/${showEdit.id}` : '/api/products'
      const method = showEdit ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
      if (res.ok) { setShowAdd(false); setShowEdit(null); setForm(emptyForm); load() }
      else { const e = await res.json(); alert(e.error||'Error') }
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!showDelete) return
    setSaving(true)
    await fetch(`/api/products/${showDelete.id}`, { method:'DELETE' })
    setShowDelete(null); setSaving(false); load()
  }

  const licenseTypeColors: Record<string, string> = {
    'Perpetual': 'bg-green-500/10 text-green-400',
    'Subscription': 'bg-brand-500/10 text-brand-400',
    'Trial': 'bg-yellow-500/10 text-yellow-400',
    'Open Source': 'bg-blue-500/10 text-blue-400',
  }

  return (
    <DashboardLayout title="Products">
      <div className="space-y-5">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Package size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 bg-input border border-input-border rounded-lg text-sm text-input-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"/>
          </div>
          <Button icon={<Plus size={14}/>} onClick={()=>{setForm(emptyForm);setShowAdd(true)}}>Add Product</Button>
        </div>

        {loading ? (
          <PageSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Package size={28}/>} title="No products found"
            description="Add your first product to start tracking licenses"
            action={<Button icon={<Plus size={14}/>} onClick={()=>{setForm(emptyForm);setShowAdd(true)}}>Add Product</Button>}/>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead><tr>
                  <th>Product</th><th>Vendor</th><th>License Type</th><th>Renewal Cycle</th><th>Price</th><th>Licenses</th><th className="text-right">Actions</th>
                </tr></thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <motion.tr key={p.id} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                            <Package size={14}/>
                          </div>
                          <span className="font-medium text-card-text">{p.name}</span>
                        </div>
                      </td>
                      <td className="text-gray-400">{p.vendor||'—'}</td>
                      <td>
                        {p.licenseType ? (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${licenseTypeColors[p.licenseType]||'bg-gray-500/10 text-gray-400'}`}>
                            {p.licenseType}
                          </span>
                        ) : <span className="text-gray-600">—</span>}
                      </td>
                      <td>
                        {p.renewalCycle ? (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <RefreshCw size={11}/> {p.renewalCycle}
                          </div>
                        ) : <span className="text-gray-600">—</span>}
                      </td>
                      <td>
                        {p.price ? (
                          <span className="text-green-400 font-medium text-sm">${p.price.toLocaleString('en-US',{minimumFractionDigits:2})}</span>
                        ) : <span className="text-gray-600">—</span>}
                      </td>
                      <td>
                        <span className="text-sm font-medium text-card-text">{p._count?.licenses||0}</span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={()=>openEdit(p)} className="p-1.5 rounded hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-colors"><Edit2 size={13}/></button>
                          <button onClick={()=>setShowDelete(p)} className="p-1.5 rounded hover:bg-white/5 text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={13}/></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      <Modal open={showAdd||!!showEdit} onClose={()=>{setShowAdd(false);setShowEdit(null)}} title={showEdit?'Edit Product':'Add Product'}>
        <div className="space-y-4">
          <Input label="Product Name" value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="Enterprise Suite Pro" required/>
          <Input label="Vendor / Publisher" value={form.vendor} onChange={v=>setForm({...form,vendor:v})} placeholder="Microsoft"/>
          <div className="form-grid">
            <Select label="License Type" value={form.licenseType} onChange={v=>setForm({...form,licenseType:v})} options={licenseTypes} placeholder="Select type"/>
            <Select label="Renewal Cycle" value={form.renewalCycle} onChange={v=>setForm({...form,renewalCycle:v})} options={renewalCycles} placeholder="Select cycle"/>
          </div>
          <Input label="Price (USD)" value={form.price} onChange={v=>setForm({...form,price:v})} type="number" placeholder="999.99"/>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={()=>{setShowAdd(false);setShowEdit(null)}}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{showEdit?'Save Changes':'Add Product'}</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!showDelete} onClose={()=>setShowDelete(null)} title="Delete Product" size="sm">
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">Delete <span className="text-white font-medium">{showDelete?.name}</span>?</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={()=>setShowDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={saving}>Delete</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
