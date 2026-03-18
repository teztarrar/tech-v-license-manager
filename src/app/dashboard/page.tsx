'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatCard, Card, PageSpinner } from '@/components/ui'
import { Key, CheckCircle, AlertTriangle, XCircle, Building2, RefreshCw } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1d2e] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-gray-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: <span className="text-white font-bold">{p.value}</span></p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return (
    <DashboardLayout title="Dashboard">
      <PageSpinner />
    </DashboardLayout>
  )

  const { stats, timeline, productDistribution, revenue, recentLicenses } = data || {}

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Licenses" value={stats?.total ?? 0} icon={<Key size={20}/>} color="brand" subtitle="All licenses" />
          <StatCard title="Active" value={stats?.active ?? 0} icon={<CheckCircle size={20}/>} color="green" subtitle="In good standing" />
          <StatCard title="Expiring Soon" value={stats?.expiring ?? 0} icon={<AlertTriangle size={20}/>} color="yellow" subtitle="Within 30 days" />
          <StatCard title="Expired" value={stats?.expired ?? 0} icon={<XCircle size={20}/>} color="red" subtitle="Needs renewal" />
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Companies" value={stats?.companies ?? 0} icon={<Building2 size={20}/>} color="blue" />
          <StatCard title="Products" value={productDistribution?.length ?? 0} icon={<Key size={20}/>} color="brand" />
          <StatCard title="Renewals Needed" value={(stats?.expiring ?? 0) + (stats?.expired ?? 0)} icon={<RefreshCw size={20}/>} color="yellow" />
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Expiry Timeline */}
          <Card title="Expiry Timeline (12 months)" className="lg:col-span-2">
            <div className="p-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeline}>
                  <defs>
                    <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTooltip />}/>
                  <Area type="monotone" dataKey="expiring" name="Expiring" stroke="#6366f1" fill="url(#expGrad)" strokeWidth={2}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Product Distribution */}
          <Card title="Product Distribution">
            <div className="p-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={productDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                    dataKey="value" nameKey="name" paddingAngle={3}>
                    {productDistribution?.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />}/>
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Revenue by product */}
          <Card title="Revenue by Product">
            <div className="p-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenue} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}
                    tickFormatter={v => `$${(v/1000).toFixed(0)}k`}/>
                  <Tooltip content={<CustomTooltip />}/>
                  <Bar dataKey="revenue" name="Revenue ($)" radius={[4,4,0,0]}>
                    {revenue?.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent Licenses */}
          <Card title="Recent Licenses" action={
            <Link href="/licenses" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View all →</Link>
          }>
            <div className="divide-y divide-card-border">
              {recentLicenses?.length === 0 && (
                <p className="px-6 py-4 text-sm text-gray-500">No licenses yet</p>
              )}
              {recentLicenses?.map((lic: any) => (
                <motion.div
                  key={lic.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-card-hover transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-mono text-card-text truncate">{lic.licenseKey}</p>
                    <p className="text-xs text-gray-500">{lic.company?.name ?? 'No company'} · {lic.product?.name ?? 'No product'}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      lic.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' :
                      lic.status === 'EXPIRING' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>{lic.status}</span>
                    {lic.expiryDate && (
                      <span className="text-xs text-gray-500 hidden sm:inline">{formatDate(lic.expiryDate)}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
