import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

import '@rainbow-me/rainbowkit/styles.css'

import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'

export function Web3ContextProvider({ children }: any) {
  const { chains, provider } = configureChains(
    [chain.mainnet, chain.polygon, chain.arbitrum, chain.optimism, chain.rinkeby, chain.goerli],
    [infuraProvider({ infuraId: process.env.NEXT_PUBLIC_INFURA_ID }), publicProvider()]
  )

  const { connectors } = getDefaultWallets({
    appName: 'Sporos DAO App',
    chains
  })

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export * from 'wagmi'
