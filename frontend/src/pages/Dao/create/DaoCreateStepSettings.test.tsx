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
      const founderAddressInput = await (await screen.findByTestId('founder.0.address-input')).querySelector('input')
      await fireEvent.change(founderAddressInput as Element, {
        target: { value: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439' }
      })
      const founderTokensInput = await (await screen.findByTestId('founder.0.tokens-input')).querySelector('input')
      await fireEvent.change(founderTokensInput as Element, { target: { value: '1000' } })
      const founderEmailInput = await (await screen.findByTestId('founder.0.email-input')).querySelector('input')
      await fireEvent.change(founderEmailInput as Element, { target: { value: 'afounder@email.com' } })
    })

    await act(async () => {
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

  it('Allows valid default settings inputs', async () => {
    await act(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeEnabled()
      await continueButton.click()
    })
  })

  it('Rejects negative voting period', async () => {
    await act(async () => {
      const votingPeriod = await (await screen.findByTestId('voting-period-input')).querySelector('input')
      await fireEvent.change(votingPeriod as Element, { target: { value: '-1' } })
    })

    await waitFor(async () => {
      const errorMessage = await screen.findByTestId('voting-period-error')
      await expect(errorMessage).toBeVisible()
      await expect(within(errorMessage).findByText(/Voting period has to be a positive number/i))
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeDisabled()
    })
  })

  it('Rejects voting period over 365 days', async () => {
    await act(async () => {
      const votingPeriod = await (await screen.findByTestId('voting-period-input')).querySelector('input')
      await fireEvent.change(votingPeriod as Element, { target: { value: 24 * 366 } })
    })

    await waitFor(async () => {
      const errorMessage = await screen.findByTestId('voting-period-error')
      await expect(errorMessage).toBeVisible()
      await expect(within(errorMessage).findByText(/Voting period has to be less than 365 days/i))
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeDisabled()
    })
  })

  it('Rejects negative quorum', async () => {
    await act(async () => {
      const votingPeriod = await (await screen.findByTestId('voting-quorum-input')).querySelector('input')
      await fireEvent.change(votingPeriod as Element, { target: { value: -10 } })
    })

    await waitFor(async () => {
      const errorMessage = await screen.findByTestId('voting-quorum-error')
      await expect(errorMessage).toBeVisible()
      await expect(within(errorMessage).findByText(/Quorum percentage has to be a positive number/i))
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeDisabled()
    })
  })

  it('Rejects quorum over 100%', async () => {
    await act(async () => {
      const votingPeriod = await (await screen.findByTestId('voting-quorum-input')).querySelector('input')
      await fireEvent.change(votingPeriod as Element, { target: { value: 101 } })
    })

    await waitFor(async () => {
      const errorMessage = await screen.findByTestId('voting-quorum-error')
      await expect(errorMessage).toBeVisible()
      await expect(within(errorMessage).findByText(/Quorum percentage has to be no greater than 100/i))
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeDisabled()
    })
  })

  it('Rejects approval less than 51%', async () => {
    await act(async () => {
      const votingPeriod = await (await screen.findByTestId('voting-approval-input')).querySelector('input')
      await fireEvent.change(votingPeriod as Element, { target: { value: 50 } })
    })

    await waitFor(async () => {
      const errorMessage = await screen.findByTestId('voting-approval-error')
      await expect(errorMessage).toBeVisible()
      await expect(within(errorMessage).findByText(/Approval percentage has to be at least 51/i))
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeDisabled()
    })
  })

  it('Rejects approval over 100%', async () => {
    await act(async () => {
      const votingPeriod = await (await screen.findByTestId('voting-approval-input')).querySelector('input')
      await fireEvent.change(votingPeriod as Element, { target: { value: 110 } })
    })

    await waitFor(async () => {
      const errorMessage = await screen.findByTestId('voting-approval-error')
      await expect(errorMessage).toBeVisible()
      await expect(within(errorMessage).findByText(/Approval percentage has to be no greater than 100/i))
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeDisabled()
    })
  })
})
