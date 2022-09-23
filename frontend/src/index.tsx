import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

import App from './App'
import { PageProvider } from './context/PageContext'
import { ToastProvider } from './context/ToastContext'
import { Web3ContextProvider } from './context/Web3Context'
import { ServiceWorkerWrapper } from './components/PWAUpdate'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
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
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log)
