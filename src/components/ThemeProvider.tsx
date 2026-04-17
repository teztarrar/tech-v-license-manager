'use client'
import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light' | 'neon'

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
  html.classList.remove('theme-dark', 'theme-light', 'theme-neon')
  // Add the new one
  html.classList.add(`theme-${t}`)
  // Persist
  try { localStorage.setItem('techv_theme', t) } catch {}
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')

  // On mount: read saved theme, apply immediately (before any paint)
  useEffect(() => {
    let saved: Theme = 'dark'
    try {
      const raw = localStorage.getItem('techv_theme')
      if (raw === 'light' || raw === 'neon' || raw === 'dark') saved = raw
    } catch {}
    applyTheme(saved)
    setThemeState(saved)
  }, [])

  function setTheme(t: Theme) {
    applyTheme(t)
    setThemeState(t)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
