import { act, screen, render, waitFor, fireEvent, within } from '../../../../test'
import * as daoNames from '../../../graph/getDaoNames'
import * as wagmi from 'wagmi'

describe('DAO Formation - Step DAO Confirmation', () => {
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
        id: 5,
        name: 'Goerli'
      }
    } as any)

    jest.spyOn(wagmi, 'useAccount').mockReturnValue({
      isDisconnected: false,
      isConnected: true
    } as any)

    jest.spyOn(wagmi, 'useEnsName').mockReturnValue({ data: '', isSuccess: false } as any)

    // open first step in the dao formation flow: DAO name page
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

    // continue to founder page
    await act(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await continueButton.click()
    })

    await act(async () => {
      const founderAddressInput = await (await screen.findByTestId('founder.0.address-input')).querySelector('input')
      await fireEvent.change(founderAddressInput as Element, {
        target: { value: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439' }
      })
      const founderTokensInput = await (await screen.findByTestId('founder.0.tokens-input')).querySelector('input')
      await fireEvent.change(founderTokensInput as Element, { target: { value: '1000' } })
      const founderEmailInput = await (await screen.findByTestId('founder.0.email-input')).querySelector('input')
      await fireEvent.change(founderEmailInput as Element, { target: { value: 'afounder@email.com' } })
    })

    // continue to settings page
    await act(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await continueButton.click()
    })

    // continue to confirmation page
    await act(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await continueButton.click()
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Shows Confirmation step', async () => {
    await waitFor(async () => {
      const header = await screen.getByTestId('content-header')
      await expect(await within(header).findByText('Confirmation')).toBeVisible()
    })
  })

  it('Shows form data', async () => {
    await waitFor(async () => {
      const tokenName = await screen.findByTestId('dao-name')
      await expect(await within(tokenName).findByText(/TestDao3/i)).toBeVisible()
      const tokenSymbol = await screen.findByTestId('token-symbol')
      await expect(await within(tokenSymbol).findByText(/TD0123/i)).toBeVisible()
      const chainName = await screen.findByTestId('chain-name')
      await expect(await within(chainName).findByText(/Goerli/i)).toBeVisible()
      const founderAddress = await screen.findByTestId('founder.0.address')
      await expect(await within(founderAddress).findByText(/0xf952a72F39c5Fa22a443200AbE7835128bCb7439/i)).toBeVisible()
      const founderTokens = await screen.findByTestId('founder.0.initialTokens')
      await expect(await within(founderTokens).findByText(/1000/i)).toBeVisible()
      const founderEmail = await screen.findByTestId('founder.0.email')
      await expect(await within(founderEmail).findByText(/afounder@email.com/i)).toBeVisible()
    })
  })

  it('Continues only if user accepts terms of service', async () => {
    await waitFor(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeDisabled()
    })
    await act(async () => {
      const terms = await (await screen.findByTestId('terms')).querySelector('input')
      await expect(terms).toBeInTheDocument()
      await expect(terms).toHaveProperty('checked', false)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fireEvent.click(terms!)
      expect(terms).toHaveProperty('checked', true)
    })
    await waitFor(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeEnabled()
    })
  })
})
