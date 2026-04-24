'use client'
import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light' | 'neon' | 'midnight' | 'ocean'

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  setTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

/** Applies theme class to <html> and persists to localStorage */
function applyTheme(t: Theme) {
  const html = document.documentElement
  // Remove all theme classes first
  html.classList.remove('theme-dark', 'theme-light', 'theme-neon', 'theme-midnight', 'theme-ocean')
  // Add the new one
  html.classList.add(`theme-${t}`)
  // Persist
  try { localStorage.setItem('techv_theme', t) } catch {}
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  // On mount: read saved theme, apply immediately (before any paint)
  useEffect(() => {
    let saved: Theme = 'dark'
    try {
      const raw = localStorage.getItem('techv_theme')
    if (raw === 'light' || raw === 'neon' || raw === 'midnight' || raw === 'dark' || raw === 'ocean') saved = raw
    } catch {}
    applyTheme(saved)
    setThemeState(saved)
    setMounted(true)
  }, [])

  function setTheme(t: Theme) {
    applyTheme(t)
    setThemeState(t)
  }

  // Prevent flash of unstyled content
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

