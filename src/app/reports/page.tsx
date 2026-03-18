'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, Button, PageSpinner } from '@/components/ui'
import { Download, TrendingUp, PieChart, BarChart2, Activity } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart as RPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line
} from 'recharts'
import { formatDate } from '@/lib/utils'
import * as XLSX from 'xlsx'

const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1d2e] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <span className="text-white font-bold">{typeof p.value === 'number' && p.name?.includes('$') ? `$${p.value.toLocaleString()}` : p.value}</span></p>
      ))}
    </div>
  )
}

export default function ReportsPage() {
  const [data, setData] = useState<any>(null)
  const [licenses, setLicenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard').then(r => r.json()),
      fetch('/api/licenses').then(r => r.json()),
    ]).then(([dash, lics]) => {
      setData(dash)
      setLicenses(Array.isArray(lics) ? lics : [])
      setLoading(false)
    })
  }, [])

  function exportReport() {
    if (!licenses.length) return
    const rows = licenses.map(l => ({
      'License Key': l.licenseKey,
      'Serial Number': l.serialNumber || '',
      'Status': l.status,
      'Company': l.company?.name || '',
      'Product': l.product?.name || '',
      'Location': l.location || '',
      'Purchase Date': l.purchaseDate ? formatDate(l.purchaseDate) : '',
      'Expiry Date': l.expiryDate ? formatDate(l.expiryDate) : '',
      'Price': l.product?.price ? `$${l.product.price}` : '',
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'License Report')
    XLSX.writeFile(wb, `techv-report-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  if (loading) return (
    <DashboardLayout title="Reports & Analytics">
      <PageSpinner />
    </DashboardLayout>
  )

  const statusDist = [
    { name: 'Active', value: data?.stats?.active || 0, color: '#10b981' },
    { name: 'Expiring', value: data?.stats?.expiring || 0, color: '#f59e0b' },
    { name: 'Expired', value: data?.stats?.expired || 0, color: '#ef4444' },
  ]

  const totalRevenue = data?.revenue?.reduce((s: number, r: any) => s + r.revenue, 0) || 0

  return (
    <DashboardLayout title="Reports & Analytics">
      <div className="space-y-6">
        {/* Export button */}
        <div className="flex justify-end">
          <Button icon={<Download size={14}/>} onClick={exportReport} variant="secondary">Export Full Report</Button>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Licenses', value: data?.stats?.total || 0, icon: Activity, color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/20' },
            { label: 'Compliance Rate', value: `${data?.stats?.total ? Math.round((data.stats.active / data.stats.total) * 100) : 0}%`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
            { label: 'Est. Annual Revenue', value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`, icon: BarChart2, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
            { label: 'Product Count', value: data?.productDistribution?.length || 0, icon: PieChart, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          ].map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`${kpi.bg} border rounded-2xl p-5`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{kpi.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
                </div>
                <kpi.icon className={kpi.color} size={20}/>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card title="License Expiry Timeline">
            <div className="p-4 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.timeline}>
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTooltip />}/>
                  <Area type="monotone" dataKey="expiring" name="Expiring" stroke="#6366f1" fill="url(#grad1)" strokeWidth={2}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="License Status Distribution">
            <div className="p-4 h-60 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <RPieChart>
                  <Pie data={statusDist} cx="40%" cy="50%" innerRadius={50} outerRadius={80}
                    dataKey="value" nameKey="name" paddingAngle={4}>
                    {statusDist.map((d, i) => <Cell key={i} fill={d.color}/>)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />}/>
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}/>
                </RPieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card title="Revenue by Product">
            <div className="p-4 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.revenue} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`}/>
                  <Tooltip content={<CustomTooltip />}/>
                  <Bar dataKey="revenue" name="Revenue ($)" radius={[4,4,0,0]}>
                    {data?.revenue?.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="License Count by Product">
            <div className="p-4 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.productDistribution} barSize={28} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false}/>
                  <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}/>
                  <YAxis dataKey="name" type="category" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={100}/>
                  <Tooltip content={<CustomTooltip />}/>
                  <Bar dataKey="value" name="Licenses" radius={[0,4,4,0]}>
                    {data?.productDistribution?.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
