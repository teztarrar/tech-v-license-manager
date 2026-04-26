'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { useTheme, type Theme } from '@/components/ThemeProvider'
import { ParticleBackground } from '@/components/animations/ParticleBackground'

const themeBg: Record<Theme, string> = {
  dark: 'from-slate-900 via-blue-950 to-slate-900',
  light: 'from-gray-100 via-indigo-50 to-gray-100',
  neon: 'from-[#02040a] via-[#061018] to-[#02040a]',
  midnight: 'from-[#010205] via-[#060b18] to-[#010205]',
  ocean: 'from-[#020617] via-[#03102a] to-[#020617]',
}

export default function LoginPage() {
  const router = useRouter()
  const { theme: activeTheme } = useTheme()

  const [email, setEmail] = useState('admin@techv.com')
  const [password, setPassword] = useState('admin123')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    setLoading(false)

    if (res?.error) {
      if (res.error === '2FA_REQUIRED') {
        setError('Two-factor authentication required. Please contact your administrator.')
      } else if (res.error === 'INVALID_2FA') {
        setError('Invalid 2FA code. Please try again.')
      } else {
        setError(res.error)
      }
    } else {
      router.push('/dashboard')
    }
  }

  const bgGradient = themeBg[activeTheme] ?? themeBg.dark
  const isDark = activeTheme === 'dark' || activeTheme === 'neon' || activeTheme === 'midnight' || activeTheme === 'ocean'

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${bgGradient} p-4 relative overflow-hidden`}>
      {/* Particle background for dark themes */}
      {isDark && <ParticleBackground particleCount={12} colors={
        activeTheme === 'ocean'
          ? ['#06b6d4', '#0ea5e9', '#22d3ee', '#67e8f9']
          : activeTheme === 'neon'
          ? ['#00ffaa', '#a78bfa', '#7c3aed']
          : activeTheme === 'midnight'
          ? ['#8b5cf6', '#6366f1', '#a78bfa']
          : ['#3b82f6', '#6366f1', '#8b5cf6']
      } />}

      {/* Animated background blobs for light theme */}
      {!isDark && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full mesh-blob bg-indigo-400/10"
              style={{
                width: 100 + i * 80,
                height: 100 + i * 80,
                left: `${10 + i * 15}%`,
                top: `${5 + i * 14}%`,
                animationDelay: `${i * 1.2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative w-full max-w-md slide-up">
        <div
          className="rounded-2xl p-8 shadow-2xl border backdrop-blur-xl"
          style={{
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)',
            borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
          }}
        >
          <div className="flex justify-center mb-8">
            <div className="rounded-2xl p-4 scale-in" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
              <Logo size={40} />
            </div>
          </div>

          <h1 className={`text-xl font-semibold text-center mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome back
          </h1>
          <p className={`text-sm text-center mb-8 ${isDark ? 'text-blue-200' : 'text-gray-500'}`}>
            Sign in to your license dashboard
          </p>

          {error && (
            <div className="border text-sm px-4 py-3 rounded-xl mb-4 slide-up"
              style={{
                background: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)',
                borderColor: isDark ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.2)',
                color: isDark ? '#fca5a5' : '#dc2626',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="slide-up">
              <label className={`text-xs font-medium block mb-1.5 ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>
                Email address
              </label>
              <div className="relative">
                <Mail size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-blue-300' : 'text-gray-400'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    isDark
                      ? 'bg-white/10 border border-white/20 text-white placeholder-blue-300/50 focus:border-blue-400 focus:bg-white/15 focus:ring-blue-400/30'
                      : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-400/30'
                  }`}
                />
              </div>
            </div>

            <div className="slide-up stagger-2">
              <label className={`text-xs font-medium block mb-1.5 ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>
                Password
              </label>
              <div className="relative">
                <Lock size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-blue-300' : 'text-gray-400'}`} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className={`w-full rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    isDark
                      ? 'bg-white/10 border border-white/20 text-white placeholder-blue-300/50 focus:border-blue-400 focus:bg-white/15 focus:ring-blue-400/30'
                      : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-400/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-blue-300 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-70 btn-press slide-up stagger-3 ${
                isDark
                  ? 'bg-blue-500 hover:bg-blue-400 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}>
              {loading ? <><Loader2 size={15} className="animate-spin" /> Signing in...</> : 'Sign in'}
            </button>
          </form>

          <p className={`text-xs text-center mt-6 ${isDark ? 'text-blue-300/60' : 'text-gray-400'}`}>
            Default: admin@techv.com / admin123
          </p>
        </div>
      </div>
    </div>
  )
}
