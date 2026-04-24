'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export function GlowCursor() {
  const [mounted, setMounted] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 }
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [x, y])

  if (!mounted) return null

  return (
    <>
      {/* Main glow */}
      <motion.div
        ref={cursorRef}
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--brand-glow) 0%, transparent 70%)',
            opacity: 0.4,
          }}
        />
      </motion.div>

      {/* Small bright dot */}
      <motion.div
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none mix-blend-screen"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: 'var(--brand-500)',
            boxShadow: '0 0 12px 2px var(--brand-glow), 0 0 30px 6px var(--brand-glow)',
          }}
        />
      </motion.div>
    </>
  )
}

