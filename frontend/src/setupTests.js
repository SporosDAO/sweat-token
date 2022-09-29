import '@testing-library/jest-dom'
import * as rainbowkit from '@rainbow-me/rainbowkit'
import { MockConnect } from './components/MockConnect'

global.CSS = { supports: jest.fn() }

jest.mock('@rainbow-me/rainbowkit', () => {
  return {
    RainbowKitProvider: ({ children }) => <div>{children}</div>,
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
    ConnectButton: () => <MockConnect />,
    getDefaultWallets: jest.fn().mockReturnValue({})
  }
})
