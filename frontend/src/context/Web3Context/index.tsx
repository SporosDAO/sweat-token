import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'

export interface WalletProvider {
  id: string
  name: string
  icon: string
}

export const providers = [
  {
    id: 'metamask',
    name: 'Metamask',
    icon: '/images/metamask.svg'
  }
]

type Web3ContextProviderProps = {
  children: ReactNode
}

type Web3ContextValue = {
  account?: string
  setAccount: (account: string | undefined) => void
  balance?: number
  setBalance: (balance: number | undefined) => void
  provider?: string
  setProvider: (provider: string | undefined) => void
}

export const Web3ProviderContext = createContext<Web3ContextValue>({} as Web3ContextValue)

export function Web3ContextProvider({ children }: Web3ContextProviderProps) {
  const [account, setAccount] = useState<string>()
  const [balance, setBalance] = useState<number>()
  const [provider, setProvider] = useState<string>()

  useEffect(() => {
    if (provider) return
    const lastProvider = localStorage.getItem('lastProvider')
    if (!lastProvider) return
    const matches = providers.filter((p) => p.id === lastProvider)
    if (!matches.length) return
    setProvider(matches[0].id)
  }, [provider])

  return (
    <Web3ProviderContext.Provider
      value={
        {
          provider,
          setProvider: (provider: string) => {
            localStorage.setItem('lastProvider', provider)
            setProvider(provider)
          },
          account,
          setAccount: (account: string | undefined) => {
            if (account === undefined) {
              localStorage.removeItem('lastProvider')
              setProvider(undefined)
            }
            setAccount(account)
          },
          balance,
          setBalance
        } as Web3ContextValue
      }
    >
      {children}
    </Web3ProviderContext.Provider>
  )
}

export default function useWeb3() {
  return useContext(Web3ProviderContext)
}
