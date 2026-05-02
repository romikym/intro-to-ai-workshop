import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const ThemeContext = createContext({
  theme: 'dark',
  toggle: () => {},
  setTheme: () => {}
})

const STORAGE_KEY = 'intro-ai-theme'

function getInitialTheme() {
  // Light mode is disabled — always return dark.
  // Also clear any stale 'light' value previously stored so a returning
  // visitor doesn't get stuck in light mode after the toggle was removed.
  if (typeof window !== 'undefined') {
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }
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

  // Toggle is a no-op — light mode is disabled.
  const toggle = useCallback(() => {}, [])

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
