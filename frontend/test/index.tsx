import { RenderOptions, render } from '@testing-library/react'
import { default as userEvent } from '@testing-library/user-event'
import * as React from 'react'

import { CreateClientConfig, WagmiConfigProps, createClient, defaultChains, chain } from 'wagmi'
import { MockConnector } from 'wagmi/connectors/mock'
import { AppWrapper } from '../src/AppWrapper'

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
  return (
    <AppWrapper wagmiClient={client} chains={defaultChains} initialChain={chain.goerli}>
      {children}
    </AppWrapper>
  )
}

const customRender = (ui: React.ReactElement, options?: RenderOptions) => render(ui, { wrapper: Providers, ...options })

export * from '@testing-library/react'
export { customRender as render }

export type UserEvent = ReturnType<typeof userEvent.setup>
export { default as userEvent } from '@testing-library/user-event'

export { addressRegex, getSigners, getProvider, getWebSocketProvider } from './utils'
