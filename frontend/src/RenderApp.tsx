import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { PageProvider } from './context/PageContext'
import { ToastProvider } from './context/ToastContext'
import { Web3ContextProvider } from './context/Web3Context'
import { ServiceWorkerWrapper } from './components/PWAUpdate'

import { QueryClient, QueryClientProvider } from 'react-query'
import { Root } from 'react-dom/client'

export function renderApp(root: Root) {
  const queryClient = new QueryClient()

  root.render(
    <div>
      <React.StrictMode>
        <ServiceWorkerWrapper />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ToastProvider>
              <Web3ContextProvider>
                <PageProvider>
                  <App />
                </PageProvider>
              </Web3ContextProvider>
            </ToastProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </React.StrictMode>
    </div>
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log)