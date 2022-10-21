import Web3SubmitDialog from './Web3SubmitDialog'

import { act, render, screen, waitFor } from '../../test'
import ServiceWorkerWrapper from './PWAUpdate'
import * as wagmi from 'wagmi'
import { useChainGuard } from '@kalidao/hooks'

jest.mock('wagmi')
jest.mock('@kalidao/hooks')

describe('Web3Submit dialog', () => {
  beforeEach(() => {
    ;(useChainGuard as any).mockReturnValue({ isUserOnCorrectChain: true, isUserConnected: true, userChain: 5 })
    ;(wagmi as any).usePrepareContractWrite.mockReturnValue({
      config: undefined,
      isError: undefined,
      error: undefined
    })
    ;(wagmi as any).useContractWrite.mockReturnValue({
      // data: writeResult,
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: undefined,
      isIdle: true,
      write: jest.fn()
    })
  })

  afterAll(() => {
    jest.resetAllMocks()
    //
  })

  it('hides web3submit dialog when property "open" is false', async () => {
    await render({
      ui: <Web3SubmitDialog open={false} onClose={undefined} txInput={undefined} hrefAfterSuccess={''} />,
      options: {
        wrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
      }
    })

    await waitFor(async () => {
      await expect(screen.queryByTestId('web3submit-alert-dialog-title')).toBeNull()
    })
  })

  it('shows web3submit dialog when property "open" is true', async () => {
    await render({
      ui: <Web3SubmitDialog open={true} onClose={undefined} txInput={undefined} hrefAfterSuccess={''} />,
      options: {
        wrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
      }
    })

    await waitFor(async () => {
      await expect(screen.getByTestId('web3submit-alert-dialog-title')).toBeVisible()
    })
  })

  it('shows web3submit dialog error when usePrepareContractWrite fails', async () => {
    ;(wagmi as any).usePrepareContractWrite.mockReturnValue({
      config: undefined,
      isError: true,
      error: undefined
    })
    ;(wagmi as any).useContractWrite.mockReturnValue({
      // data: writeResult,
      isLoading: false,
      isSuccess: false,
      isError: false,
      isIdle: true,
      write: jest.fn()
    })
    await render({
      ui: <Web3SubmitDialog open={true} onClose={undefined} txInput={undefined} hrefAfterSuccess={''} />,
      options: {
        wrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
      }
    })

    await waitFor(async () => {
      await expect(screen.queryByTestId('alert-dialog-message-prepare-error')).toBeVisible()
    })
  })

  it('shows web3submit dialog error when useContractWrite fails', async () => {
    ;(wagmi as any).usePrepareContractWrite.mockReturnValue({
      config: undefined,
      isError: false,
      error: undefined
    })
    ;(wagmi as any).useContractWrite.mockReturnValue({
      // data: writeResult,
      isLoading: false,
      isSuccess: false,
      isError: true,
      isIdle: true,
      write: jest.fn()
    })
    await render({
      ui: <Web3SubmitDialog open={true} onClose={undefined} txInput={undefined} hrefAfterSuccess={''} />,
      options: {
        wrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
      }
    })

    await waitFor(async () => {
      await expect(screen.queryByTestId('alert-dialog-message-write-error')).toBeVisible()
    })
  })

  it('shows web3submit dialog warning when user web3 wallet disconnected', async () => {
    ;(useChainGuard as any).mockReturnValue({ isUserOnCorrectChain: false, isUserConnected: false, userChain: 5 })
    ;(wagmi as any).usePrepareContractWrite.mockReturnValue({
      config: undefined,
      isError: false,
      error: undefined
    })
    ;(wagmi as any).useContractWrite.mockReturnValue({
      // data: writeResult,
      isLoading: false,
      isSuccess: false,
      isError: false,
      isIdle: true,
      write: jest.fn()
    })
    await render({
      ui: <Web3SubmitDialog open={true} onClose={undefined} txInput={undefined} hrefAfterSuccess={''} />,
      options: {
        wrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
      }
    })
    await waitFor(async () => {
      await expect(screen.queryByTestId('alert-dialog-chainguard-error')).toBeVisible()
      await expect(screen.getByText(/Your Web3 wallet is disconnected/i)).toBeVisible()
      await expect(screen.queryByTestId('alert-dialog-message-write-error')).toBeNull()
    })
  })

  it('shows web3submit dialog warning when user connected to a chain different than DAO home chain', async () => {
    ;(useChainGuard as any).mockReturnValue({ isUserOnCorrectChain: false, isUserConnected: true, userChain: 5 })
    ;(wagmi as any).usePrepareContractWrite.mockReturnValue({
      config: undefined,
      isError: false,
      error: undefined
    })
    ;(wagmi as any).useContractWrite.mockReturnValue({
      // data: writeResult,
      isLoading: false,
      isSuccess: false,
      isError: false,
      isIdle: true,
      write: jest.fn()
    })
    await render({
      ui: <Web3SubmitDialog open={true} onClose={undefined} txInput={undefined} hrefAfterSuccess={''} />,
      options: {
        wrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
      }
    })
    await waitFor(async () => {
      await expect(screen.queryByTestId('alert-dialog-chainguard-error')).toBeVisible()
      await expect(screen.getByText(/Your Web3 wallet is connected to/i)).toBeVisible()
      await expect(screen.queryByTestId('alert-dialog-message-write-error')).toBeNull()
      await expect(screen.queryByTestId('done-button')).toBeNull()
    })
  })

  it('shows Done button when contract write transaction completes', async () => {
    ;(useChainGuard as any).mockReturnValue({ isUserOnCorrectChain: true, isUserConnected: true, userChain: 5 })
    ;(wagmi as any).usePrepareContractWrite.mockReturnValue({
      config: undefined,
      isError: false,
      error: undefined
    })
    ;(wagmi as any).useContractWrite.mockReturnValue({
      // data: writeResult,
      isLoading: false,
      isSuccess: true,
      isError: false,
      isIdle: true,
      write: jest.fn()
    })
    await render({
      ui: <Web3SubmitDialog open={true} onClose={undefined} txInput={undefined} hrefAfterSuccess={''} />,
      options: {
        wrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
      }
    })
    await waitFor(async () => {
      await expect(screen.getByTestId('done-button')).toBeVisible()
    })
  })

  it('asks user to interact with web3 wallet when write transaction is pending', async () => {
    ;(useChainGuard as any).mockReturnValue({ isUserOnCorrectChain: true, isUserConnected: true, userChain: 5 })
    ;(wagmi as any).usePrepareContractWrite.mockReturnValue({
      config: undefined,
      isError: false,
      error: undefined
    })
    ;(wagmi as any).useContractWrite.mockReturnValue({
      // data: writeResult,
      isLoading: true,
      isSuccess: false,
      isError: false,
      isIdle: true,
      write: jest.fn()
    })
    await render({
      ui: <Web3SubmitDialog open={true} onClose={undefined} txInput={undefined} hrefAfterSuccess={''} />,
      options: {
        wrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
      }
    })
    await waitFor(async () => {
      await expect(screen.getByText(/Please review and approve the transaction in your web3 wallet/i)).toBeVisible()
      await expect(screen.queryByTestId('alert-dialog-message-write-error')).toBeNull()
    })
  })

  it('shows Done button when contract write transaction completes', async () => {
    ;(useChainGuard as any).mockReturnValue({ isUserOnCorrectChain: true, isUserConnected: true, userChain: 5 })
    ;(wagmi as any).usePrepareContractWrite.mockReturnValue({
      config: undefined,
      isError: true,
      error: undefined
    })
    ;(wagmi as any).useContractWrite.mockReturnValue({
      // data: writeResult,
      isLoading: false,
      isSuccess: false,
      isError: false,
      isIdle: true,
      write: jest.fn()
    })
    const onclose = jest.fn()
    const { user, getByTestId } = await render({
      ui: <Web3SubmitDialog open={true} onClose={onclose} txInput={undefined} hrefAfterSuccess={''} />,
      options: {
        wrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
      }
    })
    let closeButton: Element
    await waitFor(async () => {
      await expect(getByTestId('close-button')).toBeVisible()
      closeButton = await getByTestId('close-button')
      await expect(screen.queryByTestId('done-button')).toBeNull()
    })
    await act(async () => {
      await user.click(closeButton)
    })
    await waitFor(async () => {
      await expect(onclose).toHaveBeenCalledTimes(1)
    })
  })
})
