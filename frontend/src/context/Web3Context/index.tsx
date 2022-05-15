import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { useMetaMask } from './useMetamask'

export interface WalletProvider {
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

  const value = useMemo(
    () =>
      ({
        setProvider: setSelectedWalletProvider,
        selectedProvider: selectedWalletProvider,
        providers: [
          {
            name: 'Metamask',
            icon: '',
            connect: () => connectWallect(),
            isInstalled: () => isInstalled(),
            getAccount: () => getConnectedAccount()
          }
        ]
      } as Web3ContextValue),
    [selectedWalletProvider]
  )

  return <Web3ProviderContext.Provider value={value}>{children}</Web3ProviderContext.Provider>
}

export default function useWeb3() {
  return useContext(Web3ProviderContext)
}
