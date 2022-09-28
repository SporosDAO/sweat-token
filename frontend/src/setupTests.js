import '@testing-library/jest-dom'

global.CSS = { supports: jest.fn() }

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
  getDefaultWallets: jest.fn().mockReturnValue({})
}))
