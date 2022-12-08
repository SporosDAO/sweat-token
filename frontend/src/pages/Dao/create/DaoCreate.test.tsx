import { act, screen, render, waitFor, fireEvent, within } from '../../../../test'
import * as daoNames from '../../../graph/getDaoNames'
import * as wagmi from 'wagmi'

describe('DAO Formation Page', () => {
  beforeEach(() => {
    const useGetDaoNames = jest.spyOn(daoNames, 'useGetDaoNames')
    useGetDaoNames.mockImplementation(
      (chainId) =>
        ({
          data: ['TestDao1', 'TestDao2'],
          isSuccess: true
        } as any)
    )

    jest.spyOn(wagmi, 'useNetwork').mockReturnValue({
      chain: {
        id: 5
      }
    } as any)

    jest.spyOn(wagmi, 'useAccount').mockReturnValue({
      isDisconnected: false,
      isConnected: true
    } as any)

    jest.spyOn(wagmi, `usePrepareContractWrite`).mockReturnValue({
      config: jest.fn(),
      isError: false,
      error: undefined
    } as any)

    jest.spyOn(wagmi, `useContractWrite`).mockReturnValue({
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: undefined,
      isIdle: false,
      write: jest.fn()
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

  it('forbids taken DAO name', async () => {
    await act(async () => {
      await render({
        route: '/dao/chain/5/create/stepper'
      })
    })

    await act(async () => {
      const header = await screen.getByTestId('content-header')
      await expect(within(header).findByText('Company Name')).toBeVisible()
      const daoNameInput = await screen.getByTestId('daoname-input').querySelector('input')
      await expect(daoNameInput).toBeInTheDocument()
      await fireEvent.change(daoNameInput as Element, { target: { value: 'TestDao1' } })
      await expect(daoNameInput?.value).toBe('TestDao1')
    })

    await waitFor(async () => {
      await expect(screen.getByText('This name is already used. Try another name.')).toBeVisible()
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeDisabled()
    })
  })

  it('allows unique DAO name', async () => {
    await act(async () => {
      await render({
        route: '/dao/chain/5/create/stepper'
      })
    })

    await act(async () => {
      const daoNameInput = await (await screen.findByTestId('daoname-input')).querySelector('input')
      await expect(daoNameInput).toBeInTheDocument()
      await fireEvent.change(daoNameInput as Element, { target: { value: 'TestDao3' } })
      await expect(daoNameInput?.value).toBe('TestDao3')
    })

    await waitFor(async () => {
      await expect(screen.queryByText('This name is already used. Try another name.')).toBeNull()
    })

    await act(async () => {
      const daoNameInput = await (await screen.findByTestId('daoticker-input')).querySelector('input')
      await expect(daoNameInput).toBeInTheDocument()
      await fireEvent.change(daoNameInput as Element, { target: { value: 'TD3' } })
      await expect(daoNameInput?.value).toBe('TD3')
    })

    await waitFor(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeEnabled()
    })
  })
})
