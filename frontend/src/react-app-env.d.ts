/// <reference types="react-scripts" />
import { MetaMaskInpageProvider } from '@metamask/providers'

import { ProviderMessage, ProviderRpcError, ProviderConnectInfo, RequestArguments } from 'hardhat/types'

export interface EthereumEvent {
  connect: ProviderConnectInfo
  disconnect: ProviderRpcError
  accountsChanged: Array<string>
  chainChanged: string
  message: ProviderMessage
}

type EventKeys = keyof EthereumEvent
type EventHandler<K extends EventKeys> = (event: EthereumEvent[K]) => void

export interface Ethereumish {
  autoRefreshOnNetworkChange: boolean
  chainId: string
  isMetaMask?: boolean
  isStatus?: boolean
  networkVersion: string
  selectedAddress: any

  on<K extends EventKeys>(event: K, eventHandler: EventHandler<K>): void
  removeListener<K extends EventKeys>(event: K, eventHandler: EventHandler<K>): void

  enable(): Promise<any>
  request?: (request: { method: string; params?: Array<any> }) => Promise<any>
  /**
   * @deprecated
   */
  send?: (request: { method: string; params?: Array<any> }, callback: (error: any, response: any) => void) => void
  sendAsync: (request: RequestArguments) => Promise<unknown>
}

declare global {
  interface Window {
    ethereum: Ethereumish
  }
}
