import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'day' | 'night'
type Ctx = { theme: Theme; toggle: () => void }

const ThemeContext = createContext<Ctx | null>(null)

/** Day ↔ Night: sunlit shore vs. lantern-lit evening. Also drives 3D lighting. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'night' ? 'night' : 'day',
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'night' ? '#0b1f25' : '#102C35')
    try {
      localStorage.setItem('shine.theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'day' ? 'night' : 'day')), [])
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
