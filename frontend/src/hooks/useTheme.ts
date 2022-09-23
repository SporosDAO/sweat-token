import React, { useEffect } from 'react'

import { darkTheme, lightTheme } from '../theme/theme'

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)'

const detectColorScheme = () => {
  return window?.matchMedia(COLOR_SCHEME_QUERY)?.matches ? lightTheme : lightTheme
}

export const useTheme = () => {
  const [theme, setTheme] = React.useState(detectColorScheme())

  useEffect(() => {
    window?.matchMedia(COLOR_SCHEME_QUERY)?.addEventListener('change', () => {
      setTheme(detectColorScheme())
    })
  }, [])

  return theme
}
