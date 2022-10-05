import React, { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { PageProvider } from './context/PageContext'
import { ToastProvider } from './context/ToastContext'
import { Web3ContextProvider } from './context/Web3Context'
import { ServiceWorkerWrapper } from './components/PWAUpdate'

import { QueryClient, QueryClientProvider } from 'react-query'
import { Chain, Client } from 'wagmi'
import { Theme, ThemeProvider } from '@mui/material'

export function AppWrapper({
  wagmiClient = undefined,
  chains,
  initialChain,
  children,
  theme
}: {
  wagmiClient?: Client
  chains?: Chain[]
  initialChain?: Chain
  children: ReactNode
  theme: Theme
}) {
  const queryClient = new QueryClient()

  return (
    <React.StrictMode>
      <ServiceWorkerWrapper />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ToastProvider>
            <Web3ContextProvider wagmiClient={wagmiClient} chains={chains} initialChain={initialChain}>
              <PageProvider>
                <ThemeProvider theme={theme}>{children}</ThemeProvider>
              </PageProvider>
            </Web3ContextProvider>
          </ToastProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log)
