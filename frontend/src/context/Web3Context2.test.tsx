import { Web3ContextProvider } from './Web3Context'

import { act, render, screen, waitFor, setupClient } from '../../test'
import * as wagmi from 'wagmi'

describe('Web3ContextProvider component', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  // TODO: mock out 'wagmi.createClient' and spy on the module directly
  // Update this test, skipping for now
  it.skip('render content wrapped in web3 context with custom chains and prod env', async () => {
    process.env = {
      ...OLD_ENV,
      NODE_ENV: 'production'
    }
    jest.spyOn(wagmi, 'createClient').mockReturnValueOnce(setupClient())
    await act(() => {
      render({
        ui: <div>Empty content block</div>,
        options: {
          wrapper: ({ children }: { children: React.ReactNode }) => (
            // <Web3ContextProvider chains={wagmi.defaultChains}>{children}</Web3ContextProvider>
            <Web3ContextProvider>{children}</Web3ContextProvider>
          )
        }
      })
    })
    await waitFor(async () => {
      await expect(screen.getByText(/Empty content block/i)).toBeVisible()
    })
  })
})
