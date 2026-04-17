'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export function Modal({ open, onClose, title, children, size='md' }: { open:boolean; onClose:()=>void; title:string; children:React.ReactNode; size?:'sm'|'md'|'lg' }) {
  const w = { sm:'max-w-sm', md:'max-w-md', lg:'max-w-2xl' }[size]
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          onClick={e=>e.target===e.currentTarget&&onClose()}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"/>
          <motion.div className={`relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl w-full ${w} max-h-[90vh] overflow-y-auto`}
            initial={{ scale:.95, y:10 }} animate={{ scale:1, y:0 }} exit={{ scale:.95, y:10 }}>
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-sm">{title}</h3>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"><X size={16}/></button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
