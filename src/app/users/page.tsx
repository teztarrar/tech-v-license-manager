'use client'
import { useEffect, useState, useCallback } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Modal, Button, Input, Select, Card, Badge, EmptyState } from '@/components/ui'
import { Plus, Edit2, Trash2, Users, Shield, Eye, Lock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useSession } from 'next-auth/react'

interface User { id: string; name: string; email: string; role: string; twoFactorEnabled?: boolean; createdAt: string }
const emptyForm = { name: '', email: '', password: '', role: 'VIEWER' }
const roleOptions = [
  { value: 'ADMIN', label: 'Admin — Full access' },
  { value: 'MANAGER', label: 'Manager — Edit access' },
  { value: 'VIEWER', label: 'Viewer — Read only' },
]

export default function UsersPage() {
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState<User | null>(null)
  const [showDelete, setShowDelete] = useState<User | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/users')
    if (res.ok) setUsers(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function openEdit(u: User) {
    setForm({ name: u.name, email: u.email, password: '', role: u.role })
    setShowEdit(u)
    setError('')
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const url = showEdit ? `/api/users/${showEdit.id}` : '/api/users'
      const method = showEdit ? 'PUT' : 'POST'
      const body = showEdit
        ? { name: form.name, email: form.email, role: form.role, ...(form.password ? { password: form.password } : {}) }
        : form
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error saving user'); setSaving(false); return }
      setShowAdd(false); setShowEdit(null); setForm(emptyForm); load()
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!showDelete) return
    setSaving(true)
    const res = await fetch(`/api/users/${showDelete.id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Cannot delete user'); setSaving(false); return }
    setShowDelete(null); setSaving(false); setError(''); load()
  }

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    MANAGER: 'bg-brand-500/10 text-brand-400 border border-brand-500/20',
    VIEWER: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
  }
  const roleIcons: Record<string, React.ReactNode> = {
    ADMIN: <Shield size={11} />,
    MANAGER: <Lock size={11} />,
    VIEWER: <Eye size={11} />,
  }

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { role: 'ADMIN', label: 'Admins', color: 'from-purple-600/20 to-purple-800/10 border-purple-500/20' },
            { role: 'MANAGER', label: 'Managers', color: 'from-brand-600/20 to-brand-800/10 border-brand-500/20' },
            { role: 'VIEWER', label: 'Viewers', color: 'from-gray-600/20 to-gray-800/10 border-gray-500/20' },
          ].map((s, i) => (
            <div key={s.role} className={`bg-gradient-to-br ${s.color} border rounded-2xl p-4 slide-up stagger-${i + 1}`}>
              <p className="text-2xl font-bold text-white">{users.filter(u => u.role === s.role).length}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">{users.length} user{users.length !== 1 ? 's' : ''} in workspace</p>
          {isAdmin && (
            <Button icon={<Plus size={14} />} onClick={() => { setForm(emptyForm); setError(''); setShowAdd(true) }}>
              Add User
            </Button>
          )}
        </div>

        {/* Table */}
        <Card>
          {loading ? (
            <div className="flex justify-center py-16">
              <svg className="animate-spin h-6 w-6 text-indigo-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : users.length === 0 ? (
            <EmptyState icon={<Users size={28} />} title="No users found" description="Add users to give them access to Tech V." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>2FA</th>
                    <th>Joined</th>
                    {isAdmin && <th className="text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {u.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-card-text">{u.name}</p>
                            {u.id === (session?.user as any)?.id && (
                              <p className="text-[10px] text-brand-400">You</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-400 text-sm">{u.email}</td>
                      <td>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${roleColors[u.role] || roleColors.VIEWER}`}>
                          {roleIcons[u.role]}
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.twoFactorEnabled ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-500'}`}>
                          {u.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td className="text-gray-500 text-xs">{formatDate(u.createdAt)}</td>
                      {isAdmin && (
                        <td>
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEdit(u)} className="p-1.5 rounded hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-colors">
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => { setError(''); setShowDelete(u) }}
                              disabled={u.id === (session?.user as any)?.id}
                              className="p-1.5 rounded hover:bg-white/5 text-gray-500 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {!isAdmin && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-sm text-yellow-400">
            👀 You have <strong>Viewer</strong> access. Only Admins can add or modify users.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal open={showAdd || !!showEdit} onClose={() => { setShowAdd(false); setShowEdit(null); setError('') }}
        title={showEdit ? 'Edit User' : 'Add User'}>
        <div className="space-y-4">
          {error && (
            <div className="px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">{error}</div>
          )}
          <Input label="Full Name" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Jane Smith" required />
          <Input label="Email Address" value={form.email} onChange={v => setForm({ ...form, email: v })} type="email" placeholder="jane@company.com" required />
          <Input
            label={showEdit ? 'New Password (leave blank to keep)' : 'Password'}
            value={form.password}
            onChange={v => setForm({ ...form, password: v })}
            type="password"
            placeholder="••••••••"
            required={!showEdit}
          />
          <Select label="Role" value={form.role} onChange={v => setForm({ ...form, role: v })} options={roleOptions} />
          <div className="p-3 bg-input border border-input-border rounded-lg text-xs text-gray-400 space-y-1">
            <p><strong className="text-purple-400">Admin</strong> — Full access to all features and settings</p>
            <p><strong className="text-brand-400">Manager</strong> — Can add/edit licenses, companies, products</p>
            <p><strong className="text-gray-300">Viewer</strong> — Read-only access to all data</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setShowAdd(false); setShowEdit(null); setError('') }}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{showEdit ? 'Save Changes' : 'Add User'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!showDelete} onClose={() => { setShowDelete(null); setError('') }} title="Remove User" size="sm">
        <div className="space-y-4">
          {error && <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">{error}</div>}
          <p className="text-gray-400 text-sm">Remove <span className="text-white font-medium">{showDelete?.name}</span> from the workspace? They will lose all access immediately.</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { setShowDelete(null); setError('') }}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={saving} icon={<Trash2 size={13} />}>Remove User</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
