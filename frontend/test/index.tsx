import { RenderOptions, render } from '@testing-library/react'
import { default as userEvent } from '@testing-library/user-event'
import * as React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'

import { CreateClientConfig, WagmiConfig, WagmiConfigProps, createClient, defaultChains } from 'wagmi'
import { MockConnector } from 'wagmi/connectors/mock'
import { PageProvider } from '../src/context/PageContext'
import { ToastProvider } from '../src/context/ToastContext'

import { WalletSigner, getProvider, getSigners } from './utils'

type SetupClient = Partial<CreateClientConfig> & { signer?: WalletSigner }
export function setupClient({ signer = getSigners()[0], ...config }: SetupClient = {}) {
  return createClient({
    connectors: [new MockConnector({ options: { signer } })],
    provider: ({ chainId }) => getProvider({ chainId, chains: defaultChains }),
    ...config
  })
}

type ProvidersProps = {
  children: React.ReactNode
  client?: WagmiConfigProps['client']
}
export function Providers({ children, client = setupClient() }: ProvidersProps) {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <WagmiConfig client={client}>
            <PageProvider>{children}</PageProvider>
          </WagmiConfig>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (ui: React.ReactElement, options?: RenderOptions) => render(ui, { wrapper: Providers, ...options })

export * from '@testing-library/react'
export { customRender as render }

export type UserEvent = ReturnType<typeof userEvent.setup>
export { default as userEvent } from '@testing-library/user-event'

export { addressRegex, getSigners, getProvider, getWebSocketProvider } from './utils'
