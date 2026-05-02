import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const ThemeContext = createContext({
  theme: 'dark',
  toggle: () => {},
  setTheme: () => {}
})

const STORAGE_KEY = 'intro-ai-theme'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}

  // Default to dark — this is a presentation deck, dark is the showcase mode
  return 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme)

  // Apply theme class to <html> whenever it changes
  useEffect(() => {
    const html = document.documentElement
    if (theme === 'light') {
      html.classList.add('theme-light')
    } else {
      html.classList.remove('theme-light')
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {}
  }, [theme])

  // Smooth theme transitions only when toggled (not on initial mount)
  const setTheme = useCallback((nextTheme) => {
    document.documentElement.classList.add('theme-transitioning')
    setThemeState(nextTheme)
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
    }, 500)
  }, [])

  const toggle = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
