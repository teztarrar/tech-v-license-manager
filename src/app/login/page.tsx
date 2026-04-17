'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Logo } from '@/components/Logo'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@techv.com')       // Match seed user email
  const [password, setPassword] = useState('admin123')         // Match seed user password
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      redirect: false,    // We handle redirect manually
      email,
      password,
    })

    setLoading(false)

    if (res?.error) {
      setError(res.error)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_,i) => (
          <motion.div key={i} className="absolute rounded-full bg-blue-500/10"
            style={{ width: 100+i*80, height: 100+i*80, left: `${10+i*15}%`, top: `${5+i*14}%` }}
            animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 4+i, repeat: Infinity, ease:'easeInOut', delay: i*0.7 }}/>
        ))}
      </div>
      <motion.div className="relative w-full max-w-md"
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="bg-white/5 rounded-2xl p-4"><Logo size={40}/></div>
          </div>
          <h1 className="text-white text-xl font-semibold text-center mb-1">Welcome back</h1>
          <p className="text-blue-200 text-sm text-center mb-8">Sign in to your license dashboard</p>
          {error && <div className="bg-red-500/20 border border-red-500/40 text-red-200 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-blue-200 text-xs font-medium block mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300"/>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors"/>
              </div>
            </div>
            <div>
              <label className="text-blue-200 text-xs font-medium block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300"/>
                <input type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300/50 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors"/>
                <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white">
                  {showPass ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </div>
            <motion.button type="submit" disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-400 text-white py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
              whileTap={{ scale: 0.98 }}>
              {loading ? <><Loader2 size={15} className="animate-spin"/> Signing in...</> : 'Sign in'}
            </motion.button>
          </form>
          <p className="text-blue-300/60 text-xs text-center mt-6">Default: admin@techv.com / admin123</p>
        </div>
      </motion.div>
    </div>
  )
}