import { Web3ContextProvider } from './Web3Context'

import { act, render, screen, waitFor, setupClient } from '../../test'
import * as wagmi from 'wagmi'

describe('Web3ContextProvider component', () => {
  it('render content wrapped with default web3 context', async () => {
    jest.spyOn(wagmi, 'createClient').mockReturnValueOnce(setupClient())
    await act(() => {
      render({
        ui: <div>Empty content block</div>,
        options: {
          wrapper: ({ children }: { children: React.ReactNode }) => (
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
