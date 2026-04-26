'use client'
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
