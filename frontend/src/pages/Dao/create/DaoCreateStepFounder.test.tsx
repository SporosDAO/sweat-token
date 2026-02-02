import { act, screen, render, waitFor, fireEvent, within } from '../../../../test'
import * as daoNames from '../../../graph/getDaoNames'
import * as wagmi from 'wagmi'

describe('DAO Formation - Step DAO Founder', () => {
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
      await expect(continueButton).toBeEnabled()
      await continueButton.click()
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Shows Founder step', async () => {
    await waitFor(async () => {
      const header = await screen.getByTestId('content-header')
      await expect(await within(header).findByText('Founder')).toBeVisible()
    })
  })

  it('Allows valid founder inputs', async () => {
    jest.spyOn(wagmi, 'useEnsName').mockReturnValue({ data: 'afounder.eth', isSuccess: true } as any)

    await act(async () => {
      const founderAddressInput = await (await screen.findByTestId('founder.0.address-input')).querySelector('input')
      await fireEvent.change(founderAddressInput as Element, {
        target: { value: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439' }
      })
    })

    await waitFor(async () => {
      await screen.findByText(/ENS name:\s+afounder.eth/i)
    })

    await act(async () => {
      const founderTokensInput = await (await screen.findByTestId('founder.0.tokens-input')).querySelector('input')
      await fireEvent.change(founderTokensInput as Element, { target: { value: '1000' } })
      const founderEmailInput = await (await screen.findByTestId('founder.0.email-input')).querySelector('input')
      await fireEvent.change(founderEmailInput as Element, { target: { value: 'afounder@email.com' } })
    })

    await waitFor(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeEnabled()
    })
  })

  it('Rejects invalid founder address', async () => {
    await act(async () => {
      const founderAddressInput = await (await screen.findByTestId('founder.0.address-input')).querySelector('input')
      await fireEvent.change(founderAddressInput as Element, {
        target: { value: '0xf952Nonsense' }
      })
    })

    await waitFor(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeDisabled()
    })
  })

  it('Allows adding second founder', async () => {
    jest.spyOn(wagmi, 'useEnsName').mockReturnValue({ data: 'afounder.eth', isSuccess: true } as any)

    await act(async () => {
      const founderAddressInput = await (await screen.findByTestId('founder.0.address-input')).querySelector('input')
      await fireEvent.change(founderAddressInput as Element, {
        target: { value: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439' }
      })
    })

    await waitFor(async () => {
      await screen.findByText(/ENS name:\s+afounder.eth/i)
    })

    await act(async () => {
      const founderTokensInput = await (await screen.findByTestId('founder.0.tokens-input')).querySelector('input')
      await fireEvent.change(founderTokensInput as Element, { target: { value: '1000' } })
      const founderEmailInput = await (await screen.findByTestId('founder.0.email-input')).querySelector('input')
      await fireEvent.change(founderEmailInput as Element, { target: { value: 'afounder@email.com' } })
    })

    await waitFor(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeEnabled()
    })

    await waitFor(async () => {
      const addFounderButton = await screen.findByTestId('add-founder-button')
      await expect(addFounderButton).toBeEnabled()
      const removeFounderButton = await screen.queryByTestId('remove-founder-button')
      await expect(removeFounderButton).toBeNull()
    })

    await act(async () => {
      await (await screen.findByTestId('add-founder-button')).click()
    })

    await waitFor(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeDisabled()
    })

    await act(async () => {
      const founderAddressInput = await (await screen.findByTestId('founder.1.address-input')).querySelector('input')
      await fireEvent.change(founderAddressInput as Element, {
        target: { value: '0x8791f1612453a817919697ffA4895b17F6C77929' }
      })
      const founderTokensInput = await (await screen.findByTestId('founder.1.tokens-input')).querySelector('input')
      await fireEvent.change(founderTokensInput as Element, { target: { value: '2000' } })
      const founderEmailInput = await (await screen.findByTestId('founder.1.email-input')).querySelector('input')
      await fireEvent.change(founderEmailInput as Element, { target: { value: 'bfounder@email.com' } })
    })

    await waitFor(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await expect(continueButton).toBeEnabled()
    })
  })

  it('Allows removal of second founder', async () => {
    jest.spyOn(wagmi, 'useEnsName').mockReturnValue({ data: 'afounder.eth', isSuccess: true } as any)

    await waitFor(async () => {
      const addFounderButton = await screen.findByTestId('add-founder-button')
      await expect(addFounderButton).toBeEnabled()
      // const removeFounderButton = await screen.queryByTestId('remove-founder-button')
      // await expect(removeFounderButton).toBeNull()
    })

    await act(async () => {
      await (await screen.findByTestId('add-founder-button')).click()
    })

    await waitFor(async () => {
      const secondFounderAddressInput = await screen.findByTestId('founder.1.address-input')
      // screen.debug(secondFounderAddressInput)
      await expect(secondFounderAddressInput).toBeInTheDocument()
      await expect(secondFounderAddressInput).toBeVisible()
      const removeFounderButton = await screen.queryByTestId('remove-founder-button')
      await expect(removeFounderButton).toBeEnabled()
    })

    await act(async () => {
      await (await screen.findByTestId('remove-founder-button')).click()
    })

    await waitFor(async () => {
      const secondFounderAddressInput = await screen.queryByTestId('founder.1.address-input')
      await expect(secondFounderAddressInput).toBeNull()
    })
  })
})
