import { useState, useEffect, useCallback } from 'react'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  const stored = localStorage.getItem('theme') as Theme | null
  if (stored === 'light' || stored === 'dark') return stored

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useDisplayModes() {
  const [darkMode, setDarkMode] = useState(() => getInitialTheme() === 'dark')

  const apply = useCallback((isDark: boolean) => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [])

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev
      localStorage.setItem('theme', next ? 'dark' : 'light')
      apply(next)
      return next
    })
  }, [apply])

  useEffect(() => {
    apply(darkMode)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { darkMode, toggleDarkMode }
}
