'use client'
import { motion } from 'framer-motion'

export function TechVLogo({ size = 32, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="logoGrad2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          {/* Hexagon background */}
          <motion.path
            d="M20 2L35 11V29L20 38L5 29V11L20 2Z"
            fill="url(#logoGrad)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          {/* Inner glow */}
          <path
            d="M20 5L33 13V27L20 35L7 27V13L20 5Z"
            fill="none"
            stroke="url(#logoGrad2)"
            strokeWidth="0.5"
            opacity="0.4"
          />
          {/* T letter */}
          <motion.path
            d="M12 14H22M17 14V26"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
          {/* V letter */}
          <motion.path
            d="M22 14L26 26L28 14"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          />
        </svg>
      </motion.div>
      {showText && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex flex-col leading-none"
        >
          <span className="text-lg font-bold tracking-tight text-white">
            Tech<span className="text-indigo-400">V</span>
          </span>
          <span className="text-[9px] text-slate-400 font-medium tracking-widest uppercase">
            License Manager
          </span>
        </motion.div>
      )}
    </div>
  )
}
