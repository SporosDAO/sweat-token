import { Chain, chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import '@rainbow-me/rainbowkit/styles.css'

import { getDefaultWallets, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import { ReactNode } from 'react'

export function Web3ContextProvider({
  wagmiClient,
  chains,
  initialChain,
  children
}: {
  wagmiClient?: any
  chains?: any
  initialChain?: Chain
  children: ReactNode
}) {
  if (!wagmiClient) {
    const {
      chains: defaultChains,
      provider,
      webSocketProvider
    } = configureChains(
      [chain.arbitrum, chain.goerli, chain.mainnet],
      [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID }), publicProvider()]
    )

    if (!chains) {
      chains = defaultChains
    }

    initialChain = process.env.NODE_ENV === 'development' ? chain.goerli : chain.arbitrum

    const { connectors } = getDefaultWallets({
      appName: 'Sporos DAO App',
      chains
    })

    const defaultWagmiClient = createClient({
      autoConnect: true,
      connectors,
      provider,
      webSocketProvider
    })

    wagmiClient = defaultWagmiClient
  }

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} initialChain={initialChain} theme={lightTheme()}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export * from 'wagmi'
