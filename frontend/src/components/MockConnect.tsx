import { useAccount, useConnect, useDisconnect } from 'wagmi'

import { useIsMounted } from './hooks/useIsMounted'

/**
 * Mock component. Replaces Rainbowkit's Connect button in testing.
 */
export function MockConnect() {
  const { address, connector, isConnected } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()

  const isMounted = useIsMounted()
  if (!isMounted) return null

  return (
    <div>
      <div>
        {isConnected && (
          <>
            <div>{address}</div>
            <button data-testid="btn-mock-disconnect" onClick={() => disconnect()}>
              Disconnect from {connector?.name}
            </button>
          </>
        )}

        {connectors
          .filter((x) => x.ready && x.id !== connector?.id)
          .map((x) => (
            <button data-testid="btn-mock-connect" key={x.id} onClick={() => connect({ connector: x })}>
              {isLoading && x.id === pendingConnector?.id && 'Connecting to '}
              {x.name}
            </button>
          ))}
      </div>

      {error && <div role="alert">{error.message}</div>}
    </div>
  )
}
