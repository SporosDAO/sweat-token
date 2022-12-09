import { act, screen, render, waitFor } from '../../../../test'
import * as wagmi from 'wagmi'

describe('DAO Formation Page', () => {
  beforeEach(() => {
    jest.spyOn(wagmi, 'useNetwork').mockReturnValue({
      chain: {
        id: 5
      }
    } as any)

    jest.spyOn(wagmi, 'useAccount').mockReturnValue({
      isDisconnected: false,
      isConnected: true
    } as any)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('render DAO create intro page', async () => {
    await act(async () => {
      await render({
        route: '/'
      })
    })

    await act(async () => {
      const ctaButton = await screen.getByTestId('cta-button')
      await expect(ctaButton).toBeEnabled()
      await ctaButton.click()
    })

    await waitFor(async () => {
      await expect(screen.getByText('Launch Your Company in Minutes')).toBeVisible()
    })
  })

  it('render DAO stepper', async () => {
    await act(async () => {
      await render({
        route: '/dao/chain/5/create'
      })
    })

    await act(async () => {
      const letsgoButton = await screen.getByTestId('letsgo-button')
      await expect(letsgoButton).toBeEnabled()
      await letsgoButton.click()
    })

    await waitFor(async () => {
      await expect(screen.getByText('Start your Company with Sporos')).toBeVisible()
    })
  })
})
