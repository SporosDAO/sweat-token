import { Chain, chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import { ReactNode } from 'react'

const alchemyApiKey = process.env.REACT_APP_ALCHEMY_API_KEY

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
    } = configureChains([chain.arbitrum], [alchemyProvider({ apiKey: alchemyApiKey })])

    if (!chains) {
      chains = defaultChains
    }

    initialChain = chain.arbitrum
    //Aug 2025 update:
    // hardcoded chain to arbitrum for production and dev until contracts and subgraphs are available for sepolia
    // process.env.NODE_ENV === 'development' ? chain.goerli : chain.arbitrum

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
