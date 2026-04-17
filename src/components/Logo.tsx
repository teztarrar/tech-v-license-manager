'use client'
import { motion } from 'framer-motion'
import { useTheme } from './ThemeProvider'

export function Logo({ size = 32 }: { size?: number }) {
  const { theme } = useTheme()
  const accent = theme === 'neon' ? '#a78bfa' : '#3b82f6'
  return (
    <div className="flex items-center gap-2">
      <motion.svg width={size} height={size} viewBox="0 0 32 32"
        initial={{ rotate: -10, scale: 0.9 }} animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}>
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={theme === 'neon' ? '#7c3aed' : '#3b82f6'}>
              <animate attributeName="stop-color" values={theme==='neon'?'#7c3aed;#a78bfa;#7c3aed':'#3b82f6;#6366f1;#3b82f6'} dur="3s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor={theme === 'neon' ? '#a78bfa' : '#6366f1'}>
              <animate attributeName="stop-color" values={theme==='neon'?'#a78bfa;#7c3aed;#a78bfa':'#6366f1;#3b82f6;#6366f1'} dur="3s" repeatCount="indefinite"/>
            </stop>
          </linearGradient>
        </defs>
        <motion.rect x="2" y="2" width="28" height="28" rx="8" fill="url(#logoGrad)"
          animate={{ rx: [8, 10, 8] }} transition={{ duration: 3, repeat: Infinity }}/>
        <text x="16" y="21" textAnchor="middle" fontSize="13" fontWeight="700" fill="white" fontFamily="sans-serif">TV</text>
      </motion.svg>
      <div>
        <div className={`font-semibold text-sm leading-none ${theme==='neon'?'text-purple-400':''}`}>Tech V</div>
        <div className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mt-0.5">License Hub</div>
      </div>
    </div>
  )
}
