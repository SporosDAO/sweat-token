import { act, screen, render, waitFor, fireEvent, within } from '../../../../test'
import * as daoNames from '../../../graph/getDaoNames'
import * as wagmi from 'wagmi'

describe('DAO Formation - Step DAO Settings', () => {
  beforeEach(async () => {
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

    jest.spyOn(wagmi, 'useEnsName').mockReturnValue({ data: '', isSuccess: false } as any)

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

    await act(async () => {
      await render({
        route: '/dao/chain/5/create/stepper'
      })
    })

    await act(async () => {
      const daoNameInput = await (await screen.findByTestId('daoname-input')).querySelector('input')
      await fireEvent.change(daoNameInput as Element, { target: { value: 'TestDao3' } })
      const daoSymbolInput = await (await screen.findByTestId('daosymbol-input')).querySelector('input')
      await fireEvent.change(daoSymbolInput as Element, { target: { value: 'TD0123' } })
    })

    await act(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await continueButton.click()
    })

    await act(async () => {
      const founderAddressInput = await (await screen.findByTestId('founder-address-input')).querySelector('input')
      await fireEvent.change(founderAddressInput as Element, {
        target: { value: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439' }
      })
      const founderTokensInput = await (await screen.findByTestId('founder-tokens-input')).querySelector('input')
      await fireEvent.change(founderTokensInput as Element, { target: { value: '1000' } })
      const founderEmailInput = await (await screen.findByTestId('founder-email-input')).querySelector('input')
      await fireEvent.change(founderEmailInput as Element, { target: { value: 'afounder@email.com' } })
    })

    await waitFor(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await continueButton.click()
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Shows Settings step', async () => {
    await waitFor(async () => {
      const header = await screen.getByTestId('content-header')
      await expect(await within(header).findByText('Settings')).toBeVisible()
    })
  })

  it('Allows valid settings inputs', async () => {
    //
  })
})
