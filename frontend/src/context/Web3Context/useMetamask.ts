import { useCallback, useEffect, useState } from 'react'

export const useMetaMask = () => {
  const [connectedAccount, setConnectedAccount] = useState<string>()

  const isInstalled = () => typeof window.ethereum !== 'undefined'

  const getConnectedAccount = async (): Promise<string | undefined> => {
    if (!isInstalled()) return undefined
    if (!window.ethereum.request) return undefined
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts && accounts.length) {
        setConnectedAccount(accounts[0])
        return accounts[0]
      } else {
        setConnectedAccount(undefined)
      }
    } catch (error) {
      console.log(error)
    }
    return undefined
  }

  // connect wallect
  const connectWallect = async (): Promise<boolean> => {
    try {
      if (!isInstalled()) return false
      if (!window.ethereum.request) return false

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      if (accounts && accounts.length) {
        setConnectedAccount(accounts[0])
        return true
      } else {
        setConnectedAccount(undefined)
      }
    } catch (error) {
      console.log(error)
    }
    return false
  }

  useEffect(() => {
    if (!isInstalled()) return

    const onAccountsChanged = (...args: unknown[]) => {
      console.log('onAccountsChanged', args)
      getConnectedAccount()
    }
    window.ethereum.on('accountsChanged', onAccountsChanged)

    const onChainChanged = (...args: unknown[]) => {
      console.log('onChainChanged', args)
      if (!args || !args.length) return
      const _chainId = args[0] as number
      console.log(`onChainChanged ${_chainId}`)
      window.location.reload()
    }
    window.ethereum.on('chainChanged', onChainChanged)

    return () => {
      window.ethereum.removeListener('accountsChanged', onAccountsChanged)
      window.ethereum.removeListener('chainChanged', onChainChanged)
    }
  }, [])

  useEffect(() => {
    if (!isInstalled()) return
    getConnectedAccount()
  }, [])

  return {
    isInstalled,
    getConnectedAccount,
    checkIfWalletIsConnected: getConnectedAccount,
    connectWallect
  }
}
