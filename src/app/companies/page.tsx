'use client'
import { useEffect, useState, useCallback } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Modal, Button, Input, Card, EmptyState, PageSpinner } from '@/components/ui'
import { Plus, Edit2, Trash2, Building2, Mail, Phone, MapPin, User } from 'lucide-react'

interface Company { id:string; name:string; location?:string|null; contactPerson?:string|null; email?:string|null; phone?:string|null; _count?:{licenses:number}; createdAt:string }
const emptyForm = { name:'', location:'', contactPerson:'', email:'', phone:'' }

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState<Company|null>(null)
  const [showDelete, setShowDelete] = useState<Company|null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/companies')
    setCompanies(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.location?.toLowerCase().includes(search.toLowerCase())
  )

  function openEdit(c: Company) {
    setForm({ name:c.name, location:c.location||'', contactPerson:c.contactPerson||'', email:c.email||'', phone:c.phone||'' })
    setShowEdit(c)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const url = showEdit ? `/api/companies/${showEdit.id}` : '/api/companies'
      const method = showEdit ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
      if (res.ok) { setShowAdd(false); setShowEdit(null); setForm(emptyForm); load() }
      else { const e = await res.json(); alert(e.error||'Error') }
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!showDelete) return
    setSaving(true)
    await fetch(`/api/companies/${showDelete.id}`, { method:'DELETE' })
    setShowDelete(null); setSaving(false); load()
  }

  return (
    <DashboardLayout title="Companies">
      <div className="space-y-5">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search companies..."
              className="w-full pl-9 pr-4 py-2.5 bg-input border border-input-border rounded-lg text-sm text-input-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"/>
          </div>
          <Button icon={<Plus size={14}/>} onClick={()=>{setForm(emptyForm);setShowAdd(true)}}>Add Company</Button>
        </div>

        {loading ? (
          <PageSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Building2 size={28}/>} title="No companies found"
            description="Add your first company to start managing licenses"
            action={<Button icon={<Plus size={14}/>} onClick={()=>{setForm(emptyForm);setShowAdd(true)}}>Add Company</Button>}/>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c, i) => (
              <div key={c.id} className="bg-card border border-card-border rounded-2xl p-5 hover:border-brand-500/30 transition-colors group slide-up">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600/20 to-brand-800/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-lg">
                      {c.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-text">{c.name}</h3>
                      <span className="text-xs text-gray-500">{c._count?.licenses||0} license{c._count?.licenses!==1?'s':''}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={()=>openEdit(c)} className="p-1.5 rounded hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-colors"><Edit2 size={13}/></button>
                    <button onClick={()=>setShowDelete(c)} className="p-1.5 rounded hover:bg-white/5 text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={13}/></button>
                  </div>
                </div>
                <div className="space-y-2">
                  {c.location && <div className="flex items-center gap-2 text-xs text-gray-400"><MapPin size={12} className="text-gray-600"/>{c.location}</div>}
                  {c.contactPerson && <div className="flex items-center gap-2 text-xs text-gray-400"><User size={12} className="text-gray-600"/>{c.contactPerson}</div>}
                  {c.email && <div className="flex items-center gap-2 text-xs text-gray-400"><Mail size={12} className="text-gray-600"/><a href={`mailto:${c.email}`} className="hover:text-brand-400 transition-colors">{c.email}</a></div>}
                  {c.phone && <div className="flex items-center gap-2 text-xs text-gray-400"><Phone size={12} className="text-gray-600"/>{c.phone}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={showAdd||!!showEdit} onClose={()=>{setShowAdd(false);setShowEdit(null)}} title={showEdit?'Edit Company':'Add Company'}>
        <div className="space-y-4">
          <Input label="Company Name" value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="Acme Corporation" required/>
          <Input label="Location" value={form.location} onChange={v=>setForm({...form,location:v})} placeholder="New York, USA"/>
          <Input label="Contact Person" value={form.contactPerson} onChange={v=>setForm({...form,contactPerson:v})} placeholder="John Smith"/>
          <div className="form-grid">
            <Input label="Email" value={form.email} onChange={v=>setForm({...form,email:v})} type="email" placeholder="contact@company.com"/>
            <Input label="Phone" value={form.phone} onChange={v=>setForm({...form,phone:v})} placeholder="+1-555-0100"/>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={()=>{setShowAdd(false);setShowEdit(null)}}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{showEdit?'Save Changes':'Add Company'}</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!showDelete} onClose={()=>setShowDelete(null)} title="Delete Company" size="sm">
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">Delete <span className="text-white font-medium">{showDelete?.name}</span>? This will not delete associated licenses.</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={()=>setShowDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={saving}>Delete</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
