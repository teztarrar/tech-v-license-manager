'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  color: string
  pulseSpeed: number
  pulseOffset: number
}

export function ParticleBackground({
  particleCount = 8,
  colors = ['#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6'],
}: {
  particleCount?: number
  colors?: string[]
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  const initParticles = useCallback(
    (width: number, height: number) => {
      const particles: Particle[] = []
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 1.5 + 1,
          opacity: Math.random() * 0.4 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          pulseSpeed: Math.random() * 0.015 + 0.008,
          pulseOffset: Math.random() * Math.PI * 2,
        })
      }
      particlesRef.current = particles
    },
    [particleCount, colors]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles(canvas.width, canvas.height)
    }

    resize()
    window.addEventListener('resize', resize)

    const animate = (time: number) => {
      // Throttle to ~30fps for performance
      if (time - lastTimeRef.current < 33) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }
      lastTimeRef.current = time

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const particles = particlesRef.current

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        if (p.y < -10) p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10

        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.3 + 0.7
        const currentOpacity = p.opacity * pulse

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3)
        gradient.addColorStop(0, p.color.replace(')', `, ${currentOpacity})`).replace('rgb', 'rgba').replace('#', ''))
        gradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color.replace(')', `, ${currentOpacity})`)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [initParticles])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
