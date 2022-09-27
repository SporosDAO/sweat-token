// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import * as reactQuery from 'react-query'
import { QueryClient, QueryObserver } from 'react-query'
import * as wagmi from 'wagmi'
import { createClient } from 'wagmi'

jest.mock('@rainbow-me/rainbowkit', () => {
  function RainbowProviderMock({ children }) {
    return <div>{children}</div>
  }
  return {
    RainbowKitProvider: RainbowProviderMock,
    wallet: {
      metaMask: jest.fn(),
      brave: jest.fn(),
      rainbow: jest.fn(),
      walletConnect: jest.fn(),
      coinbase: jest.fn()
    },
    connectorsForWallets: jest.fn(),
    darkTheme: jest.fn().mockReturnValue({}),
    lightTheme: jest.fn().mockReturnValue({}),
    ConnectButton: jest.fn().mockReturnValue({
      Custom: jest.fn()
    }),
    getDefaultWallets: jest.fn().mockImplementation(() => {
      return {}
    })
  }
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn()
})

beforeEach(() => {
  const queryClient = {
    mount: () => jest.fn(),
    unmount: () => jest.fn(),
    defaultQueryObserverOptions: () => jest.fn(),
    getQueryCache: () => ({
      build: jest.fn(),
      state: jest.fn()
    })
  }

  jest.spyOn(wagmi, 'createClient')
  createClient.mockImplementation((config) => {
    return {
      queryClient
    }
  })

  jest.spyOn(reactQuery, 'QueryClient')
  QueryClient.mockImplementation(() => queryClient)

  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  })
})
