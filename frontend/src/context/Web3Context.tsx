import '@rainbow-me/rainbowkit/styles.css'

import React, { useState, useEffect } from 'react'
import { Chain, chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

import { getDefaultWallets, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import { ReactNode } from 'react'

const initialChain = process.env.NODE_ENV === 'development' ? chain.goerli : chain.arbitrum
export function Web3ContextProvider({ children }: { children: ReactNode }) {
  // We want to re-render the component tree if these values change
  // Not using a Context object because these states only get used here,
  // if that ever changes, we should store these values in Context
  const [configuredChains, setConfiguredChains] = useState<Chain[]>()
  const [client, setClient] = useState<any>() // TODO, figure out what this type is
  // on mount, configure chains and re-render when configuration is done
  useEffect(() => {
    const { chains, provider, webSocketProvider } = configureChains(
      [chain.arbitrum, chain.goerli],
      [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID }), publicProvider()]
    )

    const { connectors } = getDefaultWallets({
      appName: 'Sporos DAO App',
      chains
    })

    const wagmiClient = createClient({
      autoConnect: true,
      connectors,
      provider,
      webSocketProvider
    })

    setClient(wagmiClient)
    setConfiguredChains(chains)
  }, [])

  if (!client || !configuredChains) {
    return null
  }

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={configuredChains} initialChain={initialChain} theme={lightTheme()}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export * from 'wagmi'
