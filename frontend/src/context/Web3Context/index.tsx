import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { useMetaMask } from './useMetamask'

export interface WalletProvider {
  id: string
  name: string
  icon: string
  isInstalled: () => boolean
  connect: () => Promise<boolean>
  getAccount: () => Promise<string | undefined>
}

type Web3ContextProviderProps = {
  children: ReactNode
}

type Web3ContextValue = {
  connectedAccount?: string
  balance?: string | number
  providers: WalletProvider[]
  selectedProvider?: WalletProvider
  setProvider: (provider: WalletProvider) => void
}

export const Web3ProviderContext = createContext<Web3ContextValue>({} as Web3ContextValue)

export function Web3ContextProvider({ children }: Web3ContextProviderProps) {
  const [selectedWalletProvider, setSelectedWalletProvider] = useState<WalletProvider>()
  const { isInstalled, getConnectedAccount, connectWallect } = useMetaMask()

  const setProvider = (provider: WalletProvider) => {
    localStorage.setItem('lastProvider', provider.id)
    setSelectedWalletProvider(provider)
  }

  const value = useMemo(
    () =>
      ({
        setProvider,
        selectedProvider: selectedWalletProvider,
        providers: [
          {
            id: 'metamask',
            name: 'Metamask',
            icon: '/images/metamask.svg',
            connect: () => connectWallect(),
            isInstalled: () => isInstalled(),
            getAccount: () => getConnectedAccount()
          }
        ]
      } as Web3ContextValue),
    [selectedWalletProvider]
  )

  useEffect(() => {
    if (selectedWalletProvider) return
    const lastProvider = localStorage.getItem('lastProvider')
    if (!lastProvider) return
    const matches = value.providers.filter((p) => p.id === lastProvider)
    if (!matches.length) return
    setSelectedWalletProvider(matches[0])
  }, [value, selectedWalletProvider])

  return <Web3ProviderContext.Provider value={value}>{children}</Web3ProviderContext.Provider>
}

export default function useWeb3() {
  return useContext(Web3ProviderContext)
}
