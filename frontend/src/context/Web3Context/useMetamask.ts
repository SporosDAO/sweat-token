import { useCallback, useEffect, useMemo, useState } from 'react'

export const useMetaMask = () => {
  const [connectedAccount, setConnectedAccount] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [pending, setPending] = useState(false)

  const isInstalled = () => typeof window.ethereum !== 'undefined'

  const getConnectedAccount = useCallback(async (): Promise<string | undefined> => {
    if (connectedAccount) return connectedAccount
    if (!isInstalled()) return undefined
    if (!window.ethereum.request) return undefined
    if (loading || pending) return

    setLoading(true)
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts && accounts.length) {
        setLoading(false)
        setConnectedAccount(accounts[0])
        return accounts[0]
      } else {
        setConnectedAccount(undefined)
      }
    } catch (error: any) {
      // request pending
      if (error.code === -32002) {
        setPending(true)
        console.debug('Request pending')
        return
      }
      console.log('getConnectedAccount', error)
    }
    setPending(false)
    setLoading(false)
    return undefined
  }, [connectedAccount, loading, pending])

  // connect wallect
  const connectWallet = useCallback(async (): Promise<boolean> => {
    try {
      if (!isInstalled()) return false
      if (!window.ethereum.request) return false
      if (loading || pending) return false
      setLoading(true)
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      if (accounts && accounts.length) {
        setConnectedAccount(accounts[0])
        setLoading(false)
        return true
      } else {
        setConnectedAccount(undefined)
      }
    } catch (error: any) {
      // request pending
      if (error.code === -32002) {
        setPending(true)
        console.debug('Request pending')
        return false
      }
      console.log(`connectWallet`, error)
    }
    setPending(false)
    setLoading(false)
    return false
  }, [loading, pending])

  useEffect(() => {
    if (!isInstalled()) return

    const onAccountsChanged = (...args: unknown[]) => {
      console.debug('onAccountsChanged')
      setPending(false)
      getConnectedAccount()
    }
    window.ethereum.on('accountsChanged', onAccountsChanged)

    const onChainChanged = (...args: unknown[]) => {
      console.debug('onChainChanged')
      if (!args || !args.length) return
      // const _chainId = args[0] as number
      // console.log(`onChainChanged ${_chainId}`)
      window.location.reload()
    }
    window.ethereum.on('chainChanged', onChainChanged)

    return () => {
      window.ethereum.removeListener('accountsChanged', onAccountsChanged)
      window.ethereum.removeListener('chainChanged', onChainChanged)
    }
  }, [getConnectedAccount])

  useEffect(() => {
    if (!isInstalled()) return
    getConnectedAccount()
  }, [getConnectedAccount])

  return useMemo(
    () => ({
      isInstalled,
      connectedAccount,
      getConnectedAccount,
      connectWallet,
      loading,
      pending
    }),
    [pending, connectWallet, connectedAccount, getConnectedAccount, loading]
  )
}
