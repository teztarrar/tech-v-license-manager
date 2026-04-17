'use client'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface Props { label: string; value: string|number; delta?: string; deltaType?: 'up'|'down'|'neutral'; icon: LucideIcon; color: string; delay?: number }

export function StatCard({ label, value, delta, deltaType='neutral', icon: Icon, color, delay=0 }: Props) {
  const colors: Record<string,string> = { blue:'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-600', green:'border-green-500 bg-green-50 dark:bg-green-950 text-green-600', amber:'border-amber-500 bg-amber-50 dark:bg-amber-950 text-amber-600', red:'border-red-500 bg-red-50 dark:bg-red-950 text-red-600' }
  const deltaColor = deltaType==='up'?'text-green-500':deltaType==='down'?'text-red-500':'text-gray-400'
  return (
    <motion.div className="card-bg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 relative overflow-hidden"
      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay, duration:.4 }}>
      <div className={`absolute top-0 left-0 w-full h-0.5 ${color==='blue'?'bg-blue-500':color==='green'?'bg-green-500':color==='amber'?'bg-amber-500':'bg-red-500'}`}/>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          {delta && <p className={`text-xs mt-1 ${deltaColor}`}>{delta}</p>}
        </div>
        <div className={`p-2 rounded-lg ${colors[color]}`}><Icon size={16}/></div>
      </div>
    </motion.div>
  )
}
