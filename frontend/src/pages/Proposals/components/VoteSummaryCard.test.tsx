import { act, screen, render, waitFor, userEvent, within } from '../../../../test'
import * as reactDom from 'react-router-dom'
import VoteSummaryCard from './VoteSummaryCard'
import * as wagmi from 'wagmi'
import { addresses } from '../../../constants/addresses'

const PM_CONTRACT = addresses[5]['extensions']['projectmanagement']

jest.mock('react-router-dom', () => {
  return {
    __esModule: true, //    <----- allows use of jest.spyOn
    ...jest.requireActual('react-router-dom')
  }
})

describe('Vote Summary Card', () => {
  it('shows Process button when proposal is ready to be processed', async () => {
    jest
      .spyOn(reactDom, 'useParams')
      .mockReturnValue({ chainId: '5', daoId: '0xe237747055b12f4da323bc559ac8d5eb66aac2f7' })
    jest.spyOn(reactDom, 'useLocation').mockReturnValue({
      state: { manager: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439', budget: '101', goals: '', deadline: '123' },
      key: '',
      pathname: '',
      search: '',
      hash: ''
    })
    jest.spyOn(wagmi, 'useAccount').mockReturnValue({
      address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
      isDisconnected: false,
      connector: undefined,
      isConnected: true,
      isReconnecting: false,
      isConnecting: false,
      status: 'connected'
    } as any)

    const mockProposal = {
      serial: 5,
      proposalType: 'EXTENSION',
      sponsored: true,
      cancelled: false,
      status: null,
      votes: [
        {
          voter: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
          weight: '2000000000000000000000',
          vote: true
        },
        {
          voter: '0xd0d827c41af7bf2e52d1842134d5299ba7d6efc4',
          weight: '1000000000000000000000',
          vote: false
        }
      ],
      creationTime: 123,
      votingStarts: 123,
      isReadyToProcessImmediately: true,
      accounts: [PM_CONTRACT],
      dao: {}
    }

    await render({
      ui: <VoteSummaryCard proposal={mockProposal} />
    })

    const processButton = await screen.findByTestId('process-button')
    await expect(processButton).toBeVisible()
    const forButton = await screen.queryByTestId('for-button')
    await expect(forButton).toBeNull()
    const againstButton = await screen.queryByTestId('against-button')
    await expect(againstButton).toBeNull()

    await act(() => {
      waitFor(() => {
        userEvent.click(screen.getByTestId('process-button'))
      })
    })

    let web3Close: Element
    await waitFor(() => {
      const web3Dialog = screen.getByTestId('web3dialog')
      expect(web3Dialog).toBeVisible()
      const web3Submit = within(web3Dialog).getByTestId('web3submit-alert-dialog-title')
      expect(web3Submit).toBeVisible()
      web3Close = within(web3Dialog).getByTestId('close-button')
      expect(web3Close).toBeVisible()
    })

    await act(() => {
      waitFor(() => {
        userEvent.click(web3Close)
      })
    })

    await waitFor(() => {
      expect(screen.queryByTestId('web3dialog')).toBeNull()
    })
  })

  it('Does not show buttons when user wallet is disconnected', async () => {
    jest
      .spyOn(reactDom, 'useParams')
      .mockReturnValue({ chainId: '5', daoId: '0xe237747055b12f4da323bc559ac8d5eb66aac2f7' })
    jest.spyOn(reactDom, 'useLocation').mockReturnValue({
      state: { manager: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439', budget: '101', goals: '', deadline: '123' },
      key: '',
      pathname: '',
      search: '',
      hash: ''
    })
    jest.spyOn(wagmi, 'useAccount').mockReturnValue({
      address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
      isDisconnected: false,
      connector: undefined,
      isConnected: false,
      isReconnecting: false,
      isConnecting: false,
      status: 'connected'
    } as any)

    const mockProposal = {
      serial: 5,
      proposalType: 'EXTENSION',
      sponsored: true,
      cancelled: false,
      status: null,
      votes: [
        {
          voter: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
          weight: '2000000000000000000000',
          vote: true
        },
        {
          voter: '0xd0d827c41af7bf2e52d1842134d5299ba7d6efc4',
          weight: '1000000000000000000000',
          vote: false
        }
      ],
      creationTime: 123,
      votingStarts: 123,
      isReadyToProcessImmediately: true,
      accounts: [],
      dao: {}
    }

    await render({
      ui: <VoteSummaryCard proposal={mockProposal} />
    })

    const processButton = await screen.queryByTestId('process-button')
    await expect(processButton).toBeNull()
    const forButton = await screen.queryByTestId('for-button')
    await expect(forButton).toBeNull()
    const againstButton = await screen.queryByTestId('against-button')
    await expect(againstButton).toBeNull()
  })

  it('Does not show voting buttons when user already voted', async () => {
    jest
      .spyOn(reactDom, 'useParams')
      .mockReturnValue({ chainId: '5', daoId: '0xe237747055b12f4da323bc559ac8d5eb66aac2f7' })
    jest.spyOn(reactDom, 'useLocation').mockReturnValue({
      state: { manager: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439', budget: '101', goals: '', deadline: '123' },
      key: '',
      pathname: '',
      search: '',
      hash: ''
    })
    jest.spyOn(wagmi, 'useAccount').mockReturnValue({
      address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
      isDisconnected: false,
      connector: undefined,
      isConnected: true,
      isReconnecting: false,
      isConnecting: false,
      status: 'connected'
    } as any)

    const mockProposal = {
      serial: 5,
      proposalType: 'EXTENSION',
      sponsored: true,
      cancelled: false,
      status: null,
      votes: [
        {
          voter: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
          weight: '2000000000000000000000',
          vote: true
        },
        {
          voter: '0xd0d827c41af7bf2e52d1842134d5299ba7d6efc4',
          weight: '1000000000000000000000',
          vote: false
        }
      ],
      creationTime: 123,
      votingStarts: 123,
      isReadyToProcessImmediately: true,
      accounts: [PM_CONTRACT],
      dao: {}
    }

    await render({
      ui: <VoteSummaryCard proposal={mockProposal} />
    })

    const forButton = await screen.queryByTestId('for-button')
    await expect(forButton).toBeNull()
    const againstButton = await screen.queryByTestId('against-button')
    await expect(againstButton).toBeNull()
  })

  it('Does not show buttons when proposal type is unknown', async () => {
    jest
      .spyOn(reactDom, 'useParams')
      .mockReturnValue({ chainId: '5', daoId: '0xe237747055b12f4da323bc559ac8d5eb66aac2f7' })
    jest.spyOn(reactDom, 'useLocation').mockReturnValue({
      state: { manager: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439', budget: '101', goals: '', deadline: '123' },
      key: '',
      pathname: '',
      search: '',
      hash: ''
    })
    jest.spyOn(wagmi, 'useAccount').mockReturnValue({
      address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
      isDisconnected: false,
      connector: undefined,
      isConnected: true,
      isReconnecting: false,
      isConnecting: false,
      status: 'connected'
    } as any)

    const mockProposal = {
      serial: 5,
      proposalType: 'SOMETHING_UNKNOWN',
      sponsored: true,
      cancelled: false,
      status: null,
      votes: [
        {
          voter: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
          weight: '2000000000000000000000',
          vote: true
        },
        {
          voter: '0xd0d827c41af7bf2e52d1842134d5299ba7d6efc4',
          weight: '1000000000000000000000',
          vote: false
        }
      ],
      creationTime: 123,
      votingStarts: 123,
      isReadyToProcessImmediately: true,
      accounts: [PM_CONTRACT],
      dao: {}
    }

    await render({
      ui: <VoteSummaryCard proposal={mockProposal} />
    })

    const processButton = await screen.queryByTestId('process-button')
    await expect(processButton).toBeNull()
    const forButton = await screen.queryByTestId('for-button')
    await expect(forButton).toBeNull()
    const againstButton = await screen.queryByTestId('against-button')
    await expect(againstButton).toBeNull()
  })

  it('shows For and Against buttons when voting period is open', async () => {
    jest
      .spyOn(reactDom, 'useParams')
      .mockReturnValue({ chainId: '5', daoId: '0xe237747055b12f4da323bc559ac8d5eb66aac2f7' })
    jest.spyOn(reactDom, 'useLocation').mockReturnValue({
      state: { manager: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439', budget: '101', goals: '', deadline: '123' },
      key: '',
      pathname: '',
      search: '',
      hash: ''
    })
    jest.spyOn(wagmi, 'useAccount').mockReturnValue({
      address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
      isDisconnected: false,
      connector: undefined,
      isConnected: true,
      isReconnecting: false,
      isConnecting: false,
      status: 'connected'
    } as any)

    const mockNow = new Date(2019, 3, 1)
    jest.useFakeTimers().setSystemTime(mockNow)
    const creationTime = Math.floor(mockNow.getTime() / 1000)
    const votingStarts = creationTime

    const mockProposal = {
      serial: 5,
      proposalType: 'EXTENSION',
      sponsored: true,
      cancelled: false,
      status: null,
      votes: [],
      creationTime,
      votingStarts,
      isReadyToProcessImmediately: false,
      accounts: [PM_CONTRACT],
      dao: {
        votingPeriod: 60 * 60 * 24 * 3 // 3 days
      }
    }

    await render({
      ui: <VoteSummaryCard proposal={mockProposal} />
    })

    const processButton = await screen.queryByTestId('process-button')
    await expect(processButton).toBeNull()
    const forButton = await screen.findByTestId('for-button')
    await expect(forButton).toBeVisible()
    const againstButton = await screen.findByTestId('against-button')
    await expect(againstButton).toBeVisible()

    await act(() => {
      waitFor(() => {
        userEvent.click(screen.getByTestId('for-button'))
      })
    })

    let web3Close: Element
    await waitFor(() => {
      const web3Dialog = screen.getByTestId('web3dialog')
      expect(web3Dialog).toBeVisible()
      const web3Submit = within(web3Dialog).getByTestId('web3submit-alert-dialog-title')
      expect(web3Submit).toBeVisible()
      web3Close = within(web3Dialog).getByTestId('close-button')
      expect(web3Close).toBeVisible()
    })

    await act(() => {
      waitFor(() => {
        userEvent.click(web3Close)
      })
    })

    await waitFor(() => {
      expect(screen.queryByTestId('web3dialog')).toBeNull()
    })

    await act(() => {
      waitFor(() => {
        userEvent.click(screen.getByTestId('against-button'))
      })
    })

    await waitFor(() => {
      const web3Dialog = screen.getByTestId('web3dialog')
      expect(web3Dialog).toBeVisible()
      const web3Submit = within(web3Dialog).getByTestId('web3submit-alert-dialog-title')
      expect(web3Submit).toBeVisible()
      web3Close = within(web3Dialog).getByTestId('close-button')
      expect(web3Close).toBeVisible()
    })

    await act(() => {
      waitFor(() => {
        userEvent.click(web3Close)
      })
    })

    await waitFor(() => {
      expect(screen.queryByTestId('web3dialog')).toBeNull()
    })
  })
})
