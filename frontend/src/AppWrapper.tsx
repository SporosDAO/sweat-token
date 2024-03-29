import React, { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { PageProvider } from './context/PageContext'
import { Web3ContextProvider } from './context/Web3Context'
import { ServiceWorkerWrapper } from './components/PWAUpdate'

import { QueryClient, QueryClientProvider } from 'react-query'
import { Chain, Client } from 'wagmi'
import useMediaQuery from '@mui/material/useMediaQuery'
import { getDesignTokens } from './theme'
import { CssBaseline, ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material'

export function AppWrapper({
  wagmiClient,
  chains,
  initialChain,
  children
}: {
  wagmiClient?: Client
  chains?: Chain[]
  initialChain?: Chain
  children: ReactNode
}) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = React.useState('light')

  React.useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light')
  }, [prefersDarkMode])

  let theme = React.useMemo(() => createTheme(getDesignTokens(mode) as any), [mode])

  theme = responsiveFontSizes(theme)

  const queryClient = new QueryClient()

  return (
    <React.StrictMode>
      <CssBaseline />
      <ServiceWorkerWrapper />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Web3ContextProvider wagmiClient={wagmiClient} chains={chains} initialChain={initialChain}>
            <PageProvider>
              <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </PageProvider>
          </Web3ContextProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log)
