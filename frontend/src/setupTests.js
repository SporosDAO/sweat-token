// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

import { cleanup } from '@testing-library/react'
// import * as matchers from "jest-extended";
import React from 'react'
import * as wagmi from 'wagmi'

jest.mock('@rainbow-me/rainbowkit', () => ({
  RainbowKitProvider: jest.fn(),
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
}))

jest.spyOn(wagmi, 'createClient').mockReturnValue(jest.fn())

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn()
})

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
