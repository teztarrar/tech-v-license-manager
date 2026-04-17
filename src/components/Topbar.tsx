'use client'
import { Search, Bell, Sun, Moon, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from './ThemeProvider'
import { useState } from 'react'

export function Topbar({ title }: { title: string }) {
  const { theme, setTheme } = useTheme()
  const [search, setSearch] = useState('')
  const bg = theme === 'neon' ? 'bg-[#0a0a15] border-[#1e1e3f]' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
  return (
    <header className={`topbar-bg sticky top-0 z-20 h-12 border-b flex items-center px-4 gap-3 ${bg}`}>
      <motion.h1 className="font-semibold text-sm flex-1" initial={{ opacity:0 }} animate={{ opacity:1 }}>{title}</motion.h1>
      <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border ${theme==='neon'?'bg-[#0f0f22] border-[#1e1e3f]':'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'} text-gray-500 w-48`}>
        <Search size={12} />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search licenses..." className="bg-transparent outline-none flex-1 text-gray-700 dark:text-gray-300"/>
      </div>
      <button onClick={()=>setTheme(theme==='light'?'dark':theme==='dark'?'neon':'light')}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
        {theme === 'light' ? <Sun size={15}/> : theme === 'dark' ? <Moon size={15}/> : <Zap size={15} className="text-purple-400"/>}
      </button>
      <button className="relative p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
        <Bell size={15}/>
        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"/>
      </button>
      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[11px] font-semibold text-blue-600 dark:text-blue-300 cursor-pointer">AS</div>
    </header>
  )
}
