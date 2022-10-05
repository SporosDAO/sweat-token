import { act, screen, render, waitFor, fireEvent } from '../../../test'
import * as daos from '../../graph/getDAO'
import * as wagmi from 'wagmi'

describe('Project Proposal Page', () => {
  beforeEach(() => {
    const useGetDAO = jest.spyOn(daos, 'useGetDAO')
    useGetDAO.mockImplementation(
      (chainId, daoAddress) =>
        ({
          data: {
            id: daoAddress,
            chainId,
            token: {
              name: 'Some DAO',
              symbol: 'DAO'
            }
          },
          isSuccess: true
        } as any)
    )

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

  it('render project proposal form', async () => {
    render({
      route: '/dao/chain/5/address/0xe237747055b12f4da323bc559ac8d5eb66aac2f7/projects/propose'
    })

    await waitFor(() => {
      expect(screen.getByText('Propose a new project for DAO')).toBeVisible()
      expect(screen.findAllByText('Manager')).toBeTruthy()
      expect(screen.findAllByText('Budget')).toBeTruthy()
      expect(screen.findAllByText('Deadline')).toBeTruthy()
      expect(screen.findAllByText('Goal')).toBeTruthy()
      expect(screen.getByText('Goal Tracking Link')).toBeVisible()
      expect(screen.getByTestId('submit-button')).toBeEnabled()
    })
  })

  it('require project manager to be a DAO member', async () => {
    jest.spyOn(wagmi, `useContractRead`).mockImplementation(({ functionName }) => {
      if (functionName === 'extensions') {
        return {
          isError: false,
          isLoading: false,
          // PM extension already enabled in Kali DAO contract instance
          data: true,
          refetch: jest.fn()
        } as any
      } else if (functionName === 'balanceOf') {
        return {
          isError: false,
          isSuccess: true,
          isLoading: false,
          // proposed project manager is not a DAO member. Has no DAO tokens.
          data: 0,
          refetch: jest.fn()
        } as any
      }
    })

    const { user, getByTestId, getByText } = render({
      route: '/dao/chain/5/address/0xe237747055b12f4da323bc559ac8d5eb66aac2f7/projects/propose'
    })

    act(() => {
      user.click(getByTestId('submit-button'))
    })

    await waitFor(() => {
      expect(getByText('Manager must be an existing token holder.')).toBeVisible()
    })
  })

  it('allow project manager who is a DAO member', async () => {
    jest.spyOn(wagmi, `useContractRead`).mockImplementation(({ functionName }) => {
      if (functionName === 'extensions') {
        return {
          isError: false,
          isLoading: false,
          // PM extension already enabled in Kali DAO contract instance
          data: true,
          refetch: jest.fn()
        } as any
      } else if (functionName === 'balanceOf') {
        return {
          isError: false,
          isSuccess: true,
          isLoading: false,
          // proposed project manager is a DAO member. Has 10 DAO tokens.
          data: 10,
          refetch: jest.fn()
        } as any
      }
    })

    const { user, getByTestId, queryByText } = render({
      route: '/dao/chain/5/address/0xe237747055b12f4da323bc559ac8d5eb66aac2f7/projects/propose'
    })

    act(() => {
      user.click(getByTestId('submit-button'))
    })

    await waitFor(() => {
      expect(queryByText(/Manager must be an existing token holder./i)).toBeNull()
    })
  })

  it('Enable project management extension if not already enabled', async () => {
    jest.spyOn(wagmi, `useContractRead`).mockImplementation(({ functionName }) => {
      if (functionName === 'extensions') {
        return {
          isError: false,
          isLoading: false,
          // PM extension already enabled in Kali DAO contract instance
          data: true,
          refetch: jest.fn()
        } as any
      } else if (functionName === 'balanceOf') {
        return {
          isError: false,
          isSuccess: true,
          isLoading: false,
          // proposed project manager is a DAO member. Has 10 DAO tokens.
          data: 10,
          refetch: jest.fn()
        } as any
      }
    })
    // jest.mock('../../components/Web3SubmitDialog')
    const { user, getByTestId } = render({
      route: '/dao/chain/5/address/0xe237747055b12f4da323bc559ac8d5eb66aac2f7/projects/propose'
    })
    act(() => {
      // populate form with a valid proposal
      const manager = getByTestId('manager').querySelector('input')
      expect(manager).toBeInTheDocument()
      fireEvent.change(manager as Element, { target: { value: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439' } })
      expect(manager?.value).toBe('0xf952a72F39c5Fa22a443200AbE7835128bCb7439')

      const budget = getByTestId('budget').querySelector('input')
      expect(budget).toBeInTheDocument()
      fireEvent.change(budget as Element, { target: { value: '100' } })
      expect(budget?.value).toBe('100')

      const defaultDeadline = new Date() // Now
      defaultDeadline.setDate(defaultDeadline.getDate() + 30) // Set now + 30 days as the new date
      const deadlineInputVaue = defaultDeadline.toISOString().split('T')[0]
      const deadlineInput = getByTestId('deadline').querySelector('input')
      expect(deadlineInput).toBeInTheDocument()
      fireEvent.change(deadlineInput as Element, { target: { value: deadlineInputVaue } })
      expect(deadlineInput?.value).toBe(deadlineInputVaue)

      const goalTitle = getByTestId('goalTitle').querySelector('input')
      expect(goalTitle).toBeInTheDocument()
      fireEvent.change(goalTitle as Element, {
        target: { value: '100% test coverage' }
      })
      expect(goalTitle?.value).toBe('100% test coverage')

      const goalLink = getByTestId('goalLink').querySelector('input')
      expect(goalLink).toBeInTheDocument()
      fireEvent.change(goalLink as Element, {
        target: { value: 'https://github.com/SporosDAO/sweat-token/issues/80' }
      })
      expect(goalLink?.value).toBe('https://github.com/SporosDAO/sweat-token/issues/80')

      // submit proposal
      user.click(getByTestId('submit-button'))
    })

    // check if smart contract input is correct
    await waitFor(() => {
      const web3Submit = screen.getByTestId('web3submit-alert-dialog-title')
      expect(web3Submit).toBeVisible()
    })

    //screen.debug(undefined, 1000000)

    await waitFor(() => expect(screen.getByText(/transaction successfully submitted/i)).toBeInTheDocument())

    await expect(wagmi.usePrepareContractWrite).toHaveBeenCalledWith(
      expect.objectContaining({
        addressOrName: '0xe237747055b12f4da323bc559ac8d5eb66aac2f7', // DAO address
        args: [
          9,
          expect.anything(),
          ['0x9f0ad778385a2c688533958c6ada56f201ffc246'], // PM contract address
          [1], // TOGGLE_EXTENSION_AVAILABILITY == 1
          [expect.anything()]
        ],
        chainId: expect.any(Number),
        contractInterface: expect.anything()
      })
    )
  })
})
