import { act, screen, render, waitFor, fireEvent, within } from '../../../../test'
import * as daoNames from '../../../graph/getDaoNames'
import * as wagmi from 'wagmi'

describe('DAO Formation - Step DAO Name', () => {
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

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('forbids taken DAO name', async () => {
    await act(async () => {
      await render({
        route: '/dao/chain/5/create/stepper'
      })
    })

    await act(async () => {
      const header = await screen.getByTestId('content-header')
      await expect(await within(header).findByText('Company Name')).toBeVisible()
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
      const daoNameInput = await (await screen.findByTestId('daosymbol-input')).querySelector('input')
      await expect(daoNameInput).toBeInTheDocument()
      await fireEvent.change(daoNameInput as Element, { target: { value: 'TD3' } })
      await expect(daoNameInput?.value).toBe('TD3')
    })

    await waitFor(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeEnabled()
    })
  })

  it('rejects long DAO symbol(ticker)', async () => {
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

    await act(async () => {
      const daoSymbolInput = await (await screen.findByTestId('daosymbol-input')).querySelector('input')
      await expect(daoSymbolInput).toBeInTheDocument()
      await fireEvent.change(daoSymbolInput as Element, { target: { value: 'TD0123456789TD0123456789' } })
      await expect(daoSymbolInput?.value).toBe('TD0123456789TD0123456789')
    })

    await waitFor(async () => {
      await expect(await screen.findByText(/DAO token symbol should be less than 11 characters./i)).toBeVisible()
    })

    await waitFor(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeDisabled()
    })
  })

  it('accepts short DAO symbol(ticker)', async () => {
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

    await act(async () => {
      const daoSymbolInput = await (await screen.findByTestId('daosymbol-input')).querySelector('input')
      await expect(daoSymbolInput).toBeInTheDocument()
      await fireEvent.change(daoSymbolInput as Element, { target: { value: 'TD0123' } })
      await expect(daoSymbolInput?.value).toBe('TD0123')
    })

    await waitFor(async () => {
      await expect(await screen.queryByText(/DAO token symbol should be less than 11 characters./i)).toBeNull()
    })

    await waitFor(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeEnabled()
    })
  })
})
